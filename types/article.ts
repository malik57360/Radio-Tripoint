import type { CategorieSlug } from "./category"
import type { Bloc, Demo, Visuel } from "./media"

export interface Article extends Demo {
  slug: string
  titre: string
  /** Chapeau : une à deux phrases, affiché sous le titre et en extrait. */
  chapeau: string
  categorie: CategorieSlug
  /**
   * ISO 8601. Facultative : les articles repris de l'ancien site n'en
   * affichaient souvent aucune, et une date ne s'invente pas.
   */
  publieLe?: string
  modifieLe?: string
  /** Rang sur l'ancien site (1 = le plus récent) : tri des articles sans date. */
  ordre?: number
  auteur?: string
  /** Communes ou zones concernées (SEO local, filtres). */
  lieux?: string[]
  visuel?: Visuel
  corps: Bloc[]
  /** Mise en avant en une. */
  une?: boolean
  tags?: string[]
}
