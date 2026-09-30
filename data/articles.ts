import type { Article } from "@/types/article"
import { actualites } from "./articles/actualites"
import { actuMusic } from "./articles/actu-music"
import { actuPeople } from "./articles/actu-people"
import { artCulture } from "./articles/art-culture"
import { modeStyle } from "./articles/mode-style"
import { prevention } from "./articles/prevention"
import { sport } from "./articles/sport"

/**
 * Articles publiés, repris de l'ancien site Webador (texte intégral, sans
 * les photos), un fichier par rubrique dans `data/articles/`. Sans date
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
]
