import { ArrowRight, Plus } from "lucide-react"
import {
  BarreRecherche,
  CarteAnnonce,
  EncadreArnaques,
  NavAnnonces,
  IconeCategorie,
  teinte,
} from "@/components/annonces/Vitrine"
import { Resultats } from "@/components/annonces/Resultats"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import Link from "@/components/ui/Lien"
import { annoncesPubliques } from "@/lib/annonces/annonces"
import { compteConnecte } from "@/lib/annonces/comptes"
import { categoriesOuvertes, configPublique } from "@/lib/annonces/config"
import { aLaUneAccueil, lireFiltres, trier } from "@/lib/annonces/recherche"
import { metaAnnonces } from "@/lib/annonces/seo"
import { cn } from "@/lib/utils/cn"

/**
 * Accueil des Petites annonces : recherche, catégories, annonces mises en
 * avant et dernières annonces. Avec des critères dans l'adresse, la même
 * page affiche les résultats.
 */
export async function generateMetadata(props: PageProps<"/[lang]/annonces">) {
  const sp = await props.searchParams
  const recherche = Object.keys(sp).some((k) => k !== "page")
  return metaAnnonces({
    titre: "Petites annonces des Trois Frontières",
    description:
      "Les petites annonces de Radio Tripoint : auto, maison, emploi, services… en France, au Luxembourg et en Allemagne. Chaque annonce est vérifiée avant de paraître.",
    chemin: "/annonces",
    // Les pages de résultats ne s'indexent pas : seules l'accueil et les catégories.
    noindex: recherche,
  })
}

