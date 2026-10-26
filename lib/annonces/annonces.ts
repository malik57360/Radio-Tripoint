import "server-only"
import { createHash, randomBytes } from "node:crypto"
import { revalidatePath, revalidateTag } from "next/cache"
import { accesRedis, redis } from "@/lib/direction/redis"
import { normaliser, versSlug } from "@/lib/utils/texte"
import type { Config } from "./config"
import type { CodeOffre } from "./offres"
import {
  STATUTS_ACTIFS,
  idAnnonceValide,
  type Annonce,
  type AnnoncePublique,
  type Statut,
} from "./types"
import { noterActivite, type TypeActivite } from "./espace"

/**
 * Stockage des annonces (Redis).
 *
 * - rt:annonces:annonce:<id>  : l'annonce complète (JSON) ;
 * - rt:annonces:index         : toutes les annonces, par date de dépôt (tableau de bord) ;
 * - rt:annonces:du:<compte>   : les annonces d'un compte ;
 * - rt:annonces:publiques     : hash id → annonce publique, seule source des pages
 *                               publiques (une annonce n'y entre qu'une fois publiée) ;
 * - rt:annonces:empreintes    : empreinte du texte → id (doublons) ;
 * - rt:annonces:journal       : journal des actions (1 000 dernières).
 *
 * Toute écriture passe par enregistrer(), qui tient l'index public à jour :
 * il est impossible qu'une annonce non publiée y reste.
 */
export const TAG_ANNONCES = "annonces"
const CLE = (id: string) => `rt:annonces:annonce:${id}`
const INDEX = "rt:annonces:index"
const DU_COMPTE = (c: string) => `rt:annonces:du:${c}`
const PUBLIQUES = "rt:annonces:publiques"
const EMPREINTES = "rt:annonces:empreintes"
const JOURNAL = "rt:annonces:journal"

const JOUR = 24 * 3600 * 1000

const sujet = (a: Annonce) => ({ id: a.id, titre: a.titre })

const lireJson = <T>(v: unknown): T | null => {
  if (typeof v !== "string") return null
  try {
    return JSON.parse(v) as T
  } catch {
    return null
  }
}

export const empreinteTexte = (titre: string, description: string) =>
  createHash("sha256")
    .update(
      `${normaliser(titre).replace(/\W+/g, " ")}|${normaliser(description).replace(/\W+/g, " ")}`,
    )
    .digest("hex")
    .slice(0, 24)

export function versPublique(a: Annonce): AnnoncePublique {
  return {
    id: a.id,
    slug: a.slug,
    categorie: a.categorie,
    titre: a.titre,
    description: a.description,
    prix: a.prix,
    ...(a.mention ? { mention: a.mention } : {}),
    pays: a.pays,
    ville: a.ville,
    codePostal: a.codePostal,
    details: a.details,
    photos: a.photos,
    annonceur: a.annonceur,
    nom: a.nom,
    ...(a.pro ? { pro: a.pro } : {}),
    publieeLe: a.publieeLe ?? a.creeLe,
    remonteeLe: a.remonteeLe ?? a.publieeLe ?? a.creeLe,
    expireLe: a.expireLe ?? 0,
    ...(a.categorieJusqu ? { categorieJusqu: a.categorieJusqu } : {}),
    ...(a.renforceeJusqu ? { renforceeJusqu: a.renforceeJusqu } : {}),
    ...(a.accueilJusqu ? { accueilJusqu: a.accueilJusqu } : {}),
  }
}

const enLigne = (a: Annonce) => a.statut === "publiee" && (a.expireLe ?? 0) > Date.now()

/** Pages publiques à rafraîchir après chaque changement visible. */
export function rafraichir() {
  revalidateTag(TAG_ANNONCES, { expire: 0 })
  revalidatePath("/petites-annonces", "layout")
}

async function enregistrer(a: Annonce) {
  a.majLe = Date.now()
  const ok = await redis([
    ["SET", CLE(a.id), JSON.stringify(a)],
    enLigne(a)
      ? ["HSET", PUBLIQUES, a.id, JSON.stringify(versPublique(a))]
      : ["HDEL", PUBLIQUES, a.id],
  ])
  if (!ok || ok[0] !== "OK") throw new Error("stockage indisponible")
}

