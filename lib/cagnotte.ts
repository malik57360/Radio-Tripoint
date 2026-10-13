import "server-only"
import { revalidateTag } from "next/cache"
import { site } from "@/config/site"
import { accesRedis, redis } from "@/lib/direction/redis"
import { choisir, type Langue, type Trad } from "@/lib/i18n/langues"
import { estSessionStripe, LOCALES_STRIPE, stripe } from "@/lib/stripe"

/**
 * Cagnotte « matériel » : participation libre par carte (Stripe Checkout),
 * suivie sur /soutenir par une barre de progression.
 *
 * Chaque paiement confirmé est noté une seule fois dans Redis (hash
 * rt:cagnotte:materiel, session Stripe → montant en centimes) : le webhook
 * et le retour du visiteur l'enregistrent tous les deux, HSETNX évite le
 * double compte. Le total est relu en GET pour profiter du cache de Next
 * (5 minutes), et rafraîchi tout de suite à chaque participation.
 */
export const OBJECTIF_EUROS = 10_000
/** Montant collecté et nombre de participations affichés sur /soutenir ? Masqués pour
 *  l'instant (la page montre seulement l'objectif) ; le total reste compté dans Redis. */
export const AFFICHER_COMPTEUR = false
export const MONTANTS_PROPOSES = [10, 20, 50, 100] as const
export const MIN_EUROS = 2
export const MAX_EUROS = 5_000

const CAGNOTTE = "materiel"
const CLE = `rt:cagnotte:${CAGNOTTE}`
const TAG_CAGNOTTE = "cagnotte"

const NOM_PRODUIT: Trad = {
  fr: "Cagnotte matériel de Radio Tripoint",
  de: "Spendenaktion für die Ausrüstung von Radio Tripoint",
  lb: "Cagnotte fir d'Material vu Radio Tripoint",
  en: "Radio Tripoint equipment fund",
  es: "Colecta para el material de Radio Tripoint",
}

/** Page de la cagnotte dans la langue du visiteur, avec un état à afficher. */
export const pageCagnotte = (l: Langue, etat: string) =>
  new URL(`${l === "fr" ? "" : `/${l}`}/soutenir?etat=${etat}#participer`, site.url)

/** Montant saisi (« 20 », « 15,50 ») → centimes, ou null s'il sort des bornes. */
export function lireMontant(brut: string): number | null {
  const euros = Number(brut.trim().replace(",", "."))
  if (!Number.isFinite(euros) || euros < MIN_EUROS || euros > MAX_EUROS) return null
  return Math.round(euros * 100)
}

/** Total collecté ; null si le stockage n'est pas joignable (pas de faux chiffre). */
export async function etatCagnotte(): Promise<{ euros: number; participations: number } | null> {
  const a = accesRedis()
  if (!a) return null
  try {
    const r = await fetch(`${a.url}/hvals/${CLE}`, {
      headers: { Authorization: `Bearer ${a.jeton}` },
      next: { revalidate: 300, tags: [TAG_CAGNOTTE] },
      signal: AbortSignal.timeout(3000),
    })
    if (!r.ok) return null
    const { result } = (await r.json()) as { result?: string[] | null }
    if (!Array.isArray(result)) return null
    const centimes = result.reduce((s, v) => s + (Number(v) || 0), 0)
    return { euros: Math.floor(centimes / 100), participations: result.length }
  } catch {
    return null
  }
}

export async function creerSessionCagnotte(centimes: number, l: Langue) {
  const corps = new URLSearchParams({
    mode: "payment",
    submit_type: "donate",
    locale: LOCALES_STRIPE[l],
    "metadata[cagnotte]": CAGNOTTE,
    "payment_intent_data[metadata][cagnotte]": CAGNOTTE,
    "payment_intent_data[description]": NOM_PRODUIT.fr,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(centimes),
    "line_items[0][price_data][product_data][name]": choisir(NOM_PRODUIT, l),
    success_url: `${site.url}/api/cagnotte/retour?l=${l}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: pageCagnotte(l, "annule").href,
  })
  const s = await stripe<{ id: string; url: string }>("checkout/sessions", corps)
  return s.url
}

/** Relit la session chez Stripe : rien n'est cru sur parole (URL ou corps du webhook). */
export async function lireSessionCagnotte(id: string) {
  if (!estSessionStripe(id)) return null
  const s = await stripe<{
    id: string
    payment_status: string
    amount_total: number | null
    currency: string | null
    metadata?: Record<string, string>
  }>(`checkout/sessions/${id}`)
  if (s.metadata?.cagnotte !== CAGNOTTE) return null
  return {
    id: s.id,
    paye: s.payment_status === "paid" && s.currency === "eur" && (s.amount_total ?? 0) > 0,
    centimes: s.amount_total ?? 0,
  }
}

/** Participation payée → ajoutée au total. Idempotent (webhook + retour du visiteur). */
export async function enregistrerParticipation(s: { id: string; centimes: number }) {
  const r = await redis([["HSETNX", CLE, s.id, s.centimes]])
  if (!r || r[0] === null) throw new Error("stockage indisponible")
  if (r[0] === 1) revalidateTag(TAG_CAGNOTTE, { expire: 0 })
}
