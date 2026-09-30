import { ArrowRight, CalendarClock, Clock } from "lucide-react"
import Link from "@/components/ui/Lien"
import { notFound } from "next/navigation"
import { IconeReseau } from "@/components/marque/IconesReseaux"
import { Tripoint } from "@/components/marque/Tripoint"
import { NewsCard } from "@/components/news/NewsCard"
import { PodcastCard } from "@/components/podcasts/PodcastCard"
import { BoutonDirect } from "@/components/radio/BoutonDirect"
import { ShowCard } from "@/components/shows/ShowCard"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Couverture } from "@/components/ui/Couverture"
import { EtatVide } from "@/components/ui/EtatVide"
import { JsonLd } from "@/components/ui/JsonLd"
import { emissions as emissionsDeclarees } from "@/data/shows"
import { listerArticles } from "@/lib/contenu/articles"
import { emissionParSlug, listerEmissions } from "@/lib/contenu/emissions"
import { listerEpisodes } from "@/lib/contenu/podcasts"
import { langue, traducteur } from "@/lib/i18n/serveur"
import { libelleCreneaux, libelleHeure, nomJour, programmeSuivant } from "@/lib/radio/grille"
import { radioConfig } from "@/config/radioConfig"
import { jsonLdEmission } from "@/lib/seo/jsonld"
import { metadataPage } from "@/lib/seo/metadata"
import Image from "next/image"

