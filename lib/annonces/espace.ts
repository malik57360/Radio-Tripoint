import "server-only"
import { createHash, randomBytes } from "node:crypto"
import { redis } from "@/lib/direction/redis"
import type { Filtres } from "./recherche"

/**
 * Ce que « Mon espace » ajoute aux annonces : statistiques, favoris,
 * boîte de messages, alertes de recherche et fil d'activité. Tout vit dans
 * Redis, à côté des annonces ; rien n'est inventé : un chiffre affiché est
 * un chiffre compté.
 *
 * - rt:annonces:vues                 id → vues depuis la publication
 * - rt:annonces:vues:AAAA-MM-JJ      id → vues du jour (40 jours)
 * - rt:annonces:nb-favoris           id → nombre de comptes qui l'ont en favori
 * - rt:annonces:favoris:<compte>     annonces mises de côté (date d'ajout)
 * - rt:annonces:boite:<compte>       messages reçus et envoyés (90 jours)
 * - rt:annonces:alertes:<compte>     recherches enregistrées
 * - rt:annonces:comptes-alertes      comptes qui reçoivent des alertes par e-mail
 * - rt:annonces:activite:<compte>    ce qui est arrivé à ses annonces (100 derniers)
 */
const VUES = "rt:annonces:vues"
const VUES_JOUR = (j: string) => `rt:annonces:vues:${j}`
const CONTACTS = "rt:annonces:contacts"
const NB_FAVORIS = "rt:annonces:nb-favoris"
const FAVORIS = (c: string) => `rt:annonces:favoris:${c}`
const BOITE = (c: string) => `rt:annonces:boite:${c}`
const BOITE_ORDRE = (c: string) => `rt:annonces:boite-ordre:${c}`
const ALERTES = (c: string) => `rt:annonces:alertes:${c}`
const AVEC_ALERTES = "rt:annonces:comptes-alertes"
const ACTIVITE = (c: string) => `rt:annonces:activite:${c}`

const JOUR = 24 * 3600 * 1000
export const MAX_FAVORIS = 200
export const MAX_ALERTES = 10
export const DUREE_MESSAGES_JOURS = 90

const lireJson = <T>(v: unknown): T | null => {
  if (typeof v !== "string") return null
  try {
    return JSON.parse(v) as T
  } catch {
    return null
  }
}

/** Jour à Paris, AAAA-MM-JJ. */
export const jourParis = (ms = Date.now()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms))

/* ───────────────────────── Vues ───────────────────────── */

/** Une vue de plus, une seule fois par visiteur et par demi-heure. */
export async function compterVue(id: string, visiteur: string) {
  const qui = createHash("sha256").update(`vue:${visiteur}`).digest("hex").slice(0, 24)
  const r = await redis([["SET", `rt:annonces:vu:${id}:${qui}`, "1", "NX", "EX", 1800]])
  if (r?.[0] !== "OK") return false
  const j = jourParis()
  await redis([
    ["HINCRBY", VUES, id, 1],
    ["HINCRBY", VUES_JOUR(j), id, 1],
    ["EXPIRE", VUES_JOUR(j), 40 * 24 * 3600],
  ])
  return true
}

export interface Stats {
  vues: number
  vues7: number
  vues30: number
  messages: number
  favoris: number
}

/**
 * Chiffres de plusieurs annonces d'un coup, et la courbe des vues de
 * l'ensemble sur 14 jours (du plus ancien au plus récent).
 */
export async function statsAnnonces(ids: string[]) {
  const jours = Array.from({ length: 30 }, (_, i) => jourParis(Date.now() - i * JOUR))
  const vide = {
    parAnnonce: new Map<string, Stats>(),
    courbe: jours
      .slice(0, 14)
      .reverse()
      .map((j) => ({ j, n: 0 })),
  }
  if (!ids.length) return vide
  const r = await redis([
    ["HMGET", VUES, ...ids],
    ["HMGET", CONTACTS, ...ids],
    ["HMGET", NB_FAVORIS, ...ids],
    ...jours.map((j) => ["HMGET", VUES_JOUR(j), ...ids]),
  ])
  if (!r) return vide
  const n = (x: unknown) => Math.max(0, Number(x ?? 0) || 0)
  const col = (k: number) => (r[k] as (string | null)[] | null) ?? []
  const parAnnonce = new Map<string, Stats>()
  ids.forEach((id, i) => {
    let vues7 = 0
    let vues30 = 0
    jours.forEach((_, d) => {
      const v = n(col(3 + d)[i])
      vues30 += v
      if (d < 7) vues7 += v
    })
    parAnnonce.set(id, {
      vues: n(col(0)[i]),
      vues7,
      vues30,
      messages: n(col(1)[i]),
      favoris: n(col(2)[i]),
    })
  })
  const courbe = jours
    .slice(0, 14)
    .map((j, d) => ({ j, n: ids.reduce((t, _, i) => t + n(col(3 + d)[i]), 0) }))
    .reverse()
  return { parAnnonce, courbe }
}

