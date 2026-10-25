import "server-only"
import { createHash } from "node:crypto"
import { headers } from "next/headers"
import { redis } from "@/lib/direction/redis"

/**
 * Limiteur de débit partagé (Redis) : sur Vercel, chaque requête peut
 * tomber sur une instance différente, un compteur en mémoire ne tient pas.
 * Fenêtre fixe : le premier passage crée le compteur avec sa durée, les
 * suivants l'incrémentent. Les adresses IP et e-mails ne sont rangés que
 * hachés.
 */
const empreinte = (s: string) =>
  createHash("sha256").update(`rt-annonces:${s}`).digest("hex").slice(0, 32)

export async function autoriser(nom: string, qui: string, max: number, fenetreS: number) {
  const k = `rt:annonces:lim:${nom}:${empreinte(qui)}`
  const r = await redis([
    ["SET", k, 0, "EX", fenetreS, "NX"],
    ["INCR", k],
  ])
  // Redis muet : on refuse plutôt que d'ouvrir la porte aux robots.
  if (!r) return false
  return Number(r[1]) <= max
}

/** Adresse IP du visiteur (première de X-Forwarded-For, posée par Vercel). */
export async function ipVisiteur() {
  return ((await headers()).get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue"
}
