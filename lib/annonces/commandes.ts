import "server-only"
import { randomBytes } from "node:crypto"
import { site } from "@/config/site"
import { redis } from "@/lib/direction/redis"
import { estSessionStripe, stripe, stripeActif } from "@/lib/stripe"
import { appliquerOptions, journal, lireAnnonce, paiementDepotRecu } from "./annonces"
import { lireCompte } from "./comptes"
import { lireConfig } from "./config"
import { alerteModeration, envoyerSansEchec, mailDepotRecu, mailOptionsPayees } from "./mails"
import { total, type Ligne } from "./offres"

/**
 * Commandes des Petites annonces (paiement par Stripe Checkout : la radio
 * ne voit ni ne stocke jamais de numéro de carte).
 *
 * Une annonce payante n'est jamais publiée sur la foi du navigateur : le
 * paiement est confirmé en relisant la session chez Stripe (montant,
 * devise, commande), par le webhook signé ou au retour du client — les
 * deux passent par confirmerPaiement(), idempotente : un verrou empêche
 * deux confirmations simultanées, et une commande payée ne s'applique
 * qu'une fois.
 */
export { stripeActif }

const CLE = (id: string) => `rt:annonces:commande:${id}`
const INDEX = "rt:annonces:commandes"
const VERROU = (id: string) => `rt:annonces:verrou:commande:${id}`

export type StatutCommande = "attente" | "payee" | "remboursee" | "annulee"

export interface Commande {
  id: string
  compte: string
  email: string
  annonce: string
  nature: "depot" | "options"
  lignes: Ligne[]
  total: number
  statut: StatutCommande
  /** L'acheteur a demandé l'exécution immédiate (droit de rétractation). */
  executionImmediate: number
  session?: string
  paymentIntent?: string
  creeLe: number
  payeeLe?: number
  appliqueeLe?: number
  remboursement?: { id: string; montant: number; le: number; motif: string }
}

export const idCommandeValide = (id: unknown): id is string =>
  typeof id === "string" && /^[a-f0-9]{12}$/.test(id)

const lireJson = <T>(v: unknown): T | null => {
  if (typeof v !== "string") return null
  try {
    return JSON.parse(v) as T
  } catch {
    return null
  }
}

export async function lireCommande(id: string) {
  if (!idCommandeValide(id)) return null
  const r = await redis([["GET", CLE(id)]])
  return lireJson<Commande>(r?.[0])
}

async function enregistrer(c: Commande) {
  const ok = await redis([["SET", CLE(c.id), JSON.stringify(c)]])
  if (!ok || ok[0] !== "OK") throw new Error("stockage indisponible")
}

export async function listerCommandes(max = 500) {
  const r = await redis([["ZRANGE", INDEX, 0, max - 1, "REV"]])
  const ids = (r?.[0] as string[] | null) ?? []
  if (!ids.length) return []
  const m = await redis([["MGET", ...ids.map(CLE)]])
  return ((m?.[0] as unknown[] | null) ?? []).flatMap((v) => {
    const c = lireJson<Commande>(v)
    return c ? [c] : []
  })
}

export async function commandesDeLAnnonce(annonce: string) {
  return (await listerCommandes(2000)).filter((c) => c.annonce === annonce)
}

export async function creerCommande(
  d: Pick<Commande, "compte" | "email" | "annonce" | "nature" | "lignes" | "executionImmediate">,
) {
  const c: Commande = {
    ...d,
    id: randomBytes(6).toString("hex"),
    total: total(d.lignes),
    statut: "attente",
    creeLe: Date.now(),
  }
  if (c.total <= 0) throw new Error("Rien à payer.")
  const ok = await redis([
    ["SET", CLE(c.id), JSON.stringify(c)],
    ["ZADD", INDEX, c.creeLe, c.id],
  ])
  if (!ok || ok[0] !== "OK") throw new Error("stockage indisponible")
  return c
}

/** Session Stripe Checkout neuve pour une commande en attente ; renvoie l'adresse de paiement. */
export async function urlPaiement(c: Commande, titreAnnonce: string) {
  if (!stripeActif()) throw new Error("Le paiement en ligne n'est pas encore branché.")
  if (c.statut !== "attente") throw new Error("Cette commande n'attend plus de paiement.")
  const corps = new URLSearchParams({
    mode: "payment",
    locale: "fr",
    customer_email: c.email,
    client_reference_id: c.id,
    "metadata[type]": "annonce",
    "metadata[commande]": c.id,
    "payment_intent_data[metadata][type]": "annonce",
    "payment_intent_data[metadata][commande]": c.id,
    "payment_intent_data[receipt_email]": c.email,
    "payment_intent_data[description]": `Petites annonces — ${titreAnnonce}`.slice(0, 300),
    "invoice_creation[enabled]": "true",
    success_url: `${site.url}/api/annonces/retour?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site.url}/annonces/mon-espace?paiement=annule`,
  })
  // Les lignes gratuites (formule classique) ne passent pas par Stripe.
  c.lignes
    .filter((l) => l.centimes > 0)
    .forEach((l, i) => {
      corps.set(`line_items[${i}][quantity]`, "1")
      corps.set(`line_items[${i}][price_data][currency]`, "eur")
      corps.set(`line_items[${i}][price_data][unit_amount]`, String(l.centimes))
      corps.set(
        `line_items[${i}][price_data][product_data][name]`,
        `Petites annonces — ${l.libelle}`,
      )
      corps.set(
        `line_items[${i}][price_data][product_data][description]`,
        titreAnnonce.slice(0, 300),
      )
    })
  const s = await stripe<{ id: string; url: string }>("checkout/sessions", corps)
  c.session = s.id
  await enregistrer(c)
  return s.url
}

