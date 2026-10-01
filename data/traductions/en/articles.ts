import type { TradArticle } from "../types"
import { actualites01 } from "./articles/actualites-01"
import { actualites02 } from "./articles/actualites-02"
import { actualites03 } from "./articles/actualites-03"
import { actualites04 } from "./articles/actualites-04"
import { actualites05 } from "./articles/actualites-05"
import { actualites06 } from "./articles/actualites-06"
import { actualites07 } from "./articles/actualites-07"
import { actualites08 } from "./articles/actualites-08"
import { actualites09 } from "./articles/actualites-09"
import { actualites10 } from "./articles/actualites-10"
import { actualites11 } from "./articles/actualites-11"
import { actualites12 } from "./articles/actualites-12"
import { actuMusic } from "./articles/actu-music"
import { actuPeople } from "./articles/actu-people"
import { artCulture } from "./articles/art-culture"
import { modeStyle } from "./articles/mode-style"
import { prevention } from "./articles/prevention"
import { sport } from "./articles/sport"

/** Articles traduits, par rubrique. Un article absent s'affiche en français. */
export const articles: Record<string, TradArticle> = {
  ...actualites01,
  ...actualites02,
  ...actualites03,
  ...actualites04,
  ...actualites05,
  ...actualites06,
  ...actualites07,
  ...actualites08,
  ...actualites09,
  ...actualites10,
  ...actualites11,
  ...actualites12,
  ...actuMusic,
  ...actuPeople,
  ...artCulture,
  ...modeStyle,
  ...prevention,
  ...sport,
}
