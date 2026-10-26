import "server-only"
import { createHash, randomBytes } from "node:crypto"
import { redis } from "@/lib/direction/redis"

/**
 * La messagerie des Petites annonces, comme sur les sites de vente entre
 * particuliers : une discussion par annonce et par acheteur, des messages
 * qui restent sur le site (aucune adresse e-mail n'est échangée), un
 * e-mail pour prévenir qu'un message attend.
 *
 * - rt:annonces:disc:<id>          la discussion (annonce, participants, noms,
 *                                  dernier message, lu jusqu'à… pour chacun)
 * - rt:annonces:disc:<id>:fil      les messages, du plus ancien au plus récent
 * - rt:annonces:discs:<compte>     ses discussions, par dernière activité
 * - rt:annonces:non-lus:<compte>   discussion → messages non lus
 *
 * Une discussion s'efface 90 jours après son dernier message.
 */
const DISC = (id: string) => `rt:annonces:disc:${id}`
const FIL = (id: string) => `rt:annonces:disc:${id}:fil`
const DISCS = (c: string) => `rt:annonces:discs:${c}`
const NON_LUS = (c: string) => `rt:annonces:non-lus:${c}`
const NOTIFIE = (id: string, c: string) => `rt:annonces:disc-notif:${id}:${c}`

export const DUREE_DISCUSSION_JOURS = 90
const TTL = DUREE_DISCUSSION_JOURS * 24 * 3600
const MAX_FIL = 500
export const MAX_MESSAGE = 2000

export interface MessageDiscussion {
  id: string
  /** Compte qui a écrit. */
  de: string
  texte: string
  le: number
}

export interface Discussion {
  id: string
  annonce: { id: string; titre: string; chemin: string; vignette?: string; prix?: string }
  vendeur: string
  acheteur: string
  /** Noms publics au moment de la première prise de contact. */
  noms: Record<string, string>
  pros: string[]
  creeLe: number
  maj: number
  dernier?: MessageDiscussion
  /** Jusqu'où chacun a lu (date du dernier passage dans la discussion). */
  lu: Record<string, number>
}

const lireJson = <T>(v: unknown): T | null => {
  if (typeof v !== "string") return null
  try {
    return JSON.parse(v) as T
  } catch {
    return null
  }
}

/** Une seule discussion par annonce et par acheteur : son identifiant s'en déduit. */
export const idDiscussion = (annonce: string, acheteur: string) =>
  createHash("sha256").update(`disc:${annonce}:${acheteur}`).digest("hex").slice(0, 20)
export const idDiscussionValide = (id: string) => /^[0-9a-f]{20}$/.test(id)

function depuisHash(brut: unknown): Discussion | null {
  const t = (brut as string[] | null) ?? []
  if (!t.length) return null
  const h: Record<string, string> = {}
  for (let i = 0; i < t.length; i += 2) h[t[i]] = t[i + 1]
  const annonce = lireJson<Discussion["annonce"]>(h.annonce)
  if (!h.id || !annonce || !h.vendeur || !h.acheteur) return null
  const lu: Record<string, number> = {}
  for (const [k, v] of Object.entries(h)) if (k.startsWith("lu:")) lu[k.slice(3)] = Number(v)
  return {
    id: h.id,
    annonce,
    vendeur: h.vendeur,
    acheteur: h.acheteur,
    noms: lireJson<Record<string, string>>(h.noms) ?? {},
    pros: lireJson<string[]>(h.pros) ?? [],
    creeLe: Number(h.creeLe) || 0,
    maj: Number(h.maj) || 0,
    dernier: lireJson<MessageDiscussion>(h.dernier) ?? undefined,
    lu,
  }
}

export async function lireDiscussion(id: string) {
  if (!idDiscussionValide(id)) return null
  const r = await redis([["HGETALL", DISC(id)]])
  return depuisHash(r?.[0])
}

export const participe = (d: Discussion, compte: string) =>
  d.vendeur === compte || d.acheteur === compte
