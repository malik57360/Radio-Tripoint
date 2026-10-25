import { Building2, CalendarClock, ExternalLink, MapPin, Phone } from "lucide-react"
import { notFound, permanentRedirect } from "next/navigation"
import { FormulaireContact, Signalement } from "@/components/annonces/Interactions"
import {
  BadgeMiseEnAvant,
  BadgePro,
  CarteAnnonce,
  Drapeau,
  EncadreArnaques,
  NavAnnonces,
  dateLongue,
  IconeCategorie,
  prixAffiche,
  teinte,
} from "@/components/annonces/Vitrine"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { EtatVide } from "@/components/ui/EtatVide"
import Link from "@/components/ui/Lien"
import { ShareButtons } from "@/components/ui/ShareButtons"
import { annoncePublique, annoncesPubliques, lireAnnonce } from "@/lib/annonces/annonces"
import { PAYS, defCategorie } from "@/lib/annonces/categories"
import { compteConnecte } from "@/lib/annonces/comptes"
import { configPublique, nomCategorie } from "@/lib/annonces/config"
import { trier } from "@/lib/annonces/recherche"
import { metaAnnonces } from "@/lib/annonces/seo"
import { cheminAnnonce, idDuSlug, misEnAvant } from "@/lib/annonces/types"
import { urlAbsolue } from "@/lib/seo/metadata"
import { cn } from "@/lib/utils/cn"

/** Fiche d'une annonce. Le contact passe par le site : l'adresse de l'annonceur reste privée. */

type Props = PageProps<"/[lang]/annonces/[categorie]/[slug]">

async function charger(props: Props) {
  const { categorie, slug } = await props.params
  const id = idDuSlug(slug)
  return { categorie, slug, a: id ? await annoncePublique(id) : null, id }
}

export async function generateMetadata(props: Props) {
  const { a } = await charger(props)
  if (!a) return { title: "Annonce indisponible", robots: { index: false, follow: true } }
  const p = prixAffiche(a)
  const photo = a.photos[0]
  return metaAnnonces({
    titre: `${a.titre}${p ? ` — ${p}` : ""} · ${a.ville}`,
    description: a.description.slice(0, 160),
    chemin: cheminAnnonce(a),
    ...(photo
      ? { image: { src: photo.url, alt: a.titre, largeur: photo.l, hauteur: photo.h } }
      : {}),
  })
}

