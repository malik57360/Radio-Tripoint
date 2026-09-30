import { Search } from "lucide-react"
import Link from "@/components/ui/Lien"
import { PodcastCard } from "@/components/podcasts/PodcastCard"
import { BoutonDirect } from "@/components/radio/BoutonDirect"
import { EtatVide } from "@/components/ui/EtatVide"
import { Filtres } from "@/components/ui/Filtres"
import { PageHero } from "@/components/ui/PageHero"
import { listerEmissions } from "@/lib/contenu/emissions"
import { listerEpisodes, themesPodcast } from "@/lib/contenu/podcasts"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: { fr: "Podcasts & replays", de: "Podcasts & Wiederholungen", lb: "Podcasts & Replays" },
    description: {
      fr: "Réécoutez les émissions de Radio Tripoint en podcast : actualités, culture, musique, sport et émissions des Trois Frontières.",
      de: "Hören Sie die Sendungen von Radio Tripoint als Podcast: Nachrichten, Kultur, Musik, Sport und Sendungen aus dem Dreiländereck.",
      lb: "Lauschtert d'Sendunge vu Radio Tripoint als Podcast: Neiegkeeten, Kultur, Musek, Sport a Sendungen aus dem Dräilännereck.",
    },
    chemin: "/podcasts",
  })

export default async function PagePodcasts(props: PageProps<"/[lang]/podcasts">) {
  const sp = await props.searchParams
  const tr = await traducteur()
  const l = tr.langue
  const theme =
    typeof sp.theme === "string" && themesPodcast.some((x) => x.valeur === sp.theme)
      ? sp.theme
      : "toutes"
  const q = typeof sp.q === "string" ? sp.q.slice(0, 100) : ""
  const [episodes, emissions, tous] = await Promise.all([
    listerEpisodes({ theme, q, langue: l }),
    listerEmissions(l),
    listerEpisodes({ langue: l }),
  ])
  const nom = new Map(emissions.map((e) => [e.slug, e.nom]))
  const href = (t: string) => {
    const p = new URLSearchParams()
    if (t !== "toutes") p.set("theme", t)
    if (q) p.set("q", q)
    const s = p.toString()
    return s ? `/podcasts?${s}` : "/podcasts"
  }

  return (
    <>
      <PageHero
        miettes={[
          {
            nom: tr({
              fr: "Podcasts & replays",
              de: "Podcasts & Wiederholungen",
              lb: "Podcasts & Replays",
            }),
            chemin: "/podcasts",
          },
        ]}
        surtitre={tr({ fr: "À la demande", de: "Auf Abruf", lb: "Op Ufro" })}
        titre={tr({
          fr: "Podcasts & replays",
          de: "Podcasts & Wiederholungen",
          lb: "Podcasts & Replays",
        })}
        intro={tr({
          fr: "Une émission manquée, un reportage à réécouter : tout Radio Tripoint, quand vous voulez. La lecture continue pendant que vous naviguez.",
          de: "Eine verpasste Sendung, eine Reportage zum Nachhören: ganz Radio Tripoint, wann Sie wollen. Die Wiedergabe läuft weiter, während Sie surfen.",
          lb: "Eng verpasst Sendung, eng Reportage fir nach eng Kéier ze lauschteren: ganz Radio Tripoint, wann Dir wëllt. D'Ofspillen leeft weider, während Dir surft.",
        })}
        enfants={
          tous.length > 0 && (
            <div className="mt-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <Filtres
                label={tr({ fr: "Thèmes", de: "Themen", lb: "Themen" })}
                options={themesPodcast.map((x) => ({ valeur: x.valeur, libelle: tr(x.libelle) }))}
                actif={theme}
                href={href}
              />
              <form
                role="search"
                action={tr.lien("/podcasts")}
                className="relative w-full flex-none sm:max-w-sm xl:w-72"
              >
                {theme !== "toutes" && <input type="hidden" name="theme" value={theme} />}
                <label htmlFor="q-podcasts" className="sr-only">
                  {tr({ fr: "Rechercher un épisode", de: "Folge suchen", lb: "Episod sichen" })}
                </label>
                <Search
                  className="text-encre-3 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
                  aria-hidden
                />
                <input
                  id="q-podcasts"
                  name="q"
                  type="search"
                  defaultValue={q}
                  placeholder={tr({
                    fr: "Rechercher un épisode…",
                    de: "Folge suchen…",
                    lb: "Episod sichen…",
                  })}
                  className="champ !min-h-11 pl-10"
                />
              </form>
            </div>
          )
        }
      />
      <section
        aria-label={tr({ fr: "Épisodes", de: "Folgen", lb: "Episoden" })}
        className="conteneur py-12 lg:py-16"
      >
        {tous.length === 0 ? (
          <EtatVide
            titre={tr({
              fr: "Les premiers replays arrivent bientôt.",
              de: "Die ersten Wiederholungen folgen in Kürze.",
              lb: "Déi éischt Replays kommen geschwënn.",
            })}
            actions={<BoutonDirect />}
          >
            {tr({
              fr: "Les émissions de Radio Tripoint seront publiées ici en podcast après leur diffusion. D'ici là, rendez-vous sur le direct.",
              de: "Die Sendungen von Radio Tripoint werden hier nach der Ausstrahlung als Podcast veröffentlicht. Bis dahin: live hören.",
              lb: "D'Sendunge vu Radio Tripoint ginn hei no der Iwwerdroung als Podcast publizéiert. Bis dohin: live lauschteren.",
            })}
          </EtatVide>
        ) : episodes.length === 0 ? (
          <EtatVide
            titre={tr({
              fr: "Aucun épisode ne correspond.",
              de: "Keine passende Folge.",
              lb: "Keng Episod passt.",
            })}
            actions={
              <Link href="/podcasts" className="btn btn-trait">
                {tr({
                  fr: "Voir tous les épisodes",
                  de: "Alle Folgen ansehen",
                  lb: "All Episode kucken",
                })}
              </Link>
            }
          >
            {tr({
              fr: "Essayez un autre thème ou un autre mot-clé.",
              de: "Versuchen Sie ein anderes Thema oder Stichwort.",
              lb: "Probéiert en anert Thema oder Stéchwuert.",
            })}
          </EtatVide>
        ) : (
          <>
            <p className="surtitre text-encre-3" role="status">
              {episodes.length}{" "}
              {episodes.length > 1
                ? tr({ fr: "épisodes", de: "Folgen", lb: "Episoden" })
                : tr({ fr: "épisode", de: "Folge", lb: "Episod" })}
            </p>
            <ul className="divide-trait border-trait mt-4 divide-y border-y">
              {episodes.map((ep) => (
                <li key={ep.slug}>
                  <PodcastCard
                    episode={ep}
                    emissionNom={ep.emission ? nom.get(ep.emission) : undefined}
                    titreNiveau="h2"
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  )
}
