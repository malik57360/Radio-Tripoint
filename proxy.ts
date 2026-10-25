import { NextResponse, type NextRequest } from "next/server"

/**
 * Langues dans l'URL. Le français garde les adresses d'origine (sans
 * préfixe) : on réécrit en interne "/agenda" vers "/fr/agenda", et
 * "/fr/agenda" redirige vers "/agenda" pour qu'une page n'ait qu'une URL.
 * "/de/…", "/lb/…", "/en/…" et "/es/…" passent tels quels.
 *
 * Volontairement autonome (pas d'import de lib/) : le proxy peut tourner à
 * part du reste du code.
 */
const PREFIXES = new Set(["de", "lb", "en", "es"])

/** heytripo.fr (et son sous-domaine de secours) : tout mène à l'appli Tripo. */
const HOTES_TRIPO = /^(www\.)?heytripo\.fr$|^tripo\.radio-tripoint-officiel\.fr$/

/**
 * Les Petites annonces ont leur site : annonces.radio-tripoint-officiel.fr.
 * Ses pages sont servies depuis app/petites-annonces ; sur le site de la
 * radio, l'ancienne adresse /annonces (et ses versions /de/…) y renvoie.
 */
const SITE_ANNONCES = (
  process.env.NEXT_PUBLIC_ANNONCES_URL ?? "https://annonces.radio-tripoint-officiel.fr"
).replace(/\/$/, "")
const HOTE_ANNONCES = new URL(SITE_ANNONCES).hostname
const DOSSIER_ANNONCES = "/petites-annonces"

export function proxy(request: NextRequest) {
  const hote = (request.headers.get("host") ?? "").split(":")[0].toLowerCase()
  if (HOTES_TRIPO.test(hote)) {
    const url = request.nextUrl.clone()
    url.pathname = "/heytripo"
    return NextResponse.rewrite(url)
  }

  const { pathname, search } = request.nextUrl

  if (hote === HOTE_ANNONCES) {
    // Le dossier interne n'a pas d'adresse publique : une seule URL par page.
    if (pathname === DOSSIER_ANNONCES || pathname.startsWith(`${DOSSIER_ANNONCES}/`)) {
      const url = request.nextUrl.clone()
      url.pathname = pathname.slice(DOSSIER_ANNONCES.length) || "/"
      return NextResponse.redirect(url, 308)
    }
    const url = request.nextUrl.clone()
    url.pathname = `${DOSSIER_ANNONCES}${pathname === "/" ? "" : pathname}`
    return NextResponse.rewrite(url)
  }

  // Site de la radio : plan du site et robots.txt sont les siens.
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") return NextResponse.next()

  // /annonces, /de/annonces/… ou le dossier interne → le site des annonces.
  const annonces = pathname.match(/^(?:\/[a-z]{2})?\/(?:annonces|petites-annonces)(\/.*)?$/)
  if (annonces) return NextResponse.redirect(`${SITE_ANNONCES}${annonces[1] ?? ""}${search}`, 308)

  const premier = pathname.split("/")[1]
  if (PREFIXES.has(premier)) return NextResponse.next()

  if (premier === "fr") {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || "/"
    return NextResponse.redirect(url, 308)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/fr${pathname === "/" ? "" : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Ni l'API, ni les fichiers (tout ce qui a une extension), ni les
  // ressources de Next — sauf le plan du site et robots.txt, qui diffèrent
  // d'un site à l'autre.
  matcher: [
    "/((?!api/|_next/|direction(?:/|$)|heytripo(?:/|$)|.*\\.[a-zA-Z0-9]+$).*)",
    "/sitemap.xml",
    "/robots.txt",
  ],
}
