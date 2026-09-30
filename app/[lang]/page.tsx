import { ArrowRight, Mic } from "lucide-react"
import Link from "@/components/ui/Lien"
import { Hero } from "@/components/accueil/Hero"
import { Newsletter } from "@/components/accueil/Newsletter"
import { Professionnels } from "@/components/accueil/Professionnels"
import { EventCard } from "@/components/events/EventCard"
import { FeaturedArticle } from "@/components/news/FeaturedArticle"
import { NewsCardLigne } from "@/components/news/NewsCard"
import { NewsGrid } from "@/components/news/NewsGrid"
import { PodcastCard } from "@/components/podcasts/PodcastCard"
import { BoutonDirect } from "@/components/radio/BoutonDirect"
import { ShowCard } from "@/components/shows/ShowCard"
import { SectionTerritoire } from "@/components/territoire/SectionTerritoire"
import { EnTeteSection } from "@/components/ui/EnTeteSection"
import { EtatVide } from "@/components/ui/EtatVide"
import { une } from "@/lib/contenu/articles"
import { listerEmissions } from "@/lib/contenu/emissions"
import { listerEvenements } from "@/lib/contenu/evenements"
import { listerEpisodes } from "@/lib/contenu/podcasts"
import { traducteur } from "@/lib/i18n/serveur"
import { versGrille } from "@/lib/radio/types"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Radio Tripoint — Radio transfrontalière France, Luxembourg, Allemagne",
      de: "Radio Tripoint — Grenzüberschreitendes Radio Frankreich, Luxemburg, Deutschland",
      lb: "Radio Tripoint — Grenziwwerschreidende Radio Frankräich, Lëtzebuerg, Däitschland",
    },
    absolu: true,
    description: {
      fr: "Écoutez Radio Tripoint en direct depuis Sierck-les-Bains : actualités des Trois Frontières, émissions, podcasts et agenda entre Moselle, Luxembourg et Sarre.",
      de: "Hören Sie Radio Tripoint live aus Sierck-les-Bains: Nachrichten aus dem Dreiländereck, Sendungen, Podcasts und Veranstaltungen zwischen Mosel, Luxemburg und Saarland.",
      lb: "Lauschtert Radio Tripoint live vu Sierck-les-Bains: Neiegkeeten aus dem Dräilännereck, Sendungen, Podcasts an Agenda tëscht Musel, Lëtzebuerg a Saarland.",
    },
    chemin: "/",
  })

// Agenda et « à la une » dépendent de la date : régénération horaire.
export const revalidate = 3600

