import { site } from "@/config/site"
import { lireProposition, lireSessionPaiement, publier } from "@/lib/agenda/propositions"
import type { Langue } from "@/lib/i18n/langues"

/**
 * Retour de Stripe après paiement. On relit la session chez Stripe (rien
 * n'est cru sur parole dans l'URL) et on publie tout de suite ; le webhook
 * fait la même chose de son côté si le visiteur ferme l'onglet.
 */
export const dynamic = "force-dynamic"

const page = (l: Langue, etat: string, slug?: string) =>
  new URL(
    `${l === "fr" ? "" : `/${l}`}/agenda/paiement?${new URLSearchParams({ etat, ...(slug ? { slug } : {}) })}`,
    site.url,
  )

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("session_id") ?? ""
  try {
    const s = await lireSessionPaiement(id)
    const p = s?.proposition ? await lireProposition(s.proposition) : null
    if (!s || !p) return Response.redirect(page("fr", "invalide"), 303)
    if (!s.paye) return Response.redirect(page(p.langue, "attente"), 303)
    const publie = await publier(p.id, {
      mode: "stripe",
      reference: s.id,
      montant: s.montant,
      le: Date.now(),
    })
    return Response.redirect(page(p.langue, publie ? "merci" : "indisponible", p.slug), 303)
  } catch (e) {
    console.error("[agenda] retour de paiement :", (e as Error).message)
    return Response.redirect(page("fr", "attente"), 303)
  }
}
