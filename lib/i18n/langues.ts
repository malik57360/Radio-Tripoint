/**
 * Langues du site. Le français reste à la racine (URL inchangées) ; les
 * autres langues vivent sous un préfixe : /de/…, /lb/…, /en/…, /es/…
 */
export const langues = ["fr", "de", "lb", "en", "es"] as const
export type Langue = (typeof langues)[number]
export const langueParDefaut: Langue = "fr"

export const estLangue = (x: unknown): x is Langue =>
  typeof x === "string" && (langues as readonly string[]).includes(x)

/** Nom de chaque langue dans sa propre langue (sélecteur). */
export const nomsLangues: Record<Langue, string> = {
  fr: "Français",
  de: "Deutsch",
  lb: "Lëtzebuergesch",
  en: "English",
  es: "Español",
}

/** Code BCP 47 pour `<html lang>`, hreflang et Open Graph. */
export const codesLangues: Record<Langue, { html: string; og: string }> = {
  fr: { html: "fr", og: "fr_FR" },
  de: { html: "de", og: "de_DE" },
  lb: { html: "lb", og: "lb_LU" },
  en: { html: "en", og: "en_GB" },
  es: { html: "es", og: "es_ES" },
}

/** Un texte dans les langues du site. Le français fait foi et sert de repli. */
export type Trad<T = string> = { fr: T; de?: T; lb?: T; en?: T; es?: T }

export function choisir<T>(texte: Trad<T>, langue: Langue): T {
  return texte[langue] ?? texte.fr
}

/** Chemins qui ne sont pas des pages : jamais préfixés. */
const HORS_PAGES = /^\/(api|_next|media|brand|photos)(\/|$)|\.[a-z0-9]+(\?|#|$)/i

/** Préfixe un chemin interne avec la langue ("/agenda" → "/de/agenda"). */
export function lienLangue(href: string, langue: Langue): string {
  if (langue === langueParDefaut || !href.startsWith("/") || href.startsWith("//")) return href
  if (HORS_PAGES.test(href)) return href
  if (href === "/") return `/${langue}`
  if (/^\/[?#]/.test(href)) return `/${langue}${href.slice(1)}`
  return `/${langue}${href}`
}

/** Retire le préfixe de langue d'un chemin ("/de/agenda" → "/agenda"). */
export function sansLangue(chemin: string): string {
  const [, premier, ...reste] = chemin.split("/")
  if (estLangue(premier) && premier !== langueParDefaut) return `/${reste.join("/")}`
  return chemin
}

/** Outil de traduction : t({ fr, de, lb }), plus la langue et les liens. */
export function creerT(langue: Langue) {
  const t = <T>(texte: Trad<T>) => choisir(texte, langue)
  return Object.assign(t, {
    langue,
    lien: (href: string) => lienLangue(href, langue),
  })
}
export type T = ReturnType<typeof creerT>
