/**
 * Adresses du site des Petites annonces (annonces.radio-tripoint-officiel.fr).
 * Sur ce site, les pages vivent à la racine (« /deposer », « /emploi/… ») ;
 * le proxy les sert depuis app/petites-annonces. Le site de la radio, les
 * e-mails et Stripe utilisent l'adresse complète.
 */
export const URL_ANNONCES = (
  process.env.NEXT_PUBLIC_ANNONCES_URL ?? "https://annonces.radio-tripoint-officiel.fr"
).replace(/\/$/, "")

/** Chemin du site des annonces → adresse complète. */
export const lienAnnonces = (chemin = "/") => `${URL_ANNONCES}${chemin === "/" ? "" : chemin}`
