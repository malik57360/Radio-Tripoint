import "server-only"
import { accesRedis, redis } from "@/lib/direction/redis"
import { CATEGORIES_DEPART, type DefCategorie } from "./categories"
import { DEFAUTS_OFFRES, type Offre } from "./offres"

/**
 * Réglages des Petites annonces, rangés dans Redis (rt:annonces:config) et
 * modifiés depuis le tableau de bord : tarifs, catégories ouvertes, limites.
 * Tant que rien n'a été enregistré, ce sont les valeurs de départ du cahier
 * de cadrage. Une offre ou une catégorie ajoutée plus tard au code apparaît
 * d'elle-même, avec sa valeur de départ.
 */
export const CLE_CONFIG = "rt:annonces:config"
export const TAG_CONFIG = "annonces-config"

export interface Limites {
  /** Annonces en ligne ou en attente à la fois, pour un particulier. */
  activesParticulier: number
  /** Dépôts par jour et par compte (anti-spam). */
  depotsParJour: number
  /** Signalements de personnes différentes avant de masquer l'annonce. */
  seuilSignalements: number
}

export interface Config {
  offres: Offre[]
  categories: (Pick<DefCategorie, "slug" | "nom" | "accroche" | "actif"> & { ordre: number })[]
  limites: Limites
  /** Interrupteur général : fermé, personne ne peut déposer (les annonces en ligne restent). */
  depotsOuverts: boolean
  maj?: number
}

export const LIMITES_DEPART: Limites = {
  activesParticulier: 10,
  depotsParJour: 5,
  seuilSignalements: 3,
}

export function configDepart(): Config {
  return {
    offres: DEFAUTS_OFFRES.map((o) => ({ ...o })),
    categories: CATEGORIES_DEPART.map((c, i) => ({
      slug: c.slug,
      nom: c.nom,
      accroche: c.accroche,
      actif: c.actif,
      ordre: i,
    })),
    limites: { ...LIMITES_DEPART },
    depotsOuverts: true,
  }
}

/** Fusionne ce qui est rangé avec les valeurs de départ (offres ou catégories nouvelles). */
function completer(brut: Partial<Config> | null): Config {
  const depart = configDepart()
  if (!brut) return depart
  const offres = depart.offres.map((o) => {
    const r = brut.offres?.find((x) => x.code === o.code)
    // Le code décide de l'effet, du public et du genre ; la direction, du reste.
    return r
      ? {
          ...o,
          nom: r.nom || o.nom,
          description: r.description || o.description,
          prixCentimes: r.prixCentimes,
          jours: r.jours,
          photos: r.photos,
          actif: r.actif,
        }
      : o
  })
  const categories = depart.categories
    .map((c) => {
      const r = brut.categories?.find((x) => x.slug === c.slug)
      return r
        ? {
            ...c,
            nom: r.nom || c.nom,
            accroche: r.accroche || c.accroche,
            actif: r.actif,
            ordre: r.ordre,
          }
        : c
    })
    .sort((a, b) => a.ordre - b.ordre)
  return {
    offres,
    categories,
    limites: { ...depart.limites, ...brut.limites },
    depotsOuverts: brut.depotsOuverts ?? true,
    maj: brut.maj,
  }
}

const lire = (v: unknown) => {
  if (typeof v !== "string") return null
  try {
    return JSON.parse(v) as Partial<Config>
  } catch {
    return null
  }
}

/** Réglages à jour (dépôt, paiement, tableau de bord) : lus à chaque fois. */
export async function lireConfig(): Promise<Config> {
  const r = await redis([["GET", CLE_CONFIG]])
  return completer(lire(r?.[0]))
}

/** Réglages pour les pages publiques : mis en cache, rafraîchis à l'enregistrement. */
export async function configPublique(): Promise<Config> {
  const a = accesRedis()
  if (!a) return configDepart()
  try {
    const r = await fetch(`${a.url}/get/${CLE_CONFIG}`, {
      headers: { Authorization: `Bearer ${a.jeton}` },
      next: { revalidate: 3600, tags: [TAG_CONFIG] },
      signal: AbortSignal.timeout(3000),
    })
    if (!r.ok) return configDepart()
    const { result } = (await r.json()) as { result?: unknown }
    return completer(lire(result))
  } catch {
    return configDepart()
  }
}

export async function enregistrerConfig(c: Config) {
  const ok = await redis([["SET", CLE_CONFIG, JSON.stringify({ ...c, maj: Date.now() })]])
  if (!ok || ok[0] !== "OK") throw new Error("stockage indisponible")
}

export const categoriesOuvertes = (c: Config) => c.categories.filter((x) => x.actif)
export const nomCategorie = (c: Config, slug: string) =>
  c.categories.find((x) => x.slug === slug)?.nom ?? slug
