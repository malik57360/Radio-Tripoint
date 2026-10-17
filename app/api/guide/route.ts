import { compter } from "@/lib/direction/redis"
import { createHash } from "node:crypto"
import { autoriser } from "@/lib/formulaires/limiteur"
import { consignesGuide } from "@/lib/guide/consignes"
import { estLangue, type Langue } from "@/lib/i18n/langues"

/**
 * Guide des Trois Frontières. Relaie la conversation vers Claude (API
 * Messages d'Anthropic), directement ou via Vercel AI Gateway, avec la
 * recherche web, et renvoie un flux NDJSON simplifié au navigateur :
 *   {"t":"texte","v":"…"}         morceau de réponse
 *   {"t":"recherche","v":"…"}     le guide cherche sur le web
 *   {"t":"source","url","titre"}  source citée
 *   {"t":"fin"} | {"t":"erreur","v":"…"}
 * Rien de la conversation n'est écrit dans les journaux.
 */
export const maxDuration = 60

/**
 * Deux accès possibles à Claude, même API Messages :
 * - clé Anthropic (ANTHROPIC_API_KEY) : appel direct à api.anthropic.com ;
 * - sinon Vercel AI Gateway, authentifié par le jeton OIDC du projet.
 */
function acces(request: Request) {
  const cleAnthropic = process.env.ANTHROPIC_API_KEY
  if (cleAnthropic)
    return {
      url: process.env.GUIDE_PASSERELLE || "https://api.anthropic.com/v1/messages",
      modele: process.env.GUIDE_MODELE || "claude-sonnet-5-5",
      entetes: { "x-api-key": cleAnthropic } as Record<string, string>,
    }
  const jeton =
    process.env.AI_GATEWAY_API_KEY ||
    request.headers.get("x-vercel-oidc-token") ||
    process.env.VERCEL_OIDC_TOKEN
  if (!jeton) return null
  return {
    url: process.env.GUIDE_PASSERELLE || "https://ai-gateway.vercel.sh/v1/messages",
    modele: process.env.GUIDE_MODELE || "anthropic/claude-sonnet-5.5",
    entetes: { Authorization: `Bearer ${jeton}` } as Record<string, string>,
  }
}
/** Mémoire de la conversation : les 24 derniers messages (12 échanges). */
const MAX_MESSAGES = 24
const MAX_CARACTERES = 1500
/** Photo jointe au dernier message (heytripo.fr) : réduite dans le navigateur, ≈ 2 Mo max. */
const MAX_IMAGE_B64 = 2_800_000
const TYPES_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"]

type Image = { media_type: string; data: string }

function validerImage(brut: unknown): Image | null | false {
  if (brut === undefined || brut === null) return null
  if (typeof brut !== "object") return false
  const { media_type, data } = brut as Record<string, unknown>
  if (typeof media_type !== "string" || !TYPES_IMAGE.includes(media_type)) return false
  if (typeof data !== "string" || data.length > MAX_IMAGE_B64 || !/^[A-Za-z0-9+/=]+$/.test(data))
    return false
  return { media_type, data }
}

/** Consignes ajoutées selon l'usage : réponse lue à voix haute, photo jointe. */
const CONSIGNE_ORALE =
  "\n\nMODE VOCAL : ta réponse sera lue à voix haute. Réponds en 2 à 4 phrases courtes et naturelles, sans liste, sans titre, sans Markdown, sans URL écrite en toutes lettres (dis plutôt « sur le site de Radio Tripoint »)."
/** Appel vocal (heytripo.fr) : vraie conversation au téléphone, réponses du tac au tac. */
const CONSIGNE_APPEL =
  "\n\nAPPEL VOCAL (prioritaire sur tout le reste) : c'est une vraie conversation à voix haute, comme au téléphone avec un ami. Réponds du tac au tac et très court : une seule phrase la plupart du temps, deux au maximum, trois seulement si on te demande une information précise. Une salutation ou du bavardage appelle une réponse courte qui relance, et rien d'autre : « Salut, ça va ? » → « Ça va super, et toi ? Tu fais quoi de beau ? ». Ne présente jamais la radio, l'agenda ou la météo si on ne te les demande pas. Pas de liste, pas de titre, pas de Markdown, pas d'adresse web, pas d'émojis. Écris les nombres et les heures comme on les dit. Tutoie si l'utilisateur te tutoie. Ce que dit la personne vient d'une reconnaissance vocale, sans ponctuation et parfois avec des mots mal reconnus, surtout les noms propres (« tripot » pour Tripo, « sierque » pour Sierck…) : comprends le sens le plus probable sans le faire remarquer ; si c'est vraiment incompréhensible, demande simplement de répéter. Ne fais une recherche web que si c'est indispensable."
