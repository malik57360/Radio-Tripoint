import "server-only"
import { createHash, randomInt, randomUUID } from "node:crypto"
import { jourParis, redis } from "@/lib/direction/redis"
import {
  compter,
  DUREE_MS,
  FIN_CONCOURS,
  HEURE_TIRAGE,
  REPONSE_MIN_MS,
  VILLES_MAX,
  type Reponse,
} from "@/lib/concours/jeu"

/**
 * Concours d'Halloween : parties, scores et classements, dans Redis.
 *
 * - Le concours se joue en manches d'un jour. Une manche porte la date du
 *   jour dont le tirage de 18 h (heure de Paris) la clôt : une partie
 *   commencée lundi à 17 h 59 compte pour lundi, à 18 h pour mardi.
 * - Une partie est ouverte par le serveur (graine tirée ici, heure de
 *   départ notée) et ne sert qu'une fois : GETDEL à l'enregistrement.
 * - Le score est recalculé en rejouant la partie (lib/concours/jeu.ts) ;
 *   une réponse plus rapide que REPONSE_MIN_MS, ou une partie rendue plus
 *   vite qu'elle n'a pu être jouée, est refusée.
 * - Un joueur = une adresse e-mail ; seul son meilleur score de la manche
 *   compte. À égalité de points, le premier à avoir atteint le score passe
 *   devant.
 * - Tout s'efface 30 jours après la fin du concours (EXPIREAT), comme le
 *   promet le règlement.
 */
const FIN = new Date(FIN_CONCOURS).getTime()
const EFFACEMENT = Math.floor(FIN / 1000) + 30 * 24 * 3600
/** Temps laissé après la partie pour taper son pseudo et son e-mail : le classement d'une manche est définitif à 18 h 10. */
const VIE_PARTIE_S = 10 * 60

const BASE = "rt:concours:halloween"
/** La première manche a commencé avant le passage aux manches quotidiennes : elle garde les clés d'origine. */
const PREMIERE_MANCHE = "2026-10-19"
const cleScores = (jour: string) =>
  jour === PREMIERE_MANCHE ? `${BASE}:scores` : `${BASE}:manche:${jour}:scores`
const cleFiches = (jour: string) =>
  jour === PREMIERE_MANCHE ? `${BASE}:joueurs` : `${BASE}:manche:${jour}:joueurs`
const clePartie = (id: string) => `${BASE}:partie:${id}`

/** Le rang combine points et précocité : points × 10⁹ + (10⁹ − secondes depuis le 1ᵉʳ octobre). */
const REPERE = Date.UTC(2026, 9, 1)
const ECHELLE = 1e9
const rangDe = (points: number, quand: number) =>
  points * ECHELLE + (ECHELLE - Math.floor((quand - REPERE) / 1000))
const pointsDe = (rang: number) => Math.floor(rang / ECHELLE)

export const concoursOuvert = (maintenant = Date.now()) => maintenant < FIN

/** Manche d'un instant : 18 h + 6 h = minuit, la date de Paris six heures plus tard. */
export const mancheDe = (t: number) => jourParis(new Date(t + (24 - HEURE_TIRAGE) * 3600 * 1000))

/** La manche en cours ; une fois le concours fini, la dernière. */
export const mancheCourante = (maintenant = Date.now()) => mancheDe(Math.min(maintenant, FIN - 1))

/** L'heure à Paris, en nombre (« en-GB » : « 18 », là où le français écrit « 18 h »). */
const heureParis = (d: Date) =>
  Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(d),
  )

/** Instant du tirage d'une manche : 18 h à Paris ce jour-là (heure d'été ou d'hiver). */
export function tirageDe(jour: string) {
  for (const decalage of ["+02:00", "+01:00"]) {
    const d = new Date(`${jour}T${HEURE_TIRAGE}:00:00${decalage}`)
    if (heureParis(d) === HEURE_TIRAGE) return d.getTime()
  }
  return new Date(`${jour}T${HEURE_TIRAGE}:00:00+01:00`).getTime()
}

