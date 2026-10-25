import { z } from "zod"
import { defCategorie, estPays, type Champ } from "./categories"
import type { CodeOffre } from "./offres"
import type { MentionPrix, Photo } from "./types"

/**
 * Validation des données envoyées par les formulaires des Petites annonces.
 * Tout est revérifié sur le serveur : le navigateur ne décide de rien.
 */

/** Coordonnées dans le texte : l'adresse reste privée, le contact passe par le formulaire. */
const COORDONNEES = [
  {
    re: /[^\s@]+@[^\s@]+\.[a-z]{2,}/i,
    message: "Pas d'adresse e-mail dans l'annonce : les acheteurs vous écrivent par le formulaire.",
  },
  {
    re: /\b(?:https?:\/\/|www\.)\S+|\b[a-z0-9-]+\.(?:com|fr|lu|de|net|org|io|shop|eu)\b/i,
    message:
      "Pas de lien dans l'annonce (les professionnels indiquent leur site dans leur compte).",
  },
  {
    re: /(?:\+|00)?\d(?:[\s.\-/]?\d){7,}/,
    message:
      "Pas de numéro de téléphone dans l'annonce : les acheteurs vous écrivent par le formulaire.",
  },
]

export function coordonneesDans(texte: string) {
  return COORDONNEES.find((c) => c.re.test(texte))?.message ?? null
}

const texte = (min: number, max: number, nom: string) =>
  z
    .string()
    .trim()
    .min(min, `${nom} : ${min} caractères au moins.`)
    .max(max, `${nom} : ${max} caractères au plus.`)
    // Caractères de contrôle (hors retours à la ligne) : jamais utiles.
    .transform((s) => s.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ""))

export const CP: Record<"FR" | "LU" | "DE", RegExp> = {
  FR: /^\d{5}$/,
  LU: /^(?:L-?)?\d{4}$/i,
  DE: /^\d{5}$/,
}

/** Prix saisi en euros (« 1 250 », « 12,50 ») → centimes. */
export function centimes(saisie: string): number | null | "invalide" {
  const s = saisie.replace(/[\s €]/g, "").replace(",", ".")
  if (!s) return null
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(s)) return "invalide"
  return Math.round(Number(s) * 100)
}

export const schemaContenu = z.object({
  categorie: z.string().max(40),
  titre: texte(5, 80, "Titre"),
  description: texte(20, 4000, "Description"),
  prix: z.string().max(20).optional().default(""),
  mention: z.enum(["", "a_debattre", "don", "sur_devis"]).optional().default(""),
  pays: z.string().refine(estPays, "Choisissez le pays."),
  ville: texte(2, 60, "Commune"),
  codePostal: z.string().trim().max(10),
  details: z.record(z.string().max(40), z.string().max(200)).optional().default({}),
  photos: z
    .array(
      z.object({
        url: z.string().url().max(400),
        vignette: z.string().url().max(400),
        l: z.number().int().min(1).max(10000),
        h: z.number().int().min(1).max(10000),
      }),
    )
    .max(30),
})

export const schemaDepot = schemaContenu.extend({
  formule: z.string().max(30),
  options: z.array(z.string().max(30)).max(10).optional().default([]),
  certification: z.literal(true, { error: "Cochez la case de certification." }),
  precautions: z.boolean().optional().default(false),
  executionImmediate: z.boolean().optional().default(false),
})

export type DonneesDepot = z.input<typeof schemaDepot>

/** Une photo vient-elle bien de notre stockage, dans le dossier de ce compte ? */
export function photoDuCompte(p: Photo, compte: string) {
  const ok = (u: string) => {
    try {
      const x = new URL(u)
      return (
        x.protocol === "https:" &&
        /^[a-z0-9]+\.public\.blob\.vercel-storage\.com$/i.test(x.hostname) &&
        x.pathname.startsWith(`/annonces/${compte}/`)
      )
    } catch {
      return false
    }
  }
  return ok(p.url) && ok(p.vignette)
}

/** Champs propres à la catégorie : valeurs permises, requis remplis. */
export function verifierDetails(categorie: string, details: Record<string, string>) {
  const def = defCategorie(categorie)
  if (!def) return { erreur: "Catégorie inconnue.", propres: {} as Record<string, string> }
  const propres: Record<string, string> = {}
  for (const c of def.champs) {
    const v = (details[c.cle] ?? "").trim()
    if (!v) {
      if (c.requis) return { erreur: `${c.libelle} : à remplir.`, propres }
      continue
    }
    const e = verifierChamp(c, v)
    if (e) return { erreur: e, propres }
    propres[c.cle] = v
  }
  return { erreur: null, propres }
}

function verifierChamp(c: Champ, v: string) {
  if (c.type === "choix") return c.options.includes(v) ? null : `${c.libelle} : choix invalide.`
  if (c.type === "nombre") {
    const n = Number(v.replace(/\s/g, ""))
    return Number.isInteger(n) && n >= c.min && n <= c.max
      ? null
      : `${c.libelle} : nombre invalide.`
  }
  if (v.length > (c.max ?? 100)) return `${c.libelle} : trop long.`
  return coordonneesDans(v)
}

export const mentionValide = (m: string): MentionPrix | undefined =>
  m === "a_debattre" || m === "don" || m === "sur_devis" ? m : undefined

export const codesOffres = (codes: string[]) => codes as CodeOffre[]