export default async function PageAnnonce(props: Props) {
  const { categorie, slug, a, id } = await charger(props)
  if (!a) {
    // Annonce connue mais plus en ligne : on le dit, plutôt qu'une page introuvable.
    const ancienne = id ? await lireAnnonce(id) : null
    if (!ancienne) notFound()
    return (
      <div className="conteneur py-14">
        <EtatVide
          titre="Cette annonce n'est plus en ligne"
          actions={
            <Link href={`/annonces/${ancienne.categorie}`} className="btn btn-plein">
              Voir les annonces de la catégorie
            </Link>
          }
        >
          Elle a expiré, a été retirée par son annonceur, ou attend une vérification.
        </EtatVide>
      </div>
    )
  }
  if (a.categorie !== categorie || a.slug !== slug) permanentRedirect(cheminAnnonce(a))

  const [cfg, compte, toutes] = await Promise.all([
    configPublique(),
    compteConnecte(),
    annoncesPubliques(),
  ])
  const def = defCategorie(a.categorie)
  const nomCat = nomCategorie(cfg, a.categorie)
  const prix = prixAffiche(a)
  const details = (def?.champs ?? [])
    .filter((c) => a.details[c.cle] && c.cle !== "salaire")
    .map((c) => [
      c.libelle,
      c.type === "nombre"
        ? `${Number(a.details[c.cle]).toLocaleString("fr-FR")}${c.unite ? ` ${c.unite}` : ""}`
        : a.details[c.cle],
    ])
  const proches = trier(
    toutes.filter((x) => x.categorie === a.categorie && x.id !== a.id),
    "recent",
  ).slice(0, 4)
  const chemin = cheminAnnonce(a)

  return (
    <>
      <NavAnnonces connecte={compte?.nom ?? null} />
      <div className="conteneur pt-5 sm:pt-7">
        <Breadcrumbs
          elements={[
            { nom: "Petites annonces", chemin: "/annonces" },
            { nom: nomCat, chemin: `/annonces/${a.categorie}` },
            { nom: a.titre, chemin },
          ]}
        />
      </div>
      <article className="conteneur grid gap-8 pt-5 pb-14 lg:grid-cols-[1.4fr_1fr] lg:gap-12 lg:pt-8">
        <div className="min-w-0">
          {a.photos.length ? (
            <div>
              <ul
                className="-mx-4 flex snap-x snap-mandatory overflow-x-auto sm:mx-0 sm:rounded-xl"
                aria-label="Photos"
              >
                {a.photos.map((p, i) => (
                  <li
                    key={p.url}
                    id={`photo-${i + 1}`}
                    className="bg-papier-2 w-full flex-none snap-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- déjà réduite dans le navigateur */}
                    <img
                      src={p.url}
                      alt={i === 0 ? a.titre : `${a.titre}, photo ${i + 1}`}
                      width={p.l}
                      height={p.h}
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : undefined}
                      className="mx-auto max-h-[70vh] w-full object-contain"
                    />
                  </li>
                ))}
              </ul>
              {a.photos.length > 1 && (
                <ul className="mt-2 flex gap-2 overflow-x-auto" aria-label="Aller à la photo">
                  {a.photos.map((p, i) => (
                    <li key={p.vignette} className="flex-none">
                      <a
                        href={`#photo-${i + 1}`}
                        aria-label={`Photo ${i + 1}`}
                        className="block size-16 overflow-hidden rounded-md"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- vignette */}
                        <img
                          src={p.vignette}
                          alt=""
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "grid aspect-[16/9] place-items-center rounded-xl",
                teinte(a.categorie),
              )}
            >
              <IconeCategorie slug={a.categorie} className="size-16 opacity-90" strokeWidth={1.5} />
            </div>
          )}

          <p className="mt-5 flex flex-wrap items-center gap-2">
            <Link href={`/annonces/${a.categorie}`} className="badge">
              {nomCat}
            </Link>
            {misEnAvant(a) && <BadgeMiseEnAvant />}
            {a.annonceur === "pro" ? (
              <BadgePro />
            ) : (
              <span className="text-encre-3 text-[0.8rem] font-semibold">Particulier</span>
            )}
          </p>
          <h1 className="titre-carte mt-3 text-[clamp(1.7rem,1.2rem+2vw,2.6rem)] leading-[1.08]">
            {a.titre}
          </h1>
          {prix && <p className="mt-2 text-[1.7rem] font-extrabold">{prix}</p>}
          <p className="text-encre-2 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.92rem]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden />
              <strong>
                {a.ville} ({a.codePostal})
              </strong>
              <Drapeau pays={a.pays} />
              {PAYS[a.pays]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="size-4" aria-hidden />
              Publiée le {dateLongue(a.publieeLe)}
            </span>
          </p>

          <h2 className="titre-carte mt-8 text-xl">Description</h2>
          <p className="presse mt-2 text-[1.12rem] leading-relaxed whitespace-pre-line">
            {a.description}
          </p>

          {details.length > 0 && (
            <>
              <h2 className="titre-carte mt-8 text-xl">En détail</h2>
              <dl className="border-trait mt-2 divide-y border-y">
                {details.map(([k, v]) => (
                  <div
                    key={k}
                    className="divide-trait grid grid-cols-[minmax(8rem,40%)_1fr] gap-4 py-2.5 text-[0.95rem]"
                  >
                    <dt className="text-encre-3 font-semibold">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          {a.pro && (
            <section
              aria-labelledby="t-pro"
              className="border-trait bg-papier-2/60 mt-8 rounded-xl border p-4"
            >
              <h2 id="t-pro" className="flex items-center gap-2 font-extrabold">
                <Building2 className="size-5" aria-hidden />
                Annonce d&apos;un professionnel
              </h2>
              <p className="mt-2 font-bold">{a.pro.raisonSociale}</p>
              <p className="text-encre-2 text-sm">
                {a.pro.ville} · {PAYS[a.pro.pays]} ·{" "}
                {a.pro.pays === "FR" ? "SIRET" : "N° d'immatriculation"} {a.pro.identifiant}
              </p>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {a.pro.telephone && (
                  <a
                    href={`tel:${a.pro.telephone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex items-center gap-1.5 font-semibold underline"
                  >
                    <Phone className="size-4" aria-hidden />
                    {a.pro.telephone}
                  </a>
                )}
                {a.pro.site && (
                  <a
                    href={a.pro.site}
                    target="_blank"
                    rel="noopener nofollow ugc"
                    className="inline-flex items-center gap-1.5 font-semibold underline"
                  >
                    Site de l&apos;entreprise
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                )}
              </p>
            </section>
          )}
          <div className="mt-8">
            <ShareButtons url={urlAbsolue(chemin)} titre={a.titre} />
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="border-trait-fort rounded-xl border-2 p-5">
            <p className="text-lg font-extrabold">
              Contacter {a.annonceur === "pro" ? "l'entreprise" : a.nom}
            </p>
            <div className="mt-3">
              <FormulaireContact
                annonce={a.id}
                connecte={Boolean(compte)}
                verifie={Boolean(compte?.emailVerifie)}
                chemin={chemin}
              />
            </div>
          </div>
          <EncadreArnaques />
          <Signalement annonce={a.id} connecte={Boolean(compte)} />
        </aside>
      </article>

      {proches.length > 0 && (
        <section className="conteneur pb-16" aria-labelledby="t-proches">
          <h2 id="t-proches" className="titre-section text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">
            Dans la même catégorie
          </h2>
          <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {proches.map((x) => (
              <li key={x.id} className="border-trait border-t pt-5">
                <CarteAnnonce a={x} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
