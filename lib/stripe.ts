import "server-only"
import { createHmac, timingSafeEqual } from "node:crypto"
import type { Langue } from "@/lib/i18n/langues"

/**
 * Accès minimal à Stripe (API REST) : pas de dépendance, un fetch par
 * appel. Partagé par l'agenda payant et la cagnotte.
 */
const cleStripe = () => (process.env.STRIPE_SECRET_KEY ?? "").trim()
export const stripeActif = () => /^(sk|rk)_(live|test)_/.test(cleStripe())

export async function stripe<T>(chemin: string, corps?: URLSearchParams): Promise<T> {
  const r = await fetch(`https://api.stripe.com/v1/${chemin}`, {
    method: corps ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${cleStripe()}`,
      ...(corps ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: corps,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  })
  const d = (await r.json().catch(() => ({}))) as T & { error?: { message?: string } }
  if (!r.ok) throw new Error(`stripe ${r.status}${d.error?.message ? ` : ${d.error.message}` : ""}`)
  return d
}

export const LOCALES_STRIPE: Record<Langue, string> = {
  fr: "fr",
  de: "de",
  lb: "fr",
  en: "en",
  es: "es",
}

/** Identifiant de session Checkout bien formé (avant tout appel à Stripe). */
export const estSessionStripe = (id: string) => /^cs_(test|live)_[A-Za-z0-9]+$/.test(id)

/**
 * Signature d'un webhook Stripe (en-tête Stripe-Signature : t=…,v1=…) :
 * HMAC-SHA256 de « t.corps » avec le secret du point de terminaison, et
 * horodatage de moins de 5 minutes contre le rejeu.
 */
export function signatureStripeValide(corps: string, entete: string | null) {
  const secret = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim()
  if (!secret || !entete) return false
  const parties = entete.split(",").map((x) => x.trim().split("="))
  const t = parties.find(([k]) => k === "t")?.[1]
  const signatures = parties.filter(([k]) => k === "v1").map(([, v]) => v)
  if (!t || !signatures.length || Math.abs(Date.now() / 1000 - Number(t)) > 300) return false
  const attendu = Buffer.from(createHmac("sha256", secret).update(`${t}.${corps}`).digest("hex"))
  return signatures.some((v) => {
    const b = Buffer.from(v ?? "")
    return b.length === attendu.length && timingSafeEqual(b, attendu)
  })
}
