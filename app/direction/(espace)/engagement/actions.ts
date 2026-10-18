"use server"

import { revalidatePath } from "next/cache"
import { retirerJoueur } from "@/lib/concours/serveur"
import { estConnecte } from "@/lib/direction/acces"

/** Jeu concours : retire un joueur du classement (partie truquée, pseudo déplacé). */
export async function retirerDuConcours(donnees: FormData) {
  if (!(await estConnecte())) return
  const joueur = String(donnees.get("joueur") ?? "")
  if (!/^[0-9a-f]{24}$/.test(joueur)) return
  await retirerJoueur(joueur)
  revalidatePath("/direction/engagement")
}
