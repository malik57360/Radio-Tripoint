import type { Categorie, CategorieSlug } from "@/types/category"

/**
 * Traductions du contenu. Le français (data/*.ts) fait foi ; chaque langue
 * ne porte que les champs traduits, rangés par slug. Un champ absent
 * s'affiche en français : rien ne disparaît faute de traduction.
 */
export interface TradArticle {
  titre: string
  chapeau: string
  /**
   * Corps traduit, bloc par bloc, dans l'ordre de l'original : une chaîne
   * pour un paragraphe, un intertitre ou une citation, un tableau pour une
   * liste. Le type de chaque bloc vient de l'original ; les photos aussi.
   */
  corps: (string | string[])[]
  /** Texte alternatif du visuel principal. */
  alt?: string
}

export interface TradEmission {
  accroche?: string
  presentation?: string
  thematique?: string
}

export interface TradEvenement {
  titre?: string
  description?: string
  horaires?: string
  lieu?: string
  alt?: string
}

export interface TradEpisode {
  titre?: string
  description?: string
}

export type TradCategorie = Partial<Omit<Categorie, "slug" | "chemin">>

export interface Traductions {
  articles: Record<string, TradArticle>
  emissions: Record<string, TradEmission>
  evenements: Record<string, TradEvenement>
  episodes: Record<string, TradEpisode>
  categories: Partial<Record<CategorieSlug, TradCategorie>>
}
