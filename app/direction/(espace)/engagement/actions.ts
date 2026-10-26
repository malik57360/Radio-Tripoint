"use server"

import { revalidatePath } from "next/cache"
import { classementDirection, marquerPrevenu, retirerJoueur } from "@/lib/concours/serveur"
import { estConnecte } from "@/lib/direction/acces"
import { envoyerNouveau } from "@/lib/direction/mails"

/** Jeu concours : retire un joueur d'une manche (partie truquée, pseudo déplacé). */
export async function retirerDuConcours(donnees: FormData) {
  if (!(await estConnecte())) return
  const joueur = String(donnees.get("joueur") ?? "")
  const jour = String(donnees.get("jour") ?? "")
  if (!/^[0-9a-f]{24}$/.test(joueur) || !/^\d{4}-\d{2}-\d{2}$/.test(jour)) return
  await retirerJoueur(joueur, jour)
  revalidatePath("/direction/engagement")
}

/**
 * Prévenir des gagnants : un e-mail par personne, envoyé depuis info@ (avec
 * la signature de la radio), « {pseudo} » remplacé par son pseudo. Rien ne
 * part sans ce clic ; chaque envoi est noté pour ne pas prévenir deux fois.
 */
export async function actionPrevenirGagnants(brut: {
  objet: string
  message: string
  cibles: { jour: string; joueur: string }[]
}): Promise<{ ok: boolean; envoyes: string[]; erreurs: string[] }> {
  if (!(await estConnecte()))
    return { ok: false, envoyes: [], erreurs: ["Session expirée : reconnectez-vous."] }
  const objet = String(brut.objet ?? "")
    .trim()
    .slice(0, 200)
  const message = String(brut.message ?? "")
    .trim()
    .slice(0, 5000)
  if (objet.length < 3 || message.length < 10)
    return { ok: false, envoyes: [], erreurs: ["L'objet ou le message est vide."] }
  const c = await classementDirection(1)
  const envoyes: string[] = []
  const erreurs: string[] = []
  for (const cible of (brut.cibles ?? []).slice(0, 50)) {
    const g = c?.gagnants.find((x) => x.jour === cible.jour && x.joueur === cible.joueur)
    if (!g || !g.email) {
      erreurs.push(`Gagnant introuvable (${cible.jour})`)
      continue
    }
    try {
      await envoyerNouveau(g.email, objet, message.replaceAll("{pseudo}", g.pseudo))
      await marquerPrevenu(g.jour, g.joueur)
      envoyes.push(g.pseudo)
    } catch (e) {
      erreurs.push(`${g.pseudo} : ${(e as Error).message}`)
    }
  }
  revalidatePath("/direction/engagement")
  return { ok: erreurs.length === 0, envoyes, erreurs }
}
