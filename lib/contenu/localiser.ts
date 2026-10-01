/**
 * Applique la traduction d'un contenu. Le français est la source ; une
 * traduction manquante laisse le texte français à sa place.
 */
import { categories as categoriesFr } from "@/data/categories"
import { traductions as de } from "@/data/traductions/de"
import { traductions as en } from "@/data/traductions/en"
import { traductions as es } from "@/data/traductions/es"
import { traductions as lb } from "@/data/traductions/lb"
import type { Traductions } from "@/data/traductions/types"
import type { Langue } from "@/lib/i18n/langues"
import type { Article } from "@/types/article"
import type { Categorie, CategorieSlug } from "@/types/category"
import type { Evenement } from "@/types/event"
import type { Bloc } from "@/types/media"
import type { Episode } from "@/types/podcast"
import type { Emission } from "@/types/show"

const tables: Partial<Record<Langue, Traductions>> = { de, lb, en, es }

/** Remplace le texte de chaque bloc par sa traduction, en gardant les types et les photos. */
function traduireCorps(corps: Bloc[], textes: (string | string[])[]): Bloc[] {
  let i = 0
  return corps.map((b) => {
    if (b.type === "image") return b
    const x = textes[i++]
    if (x === undefined) return b
    if (b.type === "liste") return Array.isArray(x) ? { ...b, elements: x } : b
    return typeof x === "string" ? { ...b, texte: x } : b
  })
}

export function localiserArticle(a: Article, l: Langue): Article {
  const t = tables[l]?.articles[a.slug]
  if (!t) return a
  return {
    ...a,
    titre: t.titre,
    chapeau: t.chapeau,
    corps: traduireCorps(a.corps, t.corps),
    visuel: a.visuel && t.alt ? { ...a.visuel, alt: t.alt } : a.visuel,
  }
}

/** L'article existe-t-il dans cette langue (sinon il s'affiche en français) ? */
export const articleTraduit = (slug: string, l: Langue) =>
  l === "fr" || Boolean(tables[l]?.articles[slug])

export function localiserEmission(e: Emission, l: Langue): Emission {
  const t = tables[l]?.emissions[e.slug]
  if (!t) return e
  return {
    ...e,
    accroche: t.accroche ?? e.accroche,
    presentation: t.presentation ?? e.presentation,
    thematique: t.thematique ?? e.thematique,
  }
}

export function localiserEvenement(e: Evenement, l: Langue): Evenement {
  const t = tables[l]?.evenements[e.slug]
  if (!t) return e
  return {
    ...e,
    titre: t.titre ?? e.titre,
    description: t.description ?? e.description,
    horaires: t.horaires ?? e.horaires,
    lieu: t.lieu ?? e.lieu,
    visuel: e.visuel && t.alt ? { ...e.visuel, alt: t.alt } : e.visuel,
  }
}

export function localiserEpisode(e: Episode, l: Langue): Episode {
  const t = tables[l]?.episodes[e.slug]
  if (!t) return e
  return { ...e, titre: t.titre ?? e.titre, description: t.description ?? e.description }
}

export function categoriesLangue(l: Langue): Record<CategorieSlug, Categorie> {
  const t = tables[l]?.categories
  if (!t) return categoriesFr
  return Object.fromEntries(
    Object.entries(categoriesFr).map(([k, c]) => [k, { ...c, ...t[k as CategorieSlug] }]),
  ) as Record<CategorieSlug, Categorie>
}
