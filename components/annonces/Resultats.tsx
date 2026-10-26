import { SlidersHorizontal } from "lucide-react"
import { Suspense } from "react"
import { BoutonAlerte } from "./espace/BoutonAlerte"
import Link from "@/components/ui/Lien"
import { Pagination } from "@/components/ui/Pagination"
import { EtatVide } from "@/components/ui/EtatVide"
import { ETATS, PAYS, type Pays } from "@/lib/annonces/categories"
import { resultats, versParams, type Filtres } from "@/lib/annonces/recherche"
import type { AnnoncePublique } from "@/lib/annonces/types"
import { BadgeMiseEnAvant, GrilleAnnonces } from "./Vitrine"

/**
 * Résultats de recherche avec leurs filtres (formulaire GET : marche sans
 * JavaScript, et chaque recherche a son adresse, partageable).
 */
const PAR_PAGE = 24

export function Resultats({
  liste,
  filtres,
  base,
  page,
  categories,
  categorieFixe,
}: {
  liste: AnnoncePublique[]
  filtres: Filtres
  base: string
  page: number
  categories: { slug: string; nom: string }[]
  categorieFixe?: string
}) {
  const { premium, autres, total } = resultats(liste, filtres)
  const pages = Math.max(1, Math.ceil(autres.length / PAR_PAGE))
  const p = Math.min(Math.max(1, page), pages)
  const visibles = autres.slice((p - 1) * PAR_PAGE, p * PAR_PAGE)
  const nom = (slug: string) => categories.find((c) => c.slug === slug)?.nom
  const actifs = [
    filtres.pays,
    filtres.prixMin,
    filtres.prixMax,
    filtres.etat,
    filtres.annonceur,
  ].filter((x) => x !== undefined).length

  const formulaire = (s: string) => (
    <form action={base} className="space-y-4">
      {filtres.q && <input type="hidden" name="q" value={filtres.q} />}
      {filtres.lieu && <input type="hidden" name="lieu" value={filtres.lieu} />}
      {!categorieFixe && (
        <div>
          <label htmlFor={`f-categorie${s}`} className="etiquette">
            Catégorie
          </label>
          <select
            id={`f-categorie${s}`}
            name="categorie"
            defaultValue={filtres.categorie ?? ""}
            className="champ"
          >
            <option value="">Toutes</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor={`f-pays${s}`} className="etiquette">
          Pays
        </label>
        <select id={`f-pays${s}`} name="pays" defaultValue={filtres.pays ?? ""} className="champ">
          <option value="">Les trois pays</option>
          {(Object.keys(PAYS) as Pays[]).map((x) => (
            <option key={x} value={x}>
              {PAYS[x]}
            </option>
          ))}
        </select>
      </div>
      <fieldset>
        <legend className="etiquette">Prix (€)</legend>
        <div className="grid grid-cols-2 gap-2">
          <input
            name="min"
            defaultValue={filtres.prixMin}
            inputMode="numeric"
            placeholder="Min"
            aria-label="Prix minimum"
            className="champ"
          />
          <input
            name="max"
            defaultValue={filtres.prixMax}
            inputMode="numeric"
            placeholder="Max"
            aria-label="Prix maximum"
            className="champ"
          />
        </div>
      </fieldset>
      <div>
        <label htmlFor={`f-etat${s}`} className="etiquette">
          État
        </label>
        <select id={`f-etat${s}`} name="etat" defaultValue={filtres.etat ?? ""} className="champ">
          <option value="">Tous</option>
          {ETATS.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`f-par${s}`} className="etiquette">
          Annonceur
        </label>
        <select
          id={`f-par${s}`}
          name="par"
          defaultValue={filtres.annonceur ?? ""}
          className="champ"
        >
          <option value="">Tous</option>
          <option value="particulier">Particuliers</option>
          <option value="pro">Professionnels</option>
        </select>
      </div>
      <div>
        <label htmlFor={`f-tri${s}`} className="etiquette">
          Trier par
        </label>
        <select
          id={`f-tri${s}`}
          name="tri"
          defaultValue={filtres.tri ?? "recent"}
          className="champ"
        >
          <option value="recent">Les plus récentes</option>
          <option value="prix-croissant">Prix croissant</option>
          <option value="prix-decroissant">Prix décroissant</option>
        </select>
      </div>
      <button type="submit" className="btn btn-plein w-full">
        Appliquer
      </button>
      {actifs > 0 && (
        <Link
          href={`${base}?${versParams(filtres, ["pays", "prixMin", "prixMax", "etat", "annonceur"])}`}
          className="lien block text-center text-sm"
        >
          Effacer les filtres
        </Link>
      )}
    </form>
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-12">
      <details className="lg:hidden" open={actifs > 0 ? true : undefined}>
        <summary className="btn btn-trait min-h-11 cursor-pointer list-none">
          <SlidersHorizontal className="size-4" aria-hidden />
          Filtres{actifs > 0 && ` (${actifs})`}
        </summary>
        <div className="mt-4">{formulaire("-m")}</div>
      </details>
      <div className="hidden lg:block">{formulaire("")}</div>

      <section aria-label="Résultats">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-encre-2 font-semibold" role="status">
            {total === 0 ? "Aucune annonce" : `${total} annonce${total > 1 ? "s" : ""}`}
            {filtres.q && ` pour « ${filtres.q} »`}
            {filtres.lieu && ` à ${filtres.lieu}`}
          </p>
          <Suspense>
            <BoutonAlerte categorie={categorieFixe} />
          </Suspense>
        </div>
        {total === 0 ? (
          <EtatVide
            className="mt-6"
            titre="Rien pour l'instant"
            actions={
              <>
                <Link href="/deposer" className="btn btn-plein">
                  Déposer une annonce
                </Link>
                <Link href={base} className="btn btn-trait">
                  Voir toutes les annonces
                </Link>
              </>
            }
          >
            Essayez un autre mot ou élargissez la zone. La rubrique vient d&apos;ouvrir : les
            annonces arrivent chaque jour.
          </EtatVide>
        ) : (
          <>
            {p === 1 && premium.length > 0 && (
              <div className="bg-papier-2 mt-5 rounded-xl p-4">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold">
                  <BadgeMiseEnAvant />
                  <span className="text-encre-2 font-semibold">
                    Annonces mises en avant par leurs annonceurs
                  </span>
                </p>
                <GrilleAnnonces liste={premium} nomCategorie={categorieFixe ? undefined : nom} />
              </div>
            )}
            <div className="mt-6">
              <GrilleAnnonces liste={visibles} nomCategorie={categorieFixe ? undefined : nom} />
            </div>
            <Pagination
              page={p}
              pages={pages}
              base={base}
              params={Object.fromEntries(versParams(filtres))}
            />
          </>
        )}
      </section>
    </div>
  )
}
