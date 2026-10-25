import { notFound } from "next/navigation"
import {
  BarreRecherche,
  GrilleAnnonces,
  IconeCategorie,
  teinte,
} from "@/components/annonces/Vitrine"
import { Resultats } from "@/components/annonces/Resultats"
import { FilAnnonces } from "@/components/annonces/Chrome"
import { annoncesPubliques } from "@/lib/annonces/annonces"
import { categoriesOuvertes, configPublique } from "@/lib/annonces/config"
import { aLaUneCategorie, lireFiltres } from "@/lib/annonces/recherche"
import { metaAnnonces } from "@/lib/annonces/seo"
import { cn } from "@/lib/utils/cn"

/** Page d'une catégorie : indexable, avec son bandeau « À la une » et ses filtres. */
async function categorie(slug: string) {
  const cfg = await configPublique()
  return categoriesOuvertes(cfg).find((c) => c.slug === slug) ?? null
}

export async function generateMetadata(props: PageProps<"/petites-annonces/[categorie]">) {
  const c = await categorie((await props.params).categorie)
  if (!c) return { title: "404" }
  const sp = await props.searchParams
  return metaAnnonces({
    titre: `${c.nom} — petites annonces des Trois Frontières`,
    description: `${c.accroche} : les petites annonces ${c.nom} en Moselle, au Luxembourg et en Sarre, vérifiées par Radio Tripoint.`,
    chemin: `/${c.slug}`,
    noindex: Object.keys(sp).length > 0,
  })
}

export default async function PageCategorie(props: PageProps<"/petites-annonces/[categorie]">) {
  const { categorie: slug } = await props.params
  const c = await categorie(slug)
  if (!c) notFound()
  const sp = await props.searchParams
  const filtres = { ...lireFiltres(sp), categorie: c.slug }
  const page = Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1
  const [tout, cfg] = await Promise.all([annoncesPubliques(), configPublique()])
  const liste = tout.filter((a) => a.categorie === c.slug)
  const une = aLaUneCategorie(liste, c.slug).slice(0, 8)

  return (
    <>
      <header className="bg-nuit text-nuit-encre relative overflow-hidden">
        <div className="conteneur pt-6 pb-8 sm:pt-8 sm:pb-10">
          <FilAnnonces elements={[{ nom: c.nom, chemin: `/${c.slug}` }]} sombre />
          <div className="mt-6 flex items-center gap-4 sm:gap-6">
            <span
              className={cn("autocollant apparait w-[4.6rem] flex-none sm:w-24", teinte(c.slug))}
              style={{ "--tourne": "-7deg", "--delai": "0.05s" } as React.CSSProperties}
            >
              <IconeCategorie slug={c.slug} className="size-8 sm:size-10" strokeWidth={1.6} />
            </span>
            <div className="min-w-0">
              <h1 className="titre-affiche text-[clamp(2.3rem,1.4rem+4.5vw,5rem)]">{c.nom}</h1>
              <p className="text-nuit-encre-2 mt-1.5 text-[0.98rem]">{c.accroche}</p>
            </div>
          </div>
          <div className="capsule mt-6 max-w-3xl">
            <BarreRecherche q={filtres.q} lieu={filtres.lieu} action={`/${c.slug}`} />
          </div>
        </div>
      </header>

      {une.length > 0 && (
        <section aria-labelledby="t-une" className="conteneur pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="t-une" className="titre-section text-[clamp(1.7rem,1.2rem+1.8vw,2.6rem)]">
              À la une
            </h2>
            <p className="text-encre-3 text-xs">Annonces mises en avant par leurs annonceurs</p>
          </div>
          <div className="mt-5">
            <GrilleAnnonces liste={une} />
          </div>
        </section>
      )}

      <div className="conteneur py-8 lg:py-12">
        <Resultats
          liste={liste}
          filtres={filtres}
          base={`/${c.slug}`}
          page={page}
          categories={categoriesOuvertes(cfg)}
          categorieFixe={c.slug}
        />
      </div>
    </>
  )
}
