/**
 * Offres des Petites annonces : formules (au dépôt) et options (au dépôt ou
 * plus tard, depuis « Mes annonces »). Fichier sans dépendance serveur : le
 * formulaire affiche le prix, le serveur le recalcule avec les mêmes
 * fonctions et le tarif rangé dans Redis — jamais celui envoyé par le
 * navigateur.
 *
 * DEFAUTS_OFFRES reprend la grille du cahier de cadrage : ce sont des
 * valeurs de départ, que la direction change dans le tableau de bord.
 */

export type CodeOffre =
  | "classique"
  | "pro_standard"
  | "pro_plus"
  | "pro_premium"
  | "plus"
  | "premium"
  | "remontee"
  | "photos"
  | "accueil"
  | "prolongation"
  | "prolongation_pro"

export type Annonceur = "particulier" | "pro"

/**
 * Effet d'une offre sur l'annonce :
 * - categorie : badge « À la une » et place dans le bandeau de sa catégorie ;
 * - renforcee : idem, plus les premières places des résultats ;
 * - accueil : place dans le bandeau « À la une » de l'accueil des annonces.
 */
export type Effet =
  "aucun" | "categorie" | "renforcee" | "accueil" | "remontee" | "photos" | "prolongation"

export interface Offre {
  code: CodeOffre
  nom: string
  description: string
  pour: Annonceur
  genre: "formule" | "option"
  prixCentimes: number
  /** Durée : de l'annonce (formule), de l'effet (option), ou de la prolongation. 0 = immédiat. */
  jours: number
  /** Formule : photos incluses. Option « photos » : photos en plus. */
  photos: number
  effet: Effet
  actif: boolean
}

export const DEFAUTS_OFFRES: Offre[] = [
  {
    code: "classique",
    nom: "Annonce classique",
    description: "Jusqu'à 5 photos, en ligne 30 jours, classement normal.",
    pour: "particulier",
    genre: "formule",
    prixCentimes: 0,
    jours: 30,
    photos: 5,
    effet: "aucun",
    actif: true,
  },
  {
    code: "pro_standard",
    nom: "Pro Standard",
    description: "Jusqu'à 10 photos, coordonnées professionnelles et lien vers votre site.",
    pour: "pro",
    genre: "formule",
    prixCentimes: 990,
    jours: 30,
    photos: 10,
    effet: "aucun",
    actif: true,
  },
  {
    code: "pro_plus",
    nom: "Pro Plus",
    description: "Jusqu'à 15 photos, mise en avant dans la catégorie pendant 30 jours.",
    pour: "pro",
    genre: "formule",
    prixCentimes: 1990,
    jours: 30,
    photos: 15,
    effet: "categorie",
    actif: true,
  },
  {
    code: "pro_premium",
    nom: "Pro Premium",
    description: "Visibilité renforcée pendant 30 jours : premières places des résultats.",
    pour: "pro",
    genre: "formule",
    prixCentimes: 2990,
    jours: 30,
    photos: 15,
    effet: "renforcee",
    actif: true,
  },
  {
    code: "plus",
    nom: "Annonce Plus",
    description: "Badge « À la une » et mise en avant dans la catégorie pendant 7 jours.",
    pour: "particulier",
    genre: "option",
    prixCentimes: 290,
    jours: 7,
    photos: 0,
    effet: "categorie",
    actif: true,
  },
  {
    code: "premium",
    nom: "Premium",
    description:
      "Visibilité renforcée pendant 7 jours : premières places des résultats. Sans garantie de vente.",
    pour: "particulier",
    genre: "option",
    prixCentimes: 590,
    jours: 7,
    photos: 0,
    effet: "renforcee",
    actif: true,
  },
  {
    code: "remontee",
    nom: "Remontée",
    description: "Votre annonce repasse en tête des annonces les plus récentes.",
    pour: "particulier",
    genre: "option",
    prixCentimes: 150,
    jours: 0,
    photos: 0,
    effet: "remontee",
    actif: true,
  },
  {
    code: "photos",
    nom: "+5 photos",
    description: "Cinq photos de plus que votre formule.",
    pour: "particulier",
    genre: "option",
    prixCentimes: 100,
    jours: 0,
    photos: 5,
    effet: "photos",
    actif: true,
  },
  {
    code: "accueil",
    nom: "Mise en avant à l'accueil",
    description: "Votre annonce dans le bandeau « À la une » de l'accueil des annonces, 7 jours.",
    pour: "particulier",
    genre: "option",
    prixCentimes: 490,
    jours: 7,
    photos: 0,
    effet: "accueil",
    actif: true,
  },
  {
    code: "prolongation",
    nom: "Prolongation 30 jours",
    description: "30 jours de plus en ligne (particulier).",
    pour: "particulier",
    genre: "option",
    prixCentimes: 290,
    jours: 30,
    photos: 0,
    effet: "prolongation",
    actif: true,
  },
  {
    code: "prolongation_pro",
    nom: "Prolongation 30 jours (pro)",
    description: "30 jours de plus en ligne (professionnel).",
    pour: "pro",
    genre: "option",
    prixCentimes: 990,
    jours: 30,
    photos: 0,
    effet: "prolongation",
    actif: true,
  },
]

