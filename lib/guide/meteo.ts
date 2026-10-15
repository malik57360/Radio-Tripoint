import { LIEUX, previsions } from "@/lib/meteo"

/**
 * Météo des Trois Frontières pour Tripo : prévisions Open-Meteo (gratuites,
 * sans clé, licence CC BY 4.0 — à citer), mises en cache 30 minutes.
 * En cas de panne, Tripo le sait et renvoie vers une recherche web.
 */

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
  try {
    const liste = await previsions()

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
