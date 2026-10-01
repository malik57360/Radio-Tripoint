import "server-only"
import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

/**
 * Accès au tableau de bord de la direction : un mot de passe
 * (DIRECTION_MOT_DE_PASSE), puis un cookie signé de 30 jours. Sans mot de
 * passe configuré, le tableau de bord reste fermé.
 */
export const COOKIE = "rt_direction"
const DUREE_S = 30 * 24 * 3600

const motDePasse = () => process.env.DIRECTION_MOT_DE_PASSE ?? ""

const signer = (valeur: string) =>
  createHmac("sha256", `rt-direction:${motDePasse()}`).update(valeur).digest("hex")

function egal(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export const accesConfigure = () => motDePasse().length >= 8

export function motDePasseValide(saisie: string) {
  return accesConfigure() && egal(signer(saisie), signer(motDePasse()))
}

export function jetonSession() {
  const expire = String(Math.floor(Date.now() / 1000) + DUREE_S)
  return { valeur: `${expire}.${signer(expire)}`, maxAge: DUREE_S }
}

export async function estConnecte() {
  if (!accesConfigure()) return false
  const v = (await cookies()).get(COOKIE)?.value ?? ""
  const [expire, signature] = v.split(".")
  if (!expire || !signature) return false
  if (Number(expire) * 1000 < Date.now()) return false
  return egal(signature, signer(expire))
}
