import { episodes as episodesReels } from "@/data/podcasts"
import { episodesDemo } from "@/data/demo"
import type { Episode, ThemePodcast } from "@/types/podcast"
import type { Langue, Trad } from "@/lib/i18n/langues"
import { normaliser } from "@/lib/utils/texte"
import { localiserEpisode } from "./localiser"
import { modeDemo } from "./demo"

export const themesPodcast: { valeur: ThemePodcast | "toutes"; libelle: Trad }[] = [
  { valeur: "toutes", libelle: { fr: "Toutes", de: "Alle", lb: "All" } },
  { valeur: "actualites", libelle: { fr: "Actualités", de: "Aktuelles", lb: "Aktualitéiten" } },
  { valeur: "culture", libelle: { fr: "Culture", de: "Kultur", lb: "Kultur" } },
  { valeur: "musique", libelle: { fr: "Musique", de: "Musik", lb: "Musek" } },
  { valeur: "sport", libelle: { fr: "Sport", de: "Sport", lb: "Sport" } },
  { valeur: "emissions", libelle: { fr: "Émissions", de: "Sendungen", lb: "Sendungen" } },
]

function tous(l: Langue = "fr"): Episode[] {
  const liste = modeDemo ? [...episodesReels, ...episodesDemo] : episodesReels
  return [...liste]
    .sort(
      (a, b) =>
        (b.publieLe ?? "").localeCompare(a.publieLe ?? "") || (b.ordre ?? 0) - (a.ordre ?? 0),
    )
    .map((e) => localiserEpisode(e, l))
}

export async function listerEpisodes(
  options: { theme?: string; q?: string; emission?: string; langue?: Langue } = {},
): Promise<Episode[]> {
  let liste = tous(options.langue)
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
  return tous(l).find((e) => e.slug === slug) ?? null
}
