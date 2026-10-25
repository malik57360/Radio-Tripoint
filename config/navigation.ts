import { sansLangue, type Trad } from "@/lib/i18n/langues"
import { URL_ANNONCES } from "@/lib/annonces/liens"

export interface LienNav {
  libelle: Trad
  href: string
  /** Dans la barre seulement dès 1440 px ; en dessous, en tête du menu « Plus ». */
  large?: boolean
}

/** Navigation principale (desktop). */
export const navPrincipale: LienNav[] = [
  {
    libelle: { fr: "Actualités", de: "Aktuelles", lb: "Aktualitéiten", en: "News", es: "Noticias" },
    href: "/actualites",
  },
  {
    libelle: {
      fr: "Émissions",
      de: "Sendungen",
      lb: "Sendungen",
      en: "Programmes",
      es: "Programas",
    },
    href: "/emissions",
  },
  {
    libelle: { fr: "Podcasts", de: "Podcasts", lb: "Podcasts", en: "Podcasts", es: "Pódcasts" },
    href: "/podcasts",
  },
  {
    libelle: { fr: "Agenda", de: "Agenda", lb: "Agenda", en: "Events", es: "Agenda" },
    href: "/agenda",
  },
  {
    libelle: {
      fr: "Annonces",
      de: "Kleinanzeigen",
      lb: "Annoncen",
      en: "Classifieds",
      es: "Anuncios",
    },
    href: URL_ANNONCES,
    large: true,
  },
  {
    libelle: { fr: "Culture", de: "Kultur", lb: "Kultur", en: "Culture", es: "Cultura" },
    href: "/art-culture",
  },
  {
    libelle: { fr: "Musique", de: "Musik", lb: "Musek", en: "Music", es: "Música" },
    href: "/actu-music",
  },
  {
    libelle: { fr: "Sport", de: "Sport", lb: "Sport", en: "Sport", es: "Deporte" },
    href: "/sport",
  },
]

/** Onglet « Nous soutenir » (cagnotte) : mis en avant, hors du menu « Plus ». */
export const navSoutenir: LienNav = {
  libelle: {
    fr: "Nous soutenir",
    de: "Unterstützen Sie uns",
    lb: "Ënnerstëtzt eis",
    en: "Support us",
    es: "Apóyenos",
  },
  href: "/soutenir",
}

/** Menu « Plus ». */
export const navPlus: LienNav[] = [
  {
    libelle: {
      fr: "Actu People",
      de: "People",
      lb: "People",
      en: "People news",
      es: "Actualidad people",
    },
    href: "/actu-people",
  },
  {
    libelle: {
      fr: "Mode & Style",
      de: "Mode & Stil",
      lb: "Mode & Stil",
      en: "Fashion & Style",
      es: "Moda y estilo",
    },
    href: "/mode-style",
  },
  {
    libelle: { fr: "Météo", de: "Wetter", lb: "Wieder", en: "Weather", es: "El tiempo" },
    href: "/meteo",
  },
  {
    libelle: { fr: "Horoscope", de: "Horoskop", lb: "Horoskop", en: "Horoscope", es: "Horóscopo" },
    href: "/horoscope",
  },
  {
    libelle: {
      fr: "Prévention",
      de: "Prävention",
      lb: "Preventioun",
      en: "Prevention",
      es: "Prevención",
    },
    href: "/prevention",
  },
  {
    libelle: { fr: "Publicité", de: "Werbung", lb: "Reklamm", en: "Advertising", es: "Publicidad" },
    href: "/publicite",
  },
  {
    libelle: {
      fr: "Tripo, le guide",
      de: "Tripo, der Guide",
      lb: "Tripo, de Guide",
      en: "Tripo, the guide",
      es: "Tripo, el guía",
    },
    href: "/tripo",
  },
  {
    libelle: { fr: "À propos", de: "Über uns", lb: "Iwwer eis", en: "About", es: "Quiénes somos" },
    href: "/a-propos",
  },
  {
    libelle: {
      fr: "Ils nous font confiance",
      de: "Sie vertrauen uns",
      lb: "Si vertrauen eis",
      en: "They trust us",
      es: "Confían en nosotros",
    },
    href: "/ils-nous-font-confiance",
  },
  {
    libelle: { fr: "Contact", de: "Kontakt", lb: "Kontakt", en: "Contact", es: "Contacto" },
    href: "/contact",
  },
]

export const navRubriques: LienNav[] = [
  {
    libelle: { fr: "Actualités", de: "Aktuelles", lb: "Aktualitéiten", en: "News", es: "Noticias" },
    href: "/actualites",
  },
  {
    libelle: {
      fr: "Art & Culture",
      de: "Kunst & Kultur",
      lb: "Konscht & Kultur",
      en: "Art & Culture",
      es: "Arte y cultura",
    },
    href: "/art-culture",
  },
  {
    libelle: {
      fr: "Actu Music",
      de: "Musik",
      lb: "Musek",
      en: "Music news",
      es: "Actualidad musical",
    },
    href: "/actu-music",
  },
  {
    libelle: {
      fr: "Actu People",
      de: "People",
      lb: "People",
      en: "People news",
      es: "Actualidad people",
    },
    href: "/actu-people",
  },
  {
    libelle: {
      fr: "Mode & Style",
      de: "Mode & Stil",
      lb: "Mode & Stil",
      en: "Fashion & Style",
      es: "Moda y estilo",
    },
    href: "/mode-style",
  },
  {
    libelle: { fr: "Sport", de: "Sport", lb: "Sport", en: "Sport", es: "Deporte" },
    href: "/sport",
  },
  {
    libelle: {
      fr: "Prévention",
      de: "Prävention",
      lb: "Preventioun",
      en: "Prevention",
      es: "Prevención",
    },
    href: "/prevention",
  },
  {
    libelle: { fr: "Agenda", de: "Agenda", lb: "Agenda", en: "Events", es: "Agenda" },
    href: "/agenda",
  },
]

/** `pathname` peut porter un préfixe de langue ("/de/agenda") : on le retire. */
export const estActif = (pathname: string, href: string) => {
  const p = sansLangue(pathname)
  return href === "/" ? p === "/" : p === href || p.startsWith(`${href}/`)
}
