"use server"

import { del } from "@vercel/blob"
import { revalidatePath, revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { categories } from "@/data/categories"
import { CLE_ARTICLES, TAG_ARTICLES } from "@/lib/contenu/articles-dashboard"
import { slugsArticles } from "@/lib/contenu/articles"
import { estConnecte } from "@/lib/direction/acces"
import { redis } from "@/lib/direction/redis"
import { normaliser } from "@/lib/utils/texte"
import type { Article } from "@/types/article"
import type { CategorieSlug } from "@/types/category"
import type { Bloc, Visuel } from "@/types/media"

type Resultat = { ok: true; message: string; lien?: string } | { ok: false; erreur: string }

const URL_PHOTO =
  /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/articles\/[a-z0-9]{12}\/[\w.-]+\.webp$/

const photo = z.object({
  url: z.string().regex(URL_PHOTO, "Photo non reconnue."),
  largeur: z.number().int().min(50).max(8000),
  hauteur: z.number().int().min(50).max(8000),
  legende: z.string().trim().max(300).optional(),
  credit: z.string().trim().max(120).optional(),
})

const schema = z.object({
  titre: z.string().trim().min(8, "Titre trop court.").max(160, "Titre trop long."),
  chapeau: z
    .string()
    .trim()
    .min(20, "Chapeau trop court (une à deux phrases).")
    .max(400, "Chapeau trop long (400 caractères max)."),
  categorie: z.enum(Object.keys(categories) as [CategorieSlug, ...CategorieSlug[]]),
  auteur: z.string().trim().max(80).optional(),
  lieux: z.string().trim().max(200).optional(),
  texte: z.string().trim().min(80, "Texte trop court.").max(40_000, "Texte trop long."),
  photos: z.array(photo).min(1, "Au moins une photo (la photo principale).").max(12),
  une: z.boolean().optional(),
})
export type DonneesArticle = z.infer<typeof schema>

/** « Le Schengen Museum fête… » → « le-schengen-museum-fete… » */
const versSlug = (titre: string) =>
  normaliser(titre)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "")

