import { Briefcase, Car, HandHeart, MapPin, ShieldCheck, ShoppingBag } from "lucide-react"
import Link from "@/components/ui/Lien"
import { CATEGORIES, PAYS, type Annonce, type Categorie } from "@/lib/annonces/exemples"
import { cn } from "@/lib/utils/cn"

/** MAQUETTE — briques de la rubrique « Petites annonces ». */

export const ICONES: Record<Categorie, typeof Briefcase> = {
  emploi: Briefcase,
  vehicules: Car,
  affaires: ShoppingBag,
  services: HandHeart,
}

/** Teinte de chaque rubrique : jaune Tripoint, et trois tons sobres (le rouge reste au direct). */
export const TEINTES: Record<Categorie, string> = {
  emploi: "bg-[#f9b800] text-black",
  vehicules: "bg-[#1f3a5f] text-white",
  affaires: "bg-[#2f5d50] text-white",
  services: "bg-[#5b3f86] text-white",
}

export const dateCourte = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(
    new Date(`${iso}T12:00:00`),
  )

export function Drapeau({ pays, className }: { pays: keyof typeof PAYS; className?: string }) {
  const bandes =
    pays === "FR"
      ? { sens: "flex-row", c: ["#0055a4", "#ffffff", "#ef4135"] }
      : pays === "DE"
        ? { sens: "flex-col", c: ["#000000", "#dd0000", "#ffce00"] }
        : { sens: "flex-col", c: ["#ea141d", "#ffffff", "#00a2e1"] }
  return (
    <span
      aria-hidden
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

/** Vignette de l'annonce : l'icône de sa rubrique (les vraies annonces auront leur photo). */
export function Vignette({
  categorie,
  grande = false,
}: {
  categorie: Categorie
  grande?: boolean
}) {
  const Icone = ICONES[categorie]
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden",
        TEINTES[categorie],
        grande ? "aspect-[4/3] w-full rounded-lg" : "size-24 flex-none rounded-md sm:size-28",
      )}
    >
      <Icone
        className={grande ? "size-20 opacity-90" : "size-9 opacity-90"}
        strokeWidth={1.6}
        aria-hidden
      />
      <span
        aria-hidden
        className="absolute -right-6 -bottom-8 size-24 rounded-full border-[10px] border-current opacity-10"
      />
      {grande && (
        <span className="absolute bottom-3 left-3 rounded bg-black/55 px-2 py-1 text-xs font-semibold text-white">
          Photo de l’annonce
        </span>
      )}
    </div>
  )
}

export function BadgeExemple() {
  return <span className="badge-exemple">Exemple</span>
}

/** Carte d'une annonce dans la liste. */
export function CarteAnnonce({ a }: { a: Annonce }) {
  return (
    <article className="carte group border-trait flex gap-4 border-t pt-5">
      <Vignette categorie={a.categorie} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-[0.78rem]">
          <span className="surtitre text-accent-encre">{CATEGORIES[a.categorie].court}</span>
          {a.pro && (
            <span className="border-trait-fort text-encre-2 rounded-sm border px-1.5 py-px text-[0.68rem] font-bold">
              PRO
            </span>
          )}
          <BadgeExemple />
        </p>
        <h3 className="carte-titre titre-carte mt-1 text-[1.15rem] leading-tight">
          <Link href={`/annonces/${a.slug}`} className="carte-lien">
            {a.titre}
          </Link>
        </h3>
        {a.prix && <p className="mt-1.5 text-[1.05rem] font-extrabold">{a.prix}</p>}
        <p className="text-encre-3 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem]">
          <MapPin className="size-3.5" aria-hidden />
          <span className="text-encre-2 font-semibold">{a.ville}</span>
          <Drapeau pays={a.pays} />
          <span aria-hidden>·</span>
          <span>{dateCourte(a.publieeLe)}</span>
        </p>
      </div>
    </article>
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
        <li>Méfiez-vous des mandats cash, coupons, cryptomonnaies et « transporteurs ».</li>
        <li>Une offre d’emploi ne demande jamais d’argent ni vos codes bancaires.</li>
        <li>Rencontrez-vous dans un lieu public. Un doute ? Signalez l’annonce.</li>
      </ul>
    </aside>
  )
}

/** Bandeau rappelant que la page est une maquette. */
export function BandeauMaquette() {
  return (
    <div className="bg-[#fdefc0] text-black">
      <p className="conteneur py-2 text-center text-[0.85rem] font-semibold">
        Maquette — les annonces affichées sont des exemples, la rubrique n’est pas encore ouverte.
      </p>
    </div>
  )
}
