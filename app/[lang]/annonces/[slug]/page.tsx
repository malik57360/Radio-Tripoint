import { CalendarClock, Flag, MapPin, Send } from "lucide-react"
import { notFound } from "next/navigation"
import {
  BadgeExemple,
  BandeauMaquette,
  CarteAnnonce,
  Drapeau,
  EncadreArnaques,
  Vignette,
} from "@/components/annonces/Annonces"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { ANNONCES, CATEGORIES, PAYS, annonceParSlug } from "@/lib/annonces/exemples"
import { metadataPage } from "@/lib/seo/metadata"

/** MAQUETTE — une annonce. Le contact passe par un formulaire : l'adresse de l'annonceur reste cachée. */

export function generateStaticParams() {
  return ANNONCES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata(props: PageProps<"/[lang]/annonces/[slug]">) {
  const a = annonceParSlug((await props.params).slug)
  if (!a) return { title: "404" }
  return metadataPage({
    titre: `${a.titre} — ${a.ville} (maquette)`,
    description: a.description,
    chemin: `/annonces/${a.slug}`,
    noindex: true,
  })
}

const dateLongue = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${iso}T12:00:00`),
  )
const plus30 = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

export default async function PageAnnonce(props: PageProps<"/[lang]/annonces/[slug]">) {
  const a = annonceParSlug((await props.params).slug)
  if (!a) notFound()
  const autres = ANNONCES.filter((x) => x.categorie === a.categorie && x.slug !== a.slug).slice(
    0,
    2,
  )

  return (
    <>
      <BandeauMaquette />
      <div className="conteneur pt-6 sm:pt-8">
        <Breadcrumbs
          elements={[
            { nom: "Annonces", chemin: "/annonces" },
            { nom: CATEGORIES[a.categorie].nom, chemin: `/annonces?rubrique=${a.categorie}` },
            { nom: a.titre, chemin: `/annonces/${a.slug}` },
          ]}
        />
      </div>
      <article className="conteneur grid gap-10 pt-8 pb-16 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:pt-12">
        <div>
          <Vignette categorie={a.categorie} grande />
          <p className="mt-6 flex flex-wrap items-center gap-2">
            <span className="badge">{CATEGORIES[a.categorie].nom}</span>
            {a.pro ? (
              <span className="border-trait-fort rounded-sm border px-1.5 py-px text-[0.72rem] font-bold">
                PROFESSIONNEL
              </span>
            ) : (
              <span className="text-encre-3 text-[0.8rem] font-semibold">Particulier</span>
            )}
            <BadgeExemple />
          </p>
          <h1 className="titre-affiche mt-3 text-[clamp(1.9rem,1.2rem+2.6vw,3.2rem)] !leading-[1.04]">
            {a.titre}
          </h1>
          {a.prix && <p className="mt-3 text-[1.6rem] font-extrabold">{a.prix}</p>}
          <p className="text-encre-2 mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden />
              <strong>{a.ville}</strong>
              <Drapeau pays={a.pays} />
              {PAYS[a.pays]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="size-4" aria-hidden />
              Publiée le {dateLongue(a.publieeLe)} · en ligne jusqu’au{" "}
              {dateLongue(plus30(a.publieeLe))}
            </span>
          </p>

          <h2 className="titre-section mt-10 text-[1.4rem]">Description</h2>
          <p className="presse mt-3 text-[1.15rem] leading-relaxed">{a.description}</p>

          <h2 className="titre-section mt-10 text-[1.4rem]">En détail</h2>
          <dl className="border-trait mt-3 divide-y border-y">
            {a.details.map(([k, v]) => (
              <div
                key={k}
                className="divide-trait grid grid-cols-[10rem_1fr] gap-4 py-2.5 text-[0.95rem]"
              >
                <dt className="text-encre-3 font-semibold">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <form className="border-trait-fort rounded-lg border-2 p-5">
            <p className="text-lg font-extrabold">Contacter l’annonceur</p>
            <p className="text-encre-3 mt-1 text-[0.85rem]">
              Votre message lui est transmis par Radio Tripoint : son adresse reste privée, et la
              vôtre aussi jusqu’à sa réponse.
            </p>
            <label className="mt-4 block text-sm font-semibold" htmlFor="nom">
              Votre prénom
            </label>
            <input id="nom" className="champ mt-1 w-full" disabled placeholder="Prénom" />
            <label className="mt-3 block text-sm font-semibold" htmlFor="mail">
              Votre e-mail
            </label>
            <input id="mail" className="champ mt-1 w-full" disabled placeholder="vous@exemple.fr" />
            <label className="mt-3 block text-sm font-semibold" htmlFor="msg">
              Message
            </label>
            <textarea
              id="msg"
              rows={4}
              className="champ mt-1 w-full"
              disabled
              placeholder="Bonjour, votre annonce m'intéresse…"
            />
            <button
              type="button"
              disabled
              className="btn btn-plein mt-4 w-full justify-center opacity-70"
            >
              <Send className="size-4" aria-hidden />
              Envoyer (maquette)
            </button>
          </form>
          <EncadreArnaques />
          <button
            type="button"
            className="text-encre-3 inline-flex items-center gap-2 text-sm underline underline-offset-2"
          >
            <Flag className="size-4" aria-hidden />
            Signaler cette annonce
          </button>
        </aside>
      </article>

      {autres.length > 0 && (
        <section className="conteneur pb-16" aria-label="Annonces proches">
          <h2 className="titre-section">Dans la même rubrique</h2>
          <ul className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {autres.map((x) => (
              <li key={x.slug}>
                <CarteAnnonce a={x} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