export async function journal(action: string, details: Record<string, unknown> = {}) {
  await redis([
    ["LPUSH", JOURNAL, JSON.stringify({ le: Date.now(), action, ...details })],
    ["LTRIM", JOURNAL, 0, 999],
  ])
}

export async function lireJournal(max = 200) {
  const r = await redis([["LRANGE", JOURNAL, 0, max - 1]])
  return ((r?.[0] as unknown[] | null) ?? []).flatMap((v) => {
    const x = lireJson<{ le: number; action: string } & Record<string, unknown>>(v)
    return x ? [x] : []
  })
}

/* ───────────────────────── Lecture ───────────────────────── */

export async function lireAnnonce(id: string): Promise<Annonce | null> {
  if (!idAnnonceValide(id)) return null
  const r = await redis([["GET", CLE(id)]])
  return lireJson<Annonce>(r?.[0])
}

async function lirePlusieurs(ids: string[]) {
  if (!ids.length) return []
  const r = await redis([["MGET", ...ids.map(CLE)]])
  return ((r?.[0] as unknown[] | null) ?? []).flatMap((v) => {
    const a = lireJson<Annonce>(v)
    return a ? [a] : []
  })
}

export async function annoncesDuCompte(compte: string) {
  const r = await redis([["SMEMBERS", DU_COMPTE(compte)]])
  const liste = await lirePlusieurs((r?.[0] as string[] | null) ?? [])
  return liste.sort((a, b) => b.creeLe - a.creeLe)
}

/** Toutes les annonces, les plus récentes d'abord (tableau de bord). */
export async function listerAnnonces(max = 1000) {
  const r = await redis([["ZRANGE", INDEX, 0, max - 1, "REV"]])
  return lirePlusieurs((r?.[0] as string[] | null) ?? [])
}

/**
 * Annonces en ligne (pages publiques), mises en cache et rafraîchies à
 * chaque publication. Les annonces expirées depuis le dernier passage de la
 * tâche quotidienne sont écartées ici aussi.
 */
export async function annoncesPubliques(): Promise<AnnoncePublique[]> {
  const a = accesRedis()
  if (!a) return []
  try {
    const r = await fetch(`${a.url}/hgetall/${PUBLIQUES}`, {
      headers: { Authorization: `Bearer ${a.jeton}` },
      next: { revalidate: 300, tags: [TAG_ANNONCES] },
      signal: AbortSignal.timeout(4000),
    })
    if (!r.ok) return []
    const { result } = (await r.json()) as { result?: string[] | null }
    if (!Array.isArray(result)) return []
    const maintenant = Date.now()
    const liste: AnnoncePublique[] = []
    for (let i = 1; i < result.length; i += 2) {
      const x = lireJson<AnnoncePublique>(result[i])
      if (x?.id && x.expireLe > maintenant) liste.push(x)
    }
    return liste
  } catch {
    return []
  }
}

/** Une annonce en ligne (fiche publique), mise en cache elle aussi. */
export async function annoncePublique(id: string): Promise<AnnoncePublique | null> {
  const a = accesRedis()
  if (!a || !idAnnonceValide(id)) return null
  try {
    const r = await fetch(`${a.url}/hget/${PUBLIQUES}/${id}`, {
      headers: { Authorization: `Bearer ${a.jeton}` },
      next: { revalidate: 300, tags: [TAG_ANNONCES] },
      signal: AbortSignal.timeout(3000),
    })
    if (!r.ok) return null
    const { result } = (await r.json()) as { result?: string | null }
    const x = lireJson<AnnoncePublique>(result)
    return x && x.expireLe > Date.now() ? x : null
  } catch {
    return null
  }
}

/* ───────────────────────── Dépôt et modification ───────────────────────── */

export type Contenu = Pick<
  Annonce,
  | "categorie"
  | "titre"
  | "description"
  | "prix"
  | "mention"
  | "pays"
  | "ville"
  | "codePostal"
  | "details"
  | "photos"
>

