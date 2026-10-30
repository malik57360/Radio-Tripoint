import "server-only"
import { redis } from "@/lib/direction/redis"

/**
 * Limiteur de débit. Sur Vercel, chaque requête peut tomber sur une instance
 * différente : un compteur en mémoire seul se contourne en multipliant les
 * requêtes. Le compteur qui fait foi est donc partagé dans Redis (fenêtre
 * fixe : le premier passage crée la clé avec sa durée, les suivants
 * l'incrémentent) ; la mémoire de l'instance arrête d'abord les rafales et
 * prend le relais si Redis ne répond pas. Les clés reçues sont déjà hachées
 * par les appelants : aucune adresse IP n'est rangée en clair.
 */
const fenetres = new Map<string, number[]>()

/** Fenêtre glissante en mémoire, sur cette instance seulement. */
export function autoriserIci(cle: string, max: number, fenetreMs: number): boolean {
  const maintenant = Date.now()
  const liste = (fenetres.get(cle) ?? []).filter((t) => maintenant - t < fenetreMs)
  if (liste.length >= max) {
    fenetres.set(cle, liste)
    return false
  }
  liste.push(maintenant)
  fenetres.set(cle, liste)
  if (fenetres.size > 5000) {
    for (const [k, v] of fenetres)
      if (v.every((t) => maintenant - t >= fenetreMs)) fenetres.delete(k)
  }
  return true
}

/** Compteur partagé entre toutes les instances (Redis), mémoire en secours. */
export async function autoriser(cle: string, max: number, fenetreMs: number): Promise<boolean> {
  if (!autoriserIci(cle, max, fenetreMs)) return false
  const k = `rt:lim:${cle}`
  const r = await redis([
    ["SET", k, 0, "EX", Math.max(1, Math.ceil(fenetreMs / 1000)), "NX"],
    ["INCR", k],
  ])
  // Redis muet : le filet en mémoire tient le temps qu'il revienne.
  if (!r) return true
  return Number(r[1]) <= max
}
