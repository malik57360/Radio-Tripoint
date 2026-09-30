import type { Categorie, CategorieSlug } from "@/types/category"
import type { Bloc } from "@/types/media"

/**
 * Traductions du contenu. Le français (data/*.ts) fait foi ; chaque langue
 * ne porte que les champs traduits, rangés par slug. Un champ absent
 * s'affiche en français : rien ne disparaît faute de traduction.
 */
export interface TradArticle {
  titre: string
  chapeau: string
  corps?: Bloc[]
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
