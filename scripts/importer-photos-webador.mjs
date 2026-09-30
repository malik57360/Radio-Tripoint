// Télécharge les photos des articles repris de l'ancien site Webador
// (liste : scripts/photos-webador.json) vers public/media/articles/, puis
// régénère data/articles/photos.ts.
//
//   node scripts/importer-photos-webador.mjs
//
// Il faut l'accès réseau à primary.jwwb.nl. Si `sharp` est installé (il
// vient avec Next), les photos sont ramenées à 1600 px de large en WebP ;
// sinon elles sont copiées telles quelles. Rejouable : un fichier déjà
// présent n'est pas retéléchargé. Passer ensuite `npx prettier --write .`.
import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const racine = path.resolve(import.meta.dirname, "..")
const dossier = path.join(racine, "public/media/articles")
const manifeste = JSON.parse(
  await readFile(path.join(racine, "scripts/photos-webador.json"), "utf8"),
)

let sharp = null
try {
  sharp = (await import("sharp")).default
} catch {
  console.warn("sharp absent : photos copiées sans redimensionnement.")
}

/** Largeur et hauteur lues dans l'en-tête PNG, JPEG, GIF ou WebP. */
function dimensions(b) {
  if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)]
  if (b.toString("ascii", 0, 3) === "GIF") return [b.readUInt16LE(6), b.readUInt16LE(8)]
  if (b.toString("ascii", 8, 12) === "WEBP") {
    const type = b.toString("ascii", 12, 16)
    if (type === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]
    if (type === "VP8L") {
      const n = b.readUInt32LE(21)
      return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)]
    }
    return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2
    while (i < b.length) {
      const marqueur = b[i + 1]
      const taille = b.readUInt16BE(i + 2)
      if (marqueur >= 0xc0 && marqueur <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marqueur))
        return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]
      i += 2 + taille
    }
  }
  throw new Error("format d'image non reconnu")
}

async function telecharger(url) {
  for (let essai = 1; ; essai++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(30_000) })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return Buffer.from(await r.arrayBuffer())
    } catch (e) {
      if (essai >= 3) throw e
      await new Promise((ok) => setTimeout(ok, 1000 * essai))
    }
  }
}

await mkdir(dossier, { recursive: true })
const resultat = {}
const echecs = []

for (const { slug, photos } of manifeste) {
  for (const [i, url] of photos.entries()) {
    const nom = `${slug}${i ? `-${i + 1}` : ""}`
    const ext = sharp ? ".webp" : path.extname(new URL(url).pathname).toLowerCase()
    const fichier = path.join(dossier, nom + ext)
    try {
      if (!existsSync(fichier)) {
        const brut = await telecharger(url)
        const sortie = sharp
          ? await sharp(brut)
              .rotate()
              .resize({ width: 1600, withoutEnlargement: true })
              .webp({ quality: 82 })
              .toBuffer()
          : brut
        await writeFile(fichier, sortie)
      }
      const [largeur, hauteur] = dimensions(await readFile(fichier))
      ;(resultat[slug] ??= []).push({
        src: `/media/articles/${nom}${ext}`,
        alt: "",
        largeur,
        hauteur,
      })
      console.log(`ok  ${nom}${ext} (${largeur}×${hauteur})`)
    } catch (e) {
      echecs.push(`${url} : ${e.message}`)
      console.error(`ERR ${url} : ${e.message}`)
    }
  }
}

const entete = `import type { Visuel } from "@/types/media"

/**
 * Photos des articles repris de l'ancien site, par slug : la première sert
 * de visuel, les suivantes s'ajoutent en fin d'article.
 *
 * FICHIER GÉNÉRÉ par \`node scripts/importer-photos-webador.mjs\`, qui
 * télécharge les photos listées dans \`scripts/photos-webador.json\` vers
 * \`public/media/articles/\`. Vide tant qu'il n'a pas tourné.
 */
export const photos: Record<string, Visuel[]> = `
await writeFile(
  path.join(racine, "data/articles/photos.ts"),
  entete + JSON.stringify(resultat, null, 2) + "\n",
)
const total = Object.values(resultat).flat().length
console.log(`\n${total} photos pour ${Object.keys(resultat).length} articles.`)
if (echecs.length) {
  console.error(`${echecs.length} échec(s) :\n${echecs.join("\n")}`)
  process.exitCode = 1
}
