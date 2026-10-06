/**
 * Accès aux articles. Seul point de lecture : pour brancher un CMS
 * (Sanity, Strapi, WordPress headless, Supabase…), réécrire ces fonctions
 * sans toucher aux pages. Elles sont asynchrones pour cette raison.
 */
import { articles as articlesReels } from "@/data/articles"
import { articlesDemo } from "@/data/demo"
import type { Article } from "@/types/article"
import type { CategorieSlug } from "@/types/category"
import type { Langue } from "@/lib/i18n/langues"
import { normaliser } from "@/lib/utils/texte"
import { articlesDashboard } from "./articles-dashboard"
import { localiserArticle } from "./localiser"
import { modeDemo } from "./demo"

/**
 * Du plus récent au plus ancien : par date quand les deux en ont une, sinon
 * par rang sur l'ancien site (`ordre`). Un article daté passe devant un
 * article non daté de même rang ; l'ordre d'origine départage le reste.
 */
function comparer(a: Article, b: Article): number {
  if (a.publieLe && b.publieLe) return b.publieLe.localeCompare(a.publieLe)
  const oa = a.ordre ?? (a.publieLe ? 0 : Number.MAX_SAFE_INTEGER)
  const ob = b.ordre ?? (b.publieLe ? 0 : Number.MAX_SAFE_INTEGER)
  if (oa !== ob) return oa - ob
  return Number(Boolean(b.publieLe)) - Number(Boolean(a.publieLe))
}

/** Articles du dépôt + ceux publiés depuis le tableau de bord (un slug du dépôt prime). */
async function tries(): Promise<Article[]> {
  const base = modeDemo ? [...articlesReels, ...articlesDemo] : articlesReels
  const connus = new Set(base.map((a) => a.slug))
  const ajoutes = (await articlesDashboard()).filter((a) => !connus.has(a.slug))
  return [...base, ...ajoutes].sort(comparer)
}

/** Tous les articles, dans la langue demandée (français par défaut). */
async function tous(l: Langue = "fr"): Promise<Article[]> {
  const liste = await tries()
  return l === "fr" ? liste : liste.map((a) => localiserArticle(a, l))
}

export interface Page<T> {
  elements: T[]
  page: number
  pages: number
  total: number
}

export const PAR_PAGE = 9

export async function listerArticles(
  options: {
    categorie?: CategorieSlug
    q?: string
    page?: number
    parPage?: number
    langue?: Langue
  } = {},
): Promise<Page<Article>> {
  const { categorie, q, page = 1, parPage = PAR_PAGE, langue = "fr" } = options
  let liste = await tous(langue)
  // « actualites » est le flux général : il contient toutes les rubriques.
  if (categorie && categorie !== "actualites")
    liste = liste.filter((a) => a.categorie === categorie)
  if (q) {
    const n = normaliser(q)
    liste = liste.filter((a) =>
      normaliser(`${a.titre} ${a.chapeau} ${(a.lieux ?? []).join(" ")}`).includes(n),
    )
  }
  const pages = Math.max(1, Math.ceil(liste.length / parPage))
  const p = Math.min(Math.max(1, page), pages)
  return {
    elements: liste.slice((p - 1) * parPage, p * parPage),
    page: p,
    pages,
    total: liste.length,
  }
}

export async function articlesRecents(
  n: number,
  sauf?: string,
  l: Langue = "fr",
): Promise<Article[]> {
  return (await tous(l))
    .filter((a) => a.slug !== sauf)
    .slice(0, n)
}

/** Une : l'article marqué `une`, sinon le plus récent, puis les suivants. */
export async function une(l: Langue = "fr"): Promise<{
  principal: Article | null
  secondaires: Article[]
  suite: Article[]
}> {
  const liste = await tous(l)
  const principal = liste.find((a) => a.une) ?? liste[0] ?? null
  const reste = liste.filter((a) => a !== principal)
  const suite = reste.slice(3, 9)
  // Rangées complètes de trois : pas d'article orphelin en fin de grille.
  return {
    principal,
    secondaires: reste.slice(0, 3),
    suite: suite.length >= 3 ? suite.slice(0, suite.length - (suite.length % 3)) : suite,
  }
}

export async function articleParSlug(slug: string, l: Langue = "fr"): Promise<Article | null> {
  return (await tous(l)).find((a) => a.slug === slug) ?? null
}

export async function articlesSimilaires(
  article: Article,
  n = 3,
  l: Langue = "fr",
): Promise<Article[]> {
  const liste = (await tous(l)).filter((a) => a.slug !== article.slug)
  const meme = liste.filter((a) => a.categorie === article.categorie)
  return [...meme, ...liste.filter((a) => a.categorie !== article.categorie)].slice(0, n)
}

export async function slugsArticles(): Promise<string[]> {
  return (await tries()).map((a) => a.slug)
}

export async function tousArticles(l: Langue = "fr"): Promise<Article[]> {
  return tous(l)
}
