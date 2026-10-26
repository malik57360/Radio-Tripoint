import { notFound, redirect } from "next/navigation"
import { BoutonImprimer } from "@/components/annonces/espace/BoutonImprimer"
import Link from "@/components/ui/Lien"
import { site } from "@/config/site"
import { lireAnnonce } from "@/lib/annonces/annonces"
import { lireCommande } from "@/lib/annonces/commandes"
import { compteEspace } from "@/lib/annonces/espace-donnees"
import { euros } from "@/lib/annonces/offres"
import { metaAnnonces } from "@/lib/annonces/seo"
import { dateHeure } from "@/components/annonces/espace/format"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Reçu de paiement",
    description: "Reçu.",
    chemin: "/mon-espace/paiements",
    noindex: true,
  })

/**
 * Reçu imprimable d'un paiement. Ce n'est pas une facture : on en obtient
 * une sur simple demande à la radio (indiqué en bas du reçu).
 */
export default async function Recu(
  props: PageProps<"/petites-annonces/mon-espace/paiements/[id]">,
) {
  const c = await compteEspace()
  if (!c) redirect("/connexion?suite=/mon-espace/paiements")
  const { id } = await props.params
  const x = await lireCommande(id)
  if (!x || x.compte !== c.id || (x.statut !== "payee" && x.statut !== "remboursee")) notFound()
  const a = await lireAnnonce(x.annonce)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/mon-espace/paiements" className="lien text-sm font-bold">
          ← Tous les paiements
        </Link>
        <BoutonImprimer />
      </div>
      <article className="recu bg-surface border-trait rounded-2xl border p-5 sm:p-8">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--trait)] pb-5">
          <div>
            <p className="text-encre-3 text-[0.72rem] font-extrabold tracking-[0.14em] uppercase">
              Reçu de paiement
            </p>
            <p className="mt-1 text-xl font-extrabold">Les Petites Annonces du Tripoint</p>
            <p className="text-encre-2 text-sm">Un service de {site.nom}</p>
          </div>
          <dl className="text-sm sm:text-right">
            <dt className="text-encre-3 inline sm:block">Reçu n° </dt>
            <dd className="inline font-bold tabular-nums sm:block">{x.id.toUpperCase()}</dd>
            <dt className="text-encre-3 mt-1 block">Payé le</dt>
            <dd className="font-bold">{dateHeure(x.payeeLe ?? x.creeLe)}</dd>
          </dl>
        </header>
        <section className="grid gap-5 py-5 sm:grid-cols-2">
          <div>
            <p className="text-encre-3 text-[0.75rem] font-bold uppercase">Client</p>
            <p className="font-bold">{c.type === "pro" && c.pro ? c.pro.raisonSociale : c.nom}</p>
            <p className="text-encre-2 text-sm">{c.email}</p>
            {c.type === "pro" && c.pro && (
              <p className="text-encre-2 text-sm">
                {c.pro.identifiant} · {c.pro.codePostal} {c.pro.ville}
              </p>
            )}
          </div>
          <div>
            <p className="text-encre-3 text-[0.75rem] font-bold uppercase">Annonce</p>
            <p className="font-bold">{a?.titre ?? "Annonce supprimée"}</p>
            <p className="text-encre-2 text-sm">Référence {x.annonce}</p>
          </div>
        </section>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-encre-3 border-b border-[var(--trait)] text-left text-[0.75rem] uppercase">
              <th className="py-2 font-bold">Désignation</th>
              <th className="py-2 text-right font-bold">Montant TTC</th>
            </tr>
          </thead>
          <tbody>
            {x.lignes.map((l, i) => (
              <tr key={i} className="border-b border-[var(--trait)]">
                <td className="py-2.5">{l.libelle}</td>
                <td className="py-2.5 text-right tabular-nums">{euros(l.centimes)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="pt-3 font-extrabold">Total payé</td>
              <td className="pt-3 text-right text-lg font-extrabold tabular-nums">
                {euros(x.total)}
              </td>
            </tr>
            {x.remboursement && (
              <tr>
                <td className="pt-1 text-[#0a3640]">
                  Remboursé le {dateHeure(x.remboursement.le)} ({x.remboursement.motif})
                </td>
                <td className="pt-1 text-right font-bold text-[#0a3640] tabular-nums">
                  − {euros(x.remboursement.montant)}
                </td>
              </tr>
            )}
          </tfoot>
        </table>
        <footer className="text-encre-3 mt-6 border-t border-[var(--trait)] pt-4 text-[0.78rem] leading-snug">
          Paiement par carte bancaire, traité par Stripe. Ce reçu n&apos;est pas une facture : pour
          en obtenir une, écrivez à {site.contact.email} en indiquant le numéro du reçu.
        </footer>
      </article>
    </div>
  )
}
