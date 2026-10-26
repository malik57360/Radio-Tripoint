import { compteConnecte } from "@/lib/annonces/comptes"
import { idsFavoris } from "@/lib/annonces/espace"

/** Les favoris du compte connecté, pour allumer les cœurs des pages (mises en cache, communes à tous). */
export const dynamic = "force-dynamic"

export async function GET() {
  const c = await compteConnecte()
  if (!c) return Response.json({ connecte: false, ids: [] })
  const ids = (await idsFavoris(c.id)).map((f) => f.id)
  return Response.json({ connecte: true, ids }, { headers: { "Cache-Control": "no-store" } })
}
