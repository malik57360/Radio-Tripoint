"use client"

import { useState } from "react"
import { cn } from "@/lib/utils/cn"

export interface Point {
  cle: string
  /** Libellé sous l'axe (laisser vide pour n'en afficher qu'un sur N). */
  etiquette: string
  valeur: number
  /** Ligne secondaire de l'infobulle. */
  detail?: string
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n)

/** Graduation lisible : 1, 2, 5 × 10ⁿ. */
function plafondRond(max: number) {
  if (max <= 4) return 4
  const p = 10 ** Math.floor(Math.log10(max))
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= max) return m * p
  return 10 * p
}

/**
 * Barres verticales d'une seule série (pas de légende : le titre de la
 * carte la nomme). Infobulle au survol ou au toucher, zone de visée plus
 * large que la barre, dernière valeur étiquetée.
 */
export function Histogramme({
  points,
  unite,
  hauteur = 160,
  pas = 1,
  enCours = false,
}: {
  points: Point[]
  unite: string
  hauteur?: number
  /** N'affiche qu'une étiquette d'axe sur `pas`. */
  pas?: number
  /** La dernière barre est une période en cours (moins opaque). */
  enCours?: boolean
}) {
  const [actif, setActif] = useState<number | null>(null)
  const max = plafondRond(Math.max(...points.map((p) => p.valeur), 0))
  const graduations = [max, max / 2, 0]
  const vu = actif !== null ? points[actif] : null

  return (
    <div>
      <div className="relative" style={{ height: hauteur }}>
        {/* Grille récessive */}
        {graduations.map((g) => (
          <div
            key={g}
            className="border-grille absolute inset-x-0 flex items-start border-t"
            style={{ top: `${(1 - g / max) * 100}%` }}
          >
            <span className="text-encre-3 bg-carte -mt-2 pr-1 text-[0.65rem]">{fmt(g)}</span>
          </div>
        ))}
        <div
          className="absolute inset-y-0 right-0 left-8 flex items-end gap-[2px]"
          onMouseLeave={() => setActif(null)}
        >
          {points.map((p, i) => {
            const derniere = i === points.length - 1
            return (
              <button
                key={p.cle}
                type="button"
                aria-label={`${p.etiquette || p.cle} : ${fmt(p.valeur)} ${unite}`}
                onMouseEnter={() => setActif(i)}
                onFocus={() => setActif(i)}
                onClick={() => setActif(i)}
                className="group relative flex h-full min-w-0 flex-1 items-end focus:outline-none"
              >
                <span
                  className={cn(
                    "bg-accent block w-full rounded-t-[4px] transition-opacity",
                    actif !== null && actif !== i && "opacity-40",
                    enCours && derniere && "opacity-60",
                  )}
                  style={{ height: `${(p.valeur / max) * 100}%`, minHeight: p.valeur > 0 ? 2 : 0 }}
                />
              </button>
            )
          })}
        </div>
        {vu && actif !== null && (
          <div
            role="status"
            className="border-trait bg-carte-2 pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-md border px-2.5 py-1.5 text-xs whitespace-nowrap shadow-lg"
            style={{
              left: `calc(2rem + (100% - 2rem) * ${(actif + 0.5) / points.length})`,
            }}
          >
            <p className="text-encre-2">{vu.detail ?? vu.etiquette}</p>
            <p className="font-bold">
              {fmt(vu.valeur)} {unite}
            </p>
          </div>
        )}
      </div>
      <div className="text-encre-3 mt-1.5 ml-8 flex gap-[2px] text-[0.65rem]">
        {points.map((p, i) => (
          <span
            key={p.cle}
            className="min-w-0 flex-1 overflow-visible text-center whitespace-nowrap"
          >
            {(i % pas === 0 && points.length - 1 - i >= pas / 2) || i === points.length - 1
              ? p.etiquette
              : ""}
          </span>
        ))}
      </div>
    </div>
  )
}