/** Les manches déjà tirées, de la première à la plus récente. */
function manchesTirees(maintenant = Date.now()) {
  const jours: string[] = []
  for (let j = PREMIERE_MANCHE; tirageDe(j) <= Math.min(maintenant, FIN);) {
    jours.push(j)
    const d = new Date(`${j}T12:00:00Z`)
    d.setUTCDate(d.getUTCDate() + 1)
    j = d.toISOString().slice(0, 10)
  }
  return jours
}

export const PSEUDO = /^[\p{L}\p{N}][\p{L}\p{N} ._'-]{1,19}$/u

/** Identifiant d'un joueur : empreinte de son e-mail (l'e-mail lui-même n'est jamais une clé). */
export const joueurDe = (email: string) =>
  createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 24)

/** Ouvre une partie ; null si le stockage ne répond pas. */
export async function ouvrirPartie(): Promise<{ id: string; graine: number } | null> {
  const id = randomUUID()
  const graine = randomInt(0, 2 ** 32)
  const r = await redis([
    ["SET", clePartie(id), JSON.stringify({ graine, debut: Date.now() }), "EX", VIE_PARTIE_S],
  ])
  return r?.[0] === "OK" ? { id, graine } : null
}

export type Enregistrement =
  | {
      ok: true
      points: number
      bonnes: number
      meilleur: number
      record: boolean
      rang: number
      total: number
    }
  | { ok: false; erreur: "partie" | "invalide" | "ferme" | "stockage" }

export async function enregistrerScore(e: {
  id: string
  reponses: Reponse[]
  pseudo: string
  email: string
}): Promise<Enregistrement> {
  const lu = await redis([["GETDEL", clePartie(e.id)]])
  if (!lu) return { ok: false, erreur: "stockage" }
  if (typeof lu[0] !== "string") return { ok: false, erreur: "partie" }
  const { graine, debut } = JSON.parse(lu[0]) as { graine: number; debut: number }
  if (!concoursOuvert(debut)) return { ok: false, erreur: "ferme" }

  const maintenant = Date.now()
  if (
    e.reponses.length > VILLES_MAX ||
    e.reponses.some((r) => !Number.isInteger(r.ms) || r.ms < REPONSE_MIN_MS || r.ms > DUREE_MS)
  )
    return { ok: false, erreur: "invalide" }
  const bilan = compter(graine, e.reponses)
  // La partie ne peut pas avoir été jouée plus vite que le temps passé devant les villes.
  if (maintenant - debut + 3000 < bilan.tempsMs) return { ok: false, erreur: "invalide" }

  // La partie compte pour la manche où elle a commencé.
  const jour = mancheDe(debut)
  const scores = cleScores(jour)
  const fiches = cleFiches(jour)
  const joueur = joueurDe(e.email)
  const fiche = JSON.stringify({
    pseudo: e.pseudo,
    email: e.email.trim().toLowerCase(),
    points: bilan.points,
    // Pour repérer une main trop régulière dans le tableau de bord.
    bonnes: bilan.bonnes,
    msMoyen: bilan.comptees ? Math.round(bilan.tempsMs / bilan.comptees) : 0,
    quand: maintenant,
  })
  const r = await redis([
    ["ZADD", scores, "GT", "CH", rangDe(bilan.points, maintenant), joueur],
    ["HSETNX", fiches, joueur, fiche],
  ])
  if (!r) return { ok: false, erreur: "stockage" }
  const record = Number(r[0]) === 1
  const suite = await redis([
    ...(record ? [["HSET", fiches, joueur, fiche]] : []),
    ["EXPIREAT", scores, EFFACEMENT],
    ["EXPIREAT", fiches, EFFACEMENT],
    ["ZREVRANK", scores, joueur],
    ["ZCARD", scores],
    ["ZSCORE", scores, joueur],
  ])
  if (!suite) return { ok: false, erreur: "stockage" }
  const [rang, total, meilleur] = suite.slice(-3)
  return {
    ok: true,
    points: bilan.points,
    bonnes: bilan.bonnes,
    meilleur: pointsDe(Number(meilleur)),
    record,
    rang: Number(rang) + 1,
    total: Number(total),
  }
}

