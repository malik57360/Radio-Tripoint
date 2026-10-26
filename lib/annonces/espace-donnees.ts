import "server-only"
import { cache } from "react"
import { annoncesDuCompte, annoncesPubliques } from "./annonces"
import { compteConnecte } from "./comptes"
import { idsFavoris, lireAlertes, lireBoite } from "./espace"
import { filtrer } from "./recherche"
import { STATUTS_ACTIFS } from "./types"

/**
 * Lectures de « Mon espace » mises en commun le temps d'une requête : le
 * cadre (menu et compteurs) et la page lisent les mêmes données sans
 * interroger Redis deux fois.
 */
export const compteEspace = cache(compteConnecte)
export const mesAnnonces = cache((compte: string) => annoncesDuCompte(compte))
export const maBoite = cache((compte: string) => lireBoite(compte))
export const mesFavoris = cache((compte: string) => idsFavoris(compte))
export const enLigne = cache(() => annoncesPubliques())

/** Les alertes, chacune avec ses résultats du moment et ce qui est paru depuis la dernière visite. */
export const mesAlertes = cache(async (compte: string) => {
  const [alertes, liste] = await Promise.all([lireAlertes(compte), enLigne()])
  return alertes.map((a) => {
    const trouvees = filtrer(liste, a.filtres)
    return {
      ...a,
      total: trouvees.length,
      nouvelles: trouvees.filter((x) => x.publieeLe > a.vuLe).length,
    }
  })
})

export const compteurs = cache(async (compte: string) => {
  const [annonces, boite, favoris, alertes] = await Promise.all([
    mesAnnonces(compte),
    maBoite(compte),
    mesFavoris(compte),
    mesAlertes(compte),
  ])
  return {
    annonces: annonces.filter((a) => STATUTS_ACTIFS.includes(a.statut)).length,
    messages: boite.filter((m) => m.sens === "recu" && !m.lu).length,
    favoris: favoris.length,
    alertes: alertes.reduce((n, a) => n + a.nouvelles, 0),
  }
})
