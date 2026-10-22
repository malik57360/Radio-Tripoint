import { episodes as episodesReels } from "@/data/podcasts"
import { episodesDemo } from "@/data/demo"
import type { Episode, ThemePodcast } from "@/types/podcast"
import type { Langue, Trad } from "@/lib/i18n/langues"
import { normaliser } from "@/lib/utils/texte"
import { localiserEpisode } from "./localiser"
import { modeDemo } from "./demo"
import { localiserEpisodeDashboard, podcastsDashboard } from "./podcasts-dashboard"

export const themesPodcast: { valeur: ThemePodcast | "toutes"; libelle: Trad }[] = [
  { valeur: "toutes", libelle: { fr: "Toutes", de: "Alle", lb: "All", en: "All", es: "Todas" } },
  {
    valeur: "actualites",
    libelle: { fr: "Actualités", de: "Aktuelles", lb: "Aktualitéiten", en: "News", es: "Noticias" },
  },
  {
    valeur: "culture",
    libelle: { fr: "Culture", de: "Kultur", lb: "Kultur", en: "Culture", es: "Cultura" },
  },
  {
    valeur: "musique",
    libelle: { fr: "Musique", de: "Musik", lb: "Musek", en: "Music", es: "Música" },
  },
  {
    valeur: "sport",
    libelle: { fr: "Sport", de: "Sport", lb: "Sport", en: "Sport", es: "Deporte" },
  },
  {
    valeur: "emissions",
    libelle: {
      fr: "Émissions",
      de: "Sendungen",
      lb: "Sendungen",
      en: "Programmes",
      es: "Programas",
    },
  },
]

/** Épisodes du dépôt + ceux publiés depuis le tableau de bord (un slug du dépôt prime). */
async function tous(l: Langue = "fr"): Promise<Episode[]> {
  const base = modeDemo ? [...episodesReels, ...episodesDemo] : episodesReels
  const connus = new Set(base.map((e) => e.slug))
  const ajoutes = (await podcastsDashboard()).filter((e) => !connus.has(e.slug))
  return [
    ...base.map((e) => localiserEpisode(e, l)),
    ...ajoutes.map((e) => localiserEpisodeDashboard(e, l)),
  ].sort(
    (a, b) => (b.publieLe ?? "").localeCompare(a.publieLe ?? "") || (b.ordre ?? 0) - (a.ordre ?? 0),
  )
}

export async function listerEpisodes(
  options: { theme?: string; q?: string; emission?: string; langue?: Langue } = {},
): Promise<Episode[]> {
  let liste = await tous(options.langue)
  if (options.theme && options.theme !== "toutes")
    liste = liste.filter((e) => e.theme === options.theme)
  if (options.emission) liste = liste.filter((e) => e.emission === options.emission)
  if (options.q) {
    const n = normaliser(options.q)
    liste = liste.filter((e) => normaliser(`${e.titre} ${e.description}`).includes(n))
  }
  return liste
}

export async function episodeParSlug(slug: string, l: Langue = "fr"): Promise<Episode | null> {
  return (await tous(l)).find((e) => e.slug === slug) ?? null
}
