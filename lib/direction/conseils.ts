import "server-only"
import { coordonneesConnues, trouverCoordonnees, type Coordonnees } from "./coordonnees"
import { proposerMessage } from "./mails"
import {
  activiteLocale,
  lireSuivis,
  rechercherProspects,
  ZONES,
  type Prospect,
  type Suivi,
  type ZoneId,
} from "./prospection"
import { jourParis, redis, redisActif } from "./redis"

/**
 * Conseils du jour : chaque matin, 100 entreprises à démarcher, prises dans
 * l'annuaire officiel (gratuit) et classées. Pour les 30 premières, l'IA
 * cherche le mail public puis écrit le message : Giorgio n'a plus qu'à
 * relire et appuyer sur « Envoyer tout ». Rien ne part tout seul.
 *
 * - Tournée : on parcourt zones × secteurs, en reprenant chaque jour là où
 *   on s'était arrêté (et page après page), pour ne pas revoir les mêmes.
 * - Une entreprise déjà conseillée ne revient pas avant 30 jours ; une
 *   entreprise déjà suivie (contactée, refus, « ne plus contacter »…) jamais.
 * - Budget IA : 30 recherches de mail automatiques par jour au plus.
 */

export const CONSEILS_PAR_JOUR = 100
export const RECHERCHES_PAR_JOUR = 30
export const CONSIGNE_MAIL =
  "Présenter nos solutions de publicité locale et proposer un court rendez-vous."

/** Secteurs qui achètent de la publicité locale (ni santé ni banque : déontologie, sièges lointains). */
const SECTEURS_CONSEIL = ["I", "G", "S", "F", "C", "R", "L", "P", "N"] as const
const TOURNEE = ZONES.flatMap((z) =>
  SECTEURS_CONSEIL.map((s) => ({ zone: z.id as ZoneId, secteur: s })),
)
const REQUETES_MAX = 14
const POOL = 160
const OUBLI_JOURS = 30

const CLE_JOUR = (jour: string) => `rt:prospection:conseils:${jour}`
const CLE_DEJA = "rt:prospection:conseilles" // siren → jour où elle a été conseillée
const CLE_TOURNEE = "rt:prospection:tournee" // champ « i » : prochaine étape ; « zone:secteur » : page
const CLE_BROUILLONS = "rt:prospection:brouillons" // siren → { objet, texte, le }
const CLE_BUDGET = (jour: string) => `rt:prospection:recherches:${jour}`
const VERROU = "rt:prospection:preparation"

export interface Conseil extends Prospect {
  rang: number
  raison: string
}
export interface ConseilsDuJour {
  jour: string
  cree: number
  entreprises: Conseil[]
}
export interface Brouillon {
  objet: string
  texte: string
  le: number
}

const attendre = (ms: number) => new Promise((r) => setTimeout(r, ms))

/* ───────────── Classement ───────────── */

const POINTS_EFFECTIF: Record<string, number> = {
  "01": 1,
  "02": 2,
  "03": 3,
  "11": 3.5,
  "12": 3.5,
  "21": 2,
  "22": 1.5,
}

function noter(p: Prospect, jour: string): { score: number; raison: string } {
  const motifs: string[] = []
  let score = 0
  const eff = POINTS_EFFECTIF[p.tranche ?? ""] ?? 0
  if (eff) {
    score += eff
    motifs.push(p.effectif)
  }
  if (activiteLocale(p.codeActivite)) score += 2
  if (p.enseigne) {
    score += 1.5
    motifs.push(`enseigne « ${p.enseigne} »`)
  }
  const annee = p.creation ? Number(p.creation.slice(0, 4)) : NaN
  if (annee && Number(jour.slice(0, 4)) - annee <= 2) {
    score += 2
    motifs.push(`ouverte en ${annee} : besoin de se faire connaître`)
  }
  if (p.siegeAilleurs) {
    score -= 1
    motifs.push(`siège à ${p.siegeAilleurs}`)
  } else {
    score += 1
    motifs.push("décision sur place")
  }
  // Départage stable mais différent chaque jour.
  let h = 0
  for (const c of `${p.siren}${jour}`) h = (h * 31 + c.charCodeAt(0)) >>> 0
  score += (h % 100) / 1000
  return { score, raison: motifs.join(" · ") }
}