export const slugAnnonce = (titre: string, ville: string, id: string) =>
  `${versSlug(`${titre} ${ville}`).slice(0, 70).replace(/-+$/, "")}-${id}`

/** Annonces qui comptent dans la limite (en ligne, en attente, à payer, masquées). */
export const nombreActives = (liste: Annonce[]) =>
  liste.filter((a) => STATUTS_ACTIFS.includes(a.statut)).length

/**
 * Doublon : le même texte est-il déjà en ligne ou en attente ? Renvoie
 * l'annonce trouvée (du même compte : refus ; d'un autre : signalée à la
 * modération).
 */
export async function chercherDoublon(empreinte: string, sauf?: string) {
  const r = await redis([["HGET", EMPREINTES, empreinte]])
  const id = r?.[0]
  if (typeof id !== "string" || id === sauf) return null
  const a = await lireAnnonce(id)
  return a && STATUTS_ACTIFS.includes(a.statut) ? a : null
}

export async function creerAnnonce(
  d: Contenu &
    Pick<
      Annonce,
      | "compte"
      | "annonceur"
      | "nom"
      | "pro"
      | "formule"
      | "optionsDepot"
      | "photosMax"
      | "doublonDe"
    > & { payante: boolean },
) {
  const id = randomBytes(6).toString("hex")
  const { payante, ...contenu } = d
  const a: Annonce = {
    ...contenu,
    id,
    slug: slugAnnonce(d.titre, d.ville, id),
    statut: payante ? "attente_paiement" : "en_attente",
    creeLe: Date.now(),
    majLe: Date.now(),
    empreinte: empreinteTexte(d.titre, d.description),
  }
  const ok = await redis([
    ["SET", CLE(id), JSON.stringify(a)],
    ["ZADD", INDEX, a.creeLe, id],
    ["SADD", DU_COMPTE(a.compte), id],
    ["HSET", EMPREINTES, a.empreinte, id],
  ])
  if (!ok || ok[0] !== "OK") throw new Error("stockage indisponible")
  await journal("depot", { annonce: id, compte: a.compte, statut: a.statut })
  await noterActivite(a.compte, { type: "depot", annonce: sujet(a) })
  return a
}

export async function lierCommande(a: Annonce, commande: string) {
  a.commande = commande
  await enregistrer(a)
}

/**
 * Modification par l'annonceur. Une annonce en ligne repasse en
 * vérification : un texte modifié n'est jamais publié sans être relu.
 */
export async function modifierAnnonce(a: Annonce, c: Contenu, doublonDe?: string) {
  const etaitEnLigne = a.statut === "publiee" || a.statut === "signalee"
  if (!["attente_paiement", "en_attente", "publiee", "expiree"].includes(a.statut))
    throw new Error("Cette annonce ne peut plus être modifiée.")
  const ancienne = a.empreinte
  Object.assign(a, c)
  a.slug = slugAnnonce(c.titre, c.ville, a.id)
  a.empreinte = empreinteTexte(c.titre, c.description)
  a.doublonDe = doublonDe
  if (etaitEnLigne) a.statut = "en_attente"
  await enregistrer(a)
  await redis([
    ["HDEL", EMPREINTES, ancienne],
    ["HSET", EMPREINTES, a.empreinte, a.id],
  ])
  await journal("modification", { annonce: a.id, compte: a.compte, etaitEnLigne })
  await noterActivite(a.compte, {
    type: "modifiee",
    annonce: sujet(a),
    detail: etaitEnLigne ? "Elle est relue avant de réapparaître." : undefined,
  })
  if (etaitEnLigne) rafraichir()
  return a
}

/* ───────────────────────── Changements de statut ───────────────────────── */

/** Paiement du dépôt confirmé : l'annonce part en vérification. */
export async function paiementDepotRecu(a: Annonce) {
  if (a.statut !== "attente_paiement") return a
  a.statut = "en_attente"
  await enregistrer(a)
  await journal("paiement-depot", { annonce: a.id })
  await noterActivite(a.compte, { type: "paiement", annonce: sujet(a) })
  return a
}

const plusTard = (actuel: number | undefined, jours: number) =>
  Math.max(actuel ?? 0, Date.now()) + jours * JOUR

