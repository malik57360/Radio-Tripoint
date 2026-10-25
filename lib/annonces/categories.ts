/**
 * Petites annonces du Tripoint — catégories et champs propres à chacune.
 * Fichier sans dépendance serveur : le formulaire de dépôt (navigateur) et
 * la validation (serveur) lisent les mêmes définitions.
 *
 * Le nom, l'ordre et l'ouverture de chaque catégorie se règlent dans le
 * tableau de bord (lib/annonces/config.ts) ; ici, seulement ce que le code
 * doit connaître : le lien, l'icône et les champs à demander.
 */

export const ETATS = ["Neuf", "Très bon état", "Bon état", "État correct", "Pour pièces"] as const

export type Champ =
  | { cle: string; libelle: string; type: "texte"; requis?: boolean; max?: number; aide?: string }
  | {
      cle: string
      libelle: string
      type: "nombre"
      requis?: boolean
      min: number
      max: number
      unite?: string
    }
  | { cle: string; libelle: string; type: "choix"; requis?: boolean; options: readonly string[] }

export interface DefCategorie {
  slug: string
  /** Nom de départ (modifiable dans le tableau de bord). */
  nom: string
  accroche: string
  /** Ouverte au lancement ? (modifiable dans le tableau de bord). */
  actif: boolean
  /** Le prix a-t-il un sens ? (emploi : non, le salaire va dans les champs). */
  prix: "prix" | "tarif" | "aucun"
  champs: Champ[]
  /** Précautions affichées au dépôt et cochées par l'annonceur. */
  precautions?: string[]
}

const ETAT: Champ = { cle: "etat", libelle: "État", type: "choix", requis: true, options: ETATS }
const annee = new Date().getFullYear()

