import {
  changerStatut,
  annoncesPubliques,
  listerAnnonces,
  noterAvertissement,
  viderPhotos,
} from "@/lib/annonces/annonces"
import { annulerCommande, lireCommande } from "@/lib/annonces/commandes"
import { lireCompte } from "@/lib/annonces/comptes"
import { lireConfig } from "@/lib/annonces/config"
import { envoyerSansEchec, mailAlertes, mailExpiree, mailExpireBientot } from "@/lib/annonces/mails"
import { prixAffiche } from "@/lib/annonces/prix"
import { comptesAvecAlertes, lireAlertes, modifierAlerte } from "@/lib/annonces/espace"
import { filtrer, trier } from "@/lib/annonces/recherche"
import { cheminAnnonce } from "@/lib/annonces/types"
import { cronAutorise } from "@/lib/direction/acces"

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
  if (!cronAutorise(request)) return Response.json({ ok: false }, { status: 401 })

  const cfg = await lireConfig()
  const prix = (pro: boolean) =>
    cfg.offres.find((o) => o.code === (pro ? "prolongation_pro" : "prolongation"))?.prixCentimes ??
    0
  const maintenant = Date.now()
  const bilan = { averties: 0, expirees: 0, abandonnees: 0, photos: 0, alertes: 0 }

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
  bilan.alertes = await envoyerAlertes()
  return Response.json({ ok: true, ...bilan })
}

/** E-mails d'alerte : une fois par jour au plus, et seulement s'il y a du neuf. */
async function envoyerAlertes() {
  let envoyes = 0
  const liste = await annoncesPubliques()
  for (const id of await comptesAvecAlertes()) {
    try {
      const c = await lireCompte(id)
      if (!c || c.bloque || !c.emailVerifie) continue
      const groupes = []
      const vues: string[] = []
      for (const al of (await lireAlertes(id)).filter((x) => x.email)) {
        const neuves = trier(
          filtrer(liste, al.filtres).filter((x) => x.publieeLe > al.envoyeLe),
          "recent",
        )
        vues.push(al.id)
        if (!neuves.length) continue
        groupes.push({
          nom: al.nom,
          total: neuves.length,
          annonces: neuves.slice(0, 10).map((x) => ({
            titre: x.titre,
            prix: prixAffiche(x),
            ville: x.ville,
            chemin: cheminAnnonce(x),
          })),
        })
      }
      if (!groupes.length) continue
      const parti = await envoyerSansEchec({ a: c.email, ...mailAlertes(c.nom, groupes) })
      if (!parti) continue
      envoyes++
      const le = Date.now()
      for (const al of vues) await modifierAlerte(id, al, { envoyeLe: le })
    } catch (e) {
      console.error("[annonces] alertes :", id, (e as Error).message)
    }
  }
  return envoyes
}
