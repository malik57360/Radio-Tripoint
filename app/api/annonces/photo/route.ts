import { randomBytes } from "node:crypto"
import { put } from "@vercel/blob"
import { URL_ANNONCES } from "@/lib/annonces/liens"
import { compteConnecte } from "@/lib/annonces/comptes"
import { autoriser } from "@/lib/annonces/limiteur"

/**
 * Photo d'une annonce. Le navigateur l'a déjà réduite et réencodée (WebP,
 * ou JPEG sur iPhone) : ce réencodage efface aussi les métadonnées EXIF,
 * dont la position GPS. Ici : compte connecté et vérifié, même origine,
 * débit limité, vrai fichier image (signature), taille bornée. Rangée
 * dans le Blob Vercel sous annonces/<compte>/, nom aléatoire.
 */
export const dynamic = "force-dynamic"

const MAX_OCTETS = 3_000_000

const refus = (erreur: string, status: number) => Response.json({ erreur }, { status })

export async function POST(request: Request) {
  const origine = request.headers.get("origin")
  if (
    origine &&
    origine !== new URL(URL_ANNONCES).origin &&
    origine !== new URL(request.url).origin
  )
    return refus("Origine refusée.", 403)
  const c = await compteConnecte()
  if (!c) return refus("Session expirée : reconnectez-vous.", 401)
  if (!c.emailVerifie) return refus("Confirmez d'abord votre adresse e-mail.", 403)
  if (!process.env.BLOB_READ_WRITE_TOKEN) return refus("Stockage des photos non branché.", 503)
  if (!(await autoriser("photo", c.id, 120, 3600)))
    return refus("Beaucoup de photos envoyées : réessayez dans une heure.", 429)

  const taille =
    new URL(request.url).searchParams.get("taille") === "vignette" ? "vignette" : "grande"
  const type = request.headers.get("content-type")
  if (type !== "image/webp" && type !== "image/jpeg")
    return refus("Format attendu : WebP ou JPEG.", 415)
  const octets = await request.arrayBuffer()
  if (!octets.byteLength || octets.byteLength > MAX_OCTETS) return refus("Photo trop lourde.", 413)
  const tete = new Uint8Array(octets.slice(0, 12))
  const ascii = String.fromCharCode(...tete)
  const vraie =
    type === "image/webp"
      ? ascii.startsWith("RIFF") && ascii.slice(8) === "WEBP"
      : tete[0] === 0xff && tete[1] === 0xd8 && tete[2] === 0xff
  if (!vraie) return refus("Image illisible.", 400)
  try {
    const b = await put(
      `annonces/${c.id}/${randomBytes(8).toString("hex")}-${taille}.${type === "image/webp" ? "webp" : "jpg"}`,
      octets,
      {
        access: "public",
        contentType: type,
        addRandomSuffix: true,
        cacheControlMaxAge: 31_536_000,
      },
    )
    return Response.json({ url: b.url })
  } catch (e) {
    console.error("[annonces] photo :", (e as Error).message)
    return refus("Envoi de la photo impossible.", 502)
  }
}
