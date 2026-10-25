import { notFound } from "next/navigation"
import {
  BarreRecherche,
  CarteAnnonce,
  NavAnnonces,
  IconeCategorie,
  teinte,
} from "@/components/annonces/Vitrine"
import { Resultats } from "@/components/annonces/Resultats"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { annoncesPubliques } from "@/lib/annonces/annonces"
import { compteConnecte } from "@/lib/annonces/comptes"
import { categoriesOuvertes, configPublique } from "@/lib/annonces/config"
import { aLaUneCategorie, lireFiltres } from "@/lib/annonces/recherche"
import { metaAnnonces } from "@/lib/annonces/seo"
import { cn } from "@/lib/utils/cn"

/** Page d'une catégorie : indexable, avec son bandeau « À la une » et ses filtres. */
async function categorie(slug: string) {
  const cfg = await configPublique()
  return categoriesOuvertes(cfg).find((c) => c.slug === slug) ?? null
}

export async function generateMetadata(props: PageProps<"/[lang]/annonces/[categorie]">) {
  const c = await categorie((await props.params).categorie)
  if (!c) return { title: "404" }
  const sp = await props.searchParams
  return metaAnnonces({
    titre: `${c.nom} — petites annonces des Trois Frontières`,
    description: `${c.accroche} : les petites annonces ${c.nom} en Moselle, au Luxembourg et en Sarre, vérifiées par Radio Tripoint.`,
    chemin: `/annonces/${c.slug}`,
    noindex: Object.keys(sp).length > 0,
  })
}

export default async function PageCategorie(props: PageProps<"/[lang]/annonces/[categorie]">) {
  const { categorie: slug } = await props.params
  const c = await categorie(slug)
  if (!c) notFound()
  const sp = await props.searchParams
  const filtres = { ...lireFiltres(sp), categorie: c.slug }
  const page = Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1
  const [tout, cfg, compte] = await Promise.all([
    annoncesPubliques(),
    configPublique(),
    compteConnecte(),
  ])
  const liste = tout.filter((a) => a.categorie === c.slug)
  const une = aLaUneCategorie(liste, c.slug).slice(0, 8)

  return (
    <>
      <NavAnnonces connecte={compte?.nom ?? null} />
      <header className={cn(teinte(c.slug))}>
        <div className="conteneur pt-6 pb-8 sm:pt-8">
          <Breadcrumbs
            elements={[
              { nom: "Petites annonces", chemin: "/annonces" },
              { nom: c.nom, chemin: `/annonces/${c.slug}` },
            ]}
            sombre={c.slug !== "emploi"}
          />
          <div className="mt-6 flex items-center gap-3">
            <IconeCategorie slug={c.slug} className="size-9 flex-none" strokeWidth={1.7} />
            <h1 className="titre-page text-[clamp(2.3rem,1.4rem+4.5vw,5rem)]">{c.nom}</h1>
          </div>
          <p className="mt-2 max-w-2xl text-[1.02rem] opacity-90">{c.accroche}</p>
          <div className="mt-5 max-w-4xl">
            <BarreRecherche
              q={filtres.q}
              lieu={filtres.lieu}
              action={`/annonces/${c.slug}`}
              sombre
            />
          </div>
        </div>
      </header>

      {une.length > 0 && (
        <section aria-labelledby="t-une" className="conteneur pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="t-une" className="titre-carte text-xl">
              À la une
            </h2>
            <p className="text-encre-3 text-xs">Annonces mises en avant par leurs annonceurs</p>
          </div>
          <ul className="mt-4 flex snap-x gap-4 overflow-x-auto pb-3">
            {une.map((a) => (
              <li key={a.id} className="w-[14rem] flex-none snap-start">
                <CarteAnnonce a={a} grande />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="conteneur py-8 lg:py-12">
        <Resultats
          liste={liste}
          filtres={filtres}
          base={`/annonces/${c.slug}`}
          page={page}
          categories={categoriesOuvertes(cfg)}
          categorieFixe={c.slug}
        />
      </div>
    </>
  )
}
