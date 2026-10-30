"use server"

import { createHash } from "node:crypto"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { COOKIE, jetonSession, motDePasseValide } from "@/lib/direction/acces"
import { redis } from "@/lib/direction/redis"
import { autoriser } from "@/lib/formulaires/limiteur"

/**
 * Au-delà de 100 mots de passe faux en une heure, toutes adresses
 * confondues, c'est une attaque répartie : plus personne n'entre pendant
 * l'heure, plutôt que de laisser deviner le mot de passe.
 */
const ECHECS = "rt:lim:direction:echecs"
const MAX_ECHECS = 100

export async function seConnecter(_etat: string | null, donnees: FormData) {
  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue"
  const cle = createHash("sha256").update(`direction:${ip}`).digest("hex").slice(0, 24)
  if (!(await autoriser(cle, 8, 15 * 60 * 1000)))
    return "Trop d'essais. Réessayez dans un quart d'heure."

  const echecs = await redis([["GET", ECHECS]])
  if (Number(echecs?.[0] ?? 0) >= MAX_ECHECS)
    return "Trop d'essais sur le tableau de bord : connexion suspendue pendant une heure."

  const saisie = String(donnees.get("mot_de_passe") ?? "")
  if (!motDePasseValide(saisie)) {
    await redis([
      ["SET", ECHECS, 0, "EX", 3600, "NX"],
      ["INCR", ECHECS],
    ])
    return "Mot de passe incorrect."
  }

  const { valeur, maxAge } = jetonSession()
  ;(await cookies()).set(COOKIE, valeur, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  })
  redirect("/direction")
}

export async function seDeconnecter() {
  ;(await cookies()).delete(COOKIE)
  redirect("/direction/connexion")
}
