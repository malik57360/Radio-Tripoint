import type { Trad } from "@/lib/i18n/langues"

export type TypeResultat = "article" | "emission" | "podcast" | "evenement"

export interface Resultat {
  type: TypeResultat
  titre: string
  href: string
  contexte: string
  extrait?: string
}

export const libellesTypes: Record<TypeResultat, Trad> = {
  article: { fr: "Articles", de: "Artikel", lb: "Artikelen", en: "Articles", es: "Artículos" },
  emission: {
    fr: "Émissions",
    de: "Sendungen",
    lb: "Sendungen",
    en: "Programmes",
    es: "Programas",
  },
  podcast: { fr: "Podcasts", de: "Podcasts", lb: "Podcasts", en: "Podcasts", es: "Pódcasts" },
  evenement: { fr: "Agenda", de: "Agenda", lb: "Agenda", en: "Events", es: "Agenda" },
}
