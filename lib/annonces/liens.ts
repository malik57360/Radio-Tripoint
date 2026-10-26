/**
 * Adresses du site des Petites annonces (annonces.radio-tripoint-officiel.fr).
 * Sur ce site, les pages vivent à la racine (« /deposer », « /emploi/… ») ;
 * le proxy les sert depuis app/petites-annonces. Le site de la radio, les
 * e-mails et Stripe utilisent l'adresse complète.
 */
export const URL_ANNONCES = (
  process.env.NEXT_PUBLIC_ANNONCES_URL ?? "https://annonces.radio-tripoint-officiel.fr"
).replace(/\/$/, "")

/**
 * Lien « Annonces » du menu, du menu mobile et du pied de page du site de la
 * radio : affiché ou masqué depuis le tableau de bord (Petites annonces ›
 * Pilotage), sans redéployer. Masqué, le site des annonces reste joignable
 * par son adresse.
 */
export const avecAnnonces = <T extends { href: string }>(liste: T[], visible: boolean) =>
  visible ? liste : liste.filter((l) => l.href !== URL_ANNONCES)

/** Chemin du site des annonces → adresse complète. */
export const lienAnnonces = (chemin = "/") => `${URL_ANNONCES}${chemin === "/" ? "" : chemin}`