type SessionStripe = {
  id: string
  payment_status: string
  amount_total: number | null
  currency: string | null
  payment_intent: string | null
  metadata?: Record<string, string>
}

/**
 * Confirme une session Checkout : relue chez Stripe, elle doit être payée,
 * en euros, du montant exact de la commande qu'elle désigne. Applique alors
 * la commande (une seule fois). Renvoie la commande, ou null si rien n'est
 * payé.
 */
export async function confirmerPaiement(sessionId: string) {
  if (!estSessionStripe(sessionId)) return null
  const s = await stripe<SessionStripe>(`checkout/sessions/${sessionId}`)
  const id = s.metadata?.commande ?? ""
  if (s.metadata?.type !== "annonce" || !idCommandeValide(id)) return null
  const c0 = await lireCommande(id)
  if (!c0) return null
  const paye = s.payment_status === "paid" && s.currency === "eur" && s.amount_total === c0.total
  if (!paye) return null
  if (c0.statut !== "attente") return c0

  // Verrou : le webhook et le retour du client arrivent souvent ensemble.
  const v = await redis([["SET", VERROU(id), "1", "NX", "EX", 60]])
  if (!v || v[0] !== "OK") throw new Error("confirmation déjà en cours")
  try {
    const c = await lireCommande(id)
    if (!c || c.statut !== "attente") return c
    c.statut = "payee"
    c.payeeLe = Date.now()
    c.session = s.id
    c.paymentIntent = s.payment_intent ?? undefined
    await enregistrer(c)
    await journal("paiement", { commande: c.id, annonce: c.annonce, montant: c.total })
    await appliquer(c)
    return c
  } finally {
    await redis([["DEL", VERROU(id)]])
  }
}

/** Effet d'une commande payée sur son annonce, et e-mails qui suivent. */
async function appliquer(c: Commande) {
  const a = await lireAnnonce(c.annonce)
  const compte = await lireCompte(c.compte)
  if (!a) return
  if (c.nature === "depot") {
    await paiementDepotRecu(a)
    if (compte)
      await envoyerSansEchec({
        a: compte.email,
        ...mailDepotRecu(compte.nom, a, { lignes: c.lignes, total: c.total }),
      })
    await envoyerSansEchec({
      a: process.env.FORM_EMAIL_TO || site.contact.email,
      ...alerteModeration(a, "depot"),
    })
  } else {
    const cfg = await lireConfig()
    // Annonce retirée entre-temps : la commande reste payée, la direction la voit et rembourse.
    if (a.statut !== "publiee" && a.statut !== "expiree") return
    await appliquerOptions(
      a,
      cfg,
      c.lignes.map((l) => l.code),
    )
    if (compte)
      await envoyerSansEchec({
        a: compte.email,
        ...mailOptionsPayees(compte.nom, a, c.lignes, c.total),
      })
  }
  c.appliqueeLe = Date.now()
  await enregistrer(c)
}

/**
 * Remboursement intégral d'une commande payée (refus à la vérification,
 * annonce retirée avant publication, geste de la direction). Clé
 * d'idempotence : un double clic ne rembourse pas deux fois.
 */
export async function rembourser(c: Commande, motif: string) {
  if (c.statut !== "payee") return 0
  if (!c.paymentIntent)
    throw new Error("Paiement introuvable chez Stripe : remboursez depuis Stripe.")
  const r = await stripe<{ id: string; amount: number; status: string }>(
    "refunds",
    new URLSearchParams({
      payment_intent: c.paymentIntent,
      reason: "requested_by_customer",
      "metadata[type]": "annonce",
      "metadata[commande]": c.id,
      "metadata[motif]": motif.slice(0, 400),
    }),
    `annonce-remboursement-${c.id}`,
  )
  c.statut = "remboursee"
  c.remboursement = { id: r.id, montant: r.amount, le: Date.now(), motif: motif.slice(0, 400) }
  await enregistrer(c)
  await journal("remboursement", { commande: c.id, annonce: c.annonce, montant: r.amount })
  return r.amount
}

/** Rembourse toutes les commandes payées d'une annonce ; renvoie le total remboursé. */
export async function rembourserAnnonce(annonce: string, motif: string) {
  let n = 0
  for (const c of await commandesDeLAnnonce(annonce)) n += await rembourser(c, motif)
  return n
}

/** Commande abandonnée (annonce retirée avant paiement). */
export async function annulerCommande(c: Commande) {
  if (c.statut !== "attente") return
  c.statut = "annulee"
  await enregistrer(c)
}
