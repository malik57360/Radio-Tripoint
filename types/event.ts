import type { Demo, Visuel } from "./media"

export interface Evenement extends Demo {
  slug: string
  titre: string
  description: string
  /** ISO 8601 avec fuseau. */
  debut: string
  fin?: string
  /** Aucune heure publiée : on n'affiche que la date (et l'.ics est « journée entière »). */
  journee?: boolean
  /** Horaires tels que publiés, quand ils ne tiennent pas dans un début et une fin. */
  horaires?: string
  lieu: string
  ville: string
  pays: "FR" | "LU" | "DE"
  adresse?: string
  gratuit?: boolean
  lienExterne?: string
  organisateur?: string
  visuel?: Visuel
}
