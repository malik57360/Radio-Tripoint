import { enregistrerParticipation, lireSessionCagnotte, pageCagnotte } from "@/lib/cagnotte"
import { estLangue, type Langue } from "@/lib/i18n/langues"

/**
 * Retour de Stripe après une participation. On relit la session chez
 * Stripe et on l'ajoute au total tout de suite ; le webhook fait la même
 * chose de son côté si le visiteur ferme l'onglet.
 */
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams
  const l: Langue = estLangue(q.get("l")) ? (q.get("l") as Langue) : "fr"
  try {
    const s = await lireSessionCagnotte(q.get("session_id") ?? "")
    if (!s) return Response.redirect(pageCagnotte(l, "invalide"), 303)
    if (!s.paye) return Response.redirect(pageCagnotte(l, "attente"), 303)
    await enregistrerParticipation(s)
    return Response.redirect(pageCagnotte(l, "merci"), 303)
  } catch (e) {
    console.error("[cagnotte] retour de paiement :", (e as Error).message)
    return Response.redirect(pageCagnotte(l, "attente"), 303)
  }
}
