import { after } from "next/server"
import { jetonInterne, jetonInterneValide } from "@/lib/direction/acces"
import { preparerUneEtape, selectionnerDuJour } from "@/lib/direction/conseils"
import { jourParis } from "@/lib/direction/redis"

/**
 * Tâche du matin (vercel.json) : choisit les 100 conseils du jour, puis
 * prépare les mails par étapes de moins d'une minute, en se relançant
 * elle-même tant qu'il reste du travail. Rien n'est envoyé ici : l'envoi se
 * fait depuis la page Prospection, d'un clic de Giorgio.
 * Sans CRON_SECRET, la tâche reste appelable sans risque : une seule
 * sélection par jour et 30 recherches IA au plus.
 */
export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  const jour = jourParis()
  const url = new URL(request.url)
  const secret = process.env.CRON_SECRET
  const parCron = !secret || request.headers.get("authorization") === `Bearer ${secret}`
  const parSuite = jetonInterneValide(jour, url.searchParams.get("t") ?? "")
  if (!parCron && !parSuite) return Response.json({ ok: false }, { status: 401 })

  const conseils = await selectionnerDuJour(jour)
  if (!conseils)
    return Response.json({ ok: false, erreur: "sélection impossible" }, { status: 503 })
  const etat = await preparerUneEtape(jour)
  if (etat.reste) {
    after(async () => {
      await fetch(`${url.origin}/api/prospection/quotidien?t=${jetonInterne(jour)}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }).catch(() => {})
    })
  }
  return Response.json({ ok: true, conseils: conseils.entreprises.length, ...etat })
}
