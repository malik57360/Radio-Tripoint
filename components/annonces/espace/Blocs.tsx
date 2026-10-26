import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import Link from "@/components/ui/Lien"
import { cn } from "@/lib/utils/cn"
import type { Annonce } from "@/lib/annonces/types"

/** Briques de « Mon espace » : en-têtes, chiffres, courbe, états vides. */

export function EnTete({
  titre,
  sousTitre,
  action,
}: {
  titre: string
  sousTitre?: ReactNode
  action?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        <h1 className="text-[clamp(1.55rem,1.25rem+1.2vw,2.1rem)] leading-tight font-extrabold tracking-[-0.02em]">
          {titre}
        </h1>
        {sousTitre && <p className="text-encre-2 mt-1 text-[0.95rem]">{sousTitre}</p>}
      </div>
      {action}
    </header>
  )
}

export function Carte({
  titre,
  lien,
  children,
  className,
}: {
  titre?: string
  lien?: { href: string; texte: string }
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("bg-surface border-trait rounded-2xl border p-4 sm:p-5", className)}>
      {(titre || lien) && (
        <div className="mb-3 flex items-baseline justify-between gap-3">
          {titre && <h2 className="text-[1.02rem] font-extrabold">{titre}</h2>}
          {lien && (
            <Link href={lien.href} className="lien flex-none text-sm font-bold">
              {lien.texte}
            </Link>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

export function Tuile({
  libelle,
  valeur,
  detail,
  icone: Icone,
  href,
  accent = false,
}: {
  libelle: string
  valeur: number | string
  detail?: string
  icone: LucideIcon
  href?: string
  accent?: boolean
}) {
  const contenu = (
    <>
      <span className="flex items-center justify-between gap-2">
        <span className="text-encre-2 text-[0.8rem] font-bold">{libelle}</span>
        <Icone
          className={cn("size-4 flex-none", accent ? "text-[#b88700]" : "text-encre-3")}
          aria-hidden
        />
      </span>
      <span className="mt-1.5 block text-[1.9rem] leading-none font-extrabold tracking-tight tabular-nums">
        {typeof valeur === "number" ? valeur.toLocaleString("fr-FR") : valeur}
      </span>
      {detail && (
        <span className="text-encre-3 mt-1.5 block text-[0.78rem] leading-snug">{detail}</span>
      )}
    </>
  )
  const classe = cn(
    "bg-surface border-trait block rounded-2xl border p-3.5 sm:p-4",
    accent && "border-[#f9b800] bg-[#fffaeb]",
    href && "hover:border-trait-fort transition-colors",
  )
  return href ? (
    <Link href={href} className={classe}>
      {contenu}
    </Link>
  ) : (
    <div className={classe}>{contenu}</div>
  )
}

/** Courbe des vues (14 jours) : une aire, des jours, rien d'inventé. */
export function Courbe({ points }: { points: { j: string; n: number }[] }) {
  const max = Math.max(1, ...points.map((p) => p.n))
  const L = 280
  const H = 64
  const pas = L / Math.max(1, points.length - 1)
  const y = (n: number) => H - 4 - (n / max) * (H - 10)
  const ligne = points.map((p, i) => `${i ? "L" : "M"}${(i * pas).toFixed(1)} ${y(p.n).toFixed(1)}`)
  const total = points.reduce((t, p) => t + p.n, 0)
  const jour = (j: string) =>
    new Date(`${j}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  return (
    <figure>
      <svg
        viewBox={`0 0 ${L} ${H}`}
        preserveAspectRatio="none"
        className="h-16 w-full overflow-visible"
        role="img"
        aria-label={`${total} vues en 14 jours`}
      >
        <path d={`${ligne.join(" ")} L${L} ${H} L0 ${H} Z`} fill="rgb(20 98 114 / 0.12)" />
        <path
          d={ligne.join(" ")}
          fill="none"
          stroke="#146272"
          strokeWidth="2"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={L}
          cy={y(points.at(-1)?.n ?? 0)}
          r="3.5"
          fill="#f9b800"
          stroke="#0a3640"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <figcaption className="text-encre-3 mt-1.5 flex justify-between text-[0.72rem]">
        <span>{points[0] && jour(points[0].j)}</span>
        <span>Aujourd&apos;hui</span>
      </figcaption>
    </figure>
  )
}

export function Vide({
  icone: Icone,
  titre,
  children,
  action,
}: {
  icone: LucideIcon
  titre: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="border-trait rounded-2xl border border-dashed px-5 py-10 text-center">
      <span className="bg-papier-2 mx-auto grid size-12 place-items-center rounded-full">
        <Icone className="text-encre-2 size-5" aria-hidden />
      </span>
      <p className="mt-3 font-extrabold">{titre}</p>
      {children && <div className="text-encre-2 mx-auto mt-1 max-w-md text-sm">{children}</div>}
      {action && <div className="mt-4 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}

const resteAvant = (fin: number) => Math.max(0, fin - Date.now())

/** Temps restant en ligne : une barre qui se vide, orange dans les 5 derniers jours. */
export function TempsRestant({ debut, fin }: { debut?: number; fin?: number }) {
  if (!debut || !fin) return null
  const total = Math.max(1, fin - debut)
  const reste = resteAvant(fin)
  const jours = Math.ceil(reste / 864e5)
  const bientot = jours <= 5
  return (
    <div className="mt-2.5">
      <div className="bg-papier-3 h-1.5 overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full", bientot ? "bg-[#e07b00]" : "bg-nuit-3")}
          style={{ width: `${Math.min(100, (reste / total) * 100)}%` }}
        />
      </div>
      <p
        className={cn("mt-1 text-[0.74rem]", bientot ? "font-bold text-[#a85a14]" : "text-encre-3")}
      >
        {jours > 1
          ? `${jours} jours en ligne restants`
          : jours === 1
            ? "Dernier jour en ligne"
            : "Arrive à échéance"}
      </p>
    </div>
  )
}

/**
 * Ce qui aide une annonce à partir, mesuré sur l'annonce elle-même :
 * photos, description, prix. Chaque conseil vise un manque réel.
 */
export function qualite(
  a: Pick<Annonce, "photos" | "photosMax" | "description" | "prix" | "mention" | "details">,
) {
  const conseils: string[] = []
  let points = 0
  const photos = a.photos.length
  if (photos >= 3) points += 40
  else {
    points += photos * 12
    conseils.push(
      photos === 0
        ? "Ajoutez des photos : une annonce sans photo est très peu ouverte."
        : `Ajoutez des photos (${photos} sur ${a.photosMax}) : 3 au moins montrent l'objet sous tous les angles.`,
    )
  }
  const long = a.description.trim().length
  if (long >= 200) points += 30
  else {
    points += Math.round((long / 200) * 30)
    conseils.push(
      "Étoffez la description : état, dimensions, raison de la vente, remise en main propre…",
    )
  }
  if (a.prix !== null || a.mention || a.details.salaire) points += 30
  else conseils.push("Indiquez un prix, ou « À débattre » : les acheteurs filtrent par prix.")
  return { score: Math.min(100, points), conseils }
}
