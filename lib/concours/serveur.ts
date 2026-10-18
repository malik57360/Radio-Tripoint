import "server-only"
import { createHash, randomInt, randomUUID } from "node:crypto"
import { redis } from "@/lib/direction/redis"
import {
  compter,
  DUREE_MS,
  FIN_CONCOURS,
  REPONSE_MIN_MS,
  VILLES_MAX,
  type Reponse,
} from "@/lib/concours/jeu"

/**
 * Concours d'Halloween : parties, scores et classement, dans Redis.
 *
 * - Une partie est ouverte par le serveur (graine tirée ici, heure de
 *   départ notée) et ne sert qu'une fois : GETDEL à l'enregistrement.
 * - Le score est recalculé en rejouant la partie (lib/concours/jeu.ts) ;
 *   une réponse plus rapide que REPONSE_MIN_MS, ou une partie rendue plus
 *   vite qu'elle n'a pu être jouée, est refusée.
 * - Un joueur = une adresse e-mail ; seul son meilleur score compte. À
 *   égalité de points, le premier à avoir atteint le score passe devant.
 * - Tout s'efface 30 jours après la fin du concours (EXPIREAT), comme le
 *   promet le règlement.
 */
const FIN = new Date(FIN_CONCOURS).getTime()
const EFFACEMENT = Math.floor(FIN / 1000) + 30 * 24 * 3600
/** Temps laissé après la partie pour taper son pseudo et son e-mail. */
const VIE_PARTIE_S = 20 * 60

const BASE = "rt:concours:halloween"
const CLE_SCORES = `${BASE}:scores`
const CLE_JOUEURS = `${BASE}:joueurs`
const clePartie = (id: string) => `${BASE}:partie:${id}`

/** Le rang combine points et précocité : points × 10⁹ + (10⁹ − secondes depuis le 1ᵉʳ octobre). */
const REPERE = Date.UTC(2026, 9, 1)
const ECHELLE = 1e9
const rangDe = (points: number, quand: number) =>
  points * ECHELLE + (ECHELLE - Math.floor((quand - REPERE) / 1000))
const pointsDe = (rang: number) => Math.floor(rang / ECHELLE)

export const concoursOuvert = (maintenant = Date.now()) => maintenant < FIN

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
    ["ZADD", CLE_SCORES, "GT", "CH", rangDe(bilan.points, maintenant), joueur],
    ["HSETNX", CLE_JOUEURS, joueur, fiche],
  ])
  if (!r) return { ok: false, erreur: "stockage" }
  const record = Number(r[0]) === 1
  const suite = await redis([
    ...(record ? [["HSET", CLE_JOUEURS, joueur, fiche]] : []),
    ["EXPIREAT", CLE_SCORES, EFFACEMENT],
    ["EXPIREAT", CLE_JOUEURS, EFFACEMENT],
    ["ZREVRANK", CLE_SCORES, joueur],
    ["ZCARD", CLE_SCORES],
    ["ZSCORE", CLE_SCORES, joueur],
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

async function lireClassement(n: number) {
  const r = await redis([
    ["ZREVRANGE", CLE_SCORES, 0, n - 1, "WITHSCORES"],
    ["ZCARD", CLE_SCORES],
  ])
  if (!r) return null
  const brut = (r[0] as string[] | null) ?? []
  const lignes: { joueur: string; points: number }[] = []
  for (let i = 0; i < brut.length; i += 2)
    lignes.push({ joueur: brut[i], points: pointsDe(Number(brut[i + 1])) })
  const fiches = lignes.length
    ? ((await redis([["HMGET", CLE_JOUEURS, ...lignes.map((l) => l.joueur)]]))?.[0] as
        (string | null)[] | undefined)
    : []
  return {
    total: Number(r[1]) || 0,
    lignes: lignes.map((l, i) => {
      const f = fiches?.[i] ? (JSON.parse(fiches[i]!) as Fiche) : null
      return {
        ...l,
        pseudo: f?.pseudo ?? "—",
        email: f?.email ?? "",
        bonnes: f?.bonnes ?? null,
        msMoyen: f?.msMoyen ?? null,
        quand: f?.quand ?? 0,
      }
    }),
  }
}

/** Classement public : pseudos et points, jamais les e-mails. */
export async function classementPublic(n = 10) {
  const c = await lireClassement(n)
  return c && { total: c.total, lignes: c.lignes.map(({ pseudo, points }) => ({ pseudo, points })) }
}

/** Classement du tableau de bord, avec l'e-mail pour joindre le gagnant. */
export const classementDirection = (n = 30) => lireClassement(n)

/** Retire un joueur du classement (triche, pseudo déplacé). */
export async function retirerJoueur(joueur: string) {
  await redis([
    ["ZREM", CLE_SCORES, joueur],
    ["HDEL", CLE_JOUEURS, joueur],
  ])
}