export default async function Accueil() {
  const t = await traducteur()
  const l = t.langue
  const [{ principal, secondaires, suite }, emissions, episodes, evenements] = await Promise.all([
    une(l),
    listerEmissions(l),
    listerEpisodes({ langue: l }),
    listerEvenements({ langue: l }),
  ])
  const nomEmission = new Map(emissions.map((e) => [e.slug, e.nom]))

  return (
    <>
      <Hero grille={versGrille(emissions)} />

      {/* ─── À la une ─── */}
      <section aria-labelledby="titre-une" className="conteneur pt-14 lg:pt-20">
        <EnTeteSection
          id="titre-une"
          surtitre={t({
            fr: "L'info du territoire",
            de: "Nachrichten aus der Region",
            lb: "D'Neiegkeeten aus der Regioun",
          })}
          titre={t({ fr: "À la une", de: "Top-Themen", lb: "Op der Une" })}
          lien={{
            href: "/actualites",
            libelle: t({
              fr: "Toutes les actualités",
              de: "Alle Nachrichten",
              lb: "All Neiegkeeten",
            }),
          }}
        />
        {principal ? (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-12">
            <FeaturedArticle article={principal} preload />
            {secondaires.length > 0 && (
              <ul className="divide-trait lg:border-trait flex flex-col divide-y lg:border-l lg:pl-10">
                {secondaires.map((a) => (
                  <li key={a.slug} className="py-6 first:pt-0 last:pb-0">
                    <NewsCardLigne article={a} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <EtatVide
            className="mt-8"
            titre={t({
              fr: "La rédaction prépare ses premiers articles.",
              de: "Die Redaktion bereitet ihre ersten Artikel vor.",
              lb: "D'Redaktioun preparéiert hir éischt Artikelen.",
            })}
            actions={
              <>
                <BoutonDirect />
                <Link href="/soumettre-une-information" className="btn btn-trait">
                  {t({
                    fr: "Proposer une information",
                    de: "Information vorschlagen",
                    lb: "Informatioun proposéieren",
                  })}
                </Link>
              </>
            }
          >
            {t({
              fr: "En attendant, l'actualité des Trois Frontières se vit à l'antenne. Une info à partager ? Écrivez à la rédaction.",
              de: "Bis dahin erleben Sie die Nachrichten aus dem Dreiländereck im Radio. Eine Info zu teilen? Schreiben Sie der Redaktion.",
              lb: "Bis dohin lieft Dir d'Neiegkeeten aus dem Dräilännereck um Radio. Eng Info ze deelen? Schreift der Redaktioun.",
            })}
          </EtatVide>
        )}
      </section>

      {/* ─── Dernières actualités ─── */}
      {suite.length > 0 && (
        <section aria-labelledby="titre-dernieres" className="conteneur pt-16 lg:pt-24">
          <EnTeteSection
            id="titre-dernieres"
            surtitre={t({ fr: "En continu", de: "Laufend", lb: "Lafend" })}
            titre={t({
              fr: "Les dernières actualités",
              de: "Die neuesten Nachrichten",
              lb: "Déi lescht Neiegkeeten",
            })}
            lien={{
              href: "/actualites",
              libelle: t({ fr: "Voir tout", de: "Alle ansehen", lb: "Alles kucken" }),
            }}
          />
          <div className="mt-8">
            <NewsGrid articles={suite} />
          </div>
        </section>
      )}

      {/* ─── Émissions ─── */}
      <section aria-labelledby="titre-emissions" className="pt-16 lg:pt-24">
        <div className="conteneur">
          <EnTeteSection
            id="titre-emissions"
            surtitre={t({ fr: "À l'antenne", de: "Auf Sendung", lb: "Um Sender" })}
            titre={t({ fr: "Nos émissions", de: "Unsere Sendungen", lb: "Eis Sendungen" })}
            lien={{
              href: "/emissions",
              libelle: t({ fr: "Toutes les émissions", de: "Alle Sendungen", lb: "All Sendungen" }),
            }}
          />
        </div>
        <ul className="rail conteneur mt-8 !gap-4 pb-2 sm:!grid sm:grid-cols-2 sm:!overflow-visible lg:grid-cols-3">
          {emissions.map((e) => (
            <li key={e.slug} className="xs:w-[70%] w-[82%] flex-none sm:w-auto">
              <ShowCard emission={e} />
            </li>
          ))}
        </ul>
      </section>

      {/* ─── Podcasts ─── */}
      <section aria-labelledby="titre-podcasts" className="conteneur pt-16 lg:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-14">
          <div>
            <EnTeteSection
              id="titre-podcasts"
              surtitre={t({ fr: "Replays", de: "Wiederholungen", lb: "Replays" })}
              titre={t({
                fr: "Podcasts & replays",
                de: "Podcasts & Wiederholungen",
                lb: "Podcasts & Replays",
              })}
            />
            <p className="presse text-encre-2 mt-4 text-lg leading-snug">
              {t({
                fr: "Une émission manquée ? Retrouvez-la ici et écoutez-la quand vous voulez, sans quitter la page.",
                de: "Eine Sendung verpasst? Hier finden Sie sie wieder und hören sie, wann Sie wollen – ohne die Seite zu verlassen.",
                lb: "Eng Sendung verpasst? Hei fannt Dir se erëm a lauschtert se, wann Dir wëllt – ouni d'Säit ze verloossen.",
              })}
            </p>
            <Link href="/podcasts" className="lien-fleche hover:text-accent-encre mt-6">
              {t({ fr: "Tous les épisodes", de: "Alle Folgen", lb: "All Episoden" })}{" "}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          {episodes.length > 0 ? (
            <ul className="divide-trait border-trait divide-y border-y">
              {episodes.slice(0, 4).map((ep) => (
                <li key={ep.slug}>
                  <PodcastCard
                    episode={ep}
                    emissionNom={ep.emission ? nomEmission.get(ep.emission) : undefined}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EtatVide
              titre={t({
                fr: "Les premiers replays arrivent bientôt.",
                de: "Die ersten Wiederholungen folgen in Kürze.",
                lb: "Déi éischt Replays kommen geschwënn.",
              })}
              actions={<BoutonDirect />}
            >
              {t({
                fr: "Les émissions de Radio Tripoint seront disponibles en podcast sur cette page. D'ici là, écoutez-les en direct.",
                de: "Die Sendungen von Radio Tripoint werden auf dieser Seite als Podcast verfügbar sein. Bis dahin hören Sie sie live.",
                lb: "D'Sendunge vu Radio Tripoint wäerten op dëser Säit als Podcast disponibel sinn. Bis dohin lauschtert se live.",
              })}
            </EtatVide>
          )}
        </div>
      </section>

      <div className="pt-16 lg:pt-24">
        <SectionTerritoire />
      </div>

      {/* ─── Agenda ─── */}
      <section aria-labelledby="titre-agenda" className="conteneur pt-16 lg:pt-24">
        <EnTeteSection
          id="titre-agenda"
          surtitre={t({ fr: "Sortir", de: "Ausgehen", lb: "Erausgoen" })}
          titre={t({
            fr: "L'agenda des Trois Frontières",
            de: "Veranstaltungen im Dreiländereck",
            lb: "D'Agenda vum Dräilännereck",
          })}
          lien={{
            href: "/agenda",
            libelle: t({ fr: "Tout l'agenda", de: "Alle Termine", lb: "D'ganz Agenda" }),
          }}
        />
        {evenements.length > 0 ? (
          <ul className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {evenements.slice(0, 4).map((e) => (
              <li key={e.slug}>
                <EventCard evenement={e} />
              </li>
            ))}
          </ul>
        ) : (
          <EtatVide
            className="mt-8"
            titre={t({
              fr: "Aucun événement annoncé pour le moment.",
              de: "Derzeit sind keine Veranstaltungen angekündigt.",
              lb: "Am Moment sinn keng Evenementer ugekënnegt.",
            })}
            actions={
              <Link href="/soumettre-une-information" className="btn btn-plein">
                <Mic className="size-4" aria-hidden />{" "}
                {t({
                  fr: "Annoncer un événement",
                  de: "Veranstaltung melden",
                  lb: "Evenement mellen",
                })}
              </Link>
            }
          >
            {t({
              fr: "Vous organisez un concert, une fête de village, une exposition ou un match ? Faites-le savoir : Radio Tripoint relaie les rendez-vous du territoire.",
              de: "Sie organisieren ein Konzert, ein Dorffest, eine Ausstellung oder ein Spiel? Sagen Sie es uns: Radio Tripoint macht die Termine der Region bekannt.",
              lb: "Dir organiséiert e Concert, eng Duerffest, eng Ausstellung oder e Match? Sot et eis: Radio Tripoint mécht d'Rendez-vousen aus der Regioun bekannt.",
            })}
          </EtatVide>
        )}
      </section>

      <Professionnels />
      <Newsletter />
    </>
  )
}
