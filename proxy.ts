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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
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
  // ressources de Next.
  matcher: ["/((?!api/|_next/|direction(?:/|$)|.*\\.[a-zA-Z0-9]+$).*)"],
}
