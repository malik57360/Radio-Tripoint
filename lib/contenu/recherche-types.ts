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
  article: { fr: "Articles", de: "Artikel", lb: "Artikelen" },
  emission: { fr: "Émissions", de: "Sendungen", lb: "Sendungen" },
  podcast: { fr: "Podcasts", de: "Podcasts", lb: "Podcasts" },
  evenement: { fr: "Agenda", de: "Agenda", lb: "Agenda" },
}
