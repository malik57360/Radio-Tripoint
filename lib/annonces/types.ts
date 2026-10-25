import type { Pays } from "./categories"
import type { Annonceur, CodeOffre } from "./offres"

/**
 * Types partagés des Petites annonces (serveur et navigateur).
 *
 * Parcours d'une annonce :
 *
 *   attente_paiement ──(paiement confirmé)──┐
 *                                           ▼
 *   (gratuite) ─────────────────────▶ en_attente ──(modération)──▶ publiee ──▶ expiree
 *                                           │                         │  ▲
 *                                           ▼                         ▼  │ (rétablie)
 *                                        refusee                   signalee
 *
 *   retiree : par l'annonceur, ou par la modération, à tout moment.
 */
export type Statut =
  "attente_paiement" | "en_attente" | "publiee" | "refusee" | "signalee" | "expiree" | "retiree"

export const LIBELLES_STATUT: Record<Statut, string> = {
  attente_paiement: "En attente de paiement",
  en_attente: "En cours de vérification",
  publiee: "En ligne",
  refusee: "Refusée",
  signalee: "Masquée (signalée)",
  expiree: "Expirée",
  retiree: "Retirée",
}

/** Statuts qui comptent dans la limite d'annonces actives. */
export const STATUTS_ACTIFS: Statut[] = ["attente_paiement", "en_attente", "publiee", "signalee"]

export interface Photo {
  url: string
  vignette: string
  l: number
  h: number
}

export type MentionPrix = "a_debattre" | "don" | "sur_devis"
export const LIBELLES_MENTION: Record<MentionPrix, string> = {
  a_debattre: "À débattre",
  don: "À donner",
  sur_devis: "Sur devis",
}

/** Identité d'un professionnel, affichée sur ses annonces (transparence envers l'acheteur). */
export interface IdentitePro {
  raisonSociale: string
  identifiant: string
  pays: Pays
  ville: string
  site?: string
  telephone?: string
}

/** Ce que voit le public : ni compte, ni e-mail, ni historique de modération. */
export interface AnnoncePublique {
  id: string
  slug: string
  categorie: string
  titre: string
  description: string
  prix: number | null
  mention?: MentionPrix
  pays: Pays
  ville: string
  codePostal: string
  details: Record<string, string>
  photos: Photo[]
  annonceur: Annonceur
  /** Prénom ou pseudo (particulier), raison sociale (pro). */
  nom: string
  pro?: IdentitePro
  publieeLe: number
  remonteeLe: number
  expireLe: number
  /** Fin des mises en avant (horodatages) ; absentes ou passées : rien. */
  categorieJusqu?: number
  renforceeJusqu?: number
  accueilJusqu?: number
}

export interface Annonce extends Omit<AnnoncePublique, "publieeLe" | "remonteeLe" | "expireLe"> {
  compte: string
  statut: Statut
  formule: CodeOffre
  /** Options payées au dépôt, appliquées à la première publication. */
  optionsDepot: CodeOffre[]
  photosMax: number
  creeLe: number
  majLe: number
  publieeLe?: number
  remonteeLe?: number
  expireLe?: number
  motif?: string
  /** Empreinte du texte (doublons). */
  empreinte: string
  /** Même texte qu'une annonce d'un autre compte : à regarder de près. */
  doublonDe?: string
  /** Commande du dépôt (formule et options payantes). */
  commande?: string
  signalements?: number
  avertiExpiration?: number
}

/** La mise en avant est-elle en cours ? */
export const actif = (jusqu: number | undefined, maintenant = Date.now()) =>
  typeof jusqu === "number" && jusqu > maintenant

/** Mise en avant payée en cours : toujours dite comme telle aux visiteurs. */
export const misEnAvant = (
  a: Pick<AnnoncePublique, "categorieJusqu" | "renforceeJusqu" | "accueilJusqu">,
) => actif(a.renforceeJusqu) || actif(a.categorieJusqu) || actif(a.accueilJusqu)

export const idAnnonceValide = (id: unknown): id is string =>
  typeof id === "string" && /^[a-f0-9]{12}$/.test(id)

/** L'identifiant est au bout du lien : « …-3f9a1c2b4d5e ». */
export const idDuSlug = (slug: string) => slug.match(/([a-f0-9]{12})$/)?.[1] ?? null

export const cheminAnnonce = (a: Pick<AnnoncePublique, "categorie" | "slug">) =>
  `/annonces/${a.categorie}/${a.slug}`