export const autreParticipant = (d: Discussion, compte: string) =>
  d.vendeur === compte ? d.acheteur : d.vendeur

/**
 * Un message de plus. À la première prise de contact, la discussion se crée
 * avec ce qu'il faut pour l'afficher sans relire l'annonce (titre, photo, prix).
 */
export async function ecrire(o: {
  id: string
  de: string
  texte: string
  creation?: Omit<Discussion, "id" | "creeLe" | "maj" | "dernier" | "lu">
}) {
  const le = Date.now()
  const m: MessageDiscussion = {
    id: `${le.toString(36)}${randomBytes(3).toString("hex")}`,
    de: o.de,
    texte: o.texte,
    le,
  }
  const d = o.creation ? null : await lireDiscussion(o.id)
  const vendeur = o.creation?.vendeur ?? d?.vendeur
  const acheteur = o.creation?.acheteur ?? d?.acheteur
  if (!vendeur || !acheteur) throw new Error("discussion introuvable")
  const autre = o.de === vendeur ? acheteur : vendeur
  const creation = o.creation
    ? [
        "HSET",
        DISC(o.id),
        "id",
        o.id,
        "annonce",
        JSON.stringify(o.creation.annonce),
        "vendeur",
        vendeur,
        "acheteur",
        acheteur,
        "noms",
        JSON.stringify(o.creation.noms),
        "pros",
        JSON.stringify(o.creation.pros),
        "creeLe",
        le,
      ]
    : null
  const r = await redis([
    ...(creation ? [creation] : []),
    ["RPUSH", FIL(o.id), JSON.stringify(m)],
    ["LTRIM", FIL(o.id), -MAX_FIL, -1],
    ["HSET", DISC(o.id), "maj", le, "dernier", JSON.stringify(m), `lu:${o.de}`, le],
    ["EXPIRE", DISC(o.id), TTL],
    ["EXPIRE", FIL(o.id), TTL],
    ["ZADD", DISCS(vendeur), le, o.id],
    ["ZADD", DISCS(acheteur), le, o.id],
    ["EXPIRE", DISCS(vendeur), TTL],
    ["EXPIRE", DISCS(acheteur), TTL],
    ["HINCRBY", NON_LUS(autre), o.id, 1],
    ["EXPIRE", NON_LUS(autre), TTL],
    ["HDEL", NON_LUS(o.de), o.id],
  ])
  if (!r) throw new Error("messagerie indisponible")
  return m
}

/** Les messages postérieurs à `apres` (les 200 derniers au plus). */
export async function lireFil(id: string, apres = 0) {
  const r = await redis([["LRANGE", FIL(id), -200, -1]])
  return ((r?.[0] as string[] | null) ?? [])
    .map((x) => lireJson<MessageDiscussion>(x))
    .filter((m): m is MessageDiscussion => !!m && m.le > apres)
}

/** Ouvrir une discussion la marque comme lue ; renvoie vrai s'il y avait du neuf. */
export async function marquerLue(id: string, compte: string) {
  const r = await redis([
    ["HSET", DISC(id), `lu:${compte}`, Date.now()],
    ["HDEL", NON_LUS(compte), id],
  ])
  return Number(r?.[1] ?? 0) > 0
}

export async function totalNonLus(compte: string) {
  const r = await redis([["HVALS", NON_LUS(compte)]])
  return ((r?.[0] as string[] | null) ?? []).reduce((t, n) => t + Math.max(0, Number(n) || 0), 0)
}

export interface ResumeDiscussion extends Discussion {
  nonLus: number
}

