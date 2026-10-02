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
  let corps: { messages?: unknown; langue?: unknown }
  try {
    corps = await request.json()
  } catch {
    return json({ erreur: "requete" }, 400)
  }
  const l: Langue = estLangue(corps.langue) ? corps.langue : "fr"
  const messages = valider(corps.messages)
  if (!messages) return json({ erreur: "requete" }, 400)

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue"
  const cle = createHash("sha256").update(`guide:${ip}`).digest("hex").slice(0, 24)
  if (!autoriser(cle, 20, 10 * 60 * 1000)) return json({ erreur: "debit" }, 429)

  const cible = acces(request)
  if (!cible) return json({ erreur: "non-configure" }, 503)
  await compter("tripo")

  // Partie fixe mise en cache chez Anthropic ; la partie variable (date,
  // agenda, langue) la suit.
  const { fixe, variable } = await consignesGuide(l)

  const appeler = (conversation: unknown[]) =>
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
        max_tokens: 8000,
        output_config: { effort: "low" },
        stream: true,
        system: [
          { type: "text", text: fixe, cache_control: { type: "ephemeral" } },
          { type: "text", text: variable },
        ],
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search",
            max_uses: 4,
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

  const premier = await appeler(messages)
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
      let conversation: unknown[] = messages
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
          reponse = await appeler(conversation)
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
