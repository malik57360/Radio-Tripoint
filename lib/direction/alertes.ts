import "server-only"
import { cache } from "react"
import {
  alertes,
  audience,
  contenu,
  direct,
  engagement,
  radio,
  technique,
  type Periode,
} from "./donnees"

/**
 * Chargements mis en commun le temps d'une requête : le cadre (pour le
 * nombre d'alertes) et la page lisent les mêmes sondes sans les relancer.
 */
export const chargerTechnique = cache(technique)
export const chargerRadio = cache(radio)
export const chargerEngagement = cache(engagement)
export const chargerContenu = cache(contenu)
export const chargerDirect = cache(direct)
export const chargerAudience = cache((jours: Periode) => audience(jours))

export const chargerAlertes = cache(async () => {
  const [tech, rad, eng] = await Promise.all([
    chargerTechnique(),
    chargerRadio(),
    chargerEngagement(),
  ])
  const perdus = eng && !eng.erreur ? eng.totaux.formPerdu30 : 0
  return alertes(tech, rad, perdus)
})

export const compterAlertes = async () => (await chargerAlertes()).length
