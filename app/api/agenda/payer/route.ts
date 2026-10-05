import { timingSafeEqual } from "node:crypto"
import { site } from "@/config/site"
import { creerSessionPaiement, lireProposition, stripeActif } from "@/lib/agenda/propositions"
import { estLangue, type Langue } from "@/lib/i18n/langues"

/**
 * Lien de paiement envoyé à l'organisateur après acceptation. Chaque clic
 * ouvre une session Stripe neuve (une session expire en 24 h ; le lien,
 * lui, reste valable jusqu'au paiement).
 */
export const dynamic = "force-dynamic"

const page = (l: Langue, etat: string, slug?: string) =>
  new URL(
    `${l === "fr" ? "" : `/${l}`}/agenda/paiement?${new URLSearchParams({ etat, ...(slug ? { slug } : {}) })}`,
    site.url,
  )

const egal = (a: string, b: string) => {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams
  const l: Langue = estLangue(q.get("l")) ? (q.get("l") as Langue) : "fr"
  const p = await lireProposition(q.get("id") ?? "")
  if (!p || !egal(q.get("c") ?? "", p.jeton)) return Response.redirect(page(l, "invalide"), 303)
  if (p.statut === "publie") return Response.redirect(page(l, "deja", p.slug), 303)
  if (p.statut !== "accepte") return Response.redirect(page(l, "indisponible"), 303)
  if (!stripeActif()) return Response.redirect(page(l, "bientot"), 303)
  try {
    return Response.redirect(await creerSessionPaiement(p, l), 303)
  } catch (e) {
    console.error("[agenda] session de paiement :", (e as Error).message)
    return Response.redirect(page(l, "erreur"), 303)
  }
}
