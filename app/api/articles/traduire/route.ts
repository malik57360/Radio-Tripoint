import { createHash } from "node:crypto"
import { revalidateTag } from "next/cache"
import { after } from "next/server"
import { TAG_ARTICLES } from "@/lib/contenu/articles-dashboard"
import { traduireArticle } from "@/lib/direction/traduction-articles"
import { autoriser } from "@/lib/formulaires/limiteur"

/**
 * Rattrapage : la page d'un article du tableau de bord pas encore traduit
 * appelle ce point d'entrée quand on la lit dans une autre langue. La
 * traduction tourne après la réponse ; rien n'est retraduit si elle existe
 * déjà pour cette version (verrou et plafond d'échecs dans traduireArticle).
 */
export const dynamic = "force-dynamic"
export const maxDuration = 300

export async function POST(request: Request) {
  const corps = (await request.json().catch(() => null)) as { slug?: unknown } | null
  const slug = corps?.slug
  if (typeof slug !== "string" || !/^[a-z0-9-]{4,90}$/.test(slug))
    return Response.json({ ok: false }, { status: 400 })

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue"
  const cle = createHash("sha256").update(`traduction:${ip}`).digest("hex").slice(0, 24)
  if (!(await autoriser(cle, 10, 10 * 60 * 1000)))
    return Response.json({ ok: false }, { status: 429 })
  if (!(await autoriser("traduction:tous", 60, 3600 * 1000)))
    return Response.json({ ok: false }, { status: 429 })

  after(async () => {
    try {
      const r = await traduireArticle(slug)
      if (r.statut === "fait") revalidateTag(TAG_ARTICLES, { expire: 0 })
    } catch (e) {
      console.error("[traduction] rattrapage :", (e as Error).message)
    }
  })
  return Response.json({ ok: true }, { status: 202 })
}
