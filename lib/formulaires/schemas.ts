import { z } from "zod"
import { choisir, type Langue, type Trad } from "@/lib/i18n/langues"

// Pas de compilation JIT : Zod testerait sinon `new Function`, ce que la
// CSP du site (sans 'unsafe-eval') refuse et signale dans la console.
z.config({ jitless: true })

/** Messages d'erreur dans les trois langues. */
const MESSAGES = {
  invalide: {
    fr: "Ce champ est invalide.",
    de: "Dieses Feld ist ungültig.",
    lb: "Dëst Feld ass net gëlteg.",
  },
  max: {
    fr: "caractères maximum.",
    de: "Zeichen höchstens.",
    lb: "Zeechen maximal.",
  },
  email: {
    fr: "Indiquez votre adresse e-mail.",
    de: "Geben Sie Ihre E-Mail-Adresse an.",
    lb: "Gitt Är E-Mail-Adress un.",
  },
  emailInvalide: {
    fr: "Adresse e-mail invalide.",
    de: "Ungültige E-Mail-Adresse.",
    lb: "Ongëlteg E-Mail-Adress.",
  },
  telephone: {
    fr: "Numéro de téléphone invalide.",
    de: "Ungültige Telefonnummer.",
    lb: "Ongëlteg Telefonsnummer.",
  },
  consentement: {
    fr: "Votre accord est nécessaire pour que nous puissions vous répondre.",
    de: "Ihre Zustimmung ist nötig, damit wir Ihnen antworten können.",
    lb: "Mir brauchen Är Zoustëmmung, fir Iech äntweren ze kënnen.",
  },
  nom: { fr: "Indiquez votre nom.", de: "Geben Sie Ihren Namen an.", lb: "Gitt Ären Numm un." },
  message: {
    fr: "Écrivez votre message.",
    de: "Schreiben Sie Ihre Nachricht.",
    lb: "Schreift Äre Message.",
  },
  messageCourt: {
    fr: "Votre message est un peu court.",
    de: "Ihre Nachricht ist etwas kurz.",
    lb: "Äre Message ass e bësse kuerz.",
  },
  ville: {
    fr: "Indiquez la ville concernée.",
    de: "Geben Sie den betroffenen Ort an.",
    lb: "Gitt d'Uertschaft un, ëm déi et geet.",
  },
  categorie: {
    fr: "Choisissez une catégorie.",
    de: "Wählen Sie eine Kategorie.",
    lb: "Wielt eng Kategorie.",
  },
  titre: {
    fr: "Donnez un titre à votre information.",
    de: "Geben Sie Ihrer Information einen Titel.",
    lb: "Gitt Ärer Informatioun en Titel.",
  },
  description: {
    fr: "Décrivez l'information.",
    de: "Beschreiben Sie die Information.",
    lb: "Beschreift d'Informatioun.",
  },
  details: {
    fr: "Donnez-nous un peu plus de détails.",
    de: "Geben Sie uns etwas mehr Details.",
    lb: "Gitt eis e bësse méi Detailer.",
  },
  entreprise: {
    fr: "Indiquez votre entreprise ou structure.",
    de: "Geben Sie Ihr Unternehmen oder Ihre Organisation an.",
    lb: "Gitt Är Firma oder Organisatioun un.",
  },
  besoin: { fr: "Choisissez un besoin.", de: "Wählen Sie einen Bedarf.", lb: "Wielt e Besoin." },
} satisfies Record<string, Trad>

function creerChamps(l: Langue) {
  const m = (k: keyof typeof MESSAGES) => choisir(MESSAGES[k], l)
  /** Nettoyage : trim, suppression des caractères de contrôle, espaces normalisés. */
  const texte = (max: number, manquant = m("invalide")) =>
    z
      .string({ error: manquant })
      .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim())
      .pipe(z.string().max(max, `${max} ${m("max")}`))
  const requis = (max: number, message: string) =>
    texte(max, message).pipe(z.string().min(1, message))
  const email = texte(200, m("email")).pipe(z.email(m("emailInvalide")))
  const telephone = texte(30)
    .refine((s) => s === "" || /^[+()\d\s.-]{6,30}$/.test(s), m("telephone"))
    .optional()
  const consentement = z.literal("oui", { error: m("consentement") })
  return { m, texte, requis, email, telephone, consentement }
}

