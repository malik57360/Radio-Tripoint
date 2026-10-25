import { normaliser } from "@/lib/utils/texte"
import { estPays, ETATS, type Pays } from "./categories"
import { actif, type AnnoncePublique } from "./types"

/**
 * Recherche dans les annonces en ligne, en mémoire : tient sans peine
 * jusqu'à quelques milliers d'annonces. Au-delà, ces mêmes filtres
 * passeront dans une base (Postgres) sans changer les pages.
 *
 * Règle de classement, affichée aux visiteurs (page « Règles ») :
 * les plus récentes d'abord — date de publication, ou de la dernière
 * remontée payée. Les annonces Premium occupent en plus les premières
 * places, signalées « Premium ».
 */
export interface Filtres {
  q?: string
  categorie?: string
  pays?: Pays
  /** Ville ou début de code postal. */
  lieu?: string
  prixMin?: number
  prixMax?: number
  etat?: string
  annonceur?: "particulier" | "pro"
  tri?: "recent" | "prix-croissant" | "prix-decroissant"
}

const entier = (v: unknown) => {
  const t = String(v ?? "").replace(/\s/g, "")
  if (!t) return undefined
  const n = Number(t)
  return Number.isFinite(n) && n >= 0 && n < 1e9 ? Math.round(n) : undefined
}

/** Paramètres d'URL → filtres propres (tout le reste est ignoré). */
export function lireFiltres(sp: Record<string, string | string[] | undefined>): Filtres {
  const un = (k: string) => {
    const v = sp[k]
    return (Array.isArray(v) ? v[0] : v)?.slice(0, 80).trim() || undefined
  }
  const tri = un("tri")
  return {
    q: un("q"),
    categorie: un("categorie"),
    pays: estPays(un("pays")) ? (un("pays") as Pays) : undefined,
    lieu: un("lieu"),
    prixMin: entier(un("min")),
    prixMax: entier(un("max")),
    etat: ETATS.find((e) => e === un("etat")),
    annonceur:
      un("par") === "pro" ? "pro" : un("par") === "particulier" ? "particulier" : undefined,
    tri: tri === "prix-croissant" || tri === "prix-decroissant" ? tri : "recent",
  }
}

/** Filtres → paramètres d'URL (liens de pagination, de tri, de retrait d'un filtre). */
export function versParams(f: Filtres, sauf: (keyof Filtres)[] = []) {
  const p = new URLSearchParams()
  const mettre = (k: keyof Filtres, nom: string, v: unknown) => {
    if (!sauf.includes(k) && v !== undefined && v !== "" && !(k === "tri" && v === "recent"))
      p.set(nom, String(v))
  }
  mettre("q", "q", f.q)
  mettre("categorie", "categorie", f.categorie)
  mettre("pays", "pays", f.pays)
  mettre("lieu", "lieu", f.lieu)
  mettre("prixMin", "min", f.prixMin)
  mettre("prixMax", "max", f.prixMax)
  mettre("etat", "etat", f.etat)
  mettre("annonceur", "par", f.annonceur)
  mettre("tri", "tri", f.tri)
  return p
}

const texteDe = (a: AnnoncePublique) =>
  normaliser(`${a.titre} ${a.description} ${Object.values(a.details).join(" ")} ${a.ville}`)

export function filtrer(liste: AnnoncePublique[], f: Filtres) {
  const mots = f.q
    ? normaliser(f.q)
        .split(/\s+/)
        .filter((m) => m.length > 1)
    : []
  // « L-5570 » : le préfixe luxembourgeois n'est pas rangé avec le code postal.
  const lieu = f.lieu ? normaliser(f.lieu).replace(/^l-?(?=\d)/, "") : ""
  return liste.filter((a) => {
    if (f.categorie && a.categorie !== f.categorie) return false
    if (f.pays && a.pays !== f.pays) return false
    if (f.annonceur && a.annonceur !== f.annonceur) return false
    if (f.etat && a.details.etat !== f.etat) return false
    if (lieu && !normaliser(a.ville).includes(lieu) && !a.codePostal.startsWith(lieu)) return false
    // Euros saisis, centimes rangés. Une annonce sans prix sort d'une recherche par prix.
    if (f.prixMin !== undefined && (a.prix === null || a.prix < f.prixMin * 100)) return false
    if (f.prixMax !== undefined && (a.prix === null || a.prix > f.prixMax * 100)) return false
    if (mots.length) {
      const t = texteDe(a)
      if (!mots.every((m) => t.includes(m))) return false
    }
    return true
  })
}

export function trier(liste: AnnoncePublique[], tri: Filtres["tri"]) {
  const l = [...liste]
  if (tri === "prix-croissant") return l.sort((a, b) => (a.prix ?? Infinity) - (b.prix ?? Infinity))
  if (tri === "prix-decroissant") return l.sort((a, b) => (b.prix ?? -1) - (a.prix ?? -1))
  return l.sort((a, b) => b.remonteeLe - a.remonteeLe)
}

/**
 * Résultats d'une recherche : les Premium en cours d'abord (3 au plus,
 * celles remontées le plus récemment), puis toutes les autres selon le tri.
 * Une annonce n'apparaît jamais deux fois.
 */
export function resultats(liste: AnnoncePublique[], f: Filtres) {
  const trouvees = trier(filtrer(liste, f), f.tri)
  const premium = trouvees.filter((a) => actif(a.renforceeJusqu)).slice(0, 3)
  const ids = new Set(premium.map((a) => a.id))
  return { premium, autres: trouvees.filter((a) => !ids.has(a.id)), total: trouvees.length }
}

/** Bandeau « À la une » d'une catégorie (Plus, Premium et formules pro équivalentes). */
export const aLaUneCategorie = (liste: AnnoncePublique[], categorie: string) =>
  trier(
    liste.filter(
      (a) => a.categorie === categorie && (actif(a.categorieJusqu) || actif(a.renforceeJusqu)),
    ),
    "recent",
  )

/** Bandeau « À la une » de l'accueil des annonces (option « Mise en avant à l'accueil »). */
export const aLaUneAccueil = (liste: AnnoncePublique[]) =>
  trier(
    liste.filter((a) => actif(a.accueilJusqu)),
    "recent",
  )