/** Maintenant, à l'heure de Paris, au format des articles (2026-10-06T13:00:00+02:00). */
function maintenantParis() {
  const d = new Date()
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZoneName: "longOffset",
    })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  )
  const decalage = p.timeZoneName === "GMT" ? "+00:00" : p.timeZoneName.replace("GMT", "")
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${decalage}`
}

const versVisuel = (p: z.infer<typeof photo>, alt: string): Visuel => ({
  src: p.url,
  alt: (p.legende || alt).slice(0, 300),
  largeur: p.largeur,
  hauteur: p.hauteur,
  ...(p.credit ? { credit: p.credit } : {}),
})

/**
 * Texte → blocs. Un paragraphe par bloc séparé d'une ligne vide ;
 * « ## » = intertitre, « > » = citation (« — Nom » en dernière ligne pour
 * l'auteur), « - » = liste, « [photo 2] » = place de la 2e photo. Les photos
 * non placées sont réparties dans le texte.
 */
function versCorps(texte: string, photos: z.infer<typeof photo>[], titre: string): Bloc[] {
  const morceaux = texte
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .map((m) => m.trim())
    .filter(Boolean)
  const blocs: (Bloc | { type: "photo"; n: number })[] = []
  const placees = new Set<number>()
  for (const m of morceaux) {
    const lignes = m.split("\n").map((l) => l.trim())
    const marque = /^\[photo\s*(\d+)\]$/i.exec(m)
    if (marque) {
      const n = Number(marque[1]) - 1
      if (n >= 1 && n < photos.length && !placees.has(n)) {
        placees.add(n)
        blocs.push({ type: "photo", n })
      }
    } else if (/^#{1,3}\s/.test(m)) {
      blocs.push({ type: "intertitre", texte: m.replace(/^#{1,3}\s+/, "").replace(/\n/g, " ") })
    } else if (lignes.every((l) => /^[-•*]\s/.test(l))) {
      blocs.push({ type: "liste", elements: lignes.map((l) => l.replace(/^[-•*]\s+/, "")) })
    } else if (m.startsWith(">")) {
      const l = lignes.map((x) => x.replace(/^>\s?/, ""))
      const signe = /^[—–-]\s*(.+)$/.exec(l[l.length - 1] ?? "")
      const corps = (signe ? l.slice(0, -1) : l).join(" ").replace(/^[«"]\s*|\s*[»"]$/g, "")
      blocs.push({ type: "citation", texte: corps, ...(signe ? { auteur: signe[1] } : {}) })
    } else {
      blocs.push({ type: "paragraphe", texte: lignes.join(" ") })
    }
  }
  // Photos restantes (hors photo principale) : réparties à intervalles réguliers.
  const reste = photos.map((_, i) => i).filter((i) => i > 0 && !placees.has(i))
  const texteSeul = blocs.filter((b) => b.type !== "photo").length
  for (let j = reste.length - 1; j >= 0; j--) {
    const apres = Math.max(1, Math.round(((j + 1) * texteSeul) / (reste.length + 1)))
    let vus = 0
    let ou = blocs.length
    for (let i = 0; i < blocs.length; i++) {
      if (blocs[i].type !== "photo") vus++
      if (vus === apres) {
        ou = i + 1
        break
      }
    }
    blocs.splice(ou, 0, { type: "photo", n: reste[j] })
  }
  return blocs.map((b) =>
    b.type === "photo"
      ? {
          type: "image",
          visuel: versVisuel(photos[b.n], titre),
          ...(photos[b.n].legende ? { legende: photos[b.n].legende } : {}),
        }
      : b,
  )
}

export async function actionPublierArticle(donnees: DonneesArticle): Promise<Resultat> {
  if (!(await estConnecte())) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  const v = schema.safeParse(donnees)
  if (!v.success) return { ok: false, erreur: v.error.issues[0]?.message ?? "Formulaire invalide." }
  const d = v.data
  const base = versSlug(d.titre)
  if (base.length < 4) return { ok: false, erreur: "Titre invalide." }
  const pris = new Set(await slugsArticles())
  let slug = base
  for (let i = 2; pris.has(slug); i++) slug = `${base}-${i}`

  const article: Article = {
    slug,
    titre: d.titre,
    chapeau: d.chapeau,
    categorie: d.categorie,
    publieLe: maintenantParis(),
    ...(d.auteur ? { auteur: d.auteur } : {}),
    ...(d.lieux
      ? {
          lieux: d.lieux
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean)
            .slice(0, 10),
        }
      : {}),
    visuel: versVisuel(d.photos[0], d.titre),
    corps: versCorps(d.texte, d.photos, d.titre),
    ...(d.une ? { une: true } : {}),
  }
  const r = await redis([["HSET", CLE_ARTICLES, slug, JSON.stringify(article)]])
  if (!r || r[0] === null) return { ok: false, erreur: "Base de données injoignable : réessayez." }
  revalidateTag(TAG_ARTICLES, { expire: 0 })
  revalidatePath("/direction/articles")
  return { ok: true, message: "Article en ligne.", lien: `/actualites/${slug}` }
}

export async function actionRetirerArticle(slug: unknown): Promise<Resultat> {
  if (!(await estConnecte())) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  if (typeof slug !== "string" || !/^[a-z0-9-]{4,90}$/.test(slug))
    return { ok: false, erreur: "Article invalide." }
  const lu = await redis([["HGET", CLE_ARTICLES, slug]])
  if (!lu || typeof lu[0] !== "string") return { ok: false, erreur: "Article introuvable." }
  const r = await redis([["HDEL", CLE_ARTICLES, slug]])
  if (!r) return { ok: false, erreur: "Base de données injoignable : réessayez." }
  revalidateTag(TAG_ARTICLES, { expire: 0 })
  revalidatePath("/direction/articles")
  // Photos supprimées du stockage une fois la réponse partie : le retrait
  // ne dépend pas du stockage, qui peut être lent ou injoignable.
  after(async () => {
    try {
      const a = JSON.parse(lu[0] as string) as Article
      const urls = [
        a.visuel?.src,
        ...a.corps.map((b) => (b.type === "image" ? b.visuel.src : undefined)),
      ].filter((u): u is string => !!u && URL_PHOTO.test(u))
      if (urls.length) await del(urls, { abortSignal: AbortSignal.timeout(15_000) })
    } catch (e) {
      console.error("[articles] suppression photos", (e as Error).message)
    }
  })
  return { ok: true, message: "Article retiré du site." }
}
