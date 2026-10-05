import type { Langue } from "@/lib/i18n/langues"

const TZ = "Europe/Paris"

/**
 * Dates dans les langues du site. Les noms de mois et de jours sont écrits
 * ici plutôt que demandés à Intl : tous les navigateurs ne connaissent pas
 * le luxembourgeois, et un rendu serveur/client différent casserait
 * l'hydratation.
 */
const MOIS: Record<Langue, string[]> = {
  fr: [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ],
  de: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
  lb: [
    "Januar",
    "Februar",
    "Mäerz",
    "Abrëll",
    "Mee",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  es: [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ],
}
const MOIS_COURT: Record<Langue, string[]> = {
  fr: ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"],
  de: ["Jan", "Feb", "März", "Apr", "Mai", "Juni", "Juli", "Aug", "Sept", "Okt", "Nov", "Dez"],
  lb: ["Jan", "Feb", "Mäe", "Abr", "Mee", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"],
}
/** Dimanche en premier (getDay). */
const JOURS: Record<Langue, string[]> = {
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  de: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  lb: ["Sonndeg", "Méindeg", "Dënschdeg", "Mëttwoch", "Donneschdeg", "Freideg", "Samschdeg"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
}

const fmtParts = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: TZ,
})
const JOURS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/** Composantes d'une date dans le fuseau de la radio. */
function parts(iso: string | Date) {
  const p = Object.fromEntries(
    fmtParts
      .formatToParts(typeof iso === "string" ? new Date(iso) : iso)
      .map((x) => [x.type, x.value]),
  )
  return {
    annee: Number(p.year),
    mois: Number(p.month) - 1,
    jour: Number(p.day),
    semaine: JOURS_EN.indexOf(p.weekday),
    h: p.hour,
    m: p.minute,
  }
}

export function dateLongue(iso: string, l: Langue = "fr") {
  const d = parts(iso)
  if (l === "fr") return `${d.jour === 1 ? "1er" : d.jour} ${MOIS.fr[d.mois]} ${d.annee}`
  if (l === "en") return `${d.jour} ${MOIS.en[d.mois]} ${d.annee}`
  if (l === "es") return `${d.jour} de ${MOIS.es[d.mois]} de ${d.annee}`
  return `${d.jour}. ${MOIS[l][d.mois]} ${d.annee}`
}
export function dateCourte(iso: string, l: Langue = "fr") {
  const d = parts(iso)
  if (l === "fr") return `${d.jour} ${MOIS_COURT.fr[d.mois]}.`
  if (l === "en" || l === "es") return `${d.jour} ${MOIS_COURT[l][d.mois]}`
  return `${d.jour}. ${MOIS_COURT[l][d.mois]}.`
}
export function heure(iso: string, l: Langue = "fr") {
  const d = parts(iso)
  return l === "fr" ? `${d.h} h ${d.m}` : `${d.h}:${d.m}`
}
export const jourSemaine = (iso: string, l: Langue = "fr") => JOURS[l][parts(iso).semaine]

/** Vrai quand un événement court sur plusieurs jours (début et fin à des dates différentes). */
export function surPlusieursJours(debut: string, fin?: string) {
  if (!fin) return false
  const a = parts(debut)
  const b = parts(fin)
  return a.annee !== b.annee || a.mois !== b.mois || a.jour !== b.jour
}

/** « samedi et dimanche », « du vendredi au lundi »… (jours de début et de fin). */
export function joursPeriode(debut: string, fin: string, l: Langue = "fr") {
  const a = jourSemaine(debut, l)
  const b = jourSemaine(fin, l)
  const deuxJours = (Date.parse(fin) - Date.parse(debut)) / 86_400_000 < 2
  const lien = {
    fr: ["et", "du", "au"],
    de: ["und", "", "bis"],
    lb: ["an", "", "bis"],
    en: ["and", "", "to"],
    es: ["y", "del", "al"],
  }[l]
  if (deuxJours) return `${a} ${lien[0]} ${b}`
  return [lien[1], a, lien[2], b].filter(Boolean).join(" ")
}

/** « 10 et 11 octobre 2026 », « du 25 septembre au 5 octobre 2026 »… */
export function periodeLongue(debut: string, fin: string, l: Langue = "fr") {
  const a = parts(debut)
  const b = parts(fin)
  const deuxJours = (Date.parse(fin) - Date.parse(debut)) / 86_400_000 < 2
  const memeMois = a.mois === b.mois && a.annee === b.annee
  if (!memeMois) {
    const fr = (d: typeof a) => `${d.jour === 1 ? "1er" : d.jour} ${MOIS.fr[d.mois]}`
    if (l === "fr") return `du ${fr(a)} au ${fr(b)} ${b.annee}`
    if (l === "en") return `${a.jour} ${MOIS.en[a.mois]} – ${b.jour} ${MOIS.en[b.mois]} ${b.annee}`
    if (l === "es")
      return `del ${a.jour} de ${MOIS.es[a.mois]} al ${b.jour} de ${MOIS.es[b.mois]} de ${b.annee}`
    return `${a.jour}. ${MOIS[l][a.mois]} – ${b.jour}. ${MOIS[l][b.mois]} ${b.annee}`
  }
  const m = MOIS[l][a.mois]
  if (l === "fr")
    return deuxJours
      ? `${a.jour} et ${b.jour} ${m} ${a.annee}`
      : `du ${a.jour} au ${b.jour} ${m} ${a.annee}`
  if (l === "en")
    return deuxJours
      ? `${a.jour} and ${b.jour} ${m} ${a.annee}`
      : `${a.jour}–${b.jour} ${m} ${a.annee}`
  if (l === "es")
    return deuxJours
      ? `${a.jour} y ${b.jour} de ${m} de ${a.annee}`
      : `del ${a.jour} al ${b.jour} de ${m} de ${a.annee}`
  const et = l === "de" ? "und" : "an"
  return deuxJours
    ? `${a.jour}. ${et} ${b.jour}. ${m} ${a.annee}`
    : `${a.jour}.–${b.jour}. ${m} ${a.annee}`
}
export const jourNumero = (iso: string) => String(parts(iso).jour).padStart(2, "0")
export const moisCourt = (iso: string, l: Langue = "fr") => MOIS_COURT[l][parts(iso).mois]

/** Clé AAAA-MM-JJ dans le fuseau de la radio. */
export function cleJour(d: Date) {
  const p = parts(d)
  return `${p.annee}-${String(p.mois + 1).padStart(2, "0")}-${String(p.jour).padStart(2, "0")}`
}

/** « Aujourd'hui », « Hier » ou la date longue — stable côté serveur. */
export function dateRelative(iso: string, l: Langue = "fr", maintenant = new Date()): string {
  const k = cleJour(new Date(iso))
  if (k === cleJour(maintenant))
    return { fr: "Aujourd'hui", de: "Heute", lb: "Haut", en: "Today", es: "Hoy" }[l]
  if (k === cleJour(new Date(maintenant.getTime() - 86_400_000)))
    return { fr: "Hier", de: "Gestern", lb: "Gëschter", en: "Yesterday", es: "Ayer" }[l]
  return dateLongue(iso, l)
}

export function duree(secondes: number): string {
  const s = Math.max(0, Math.round(secondes))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  if (h > 0) return `${h} h ${String(m).padStart(2, "0")}`
  if (m > 0) return `${m} min`
  return `${r} s`
}

/** Durée ISO 8601 (schema.org). */
export function dureeIso(secondes: number): string {
  const h = Math.floor(secondes / 3600)
  const m = Math.floor((secondes % 3600) / 60)
  const s = Math.round(secondes % 60)
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`
}

export function chrono(secondes: number): string {
  if (!Number.isFinite(secondes)) return "--:--"
  const s = Math.max(0, Math.floor(secondes))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}
