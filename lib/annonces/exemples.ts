/**
 * MAQUETTE — Petites annonces. Annonces d'EXEMPLE (fictives, marquées
 * « Exemple » à l'écran) pour juger la mise en page avant de lancer la
 * rubrique. Rien ici n'est une vraie annonce : à remplacer par les annonces
 * déposées et validées depuis le tableau de bord.
 */

export type Categorie = "emploi" | "vehicules" | "affaires" | "services"
export type Pays = "FR" | "LU" | "DE"

export interface Annonce {
  slug: string
  categorie: Categorie
  titre: string
  prix: string | null
  ville: string
  pays: Pays
  publieeLe: string
  /** Particulier ou professionnel (les pros paient leur annonce). */
  pro: boolean
  description: string
  /** Caractéristiques affichées en tableau (contrat, kilométrage, état…). */
  details: [string, string][]
}

export const CATEGORIES: Record<Categorie, { nom: string; court: string; accroche: string }> = {
  emploi: {
    nom: "Emploi",
    court: "Emploi",
    accroche: "Offres et recherches d'emploi, des deux côtés de la frontière",
  },
  vehicules: {
    nom: "Véhicules",
    court: "Véhicules",
    accroche: "Voitures, motos, vélos, utilitaires",
  },
  affaires: {
    nom: "Bonnes affaires",
    court: "Affaires",
    accroche: "Meubles, vêtements, électroménager, loisirs",
  },
  services: {
    nom: "Services & associations",
    court: "Services",
    accroche: "Cours, coups de main, bénévolat, objets trouvés",
  },
}

export const PAYS: Record<Pays, string> = { FR: "France", LU: "Luxembourg", DE: "Allemagne" }

export const ANNONCES: Annonce[] = [
  {
    slug: "exemple-vendeur-boulangerie-sierck",
    categorie: "emploi",
    titre: "Vendeur·se en boulangerie (CDI, 35 h)",
    prix: "Selon profil",
    ville: "Sierck-les-Bains",
    pays: "FR",
    publieeLe: "2026-10-16",
    pro: true,
    description:
      "Boulangerie du centre-ville recherche un·e vendeur·se pour l'accueil et la vente, du mardi au samedi. Première expérience appréciée, débutant·e motivé·e accepté·e. Poste à pourvoir dès que possible.",
    details: [
      ["Contrat", "CDI"],
      ["Temps de travail", "35 h / semaine"],
      ["Horaires", "Du mardi au samedi"],
      ["Expérience", "Débutant·e accepté·e"],
    ],
  },
  {
    slug: "exemple-chauffeur-livreur-remich",
    categorie: "emploi",
    titre: "Chauffeur-livreur permis C — frontalier bienvenu",
    prix: "Selon convention",
    ville: "Remich",
    pays: "LU",
    publieeLe: "2026-10-15",
    pro: true,
    description:
      "Entreprise de distribution recherche un chauffeur-livreur titulaire du permis C pour des tournées régionales au départ de Remich. Tournées de jour, retour au dépôt chaque soir.",
    details: [
      ["Contrat", "CDI"],
      ["Permis", "C (FIMO à jour)"],
      ["Lieu de travail", "Remich (LU)"],
      ["Langues", "Français ; luxembourgeois ou allemand apprécié"],
    ],
  },
  {
    slug: "exemple-peugeot-208-thionville",
    categorie: "vehicules",
    titre: "Peugeot 208 1.2 PureTech, 2019",
    prix: "11 900 €",
    ville: "Thionville",
    pays: "FR",
    publieeLe: "2026-10-16",
    pro: false,
    description:
      "Vends Peugeot 208 essence, première main, carnet d'entretien à jour, contrôle technique OK. Quelques rayures sur le pare-chocs arrière. Visible le week-end.",
    details: [
      ["Année", "2019"],
      ["Kilométrage", "68 000 km"],
      ["Carburant", "Essence"],
      ["Boîte", "Manuelle"],
    ],
  },
  {
    slug: "exemple-velo-electrique-apach",
    categorie: "vehicules",
    titre: "Vélo électrique de ville, taille M",
    prix: "650 €",
    ville: "Apach",
    pays: "FR",
    publieeLe: "2026-10-14",
    pro: false,
    description:
      "Vélo à assistance électrique, batterie révisée cet été, idéal pour la véloroute de la Moselle. Livré avec chargeur et antivol.",
    details: [
      ["Taille", "M"],
      ["Autonomie annoncée", "Environ 60 km"],
      ["État", "Très bon état"],
    ],
  },
  {
    slug: "exemple-canape-angle-kirsch",
    categorie: "affaires",
    titre: "Canapé d'angle gris, très bon état",
    prix: "180 €",
    ville: "Kirsch-lès-Sierck",
    pays: "FR",
    publieeLe: "2026-10-16",
    pro: false,
    description:
      "Canapé d'angle réversible en tissu gris, non-fumeur, sans animaux. À venir chercher sur place (prévoir deux personnes).",
    details: [
      ["Dimensions", "250 × 160 cm"],
      ["État", "Très bon état"],
      ["Retrait", "Sur place"],
    ],
  },
  {
    slug: "exemple-vetements-enfant-schengen",
    categorie: "affaires",
    titre: "Lot de vêtements enfant 2–3 ans",
    prix: "25 €",
    ville: "Schengen",
    pays: "LU",
    publieeLe: "2026-10-13",
    pro: false,
    description:
      "Une trentaine de pièces fille, été et hiver, propres et en bon état. Possibilité de remise en main propre à Schengen ou Perl.",
    details: [
      ["Taille", "2–3 ans"],
      ["Quantité", "Une trentaine de pièces"],
    ],
  },
  {
    slug: "exemple-cours-luxembourgeois-mondorf",
    categorie: "services",
    titre: "Cours de luxembourgeois pour débutants",
    prix: "15 € / heure",
    ville: "Mondorf-les-Bains",
    pays: "LU",
    publieeLe: "2026-10-15",
    pro: false,
    description:
      "Professeure retraitée propose des cours de luxembourgeois pour débutants, en petit groupe ou en individuel, le soir en semaine. Idéal pour les frontaliers.",
    details: [
      ["Niveau", "Débutant"],
      ["Format", "Individuel ou petit groupe"],
      ["Quand", "Le soir en semaine"],
    ],
  },
  {
    slug: "exemple-benevoles-fete-village",
    categorie: "services",
    titre: "Recherche bénévoles pour la fête du village",
    prix: "Bénévolat",
    ville: "Manderen-Ritzing",
    pays: "FR",
    publieeLe: "2026-10-12",
    pro: false,
    description:
      "L'association des fêtes cherche des bénévoles pour tenir la buvette et le stand de crêpes. Bonne humeur garantie, repas offert aux bénévoles.",
    details: [
      ["Missions", "Buvette, crêpes, rangement"],
      ["Contrepartie", "Repas offert"],
    ],
  },
]

export const annonceParSlug = (slug: string) => ANNONCES.find((a) => a.slug === slug) ?? null
