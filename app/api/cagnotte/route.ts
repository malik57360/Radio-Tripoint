import { createHash } from "node:crypto"
import { creerSessionCagnotte, lireMontant, pageCagnotte } from "@/lib/cagnotte"
import { autoriser } from "@/lib/formulaires/limiteur"
import { estLangue, type Langue } from "@/lib/i18n/langues"
import { stripeActif } from "@/lib/stripe"

/**
 * Formulaire de la cagnotte (/soutenir) : le montant choisi ouvre une
 * session Stripe Checkout neuve, où le visiteur paie. Le montant libre,
 * s'il est rempli, l'emporte sur les montants proposés.
 */
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const f = await request.formData().catch(() => null)
  const brutLangue = f?.get("l")
  const l: Langue = estLangue(brutLangue) ? brutLangue : "fr"
  const libre = String(f?.get("libre") ?? "").trim()
  const centimes = lireMontant(libre || String(f?.get("montant") ?? ""))
  if (!centimes) return Response.redirect(pageCagnotte(l, "montant"), 303)

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue"
  const cle = createHash("sha256").update(`cagnotte:${ip}`).digest("hex").slice(0, 24)
  if (!(await autoriser(cle, 10, 10 * 60 * 1000)))
    return Response.redirect(pageCagnotte(l, "trop"), 303)
  // Chaque envoi ouvre une session Stripe : 120 par heure au plus, tous visiteurs confondus.
  if (!(await autoriser("cagnotte:tous", 120, 3600 * 1000)))
    return Response.redirect(pageCagnotte(l, "trop"), 303)

  if (!stripeActif()) return Response.redirect(pageCagnotte(l, "bientot"), 303)
  try {
    return Response.redirect(await creerSessionCagnotte(centimes, l), 303)
  } catch (e) {
    console.error("[cagnotte] session de paiement :", (e as Error).message)
    return Response.redirect(pageCagnotte(l, "erreur"), 303)
  }
}