/* ───────────── Lecture ───────────── */

export async function lireConseils(jour = jourParis()): Promise<ConseilsDuJour | null> {
  const r = await redis([["GET", CLE_JOUR(jour)]])
  if (typeof r?.[0] !== "string") return null
  try {
    return JSON.parse(r[0]) as ConseilsDuJour
  } catch {
    return null
  }
}

export async function lireBrouillons(sirens: string[]): Promise<Record<string, Brouillon>> {
  if (!sirens.length) return {}
  const r = await redis([["HMGET", CLE_BROUILLONS, ...sirens]])
  const valeurs = (r?.[0] as (string | null)[] | null) ?? []
  const o: Record<string, Brouillon> = {}
  sirens.forEach((s, i) => {
    try {
      if (valeurs[i]) o[s] = JSON.parse(valeurs[i] as string) as Brouillon
    } catch {}
  })
  return o
}

export async function oublierBrouillon(siren: string) {
  await redis([["HDEL", CLE_BROUILLONS, siren]])
}

export async function budgetRestant(jour = jourParis()) {
  const r = await redis([["GET", CLE_BUDGET(jour)]])
  return Math.max(0, RECHERCHES_PAR_JOUR - (Number(r?.[0]) || 0))
}

/* ───────────── Sélection du matin ───────────── */

