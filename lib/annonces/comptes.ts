import "server-only"
import { createHash, randomBytes, scrypt as scryptRappel, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import { cookies } from "next/headers"
import type { Verification } from "@/lib/agenda/propositions"
import { redis } from "@/lib/direction/redis"
import type { Pays } from "./categories"

/**
 * Comptes des Petites annonces : e-mail + mot de passe.
 *
 * - Mot de passe haché avec scrypt (sel aléatoire, paramètres rangés avec
 *   le haché) : il n'est jamais stocké ni journalisé en clair.
 * - Session : un jeton aléatoire dans un cookie httpOnly ; Redis ne garde
 *   que son empreinte. Bloquer un compte ou changer de mot de passe ferme
 *   toutes ses sessions.
 * - Jetons à usage unique (vérification de l'e-mail, mot de passe oublié) :
 *   eux aussi rangés hachés, avec une durée de vie courte.
 */
const scrypt = promisify(scryptRappel) as (
  mdp: string,
  sel: Buffer,
  long: number,
  opts: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>

export const COOKIE_ANNONCES = "rt_annonces"
const DUREE_SESSION_S = 30 * 24 * 3600

const CLE = (id: string) => `rt:annonces:compte:${id}`
const CLE_EMAIL = (email: string) => `rt:annonces:email:${email}`
const INDEX = "rt:annonces:comptes"
const SESSION = (empreinte: string) => `rt:annonces:session:${empreinte}`
const SESSIONS_DU_COMPTE = (id: string) => `rt:annonces:sessions:${id}`
const JETON = (empreinte: string) => `rt:annonces:jeton:${empreinte}`

export const EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i
export const normaliserEmail = (e: string) => e.trim().toLowerCase()
export const idCompteValide = (id: unknown): id is string =>
  typeof id === "string" && /^[a-f0-9]{12}$/.test(id)

export interface InfosPro {
  raisonSociale: string
  /** SIRET (FR), RCS (LU), Handelsregister (DE). */
  identifiant: string
  pays: Pays
  adresse: string
  codePostal: string
  ville: string
  telephone: string
  site?: string
  /** Engagement de ne proposer que des produits et services conformes (date). */
  engagement: number
  verification?: Verification
  /** Vérifié à la main par la modération (registre LU / DE, ou doute levé). */
  valideParModeration?: number
}

export interface Compte {
  id: string
  email: string
  hache: string
  /** Prénom ou pseudo : seul nom affiché pour un particulier. */
  nom: string
  type: "particulier" | "pro"
  pro?: InfosPro
  emailVerifie: number | null
  bloque?: { le: number; motif: string }
  creeLe: number
  majLe: number
  derniereConnexion?: number
}

/* ───────────────────────── Mot de passe ───────────────────────── */

// Équivalent recommandé par l'OWASP : N = 2^15, r = 8, p = 3 (32 Mo).
const N = 2 ** 15
const R = 8
const P = 3

export async function hacher(mdp: string) {
  const sel = randomBytes(16)
  const h = await scrypt(mdp.normalize("NFKC"), sel, 64, {
    N,
    r: R,
    p: P,
    maxmem: 96 * 1024 * 1024,
  })
  return `scrypt$${N}$${R}$${P}$${sel.toString("base64")}$${h.toString("base64")}`
}

export async function motDePasseCorrect(mdp: string, hache: string) {
  const [algo, n, r, p, sel, h] = hache.split("$")
  if (algo !== "scrypt" || !sel || !h) return false
  const attendu = Buffer.from(h, "base64")
  const calcule = await scrypt(mdp.normalize("NFKC"), Buffer.from(sel, "base64"), attendu.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: 96 * 1024 * 1024,
  })
  return calcule.length === attendu.length && timingSafeEqual(calcule, attendu)
}

/** Haché factice : une adresse inconnue coûte le même temps qu'un mauvais mot de passe. */
let hacheFactice: Promise<string> | null = null
export async function perdreDuTemps(mdp: string) {
  hacheFactice ??= hacher("radio-tripoint-mot-de-passe-factice")
  await motDePasseCorrect(mdp, await hacheFactice)
}

export function motDePasseAcceptable(mdp: string): string | null {
  if (mdp.length < 10) return "Le mot de passe doit faire au moins 10 caractères."
  if (mdp.length > 200) return "Le mot de passe est trop long."
  if (/^(.)\1+$/.test(mdp) || /^(0123456789|1234567890|azertyuiop|qwertyuiop)/i.test(mdp))
    return "Ce mot de passe est trop facile à deviner."
  return null
}

/* ───────────────────────── Stockage ───────────────────────── */

const lireJson = <T>(v: unknown): T | null => {
  if (typeof v !== "string") return null
  try {
    return JSON.parse(v) as T
  } catch {
    return null
  }
}

export async function lireCompte(id: string): Promise<Compte | null> {
  if (!idCompteValide(id)) return null
  const r = await redis([["GET", CLE(id)]])
  return lireJson<Compte>(r?.[0])
}

export async function compteParEmail(email: string) {
  const r = await redis([["GET", CLE_EMAIL(normaliserEmail(email))]])
  return typeof r?.[0] === "string" ? lireCompte(r[0]) : null
}

export async function enregistrerCompte(c: Compte) {
  c.majLe = Date.now()
  const ok = await redis([["SET", CLE(c.id), JSON.stringify(c)]])
  if (!ok || ok[0] !== "OK") throw new Error("stockage indisponible")
}

/** Crée le compte ; null si l'adresse a déjà un compte. */
export async function creerCompte(d: Pick<Compte, "email" | "nom" | "type" | "pro">, mdp: string) {
  const id = randomBytes(6).toString("hex")
  const email = normaliserEmail(d.email)
  // Réservation de l'adresse d'abord : deux inscriptions simultanées n'en créent qu'une.
  const pris = await redis([["SET", CLE_EMAIL(email), id, "NX"]])
  if (!pris) throw new Error("stockage indisponible")
  if (pris[0] !== "OK") return null
  const c: Compte = {
    ...d,
    id,
    email,
    hache: await hacher(mdp),
    emailVerifie: null,
    creeLe: Date.now(),
    majLe: Date.now(),
  }
  const ok = await redis([
    ["SET", CLE(id), JSON.stringify(c)],
    ["ZADD", INDEX, c.creeLe, id],
  ])
  if (!ok || ok[0] !== "OK") {
    await redis([["DEL", CLE_EMAIL(email)]])
    throw new Error("stockage indisponible")
  }
  return c
}

export async function listerComptes(max = 500): Promise<Compte[]> {
  const ids = await redis([["ZRANGE", INDEX, 0, max - 1, "REV"]])
  const liste = (ids?.[0] as string[] | null) ?? []
  if (!liste.length) return []
  const r = await redis([["MGET", ...liste.map(CLE)]])
  return ((r?.[0] as unknown[] | null) ?? []).flatMap((v) => {
    const c = lireJson<Compte>(v)
    return c ? [c] : []
  })
}

/** Suppression (RGPD) : le compte et son adresse. Les annonces sont traitées à part. */
export async function supprimerCompte(c: Compte) {
  await revoquerSessions(c.id)
  await redis([
    ["DEL", CLE(c.id)],
    ["DEL", CLE_EMAIL(c.email)],
    ["ZREM", INDEX, c.id],
  ])
}

/* ───────────────────────── Sessions ───────────────────────── */

const empreinte = (jeton: string) => createHash("sha256").update(jeton).digest("hex")

export async function ouvrirSession(c: Compte) {
  const jeton = randomBytes(32).toString("base64url")
  const e = empreinte(jeton)
  const ok = await redis([
    ["SET", SESSION(e), c.id, "EX", DUREE_SESSION_S],
    ["SADD", SESSIONS_DU_COMPTE(c.id), e],
    ["EXPIRE", SESSIONS_DU_COMPTE(c.id), DUREE_SESSION_S],
  ])
  if (!ok || ok[0] !== "OK") throw new Error("stockage indisponible")
  ;(await cookies()).set(COOKIE_ANNONCES, jeton, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: DUREE_SESSION_S,
  })
  c.derniereConnexion = Date.now()
  await enregistrerCompte(c)
}

