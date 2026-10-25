import { Plus } from "lucide-react"
import { HeroTripoint } from "@/components/annonces/Hero"
import {
  BarreRecherche,
  EncadreArnaques,
  GrilleAnnonces,
  IconeCategorie,
  teinte,
} from "@/components/annonces/Vitrine"
import { Resultats } from "@/components/annonces/Resultats"
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
export async function generateMetadata(props: PageProps<"/petites-annonces">) {
  const sp = await props.searchParams
  const recherche = Object.keys(sp).some((k) => k !== "page")
  return metaAnnonces({
    titre: "Petites annonces des Trois Frontières",
    description:
      "Les petites annonces de Radio Tripoint : auto, maison, emploi, services… en France, au Luxembourg et en Allemagne. Chaque annonce est vérifiée avant de paraître.",
    chemin: "/",
    // Les pages de résultats ne s'indexent pas : seules l'accueil et les catégories.
    noindex: recherche,
  })
}

export default async function PageAnnonces(props: PageProps<"/petites-annonces">) {
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
  // Chaque autocollant a son angle : posés à la main, pas alignés au cordeau.
  const ANGLES = [-6, 4, -3, 7, -5, 3, -7, 5, -2, 6]

  if (enRecherche)
    return (
      <>
        <header className="bg-nuit text-nuit-encre">
          <div className="conteneur pt-6 pb-7 sm:pt-8">
            <h1 className="titre-affiche text-[clamp(2.2rem,1.4rem+3.4vw,3.8rem)]">
              {filtres.q ? `« ${filtres.q} »` : "Toutes les annonces"}
            </h1>
            <div className="capsule mt-5 max-w-3xl">
              <BarreRecherche q={filtres.q} lieu={filtres.lieu} />
            </div>
          </div>
        </header>
        <div className="conteneur py-8 lg:py-12">
          <Resultats liste={liste} filtres={filtres} base="/" page={page} categories={categories} />
        </div>
      </>
    )

  return (
    <>
      <HeroTripoint q={filtres.q} lieu={filtres.lieu} enLigne={liste.length} />

      {compte === null && sp.compte === "supprime" && (
        <p className="conteneur mt-4" role="status">
          <span className="bg-papier-2 block rounded-lg p-3 text-sm font-semibold">
            Votre compte est supprimé. Merci d&apos;avoir utilisé les Petites annonces.
          </span>
        </p>
      )}

      <section aria-labelledby="t-categories" className="pt-9 lg:pt-14">
        <h2 id="t-categories" className="conteneur titre-carte text-[1.35rem]">
          Parcourir
        </h2>
        <ul className="conteneur mt-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto pt-2 pb-4 sm:scroll-px-6 lg:grid lg:grid-cols-8 lg:overflow-visible">
          {categories.map((c, i) => {
            const n = liste.filter((a) => a.categorie === c.slug).length
            return (
              <li key={c.slug} className="w-[6.4rem] flex-none snap-start lg:w-auto">
                <Link href={`/${c.slug}`} className="group block text-center">
                  <span
                    className={cn("autocollant mx-auto w-[5.6rem] lg:w-[6.6rem]", teinte(c.slug))}
                    style={{ "--tourne": `${ANGLES[i % ANGLES.length]}deg` } as React.CSSProperties}
                  >
                    <span className="grid place-items-center gap-0.5">
                      <IconeCategorie slug={c.slug} className="size-7" strokeWidth={1.7} />
                      <span className="nombre text-[0.7rem] font-extrabold opacity-90">{n}</span>
                    </span>
                  </span>
                  <span className="mt-2.5 block text-[0.8rem] leading-tight font-bold">
                    {c.nom}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {une.length > 0 && (
        <section aria-labelledby="t-une" className="conteneur pt-8 lg:pt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="t-une" className="titre-section text-[clamp(1.9rem,1.3rem+2.2vw,3rem)]">
              À la une
            </h2>
            <p className="text-encre-3 text-xs">Annonces mises en avant par leurs annonceurs</p>
          </div>
          <div className="mt-5">
            <GrilleAnnonces liste={une} nomCategorie={nom} />
          </div>
        </section>
      )}

      <section aria-labelledby="t-recentes" className="conteneur pt-10 lg:pt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="t-recentes" className="titre-section text-[clamp(1.9rem,1.3rem+2.2vw,3rem)]">
            Dernières annonces
          </h2>
          {liste.length > recentes.length && (
            <Link href="/?voir=tout" className="lien text-sm font-bold">
              Voir les {liste.length} annonces
            </Link>
          )}
        </div>
        {recentes.length ? (
          <div className="mt-5">
            <GrilleAnnonces liste={recentes} nomCategorie={nom} />
          </div>
        ) : (
          <div className="border-trait-fort mt-5 rounded-2xl border-2 border-dashed p-6">
            <p className="titre-carte text-xl">Soyez parmi les premiers !</p>
            <p className="text-encre-2 mt-2">
              Déposez votre annonce en quelques minutes : elle sera vue des deux côtés de la
              frontière.
            </p>
            <Link href="/deposer" className="btn btn-accent mt-4">
              <Plus className="size-4" aria-hidden />
              Déposer une annonce
            </Link>
          </div>
        )}
      </section>

      <section aria-labelledby="t-comment" className="bg-accent mt-14 text-black">
        <div className="conteneur grid gap-8 py-10 lg:grid-cols-[1fr_2fr] lg:py-14">
          <h2 id="t-comment" className="titre-section text-[clamp(1.9rem,1.3rem+2.2vw,3rem)]">
            Comment ça marche
          </h2>
          <ol className="grid gap-6 sm:grid-cols-3">
            {[
              [
                "Vous déposez",
                "Catégorie, texte, photos : quelques minutes, gratuit pour les particuliers.",
              ],
              [
                "Nous vérifions",
                "L'équipe de Radio Tripoint relit chaque annonce avant de la publier.",
              ],
              [
                "On vous écrit",
                "Les acheteurs vous contactent par le site : votre adresse reste privée.",
              ],
            ].map(([t, d], i) => (
              <li key={t}>
                <span className="titre-affiche block text-[3.2rem] leading-none">{i + 1}</span>
                <span className="titre-carte mt-2 block text-lg">{t}</span>
                <span className="mt-1 block text-[0.95rem] leading-snug">{d}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="conteneur grid gap-6 pt-12 lg:grid-cols-2">
        <aside className="bg-nuit text-nuit-encre rounded-2xl p-6">
          <p className="text-nuit-accent font-bold">Professionnels</p>
          <p className="titre-carte mt-2 text-xl leading-snug">
            Vendez et recrutez dans les Trois Frontières
          </p>
          <p className="text-nuit-encre-2 mt-2 text-[0.95rem]">
            Vos coordonnées professionnelles, le lien de votre site et des mises en avant, sans
            abonnement.
          </p>
          <Link href="/inscription" className="btn btn-accent mt-5">
            Créer un compte pro
          </Link>
        </aside>
        <EncadreArnaques className="rounded-2xl" />
      </div>
    </>
  )
}
