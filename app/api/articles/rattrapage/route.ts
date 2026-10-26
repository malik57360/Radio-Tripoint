import { articlesATraduire, traduireArticle } from "@/lib/direction/traduction-articles"

/**
 * Filet de sécurité quotidien (vercel.json) : tout article du tableau de bord
 * à qui il manque une langue est retraduit, les plus récents d'abord, sans
 * attendre la pause qui suit un échec. Un article commencé va jusqu'au bout ;
 * on n'en commence plus quand il reste moins de deux minutes.
 */
export const dynamic = "force-dynamic"
export const maxDuration = 300

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`)
    return Response.json({ ok: false }, { status: 401 })

  const fin = Date.now() + (maxDuration - 120) * 1000
  const bilan: Record<string, string> = {}
  for (const slug of await articlesATraduire()) {
    if (Date.now() > fin) break
    try {
      const r = await traduireArticle(slug, true)
      bilan[slug] = r.echecs.length ? `${r.statut} (échec : ${r.echecs.join(", ")})` : r.statut
    } catch (e) {
      bilan[slug] = "erreur"
      console.error("[traduction] rattrapage quotidien :", slug, (e as Error).message)
    }
  }
  return Response.json({ ok: true, bilan })
}