/** Le compte connecté, ou null (pas de cookie, session expirée, compte bloqué ou supprimé). */
export async function compteConnecte(): Promise<Compte | null> {
  const jeton = (await cookies()).get(COOKIE_ANNONCES)?.value
  if (!jeton || jeton.length > 100) return null
  const r = await redis([["GET", SESSION(empreinte(jeton))]])
  const id = r?.[0]
  if (typeof id !== "string") return null
  const c = await lireCompte(id)
  return c && !c.bloque ? c : null
}

export async function fermerSession() {
  const pot = await cookies()
  const jeton = pot.get(COOKIE_ANNONCES)?.value
  if (jeton) await redis([["DEL", SESSION(empreinte(jeton))]])
  pot.delete(COOKIE_ANNONCES)
}

/** Appareils connectés (sessions ouvertes) du compte. */
export async function nombreSessions(id: string) {
  const r = await redis([["SCARD", SESSIONS_DU_COMPTE(id)]])
  return Number(r?.[0] ?? 0) || 0
}

export async function revoquerSessions(id: string) {
  const r = await redis([["SMEMBERS", SESSIONS_DU_COMPTE(id)]])
  const liste = (r?.[0] as string[] | null) ?? []
  await redis([...liste.map((e) => ["DEL", SESSION(e)]), ["DEL", SESSIONS_DU_COMPTE(id)]])
}

/* ───────────────────────── Jetons à usage unique ───────────────────────── */

export type TypeJeton = "verification" | "reinitialisation"
const DUREES_JETON: Record<TypeJeton, number> = { verification: 48 * 3600, reinitialisation: 3600 }

export async function creerJeton(type: TypeJeton, compte: string) {
  const jeton = randomBytes(24).toString("base64url")
  const ok = await redis([
    ["SET", JETON(empreinte(jeton)), JSON.stringify({ type, compte }), "EX", DUREES_JETON[type]],
  ])
  if (!ok || ok[0] !== "OK") throw new Error("stockage indisponible")
  return jeton
}

/** Consomme le jeton : il ne sert qu'une fois. Renvoie le compte concerné. */
export async function consommerJeton(type: TypeJeton, jeton: string) {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(jeton)) return null
  const r = await redis([["GETDEL", JETON(empreinte(jeton))]])
  const d = lireJson<{ type: TypeJeton; compte: string }>(r?.[0])
  return d?.type === type ? lireCompte(d.compte) : null
}

/** Lit le jeton sans le consommer (afficher le formulaire de nouveau mot de passe). */
export async function jetonValide(type: TypeJeton, jeton: string) {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(jeton)) return false
  const r = await redis([["GET", JETON(empreinte(jeton))]])
  return lireJson<{ type: TypeJeton }>(r?.[0])?.type === type
}

/** Nom public d'un annonceur : la raison sociale d'un pro, le prénom d'un particulier. */
export const nomPublic = (c: Pick<Compte, "nom" | "type" | "pro">) =>
  c.type === "pro" && c.pro ? c.pro.raisonSociale : c.nom