/* ───────────────────────── Favoris ───────────────────────── */

export async function idsFavoris(compte: string) {
  const r = await redis([["ZRANGE", FAVORIS(compte), 0, MAX_FAVORIS - 1, "REV", "WITHSCORES"]])
  const brut = (r?.[0] as string[] | null) ?? []
  const liste: { id: string; le: number }[] = []
  for (let i = 0; i < brut.length; i += 2) liste.push({ id: brut[i], le: Number(brut[i + 1]) })
  return liste
}

/** Ajoute ou retire un favori ; renvoie l'état final (true : en favori). */
export async function basculerFavori(compte: string, id: string, voulu?: boolean) {
  const r = await redis([
    ["ZSCORE", FAVORIS(compte), id],
    ["ZCARD", FAVORIS(compte)],
  ])
  const deja = r?.[0] !== null && r?.[0] !== undefined
  const cible = voulu ?? !deja
  if (cible === deja) return deja
  if (cible) {
    if (Number(r?.[1] ?? 0) >= MAX_FAVORIS) throw new Error(`${MAX_FAVORIS} favoris au plus.`)
    await redis([
      ["ZADD", FAVORIS(compte), Date.now(), id],
      ["HINCRBY", NB_FAVORIS, id, 1],
    ])
  } else {
    const s = await redis([
      ["ZREM", FAVORIS(compte), id],
      ["HINCRBY", NB_FAVORIS, id, -1],
    ])
    if (Number(s?.[1] ?? 0) < 0) await redis([["HSET", NB_FAVORIS, id, 0]])
  }
  return cible
}

/* ───────────────────────── Messages ───────────────────────── */

export interface Message {
  id: string
  sens: "recu" | "envoye"
  annonce: { id: string; titre: string; chemin: string; vignette?: string }
  /** L'autre personne : son nom ; son e-mail seulement s'il nous a écrit (pour lui répondre). */
  avec: { nom: string; email?: string }
  texte: string
  le: number
  lu?: number
}

/**
 * Un message d'acheteur : rangé dans la boîte de l'annonceur (avec
 * l'adresse de l'acheteur, qu'il reçoit déjà en « Répondre à ») et dans les
 * envoyés de l'acheteur (sans l'adresse de l'annonceur, qui reste privée).
 */
export async function rangerMessage(m: {
  annonceur: string
  acheteur: { id: string; nom: string; email: string }
  annonce: Message["annonce"]
  nomAnnonceur: string
  texte: string
}) {
  const le = Date.now()
  const recu: Message = {
    id: randomBytes(6).toString("hex"),
    sens: "recu",
    annonce: m.annonce,
    avec: { nom: m.acheteur.nom, email: m.acheteur.email },
    texte: m.texte,
    le,
  }
  const envoye: Message = {
    id: randomBytes(6).toString("hex"),
    sens: "envoye",
    annonce: m.annonce,
    avec: { nom: m.nomAnnonceur },
    texte: m.texte,
    le,
    lu: le,
  }
  const ttl = DUREE_MESSAGES_JOURS * 24 * 3600
  await redis([
    ["HSET", BOITE(m.annonceur), recu.id, JSON.stringify(recu)],
    ["ZADD", BOITE_ORDRE(m.annonceur), le, recu.id],
    ["EXPIRE", BOITE(m.annonceur), ttl],
    ["EXPIRE", BOITE_ORDRE(m.annonceur), ttl],
    ["HSET", BOITE(m.acheteur.id), envoye.id, JSON.stringify(envoye)],
    ["ZADD", BOITE_ORDRE(m.acheteur.id), le, envoye.id],
    ["EXPIRE", BOITE(m.acheteur.id), ttl],
    ["EXPIRE", BOITE_ORDRE(m.acheteur.id), ttl],
  ])
}

/** La boîte, les plus récents d'abord ; les messages de plus de 90 jours sont effacés au passage. */
export async function lireBoite(compte: string): Promise<Message[]> {
  const limite = Date.now() - DUREE_MESSAGES_JOURS * JOUR
  const vieux = await redis([["ZRANGE", BOITE_ORDRE(compte), "-inf", limite, "BYSCORE"]])
  const aEffacer = (vieux?.[0] as string[] | null) ?? []
  if (aEffacer.length)
    await redis([
      ["HDEL", BOITE(compte), ...aEffacer],
      ["ZREM", BOITE_ORDRE(compte), ...aEffacer],
    ])
  const r = await redis([["HGETALL", BOITE(compte)]])
  const brut = (r?.[0] as string[] | null) ?? []
  const liste: Message[] = []
  for (let i = 1; i < brut.length; i += 2) {
    const m = lireJson<Message>(brut[i])
    if (m && m.le >= limite) liste.push(m)
  }
  return liste.sort((a, b) => b.le - a.le)
}

export async function nonLus(compte: string) {
  return (await lireBoite(compte)).filter((m) => m.sens === "recu" && !m.lu).length
}

