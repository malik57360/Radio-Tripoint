"use server"

import { createHash } from "node:crypto"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { COOKIE, jetonSession, motDePasseValide } from "@/lib/direction/acces"
import { autoriser } from "@/lib/formulaires/limiteur"

export async function seConnecter(_etat: string | null, donnees: FormData) {
  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue"
  const cle = createHash("sha256").update(`direction:${ip}`).digest("hex").slice(0, 24)
  if (!autoriser(cle, 8, 15 * 60 * 1000)) return "Trop d'essais. Réessayez dans un quart d'heure."

  const saisie = String(donnees.get("mot_de_passe") ?? "")
  if (!motDePasseValide(saisie)) return "Mot de passe incorrect."

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