/** Effet d'une formule ou d'une option sur l'annonce (dates de fin, remontée, photos). */
export function appliquerOffre(a: Annonce, cfg: Config, code: CodeOffre) {
  const o = cfg.offres.find((x) => x.code === code)
  if (!o) return
  switch (o.effet) {
    case "categorie":
      a.categorieJusqu = plusTard(a.categorieJusqu, o.jours)
      break
    case "renforcee":
      a.renforceeJusqu = plusTard(a.renforceeJusqu, o.jours)
      break
    case "accueil":
      a.accueilJusqu = plusTard(a.accueilJusqu, o.jours)
      break
    case "remontee":
      a.remonteeLe = Date.now()
      break
    case "photos":
      a.photosMax += o.photos
      break
    case "prolongation":
      if (a.statut === "expiree" || (a.expireLe ?? 0) < Date.now()) {
        // Expirée : elle revient pour la durée achetée, en tête de liste.
        a.expireLe = Date.now() + o.jours * JOUR
        a.remonteeLe = Date.now()
        if (a.statut === "expiree") a.statut = "publiee"
      } else a.expireLe = (a.expireLe ?? Date.now()) + o.jours * JOUR
      a.avertiExpiration = undefined
      break
  }
}

/** Options achetées après la publication (remontée, mise en avant, prolongation…). */
export async function appliquerOptions(a: Annonce, cfg: Config, codes: CodeOffre[]) {
  for (const c of codes) appliquerOffre(a, cfg, c)
  await enregistrer(a)
  await journal("options", { annonce: a.id, options: codes })
  await noterActivite(a.compte, {
    type: "options",
    annonce: sujet(a),
    detail: codes.map((c) => cfg.offres.find((o) => o.code === c)?.nom ?? c).join(", "),
  })
  rafraichir()
  return a
}

/** Validation par la modération : en ligne pour la durée de la formule. */
export async function publierAnnonce(a: Annonce, cfg: Config) {
  if (a.statut !== "en_attente" && a.statut !== "signalee")
    throw new Error("Seule une annonce en vérification ou masquée peut être publiée.")
  const premiere = !a.publieeLe
  const reprise = a.statut === "signalee" || !premiere
  a.statut = "publiee"
  a.motif = undefined
  if (premiere) {
    const f = cfg.offres.find((o) => o.code === a.formule)
    a.publieeLe = Date.now()
    a.remonteeLe = Date.now()
    a.expireLe = Date.now() + (f?.jours ?? 30) * JOUR
    // Mise en avant comprise dans une formule pro : toute la durée de l'annonce.
    if (f?.effet === "categorie") a.categorieJusqu = a.expireLe
    if (f?.effet === "renforcee") a.renforceeJusqu = a.expireLe
    for (const c of a.optionsDepot) if (c !== "photos") appliquerOffre(a, cfg, c)
  } else if ((a.expireLe ?? 0) < Date.now()) a.statut = "expiree"
  await enregistrer(a)
  await journal(reprise ? "republication" : "publication", { annonce: a.id })
  await noterActivite(a.compte, {
    type: a.statut === "publiee" ? "publiee" : "expiree",
    annonce: sujet(a),
  })
  rafraichir()
  return a
}

export async function changerStatut(
  a: Annonce,
  statut: Statut,
  motif?: string,
  par = "moderation",
) {
  a.statut = statut
  a.motif = motif?.trim() || undefined
  await enregistrer(a)
  await journal(statut, { annonce: a.id, par, ...(a.motif ? { motif: a.motif } : {}) })
  const type: TypeActivite | null =
    statut === "retiree" && a.vendueLe
      ? "vendue"
      : statut === "refusee" ||
          statut === "retiree" ||
          statut === "expiree" ||
          statut === "signalee"
        ? statut
        : statut === "publiee"
          ? "publiee"
          : null
  if (type)
    await noterActivite(a.compte, {
      type,
      annonce: sujet(a),
      detail: type === "vendue" ? undefined : a.motif,
    })
  rafraichir()
  return a
}

