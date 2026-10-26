import "server-only"
import { redis } from "./redis"

/**
 * Crédit Anthropic épuisé : l'API refuse tout (« credit balance is too
 * low »), et les traductions s'arrêtent sans bruit. Toute fonction IA qui
 * reçoit ce refus le note ici ; le premier appel réussi l'efface. Le tableau
 * de bord en fait une alerte, pour recharger avant que ça se voie.
 */
const CLE = "rt:ia:credit-epuise"

export const estCreditEpuise = (e: unknown) =>
  /credit balance is too low/i.test(String((e as Error)?.message ?? e))

export async function noterCreditEpuise() {
  await redis([["SET", CLE, String(Date.now()), "EX", 30 * 24 * 3600]])
}

export async function creditRetabli() {
  await redis([["DEL", CLE]])
}

/** Depuis quand le crédit est épuisé (ms), ou null. */
export async function creditEpuiseDepuis(): Promise<number | null> {
  const r = await redis([["GET", CLE]])
  return typeof r?.[0] === "string" ? Number(r[0]) : null
}
