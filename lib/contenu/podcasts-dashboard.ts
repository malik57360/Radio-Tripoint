import "server-only"
import { createHash } from "node:crypto"
import type { TradEpisode } from "@/data/traductions/types"
import { accesRedis } from "@/lib/direction/redis"
import type { Langue } from "@/lib/i18n/langues"
import type { Episode } from "@/types/podcast"

/**
 * Podcasts publiés depuis le tableau de bord (page Podcasts). Comme les
 * articles : l'épisode vit dans Redis (hash rt:podcasts:dashboard, slug →
 * épisode) et son fichier audio dans le Blob Vercel. Pas de déploiement :
 * il est en ligne dès la publication (revalidateTag sur TAG_PODCASTS).
 *
 * Le titre et la description sont traduits par l'IA après la publication
 * (lib/direction/traduction-podcasts.ts). Les traductions sont rangées dans
 * l'épisode avec l'empreinte du français qu'elles traduisent : après une
 * modification, le français s'affiche jusqu'à ce que les nouvelles arrivent.
 */
export const CLE_PODCASTS = "rt:podcasts:dashboard"
export const TAG_PODCASTS = "podcasts-dashboard"

export const LANGUES_PODCAST = ["de", "lb", "en", "es"] as const
export type LanguePodcast = (typeof LANGUES_PODCAST)[number]

export interface EpisodeDashboard extends Episode {
  traductions?: { empreinte: string; langues: Partial<Record<LanguePodcast, TradEpisode>> }
}

/** Empreinte du texte français traduit : titre et description. */
export const empreinteEpisode = (e: Pick<Episode, "titre" | "description">) =>
  createHash("sha256")
    .update(JSON.stringify([e.titre, e.description]))
    .digest("hex")
    .slice(0, 16)

/** Traductions à jour de cet épisode (celles d'une ancienne version ne comptent pas). */
export function traductionsAJour(e: EpisodeDashboard) {
  return e.traductions?.empreinte === empreinteEpisode(e) ? e.traductions.langues : {}
}

/** L'épisode dans la langue demandée, débarrassé de ses traductions rangées. */
export function localiserEpisodeDashboard(e: EpisodeDashboard, l: Langue): Episode {
  const t = l === "fr" ? undefined : traductionsAJour(e)[l]
  const episode: EpisodeDashboard = { ...e }
  delete episode.traductions
  return t
    ? { ...episode, titre: t.titre ?? e.titre, description: t.description ?? e.description }
    : episode
}

export async function podcastsDashboard(): Promise<EpisodeDashboard[]> {
  const a = accesRedis()
  if (!a) return []
  try {
    const r = await fetch(`${a.url}/hgetall/${CLE_PODCASTS}`, {
      headers: { Authorization: `Bearer ${a.jeton}` },
      next: { revalidate: 600, tags: [TAG_PODCASTS] },
      signal: AbortSignal.timeout(3000),
    })
    if (!r.ok) return []
    const { result } = (await r.json()) as { result?: string[] | null }
    if (!Array.isArray(result)) return []
    const liste: EpisodeDashboard[] = []
    for (let i = 1; i < result.length; i += 2) {
      try {
        const x = JSON.parse(result[i]) as EpisodeDashboard
        if (x?.slug && x.titre && x.audioUrl && typeof x.duree === "number") liste.push(x)
      } catch {
        // Entrée illisible : ignorée, le reste du site s'affiche.
      }
    }
    return liste
  } catch {
    return []
  }
}