const CONSIGNE_PHOTO =
  "\n\nPHOTOS : l'utilisateur peut t'envoyer une photo. Décris ce que tu vois vraiment et réponds à sa question. Si tu n'es pas sûr de ce que montre la photo, dis-le. N'identifie jamais une personne à partir de son visage."

const CONSIGNE_SECOURS =
  "\n\nRÉPONSE IMMÉDIATE : la recherche web n'a pas abouti à temps pour ce message. Réponds tout de suite avec ta mémoire et tes connaissances sûres, sans dire que tu vas chercher. Si un point demande une vérification récente, dis-le simplement et propose de réessayer un peu plus tard."

type Message = { role: "user" | "assistant"; content: string }

/** Ce qui nous intéresse dans les évènements SSE de l'API Messages. */
type EvenementSSE = {
  type?: string
  index?: number
  content_block?: Record<string, unknown> & { type?: string }
  delta?: {
    type?: string
    stop_reason?: string
    text?: string
    thinking?: string
    signature?: string
    partial_json?: string
    citation?: { url?: string; title?: string }
  }
  error?: { type?: string }
}

const json = (corps: object, status = 200) =>
  Response.json(corps, { status, headers: { "Cache-Control": "no-store" } })

function valider(brut: unknown): Message[] | null {
  if (!Array.isArray(brut) || brut.length === 0) return null
  // Une longue discussion n'est pas une erreur : on garde la fin.
  const liste: Message[] = []
  for (const m of brut.slice(-MAX_MESSAGES * 2)) {
    if (!m || typeof m !== "object") return null
    const { role, content } = m as Record<string, unknown>
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null
    const texte = content.trim().slice(0, role === "user" ? MAX_CARACTERES : 6000)
    if (!texte) continue
    liste.push({ role, content: texte })
  }
  // L'API exige d'ouvrir et de finir sur l'utilisateur : on coupe d'abord,
  // puis on retire une éventuelle réponse de Tripo restée en tête.
  const fin = liste.slice(-MAX_MESSAGES)
  while (fin.length && fin[0].role !== "user") fin.shift()
  if (!fin.length || fin[fin.length - 1].role !== "user") return null
  return fin
}