export const categoriesInfo = [
  "Actualité locale",
  "Culture",
  "Musique",
  "Sport",
  "Événement",
  "Prévention",
  "Autre",
] as const

/** Les valeurs envoyées restent en français (la rédaction les lit) ; seul l'affichage change. */
export const libellesCategoriesInfo: Record<(typeof categoriesInfo)[number], Trad> = {
  "Actualité locale": { fr: "Actualité locale", de: "Lokale Nachricht", lb: "Lokal Neiegkeet" },
  Culture: { fr: "Culture", de: "Kultur", lb: "Kultur" },
  Musique: { fr: "Musique", de: "Musik", lb: "Musek" },
  Sport: { fr: "Sport", de: "Sport", lb: "Sport" },
  Événement: { fr: "Événement", de: "Veranstaltung", lb: "Evenement" },
  Prévention: { fr: "Prévention", de: "Prävention", lb: "Preventioun" },
  Autre: { fr: "Autre", de: "Sonstiges", lb: "Anert" },
}

export const besoinsPub = [
  "Publicité radio",
  "Campagne locale",
  "Promotion web",
  "Campagne événementielle",
  "Visibilité digitale",
  "Partenariat",
  "Autre",
] as const

export const libellesBesoinsPub: Record<(typeof besoinsPub)[number], Trad> = {
  "Publicité radio": { fr: "Publicité radio", de: "Radiowerbung", lb: "Radiosreklamm" },
  "Campagne locale": { fr: "Campagne locale", de: "Lokale Kampagne", lb: "Lokal Campagne" },
  "Promotion web": { fr: "Promotion web", de: "Web-Promotion", lb: "Web-Promotioun" },
  "Campagne événementielle": {
    fr: "Campagne événementielle",
    de: "Veranstaltungskampagne",
    lb: "Evenementscampagne",
  },
  "Visibilité digitale": {
    fr: "Visibilité digitale",
    de: "Digitale Sichtbarkeit",
    lb: "Digital Visibilitéit",
  },
  Partenariat: { fr: "Partenariat", de: "Partnerschaft", lb: "Partenariat" },
  Autre: { fr: "Autre", de: "Sonstiges", lb: "Anert" },
}

/** Schémas de validation, messages dans la langue du visiteur. */
export function creerSchemas(l: Langue = "fr") {
  const { m, texte, requis, email, telephone, consentement } = creerChamps(l)
  return {
    contact: z.object({
      nom: requis(100, m("nom")),
      email,
      telephone,
      sujet: texte(150).optional(),
      message: requis(5000, m("message")).pipe(z.string().min(10, m("messageCourt"))),
      consentement,
    }),
    information: z.object({
      nom: requis(100, m("nom")),
      email,
      telephone,
      ville: requis(100, m("ville")),
      categorie: z.enum(categoriesInfo, { error: m("categorie") }),
      titre: requis(200, m("titre")),
      message: requis(8000, m("description")).pipe(z.string().min(20, m("details"))),
      consentement,
    }),
    publicite: z.object({
      nom: requis(100, m("nom")),
      entreprise: requis(150, m("entreprise")),
      email,
      telephone,
      besoin: z.enum(besoinsPub, { error: m("besoin") }),
      message: texte(5000).optional(),
      consentement,
    }),
    newsletter: z.object({
      email,
      consentement,
    }),
  } as const
}

export const schemas = creerSchemas("fr")

export type TypeFormulaire = keyof typeof schemas
export const typesFormulaire = Object.keys(schemas) as TypeFormulaire[]

export const PIECE_JOINTE = {
  tailleMax: 5 * 1024 * 1024,
  types: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  libelle: {
    fr: "JPG, PNG, WebP ou PDF · 5 Mo maximum",
    de: "JPG, PNG, WebP oder PDF · höchstens 5 MB",
    lb: "JPG, PNG, WebP oder PDF · maximal 5 MB",
  } as Trad,
}

export const objetsMail: Record<TypeFormulaire, string> = {
  contact: "Contact depuis le site",
  information: "Information proposée à la rédaction",
  publicite: "Demande d'offre publicitaire",
  newsletter: "Inscription à la newsletter",
}
