import "server-only"
import { accesRedis } from "@/lib/direction/redis"
import type { Evenement } from "@/types/event"

/**
 * Événements payés par leur organisateur et publiés depuis le tableau de
 * bord. Ils vivent dans Redis (hash rt:agenda:publies, slug → événement),
 * lus en GET pour profiter du cache de Next : la lecture est rafraîchie
 * toutes les 10 minutes, et tout de suite à chaque publication
 * (revalidateTag sur TAG_AGENDA).
 */
export const CLE_PUBLIES = "rt:agenda:publies"
export const TAG_AGENDA = "agenda-publie"

export async function evenementsPublies(): Promise<Evenement[]> {
  const a = accesRedis()
  if (!a) return []
  try {
    const r = await fetch(`${a.url}/hgetall/${CLE_PUBLIES}`, {
      headers: { Authorization: `Bearer ${a.jeton}` },
      next: { revalidate: 600, tags: [TAG_AGENDA] },
      signal: AbortSignal.timeout(3000),
    })
    if (!r.ok) return []
    const { result } = (await r.json()) as { result?: string[] | null }
    if (!Array.isArray(result)) return []
    const liste: Evenement[] = []
    for (let i = 1; i < result.length; i += 2) {
      try {
        const e = JSON.parse(result[i]) as Evenement
        if (e?.slug && e.titre && e.debut) liste.push(e)
      } catch {
        // Entrée illisible : ignorée, le reste de l'agenda s'affiche.
      }
    }
    return liste
  } catch {
    return []
  }
}