export async function POST(request: Request) {
  let corps: {
    messages?: unknown
    langue?: unknown
    image?: unknown
    oral?: unknown
    appel?: unknown
  }
  try {
    corps = await request.json()
  } catch {
    return json({ erreur: "requete" }, 400)
  }
  const l: Langue = estLangue(corps.langue) ? corps.langue : "fr"
  const messages = valider(corps.messages)
  if (!messages) return json({ erreur: "requete" }, 400)
  const image = validerImage(corps.image)
  if (image === false) return json({ erreur: "image" }, 400)
  const oral = corps.oral === true
  const appel = corps.appel === true

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue"
  const cle = createHash("sha256").update(`guide:${ip}`).digest("hex").slice(0, 24)
  if (!autoriser(cle, 20, 10 * 60 * 1000)) return json({ erreur: "debit" }, 429)
  // Une photo coûte bien plus qu'un message : 8 par tranche de 10 minutes.
  if (image && !autoriser(`${cle}:img`, 8, 10 * 60 * 1000)) return json({ erreur: "debit" }, 429)

  const cible = acces(request)
  if (!cible) return json({ erreur: "non-configure" }, 503)
  await compter("tripo")
  if (image) await compter("tripo_photo")

  // Partie fixe mise en cache chez Anthropic ; la partie variable (date,
  // agenda, langue) la suit.
  // La question (et la précédente, pour « et lui ? ») sert à retrouver les
  // articles du site qui en parlent.
  const question = messages
    .filter((m) => m.role === "user")
    .slice(-2)
    .map((m) => m.content)
    .join("\n")
  const { fixe, variable } = await consignesGuide(l, question)

  // Délais : la fonction a 60 s. Sans un mot de réponse au bout de 35 s
  // (recherches trop longues), on coupe et Tripo répond de mémoire, sans
  // recherche, plutôt que de laisser la personne devant une erreur.
  const debutRequete = Date.now()
  const principal = new AbortController()
  let texteEnvoye = false
  // En appel vocal, la personne attend au bout du fil : 15 s au plus.
  const delaiRecherche = setTimeout(
    () => {
      if (!texteEnvoye) principal.abort()
    },
    appel ? 15_000 : 35_000,
  )
  const delaiTotal = setTimeout(() => principal.abort(), 55_000)
  const finDesDelais = () => {
    clearTimeout(delaiRecherche)
    clearTimeout(delaiTotal)
  }

  // Appel vocal : pas de réflexion avant de répondre (« between_tools »),
  // réponse courte, une recherche au plus. Si l'API refuse ce réglage (400),
  // on reprend le normal.
  let rapide = appel
  const corpsRequete = (conversation: unknown[], avecRecherche: boolean) => ({
    model: cible.modele,
    // Sonnet 5.5 réfléchit toujours avant de répondre, et cette réflexion
    // compte dans max_tokens : à 1 500, réflexion + recherche web
    // épuisaient le plafond avant le premier mot (arrêt max_tokens,
    // Tripo « indisponible »). Effort bas : c'est une conversation.
    max_tokens: 8000,
    output_config: { effort: "low" },
    ...(rapide ? { thinking: { type: "between_tools" } } : {}),
    stream: true,
    system: [
      { type: "text", text: fixe, cache_control: { type: "ephemeral" } },
      {
        type: "text",
        text:
          variable +
          CONSIGNE_PHOTO +
          (appel ? CONSIGNE_APPEL : oral ? CONSIGNE_ORALE : "") +
          (avecRecherche ? "" : CONSIGNE_SECOURS),
      },
    ],
    ...(avecRecherche
      ? {
          tools: [
            {
              type: "web_search_20250305",
              name: "web_search",
              max_uses: rapide ? 1 : 3,
              user_location: {
                type: "approximate",
                city: "Sierck-les-Bains",
                region: "Grand Est",
                country: "FR",
                timezone: "Europe/Paris",
              },
            },
          ],
        }
      : {}),
    messages: conversation,
  })

  const appeler = (conversation: unknown[], avecRecherche = true, signal = principal.signal) =>
    fetch(cible.url, {
      method: "POST",
      headers: {
        ...cible.entetes,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(corpsRequete(conversation, avecRecherche)),
      signal,
    }).catch(() => null)

  // La photo accompagne le dernier message, et lui seul (l'historique n'en garde pas).
  const derniere = messages[messages.length - 1]
  const conversationInitiale: unknown[] = image
    ? [
        ...messages.slice(0, -1),
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", ...image } },
            { type: "text", text: derniere.content },
          ],
        },
      ]
    : messages

  let premier = await appeler(conversationInitiale)
  if (rapide && premier?.status === 400) {
    rapide = false
    const detail = (await premier.text().catch(() => "")).slice(0, 300)
    console.error(`[guide] réglage rapide refusé, réglage normal : ${detail}`)
    premier = await appeler(conversationInitiale)
  }
  if (!premier || !premier.ok || !premier.body) {
    finDesDelais()
    // Message d'erreur de la passerelle seulement (jamais la conversation).
    const detail = premier ? (await premier.text().catch(() => "")).slice(0, 300) : ""
    console.error(`[guide] passerelle indisponible (${premier?.status ?? "réseau"}) ${detail}`)
    return json({ erreur: "indisponible" }, 502)
  }

  const encodeur = new TextEncoder()
  const decodeur = new TextDecoder()
  const vues = new Set<string>()
  let lecteurCourant: ReadableStreamDefaultReader<Uint8Array> | null = null
  let annule = false

  const flux = new ReadableStream<Uint8Array>({
    async start(ctrl) {
      const envoyer = (o: { t: string } & Record<string, unknown>) => {
        if (o.t === "texte") texteEnvoye = true
        ctrl.enqueue(encodeur.encode(JSON.stringify(o) + "\n"))
      }

      /** Lit une réponse en flux : relaie le texte, reconstitue les blocs. */
      const lire = async (reponse: Response) => {
        const lecteur = reponse.body!.getReader()
        lecteurCourant = lecteur
        // Blocs de la réponse, reconstitués pour une éventuelle reprise.
        const blocs: Record<string, unknown>[] = []
        const entreesOutil = new Map<number, string>()
        let arret = ""
        let erreur = ""
        let tampon = ""
        for (;;) {
          const { done, value } = await lecteur.read()
          if (done) break
          tampon += decodeur.decode(value, { stream: true })
          let i: number
          while ((i = tampon.indexOf("\n\n")) >= 0) {
            const brut = tampon.slice(0, i)
            tampon = tampon.slice(i + 2)
            const ligne = brut.split("\n").find((x) => x.startsWith("data:"))
            if (!ligne) continue
            let ev: EvenementSSE
            try {
              ev = JSON.parse(ligne.slice(5))
            } catch {
              continue
            }
            const n = ev.index ?? -1
            if (ev.type === "content_block_start" && ev.content_block) {
              blocs[n] = structuredClone(ev.content_block)
              if (ev.content_block.type === "server_tool_use") entreesOutil.set(n, "")
            } else if (ev.type === "content_block_delta") {
              const d = ev.delta ?? {}
              const b = blocs[n]
              if (d.type === "text_delta" && d.text) {
                if (b) b.text = String(b.text ?? "") + d.text
                envoyer({ t: "texte", v: d.text })
              } else if (d.type === "thinking_delta" && b) {
                // Réflexion et signature gardées telles quelles : la reprise
                // après une pause de la recherche web doit les renvoyer.
                b.thinking = String(b.thinking ?? "") + (d.thinking ?? "")
              } else if (d.type === "signature_delta" && b) {
                b.signature = d.signature ?? ""
              } else if (d.type === "input_json_delta" && entreesOutil.has(n)) {
                entreesOutil.set(n, (entreesOutil.get(n) ?? "") + (d.partial_json ?? ""))
              } else if (d.type === "citations_delta" && d.citation) {
                if (b) b.citations = [...((b.citations as unknown[]) ?? []), d.citation]
                const { url, title } = d.citation
                if (url && !vues.has(url)) {
                  vues.add(url)
                  envoyer({ t: "source", url, titre: String(title ?? url).slice(0, 140) })
                }
              }
            } else if (ev.type === "content_block_stop" && entreesOutil.has(n)) {
              try {
                const entree = JSON.parse(entreesOutil.get(n) || "{}")
                if (blocs[n]) blocs[n].input = entree
                if (entree.query) envoyer({ t: "recherche", v: String(entree.query).slice(0, 120) })
              } catch {
                /* entrée incomplète : on n'affiche rien */
              }
              entreesOutil.delete(n)
            } else if (ev.type === "message_delta") {
              arret = ev.delta?.stop_reason ?? arret
            } else if (ev.type === "error") {
              erreur = ev.error?.type ?? "flux"
            }
          }
        }
        return { blocs, arret, erreur }
      }

      let conversation: unknown[] = conversationInitiale
      let reponse: Response | null = premier
      let probleme = ""
      try {
        // La recherche web peut « mettre en pause » le tour (stop_reason
        // pause_turn) : on renvoie alors le début de réponse pour qu'il
        // reprenne, deux fois au plus.
        for (let tour = 0; tour < 3 && reponse?.body; tour++) {
          const { blocs, arret, erreur } = await lire(reponse)
          if (erreur) {
            probleme = `erreur de flux ${erreur}`
            break
          }
          if (arret !== "pause_turn") {
            if (arret && arret !== "end_turn") probleme = `arrêt ${arret}`
            break
          }
          conversation = [...conversation, { role: "assistant", content: blocs.filter(Boolean) }]
          reponse = await appeler(conversation)
          if (!reponse?.ok || !reponse.body) {
            probleme = `reprise impossible (${reponse?.status ?? "réseau"})`
            break
          }
        }
      } catch {
        probleme = principal.signal.aborted
          ? `délai dépassé (${Math.round((Date.now() - debutRequete) / 1000)} s)`
          : "coupure"
      }
      finDesDelais()
      if (probleme)
        console.error(`[guide] ${probleme}${texteEnvoye ? "" : " : réponse sans recherche"}`)

      if (annule) return
      // Rien n'est encore parti : Tripo répond de mémoire, sans recherche.
      if (!texteEnvoye) {
        const reste = Math.max(8_000, 58_000 - (Date.now() - debutRequete))
        try {
          const r = await appeler(conversationInitiale, false, AbortSignal.timeout(reste))
          if (r?.ok && r.body) await lire(r)
          else console.error(`[guide] réponse sans recherche impossible (${r?.status ?? "réseau"})`)
        } catch {
          console.error("[guide] réponse sans recherche coupée")
        }
      }
      if (annule) return
      if (!texteEnvoye) envoyer({ t: "erreur", v: "indisponible" })
      envoyer({ t: "fin" })
      ctrl.close()
    },
    cancel() {
      annule = true
      finDesDelais()
      principal.abort()
      lecteurCourant?.cancel().catch(() => {})
    },
  })

  return new Response(flux, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  })
}
