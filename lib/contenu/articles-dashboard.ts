import "server-only"
import { accesRedis } from "@/lib/direction/redis"
import type { Article } from "@/types/article"

/**
 * Articles écrits depuis le tableau de bord (page Articles). Ils vivent dans
 * Redis (hash rt:articles:dashboard, slug → article) et leurs photos dans le
 * Blob Vercel : pas de déploiement, l'article est en ligne dès la
 * publication (revalidateTag sur TAG_ARTICLES), comme l'agenda payant.
 */
export const CLE_ARTICLES = "rt:articles:dashboard"
export const TAG_ARTICLES = "articles-dashboard"

export async function articlesDashboard(): Promise<Article[]> {
  const a = accesRedis()
  if (!a) return []
  try {
    const r = await fetch(`${a.url}/hgetall/${CLE_ARTICLES}`, {
      headers: { Authorization: `Bearer ${a.jeton}` },
      next: { revalidate: 600, tags: [TAG_ARTICLES] },
      signal: AbortSignal.timeout(3000),
    })
    if (!r.ok) return []
    const { result } = (await r.json()) as { result?: string[] | null }
    if (!Array.isArray(result)) return []
    const liste: Article[] = []
    for (let i = 1; i < result.length; i += 2) {
      try {
        const x = JSON.parse(result[i]) as Article
        if (x?.slug && x.titre && Array.isArray(x.corps)) liste.push(x)
      } catch {
        // Entrée illisible : ignorée, le reste du site s'affiche.
      }
    }
    return liste
  } catch {
    return []
  }
}
