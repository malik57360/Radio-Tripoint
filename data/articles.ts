import type { Article } from "@/types/article"
import { actualites } from "./articles/actualites"
import { actuMusic } from "./articles/actu-music"
import { actuPeople } from "./articles/actu-people"
import { artCulture } from "./articles/art-culture"
import { modeStyle } from "./articles/mode-style"
import { photos } from "./articles/photos"
import { prevention } from "./articles/prevention"
import { sport } from "./articles/sport"

/** Première photo en visuel, les autres en fin d'article. */
function avecPhotos(a: Article): Article {
  const [visuel, ...autres] = photos[a.slug] ?? []
  if (!visuel) return a
  return {
    ...a,
    visuel,
    corps: [...a.corps, ...autres.map((v) => ({ type: "image" as const, visuel: v }))],
  }
}

/**
 * Articles publiés, repris de l'ancien site Webador (texte intégral), un
 * fichier par rubrique dans `data/articles/`, photos dans `photos.ts`. Sans date
 * sur l'ancien site : le tri suit `ordre` (voir `lib/contenu/articles.ts`).
 * Remplaçable par un CMS via `lib/contenu/articles.ts`.
 */
export const articles: Article[] = [
  ...actualites,
  ...artCulture,
  ...actuMusic,
  ...actuPeople,
  ...modeStyle,
  ...sport,
  ...prevention,
].map(avecPhotos)
