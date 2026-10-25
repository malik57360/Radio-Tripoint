import {
  changerStatut,
  listerAnnonces,
  noterAvertissement,
  viderPhotos,
} from "@/lib/annonces/annonces"
import { annulerCommande, lireCommande } from "@/lib/annonces/commandes"
import { lireCompte } from "@/lib/annonces/comptes"
import { lireConfig } from "@/lib/annonces/config"
import { envoyerSansEchec, mailExpiree, mailExpireBientot } from "@/lib/annonces/mails"

/**
 * Tâche quotidienne des Petites annonces (vercel.json) :
 * - prévient 3 jours avant la fin de publication ;
 * - passe en « expirée » les annonces arrivées au bout (elles ont déjà
 *   disparu des pages publiques : le site filtre sur la date) ;
 * - retire les annonces jamais payées au bout de 7 jours ;
 * - efface les photos des annonces terminées depuis 60 jours.
 */
export const dynamic = "force-dynamic"
export const maxDuration = 60

const JOUR = 24 * 3600 * 1000

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`)
    return Response.json({ ok: false }, { status: 401 })

  const cfg = await lireConfig()
  const prix = (pro: boolean) =>
    cfg.offres.find((o) => o.code === (pro ? "prolongation_pro" : "prolongation"))?.prixCentimes ??
    0
  const maintenant = Date.now()
  const bilan = { averties: 0, expirees: 0, abandonnees: 0, photos: 0 }

  for (const a of await listerAnnonces(5000)) {
    try {
      const fin = a.expireLe ?? 0
      if (a.statut === "publiee" && fin <= maintenant) {
        await changerStatut(a, "expiree", undefined, "tache")
        const c = await lireCompte(a.compte)
        if (c)
          await envoyerSansEchec({
            a: c.email,
            ...mailExpiree(c.nom, a, prix(a.annonceur === "pro")),
          })
        bilan.expirees++
      } else if (a.statut === "publiee" && fin - maintenant < 3 * JOUR && !a.avertiExpiration) {
        const c = await lireCompte(a.compte)
        if (c)
          await envoyerSansEchec({
            a: c.email,
            ...mailExpireBientot(c.nom, a, prix(a.annonceur === "pro")),
          })
        await noterAvertissement(a)
        bilan.averties++
      } else if (a.statut === "attente_paiement" && maintenant - a.creeLe > 7 * JOUR) {
        const cmd = a.commande ? await lireCommande(a.commande) : null
        if (cmd) await annulerCommande(cmd)
        await changerStatut(a, "retiree", "Paiement non effectué", "tache")
        bilan.abandonnees++
      } else if (
        ["retiree", "refusee", "expiree"].includes(a.statut) &&
        a.photos.length &&
        maintenant - a.majLe > 60 * JOUR
      ) {
        await viderPhotos(a)
        bilan.photos++
      }
    } catch (e) {
      console.error("[annonces] tâche quotidienne :", a.id, (e as Error).message)
    }
  }
  return Response.json({ ok: true, ...bilan })
}
