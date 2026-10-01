import { AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils/cn"

export function libellePage(p: string) {
  if (p === "/") return "Accueil"
  try {
    return decodeURIComponent(p)
  } catch {
    return p
  }
}

export const nombre = (n: number) => new Intl.NumberFormat("fr-FR").format(n)

const regions = new Intl.DisplayNames(["fr"], { type: "region" })
export function nomPays(code: string | null | undefined) {
  if (!code) return "Inconnu"
  try {
    return regions.of(code.toUpperCase()) ?? code
  } catch {
    return code
  }
}

export function Section({
  id,
  titre,
  sousTitre,
  children,
}: {
  id: string
  titre: string
  sousTitre?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`t-${id}`} className="scroll-mt-20">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h2 id={`t-${id}`} className="text-xl font-extrabold tracking-tight sm:text-2xl">
          {titre}
        </h2>
        {sousTitre && <p className="text-encre-3 text-xs">{sousTitre}</p>}
      </div>
      {children}
    </section>
  )
}

export function Carte({
  titre,
  note,
  children,
  className,
}: {
  titre?: string
  note?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("border-trait bg-carte rounded-xl border p-4 sm:p-5", className)}>
      {titre && (
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h3 className="surtitre">{titre}</h3>
          {note && <span className="text-encre-3 text-[0.7rem]">{note}</span>}
        </div>
      )}
      {children}
    </div>
  )
}

/** Variation en %, en encre neutre : la flèche porte le sens, pas la couleur. */
export function Evolution({ actuel, precedent }: { actuel: number; precedent: number | null }) {
  if (precedent === null) return null
  if (precedent === 0)
    return actuel > 0 ? <span className="text-encre-3 text-xs">nouveau</span> : null
  const pct = Math.round(((actuel - precedent) / precedent) * 100)
  const Icone = pct > 0 ? ArrowUpRight : pct < 0 ? ArrowDownRight : ArrowRight
  return (
    <span className="text-encre-2 inline-flex items-center gap-0.5 text-xs font-semibold">
      <Icone className="size-3.5" aria-hidden />
      {pct > 0 ? "+" : ""}
      {pct} %
    </span>
  )
}

export function Tuile({
  libelle,
  valeur,
  detail,
  evolution,
  accent = false,
}: {
  libelle: string
  valeur: string | number | null
  detail?: ReactNode
  evolution?: ReactNode
  accent?: boolean
}) {
  return (
    <div className="border-trait bg-carte flex flex-col rounded-xl border p-4">
      <p className="surtitre">{libelle}</p>
      <p
        className={cn(
          "mt-2 text-[2rem] leading-none font-extrabold tracking-tight",
          accent && "text-accent",
          valeur === null && "text-encre-3",
        )}
      >
        {valeur === null ? "—" : typeof valeur === "number" ? nombre(valeur) : valeur}
      </p>
      {(detail || evolution) && (
        <div className="text-encre-3 mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {evolution}
          {detail}
        </div>
      )}
    </div>
  )
}

/** Liste classée avec barre fine : libellé et valeur en clair, la barre ne fait que l'appuyer. */
export function Barres({
  lignes,
  unite,
  vide = "Aucune donnée sur la période.",
  max,
}: {
  lignes: { cle: string; libelle?: ReactNode; n: number; detail?: string }[]
  unite?: string
  vide?: string
  max?: number
}) {
  if (!lignes.length) return <p className="text-encre-3 text-sm">{vide}</p>
  const plafond = max ?? Math.max(...lignes.map((l) => l.n), 1)
  return (
    <ul className="space-y-2.5">
      {lignes.map((l) => (
        <li key={l.cle}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate">{l.libelle ?? l.cle}</span>
            <span className="text-encre-2 flex-none font-semibold">
              {nombre(l.n)}
              {unite && <span className="text-encre-3 font-normal"> {unite}</span>}
              {l.detail && <span className="text-encre-3 font-normal"> · {l.detail}</span>}
            </span>
          </div>
          <div className="bg-grille mt-1 h-1.5 overflow-hidden rounded-full">
            <div
              className="bg-accent h-full rounded-full"
              style={{ width: `${Math.max(2, (l.n / plafond) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function Etat({ ok, children }: { ok: boolean; children: ReactNode }) {
  const Icone = ok ? CheckCircle2 : AlertTriangle
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-semibold",
        ok ? "text-bon" : "text-alerte",
      )}
    >
      <Icone className="size-4 flex-none" aria-hidden />
      {children}
    </span>
  )
}

/** Module qui attend une activation : on le dit, on ne montre pas de zéro trompeur. */
export function AActiver({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div className="border-alerte/40 bg-carte rounded-xl border border-dashed p-5">
      <Etat ok={false}>{titre}</Etat>
      <div className="text-encre-2 mt-2 text-sm leading-relaxed">{children}</div>
    </div>
  )
}
