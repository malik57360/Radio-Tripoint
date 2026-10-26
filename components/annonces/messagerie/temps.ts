/** Heures et jours de la messagerie, à l'heure de Paris (le serveur et le téléphone disent la même chose). */
const TZ = "Europe/Paris"

const jourDe = (ms: number) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms))

export const heure = (ms: number) =>
  new Date(ms).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: TZ })

/** « Aujourd'hui », « Hier », sinon « lundi 26 octobre ». */
export function jour(ms: number) {
  const j = jourDe(ms)
  if (j === jourDe(Date.now())) return "Aujourd'hui"
  if (j === jourDe(Date.now() - 864e5)) return "Hier"
  return new Date(ms).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: TZ,
  })
}

/** Pour la liste : l'heure aujourd'hui, « hier », sinon la date courte. */
export function quand(ms: number) {
  const j = jourDe(ms)
  if (j === jourDe(Date.now())) return heure(ms)
  if (j === jourDe(Date.now() - 864e5)) return "hier"
  return new Date(ms).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: TZ })
}

export const memeJour = (a: number, b: number) => jourDe(a) === jourDe(b)

export const initiales = (nom: string) =>
  nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0])
    .join("")
    .toUpperCase() || "?"
