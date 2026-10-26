import { FileText, Receipt } from "lucide-react"
import { redirect } from "next/navigation"
import { EnTete, Vide } from "@/components/annonces/espace/Blocs"
import Link from "@/components/ui/Lien"
import { STATUTS_COMMANDE, dateHeure } from "@/components/annonces/espace/format"
import { listerCommandes } from "@/lib/annonces/commandes"
import { compteEspace, mesAnnonces } from "@/lib/annonces/espace-donnees"
import { euros } from "@/lib/annonces/offres"
import { metaAnnonces } from "@/lib/annonces/seo"
import { cn } from "@/lib/utils/cn"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Paiements",
    description: "Vos paiements.",
    chemin: "/mon-espace/paiements",
    noindex: true,
  })

export default async function Paiements() {
  const c = await compteEspace()
  if (!c) redirect("/connexion?suite=/mon-espace/paiements")
  const [commandes, annonces] = await Promise.all([
    listerCommandes(2000).then((l) => l.filter((x) => x.compte === c.id)),
    mesAnnonces(c.id),
  ])
  const titre = new Map(annonces.map((a) => [a.id, a.titre]))
  const payees = commandes.filter((x) => x.statut === "payee")
  const depense = payees.reduce((t, x) => t + x.total, 0)

  return (
    <div className="space-y-5">
      <EnTete
        titre="Paiements"
        sousTitre={
          payees.length
            ? `${payees.length} paiement${payees.length > 1 ? "s" : ""} pour ${euros(depense)} au total. Réglés par carte via Stripe : la radio ne voit jamais votre numéro de carte.`
            : "Les annonces des particuliers sont gratuites ; seules les options se paient."
        }
      />
      {commandes.length === 0 ? (
        <Vide icone={Receipt} titre="Aucun paiement">
          Quand vous boostez une annonce ou choisissez une formule payante, le reçu s&apos;affiche
          ici.
        </Vide>
      ) : (
        <ul className="divide-trait border-trait bg-surface divide-y rounded-2xl border">
          {commandes.map((x) => {
            const s = STATUTS_COMMANDE[x.statut]
            return (
              <li key={x.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[0.72rem] font-extrabold",
                        s.teinte,
                      )}
                    >
                      {s.nom}
                    </span>
                    <span className="text-encre-3 text-[0.78rem]">
                      {dateHeure(x.payeeLe ?? x.creeLe)}
                    </span>
                  </p>
                  <p className="mt-1 truncate text-[0.95rem] font-bold">
                    {titre.get(x.annonce) ?? "Annonce supprimée"}
                  </p>
                  <p className="text-encre-2 text-[0.82rem]">
                    {x.lignes.map((l) => l.libelle).join(" + ")}
                  </p>
                </div>
                <p className="text-lg font-extrabold tabular-nums">{euros(x.total)}</p>
                {(x.statut === "payee" || x.statut === "remboursee") && (
                  <Link
                    href={`/mon-espace/paiements/${x.id}`}
                    className="btn btn-trait min-h-9 px-3 text-[0.82rem]"
                  >
                    <FileText className="size-4" aria-hidden />
                    Reçu
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
