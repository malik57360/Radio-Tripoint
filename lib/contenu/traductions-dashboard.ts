import "server-only"
import { createHash } from "node:crypto"
import type { TradArticle } from "@/data/traductions/types"
import { accesRedis } from "@/lib/direction/redis"
import type { Langue } from "@/lib/i18n/langues"
import type { Article } from "@/types/article"
import { TAG_ARTICLES } from "./articles-dashboard"

/**
 * Traductions des articles écrits depuis le tableau de bord, faites par l'IA
 * à la publication (lib/direction/traduction-articles.ts). Elles vivent dans
 * Redis (hash rt:articles:traductions, slug → traductions) à côté des
 * articles, et suivent le même cache (TAG_ARTICLES).
 *
 * Chaque traduction porte l'empreinte du texte français qu'elle traduit :
 * après une modification, l'ancienne traduction n'est plus montrée (le
 * français s'affiche) jusqu'à ce que la nouvelle soit prête.
 */
export const CLE_TRADUCTIONS = "rt:articles:traductions"
export const LANGUES_TRADUITES = ["de", "lb", "en", "es"] as const
export type LangueTraduite = (typeof LANGUES_TRADUITES)[number]

export interface TraductionsArticle {
  empreinte: string
  langues: Partial<Record<LangueTraduite, TradArticle>>
  /** Dernière traduction réussie (ms). */
  le: number
  /** Ancien compteur d'échecs : les échecs vivent désormais par langue (rt:articles:trad-echecs). */
  echecs?: number
}

/** Le texte de l'article, bloc par bloc, tel que TradArticle.corps le traduit. */
export const textesCorps = (a: Article): (string | string[])[] =>
  a.corps.flatMap((b): (string | string[])[] =>
    b.type === "image" ? [] : b.type === "liste" ? [b.elements] : [b.texte],
  )

/** Empreinte du texte français : titre, chapeau, texte alternatif et corps. */
export const empreinte = (a: Article) =>
  createHash("sha256")
    .update(JSON.stringify([a.titre, a.chapeau, a.visuel?.alt ?? "", textesCorps(a)]))
    .digest("hex")
    .slice(0, 16)

export async function traductionsDashboard(): Promise<Map<string, TraductionsArticle>> {
  const a = accesRedis()
  if (!a) return new Map()
  try {
    const r = await fetch(`${a.url}/hgetall/${CLE_TRADUCTIONS}`, {
      headers: { Authorization: `Bearer ${a.jeton}` },
      next: { revalidate: 600, tags: [TAG_ARTICLES] },
      signal: AbortSignal.timeout(3000),
    })
    if (!r.ok) return new Map()
    const { result } = (await r.json()) as { result?: string[] | null }
    const m = new Map<string, TraductionsArticle>()
    if (!Array.isArray(result)) return m
    for (let i = 1; i < result.length; i += 2) {
      try {
        m.set(result[i - 1], JSON.parse(result[i]) as TraductionsArticle)
      } catch {
        // Entrée illisible : l'article s'affiche en français.
      }
    }
    return m
  } catch {
    return new Map()
  }
}

/** La traduction à montrer, seulement si elle traduit bien la version actuelle. */
export function traductionValide(
  t: TraductionsArticle | undefined,
  a: Article,
  l: Langue,
): TradArticle | undefined {
  if (!t || l === "fr") return undefined
  const x = t.langues[l as LangueTraduite]
  return x && t.empreinte === empreinte(a) ? x : undefined
}
