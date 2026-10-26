import { compteConnecte } from "@/lib/annonces/comptes"
import { totalNonLus } from "@/lib/annonces/discussions"

/** Messages non lus du compte connecté : la pastille de l'onglet Messages de l'en-tête. */
export const dynamic = "force-dynamic"

export async function GET() {
  const c = await compteConnecte()
  const n = c ? await totalNonLus(c.id) : 0
  return Response.json({ connecte: !!c, n }, { headers: { "Cache-Control": "no-store" } })
}
