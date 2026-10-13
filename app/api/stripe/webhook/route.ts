import { lireSessionPaiement, publier } from "@/lib/agenda/propositions"
import { enregistrerParticipation, lireSessionCagnotte } from "@/lib/cagnotte"
import { signatureStripeValide } from "@/lib/stripe"

/**
 * Webhook Stripe (checkout.session.completed / async_payment_succeeded).
 * Signature vérifiée, puis la session est relue chez Stripe avant de
 * publier : le corps du message ne suffit pas à lui seul. Les métadonnées
 * aiguillent seulement : cagnotte d'un côté, agenda de l'autre.
 */
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const corps = await request.text()
  if (!signatureStripeValide(corps, request.headers.get("stripe-signature")))
    return new Response("signature invalide", { status: 400 })

  let evt: {
    type?: string
    data?: { object?: { id?: string; metadata?: Record<string, string> | null } }
  }
  try {
    evt = JSON.parse(corps)
  } catch {
    return new Response("corps invalide", { status: 400 })
  }
  if (
    evt.type !== "checkout.session.completed" &&
    evt.type !== "checkout.session.async_payment_succeeded"
  )
    return Response.json({ recu: true })

  try {
    if (evt.data?.object?.metadata?.cagnotte) {
      const c = await lireSessionCagnotte(evt.data.object.id ?? "")
      if (c?.paye) await enregistrerParticipation(c)
      return Response.json({ recu: true })
    }
    const s = await lireSessionPaiement(evt.data?.object?.id ?? "")
    if (s?.paye && s.proposition)
      await publier(s.proposition, {
        mode: "stripe",
        reference: s.id,
        montant: s.montant,
        le: Date.now(),
      })
  } catch (e) {
    // 500 : Stripe renverra l'événement plus tard.
    console.error("[stripe] webhook :", (e as Error).message)
    return new Response("erreur", { status: 500 })
  }
  return Response.json({ recu: true })
}
