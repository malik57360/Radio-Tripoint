import { Plus } from "lucide-react"
import Link from "@/components/ui/Lien"
import {
  BandeauMaquette,
  CarteAnnonce,
  EncadreArnaques,
  ICONES,
  TEINTES,
} from "@/components/annonces/Annonces"
import { Filtres } from "@/components/ui/Filtres"
import { PageHero } from "@/components/ui/PageHero"
import { ANNONCES, CATEGORIES, PAYS, type Categorie, type Pays } from "@/lib/annonces/exemples"
import { metadataPage } from "@/lib/seo/metadata"
import { cn } from "@/lib/utils/cn"

/** MAQUETTE — rubrique « Petites annonces » (pas encore ouverte, non indexée). */
export const generateMetadata = () =>
  metadataPage({
    titre: "Petites annonces des Trois Frontières (maquette)",
    description: "Maquette de la rubrique petites annonces de Radio Tripoint.",
    chemin: "/annonces",
    noindex: true,
  })

const ORDRE: Categorie[] = ["emploi", "vehicules", "affaires", "services"]

export default async function PageAnnonces(props: PageProps<"/[lang]/annonces">) {
  const sp = await props.searchParams
  const categorie = ORDRE.find((c) => c === sp.rubrique)
  const pays = (["FR", "LU", "DE"] as Pays[]).find((p) => p === sp.pays)
  const liste = ANNONCES.filter(
    (a) => (!categorie || a.categorie === categorie) && (!pays || a.pays === pays),
  )
  const href = (c?: string, p?: string) => {
    const q = new URLSearchParams()
    if (c) q.set("rubrique", c)
    if (p) q.set("pays", p)
    const s = q.toString()
    return s ? `/annonces?${s}` : "/annonces"
  }

  return (
    <>
      <BandeauMaquette />
      <PageHero
        miettes={[{ nom: "Annonces", chemin: "/annonces" }]}
        surtitre="Petites annonces"
        titre="Les annonces des Trois Frontières"
        intro="Emploi, véhicules, bonnes affaires, services : les annonces de chez nous, en France, au Luxembourg et en Allemagne. Chaque annonce est vérifiée par l'équipe de Radio Tripoint avant de paraître."
        enfants={
          <p className="mt-6 flex flex-wrap gap-3">
            <Link href="/annonces/deposer" className="btn btn-plein">
              <Plus className="size-4.5" aria-hidden />
              Déposer une annonce
            </Link>
            <span className="text-encre-3 self-center text-sm">
              Gratuit pour les particuliers · en ligne 30 jours
            </span>
          </p>
        }
      />

      <section aria-label="Rubriques" className="conteneur pt-8 lg:pt-10">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {ORDRE.map((c) => {
            const Icone = ICONES[c]
            const n = ANNONCES.filter((a) => a.categorie === c).length
            const actif = categorie === c
            return (
              <li key={c}>
                <Link
                  href={href(actif ? undefined : c, pays)}
                  scroll={false}
                  aria-current={actif ? "page" : undefined}
                  className={cn(
                    "flex h-full flex-col rounded-lg p-4 transition-transform hover:-translate-y-0.5",
                    TEINTES[c],
                    actif && "ring-encre ring-4 ring-offset-2",
                  )}
                >
                  <Icone className="size-7" strokeWidth={1.8} aria-hidden />
                  <span className="mt-3 text-[1.05rem] leading-tight font-extrabold">
                    {CATEGORIES[c].nom}
                  </span>
                  <span className="mt-1 text-[0.8rem] leading-snug opacity-80">
                    {CATEGORIES[c].accroche}
                  </span>
                  <span className="mt-auto pt-3 text-[0.8rem] font-bold opacity-90">
                    {n} annonce{n > 1 ? "s" : ""}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="mt-6">
          <Filtres
            label="Pays"
            options={[
              { valeur: "", libelle: "Les trois pays" },
              ...(["FR", "LU", "DE"] as Pays[]).map((p) => ({ valeur: p, libelle: PAYS[p] })),
            ]}
            actif={pays ?? ""}
            href={(v) => href(categorie, v || undefined)}
          />
        </div>
      </section>

      <div className="conteneur grid gap-10 py-10 lg:grid-cols-[1fr_20rem] lg:gap-14 lg:py-14">
        <section aria-label="Annonces">
          <h2 className="titre-section">
            {categorie ? CATEGORIES[categorie].nom : "Dernières annonces"}
            <span className="text-encre-3 ml-3 text-base font-semibold">{liste.length}</span>
          </h2>
          <ul className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {liste.map((a) => (
              <li key={a.slug}>
                <CarteAnnonce a={a} />
              </li>
            ))}
          </ul>
        </section>
        <div className="space-y-6">
          <EncadreArnaques />
          <aside className="bg-nuit text-nuit-encre rounded-lg p-5">
            <p className="text-nuit-accent surtitre">Professionnels</p>
            <p className="mt-2 text-lg leading-snug font-extrabold">
              Recrutez ou vendez dans les Trois Frontières
            </p>
            <p className="text-nuit-encre-2 mt-2 text-[0.93rem]">
              Offres d’emploi et annonces pro mises en avant, et relayées à l’antenne de Radio
              Tripoint.
            </p>
            <Link
              href="/annonces/deposer?pro=1"
              className="btn bg-accent mt-4 text-black hover:brightness-95"
            >
              Annonce pro
            </Link>
          </aside>
        </div>
      </div>
    </>
  )
}
