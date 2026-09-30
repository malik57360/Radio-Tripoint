import type { Demo, Visuel } from "./media"

export type ThemePodcast = "actualites" | "culture" | "musique" | "sport" | "emissions"

export interface Episode extends Demo {
  slug: string
  titre: string
  description: string
  /** Slug de l'émission d'origine, si l'épisode en est un replay. */
  emission?: string
  theme: ThemePodcast
  /** Date de publication, si elle est connue (ISO 8601). */
  publieLe?: string
  /** Ordre d'affichage quand la date manque : plus grand = en premier. */
  ordre?: number
  /** Durée en secondes. */
  duree: number
  /** URL du fichier audio (MP3/AAC). */
  audioUrl: string
  visuel?: Visuel
}
