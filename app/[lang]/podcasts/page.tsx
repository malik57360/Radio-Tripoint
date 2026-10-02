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
import { EmplacementPub } from "@/components/pub/EmplacementPub"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Podcasts & replays",
      de: "Podcasts & Wiederholungen",
      lb: "Podcasts & Replays",
      en: "Podcasts & replays",
      es: "Pódcasts y programas a la carta",
    },
    description: {
      fr: "Réécoutez les émissions de Radio Tripoint en podcast : actualités, culture, musique, sport et émissions des Trois Frontières.",
      de: "Hören Sie die Sendungen von Radio Tripoint als Podcast: Nachrichten, Kultur, Musik, Sport und Sendungen aus dem Dreiländereck.",
      lb: "Lauschtert d'Sendunge vu Radio Tripoint als Podcast: Neiegkeeten, Kultur, Musek, Sport a Sendungen aus dem Dräilännereck.",
      en: "Listen again to Radio Tripoint's programmes as podcasts: news, culture, music, sport and programmes from the Three Borders.",
      es: "Vuelva a escuchar los programas de Radio Tripoint en pódcast: noticias, cultura, música, deporte y programas de las Tres Fronteras.",
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
              en: "Podcasts & replays",
              es: "Pódcasts y programas a la carta",
            }),
            chemin: "/podcasts",
          },
        ]}
        surtitre={tr({
          fr: "À la demande",
          de: "Auf Abruf",
          lb: "Op Ufro",
          en: "On demand",
          es: "A la carta",
        })}
        titre={tr({
          fr: "Podcasts & replays",
          de: "Podcasts & Wiederholungen",
          lb: "Podcasts & Replays",
          en: "Podcasts & replays",
          es: "Pódcasts y programas a la carta",
        })}
        intro={tr({
          fr: "Une émission manquée, un reportage à réécouter : tout Radio Tripoint, quand vous voulez. La lecture continue pendant que vous naviguez.",
          de: "Eine verpasste Sendung, eine Reportage zum Nachhören: ganz Radio Tripoint, wann Sie wollen. Die Wiedergabe läuft weiter, während Sie surfen.",
          lb: "Eng verpasst Sendung, eng Reportage fir nach eng Kéier ze lauschteren: ganz Radio Tripoint, wann Dir wëllt. D'Ofspillen leeft weider, während Dir surft.",
          en: "A missed programme, a report to listen to again: all of Radio Tripoint, whenever you like. Playback continues while you browse.",
          es: "Un programa que se perdió, un reportaje para volver a escuchar: todo Radio Tripoint, cuando quiera. La reproducción continúa mientras navega.",
        })}
        enfants={
          tous.length > 0 && (
            <div className="mt-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <Filtres
                label={tr({ fr: "Thèmes", de: "Themen", lb: "Themen", en: "Topics", es: "Temas" })}
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
                  {tr({
                    fr: "Rechercher un épisode",
                    de: "Folge suchen",
                    lb: "Episod sichen",
                    en: "Search for an episode",
                    es: "Buscar un episodio",
                  })}
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
                    en: "Search for an episode…",
                    es: "Buscar un episodio…",
                  })}
                  className="champ !min-h-11 pl-10"
                />
              </form>
            </div>
          )
        }
      />
      <EmplacementPub id="podcasts" className="conteneur pt-10 lg:pt-12" />
      <section
        aria-label={tr({
          fr: "Épisodes",
          de: "Folgen",
          lb: "Episoden",
          en: "Episodes",
          es: "Episodios",
        })}
        className="conteneur py-12 lg:py-16"
      >
        {tous.length === 0 ? (
          <EtatVide
            titre={tr({
              fr: "Les premiers replays arrivent bientôt.",
              de: "Die ersten Wiederholungen folgen in Kürze.",
              lb: "Déi éischt Replays kommen geschwënn.",
              en: "The first replays are coming soon.",
              es: "Los primeros programas a la carta llegarán pronto.",
            })}
            actions={<BoutonDirect />}
          >
            {tr({
              fr: "Les émissions de Radio Tripoint seront publiées ici en podcast après leur diffusion. D'ici là, rendez-vous sur le direct.",
              de: "Die Sendungen von Radio Tripoint werden hier nach der Ausstrahlung als Podcast veröffentlicht. Bis dahin: live hören.",
              lb: "D'Sendunge vu Radio Tripoint ginn hei no der Iwwerdroung als Podcast publizéiert. Bis dohin: live lauschteren.",
              en: "Radio Tripoint's programmes will be published here as podcasts after they are broadcast. Until then, tune in live.",
              es: "Los programas de Radio Tripoint se publicarán aquí en pódcast después de su emisión. Mientras tanto, cita en el directo.",
            })}
          </EtatVide>
        ) : episodes.length === 0 ? (
          <EtatVide
            titre={tr({
              fr: "Aucun épisode ne correspond.",
              de: "Keine passende Folge.",
              lb: "Keng Episod passt.",
              en: "No episodes match.",
              es: "Ningún episodio coincide.",
            })}
            actions={
              <Link href="/podcasts" className="btn btn-trait">
                {tr({
                  fr: "Voir tous les épisodes",
                  de: "Alle Folgen ansehen",
                  lb: "All Episode kucken",
                  en: "See all episodes",
                  es: "Ver todos los episodios",
                })}
              </Link>
            }
          >
            {tr({
              fr: "Essayez un autre thème ou un autre mot-clé.",
              de: "Versuchen Sie ein anderes Thema oder Stichwort.",
              lb: "Probéiert en anert Thema oder Stéchwuert.",
              en: "Try another topic or another keyword.",
              es: "Pruebe con otro tema u otra palabra clave.",
            })}
          </EtatVide>
        ) : (
          <>
            <p className="surtitre text-encre-3" role="status">
              {episodes.length}{" "}
              {episodes.length > 1
                ? tr({
                    fr: "épisodes",
                    de: "Folgen",
                    lb: "Episoden",
                    en: "episodes",
                    es: "episodios",
                  })
                : tr({ fr: "épisode", de: "Folge", lb: "Episod", en: "episode", es: "episodio" })}
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
