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
  typeOrg: {
    fr: "Choisissez : entreprise ou association.",
    de: "Wählen Sie: Unternehmen oder Verein.",
    lb: "Wielt: Betrib oder Associatioun.",
    en: "Choose: company or association.",
    es: "Elija: empresa o asociación.",
  },
  pays: {
    fr: "Choisissez un pays.",
    de: "Wählen Sie ein Land.",
    lb: "Wielt e Land.",
    en: "Choose a country.",
    es: "Elija un país.",
  },
  identifiant: {
    fr: "Indiquez le numéro officiel de votre structure.",
    de: "Geben Sie die amtliche Nummer Ihrer Organisation an.",
    lb: "Gitt déi offiziell Nummer vun Ärer Organisatioun un.",
    en: "Enter your organisation's official number.",
    es: "Indique el número oficial de su organización.",
  },
  siret: {
    fr: "SIRET invalide : 14 chiffres (ou SIREN : 9 chiffres).",
    de: "Ungültige SIRET: 14 Ziffern (oder SIREN: 9 Ziffern).",
    lb: "Ongëlteg SIRET: 14 Zifferen (oder SIREN: 9 Zifferen).",
    en: "Invalid SIRET: 14 digits (or SIREN: 9 digits).",
    es: "SIRET no válido: 14 cifras (o SIREN: 9 cifras).",
  },
  rna: {
    fr: "Numéro invalide : RNA (W suivi de 9 chiffres) ou SIRET (14 chiffres).",
    de: "Ungültige Nummer: RNA (W und 9 Ziffern) oder SIRET (14 Ziffern).",
    lb: "Ongëlteg Nummer: RNA (W an 9 Zifferen) oder SIRET (14 Zifferen).",
    en: "Invalid number: RNA (W followed by 9 digits) or SIRET (14 digits).",
    es: "Número no válido: RNA (W seguido de 9 cifras) o SIRET (14 cifras).",
  },
  date: {
    fr: "Indiquez une date à venir.",
    de: "Geben Sie ein zukünftiges Datum an.",
    lb: "Gitt en Datum an der Zukunft un.",
    en: "Enter an upcoming date.",
    es: "Indique una fecha futura.",
  },
  dateFin: {
    fr: "La fin doit venir après le début.",
    de: "Das Ende muss nach dem Beginn liegen.",
    lb: "D'Enn muss nom Ufank sinn.",
    en: "The end must come after the start.",
    es: "El final debe ser posterior al inicio.",
  },
  heure: {
    fr: "Heure invalide (ex. 20:30).",
    de: "Ungültige Uhrzeit (z. B. 20:30).",
    lb: "Ongëlteg Auerzäit (z. B. 20:30).",
    en: "Invalid time (e.g. 20:30).",
    es: "Hora no válida (p. ej. 20:30).",
  },
  lieu: {
    fr: "Indiquez le lieu (salle, place, parc…).",
    de: "Geben Sie den Ort an (Saal, Platz, Park…).",
    lb: "Gitt d'Plaz un (Sall, Plaz, Park…).",
    en: "Enter the venue (hall, square, park…).",
    es: "Indique el lugar (sala, plaza, parque…).",
  },
  lien: {
    fr: "Adresse web invalide (commencez par https://).",
    de: "Ungültige Webadresse (beginnen Sie mit https://).",
    lb: "Ongëlteg Webadress (fänkt mat https:// un).",
    en: "Invalid web address (start with https://).",
    es: "Dirección web no válida (empiece por https://).",
  },
  conditions: {
    fr: "Acceptez les conditions de publication pour continuer.",
    de: "Akzeptieren Sie die Veröffentlichungsbedingungen, um fortzufahren.",
    lb: "Akzeptéiert d'Konditioune fir d'Verëffentlechung, fir weiderzefueren.",
    en: "Accept the publication terms to continue.",
    es: "Acepte las condiciones de publicación para continuar.",
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

export const typesOrganisation = ["entreprise", "association"] as const
export const paysAgenda = ["FR", "LU", "DE"] as const

export const libellesTypesOrganisation: Record<(typeof typesOrganisation)[number], Trad> = {
  entreprise: {
    fr: "Entreprise",
    de: "Unternehmen",
    lb: "Betrib",
    en: "Company",
    es: "Empresa",
  },
  association: {
    fr: "Association",
    de: "Verein",
    lb: "Associatioun",
    en: "Association",
    es: "Asociación",
  },
}

export const libellesPaysAgenda: Record<(typeof paysAgenda)[number], Trad> = {
  FR: { fr: "France", de: "Frankreich", lb: "Frankräich", en: "France", es: "Francia" },
  LU: { fr: "Luxembourg", de: "Luxemburg", lb: "Lëtzebuerg", en: "Luxembourg", es: "Luxemburgo" },
  DE: { fr: "Allemagne", de: "Deutschland", lb: "Däitschland", en: "Germany", es: "Alemania" },
}

/** Numéro officiel nettoyé : majuscules, sans espaces ni points. */
export const nettoyerIdentifiant = (s: string) => s.toUpperCase().replace(/[\s.\-]/g, "")

/** Date du jour à Paris, AAAA-MM-JJ (même calcul côté serveur et navigateur). */
const aujourdhui = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())

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
    agenda: z
      .object({
        type_org: z.enum(typesOrganisation, { error: m("typeOrg") }),
        pays_org: z.enum(paysAgenda, { error: m("pays") }),
        identifiant: requis(60, m("identifiant")),
        organisation: requis(150, m("entreprise")),
        nom: requis(100, m("nom")),
        email,
        telephone,
        titre: requis(120, m("titre")),
        description: requis(1500, m("description")).pipe(z.string().min(40, m("details"))),
        date_debut: z
          .string({ error: m("date") })
          .regex(/^\d{4}-\d{2}-\d{2}$/, m("date"))
          .refine((d) => d >= aujourdhui(), m("date")),
        heure_debut: texte(5)
          .refine((s) => s === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(s), m("heure"))
          .optional(),
        date_fin: texte(10)
          .refine((s) => s === "" || /^\d{4}-\d{2}-\d{2}$/.test(s), m("date"))
          .optional(),
        heure_fin: texte(5)
          .refine((s) => s === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(s), m("heure"))
          .optional(),
        lieu: requis(120, m("lieu")),
        adresse: texte(200).optional(),
        ville: requis(80, m("ville")),
        pays: z.enum(paysAgenda, { error: m("pays") }),
        tarif: texte(80).optional(),
        lien: texte(300)
          .refine((s) => s === "" || /^https?:\/\/[^\s<>"]+\.[^\s<>"]+$/i.test(s), m("lien"))
          .optional(),
        conditions: z.literal("oui", { error: m("conditions") }),
        consentement,
      })
      .superRefine((v, ctx) => {
        const id = nettoyerIdentifiant(v.identifiant)
        if (v.pays_org === "FR") {
          const ok =
            v.type_org === "entreprise"
              ? /^(\d{9}|\d{14})$/.test(id)
              : /^(W\d{9}|\d{9}|\d{14})$/.test(id)
          if (!ok)
            ctx.addIssue({
              code: "custom",
              path: ["identifiant"],
              message: m(v.type_org === "entreprise" ? "siret" : "rna"),
            })
        } else if (id.length < 3) {
          ctx.addIssue({ code: "custom", path: ["identifiant"], message: m("identifiant") })
        }
        const fin = `${v.date_fin || v.date_debut}T${v.heure_fin || "23:59"}`
        const debut = `${v.date_debut}T${v.heure_debut || "00:00"}`
        if ((v.date_fin || v.heure_fin) && fin <= debut)
          ctx.addIssue({ code: "custom", path: ["date_fin"], message: m("dateFin") })
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
  agenda: "Événement proposé à l'agenda (payant)",
}
