"use server"

import { revalidatePath } from "next/cache"
import { retirerJoueur } from "@/lib/concours/serveur"
import { estConnecte } from "@/lib/direction/acces"

/** Jeu concours : retire un joueur d'une manche (partie truquée, pseudo déplacé). */
export async function retirerDuConcours(donnees: FormData) {
  if (!(await estConnecte())) return
  const joueur = String(donnees.get("joueur") ?? "")
  const jour = String(donnees.get("jour") ?? "")
  if (!/^[0-9a-f]{24}$/.test(joueur) || !/^\d{4}-\d{2}-\d{2}$/.test(jour)) return
  await retirerJoueur(joueur, jour)
  revalidatePath("/direction/engagement")
}
