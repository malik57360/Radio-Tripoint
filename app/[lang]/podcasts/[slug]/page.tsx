import { ArrowRight } from "lucide-react"
import Link from "@/components/ui/Lien"
import { notFound } from "next/navigation"
import { PodcastCard } from "@/components/podcasts/PodcastCard"
import { BoutonEpisode } from "@/components/radio/BoutonEpisode"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { JsonLd } from "@/components/ui/JsonLd"
import { ShareButtons } from "@/components/ui/ShareButtons"
import { Visuel } from "@/components/ui/Visuel"
import { emissionParSlug } from "@/lib/contenu/emissions"
import { episodeParSlug, listerEpisodes } from "@/lib/contenu/podcasts"
import { langue, traducteur } from "@/lib/i18n/serveur"
import { jsonLdEpisode } from "@/lib/seo/jsonld"
import { metadataPage, urlAbsolue } from "@/lib/seo/metadata"
import { dateLongue, duree } from "@/lib/utils/dates"

export async function generateStaticParams() {
  return (await listerEpisodes()).map((e) => ({ slug: e.slug }))
}

export async function generateMetadata(props: PageProps<"/[lang]/podcasts/[slug]">) {
  const { slug } = await props.params
  const l = await langue()
  const ep = await episodeParSlug(slug, l)
  if (!ep) return { title: "404" }
  const emission = ep.emission ? await emissionParSlug(ep.emission, l) : null
  return metadataPage({
    titre: emission ? `${ep.titre} — ${emission.nom}` : ep.titre,
    description: ep.description,
    chemin: `/podcasts/${ep.slug}`,
    noindex: ep.demo,
  })
}

export default async function PageEpisode(props: PageProps<"/[lang]/podcasts/[slug]">) {
  const { slug } = await props.params
  const t = await traducteur()
  const l = t.langue
  const ep = await episodeParSlug(slug, l)
  if (!ep) notFound()
  const emission = ep.emission ? await emissionParSlug(ep.emission, l) : null
  const autres = (
    await listerEpisodes(
      emission ? { emission: emission.slug, langue: l } : { theme: ep.theme, langue: l },
    )
  )
    .filter((x) => x.slug !== ep.slug)
    .slice(0, 5)

  return (
    <>
      <JsonLd data={jsonLdEpisode(ep, emission, l)} />
      <div className="conteneur pt-6 sm:pt-8">
        <Breadcrumbs
          elements={[
            { nom: "Podcasts", chemin: "/podcasts" },
            { nom: ep.titre, chemin: `/podcasts/${ep.slug}` },
          ]}
        />
      </div>
      <article className="conteneur grid gap-10 pt-10 pb-16 md:grid-cols-[minmax(0,22rem)_1fr] md:items-start lg:gap-16 lg:pt-14">
        <Visuel
          visuel={ep.visuel}
          repli={{
            mot: emission?.nom ?? "Replay",
            surmot: "Radio Tripoint",
            teinte: emission?.teinte ?? "nuit",
          }}
          ratio="aspect-square"
          sizes="(min-width: 768px) 352px, 100vw"
          preload
        />
        <div>
          <p className="flex flex-wrap items-center gap-3">
            {emission ? (
              <Link href={`/emissions/${emission.slug}`} className="badge hover:underline">
                {emission.nom}
              </Link>
            ) : (
              <span className="badge">Podcast</span>
            )}
            {ep.demo && (
              <span className="badge-exemple">
                {t({ fr: "Exemple", de: "Beispiel", lb: "Beispill", en: "Example", es: "Ejemplo" })}
              </span>
            )}
          </p>
          <h1 className="titre-affiche mt-4 text-[clamp(2rem,1.2rem+3vw,3.6rem)] !leading-[1.02]">
            {ep.titre}
          </h1>
          <p className="text-encre-3 mt-4 text-sm">
            {ep.publieLe && (
              <>
                <time dateTime={ep.publieLe}>{dateLongue(ep.publieLe, l)}</time> ·{" "}
              </>
            )}
            {duree(ep.duree)}
          </p>
          <div className="mt-8">
            <BoutonEpisode
              variante="grand"
              episode={{
                slug: ep.slug,
                titre: ep.titre,
                audioUrl: ep.audioUrl,
                sousTitre: emission?.nom,
                duree: ep.duree,
              }}
            />
          </div>
          <p className="presse text-encre-2 mt-8 max-w-2xl text-[1.2rem] leading-relaxed">
            {ep.description}
          </p>
          <div className="border-trait mt-10 border-t pt-6">
            <ShareButtons url={urlAbsolue(t.lien(`/podcasts/${ep.slug}`))} titre={ep.titre} />
          </div>
        </div>
      </article>
      {autres.length > 0 && (
        <section aria-labelledby="titre-autres-ep" className="conteneur pb-20">
          <div className="filet-section flex flex-wrap items-end justify-between gap-4 pt-5">
            <h2 id="titre-autres-ep" className="titre-section">
              {emission
                ? `${t({ fr: "Autres épisodes de", de: "Weitere Folgen von", lb: "Aner Episode vun", en: "More episodes of", es: "Otros episodios de" })} ${emission.nom}`
                : t({
                    fr: "À écouter aussi",
                    de: "Auch hörenswert",
                    lb: "Och ze lauschteren",
                    en: "Also worth a listen",
                    es: "Para escuchar también",
                  })}
            </h2>
            <Link href="/podcasts" className="lien-fleche hover:text-accent-encre">
              {t({
                fr: "Tous les podcasts",
                de: "Alle Podcasts",
                lb: "All Podcasts",
                en: "All podcasts",
                es: "Todos los pódcasts",
              })}{" "}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="divide-trait border-trait mt-6 divide-y border-b">
            {autres.map((x) => (
              <li key={x.slug}>
                <PodcastCard episode={x} emissionNom={emission?.nom} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
