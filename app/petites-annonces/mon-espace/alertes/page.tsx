import { Bell, BellOff, BellRing, Search, Trash2 } from "lucide-react"
import { redirect } from "next/navigation"
import { actionAlerteEmail, actionSupprimerAlerte } from "@/app/petites-annonces/actions"
import { ilYA } from "@/components/annonces/espace/Activite"
import { EnTete, Vide } from "@/components/annonces/espace/Blocs"
import Link from "@/components/ui/Lien"
import { compteEspace, mesAlertes } from "@/lib/annonces/espace-donnees"
import { MAX_ALERTES } from "@/lib/annonces/espace"
import { metaAnnonces } from "@/lib/annonces/seo"
import { cn } from "@/lib/utils/cn"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Alertes",
    description: "Vos recherches suivies.",
    chemin: "/mon-espace/alertes",
    noindex: true,
  })

/**
 * Alertes : des recherches enregistrées. Chacune dit combien d'annonces lui
 * répondent et combien sont parues depuis la dernière visite ; l'e-mail du
 * matin (une fois par jour au plus) ne part que s'il y a du neuf.
 */
export default async function Alertes() {
  const c = await compteEspace()
  if (!c) redirect("/connexion?suite=/mon-espace/alertes")
  const alertes = await mesAlertes(c.id)

  return (
    <div className="space-y-5">
      <EnTete
        titre="Alertes"
        sousTitre={`Faites une recherche, puis touchez « Créer une alerte » : les nouvelles annonces qui y répondent vous arrivent par e-mail, une fois par jour au plus (${MAX_ALERTES} alertes au plus).`}
      />
      {alertes.length === 0 ? (
        <Vide
          icone={Bell}
          titre="Aucune alerte"
          action={
            <Link href="/?voir=tout" className="btn btn-plein min-h-11">
              <Search className="size-4" aria-hidden />
              Faire une recherche
            </Link>
          }
        >
          Un vélo à moins de 200 €, un emploi à Thionville, un appartement au Luxembourg :
          enregistrez la recherche, et soyez le premier prévenu.
        </Vide>
      ) : (
        <ul className="space-y-3">
          {alertes.map((a) => (
            <li
              key={a.id}
              className={cn(
                "bg-surface rounded-2xl border p-4",
                a.nouvelles ? "border-[#f9b800]" : "border-trait",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "grid size-10 flex-none place-items-center rounded-full",
                    a.nouvelles ? "bg-accent text-black" : "bg-papier-2 text-encre-2",
                  )}
                >
                  {a.email ? (
                    <BellRing className="size-5" aria-hidden />
                  ) : (
                    <BellOff className="size-5" aria-hidden />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold">{a.nom}</p>
                  <p className="text-encre-2 mt-0.5 text-[0.85rem]">
                    <strong className="tabular-nums">{a.total}</strong> annonce
                    {a.total > 1 ? "s" : ""} en ligne
                    {a.nouvelles > 0 && (
                      <>
                        {" "}
                        ·{" "}
                        <strong className="text-[#8a6d00]">
                          {a.nouvelles} nouvelle{a.nouvelles > 1 ? "s" : ""}
                        </strong>{" "}
                        depuis votre dernière visite
                      </>
                    )}
                  </p>
                  <p className="text-encre-3 text-[0.76rem]">
                    Créée {ilYA(a.creeLe)} ·{" "}
                    {a.email ? "e-mail chaque matin s'il y a du neuf" : "sans e-mail"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {/* Point d'entrée serveur (note la visite puis redirige) : un vrai lien, pas une navigation de l'appli. */}
                    <a
                      href={`/api/annonces/alerte?id=${a.id}`}
                      className="btn btn-plein min-h-9 px-3.5 text-[0.82rem]"
                    >
                      Voir les annonces
                    </a>
                    <form action={actionAlerteEmail.bind(null, a.id, !a.email)}>
                      <button type="submit" className="btn btn-trait min-h-9 px-3.5 text-[0.82rem]">
                        {a.email ? (
                          <BellOff className="size-4" aria-hidden />
                        ) : (
                          <BellRing className="size-4" aria-hidden />
                        )}
                        {a.email ? "Couper l'e-mail" : "Recevoir par e-mail"}
                      </button>
                    </form>
                    <form action={actionSupprimerAlerte.bind(null, a.id)}>
                      <button type="submit" className="btn btn-trait min-h-9 px-3 text-[0.82rem]">
                        <Trash2 className="size-4" aria-hidden />
                        Supprimer
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
