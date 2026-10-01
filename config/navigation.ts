import { sansLangue, type Trad } from "@/lib/i18n/langues"

export interface LienNav {
  libelle: Trad
  href: string
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