type Fiche = {
  pseudo: string
  email: string
  points: number
  bonnes?: number
  msMoyen?: number
  quand: number
}

const ligneDe = (joueur: string, points: number, brut: string | null | undefined) => {
  const f = brut ? (JSON.parse(brut) as Fiche) : null
  return {
    joueur,
    points,
    pseudo: f?.pseudo ?? "—",
    email: f?.email ?? "",
    bonnes: f?.bonnes ?? null,
    msMoyen: f?.msMoyen ?? null,
    quand: f?.quand ?? 0,
  }
}

async function lireManche(jour: string, n: number) {
  const r = await redis([
    ["ZREVRANGE", cleScores(jour), 0, n - 1, "WITHSCORES"],
    ["ZCARD", cleScores(jour)],
  ])
  if (!r) return null
  const brut = (r[0] as string[] | null) ?? []
  const lignes: { joueur: string; points: number }[] = []
  for (let i = 0; i < brut.length; i += 2)
    lignes.push({ joueur: brut[i], points: pointsDe(Number(brut[i + 1])) })
  const fiches = lignes.length
    ? ((await redis([["HMGET", cleFiches(jour), ...lignes.map((l) => l.joueur)]]))?.[0] as
        (string | null)[] | undefined)
    : []
  return {
    jour,
    tirage: tirageDe(jour),
    total: Number(r[1]) || 0,
    lignes: lignes.map((l, i) => ligneDe(l.joueur, l.points, fiches?.[i])),
  }
}

/** Le gagnant de chaque manche déjà tirée (une manche sans joueur n'a pas de gagnant). */
async function lireGagnants() {
  const jours = manchesTirees()
  if (!jours.length) return []
  const tetes = await redis(jours.map((j) => ["ZREVRANGE", cleScores(j), 0, 0, "WITHSCORES"]))
  if (!tetes) return []
  const premiers = jours
    .map((jour, i) => {
      const t = (tetes[i] as string[] | null) ?? []
      return t.length ? { jour, joueur: t[0], points: pointsDe(Number(t[1])) } : null
    })
    .filter((g) => g !== null)
  const fiches = premiers.length
    ? await redis(premiers.map((g) => ["HGET", cleFiches(g.jour), g.joueur]))
    : []
  return premiers.map((g, i) => ({
    jour: g.jour,
    ...ligneDe(g.joueur, g.points, fiches?.[i] as string | null),
  }))
}

/** Classement public : la manche en cours et les gagnants passés, pseudos et points seulement. */
export async function classementPublic(n = 10) {
  const [c, gagnants] = await Promise.all([lireManche(mancheCourante(), n), lireGagnants()])
  return (
    c && {
      manche: c.jour,
      tirage: c.tirage,
      // Le tirage de la manche tombe-t-il aujourd'hui (sinon demain : il est plus de 18 h) ?
      aujourdhui: c.jour === jourParis(),
      termine: !concoursOuvert(),
      total: c.total,
      lignes: c.lignes.map(({ pseudo, points }) => ({ pseudo, points })),
      gagnants: gagnants.map(({ jour, pseudo, points }) => ({ jour, pseudo, points })),
    }
  )
}

/** Tableau de bord : la manche en cours et les gagnants, avec l'e-mail pour les prévenir. */
export async function classementDirection(n = 30) {
  const [c, gagnants] = await Promise.all([lireManche(mancheCourante(), n), lireGagnants()])
  return c && { ...c, gagnants }
}

/** Retire un joueur d'une manche (triche, pseudo déplacé) : le suivant prend sa place. */
export async function retirerJoueur(joueur: string, jour: string) {
  await redis([
    ["ZREM", cleScores(jour), joueur],
    ["HDEL", cleFiches(jour), joueur],
  ])
}