/** Options ouvertes aux deux publics (le reste suit le champ `pour`). */
const POUR_TOUS: CodeOffre[] = ["photos", "accueil"]

export const offreOuverte = (o: Offre, a: Annonceur) =>
  o.actif && (o.pour === a || POUR_TOUS.includes(o.code))

export const euros = (centimes: number) =>
  centimes === 0
    ? "Gratuit"
    : `${(centimes / 100).toLocaleString("fr-FR", { minimumFractionDigits: centimes % 100 ? 2 : 0, maximumFractionDigits: 2 })} €`

export interface Ligne {
  code: CodeOffre
  libelle: string
  centimes: number
}

/** Une option dont l'effet est déjà compris dans la formule ne se vend pas. */
export function optionUtile(formule: Offre | undefined, option: Offre) {
  if (!formule) return true
  if (option.effet === "categorie") return formule.effet === "aucun"
  if (option.effet === "renforcee") return formule.effet !== "renforcee"
  return true
}

/**
 * Lignes à payer au dépôt : la formule, puis les options choisies, sans
 * doublon ni option inutile. Lève une erreur si un choix n'est pas permis.
 */
export function lignesDepot(
  offres: Offre[],
  annonceur: Annonceur,
  formule: CodeOffre,
  options: CodeOffre[],
): Ligne[] {
  const f = offres.find((o) => o.code === formule && o.genre === "formule")
  if (!f || !offreOuverte(f, annonceur)) throw new Error("Cette formule n'est pas disponible.")
  const lignes: Ligne[] = [{ code: f.code, libelle: f.nom, centimes: f.prixCentimes }]
  for (const code of new Set(options)) {
    const o = offres.find((x) => x.code === code && x.genre === "option")
    // Au dépôt : ni remontée (l'annonce est neuve) ni prolongation.
    if (!o || !offreOuverte(o, annonceur) || o.effet === "remontee" || o.effet === "prolongation")
      throw new Error("Une option choisie n'est pas disponible.")
    if (!optionUtile(f, o)) continue
    lignes.push({ code: o.code, libelle: o.nom, centimes: o.prixCentimes })
  }
  return lignes
}

export const total = (lignes: Ligne[]) => lignes.reduce((n, l) => n + l.centimes, 0)

/** Nombre de photos permis : celles de la formule, plus l'option « photos ». */
export function photosPermises(offres: Offre[], formule: CodeOffre, options: CodeOffre[]) {
  const f = offres.find((o) => o.code === formule)
  const plus = options.includes("photos")
    ? (offres.find((o) => o.code === "photos")?.photos ?? 0)
    : 0
  return (f?.photos ?? 5) + plus
}
