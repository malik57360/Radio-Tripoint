/**
 * Outils purs de la recherche de coordonnées (sans réseau, testables à part) :
 * nettoyage des e-mails et numéros, lecture de la réponse de l'IA, et
 * contrôle qu'une valeur figure bien sur la page donnée comme source.
 */

/** « Contact@Exemple.fr », « mailto:… » → « contact@exemple.fr » ; null si ce n'est pas un e-mail. */
export function emailPropre(brut: unknown): string | null {
  if (typeof brut !== "string") return null
  const e = brut
    .trim()
    .toLowerCase()
    .replace(/^mailto:/, "")
  return /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(e) && e.length <= 120
    ? e
    : null
}

/**
 * Chiffres d'un numéro : « 03 82 83 12 34 », « +33 (0)3 82… », « 0033 3… »
 * → « 0382831234 ». Les numéros étrangers gardent leur indicatif : « +352621123456 ».
 */
export function chiffresTelephone(brut: unknown): string | null {
  if (typeof brut !== "string") return null
  let d = brut.replace(/\(0\)/g, "").replace(/[^\d+]/g, "")
  if (d.startsWith("00")) d = `+${d.slice(2)}`
  if (d.startsWith("+33")) d = `0${d.slice(3)}`
  if (/^0[1-9]\d{8}$/.test(d)) return d
  if (/^\+(?!33)[1-9]\d{7,13}$/.test(d)) return d
  return null
}

/** « 0382831234 » → « 03 82 83 12 34 » (les numéros étrangers restent tels quels). */
export const telephoneLisible = (chiffres: string) =>
  /^0\d{9}$/.test(chiffres) ? chiffres.replace(/(\d{2})(?=\d)/g, "$1 ") : chiffres

/** Adresse web http(s) propre, ou null. */
export function sitePropre(brut: unknown): string | null {
  if (typeof brut !== "string") return null
  try {
    const u = new URL(brut.trim())
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null
  } catch {
    return null
  }
}

/** Le premier objet JSON d'un texte (l'IA l'entoure parfois de ```json). */
export function extraireJson(texte: string): unknown {
  const debut = texte.indexOf("{")
  const fin = texte.lastIndexOf("}")
  if (debut < 0 || fin <= debut) return null
  try {
    return JSON.parse(texte.slice(debut, fin + 1))
  } catch {
    return null
  }
}

/** Le texte d'une page, entités HTML décodées (les e-mails y sont souvent masqués en &#64;). */
export function texteDePage(html: string) {
  return html
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&commat;/gi, "@")
    .replace(/&nbsp;/gi, " ")
    .replace(/ /g, " ")
}

export const pageContientEmail = (page: string, email: string) =>
  texteDePage(page).toLowerCase().includes(email)

/** Le numéro figure-t-il sur la page, quelle que soit sa présentation (espaces, points, +33…) ? */
export function pageContientTelephone(page: string, chiffres: string) {
  // Les 9 chiffres qui suivent le 0 (ou l'indicatif) se retrouvent dans toutes les écritures.
  const coeur = chiffres.startsWith("0") ? chiffres.slice(1) : chiffres.replace(/^\+/, "")
  for (const m of texteDePage(page).matchAll(/\+?\d[\d\s.\-()/]{7,24}\d/g))
    if (m[0].replace(/\D/g, "").includes(coeur)) return true
  return false
}

/**
 * Sites qui ne montrent pas leur contenu à un robot (connexion, JavaScript) :
 * une valeur lue par l'IA y est gardée, mais signalée « à vérifier ».
 */
export const SOURCES_FERMEES = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "pagesjaunes.fr",
  "google.com",
  "google.fr",
]

export const sourceFermee = (url: string) => {
  try {
    const h = new URL(url).hostname.replace(/^www\./, "")
    return SOURCES_FERMEES.some((d) => h === d || h.endsWith(`.${d}`))
  } catch {
    return true
  }
}

/**
 * Adresse qu'on accepte de relire : http(s), port standard, nom de domaine
 * public (ni localhost, ni adresse IP brute, ni réseau interne). Les pages
 * citées viennent du web : on ne laisse pas l'une d'elles faire interroger
 * une adresse interne par le serveur.
 */
export function sourcePublique(url: string, locales = false): boolean {
  try {
    const u = new URL(url)
    if (u.protocol !== "https:" && u.protocol !== "http:") return false
    if (locales) return true
    if (u.port && u.port !== "80" && u.port !== "443") return false
    const h = u.hostname.toLowerCase()
    if (!h.includes(".") || h.startsWith("[") || /^[\d.]+$/.test(h)) return false
    return !/(^|\.)(localhost|local|internal|lan|home|corp)$/.test(h)
  } catch {
    return false
  }
}