export default async function PageAnnonces(props: PageProps<"/[lang]/annonces">) {
  const sp = await props.searchParams
  const filtres = lireFiltres(sp)
  const page = Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1
  const [liste, cfg, compte] = await Promise.all([
    annoncesPubliques(),
    configPublique(),
    compteConnecte(),
  ])
  const categories = categoriesOuvertes(cfg)
  const enRecherche = Boolean(
    filtres.q ||
    filtres.lieu ||
    filtres.categorie ||
    filtres.pays ||
    filtres.prixMin !== undefined ||
    filtres.prixMax !== undefined ||
    filtres.etat ||
    filtres.annonceur ||
    filtres.tri !== "recent" ||
    page > 1 ||
    sp.voir === "tout",
  )
  const nom = (slug: string) => categories.find((c) => c.slug === slug)?.nom
  const une = aLaUneAccueil(liste).slice(0, 8)
  const recentes = trier(liste, "recent").slice(0, 12)

  return (
    <>
      <NavAnnonces connecte={compte?.nom ?? null} />
      <header className="bg-nuit text-nuit-encre">
        <div className="conteneur pt-6 pb-8 sm:pt-8 lg:pb-12">
          <Breadcrumbs elements={[{ nom: "Petites annonces", chemin: "/annonces" }]} sombre />
          <p className="surtitre text-nuit-accent mt-7">Les Petites Annonces du Tripoint</p>
          <h1 className="titre-page mt-2 text-[clamp(2.4rem,1.4rem+5vw,5.5rem)]">
            Achetez, vendez, recrutez près de chez vous
          </h1>
          <p className="text-nuit-encre-2 mt-3 max-w-2xl text-[1.05rem] leading-snug">
            En France, au Luxembourg et en Allemagne. Chaque annonce est relue par l&apos;équipe de
            Radio Tripoint avant de paraître.
          </p>
          <div className="mt-6 max-w-4xl">
            <BarreRecherche q={filtres.q} lieu={filtres.lieu} sombre />
          </div>
        </div>
      </header>

      {compte === null && sp.compte === "supprime" && (
        <p
          className="conteneur bg-papier-2 mt-4 rounded-lg p-3 text-sm font-semibold"
          role="status"
        >
          Votre compte est supprimé. Merci d&apos;avoir utilisé les Petites annonces.
        </p>
      )}

      {enRecherche ? (
        <div className="conteneur py-8 lg:py-12">
          <Resultats
            liste={liste}
            filtres={filtres}
            base="/annonces"
            page={page}
            categories={categories}
          />
        </div>
      ) : (
        <>
          <section aria-labelledby="t-categories" className="conteneur pt-8 lg:pt-12">
            <h2 id="t-categories" className="sr-only">
              Catégories
            </h2>
            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((c) => {
                const n = liste.filter((a) => a.categorie === c.slug).length
                return (
                  <li key={c.slug}>
                    <Link
                      href={`/annonces/${c.slug}`}
                      className={cn(
                        "flex h-full min-h-[7.5rem] flex-col rounded-lg p-3.5 transition-transform hover:-translate-y-0.5",
                        teinte(c.slug),
                      )}
                    >
                      <IconeCategorie slug={c.slug} className="size-6" strokeWidth={1.8} />
                      <span className="mt-2.5 text-[1rem] leading-tight font-extrabold">
                        {c.nom}
                      </span>
                      <span className="mt-1 line-clamp-2 text-[0.75rem] leading-snug opacity-80">
                        {c.accroche}
                      </span>
                      <span className="mt-auto pt-2 text-[0.75rem] font-bold opacity-90">
                        {n} annonce{n > 1 ? "s" : ""}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>

          {une.length > 0 && (
            <section aria-labelledby="t-une" className="conteneur pt-10 lg:pt-14">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="t-une" className="titre-section text-[clamp(1.8rem,1.2rem+2vw,2.8rem)]">
                  À la une
                </h2>
                <p className="text-encre-3 text-xs">Annonces mises en avant par leurs annonceurs</p>
              </div>
              <ul className="mt-5 flex snap-x gap-4 overflow-x-auto pb-3">
                {une.map((a) => (
                  <li key={a.id} className="w-[15rem] flex-none snap-start">
                    <CarteAnnonce a={a} categorie={nom(a.categorie)} grande />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="conteneur grid gap-10 py-10 lg:grid-cols-[1fr_20rem] lg:gap-14 lg:py-14">
            <section aria-labelledby="t-recentes">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2
                  id="t-recentes"
                  className="titre-section text-[clamp(1.8rem,1.2rem+2vw,2.8rem)]"
                >
                  Dernières annonces
                </h2>
                {liste.length > recentes.length && (
                  <Link href="/annonces?voir=tout" className="lien-fleche text-sm">
                    Toutes les annonces
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                )}
              </div>
              {recentes.length ? (
                <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {recentes.map((a) => (
                    <li key={a.id} className="border-trait border-t pt-5">
                      <CarteAnnonce a={a} categorie={nom(a.categorie)} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="border-trait-fort mt-5 rounded-xl border-2 border-dashed p-6">
                  <p className="titre-carte text-xl">
                    La rubrique ouvre : soyez parmi les premiers !
                  </p>
                  <p className="text-encre-2 mt-2">
                    Déposez votre annonce en deux minutes : elle sera vue des deux côtés de la
                    frontière.
                  </p>
                  <Link href="/annonces/deposer" className="btn btn-plein mt-4">
                    <Plus className="size-4" aria-hidden />
                    Déposer une annonce
                  </Link>
                </div>
              )}
            </section>
            <div className="space-y-6">
              <Link href="/annonces/deposer" className="btn btn-accent min-h-12 w-full text-base">
                <Plus className="size-5" aria-hidden />
                Déposer une annonce
              </Link>
              <EncadreArnaques />
              <aside className="bg-nuit text-nuit-encre rounded-lg p-5">
                <p className="text-nuit-accent surtitre">Professionnels</p>
                <p className="mt-2 text-lg leading-snug font-extrabold">
                  Vendez et recrutez dans les Trois Frontières
                </p>
                <p className="text-nuit-encre-2 mt-2 text-[0.93rem]">
                  Annonces pro avec vos coordonnées, le lien de votre site et des mises en avant.
                </p>
                <Link
                  href="/annonces/inscription"
                  className="btn bg-accent text-sur-accent mt-4 hover:brightness-95"
                >
                  Créer un compte pro
                </Link>
              </aside>
              <p className="text-encre-3 text-sm">
                <Link href="/annonces/regles" className="underline">
                  Règles et aide
                </Link>{" "}
                ·{" "}
                <Link href="/annonces/conditions" className="underline">
                  Conditions
                </Link>
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}
