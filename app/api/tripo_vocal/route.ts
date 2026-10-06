import { createHash } from "node:crypto"
import { autoriser } from "@/lib/formulaires/limiteur"
import { compter } from "@/lib/direction/redis"

/**
 * Voix « humaine » de Tripo (heytripo.fr) : ElevenLabs, modèle multilingue.
 * S'active seule quand ELEVENLABS_API_KEY est posée dans Vercel ; la voix
 * se choisit avec ELEVENLABS_VOICE_ID. Sans clé : 503, et le navigateur
 * se rabat sur la voix Piper des vidéos (/api/tripo_voix).
 * POST {"texte": "..."} → audio/mpeg. Rien n'est enregistré.
 */
export const maxDuration = 30

const MAX_TEXTE = 900
const VOIX_PAR_DEFAUT = "21m00Tcm4TlvDq8ikWAM"

export async function POST(request: Request) {
  const cle = (process.env.ELEVENLABS_API_KEY ?? "").trim()
  if (!cle || cle.startsWith("A_REMPLACER"))
    return Response.json({ erreur: "non-configure" }, { status: 503 })

  let texte = ""
  try {
    const d = (await request.json()) as { texte?: unknown }
    texte = String(d.texte ?? "").trim().slice(0, MAX_TEXTE)
  } catch {
    return Response.json({ erreur: "requete" }, { status: 400 })
  }
  if (!texte) return Response.json({ erreur: "vide" }, { status: 400 })

  // Chaque seconde de voix se paie : 30 messages vocaux / 10 min / IP.
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue"
  const id = createHash("sha256").update(`vocal:${ip}`).digest("hex").slice(0, 24)
  if (!autoriser(id, 30, 10 * 60 * 1000)) return Response.json({ erreur: "debit" }, { status: 429 })

  const voix = (process.env.ELEVENLABS_VOICE_ID ?? "").trim() || VOIX_PAR_DEFAUT
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voix)}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": cle, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({
        text: texte,
        model_id: process.env.ELEVENLABS_MODELE || "eleven_multilingual_v2",
        voice_settings: { stability: 0.4, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
      }),
      signal: AbortSignal.timeout(25_000),
    },
  ).catch(() => null)

  if (!r?.ok || !r.body) {
    console.error(`[tripo_vocal] ElevenLabs indisponible (${r?.status ?? "réseau"})`)
    return Response.json({ erreur: "indisponible" }, { status: 502 })
  }
  await compter("tripo_vocal")
  return new Response(r.body, {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
  })
}
