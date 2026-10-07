import type { Trad } from "@/lib/i18n/langues"

/**
 * Emplacements publicitaires du site. Tant qu'un emplacement n'a pas
 * d'annonceur, il affiche « Louez cet emplacement pour votre pub ! » et
 * renvoie vers la demande d'offre.
 *
 * Pour louer un emplacement : renseigner `annonceur` (nom, visuel déposé
 * dans public/pub/, lien) — l'encart passe alors en publicité, signalée
 * comme telle.
 */
export interface Annonceur {
  nom: string
  /** Chemin d'un visuel dans public/ (ex. "/pub/garage-dupont.jpg"). */
  image: string
  /** Site ou page de l'annonceur. Sans lien, le visuel n'est pas cliquable. */
  lien?: string
  /** Dimensions du visuel : l'encart garde ses proportions au lieu de recadrer. */
  largeur?: number
  hauteur?: number
}

export interface Emplacement {
  /** Où l'encart apparaît, en clair (sert aussi à la page Publicité). */
  ou: Trad
  annonceur?: Annonceur
}

export const emplacements = {
  "accueil-une": {
    ou: {
      fr: "Accueil, sous « À la une »",
      de: "Startseite, unter den Top-Themen",
      lb: "Startsäit, ënner « Op der Une »",
      en: "Home page, below the top stories",
      es: "Portada, bajo las noticias destacadas",
    },
    annonceur: {
      nom: "Africandles by Zaza — Collection Home",
      image: "/pub/africandles-collection-home.webp",
      largeur: 1774,
      hauteur: 887,
    },
  },
  "accueil-agenda": {
    ou: {
      fr: "Accueil, avant l'agenda",
      de: "Startseite, vor dem Veranstaltungskalender",
      lb: "Startsäit, virun der Agenda",
      en: "Home page, before the events",
      es: "Portada, antes de la agenda",
    },
    annonceur: {
      nom: "Zaza Riviera Herbs — Élixir de Zaza",
      image: "/pub/zaza-elixir-de-zaza.webp",
      largeur: 1536,
      hauteur: 1024,
    },
  },
  "article-fin": {
    ou: {
      fr: "Fin de chaque article",
      de: "Am Ende jedes Artikels",
      lb: "Um Enn vun all Artikel",
      en: "End of every article",
      es: "Al final de cada artículo",
    },
    annonceur: {
      nom: "Zaza Riviera Herbs — Natürliches Wohlbefinden für Ihre Tiere",
      image: "/pub/zaza-cbd-animaux-de.webp",
      largeur: 1774,
      hauteur: 887,
    },
  },
  "article-cote": {
    ou: {
      fr: "Colonne des articles, sous « Les dernières actualités »",
      de: "Seitenspalte der Artikel",
      lb: "Säitekolonn vun den Artikelen",
      en: "Article sidebar, below the latest news",
      es: "Columna lateral de los artículos",
    },
  },
  rubriques: {
    ou: {
      fr: "Pages des rubriques (Actualités, Sport, Culture…)",
      de: "Rubrikseiten (Nachrichten, Sport, Kultur…)",
      lb: "Rubriksäiten (Neiegkeeten, Sport, Kultur…)",
      en: "Section pages (News, Sport, Culture…)",
      es: "Páginas de secciones (Noticias, Deporte, Cultura…)",
    },
  },
  emissions: {
    ou: {
      fr: "Page « Nos émissions »",
      de: "Seite « Sendungen »",
      lb: "Säit « Sendungen »",
      en: "“Programmes” page",
      es: "Página « Programas »",
    },
  },
  podcasts: {
    ou: {
      fr: "Page « Podcasts & Replay »",
      de: "Seite « Podcasts »",
      lb: "Säit « Podcasts »",
      en: "“Podcasts” page",
      es: "Página « Pódcasts »",
    },
  },
  agenda: {
    ou: {
      fr: "Page « Agenda »",
      de: "Seite « Veranstaltungen »",
      lb: "Säit « Agenda »",
      en: "“Events” page",
      es: "Página « Agenda »",
    },
  },
} satisfies Record<string, Emplacement>

export type IdEmplacement = keyof typeof emplacements
