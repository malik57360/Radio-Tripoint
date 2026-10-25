import { site } from "@/config/site"
import { confirmerPaiement } from "@/lib/annonces/commandes"

/**
 * Retour de Stripe après paiement. La session est relue chez Stripe (rien
 * n'est cru sur parole dans l'URL) ; le webhook fait la même chose de son
 * côté si le visiteur ferme l'onglet. Les deux sont idempotents.
 */
export const dynamic = "force-dynamic"

const vers = (etat: string) => new URL(`/annonces/mon-espace?paiement=${etat}`, site.url)

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("session_id") ?? ""
  try {
    const c = await confirmerPaiement(id)
    return Response.redirect(vers(c && c.statut !== "attente" ? "ok" : "attente"), 303)
  } catch (e) {
    // Confirmation déjà en cours (webhook) ou Stripe injoignable : l'espace affichera l'état réel.
    console.error("[annonces] retour de paiement :", (e as Error).message)
    return Response.redirect(vers("attente"), 303)
  }
}
