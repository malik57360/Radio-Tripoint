/**
 * Photos d'annonce, préparées dans le navigateur avant l'envoi : deux
 * tailles (fiche et vignette), réencodées en WebP — ou JPEG là où le
 * navigateur n'écrit pas le WebP (Safari sur iPhone). Le réencodage efface
 * les métadonnées EXIF, dont la position GPS de la prise de vue.
 */
import type { Photo } from "./types"

export const TYPES_ACCEPTES = "image/jpeg,image/png,image/webp,image/heic,image/heif"
export const MAX_OCTETS_SOURCE = 25 * 1024 * 1024

async function ouvrir(
  f: File,
): Promise<{ source: CanvasImageSource; l: number; h: number; fin: () => void }> {
  try {
    const b = await createImageBitmap(f, { imageOrientation: "from-image" })
    return { source: b, l: b.width, h: b.height, fin: () => b.close() }
  } catch {
    const url = URL.createObjectURL(f)
    const img = new Image()
    img.src = url
    await img.decode()
    return {
      source: img,
      l: img.naturalWidth,
      h: img.naturalHeight,
      fin: () => URL.revokeObjectURL(url),
    }
  }
}

async function encoder(
  img: { source: CanvasImageSource; l: number; h: number },
  maxCote: number,
  qualite: number,
) {
  const k = Math.min(1, maxCote / Math.max(img.l, img.h))
  const l = Math.max(1, Math.round(img.l * k))
  const h = Math.max(1, Math.round(img.h * k))
  const c = document.createElement("canvas")
  c.width = l
  c.height = h
  const ctx = c.getContext("2d")!
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, l, h)
  ctx.drawImage(img.source, 0, 0, l, h)
  const vers = (type: string, q: number) => new Promise<Blob | null>((ok) => c.toBlob(ok, type, q))
  let blob = await vers("image/webp", qualite)
  if (!blob || blob.type !== "image/webp") blob = await vers("image/jpeg", qualite)
  if (!blob || (blob.type !== "image/jpeg" && blob.type !== "image/webp"))
    throw new Error("Cette photo n'a pas pu être préparée. Essayez une autre image.")
  return { blob, l, h }
}

async function envoyer(blob: Blob, taille: "grande" | "vignette") {
  const r = await fetch(`/api/annonces/photo?taille=${taille}`, {
    method: "POST",
    headers: { "Content-Type": blob.type },
    body: blob,
  })
  const d = (await r.json().catch(() => ({}))) as { url?: string; erreur?: string }
  if (!r.ok || !d.url) throw new Error(d.erreur ?? "Envoi de la photo impossible.")
  return d.url
}

/** Prépare et envoie une photo ; renvoie ce que l'annonce garde. */
export async function preparerEtEnvoyer(f: File): Promise<Photo> {
  if (f.size > MAX_OCTETS_SOURCE) throw new Error("Photo trop lourde (25 Mo au plus).")
  const img = await ouvrir(f)
  try {
    const grande = await encoder(img, 1600, 0.82)
    const petite = await encoder(img, 480, 0.78)
    const [url, vignette] = await Promise.all([
      envoyer(grande.blob, "grande"),
      envoyer(petite.blob, "vignette"),
    ])
    return { url, vignette, l: grande.l, h: grande.h }
  } finally {
    img.fin()
  }
}
