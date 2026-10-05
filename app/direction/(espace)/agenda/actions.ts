"use server"

import { revalidatePath } from "next/cache"
import { mailAcceptation, mailRefus } from "@/lib/agenda/mails"
import {
  changerStatut,
  lireProposition,
  noterMailEnvoye,
  publier,
  PRIX_CENTIMES,
  retirer,
  stripeActif,
} from "@/lib/agenda/propositions"
import { estConnecte } from "@/lib/direction/acces"
import { boiteConfiguree, envoyerNouveau } from "@/lib/direction/mails"

type Resultat = { ok: true; message: string } | { ok: false; erreur: string }

const idValide = (id: unknown): id is string => typeof id === "string" && /^[a-f0-9]{12}$/.test(id)

async function garde(id: unknown, travail: (id: string) => Promise<string>): Promise<Resultat> {
  if (!(await estConnecte())) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  if (!idValide(id)) return { ok: false, erreur: "Dossier invalide." }
  try {
    const message = await travail(id)
    revalidatePath("/direction/agenda")
    return { ok: true, message }
  } catch (e) {
    console.error("[agenda]", (e as Error).message)
    return { ok: false, erreur: (e as Error).message || "Erreur inattendue." }
  }
}

/** Envoie le lien de paiement ; renvoie ce qu'il faut dire à la personne. */
async function envoyerLien(id: string) {
  const p = await lireProposition(id)
  if (!p) throw new Error("Dossier introuvable.")
  if (!stripeActif())
    return "Stripe n'est pas encore branché : aucun e-mail n'est parti. Encaissez les 50 € autrement, puis « Marquer payé »."
  if (!boiteConfiguree())
    return "La boîte mail n'est pas branchée : copiez le lien de paiement et envoyez-le vous-même."
  const m = mailAcceptation(p)
  await envoyerNouveau(p.contact.email, m.objet, m.texte)
  await noterMailEnvoye(id)
  return `Lien de paiement envoyé à ${p.contact.email}.`
}

export async function actionAccepter(id: string) {
  return garde(id, async (id) => {
    await changerStatut(id, "accepte")
    return `Accepté. ${await envoyerLien(id)}`
  })
}

export async function actionRenvoyer(id: string) {
  return garde(id, async (id) => {
    const p = await lireProposition(id)
    if (p?.statut !== "accepte") throw new Error("Seul un dossier accepté attend un paiement.")
    return envoyerLien(id)
  })
}

export async function actionRefuser(id: string, motif: string, prevenir: boolean) {
  return garde(id, async (id) => {
    const propre = String(motif ?? "").slice(0, 1000)
    const p = await changerStatut(id, "refuse", { motifRefus: propre || undefined })
    if (!prevenir) return "Refusé. L'organisateur n'a pas été prévenu."
    if (!boiteConfiguree())
      return "Refusé. Boîte mail non branchée : prévenez l'organisateur vous-même."
    const m = mailRefus(p, propre)
    await envoyerNouveau(p.contact.email, m.objet, m.texte)
    return `Refusé. Message envoyé à ${p.contact.email}.`
  })
}

/** Paiement reçu hors Stripe (virement, espèces, chèque) : publication immédiate. */
export async function actionMarquerPaye(id: string) {
  return garde(id, async (id) => {
    const p = await publier(id, { mode: "manuel", montant: PRIX_CENTIMES, le: Date.now() })
    if (!p) throw new Error("Acceptez d'abord le dossier.")
    return "Payé : l'événement est en ligne dans l'agenda."
  })
}

export async function actionRetirer(id: string) {
  return garde(id, async (id) => {
    await retirer(id)
    return "Retiré de l'agenda."
  })
}
