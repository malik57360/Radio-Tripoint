import { annoncesDuCompte } from "@/lib/annonces/annonces"
import { listerCommandes } from "@/lib/annonces/commandes"
import { compteConnecte } from "@/lib/annonces/comptes"
import { idsFavoris, lireActivite, lireAlertes, lireBoite } from "@/lib/annonces/espace"
import { autoriser } from "@/lib/annonces/limiteur"

/**
 * « Télécharger mes données » (droit d'accès et de portabilité, RGPD) :
 * tout ce que le site garde sur le compte, en un fichier JSON. Le mot de
 * passe n'y figure pas (seul son haché est rangé, et il ne sort jamais).
 */
export const dynamic = "force-dynamic"

export async function GET() {
  const c = await compteConnecte()
  if (!c) return new Response("Connectez-vous d'abord.", { status: 401 })
  if (!(await autoriser("export", c.id, 5, 3600)))
    return new Response("Réessayez dans une heure.", { status: 429 })
  const { hache: _hache, ...compte } = c
  void _hache
  const [annonces, commandes, favoris, messages, alertes, activite] = await Promise.all([
    annoncesDuCompte(c.id),
    listerCommandes(2000).then((l) => l.filter((x) => x.compte === c.id)),
    idsFavoris(c.id),
    lireBoite(c.id),
    lireAlertes(c.id),
    lireActivite(c.id, 100),
  ])
  const donnees = {
    exporteLe: new Date().toISOString(),
    service: "Les Petites Annonces du Tripoint · Radio Tripoint",
    compte,
    annonces,
    paiements: commandes,
    favoris,
    messages,
    alertes,
    activite,
  }
  return new Response(JSON.stringify(donnees, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="mes-donnees-petites-annonces.json"`,
      "Cache-Control": "no-store",
    },
  })
}
