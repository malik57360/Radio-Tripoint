"use server"

import { estConnecte } from "@/lib/direction/acces"
import { enregistrerBrouillon, envoyerReponse, proposerReponse } from "@/lib/direction/mails"

type Resultat = { ok: true; texte?: string; message?: string } | { ok: false; erreur: string }

const uidValide = (uid: unknown) => Number.isInteger(uid) && (uid as number) > 0

async function garde<T>(travail: () => Promise<T>): Promise<T | Resultat> {
  if (!(await estConnecte())) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  try {
    return await travail()
  } catch (e) {
    console.error("[mails]", (e as Error).message)
    return { ok: false, erreur: (e as Error).message || "Erreur inattendue." }
  }
}

export async function actionProposer(uid: number): Promise<Resultat> {
  if (!uidValide(uid)) return { ok: false, erreur: "Message invalide." }
  return garde(async () => ({ ok: true as const, texte: await proposerReponse(uid) }))
}

export async function actionEnvoyer(uid: number, texte: string): Promise<Resultat> {
  if (!uidValide(uid) || !texte.trim()) return { ok: false, erreur: "La réponse est vide." }
  return garde(async () => {
    const a = await envoyerReponse(uid, texte.slice(0, 20_000))
    return { ok: true as const, message: `Réponse envoyée à ${a}.` }
  })
}

export async function actionBrouillon(uid: number, texte: string): Promise<Resultat> {
  if (!uidValide(uid) || !texte.trim()) return { ok: false, erreur: "La réponse est vide." }
  return garde(async () => {
    await enregistrerBrouillon(uid, texte.slice(0, 20_000))
    return { ok: true as const, message: "Brouillon rangé dans la boîte (dossier Brouillons)." }
  })
}
