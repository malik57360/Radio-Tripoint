import { z } from "zod"
import { choisir, type Langue, type Trad } from "@/lib/i18n/langues"

// Pas de compilation JIT : Zod testerait sinon `new Function`, ce que la
// CSP du site (sans 'unsafe-eval') refuse et signale dans la console.
z.config({ jitless: true })

/** Messages d'erreur dans les langues du site. */
const MESSAGES = {
  invalide: {
    fr: "Ce champ est invalide.",
    de: "Dieses Feld ist ungültig.",
    lb: "Dëst Feld ass net gëlteg.",
    en: "This field is invalid.",
    es: "Este campo no es válido.",
  },
  max: {
    fr: "caractères maximum.",
    de: "Zeichen höchstens.",
    lb: "Zeechen maximal.",
    en: "characters maximum.",
    es: "caracteres como máximo.",
  },
  email: {
    fr: "Indiquez votre adresse e-mail.",
    de: "Geben Sie Ihre E-Mail-Adresse an.",
    lb: "Gitt Är E-Mail-Adress un.",
    en: "Enter your email address.",
    es: "Indique su dirección de correo electrónico.",
  },
  emailInvalide: {
    fr: "Adresse e-mail invalide.",
    de: "Ungültige E-Mail-Adresse.",
    lb: "Ongëlteg E-Mail-Adress.",
    en: "Invalid email address.",
    es: "Dirección de correo electrónico no válida.",
  },
  telephone: {
    fr: "Numéro de téléphone invalide.",
    de: "Ungültige Telefonnummer.",
    lb: "Ongëlteg Telefonsnummer.",
    en: "Invalid phone number.",
    es: "Número de teléfono no válido.",
  },
  consentement: {
    fr: "Votre accord est nécessaire pour que nous puissions vous répondre.",
    de: "Ihre Zustimmung ist nötig, damit wir Ihnen antworten können.",
    lb: "Mir brauchen Är Zoustëmmung, fir Iech äntweren ze kënnen.",
    en: "We need your consent to be able to reply to you.",
    es: "Necesitamos su consentimiento para poder responderle.",
  },
  nom: {
    fr: "Indiquez votre nom.",
    de: "Geben Sie Ihren Namen an.",
    lb: "Gitt Ären Numm un.",
    en: "Enter your name.",
    es: "Indique su nombre.",
  },
  message: {
    fr: "Écrivez votre message.",
    de: "Schreiben Sie Ihre Nachricht.",
    lb: "Schreift Äre Message.",
    en: "Write your message.",
    es: "Escriba su mensaje.",
  },
  messageCourt: {
    fr: "Votre message est un peu court.",
    de: "Ihre Nachricht ist etwas kurz.",
    lb: "Äre Message ass e bësse kuerz.",
    en: "Your message is a little short.",
    es: "Su mensaje es un poco corto.",
  },
  ville: {
    fr: "Indiquez la ville concernée.",
    de: "Geben Sie den betroffenen Ort an.",
    lb: "Gitt d'Uertschaft un, ëm déi et geet.",
    en: "Enter the town concerned.",
    es: "Indique la localidad afectada.",
  },
  categorie: {
    fr: "Choisissez une catégorie.",
    de: "Wählen Sie eine Kategorie.",
    lb: "Wielt eng Kategorie.",
    en: "Choose a category.",
    es: "Elija una categoría.",
  },
  titre: {
    fr: "Donnez un titre à votre information.",
    de: "Geben Sie Ihrer Information einen Titel.",
    lb: "Gitt Ärer Informatioun en Titel.",
    en: "Give your information a title.",
    es: "Dé un título a su información.",
  },
  description: {
    fr: "Décrivez l'information.",
    de: "Beschreiben Sie die Information.",
    lb: "Beschreift d'Informatioun.",
    en: "Describe the information.",
    es: "Describa la información.",
  },
  details: {
    fr: "Donnez-nous un peu plus de détails.",
    de: "Geben Sie uns etwas mehr Details.",
    lb: "Gitt eis e bësse méi Detailer.",
    en: "Give us a few more details.",
    es: "Denos algunos detalles más.",
  },
  entreprise: {
    fr: "Indiquez votre entreprise ou structure.",
    de: "Geben Sie Ihr Unternehmen oder Ihre Organisation an.",
    lb: "Gitt Är Firma oder Organisatioun un.",
    en: "Enter your company or organisation.",
    es: "Indique su empresa u organización.",
  },
  besoin: {
    fr: "Choisissez un besoin.",
    de: "Wählen Sie einen Bedarf.",
    lb: "Wielt e Besoin.",
    en: "Choose a requirement.",
    es: "Elija una necesidad.",
  },
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
  "Actualité locale": {
    fr: "Actualité locale",
    de: "Lokale Nachricht",
    lb: "Lokal Neiegkeet",
    en: "Local news",
    es: "Actualidad local",
  },
  Culture: { fr: "Culture", de: "Kultur", lb: "Kultur", en: "Culture", es: "Cultura" },
  Musique: { fr: "Musique", de: "Musik", lb: "Musek", en: "Music", es: "Música" },
  Sport: { fr: "Sport", de: "Sport", lb: "Sport", en: "Sport", es: "Deporte" },
  Événement: { fr: "Événement", de: "Veranstaltung", lb: "Evenement", en: "Event", es: "Evento" },
  Prévention: {
    fr: "Prévention",
    de: "Prävention",
    lb: "Preventioun",
    en: "Prevention",
    es: "Prevención",
  },
  Autre: { fr: "Autre", de: "Sonstiges", lb: "Anert", en: "Other", es: "Otro" },
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
  "Publicité radio": {
    fr: "Publicité radio",
    de: "Radiowerbung",
    lb: "Radiosreklamm",
    en: "Radio advertising",
    es: "Publicidad en radio",
  },
  "Campagne locale": {
    fr: "Campagne locale",
    de: "Lokale Kampagne",
    lb: "Lokal Campagne",
    en: "Local campaign",
    es: "Campaña local",
  },
  "Promotion web": {
    fr: "Promotion web",
    de: "Web-Promotion",
    lb: "Web-Promotioun",
    en: "Web promotion",
    es: "Promoción web",
  },
  "Campagne événementielle": {
    fr: "Campagne événementielle",
    de: "Veranstaltungskampagne",
    lb: "Evenementscampagne",
    en: "Event campaign",
    es: "Campaña de evento",
  },
  "Visibilité digitale": {
    fr: "Visibilité digitale",
    de: "Digitale Sichtbarkeit",
    lb: "Digital Visibilitéit",
    en: "Digital visibility",
    es: "Visibilidad digital",
  },
  Partenariat: {
    fr: "Partenariat",
    de: "Partnerschaft",
    lb: "Partenariat",
    en: "Partnership",
    es: "Colaboración",
  },
  Autre: { fr: "Autre", de: "Sonstiges", lb: "Anert", en: "Other", es: "Otro" },
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
  tailleMax: 4 * 1024 * 1024, // Vercel refuse les requêtes de plus de 4,5 Mo
  types: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  libelle: {
    fr: "JPG, PNG, WebP ou PDF · 4 Mo maximum",
    de: "JPG, PNG, WebP oder PDF · höchstens 4 MB",
    lb: "JPG, PNG, WebP oder PDF · maximal 4 MB",
    en: "JPG, PNG, WebP or PDF · 4 MB maximum",
    es: "JPG, PNG, WebP o PDF · 4 MB como máximo",
  } as Trad,
}

export const objetsMail: Record<TypeFormulaire, string> = {
  contact: "Contact depuis le site",
  information: "Information proposée à la rédaction",
  publicite: "Demande d'offre publicitaire",
  newsletter: "Inscription à la newsletter",
}
