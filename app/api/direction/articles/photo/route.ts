import { put } from "@vercel/blob"
import { estConnecte } from "@/lib/direction/acces"

/**
 * Photo de presse d'un article du tableau de bord. Le navigateur l'a déjà
 * réduite et convertie en WebP ; on la range dans le Blob Vercel, sous
 * articles/<dossier>/, et on renvoie son adresse publique.
 */
const MAX_OCTETS = 4_000_000

export async function POST(request: Request) {
  if (!(await estConnecte())) return Response.json({ erreur: "Session expirée." }, { status: 401 })
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return Response.json({ erreur: "Stockage des photos non branché." }, { status: 503 })
  const dossier = new URL(request.url).searchParams.get("dossier") ?? ""
  if (!/^[a-z0-9]{12}$/.test(dossier))
    return Response.json({ erreur: "Dossier invalide." }, { status: 400 })
  if (request.headers.get("content-type") !== "image/webp")
    return Response.json({ erreur: "Format attendu : WebP." }, { status: 415 })
  const octets = await request.arrayBuffer()
  if (!octets.byteLength || octets.byteLength > MAX_OCTETS)
    return Response.json({ erreur: "Photo trop lourde." }, { status: 413 })
  // Signature RIFF....WEBP : on ne range que de vraies images WebP.
  const tete = new Uint8Array(octets.slice(0, 12))
  const ascii = String.fromCharCode(...tete)
  if (!ascii.startsWith("RIFF") || ascii.slice(8) !== "WEBP")
    return Response.json({ erreur: "Image illisible." }, { status: 400 })
  try {
    const b = await put(`articles/${dossier}/photo.webp`, octets, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: true,
      cacheControlMaxAge: 31_536_000,
    })
    return Response.json({ url: b.url })
  } catch (e) {
    console.error("[articles] photo", (e as Error).message)
    return Response.json({ erreur: "Envoi de la photo impossible." }, { status: 502 })
  }
}
