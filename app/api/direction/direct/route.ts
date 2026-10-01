import { estConnecte } from "@/lib/direction/acces"
import { direct } from "@/lib/direction/donnees"

/** Données « en ce moment », relues toutes les quelques secondes par l'écran. */
export async function GET() {
  if (!(await estConnecte())) return new Response(null, { status: 401 })
  return Response.json(await direct(), { headers: { "Cache-Control": "no-store" } })
}