export function generateStaticParams() {
  return emissionsDeclarees.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata(props: PageProps<"/[lang]/emissions/[slug]">) {
  const { slug } = await props.params
  const l = await langue()
  const e = await emissionParSlug(slug, l)
  if (!e) return { title: "404" }
  return metadataPage({
    titre: {
      fr: `${e.nom} — émission de Radio Tripoint`,
      de: `${e.nom} — Sendung von Radio Tripoint`,
      lb: `${e.nom} — Sendung vu Radio Tripoint`,
    },
    description: e.accroche
      ? {
          fr: `${e.nom} : ${e.accroche} Une émission à écouter sur Radio Tripoint, la radio des Trois Frontières.`,
          de: `${e.nom}: ${e.accroche} Eine Sendung auf Radio Tripoint, dem Radio des Dreiländerecks.`,
          lb: `${e.nom}: ${e.accroche} Eng Sendung op Radio Tripoint, dem Radio vum Dräilännereck.`,
        }
      : {
          fr: `${e.nom}, une émission de Radio Tripoint (${e.thematique.toLowerCase()}), à écouter en direct et en replay.`,
          de: `${e.nom}, eine Sendung von Radio Tripoint (${e.thematique}), live und als Wiederholung.`,
          lb: `${e.nom}, eng Sendung vu Radio Tripoint (${e.thematique}), live an als Replay.`,
        },
    chemin: `/emissions/${e.slug}`,
    image: e.visuel ? { src: e.visuel.src, alt: e.visuel.alt } : undefined,
  })
}

export default async function PageEmission(props: PageProps<"/[lang]/emissions/[slug]">) {
  const { slug } = await props.params
  const t = await traducteur()
  const l = t.langue
  const e = await emissionParSlug(slug, l)
  if (!e) notFound()
  const [episodes, toutes, articles] = await Promise.all([
    listerEpisodes({ emission: e.slug, langue: l }),
    listerEmissions(l),
    e.categorie
      ? listerArticles({ categorie: e.categorie, parPage: 3, langue: l })
      : Promise.resolve(null),
  ])
  const horaires = libelleCreneaux(e.creneaux, l)
  // « Prochain épisode » calculé au rendu (page régénérée toutes les 10 min).
  const prochain = e.creneaux.length
    ? programmeSuivant([e], new Date(), radioConfig.timeZone)
    : null
  const autres = toutes.filter((x) => x.slug !== e.slug).slice(0, 3)
  const reseaux = Object.entries(e.reseaux ?? {}).filter(([, url]) => url) as [
    keyof NonNullable<typeof e.reseaux>,
    string,
  ][]

  return (
    <>
      <JsonLd data={jsonLdEmission(e, l)} />
      <header className="bg-nuit text-nuit-encre relative isolate overflow-hidden">
        <div className="conteneur pt-6 sm:pt-8">
          <Breadcrumbs
            sombre
            elements={[
              {
                nom: t({ fr: "Émissions", de: "Sendungen", lb: "Sendungen" }),
                chemin: "/emissions",
              },
              { nom: e.nom, chemin: `/emissions/${e.slug}` },
            ]}
          />
        </div>
        <div className="conteneur grid gap-10 pt-10 pb-14 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:pt-14 lg:pb-20">
          <div className="entree">
            <p className="surtitre text-nuit-accent">{e.thematique}</p>
            <h1 className="titre-affiche mt-4 text-[clamp(2.6rem,1.2rem+6vw,6rem)]">{e.nom}</h1>
            {e.accroche && (
              <p className="presse text-nuit-encre-2 mt-5 max-w-xl text-[1.35rem] leading-snug sm:text-[1.55rem]">
                {e.accroche}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <BoutonDirect taille="grand" />
              {episodes.length > 0 && (
                <a href="#episodes" className="btn btn-nuit min-h-14 !px-6">
                  {t({ fr: "Derniers épisodes", de: "Neueste Folgen", lb: "Lescht Episoden" })}
                </a>
              )}
            </div>
          </div>
          <div className="entree-2 relative aspect-square w-full max-w-md justify-self-end overflow-hidden lg:max-w-none">
            {e.visuel ? (
              <Image
                src={e.visuel.src}
                alt={e.visuel.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                preload
                className="object-cover"
              />
            ) : (
              <Couverture mot={e.nom} surmot="Radio Tripoint" teinte={e.teinte} taille="grand" />
            )}
          </div>
        </div>
        <Tripoint
          className="text-nuit-trait pointer-events-none absolute -top-40 -left-40 -z-10 size-[40rem]"
          epaisseur={1}
          point={false}
        />
      </header>

      <div className="conteneur grid gap-14 py-14 lg:grid-cols-[2fr_1fr] lg:py-20">
        <section aria-labelledby="titre-presentation">
          <h2 id="titre-presentation" className="surtitre border-trait-fort border-t-2 pt-3">
            {t({ fr: "Présentation", de: "Vorstellung", lb: "Presentatioun" })}
          </h2>
          {e.presentation ? (
            <div className="prose-article mt-6">
              {e.presentation.split(/\n{2,}/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : (
            <p className="presse text-encre-2 mt-6 text-[1.25rem] leading-snug">
              {t({
                fr: "La présentation détaillée de cette émission sera publiée prochainement. En attendant, retrouvez-la à l'antenne de Radio Tripoint.",
                de: "Die ausführliche Vorstellung dieser Sendung folgt in Kürze. Bis dahin hören Sie sie auf Radio Tripoint.",
                lb: "Déi detailléiert Presentatioun vun dëser Sendung kënnt geschwënn. Bis dohin fannt Dir se op Radio Tripoint.",
              })}
            </p>
          )}
          {e.animateurs && e.animateurs.length > 0 && (
            <p className="text-encre-2 mt-8">
              <span className="surtitre text-encre-3 mr-2">
                {t({ fr: "Au micro", de: "Am Mikrofon", lb: "Um Mikro" })}
              </span>
              {e.animateurs.join(", ")}
            </p>
          )}
        </section>

        <aside className="flex flex-col gap-6">
          <section aria-labelledby="titre-quand" className="border-trait bg-surface border p-6">
            <h2 id="titre-quand" className="surtitre flex items-center gap-2">
              <Clock className="size-4" aria-hidden />{" "}
              {t({ fr: "Quand écouter ?", de: "Wann hören?", lb: "Wéini lauschteren?" })}
            </h2>
            {horaires.length ? (
              <ul className="mt-4 space-y-1.5 font-semibold">
                {horaires.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            ) : (
              <p className="text-encre-2 mt-4">
                {t({
                  fr: "Horaires à venir. L'émission est diffusée sur le direct de Radio Tripoint.",
                  de: "Sendezeiten folgen. Die Sendung läuft im Livestream von Radio Tripoint.",
                  lb: "Sendezäite kommen. D'Sendung leeft am Live-Stream vu Radio Tripoint.",
                })}
              </p>
            )}
          </section>
          {prochain && (
            <section
              aria-labelledby="titre-prochain"
              className="border-trait bg-surface border p-6"
            >
              <h2 id="titre-prochain" className="surtitre flex items-center gap-2">
                <CalendarClock className="size-4" aria-hidden />{" "}
                {t({
                  fr: "Prochain rendez-vous",
                  de: "Nächster Termin",
                  lb: "Nächste Rendez-vous",
                })}
              </h2>
              <p className="titre-carte mt-3 text-xl capitalize">
                {nomJour(prochain.creneau.jour, l)} · {libelleHeure(prochain.creneau.debut, l)}
              </p>
            </section>
          )}
          {reseaux.length > 0 && (
            <section aria-labelledby="titre-reseaux" className="border-trait bg-surface border p-6">
              <h2 id="titre-reseaux" className="surtitre">
                {t({
                  fr: "Suivre l'émission",
                  de: "Der Sendung folgen",
                  lb: "D'Sendung verfollegen",
                })}
              </h2>
              <ul className="mt-4 flex gap-2">
                {reseaux.map(([r, url]) => (
                  <li key={r}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener"
                      aria-label={r}
                      className="border-trait hover:border-encre grid size-11 place-items-center rounded-full border"
                    >
                      <IconeReseau reseau={r} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      <section id="episodes" aria-labelledby="titre-episodes" className="conteneur scroll-mt-24">
        <div className="filet-section pt-5">
          <h2 id="titre-episodes" className="titre-section">
            {t({ fr: "Derniers épisodes", de: "Neueste Folgen", lb: "Lescht Episoden" })}
          </h2>
        </div>
        {episodes.length ? (
          <ul className="divide-trait border-trait mt-6 divide-y border-b">
            {episodes.slice(0, 8).map((ep) => (
              <li key={ep.slug}>
                <PodcastCard episode={ep} emissionNom={e.nom} />
              </li>
            ))}
          </ul>
        ) : (
          <EtatVide
            className="mt-8"
            titre={t({
              fr: "Les replays de cette émission arrivent bientôt.",
              de: "Die Wiederholungen dieser Sendung folgen in Kürze.",
              lb: "D'Replays vun dëser Sendung kommen geschwënn.",
            })}
            actions={<BoutonDirect />}
          >
            {t({
              fr: "Les épisodes seront disponibles ici en podcast après leur diffusion.",
              de: "Die Folgen sind hier nach der Ausstrahlung als Podcast verfügbar.",
              lb: "D'Episode sinn hei no der Iwwerdroung als Podcast disponibel.",
            })}
          </EtatVide>
        )}
      </section>

      {articles && articles.elements.length > 0 && (
        <section aria-labelledby="titre-articles" className="conteneur mt-20">
          <div className="filet-section pt-5">
            <h2 id="titre-articles" className="titre-section">
              {t({ fr: "Articles associés", de: "Passende Artikel", lb: "Passend Artikelen" })}
            </h2>
          </div>
          <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {articles.elements.map((a) => (
              <li key={a.slug}>
                <NewsCard article={a} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="titre-autres" className="conteneur mt-20 pb-20">
        <div className="filet-section flex flex-wrap items-end justify-between gap-4 pt-5">
          <h2 id="titre-autres" className="titre-section">
            {t({ fr: "Autres émissions", de: "Weitere Sendungen", lb: "Aner Sendungen" })}
          </h2>
          <Link href="/emissions" className="lien-fleche hover:text-accent-encre">
            {t({ fr: "Toutes les émissions", de: "Alle Sendungen", lb: "All Sendungen" })}{" "}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {autres.map((x) => (
            <li key={x.slug}>
              <ShowCard emission={x} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export const revalidate = 600