/** Un signalement de plus ; au-delà du seuil, l'annonce est masquée en attendant la modération. */
export async function compterSignalement(a: Annonce, cfg: Config) {
  a.signalements = (a.signalements ?? 0) + 1
  const masquer = a.statut === "publiee" && a.signalements >= cfg.limites.seuilSignalements
  if (masquer) a.statut = "signalee"
  await enregistrer(a)
  if (masquer) {
    await journal("masquee", { annonce: a.id, signalements: a.signalements })
    await noterActivite(a.compte, { type: "signalee", annonce: sujet(a) })
    rafraichir()
  }
  return masquer
}

export async function noterAvertissement(a: Annonce) {
  a.avertiExpiration = Date.now()
  await enregistrer(a)
}

/** Suppression définitive (compte supprimé) : l'annonce et ses index. */
export async function effacerAnnonce(a: Annonce) {
  await redis([
    ["DEL", CLE(a.id)],
    ["ZREM", INDEX, a.id],
    ["SREM", DU_COMPTE(a.compte), a.id],
    ["HDEL", PUBLIQUES, a.id],
    ["HDEL", EMPREINTES, a.empreinte],
  ])
}

/** Photos d'une annonce terminée depuis longtemps : effacées du stockage. */
export async function viderPhotos(a: Annonce) {
  const urls = a.photos.flatMap((p) => [p.url, p.vignette])
  if (urls.length && process.env.BLOB_READ_WRITE_TOKEN) {
    const { del } = await import("@vercel/blob")
    await del(urls)
  }
  a.photos = []
  await enregistrer(a)
}

/* ───────────────────────── Interventions de la direction ───────────────────────── */

/**
 * Correction par la direction (faute, prix, catégorie) : l'annonce garde
 * son statut — pas de nouvelle vérification, c'est la modération qui écrit.
 */
export async function corrigerParModeration(
  a: Annonce,
  c: Pick<Annonce, "titre" | "description" | "prix" | "ville" | "categorie">,
) {
  const ancienne = a.empreinte
  Object.assign(a, c)
  a.slug = slugAnnonce(c.titre, c.ville, a.id)
  a.empreinte = empreinteTexte(c.titre, c.description)
  await enregistrer(a)
  await redis([
    ["HDEL", EMPREINTES, ancienne],
    ["HSET", EMPREINTES, a.empreinte, a.id],
  ])
  await journal("correction", { annonce: a.id, par: "direction" })
  rafraichir()
  return a
}

export type Cadeau = "prolongation" | "remontee" | "accueil" | "categorie" | "renforcee"
const NOMS_CADEAUX: Record<Cadeau, string> = {
  prolongation: "Prolongation",
  remontee: "Remontée en tête de liste",
  accueil: "À la une de l'accueil",
  categorie: "Mise en avant dans sa catégorie",
  renforcee: "Visibilité renforcée",
}

/** Un coup de pouce offert par la radio (geste commercial, concours, partenaire…). */
export async function offrirParModeration(a: Annonce, cadeau: Cadeau, jours: number) {
  switch (cadeau) {
    case "prolongation":
      if (a.statut === "expiree" || (a.expireLe ?? 0) < Date.now()) {
        a.expireLe = Date.now() + jours * JOUR
        a.remonteeLe = Date.now()
        if (a.statut === "expiree") a.statut = "publiee"
      } else a.expireLe = (a.expireLe ?? Date.now()) + jours * JOUR
      a.avertiExpiration = undefined
      break
    case "remontee":
      a.remonteeLe = Date.now()
      break
    case "accueil":
      a.accueilJusqu = plusTard(a.accueilJusqu, jours)
      break
    case "categorie":
      a.categorieJusqu = plusTard(a.categorieJusqu, jours)
      break
    case "renforcee":
      a.renforceeJusqu = plusTard(a.renforceeJusqu, jours)
      break
  }
  await enregistrer(a)
  await journal("cadeau", { annonce: a.id, cadeau, jours })
  await noterActivite(a.compte, {
    type: "options",
    annonce: sujet(a),
    detail: `${NOMS_CADEAUX[cadeau]}${cadeau === "remontee" ? "" : ` (${jours} j)`}, offerte par Radio Tripoint`,
  })
  rafraichir()
  return a
}
