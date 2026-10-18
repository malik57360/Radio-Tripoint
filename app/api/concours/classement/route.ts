import { classementPublic } from "@/lib/concours/serveur"

/** Jeu concours : les 10 meilleurs (pseudo et points, jamais l'e-mail). */
export const dynamic = "force-dynamic"

export async function GET() {
  const c = await classementPublic(10)
  if (!c) return Response.json({ erreur: "stockage" }, { status: 503 })
  return Response.json(c, {
    headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" },
  })
}
