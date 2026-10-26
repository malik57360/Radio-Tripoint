import {
  Briefcase,
  Car,
  Dumbbell,
  House,
  MapPin,
  MonitorSmartphone,
  Package,
  PawPrint,
  Search,
  ShieldCheck,
  Shirt,
  Sofa,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { ViewTransition } from "react"
import Link from "@/components/ui/Lien"
import { prixAffiche } from "@/lib/annonces/prix"
import { BoutonFavori } from "./espace/Favoris"
import { PAYS, type Pays } from "@/lib/annonces/categories"
import { cheminAnnonce, misEnAvant, type AnnoncePublique } from "@/lib/annonces/types"
import { cn } from "@/lib/utils/cn"

/** Briques d'affichage des Petites annonces (cartes, vignettes, encadrés). */

export const ICONES: Record<string, LucideIcon> = {
  "auto-moto": Car,
  immobilier: House,
  "maison-mobilier": Sofa,
  "multimedia-high-tech": MonitorSmartphone,
  "mode-accessoires": Shirt,
  "loisirs-sport": Dumbbell,
  "services-artisans": Wrench,
  emploi: Briefcase,
  animaux: PawPrint,
  divers: Package,
}

/** Teinte de chaque catégorie : le jaune Tripoint et des tons sobres (le rouge reste au direct). */
export const TEINTES: Record<string, string> = {
  "auto-moto": "bg-[#1f3a5f] text-white",
  immobilier: "bg-[#2f5d50] text-white",
  "maison-mobilier": "bg-[#7a5230] text-white",
  "multimedia-high-tech": "bg-[#263238] text-white",
  "mode-accessoires": "bg-[#5b3f86] text-white",
  "loisirs-sport": "bg-[#1f6f8b] text-white",
  "services-artisans": "bg-[#a85a14] text-white",
  emploi: "bg-[#f9b800] text-black",
  animaux: "bg-[#4a7c59] text-white",
  divers: "bg-[#555b6e] text-white",
}

/** Icône d'une catégorie (lue dans une table fixe : jamais créée au rendu). */
export function IconeCategorie({
  slug,
  className,
  strokeWidth,
}: {
  slug: string
  className?: string
  strokeWidth?: number
}) {
  const Icone = ICONES[slug] ?? ICONES.divers
  return <Icone className={className} strokeWidth={strokeWidth} aria-hidden />
}
export const teinte = (slug: string) => TEINTES[slug] ?? TEINTES.divers

export { prixAffiche }

const fuseau = { timeZone: "Europe/Paris" } as const
export function quand(ms: number) {
  const jour = (d: number) => new Date(d).toLocaleDateString("fr-CA", fuseau)
  const aujourdhui = jour(Date.now())
  if (jour(ms) === aujourdhui) return "Aujourd'hui"
  if (jour(ms) === jour(Date.now() - 864e5)) return "Hier"
  return new Date(ms).toLocaleDateString("fr-FR", { day: "numeric", month: "short", ...fuseau })
}

export const dateLongue = (ms: number) =>
  new Date(ms).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...fuseau,
  })

export function Drapeau({ pays, className }: { pays: Pays; className?: string }) {
  const bandes =
    pays === "FR"
      ? { sens: "flex-row", c: ["#0055a4", "#ffffff", "#ef4135"] }
      : pays === "DE"
        ? { sens: "flex-col", c: ["#000000", "#dd0000", "#ffce00"] }
        : { sens: "flex-col", c: ["#ea141d", "#ffffff", "#00a2e1"] }
  return (
    <span
      role="img"
      aria-label={PAYS[pays]}
      className={cn(
        "inline-flex h-3 w-[1.1rem] flex-none overflow-hidden rounded-[2px] ring-1 ring-black/10",
        bandes.sens,
        className,
      )}
    >
      {bandes.c.map((c) => (
        <span key={c} className="flex-1" style={{ background: c }} />
      ))}
    </span>
  )
}

/** Vignette : la première photo, ou l'icône de la catégorie sur sa teinte. */
export function Vignette({
  a,
  className,
}: {
  a: Pick<AnnoncePublique, "categorie" | "photos" | "titre">
  className?: string
}) {
  const p = a.photos[0]
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden",
        !p && teinte(a.categorie),
        className,
      )}
    >
      {p ? (
        // eslint-disable-next-line @next/next/no-img-element -- déjà réduite dans le navigateur
        <img
          src={p.vignette}
          alt=""
          width={p.l}
          height={p.h}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <IconeCategorie slug={a.categorie} className="size-9 opacity-90" strokeWidth={1.6} />
      )}
    </div>
  )
}

export function BadgeMiseEnAvant({ className }: { className?: string }) {
  return (
    <span
      title="Mise en avant payée par l'annonceur"
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-[0.68rem] font-bold text-[#f9b800] ring-1 ring-[#f9b800]/50",
        className,
      )}
    >
      <Sparkles className="size-3" aria-hidden />
      Mise en avant
    </span>
  )
}

export function BadgePro({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "border-trait-fort text-encre-2 inline-flex rounded-sm border px-1.5 py-px text-[0.66rem] font-extrabold tracking-wide",
        className,
      )}
    >
      PRO
    </span>
  )
}

/** Carte d'une annonce : photo, titre, prix, lieu, date, badges. */
/** Angle d'accroche de l'étiquette : propre à chaque annonce, stable d'un affichage à l'autre. */
const angle = (id: string) => `${-9 + (parseInt(id.slice(-2), 16) % 6)}deg`

