import { compteConnecte } from "@/lib/annonces/comptes"
import { nonLus } from "@/lib/annonces/espace"

/** Messages non lus du compte connecté : la pastille de l'en-tête et du menu de « Mon espace ». */
export const dynamic = "force-dynamic"

export async function GET() {
  const c = await compteConnecte()
  const n = c ? await nonLus(c.id) : 0
  return Response.json({ connecte: !!c, n }, { headers: { "Cache-Control": "no-store" } })
}
