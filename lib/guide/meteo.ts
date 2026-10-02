/**
 * Météo des Trois Frontières pour Tripo : prévisions Open-Meteo (gratuites,
 * sans clé, licence CC BY 4.0 — à citer), mises en cache 30 minutes.
 * En cas de panne, Tripo le sait et renvoie vers une recherche web.
 */

const LIEUX = [
  { nom: "Sierck-les-Bains", lat: 49.4406, lon: 6.3578 },
  { nom: "Thionville", lat: 49.3579, lon: 6.1683 },
  { nom: "Metz", lat: 49.1193, lon: 6.1757 },
  { nom: "Luxembourg-Ville", lat: 49.6116, lon: 6.1319 },
  { nom: "Merzig (Sarre)", lat: 49.4436, lon: 6.6374 },
]

/** Codes météo WMO utilisés par Open-Meteo. */
const TEMPS: Record<number, string> = {
  0: "ciel dégagé",
  1: "plutôt ensoleillé",
  2: "partiellement nuageux",
  3: "couvert",
  45: "brouillard",
  48: "brouillard givrant",
  51: "bruine légère",
  53: "bruine",
  55: "bruine forte",
  56: "bruine verglaçante",
  57: "bruine verglaçante forte",
  61: "pluie faible",
  63: "pluie",
  65: "pluie forte",
  66: "pluie verglaçante",
  67: "pluie verglaçante forte",
  71: "neige faible",
  73: "neige",
  75: "neige forte",
  77: "grains de neige",
  80: "averses",
  81: "averses modérées",
  82: "fortes averses",
  85: "averses de neige",
  86: "fortes averses de neige",
  95: "orage",
  96: "orage avec grêle",
  99: "orage avec forte grêle",
}

interface Prevision {
  current?: { time: string; temperature_2m: number; weather_code: number; wind_speed_10m: number }
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

const temps = (code: number) => TEMPS[code] ?? `code météo ${code}`
const r = (n: number) => Math.round(n)

const jour = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${iso}T12:00:00Z`))

export async function meteoGuide(): Promise<string> {
  const url = new URL("https://api.open-meteo.com/v1/forecast")
  url.searchParams.set("latitude", LIEUX.map((l) => l.lat).join(","))
  url.searchParams.set("longitude", LIEUX.map((l) => l.lon).join(","))
  url.searchParams.set("current", "temperature_2m,weather_code,wind_speed_10m")
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max",
  )
  url.searchParams.set("timezone", "Europe/Paris")
  url.searchParams.set("forecast_days", "7")

  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(String(res.status))
    const brut: unknown = await res.json()
    const liste = (Array.isArray(brut) ? brut : [brut]) as Prevision[]

    return LIEUX.map((lieu, i) => {
      const p = liste[i]
      if (!p?.daily) return `## ${lieu.nom}\nprévision indisponible`
      const lignes: string[] = [`## ${lieu.nom}`]
      if (p.current)
        lignes.push(
          `Maintenant (${p.current.time.slice(11, 16)}) : ${r(p.current.temperature_2m)} °C, ${temps(p.current.weather_code)}, vent ${r(p.current.wind_speed_10m)} km/h`,
        )
      const d = p.daily
      d.time.forEach((t, k) => {
        const pluie = d.precipitation_probability_max[k]
        lignes.push(
          `- ${jour(t)} : ${temps(d.weather_code[k])}, ${r(d.temperature_2m_min[k])} à ${r(d.temperature_2m_max[k])} °C` +
            `${pluie != null ? `, risque de pluie ${pluie} %` : ""}` +
            `${d.precipitation_sum[k] >= 0.5 ? ` (${d.precipitation_sum[k].toFixed(1)} mm)` : ""}` +
            `, vent jusqu'à ${r(d.wind_speed_10m_max[k])} km/h`,
        )
      })
      return lignes.join("\n")
    }).join("\n\n")
  } catch (e) {
    console.error("[guide] météo indisponible :", (e as Error).message)
    return "Prévisions indisponibles pour le moment : si on te demande la météo, fais une recherche web (Météo-France, MeteoLux, DWD) et dis-le."
  }
}
