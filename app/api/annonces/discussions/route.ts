import { compteConnecte } from "@/lib/annonces/comptes"
import { mesDiscussions, pourListe } from "@/lib/annonces/discussions"

/** Les discussions du compte connecté, pour rafraîchir la liste de la messagerie. */
export const dynamic = "force-dynamic"

export async function GET() {
  const c = await compteConnecte()
  if (!c) return Response.json({ connecte: false, liste: [] }, { status: 401 })
  const liste = (await mesDiscussions(c.id)).map((d) => pourListe(d, c.id))
  return Response.json({ connecte: true, liste }, { headers: { "Cache-Control": "no-store" } })
}
