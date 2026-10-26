import { compteConnecte } from "@/lib/annonces/comptes"
import {
  autreParticipant,
  lireDiscussion,
  lireFil,
  marquerLue,
  participe,
  pourFil,
} from "@/lib/annonces/discussions"

/**
 * Le fil ouvert se tient à jour : les messages arrivés depuis `apres`, et
 * jusqu'où l'autre a lu (pour le « Vu »). Avec `vu`, la discussion est
 * marquée lue (la page est affichée à l'écran).
 */
export const dynamic = "force-dynamic"

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const c = await compteConnecte()
  if (!c) return Response.json({ erreur: "Session expirée." }, { status: 401 })
  const d = await lireDiscussion(id)
  if (!d || !participe(d, c.id))
    return Response.json({ erreur: "Discussion introuvable." }, { status: 404 })
  const corps = (await req.json().catch(() => ({}))) as { apres?: unknown; vu?: unknown }
  const apres = Number(corps.apres) || 0
  const [messages, lu] = await Promise.all([
    lireFil(id, apres),
    corps.vu === true ? marquerLue(id, c.id) : Promise.resolve(false),
  ])
  return Response.json(
    {
      messages: messages.map((m) => pourFil(m, c.id)),
      luAutre: d.lu[autreParticipant(d, c.id)] ?? 0,
      lu,
    },
    { headers: { "Cache-Control": "no-store" } },
  )
}