/**
 * Carte d'une annonce : la photo d'abord, l'étiquette de prix accrochée
 * dessus (elle se balance quand on touche la carte). La photo garde le
 * même nom de transition sur la fiche : elle s'y agrandit sans coupure.
 */
export function CarteAnnonce({ a, categorie }: { a: AnnoncePublique; categorie?: string }) {
  const prix = prixAffiche(a)
  const p = a.photos[0]
  return (
    <article className="carte-annonce">
      <div className="photo">
        <ViewTransition name={`photo-${a.id}`} share="morph" default="none">
          {p ? (
            // eslint-disable-next-line @next/next/no-img-element -- déjà réduite dans le navigateur
            <img
              src={p.vignette}
              alt=""
              width={p.l}
              height={p.h}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          ) : (
            <div className={cn("grid size-full place-items-center", teinte(a.categorie))}>
              <IconeCategorie slug={a.categorie} className="size-12 opacity-90" strokeWidth={1.4} />
            </div>
          )}
        </ViewTransition>
        {prix && (
          <span
            className="etiquette-prix"
            style={{ "--angle": angle(a.id) } as React.CSSProperties}
          >
            {prix}
          </span>
        )}
        <BoutonFavori id={a.id} className="absolute top-2 right-2 z-[4]" />
        {misEnAvant(a) && (
          <span className="ruban" title="Mise en avant payée par l'annonceur">
            <Sparkles className="size-3" aria-hidden />
            Mise en avant
          </span>
        )}
      </div>
      <p className="text-encre-3 mt-2.5 flex flex-wrap items-center gap-1.5 text-[0.74rem]">
        {a.annonceur === "pro" && <BadgePro />}
        {categorie && <span className="font-semibold">{categorie}</span>}
      </p>
      <h3 className="titre-carte mt-0.5 line-clamp-2 text-[1rem] leading-tight sm:text-[1.06rem]">
        <Link href={cheminAnnonce(a)} className="titre-lien">
          {a.titre}
        </Link>
      </h3>
      <p className="text-encre-3 mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.76rem]">
        <span className="text-encre-2 font-semibold">{a.ville}</span>
        <Drapeau pays={a.pays} />
        <span className="ml-auto">{quand(a.remonteeLe)}</span>
      </p>
    </article>
  )
}

/** Grille de cartes : deux colonnes au téléphone, jusqu'à quatre sur grand écran. */
export function GrilleAnnonces({
  liste,
  nomCategorie,
}: {
  liste: AnnoncePublique[]
  nomCategorie?: (slug: string) => string | undefined
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-3.5 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
      {liste.map((a) => (
        <li key={a.id}>
          <CarteAnnonce a={a} categorie={nomCategorie?.(a.categorie)} />
        </li>
      ))}
    </ul>
  )
}

/** Barre de recherche (formulaire GET : fonctionne sans JavaScript). */
export function BarreRecherche({
  q,
  lieu,
  action = "/",
  sombre = false,
}: {
  q?: string
  lieu?: string
  action?: string
  sombre?: boolean
}) {
  return (
    <form action={action} role="search" className="grid gap-1.5 sm:grid-cols-[1.6fr_1fr_auto]">
      <label className="relative block">
        <span className="sr-only">Que cherchez-vous ?</span>
        <Search
          className="text-encre-3 pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2"
          aria-hidden
        />
        <input
          name="q"
          defaultValue={q}
          placeholder="Que cherchez-vous ?"
          className={cn("champ pl-11", sombre && "border-transparent")}
          enterKeyHint="search"
        />
      </label>
      <label className="relative block">
        <span className="sr-only">Ville ou code postal</span>
        <MapPin
          className="text-encre-3 pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2"
          aria-hidden
        />
        <input
          name="lieu"
          defaultValue={lieu}
          placeholder="Ville ou code postal"
          className={cn("champ pl-11", sombre && "border-transparent")}
        />
      </label>
      <button
        type="submit"
        className="btn btn-accent min-h-12 rounded-[0.9rem] px-6 text-[0.95rem]"
      >
        <Search className="size-4.5" aria-hidden />
        Rechercher
      </button>
    </form>
  )
}

/** Encadré « Évitez les arnaques », sur la liste et sur chaque annonce. */
export function EncadreArnaques({ className }: { className?: string }) {
  return (
    <aside className={cn("border-trait-fort bg-papier-2 border-l-4 p-5", className)}>
      <p className="flex items-center gap-2 font-extrabold">
        <ShieldCheck className="size-5" aria-hidden />
        Évitez les arnaques
      </p>
      <ul className="text-encre-2 mt-3 space-y-2 text-[0.93rem] leading-snug">
        <li>Ne payez jamais à l’avance un objet ou un véhicule que vous n’avez pas vu.</li>
        <li>
          Méfiez-vous des coupons, cryptomonnaies, « transporteurs » et liens de paiement reçus par
          message.
        </li>
        <li>Une offre d’emploi ne demande jamais d’argent ni vos codes bancaires.</li>
        <li>Rencontrez-vous dans un lieu public. Un doute ? Signalez l’annonce.</li>
      </ul>
      <p className="text-encre-3 mt-3 text-[0.8rem] leading-snug">
        Radio Tripoint met en relation les annonceurs et les visiteurs : la radio n’est ni vendeur
        ni acheteur, et ne garantit pas les transactions.
      </p>
    </aside>
  )
}