export const CATEGORIES_DEPART: DefCategorie[] = [
  {
    slug: "auto-moto",
    nom: "Auto & Moto",
    accroche: "Voitures, motos, utilitaires, vélos et pièces",
    actif: true,
    prix: "prix",
    champs: [
      {
        cle: "type",
        libelle: "Type",
        type: "choix",
        requis: true,
        options: [
          "Voiture",
          "Moto / scooter",
          "Utilitaire",
          "Camping-car",
          "Vélo",
          "Pièces & équipement",
        ],
      },
      { cle: "marque", libelle: "Marque", type: "texte", max: 40 },
      { cle: "modele", libelle: "Modèle", type: "texte", max: 60 },
      { cle: "annee", libelle: "Année", type: "nombre", min: 1900, max: annee + 1 },
      {
        cle: "kilometrage",
        libelle: "Kilométrage",
        type: "nombre",
        min: 0,
        max: 2_000_000,
        unite: "km",
      },
      {
        cle: "carburant",
        libelle: "Carburant",
        type: "choix",
        options: ["Essence", "Diesel", "Hybride", "Électrique", "GPL", "Autre"],
      },
      {
        cle: "boite",
        libelle: "Boîte de vitesses",
        type: "choix",
        options: ["Manuelle", "Automatique"],
      },
    ],
  },
  {
    slug: "immobilier",
    nom: "Immobilier",
    accroche: "Ventes, locations et colocations",
    // Fermée au lancement : étiquette énergie obligatoire et modération plus lourde.
    actif: false,
    prix: "prix",
    champs: [
      {
        cle: "offre",
        libelle: "Offre",
        type: "choix",
        requis: true,
        options: ["Vente", "Location", "Colocation"],
      },
      {
        cle: "bien",
        libelle: "Type de bien",
        type: "choix",
        requis: true,
        options: ["Appartement", "Maison", "Terrain", "Parking / garage", "Local professionnel"],
      },
      {
        cle: "surface",
        libelle: "Surface",
        type: "nombre",
        requis: true,
        min: 1,
        max: 100_000,
        unite: "m²",
      },
      { cle: "pieces", libelle: "Pièces", type: "nombre", min: 1, max: 50 },
      {
        cle: "dpe",
        libelle: "Classe énergie (DPE)",
        type: "choix",
        requis: true,
        options: ["A", "B", "C", "D", "E", "F", "G", "Non soumis"],
      },
      {
        cle: "ges",
        libelle: "Classe climat (GES)",
        type: "choix",
        requis: true,
        options: ["A", "B", "C", "D", "E", "F", "G", "Non soumis"],
      },
    ],
    precautions: [
      "Les classes énergie et climat indiquées sont celles du diagnostic du bien.",
      "Pour une location : je ne demande aucun versement avant la visite et la signature du bail.",
    ],
  },
  {
    slug: "maison-mobilier",
    nom: "Maison & Mobilier",
    accroche: "Meubles, électroménager, déco, jardin, bricolage",
    actif: true,
    prix: "prix",
    champs: [ETAT],
  },
  {
    slug: "multimedia-high-tech",
    nom: "Multimédia & High-Tech",
    accroche: "Téléphones, ordinateurs, consoles, image et son",
    actif: true,
    prix: "prix",
    champs: [ETAT, { cle: "marque", libelle: "Marque", type: "texte", max: 40 }],
  },
  {
    slug: "mode-accessoires",
    nom: "Mode & Accessoires",
    accroche: "Vêtements, chaussures, sacs, montres et bijoux",
    actif: true,
    prix: "prix",
    champs: [
      ETAT,
      { cle: "taille", libelle: "Taille", type: "texte", max: 20 },
      { cle: "marque", libelle: "Marque", type: "texte", max: 40 },
    ],
  },
  {
    slug: "loisirs-sport",
    nom: "Loisirs & Sport",
    accroche: "Sport, jeux, livres, musique, collection",
    actif: true,
    prix: "prix",
    champs: [ETAT],
  },
  {
    slug: "services-artisans",
    nom: "Services & Artisans",
    accroche: "Cours, dépannage, travaux, garde, coups de main",
    actif: true,
    prix: "tarif",
    champs: [
      {
        cle: "service",
        libelle: "Type de service",
        type: "choix",
        requis: true,
        options: [
          "Cours & soutien",
          "Travaux & dépannage",
          "Jardinage",
          "Garde & aide à domicile",
          "Déménagement",
          "Événements",
          "Autre",
        ],
      },
      {
        cle: "zone",
        libelle: "Zone d'intervention",
        type: "texte",
        max: 80,
        aide: "Ex. « Sierck et 20 km autour »",
      },
    ],
  },
  {
    slug: "emploi",
    nom: "Emploi",
    accroche: "Offres et recherches d'emploi, des deux côtés de la frontière",
    actif: true,
    prix: "aucun",
    champs: [
      {
        cle: "sens",
        libelle: "Annonce",
        type: "choix",
        requis: true,
        options: ["Offre d'emploi", "Recherche d'emploi"],
      },
      {
        cle: "contrat",
        libelle: "Contrat",
        type: "choix",
        requis: true,
        options: ["CDI", "CDD", "Intérim", "Alternance", "Stage", "Saisonnier", "Indépendant"],
      },
      {
        cle: "temps",
        libelle: "Temps de travail",
        type: "choix",
        options: ["Temps plein", "Temps partiel"],
      },
      {
        cle: "salaire",
        libelle: "Salaire",
        type: "texte",
        max: 60,
        aide: "Ex. « 2 100 € brut / mois » ou « Selon profil »",
      },
    ],
    precautions: [
      "L'annonce ne contient aucun critère discriminatoire (âge, sexe, origine, handicap, situation de famille…).",
      "Aucune somme d'argent n'est demandée aux candidats, ni coordonnées bancaires.",
      "Le poste proposé existe réellement et l'annonce indique son lieu.",
    ],
  },
  {
    slug: "animaux",
    nom: "Animaux",
    accroche: "Accessoires, adoptions, garde et services",
    // Fermée au lancement : identification obligatoire, règles propres aux éleveurs.
    actif: false,
    prix: "prix",
    champs: [
      { cle: "espece", libelle: "Espèce", type: "texte", requis: true, max: 40 },
      { cle: "age", libelle: "Âge", type: "texte", max: 30 },
      {
        cle: "identification",
        libelle: "N° d'identification (puce ou tatouage)",
        type: "texte",
        max: 30,
        aide: "Obligatoire pour céder un chien ou un chat, même gratuitement.",
      },
    ],
    precautions: [
      "Pour un chien ou un chat : l'animal est identifié et son numéro figure dans l'annonce.",
      "Je respecte les règles de cession des animaux de mon pays.",
    ],
  },
  {
    slug: "divers",
    nom: "Divers",
    accroche: "Tout ce qui ne rentre pas ailleurs",
    actif: true,
    prix: "prix",
    champs: [ETAT],
  },
]

export const SLUGS_CATEGORIES = CATEGORIES_DEPART.map((c) => c.slug)
export const defCategorie = (slug: string) => CATEGORIES_DEPART.find((c) => c.slug === slug) ?? null

export const PAYS = { FR: "France", LU: "Luxembourg", DE: "Allemagne" } as const
export type Pays = keyof typeof PAYS
export const estPays = (x: unknown): x is Pays => x === "FR" || x === "LU" || x === "DE"

/** Ce qui est interdit, quelle que soit la catégorie (règles de la rubrique). */
export const INTERDITS = [
  "Armes, munitions et explosifs",
  "Drogues, médicaments et produits de santé",
  "Tabac, cigarettes électroniques et alcool",
  "Contrefaçons, copies et objets volés",
  "Animaux sauvages ou protégés",
  "Contenus pour adultes et services sexuels",
  "Billets, titres et documents officiels",
  "Données personnelles, comptes et abonnements",
  "Placements, crédits, cryptomonnaies et « gains faciles »",
  "Annonces discriminatoires ou haineuses",
]
