import type { Langue } from "@/lib/i18n/langues"
import type { Creneau, Emission, Jour } from "@/types/show"

const JOURS: Jour[] = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
const ORDRE: Jour[] = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]

/** Jour et minutes écoulées dans le fuseau de la radio. */
function horloge(date: Date, timeZone: string): { jour: Jour; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0"
  const idx = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"))
  return {
    jour: JOURS[idx < 0 ? 0 : idx],
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  }
}

const enMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

export interface Programme {
  emission: Pick<Emission, "slug" | "nom" | "thematique">
  creneau: Creneau
}

/** Émission à l'antenne à `date`, ou null si la grille ne dit rien. */
export function programmeEnCours(
  emissions: Pick<Emission, "slug" | "nom" | "thematique" | "creneaux">[],
  date: Date,
  timeZone: string,
): Programme | null {
  const { jour, minutes } = horloge(date, timeZone)
  for (const e of emissions) {
    for (const c of e.creneaux) {
      // Sans heure de fin publiée, on ne peut pas affirmer qu'une émission est à l'antenne.
      if (!c.fin) continue
      if (c.jour === jour && minutes >= enMinutes(c.debut) && minutes < enMinutes(c.fin)) {
        return { emission: { slug: e.slug, nom: e.nom, thematique: e.thematique }, creneau: c }
      }
    }
  }
  return null
}

/** Prochaine émission après `date` (sur 7 jours). */
export function programmeSuivant(
  emissions: Pick<Emission, "slug" | "nom" | "thematique" | "creneaux">[],
  date: Date,
  timeZone: string,
): Programme | null {
  const { jour, minutes } = horloge(date, timeZone)
  const base = ORDRE.indexOf(jour) * 1440 + minutes
  let meilleur: { delta: number; p: Programme } | null = null
  for (const e of emissions) {
    for (const c of e.creneaux) {
      const t = ORDRE.indexOf(c.jour) * 1440 + enMinutes(c.debut)
      let delta = t - base
      if (delta <= 0) delta += 7 * 1440
      if (!meilleur || delta < meilleur.delta) {
        meilleur = {
          delta,
          p: { emission: { slug: e.slug, nom: e.nom, thematique: e.thematique }, creneau: c },
        }
      }
    }
  }
  return meilleur?.p ?? null
}

export const libelleHeure = (hhmm: string, l: Langue = "fr") => {
  const h = hhmm === "24:00" ? "00:00" : hhmm
  return l === "fr" ? h.replace(":", " h ") : h
}

const NOMS_JOURS: Record<Langue, Record<Jour, string>> = {
  fr: {
    lundi: "lundi",
    mardi: "mardi",
    mercredi: "mercredi",
    jeudi: "jeudi",
    vendredi: "vendredi",
    samedi: "samedi",
    dimanche: "dimanche",
  },
  de: {
    lundi: "Montag",
    mardi: "Dienstag",
    mercredi: "Mittwoch",
    jeudi: "Donnerstag",
    vendredi: "Freitag",
    samedi: "Samstag",
    dimanche: "Sonntag",
  },
  lb: {
    lundi: "Méindeg",
    mardi: "Dënschdeg",
    mercredi: "Mëttwoch",
    jeudi: "Donneschdeg",
    vendredi: "Freideg",
    samedi: "Samschdeg",
    dimanche: "Sonndeg",
  },
}

/** Nom du jour dans la langue ("dimanche", "Sonntag", "Sonndeg"). */
export const nomJour = (j: Jour, l: Langue = "fr") => NOMS_JOURS[l][j]

export function libelleCreneaux(creneaux: Creneau[], l: Langue = "fr"): string[] {
  // Regroupe les jours qui partagent le même horaire.
  const parHoraire = new Map<string, Jour[]>()
  for (const c of creneaux) {
    const k = `${c.debut}–${c.fin ?? ""}`
    parHoraire.set(k, [...(parHoraire.get(k) ?? []), c.jour])
  }
  return [...parHoraire.entries()].map(([k, jours]) => {
    const [d, f] = k.split("–")
    const tries = [...new Set(jours)].sort((a, b) => ORDRE.indexOf(a) - ORDRE.indexOf(b))
    const j =
      tries.length === 7
        ? { fr: "Tous les jours", de: "Täglich", lb: "All Dag" }[l]
        : tries
            .map((x) => nomJour(x, l))
            .map((x) => x[0].toUpperCase() + x.slice(1))
            .join(", ")
    return f
      ? `${j} · ${libelleHeure(d, l)} – ${libelleHeure(f, l)}`
      : `${j} · ${libelleHeure(d, l)}`
  })
}
