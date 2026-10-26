import { redirect } from "next/navigation"
import { compteConnecte } from "@/lib/annonces/comptes"
import { lireAlertes, modifierAlerte } from "@/lib/annonces/espace"
import { versParams } from "@/lib/annonces/recherche"

/** « Voir les annonces » d'une alerte : note la visite (compteur « nouvelles ») et ouvre la recherche. */
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const c = await compteConnecte()
  if (!c) redirect("/connexion?suite=/mon-espace/alertes")
  const id = new URL(request.url).searchParams.get("id") ?? ""
  const a = (await lireAlertes(c.id)).find((x) => x.id === id)
  if (!a) redirect("/mon-espace/alertes")
  await modifierAlerte(c.id, a.id, { vuLe: Date.now() })
  const { categorie, ...reste } = a.filtres
  const p = versParams(reste).toString()
  redirect(`${categorie ? `/${categorie}` : "/"}${p ? `?${p}` : "?voir=tout"}`)
}
