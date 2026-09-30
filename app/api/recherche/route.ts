import { rechercher } from "@/lib/contenu/recherche"
import { estLangue } from "@/lib/i18n/langues"

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const q = (params.get("q") ?? "").slice(0, 100)
  const l = params.get("langue")
  const resultats = await rechercher(q, 12, estLangue(l) ? l : "fr")
  return Response.json(
    { resultats },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } },
  )
}
