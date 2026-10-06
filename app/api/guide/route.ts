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
const MAX_MESSAGES = 16
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
  "\n\nMODE CONVERSATION VOCALE (prioritaire sur tout le reste) : c'est une vraie conversation à voix haute, comme au téléphone avec un ami. Réponds comme un humain, du tac au tac, et très court : une seule phrase la plupart du temps, deux au maximum, trois seulement si on te demande une information précise. Une salutation ou du bavardage appelle une réponse courte qui relance, et rien d'autre : « Salut, ça va ? » → « Ça va super, et toi ? Tu fais quoi de beau ? ». Ne présente jamais la radio, l'agenda ou la météo si on ne te les demande pas. Pas de liste, pas de titre, pas de Markdown, pas d'adresse web, pas d'émojis. Écris les nombres et les heures comme on les dit. Tutoie si l'utilisateur te tutoie. Ton : chaleureux, spontané, un peu taquin."
const CONSIGNE_PHOTO =
  "\n\nPHOTOS : l'utilisateur peut t'envoyer une photo. Décris ce que tu vois vraiment et réponds à sa question. Si tu n'es pas sûr de ce que montre la photo, dis-le. N'identifie jamais une personne à partir de son visage."

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
    partial_json?: string
    citation?: { url?: string; title?: string }
  }
  error?: { type?: string }
}

const json = (corps: object, status = 200) =>
  Response.json(corps, { status, headers: { "Cache-Control": "no-store" } })

function valider(brut: unknown): Message[] | null {
  if (!Array.isArray(brut) || brut.length === 0 || brut.length > MAX_MESSAGES * 2) return null
  const liste: Message[] = []
  for (const m of brut) {
    if (!m || typeof m !== "object") return null
    const { role, content } = m as Record<string, unknown>
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null
    const texte = content.trim().slice(0, role === "user" ? MAX_CARACTERES : 6000)
    if (!texte) continue
    liste.push({ role, content: texte })
  }
  // L'API exige d'ouvrir et de finir sur l'utilisateur.
  while (liste.length && liste[0].role !== "user") liste.shift()
  if (!liste.length || liste[liste.length - 1].role !== "user") return null
  return liste.slice(-MAX_MESSAGES)
}

export async function POST(request: Request) {
  let corps: { messages?: unknown; langue?: unknown; image?: unknown; oral?: unknown }
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
  const { fixe, variable } = await consignesGuide(l)

  // En appel vocal, chaque seconde compte : pas de réflexion entre les
  // outils, une réponse courte, une seule recherche web au plus. Si l'API
  // refuse ce réglage (400), on retombe sur le réglage normal plus bas.
  const appeler = (conversation: unknown[], rapide = false) =>
    fetch(cible.url, {
      method: "POST",
      headers: {
        ...cible.entetes,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: cible.modele,
        // Sonnet 5.5 réfléchit toujours avant de répondre, et cette réflexion
        // compte dans max_tokens : à 1 500, réflexion + recherche web
        // épuisaient le plafond avant le premier mot (arrêt max_tokens,
        // Tripo « indisponible »). Effort bas : c'est une conversation.
        max_tokens: rapide ? 1500 : 8000,
        output_config: { effort: "low" },
        ...(rapide ? { thinking: { type: "between_tools" } } : {}),
        stream: true,
        system: [
          { type: "text", text: fixe, cache_control: { type: "ephemeral" } },
          { type: "text", text: variable + CONSIGNE_PHOTO + (oral ? CONSIGNE_ORALE : "") },
        ],
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search",
            max_uses: rapide ? 1 : 4,
            user_location: {
              type: "approximate",
              city: "Sierck-les-Bains",
              region: "Grand Est",
              country: "FR",
              timezone: "Europe/Paris",
            },
          },
        ],
        messages: conversation,
      }),
      signal: AbortSignal.timeout(55_000),
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

  let rapide = oral
  let premier = await appeler(conversationInitiale, rapide)
  if (rapide && premier && premier.status === 400) {
    rapide = false
    const detail = (await premier.text().catch(() => "")).slice(0, 300)
    console.error(`[guide] réglage rapide refusé, réglage normal : ${detail}`)
    premier = await appeler(conversationInitiale)
  }
  if (!premier || !premier.ok || !premier.body) {
    // Message d'erreur de la passerelle seulement (jamais la conversation).
    const detail = premier ? (await premier.text().catch(() => "")).slice(0, 300) : ""
    console.error(`[guide] passerelle indisponible (${premier?.status ?? "réseau"}) ${detail}`)
    return json({ erreur: "indisponible" }, 502)
  }

  const encodeur = new TextEncoder()
  const decodeur = new TextDecoder()
  const vues = new Set<string>()
  let lecteurCourant: ReadableStreamDefaultReader<Uint8Array> | null = null

  const flux = new ReadableStream<Uint8Array>({
    async start(ctrl) {
      const envoyer = (o: object) => ctrl.enqueue(encodeur.encode(JSON.stringify(o) + "\n"))
      let conversation: unknown[] = conversationInitiale
      let reponse: Response | null = premier
      try {
        // La recherche web peut « mettre en pause » le tour (stop_reason
        // pause_turn) : on renvoie alors le début de réponse pour qu'il
        // reprenne, deux fois au plus.
        for (let tour = 0; tour < 3 && reponse?.body; tour++) {
          const lecteur = reponse.body.getReader()
          lecteurCourant = lecteur
          // Blocs de la réponse, reconstitués pour une éventuelle reprise.
          const blocs: Record<string, unknown>[] = []
          const entreesOutil = new Map<number, string>()
          let arret = ""
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
                  if (entree.query)
                    envoyer({ t: "recherche", v: String(entree.query).slice(0, 120) })
                } catch {
                  /* entrée incomplète : on n'affiche rien */
                }
                entreesOutil.delete(n)
              } else if (ev.type === "message_delta") {
                arret = ev.delta?.stop_reason ?? arret
              } else if (ev.type === "error") {
                console.error("[guide] erreur de flux :", ev.error?.type)
                envoyer({ t: "erreur", v: "flux" })
              }
            }
          }
          if (arret !== "pause_turn") {
            if (arret && arret !== "end_turn") console.error(`[guide] arrêt : ${arret}`)
            break
          }
          conversation = [...conversation, { role: "assistant", content: blocs.filter(Boolean) }]
          reponse = await appeler(conversation, rapide)
          if (!reponse?.ok) {
            console.error(`[guide] reprise impossible (${reponse?.status ?? "réseau"})`)
            break
          }
        }
        envoyer({ t: "fin" })
      } catch {
        envoyer({ t: "erreur", v: "coupure" })
      } finally {
        ctrl.close()
      }
    },
    cancel() {
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
