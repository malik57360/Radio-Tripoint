import { ChevronRight, CircleUserRound, Plus } from "lucide-react"
import Link from "next/link"
import { JsonLd } from "@/components/ui/JsonLd"
import { Logo } from "@/components/marque/Logo"
import { site } from "@/config/site"
import { OngletMessages } from "@/components/annonces/espace/NonLus"
import { compteConnecte } from "@/lib/annonces/comptes"
import { nonLus } from "@/lib/annonces/espace"
import { lienAnnonces } from "@/lib/annonces/liens"
import { cn } from "@/lib/utils/cn"

/**
 * Habillage du site des Petites annonces (annonces.radio-tripoint-officiel.fr) :
 * son propre en-tête et son pied de page, aux couleurs de Radio Tripoint,
 * sans le lecteur ni les rubriques de la radio.
 */

export async function EnTeteAnnonces() {
  const compte = await compteConnecte()
  return (
    <header className="bg-nuit text-nuit-encre border-nuit-trait sticky top-0 z-40 border-b">
      {/* L'en-tête se règle sur sa propre largeur, pas sur celle de l'écran : un
          iPhone dont le texte est agrandi (réglage « aA ») n'offre que 300 px environ. */}
      <div className="conteneur @container flex h-16 items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 sm:gap-2.5"
          aria-label="Les Petites Annonces du Tripoint — accueil"
        >
          <Logo sombre taille={44} className="size-10 flex-none sm:size-11" />
          {/* Trop étroit pour le nom : le logo seul, plutôt qu'un nom qui passe sous « Déposer ».
              Et si la police tarde (la police de secours est plus large), le nom est
              coupé au bord plutôt que de déborder. */}
          <span className="min-w-0 overflow-x-clip leading-none @max-[20rem]:hidden">
            <span className="text-nuit-accent hidden text-[0.62rem] font-extrabold tracking-[0.14em] uppercase sm:block">
              Radio Tripoint
            </span>
            {/* Au téléphone, le logo dit déjà « Radio Tripoint » : le nom tient sur deux lignes. */}
            <span className="titre-affiche block text-[clamp(0.95rem,4.6vw,1.15rem)] leading-[0.92] sm:text-[1.6rem] sm:leading-none">
              <span className="text-nuit-accent sm:text-inherit">Petites</span>
              <br className="sm:hidden" /> annonces
            </span>
          </span>
        </Link>
        <Link
          href="/deposer"
          className="bg-accent text-sur-accent ml-auto inline-flex min-h-10 flex-none items-center gap-1 rounded-full px-3 text-sm font-extrabold hover:brightness-95 sm:gap-1.5 sm:px-4"
        >
          <Plus className="size-4" aria-hidden />
          Déposer
        </Link>
        <div className="-mr-1 flex flex-none items-center sm:mr-0 sm:gap-1">
          <OngletMessages connecte={!!compte} initial={compte ? await nonLus(compte.id) : 0} />
          <Link
            href={compte ? "/mon-espace" : "/connexion"}
            className="hover:bg-nuit-2 inline-flex min-h-10 flex-none items-center gap-1.5 rounded-full px-1.5 text-sm font-bold sm:px-3"
            aria-label={compte ? "Mon espace" : "Se connecter"}
          >
            <CircleUserRound className="size-6" aria-hidden />
            <span className="hidden sm:inline">{compte ? "Mon espace" : "Se connecter"}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export function PiedAnnonces() {
  return (
    <footer className="bg-nuit text-nuit-encre-2 mt-16 pb-10 text-sm">
      <div className="conteneur grid gap-8 pt-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="titre-affiche text-nuit-encre text-2xl">Les Petites Annonces du Tripoint</p>
          <p className="mt-2 max-w-sm leading-snug">
            Acheter, vendre et recruter en France, au Luxembourg et en Allemagne. Un service de{" "}
            <a href={site.url} className="text-nuit-encre underline underline-offset-2">
              Radio Tripoint
            </a>
            , la radio des Trois Frontières.
          </p>
        </div>
        <ul className="space-y-2">
          <li>
            <Link href="/deposer" className="hover:text-nuit-encre">
              Déposer une annonce
            </Link>
          </li>
          <li>
            <Link href="/mon-espace" className="hover:text-nuit-encre">
              Mon espace
            </Link>
          </li>
          <li>
            <Link href="/regles" className="hover:text-nuit-encre">
              Règles et aide
            </Link>
          </li>
          <li>
            <Link href="/conditions" className="hover:text-nuit-encre">
              Conditions
            </Link>
          </li>
        </ul>
        <ul className="space-y-2">
          <li>
            <a href={site.url} className="hover:text-nuit-encre">
              Écouter Radio Tripoint
            </a>
          </li>
          <li>
            <a href={`${site.url}/mentions-legales`} className="hover:text-nuit-encre">
              Mentions légales
            </a>
          </li>
          <li>
            <a href={`${site.url}/politique-confidentialite`} className="hover:text-nuit-encre">
              Confidentialité
            </a>
          </li>
          <li>
            <a href={`mailto:${site.contact.email}`} className="hover:text-nuit-encre">
              {site.contact.email}
            </a>
          </li>
        </ul>
      </div>
      <p className="conteneur text-nuit-encre-2/70 mt-8 text-xs">
        © {new Date().getFullYear()} {site.nomOfficiel}
      </p>
    </footer>
  )
}

/** Fil d'Ariane du site des annonces, avec son balisage pour les moteurs de recherche. */
export function FilAnnonces({
  elements,
  sombre = false,
  className,
}: {
  elements: { nom: string; chemin: string }[]
  sombre?: boolean
  className?: string
}) {
  const complet = [{ nom: "Annonces", chemin: "/" }, ...elements.filter((e) => e.chemin !== "/")]
  return (
    <>
      <nav
        aria-label="Fil d'Ariane"
        className={cn("text-[0.8rem]", sombre ? "text-nuit-encre-2" : "text-encre-3", className)}
      >
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {complet.map((m, i) => (
            <li key={m.chemin} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5 flex-none" aria-hidden />}
              {i === complet.length - 1 ? (
                <span
                  aria-current="page"
                  className={cn("line-clamp-1", sombre ? "text-nuit-encre" : "text-encre")}
                >
                  {m.nom}
                </span>
              ) : (
                <Link href={m.chemin} className="hover:underline">
                  {m.nom}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: complet.map((m, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: m.nom,
            item: lienAnnonces(m.chemin),
          })),
        }}
      />
    </>
  )
}
