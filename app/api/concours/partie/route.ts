import { createHash } from "node:crypto"
import { autoriser } from "@/lib/formulaires/limiteur"
import { concoursOuvert, ouvrirPartie } from "@/lib/concours/serveur"

/**
 * Jeu concours : ouvre une partie (graine + heure de départ notées côté
 * serveur). Concours fini ou stockage absent : le jeu se joue quand même
 * dans le navigateur, mais hors classement.
 */
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue"
  const cle = createHash("sha256").update(`concours:${ip}`).digest("hex").slice(0, 24)
  if (!(await autoriser(cle, 60, 10 * 60 * 1000)))
    return Response.json({ erreur: "trop" }, { status: 429 })
  if (!concoursOuvert()) return Response.json({ erreur: "ferme" }, { status: 410 })
  const partie = await ouvrirPartie()
  if (!partie) return Response.json({ erreur: "stockage" }, { status: 503 })
  return Response.json(partie, { headers: { "Cache-Control": "no-store" } })
}
