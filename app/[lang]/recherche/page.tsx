import { Search } from "lucide-react"
import Link from "@/components/ui/Lien"
import { EtatVide } from "@/components/ui/EtatVide"
import { PageHero } from "@/components/ui/PageHero"
import { libellesTypes, rechercher, type TypeResultat } from "@/lib/contenu/recherche"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export async function generateMetadata(props: PageProps<"/[lang]/recherche">) {
  const { q } = await props.searchParams
  const terme = typeof q === "string" ? q.slice(0, 100) : ""
  return metadataPage({
    titre: terme
      ? {
          fr: `Recherche : ${terme}`,
          de: `Suche: ${terme}`,
          lb: `Sich: ${terme}`,
          en: `Search: ${terme}`,
          es: `Búsqueda: ${terme}`,
        }
      : { fr: "Recherche", de: "Suche", lb: "Sich", en: "Search", es: "Búsqueda" },
    description: {
      fr: "Rechercher dans les articles, émissions, podcasts et événements de Radio Tripoint.",
      de: "Artikel, Sendungen, Podcasts und Veranstaltungen von Radio Tripoint durchsuchen.",
      lb: "An den Artikelen, Sendungen, Podcasts an Evenementer vu Radio Tripoint sichen.",
      en: "Search Radio Tripoint's articles, programmes, podcasts and events.",
      es: "Buscar en los artículos, programas, pódcasts y eventos de Radio Tripoint.",
    },
    chemin: "/recherche",
    noindex: true,
  })
}

const ordre: TypeResultat[] = ["article", "emission", "podcast", "evenement"]

export default async function PageRecherche(props: PageProps<"/[lang]/recherche">) {
  const { q } = await props.searchParams
  const terme = typeof q === "string" ? q.slice(0, 100).trim() : ""
  const t = await traducteur()
  const resultats = terme ? await rechercher(terme, 40, t.langue) : []
  const groupes = ordre
    .map((type) => ({ type, liste: resultats.filter((r) => r.type === type) }))
    .filter((g) => g.liste.length)

  return (
    <>
      <PageHero
        miettes={[
          {
            nom: t({ fr: "Recherche", de: "Suche", lb: "Sich", en: "Search", es: "Búsqueda" }),
            chemin: "/recherche",
          },
        ]}
        titre={
          terme ? (
            <>« {terme} »</>
          ) : (
            t({ fr: "Rechercher", de: "Suchen", lb: "Sichen", en: "Search", es: "Buscar" })
          )
        }
        enfants={
          <form role="search" action={t.lien("/recherche")} className="relative mt-8 max-w-2xl">
            <label htmlFor="q-page" className="sr-only">
              {t({ fr: "Rechercher", de: "Suchen", lb: "Sichen", en: "Search", es: "Buscar" })}
            </label>
            <Search
              className="text-encre-3 pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
              aria-hidden
            />
            <input
              id="q-page"
              name="q"
              type="search"
              defaultValue={terme}
              placeholder={t({
                fr: "Article, émission, podcast, ville…",
                de: "Artikel, Sendung, Podcast, Ort…",
                lb: "Artikel, Sendung, Podcast, Uertschaft…",
                en: "Article, programme, podcast, town…",
                es: "Artículo, programa, pódcast, localidad…",
              })}
              className="champ !min-h-14 pl-12 text-lg"
            />
          </form>
        }
      />
      <div className="conteneur py-12 lg:py-16">
        {!terme ? (
          <p className="text-encre-2">
            {t({
              fr: "Saisissez un mot-clé : un nom de ville, d'émission, un sujet.",
              de: "Geben Sie ein Stichwort ein: einen Ort, eine Sendung, ein Thema.",
              lb: "Gitt e Stéchwuert an: eng Uertschaft, eng Sendung, en Thema.",
              en: "Enter a keyword: a town, a programme, a topic.",
              es: "Escriba una palabra clave: un nombre de localidad, de programa, un tema.",
            })}
          </p>
        ) : resultats.length === 0 ? (
          <EtatVide
            titre={`${t({ fr: "Aucun résultat pour", de: "Keine Ergebnisse für", lb: "Keng Resultater fir", en: "No results for", es: "Ningún resultado para" })} « ${terme} ».`}
            actions={
              <>
                <Link href="/actualites" className="btn btn-trait">
                  {t({
                    fr: "Parcourir les actualités",
                    de: "Nachrichten durchsuchen",
                    lb: "Duerch d'Neiegkeete bliederen",
                    en: "Browse the news",
                    es: "Ver las noticias",
                  })}
                </Link>
                <Link href="/emissions" className="btn btn-trait">
                  {t({
                    fr: "Voir les émissions",
                    de: "Sendungen ansehen",
                    lb: "Sendunge kucken",
                    en: "See the programmes",
                    es: "Ver los programas",
                  })}
                </Link>
              </>
            }
          >
            {t({
              fr: "Vérifiez l'orthographe ou essayez un terme plus général.",
              de: "Prüfen Sie die Schreibweise oder versuchen Sie einen allgemeineren Begriff.",
              lb: "Kontrolléiert d'Schreifweis oder probéiert en allgemengere Begrëff.",
              en: "Check the spelling or try a more general term.",
              es: "Compruebe la ortografía o pruebe con un término más general.",
            })}
          </EtatVide>
        ) : (
          <>
            <p role="status" className="surtitre text-encre-3">
              {resultats.length}{" "}
              {resultats.length > 1
                ? t({
                    fr: "résultats",
                    de: "Ergebnisse",
                    lb: "Resultater",
                    en: "results",
                    es: "resultados",
                  })
                : t({
                    fr: "résultat",
                    de: "Ergebnis",
                    lb: "Resultat",
                    en: "result",
                    es: "resultado",
                  })}
            </p>
            <div className="mt-8 space-y-14">
              {groupes.map((g) => (
                <section key={g.type} aria-labelledby={`g-${g.type}`}>
                  <h2 id={`g-${g.type}`} className="surtitre border-trait-fort border-t-2 pt-3">
                    {t(libellesTypes[g.type])} · {g.liste.length}
                  </h2>
                  <ul className="divide-trait mt-2 divide-y">
                    {g.liste.map((r) => (
                      <li key={r.href}>
                        <Link href={r.href} className="group block py-5">
                          <span className="titre-carte group-hover:text-accent-encre block text-[1.2rem]">
                            {r.titre}
                          </span>
                          <span className="text-encre-3 mt-1 block text-sm">{r.contexte}</span>
                          {r.extrait && (
                            <span className="text-encre-2 mt-2 line-clamp-2 block">
                              {r.extrait}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