export async function marquerLus(compte: string, messages: Message[]) {
  const lus = messages.filter((m) => m.sens === "recu" && !m.lu)
  if (!lus.length) return
  const le = Date.now()
  await redis([
    ["HSET", BOITE(compte), ...lus.flatMap((m) => [m.id, JSON.stringify({ ...m, lu: le })])],
  ])
}

export async function supprimerMessage(compte: string, id: string) {
  await redis([
    ["HDEL", BOITE(compte), id],
    ["ZREM", BOITE_ORDRE(compte), id],
  ])
}

/* ───────────────────────── Alertes ───────────────────────── */

export interface Alerte {
  id: string
  nom: string
  filtres: Filtres
  email: boolean
  creeLe: number
  /** Dernière visite des résultats depuis « Mon espace ». */
  vuLe: number
  /** Dernier e-mail d'alerte (ou création). */
  envoyeLe: number
}

export async function lireAlertes(compte: string): Promise<Alerte[]> {
  const r = await redis([["HGETALL", ALERTES(compte)]])
  const brut = (r?.[0] as string[] | null) ?? []
  const liste: Alerte[] = []
  for (let i = 1; i < brut.length; i += 2) {
    const a = lireJson<Alerte>(brut[i])
    if (a) liste.push(a)
  }
  return liste.sort((a, b) => b.creeLe - a.creeLe)
}

async function tenirIndexAlertes(compte: string) {
  const avecEmail = (await lireAlertes(compte)).some((a) => a.email)
  await redis([[avecEmail ? "SADD" : "SREM", AVEC_ALERTES, compte]])
}

export async function creerAlerte(compte: string, nom: string, filtres: Filtres) {
  const toutes = await lireAlertes(compte)
  if (toutes.length >= MAX_ALERTES) throw new Error(`${MAX_ALERTES} alertes au plus.`)
  const cle = JSON.stringify(filtres)
  const pareille = toutes.find((a) => JSON.stringify(a.filtres) === cle)
  if (pareille) return pareille
  const maintenant = Date.now()
  const a: Alerte = {
    id: randomBytes(6).toString("hex"),
    nom: nom.slice(0, 80),
    filtres,
    email: true,
    creeLe: maintenant,
    vuLe: maintenant,
    envoyeLe: maintenant,
  }
  await redis([["HSET", ALERTES(compte), a.id, JSON.stringify(a)]])
  await tenirIndexAlertes(compte)
  return a
}

export async function modifierAlerte(
  compte: string,
  id: string,
  m: Partial<Pick<Alerte, "email" | "vuLe" | "envoyeLe" | "nom">>,
) {
  const r = await redis([["HGET", ALERTES(compte), id]])
  const a = lireJson<Alerte>(r?.[0])
  if (!a) return null
  Object.assign(a, m)
  await redis([["HSET", ALERTES(compte), id, JSON.stringify(a)]])
  if ("email" in m) await tenirIndexAlertes(compte)
  return a
}

export async function supprimerAlerte(compte: string, id: string) {
  await redis([["HDEL", ALERTES(compte), id]])
  await tenirIndexAlertes(compte)
}

export async function comptesAvecAlertes() {
  const r = await redis([["SMEMBERS", AVEC_ALERTES]])
  return (r?.[0] as string[] | null) ?? []
}

/* ───────────────────────── Activité ───────────────────────── */

export type TypeActivite =
  | "depot"
  | "paiement"
  | "publiee"
  | "refusee"
  | "retiree"
  | "vendue"
  | "expiree"
  | "signalee"
  | "modifiee"
  | "options"
  | "message"

export interface Activite {
  type: TypeActivite
  annonce?: { id: string; titre: string }
  detail?: string
  le: number
}

/** Ne fait jamais échouer l'action qui l'appelle. */
export async function noterActivite(compte: string, a: Omit<Activite, "le">) {
  try {
    await redis([
      ["LPUSH", ACTIVITE(compte), JSON.stringify({ ...a, le: Date.now() })],
      ["LTRIM", ACTIVITE(compte), 0, 99],
    ])
  } catch {
    /* le fil d'activité n'est qu'un confort */
  }
}

export async function lireActivite(compte: string, max = 30): Promise<Activite[]> {
  const r = await redis([["LRANGE", ACTIVITE(compte), 0, max - 1]])
  return ((r?.[0] as string[] | null) ?? []).flatMap((v) => {
    const a = lireJson<Activite>(v)
    return a ? [a] : []
  })
}

/* ───────────────────────── Compte ───────────────────────── */

/** Suppression du compte (RGPD) : tout ce que « Mon espace » range pour lui. */
export async function effacerEspace(compte: string) {
  const favoris = await idsFavoris(compte)
  await redis([
    ...favoris.map((f) => ["HINCRBY", NB_FAVORIS, f.id, -1]),
    ["DEL", FAVORIS(compte)],
    ["DEL", BOITE(compte)],
    ["DEL", BOITE_ORDRE(compte)],
    ["DEL", ALERTES(compte)],
    ["SREM", AVEC_ALERTES, compte],
    ["DEL", ACTIVITE(compte)],
  ])
}
