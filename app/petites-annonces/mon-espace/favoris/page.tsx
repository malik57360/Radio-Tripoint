import { Heart, HeartOff } from "lucide-react"
import { redirect } from "next/navigation"
import { actionRetirerFavori } from "@/app/petites-annonces/actions"
import { ilYA } from "@/components/annonces/espace/Activite"
import { EnTete, Vide } from "@/components/annonces/espace/Blocs"
import { GrilleAnnonces } from "@/components/annonces/Vitrine"
import Link from "@/components/ui/Lien"
import { lireAnnonce } from "@/lib/annonces/annonces"
import { lireConfig, nomCategorie } from "@/lib/annonces/config"
import { compteEspace, enLigne, mesFavoris } from "@/lib/annonces/espace-donnees"
import { MAX_FAVORIS } from "@/lib/annonces/espace"
import { metaAnnonces } from "@/lib/annonces/seo"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Favoris",
    description: "Vos annonces mises de côté.",
    chemin: "/mon-espace/favoris",
    noindex: true,
  })

export default async function Favoris() {
  const c = await compteEspace()
  if (!c) redirect("/connexion?suite=/mon-espace/favoris")
  const [favoris, liste, cfg] = await Promise.all([mesFavoris(c.id), enLigne(), lireConfig()])
  const parId = new Map(liste.map((a) => [a.id, a]))
  const dispo = favoris.flatMap((f) => (parId.has(f.id) ? [parId.get(f.id)!] : []))
  const partis = await Promise.all(
    favoris
      .filter((f) => !parId.has(f.id))
      .map(async (f) => ({ ...f, a: await lireAnnonce(f.id) })),
  )

  return (
    <div className="space-y-5">
      <EnTete
        titre="Favoris"
        sousTitre={
          favoris.length
            ? `${dispo.length} annonce${dispo.length > 1 ? "s" : ""} toujours en ligne. Touchez le cœur d'une annonce pour l'ajouter ou la retirer (${MAX_FAVORIS} au plus).`
            : undefined
        }
      />
      {favoris.length === 0 ? (
        <Vide
          icone={Heart}
          titre="Aucun favori pour l'instant"
          action={
            <Link href="/?voir=tout" className="btn btn-plein min-h-11">
              Parcourir les annonces
            </Link>
          }
        >
          Touchez le cœur sur une annonce pour la mettre de côté : vous la retrouverez ici, et vous
          saurez si elle a été vendue.
        </Vide>
      ) : (
        <>
          {dispo.length > 0 && (
            <GrilleAnnonces liste={dispo} nomCategorie={(s) => nomCategorie(cfg, s)} />
          )}
          {partis.length > 0 && (
            <section aria-labelledby="t-partis" className="pt-2">
              <h2 id="t-partis" className="text-[1.02rem] font-extrabold">
                Plus en ligne
              </h2>
              <p className="text-encre-2 text-sm">
                Vendues, expirées ou retirées par leur annonceur.
              </p>
              <ul className="divide-trait border-trait bg-surface mt-3 divide-y rounded-2xl border">
                {partis.map((f) => (
                  <li key={f.id} className="flex items-center gap-3 px-4 py-3">
                    <HeartOff className="text-encre-3 size-4 flex-none" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.92rem] font-bold">
                        {f.a?.titre ?? "Annonce supprimée"}
                      </p>
                      <p className="text-encre-3 text-[0.76rem]">
                        {f.a ? `${f.a.ville} · ` : ""}mise de côté {ilYA(f.le)}
                      </p>
                    </div>
                    <form action={actionRetirerFavori.bind(null, f.id)}>
                      <button type="submit" className="btn btn-trait min-h-9 px-3 text-[0.8rem]">
                        Retirer
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}
