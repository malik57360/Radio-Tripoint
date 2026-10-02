"use server"

import { estConnecte } from "@/lib/direction/acces"
import {
  enregistrerBrouillon,
  envoyerNouveau,
  envoyerReponse,
  proposerMessage,
  proposerReponse,
} from "@/lib/direction/mails"
import { ecrireSuivi, lireSuivi, type Suivi } from "@/lib/direction/prospection"

type Resultat =
  { ok: true; texte?: string; objet?: string; message?: string } | { ok: false; erreur: string }

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

export async function actionProposerMessage(
  consigne: string,
  entreprise?: { nom: string; activite?: string; commune?: string; dirigeant?: string },
): Promise<Resultat> {
  return garde(async () => {
    const r = await proposerMessage({ consigne, entreprise })
    return { ok: true as const, objet: r.objet, texte: r.texte }
  })
}

export async function actionEnvoyerNouveau(
  a: string,
  objet: string,
  texte: string,
  prospect?: { siren: string; nom: string; commune: string; activite: string },
): Promise<Resultat> {
  if (!texte.trim()) return { ok: false, erreur: "Le message est vide." }
  return garde(async () => {
    const dest = await envoyerNouveau(a, objet, texte.slice(0, 20_000))
    // Prospection : la fiche passe à « Contacté » et garde l'adresse utilisée.
    if (prospect && /^\d{9}$/.test(prospect.siren)) {
      const avant = await lireSuivi(prospect.siren).catch(() => null)
      const suivi: Suivi = {
        statut: !avant || avant.statut === "a_contacter" ? "contacte" : avant.statut,
        note: avant?.note ?? "",
        email: dest,
        telephone: avant?.telephone ?? "",
        nom: prospect.nom,
        commune: prospect.commune,
        activite: prospect.activite,
        maj: Date.now(),
        dernierEnvoi: Date.now(),
      }
      await ecrireSuivi(prospect.siren, suivi).catch(() => {})
    }
    return { ok: true as const, message: `Message envoyé à ${dest}.` }
  })
}
