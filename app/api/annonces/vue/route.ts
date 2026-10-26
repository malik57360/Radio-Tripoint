import { annoncePublique, lireAnnonce } from "@/lib/annonces/annonces"
import { compteConnecte } from "@/lib/annonces/comptes"
import { compterVue } from "@/lib/annonces/espace"
import { ipVisiteur } from "@/lib/annonces/limiteur"
import { idAnnonceValide } from "@/lib/annonces/types"

/**
 * Une vue de fiche, envoyée par le navigateur (les robots qui n'exécutent
 * pas le JavaScript ne comptent pas). Un même visiteur ne compte qu'une
 * fois par demi-heure ; l'annonceur qui regarde sa propre annonce, jamais.
 */
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const corps = (await request.json().catch(() => null)) as { id?: unknown } | null
  const id = corps?.id
  if (!idAnnonceValide(id)) return new Response(null, { status: 400 })
  if (!(await annoncePublique(id))) return new Response(null, { status: 404 })
  const c = await compteConnecte()
  if (c && (await lireAnnonce(id))?.compte === c.id) return new Response(null, { status: 204 })
  await compterVue(id, c?.id ?? (await ipVisiteur()))
  return new Response(null, { status: 204 })
}
