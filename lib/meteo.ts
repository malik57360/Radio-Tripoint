import "server-only"
import type { Trad } from "@/lib/i18n/langues"

/**
 * Météo des Trois Frontières : prévisions Open-Meteo (gratuites, sans clé,
 * licence CC BY 4.0 — à citer), mises en cache 30 minutes. Partagées par la
 * page Météo et par Tripo (lib/guide/meteo.ts).
 */

export const LIEUX = [
  { nom: "Sierck-les-Bains", pays: "FR", lat: 49.4406, lon: 6.3578 },
  { nom: "Thionville", pays: "FR", lat: 49.3579, lon: 6.1683 },
  { nom: "Metz", pays: "FR", lat: 49.1193, lon: 6.1757 },
  {
    nom: "Luxembourg-Ville",
    noms: {
      fr: "Luxembourg-Ville",
      de: "Luxemburg-Stadt",
      lb: "Stad Lëtzebuerg",
      en: "Luxembourg City",
      es: "Ciudad de Luxemburgo",
    },
    pays: "LU",
    lat: 49.6116,
    lon: 6.1319,
  },
  { nom: "Merzig (Sarre)", noms: { fr: "Merzig" }, pays: "DE", lat: 49.4436, lon: 6.6374 },
] as const satisfies readonly {
  nom: string
  noms?: Trad
  pays: "FR" | "LU" | "DE"
  lat: number
  lon: number
}[]
export type Lieu = (typeof LIEUX)[number]

export interface Prevision {
  current?: {
    time: string
    temperature_2m: number
    weather_code: number
    wind_speed_10m: number
    is_day?: number
  }
  daily?: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: (number | null)[]
    precipitation_sum: number[]
    wind_speed_10m_max: number[]
  }
}

/** Les prévisions des cinq lieux, dans l'ordre de LIEUX ; lève une erreur si Open-Meteo ne répond pas. */
export async function previsions(): Promise<(Prevision | undefined)[]> {
  const url = new URL("https://api.open-meteo.com/v1/forecast")
  url.searchParams.set("latitude", LIEUX.map((l) => l.lat).join(","))
  url.searchParams.set("longitude", LIEUX.map((l) => l.lon).join(","))
  url.searchParams.set("current", "temperature_2m,weather_code,wind_speed_10m,is_day")
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max",
  )
  url.searchParams.set("timezone", "Europe/Paris")
  url.searchParams.set("forecast_days", "7")
  const res = await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(5000) })
  if (!res.ok) throw new Error(String(res.status))
  const brut: unknown = await res.json()
  return (Array.isArray(brut) ? brut : [brut]) as Prevision[]
}

/** Le ciel, regroupé depuis les codes météo WMO d'Open-Meteo. */
export type Ciel =
  | "clair"
  | "voile"
  | "nuageux"
  | "couvert"
  | "brouillard"
  | "bruine"
  | "pluie"
  | "averses"
  | "neige"
  | "orage"

export function ciel(code: number): Ciel {
  if (code === 0) return "clair"
  if (code === 1) return "voile"
  if (code === 2) return "nuageux"
  if (code === 3) return "couvert"
  if (code === 45 || code === 48) return "brouillard"
  if (code >= 51 && code <= 57) return "bruine"
  if (code >= 61 && code <= 67) return "pluie"
  if (code >= 80 && code <= 82) return "averses"
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "neige"
  if (code >= 95) return "orage"
  return "couvert"
}

export const LIBELLES_CIEL: Record<Ciel, Trad> = {
  clair: {
    fr: "Ciel dégagé",
    de: "Klarer Himmel",
    lb: "Kloren Himmel",
    en: "Clear sky",
    es: "Cielo despejado",
  },
  voile: {
    fr: "Peu nuageux",
    de: "Leicht bewölkt",
    lb: "Liicht wolleg",
    en: "Mostly clear",
    es: "Poco nuboso",
  },
  nuageux: {
    fr: "Partiellement nuageux",
    de: "Teilweise bewölkt",
    lb: "Deelweis wolleg",
    en: "Partly cloudy",
    es: "Parcialmente nuboso",
  },
  couvert: { fr: "Couvert", de: "Bedeckt", lb: "Bedeckt", en: "Overcast", es: "Cubierto" },
  brouillard: { fr: "Brouillard", de: "Nebel", lb: "Niwwel", en: "Fog", es: "Niebla" },
  bruine: { fr: "Bruine", de: "Nieselregen", lb: "Nisselreen", en: "Drizzle", es: "Llovizna" },
  pluie: { fr: "Pluie", de: "Regen", lb: "Reen", en: "Rain", es: "Lluvia" },
  averses: {
    fr: "Averses",
    de: "Regenschauer",
    lb: "Reeschaueren",
    en: "Showers",
    es: "Chubascos",
  },
  neige: { fr: "Neige", de: "Schnee", lb: "Schnéi", en: "Snow", es: "Nieve" },
  orage: { fr: "Orage", de: "Gewitter", lb: "Donnerwieder", en: "Thunderstorm", es: "Tormenta" },
}
