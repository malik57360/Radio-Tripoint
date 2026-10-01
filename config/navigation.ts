import { sansLangue, type Trad } from "@/lib/i18n/langues"

export interface LienNav {
  libelle: Trad
  href: string
}

/** Navigation principale (desktop). */
export const navPrincipale: LienNav[] = [
  { libelle: { fr: "Actualités", de: "Aktuelles", lb: "Aktualitéiten" }, href: "/actualites" },
  { libelle: { fr: "Émissions", de: "Sendungen", lb: "Sendungen" }, href: "/emissions" },
  { libelle: { fr: "Podcasts", de: "Podcasts", lb: "Podcasts" }, href: "/podcasts" },
  { libelle: { fr: "Agenda", de: "Agenda", lb: "Agenda" }, href: "/agenda" },
  { libelle: { fr: "Culture", de: "Kultur", lb: "Kultur" }, href: "/art-culture" },
  { libelle: { fr: "Musique", de: "Musik", lb: "Musek" }, href: "/actu-music" },
  { libelle: { fr: "Sport", de: "Sport", lb: "Sport" }, href: "/sport" },
]

/** Menu « Plus ». */
export const navPlus: LienNav[] = [
  { libelle: { fr: "Actu People", de: "People", lb: "People" }, href: "/actu-people" },
  { libelle: { fr: "Mode & Style", de: "Mode & Stil", lb: "Mode & Stil" }, href: "/mode-style" },
  { libelle: { fr: "Prévention", de: "Prävention", lb: "Preventioun" }, href: "/prevention" },
  { libelle: { fr: "Publicité", de: "Werbung", lb: "Reklamm" }, href: "/publicite" },
  { libelle: { fr: "À propos", de: "Über uns", lb: "Iwwer eis" }, href: "/a-propos" },
  {
    libelle: { fr: "Ils nous font confiance", de: "Sie vertrauen uns", lb: "Si vertrauen eis" },
    href: "/ils-nous-font-confiance",
  },
  { libelle: { fr: "Contact", de: "Kontakt", lb: "Kontakt" }, href: "/contact" },
]

export const navRubriques: LienNav[] = [
  { libelle: { fr: "Actualités", de: "Aktuelles", lb: "Aktualitéiten" }, href: "/actualites" },
  {
    libelle: { fr: "Art & Culture", de: "Kunst & Kultur", lb: "Konscht & Kultur" },
    href: "/art-culture",
  },
  { libelle: { fr: "Actu Music", de: "Musik", lb: "Musek" }, href: "/actu-music" },
  { libelle: { fr: "Actu People", de: "People", lb: "People" }, href: "/actu-people" },
  { libelle: { fr: "Mode & Style", de: "Mode & Stil", lb: "Mode & Stil" }, href: "/mode-style" },
  { libelle: { fr: "Sport", de: "Sport", lb: "Sport" }, href: "/sport" },
  { libelle: { fr: "Prévention", de: "Prävention", lb: "Preventioun" }, href: "/prevention" },
  { libelle: { fr: "Agenda", de: "Agenda", lb: "Agenda" }, href: "/agenda" },
]

/** `pathname` peut porter un préfixe de langue ("/de/agenda") : on le retire. */
export const estActif = (pathname: string, href: string) => {
  const p = sansLangue(pathname)
  return href === "/" ? p === "/" : p === href || p.startsWith(`${href}/`)
}