/** Ses discussions, la plus récente d'abord ; celles qui ont expiré sont rangées au passage. */
export async function mesDiscussions(compte: string, max = 100): Promise<ResumeDiscussion[]> {
  const r = await redis([
    ["ZREVRANGE", DISCS(compte), 0, max - 1],
    ["HGETALL", NON_LUS(compte)],
  ])
  const ids = (r?.[0] as string[] | null) ?? []
  const nl = (r?.[1] as string[] | null) ?? []
  const nonLus = new Map<string, number>()
  for (let i = 0; i < nl.length; i += 2) nonLus.set(nl[i], Number(nl[i + 1]) || 0)
  if (!ids.length) return []
  const h = await redis(ids.map((id) => ["HGETALL", DISC(id)]))
  const liste: ResumeDiscussion[] = []
  const expirees: string[] = []
  ids.forEach((id, i) => {
    const d = depuisHash(h?.[i])
    if (d) liste.push({ ...d, nonLus: nonLus.get(id) ?? 0 })
    // Une clé absente revient vide ; une commande en échec revient nulle (on n'efface rien).
    else if (Array.isArray(h?.[i]) && (h[i] as unknown[]).length === 0) expirees.push(id)
  })
  if (expirees.length)
    await redis([
      ["ZREM", DISCS(compte), ...expirees],
      ["HDEL", NON_LUS(compte), ...expirees],
    ])
  return liste
}

/**
 * Faut-il prévenir par e-mail ? Pas si la personne a la discussion ouverte
 * (elle l'a lue il y a moins d'une minute), et pas plus d'un e-mail par
 * discussion toutes les 15 minutes.
 */
export async function prevenirParEmail(d: Discussion, destinataire: string) {
  if ((d.lu[destinataire] ?? 0) > Date.now() - 60_000) return false
  const r = await redis([["SET", NOTIFIE(d.id, destinataire), "1", "NX", "EX", 900]])
  return r?.[0] === "OK"
}

/** Pour l'export des données : chaque discussion avec ses messages. */
export async function exporterDiscussions(compte: string) {
  const liste = await mesDiscussions(compte, 500)
  return Promise.all(
    liste.map(async (d) => ({
      annonce: d.annonce.titre,
      avec: d.noms[autreParticipant(d, compte)] ?? "",
      messages: (await lireFil(d.id)).map((m) => ({
        de: m.de === compte ? "moi" : (d.noms[m.de] ?? ""),
        texte: m.texte,
        le: new Date(m.le).toISOString(),
      })),
    })),
  )
}

/** Compte supprimé : ses discussions disparaissent, des deux côtés. */
export async function effacerDiscussions(compte: string) {
  const liste = await mesDiscussions(compte, 1000)
  await redis([
    ...liste.flatMap((d) => {
      const autre = autreParticipant(d, compte)
      return [
        ["DEL", DISC(d.id)],
        ["DEL", FIL(d.id)],
        ["ZREM", DISCS(autre), d.id],
        ["HDEL", NON_LUS(autre), d.id],
      ]
    }),
    ["DEL", DISCS(compte)],
    ["DEL", NON_LUS(compte)],
  ])
}

/** Ce que la liste affiche d'une discussion, vu par `moi` (aucune adresse, aucun identifiant de compte). */
export interface LigneDiscussion {
  id: string
  annonce: Discussion["annonce"]
  avec: { nom: string; pro: boolean }
  dernier?: { moi: boolean; texte: string; le: number }
  nonLus: number
  maj: number
}

export function pourListe(d: ResumeDiscussion, moi: string): LigneDiscussion {
  const autre = autreParticipant(d, moi)
  return {
    id: d.id,
    annonce: d.annonce,
    avec: { nom: d.noms[autre] ?? "Utilisateur", pro: d.pros.includes(autre) },
    dernier: d.dernier && {
      moi: d.dernier.de === moi,
      texte: d.dernier.texte.slice(0, 140),
      le: d.dernier.le,
    },
    nonLus: d.nonLus,
    maj: d.maj,
  }
}

/** Un message tel que le fil l'affiche : « de moi » ou non, sans identifiant de compte. */
export interface BulleDiscussion {
  id: string
  moi: boolean
  texte: string
  le: number
}

export const pourFil = (m: MessageDiscussion, moi: string): BulleDiscussion => ({
  id: m.id,
  moi: m.de === moi,
  texte: m.texte,
  le: m.le,
})
