import { Search } from "lucide-react"
import Link from "@/components/ui/Lien"
import { BoutonDirect } from "@/components/radio/BoutonDirect"
import { EtatVide } from "@/components/ui/EtatVide"
import { PageHero } from "@/components/ui/PageHero"
import { Pagination } from "@/components/ui/Pagination"
import { listerArticles } from "@/lib/contenu/articles"
import { categoriesLangue } from "@/lib/contenu/localiser"
import { traducteur } from "@/lib/i18n/serveur"
import type { CategorieSlug } from "@/types/category"
import { CategoryNav } from "./CategoryNav"
import { FeaturedArticle } from "./FeaturedArticle"
import { NewsGrid } from "./NewsGrid"

/** Gabarit commun à toutes les rubriques : une, grille, recherche, pagination. */
export async function CategoryPage({
  slug,
  searchParams,
}: {
  slug: CategorieSlug
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === "string" ? sp.q.slice(0, 100) : undefined
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1)
  const t = await traducteur()
  const cat = categoriesLangue(t.langue)[slug]
  const {
    elements,
    pages,
    page: p,
    total,
  } = await listerArticles({
    categorie: slug,
    q,
    page,
    langue: t.langue,
  })
  const avecUne = p === 1 && !q && elements.length > 0
  const [premier, ...reste] = elements

  return (
    <>
      <PageHero
        miettes={[{ nom: cat.nom, chemin: cat.chemin }]}
        surtitre={
          slug === "actualites"
            ? t({
                fr: "Trois Frontières · Moselle · Luxembourg · Sarre",
                de: "Dreiländereck · Mosel · Luxemburg · Saarland",
                lb: "Dräilännereck · Musel · Lëtzebuerg · Saarland",
              })
            : t({ fr: "Rubrique", de: "Rubrik", lb: "Rubrik" })
        }
        titre={cat.nom}
        intro={cat.accroche}
        enfants={
          <div className="mt-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <CategoryNav active={slug} />
            <form
              role="search"
              action={t.lien(cat.chemin)}
              className="relative w-full flex-none sm:max-w-sm xl:w-72"
            >
              <label htmlFor="q-rubrique" className="sr-only">
                {t({ fr: "Rechercher dans", de: "Suchen in", lb: "Sichen an" })} {cat.nom}
              </label>
              <Search
                className="text-encre-3 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
                aria-hidden
              />
              <input
                id="q-rubrique"
                name="q"
                type="search"
                defaultValue={q}
                placeholder={`${t({ fr: "Rechercher dans", de: "Suchen in", lb: "Sichen an" })} ${cat.court}…`}
                className="champ !min-h-11 pl-10"
              />
            </form>
          </div>
        }
      />

      <div className="conteneur py-12 lg:py-16">
        {q && (
          <p className="text-encre-2 mb-8" role="status">
            {total}{" "}
            {total > 1
              ? t({ fr: "résultats pour", de: "Ergebnisse für", lb: "Resultater fir" })
              : t({ fr: "résultat pour", de: "Ergebnis für", lb: "Resultat fir" })}{" "}
            « <strong className="text-encre">{q}</strong> » ·{" "}
            <Link href={cat.chemin} className="lien">
              {t({ fr: "effacer", de: "löschen", lb: "läschen" })}
            </Link>
          </p>
        )}
        {elements.length === 0 ? (
          q ? (
            <EtatVide
              titre={t({
                fr: "Aucun article ne correspond à votre recherche.",
                de: "Kein Artikel entspricht Ihrer Suche.",
                lb: "Keen Artikel entsprécht Ärer Sich.",
              })}
              actions={
                <Link href={`/recherche?q=${encodeURIComponent(q)}`} className="btn btn-trait">
                  {t({
                    fr: "Chercher sur tout le site",
                    de: "Auf der ganzen Website suchen",
                    lb: "Um ganze Site sichen",
                  })}
                </Link>
              }
            >
              {t({
                fr: "Essayez un autre mot, un nom de commune ou d'émission.",
                de: "Versuchen Sie ein anderes Wort, einen Ortsnamen oder eine Sendung.",
                lb: "Probéiert en anert Wuert, en Uertschafts- oder Sendungsnumm.",
              })}
            </EtatVide>
          ) : (
            <EtatVide
              titre={`${t({ fr: "Pas encore d'article dans", de: "Noch keine Artikel in", lb: "Nach keen Artikel an" })} « ${cat.nom} ».`}
              actions={
                <>
                  <Link href="/soumettre-une-information" className="btn btn-plein">
                    {t({
                      fr: "Proposer une information",
                      de: "Information vorschlagen",
                      lb: "Informatioun proposéieren",
                    })}
                  </Link>
                  <BoutonDirect />
                </>
              }
            >
              {cat.description}{" "}
              {t({
                fr: "Les premiers articles de cette rubrique arrivent bientôt.",
                de: "Die ersten Artikel dieser Rubrik folgen in Kürze.",
                lb: "Déi éischt Artikele vun dëser Rubrik kommen geschwënn.",
              })}
            </EtatVide>
          )
        ) : (
          <>
            {avecUne && premier && (
              <div className="border-trait mb-14 border-b pb-14">
                <h2 className="sr-only">
                  {t({
                    fr: "À la une de la rubrique",
                    de: "Aufmacher der Rubrik",
                    lb: "Haaptartikel vun der Rubrik",
                  })}
                </h2>
                <FeaturedArticle article={premier} preload />
              </div>
            )}
            <h2 className="sr-only">
              {avecUne
                ? t({ fr: "Derniers articles", de: "Neueste Artikel", lb: "Lescht Artikelen" })
                : t({ fr: "Articles", de: "Artikel", lb: "Artikelen" })}
            </h2>
            <NewsGrid articles={avecUne ? reste : elements} />
            <Pagination page={p} pages={pages} base={cat.chemin} params={{ q }} />
          </>
        )}
      </div>
    </>
  )
}
