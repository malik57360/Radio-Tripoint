// node scripts/horoscope.mjs <jour.json>
//
// Ajoute l'horoscope d'un jour à data/horoscope.json et retire les jours
// de plus d'une semaine. <jour.json> : { "jour": "AAAA-MM-JJ", "langues":
// { "fr": { belier: "…", … }, "de": {…}, "lb": {…}, "en": {…}, "es": {…} } }.
// Vérifie qu'il y a bien les douze signes dans les cinq langues.
import { readFileSync, writeFileSync } from "node:fs"

const SIGNES = [
  "belier",
  "taureau",
  "gemeaux",
  "cancer",
  "lion",
  "vierge",
  "balance",
  "scorpion",
  "sagittaire",
  "capricorne",
  "verseau",
  "poissons",
]
const LANGUES = ["fr", "de", "lb", "en", "es"]
const FICHIER = new URL("../data/horoscope.json", import.meta.url)
const GARDER_JOURS = 8

const { jour, langues } = JSON.parse(readFileSync(process.argv[2], "utf8"))
if (!/^\d{4}-\d{2}-\d{2}$/.test(jour)) throw new Error(`jour invalide : ${jour}`)
for (const l of LANGUES)
  for (const s of SIGNES) {
    const t = langues?.[l]?.[s]
    if (typeof t !== "string" || t.trim().length < 20 || t.length > 900)
      throw new Error(`${jour} ${l} ${s} : texte manquant ou hors limites`)
  }

const tous = JSON.parse(readFileSync(FICHIER, "utf8"))
tous[jour] = Object.fromEntries(
  LANGUES.map((l) => [l, Object.fromEntries(SIGNES.map((s) => [s, langues[l][s].trim()]))]),
)
const limite = new Date(Date.parse(`${jour}T12:00:00Z`) - GARDER_JOURS * 24 * 3600 * 1000)
  .toISOString()
  .slice(0, 10)
const gardes = Object.keys(tous)
  .filter((j) => j > limite)
  .sort()
writeFileSync(
  FICHIER,
  JSON.stringify(Object.fromEntries(gardes.map((j) => [j, tous[j]])), null, 2) + "\n",
)
console.log(`horoscope ${jour} ajouté ; jours gardés : ${gardes.join(", ")}`)
