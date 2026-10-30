import { createHash } from "node:crypto"
import { z } from "zod"
import { PAYS, VILLES_MAX } from "@/lib/concours/jeu"
import { enregistrerScore, PSEUDO } from "@/lib/concours/serveur"
import { autoriser } from "@/lib/formulaires/limiteur"

/**
 * Jeu concours : enregistre une partie. Le navigateur envoie ses réponses
 * et ses temps ; le serveur rejoue la partie et calcule lui-même le score.
 */
export const dynamic = "force-dynamic"

z.config({ jitless: true })

const Corps = z.object({
  id: z.uuid(),
  reponses: z.array(z.object({ pays: z.enum(PAYS), ms: z.number().int() })).max(VILLES_MAX),
  pseudo: z.string().trim().regex(PSEUDO),
  email: z.email().max(160),
  consentement: z.literal(true),
})

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue"
  const cle = createHash("sha256").update(`concours-score:${ip}`).digest("hex").slice(0, 24)
  if (!(await autoriser(cle, 30, 10 * 60 * 1000)))
    return Response.json({ erreur: "trop" }, { status: 429 })

  const lu = Corps.safeParse(await request.json().catch(() => null))
  if (!lu.success) {
    const champ = lu.error.issues[0]?.path[0]
    const erreur =
      champ === "pseudo" || champ === "email" || champ === "consentement" ? champ : "invalide"
    return Response.json({ erreur }, { status: 400 })
  }
  const r = await enregistrerScore(lu.data)
  if (!r.ok) {
    const statut = { partie: 409, invalide: 422, ferme: 410, stockage: 503 }[r.erreur]
    return Response.json({ erreur: r.erreur }, { status: statut })
  }
  return Response.json(r, { headers: { "Cache-Control": "no-store" } })
}