/** Les 100 conseils du jour, créés une seule fois par jour. */
export async function selectionnerDuJour(jour = jourParis()): Promise<ConseilsDuJour | null> {
  if (!redisActif()) return null
  const deja = await lireConseils(jour)
  if (deja) return deja

  const [suivis, brut, tournee] = await Promise.all([
    lireSuivis().catch(() => ({}) as Record<string, Suivi>),
    redis([["HGETALL", CLE_DEJA]]),
    redis([["HGETALL", CLE_TOURNEE]]),
  ])
  const vus = new Map<string, string>()
  const l = (brut?.[0] as string[] | null) ?? []
  for (let i = 0; i + 1 < l.length; i += 2) vus.set(l[i], l[i + 1])
  const limite = new Date(Date.parse(`${jour}T12:00:00Z`) - OUBLI_JOURS * 86_400_000)
    .toISOString()
    .slice(0, 10)
  const t = (tournee?.[0] as string[] | null) ?? []
  const etat = new Map<string, string>()
  for (let i = 0; i + 1 < t.length; i += 2) etat.set(t[i], t[i + 1])

  const candidats = new Map<string, Prospect>()
  let i = Number(etat.get("i")) || 0
  const pages: [string, string][] = []
  for (let n = 0; n < REQUETES_MAX && candidats.size < POOL; n++) {
    const etape = TOURNEE[i % TOURNEE.length]
    const cle = `${etape.zone}:${etape.secteur}`
    const page = Number(etat.get(cle)) || 1
    i++
    try {
      const res = await rechercherProspects({ ...etape, page, salaries: true })
      pages.push([cle, String(page < res.pages ? page + 1 : 1)])
      for (const p of res.prospects) {
        const s = (suivis as Record<string, Suivi>)[p.siren]
        if (s && s.statut !== "a_contacter") continue
        const quand = vus.get(p.siren)
        if (quand && quand >= limite) continue
        candidats.set(p.siren, p)
      }
    } catch (e) {
      console.error("[conseils] annuaire :", (e as Error).message)
      if (/limite/.test((e as Error).message)) await attendre(1500)
    }
    await attendre(180) // l'annuaire accepte ~7 requêtes par seconde
  }
  if (!candidats.size) return null

  const entreprises = [...candidats.values()]
    .map((p) => ({ p, ...noter(p, jour) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, CONSEILS_PAR_JOUR)
    .map(({ p, raison }, k) => ({ ...p, rang: k + 1, raison }))

  const conseils: ConseilsDuJour = { jour, cree: Date.now(), entreprises }
  // NX : si deux tâches se croisent, la première sélection gagne.
  const ok = await redis([
    ["SET", CLE_JOUR(jour), JSON.stringify(conseils), "NX", "EX", 8 * 86_400],
  ])
  if (ok?.[0] !== "OK") return lireConseils(jour)
  await redis([
    ["HSET", CLE_DEJA, ...entreprises.flatMap((e) => [e.siren, jour])],
    ["HSET", CLE_TOURNEE, "i", String(i % TOURNEE.length), ...pages.flat()],
  ])
  return conseils
}

/* ───────────── Préparation : mails trouvés, messages écrits ───────────── */

export interface EtatPreparation {
  /** Il reste du travail (recherches dans le budget ou messages à écrire). */
  reste: boolean
  budget: number
}

const fiche = (c: Conseil) => ({
  siren: c.siren,
  nom: c.nom,
  enseigne: c.enseigne,
  activite: c.activite,
  adresse: c.adresse,
  commune: c.commune,
})

/** Écrit et range le message d'une entreprise dont on a le mail. */
export async function ecrireBrouillon(
  c: Pick<Conseil, "siren" | "nom" | "enseigne" | "activite" | "commune" | "dirigeant">,
) {
  const r = await proposerMessage({
    consigne: CONSIGNE_MAIL,
    entreprise: {
      nom: c.enseigne ?? c.nom,
      activite: c.activite,
      commune: c.commune,
      dirigeant: c.dirigeant ?? undefined,
    },
  })
  const b: Brouillon = {
    objet: r.objet || `Radio Tripoint × ${c.enseigne ?? c.nom}`,
    texte: r.texte,
    le: Date.now(),
  }
  if (b.texte.trim()) await redis([["HSET", CLE_BROUILLONS, c.siren, JSON.stringify(b)]])
  return b
}

/**
 * Une étape de préparation (≤ ~50 s) : d'abord les recherches de mail dans
 * le budget du jour, trois à la fois, puis les messages, trois à la fois.
 * Appelée par la tâche du matin (qui se relance) et par la page, tant qu'il
 * reste du travail.
 */
export async function preparerUneEtape(jour = jourParis()): Promise<EtatPreparation> {
  const conseils = await lireConseils(jour)
  if (!conseils) return { reste: false, budget: 0 }
  const verrou = await redis([["SET", VERROU, "1", "NX", "EX", 90]])
  if (verrou?.[0] !== "OK") return { reste: true, budget: await budgetRestant(jour) }
  try {
    const tete = conseils.entreprises.slice(0, RECHERCHES_PAR_JOUR)
    const sirens = tete.map((c) => c.siren)
    const [coords, brouillons, suivis] = await Promise.all([
      coordonneesConnues(sirens).catch(() => ({}) as Record<string, Coordonnees>),
      lireBrouillons(sirens),
      lireSuivis().catch(() => ({}) as Record<string, Suivi>),
    ])
    const libre = (c: Conseil) => {
      const s = (suivis as Record<string, Suivi>)[c.siren]
      return !s || s.statut === "a_contacter"
    }

    // 1. Recherches de mail, dans le budget du jour.
    let budget = await budgetRestant(jour)
    const aChercher = tete.filter((c) => libre(c) && !coords[c.siren])
    if (aChercher.length && budget > 0) {
      const lot = aChercher.slice(0, Math.min(3, budget))
      await redis([
        ["INCRBY", CLE_BUDGET(jour), lot.length],
        ["EXPIRE", CLE_BUDGET(jour), 3 * 86_400],
      ])
      budget -= lot.length
      await Promise.allSettled(lot.map((c) => trouverCoordonnees(fiche(c))))
      return { reste: true, budget }
    }

    // 2. Messages pour les entreprises dont on a le mail.
    const aEcrire = tete.filter((c) => libre(c) && coords[c.siren]?.email && !brouillons[c.siren])
    if (aEcrire.length) {
      await Promise.allSettled(aEcrire.slice(0, 3).map((c) => ecrireBrouillon(c)))
      return { reste: aEcrire.length > 3, budget }
    }
    return { reste: false, budget }
  } finally {
    await redis([["DEL", VERROU]])
  }
}
