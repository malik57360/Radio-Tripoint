import type { CSSProperties } from "react"
import type { Univers } from "@/lib/zaza/boutique"

/*
 * Dessins au trait, un par univers, dans un carré de 100. Ils remplacent les
 * photos sur les étiquettes : même épaisseur de trait partout, couleur héritée
 * (currentColor), fond papier pour masquer les traits qui passent derrière.
 */

const papier = "var(--color-papier)"

/** Une foliole de chanvre : base à l'origine, pointe vers le haut. */
const foliole = (longueur: number, angle: number, i: number) => {
  const l = longueur
  const w = l * 0.15
  return (
    <g key={angle} transform={`rotate(${angle})`}>
      <path
        pathLength={1}
        style={{ "--i": i } as CSSProperties}
        d={`M0 0 C ${w} ${-l * 0.2}, ${w * 1.1} ${-l * 0.62}, 0 ${-l} C ${-w * 1.1} ${-l * 0.62}, ${-w} ${-l * 0.2}, 0 0 Z`}
      />
      <path
        pathLength={1}
        style={{ "--i": i + 3 } as CSSProperties}
        d={`M0 ${-l * 0.08} L0 ${-l * 0.86}`}
        strokeWidth={0.8}
      />
    </g>
  )
}

const FOLIOLES: [number, number][] = [
  [0, 46],
  [-26, 40],
  [26, 40],
  [-52, 31],
  [52, 31],
  [-80, 19],
  [80, 19],
]

export function Feuille({ className, trace = false }: { className?: string; trace?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className ?? ""} ${trace ? "trace" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path pathLength={1} d="M50 62 C 50 74, 49 84, 46 94" />
      <g transform="translate(50 62)">{FOLIOLES.map(([a, l], i) => foliole(l, a, i))}</g>
    </svg>
  )
}

export function Dessin({ nom, className }: { nom: Univers["dessin"]; className?: string }) {
  const commun = {
    viewBox: "0 0 100 100",
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }

  switch (nom) {
    case "feuille":
      return <Feuille className={className} />

    case "flacon":
      return (
        <svg {...commun}>
          <path d="M44 33 V22 a6 6 0 0 1 12 0 V33" />
          <rect x="40" y="33" width="20" height="9" rx="2" fill={papier} />
          <path
            d="M33 50 a8 8 0 0 1 8 -8 H59 a8 8 0 0 1 8 8 V84 a5 5 0 0 1 -5 5 H38 a5 5 0 0 1 -5 -5 Z"
            fill={papier}
          />
          <rect x="38" y="58" width="24" height="18" rx="2" />
          <path d="M43 64 H57 M45 70 H55" strokeWidth={1.4} />
        </svg>
      )

    case "cone":
      return (
        <svg {...commun}>
          <path d="M34 26 L45 88 H55 L66 26" fill={papier} />
          <path d="M34 26 Q50 16 66 26" />
          <path d="M47 21 Q51 10 55 18 Q57 12 60 14" />
          <path d="M43.6 78 H56.4" />
          <path d="M40 46 Q46 50 52 44 M48 60 Q53 64 58 58" strokeWidth={1.3} />
        </svg>
      )

    case "vape":
      return (
        <svg {...commun}>
          <rect x="45" y="8" width="10" height="13" rx="4" fill={papier} />
          <rect x="41" y="20" width="18" height="70" rx="8" fill={papier} />
          <rect x="46" y="28" width="8" height="20" rx="4" />
          <circle cx="50" cy="62" r="3" />
          <path d="M41 76 H59" />
          <path d="M62 14 q6 -3 3 -8 M67 20 q5 -2 3 -6" strokeWidth={1.4} />
        </svg>
      )

    case "gomme":
      return (
        <svg {...commun}>
          <ellipse cx="36" cy="80" rx="8" ry="7" fill={papier} />
          <ellipse cx="64" cy="80" rx="8" ry="7" fill={papier} />
          <ellipse cx="31" cy="56" rx="7" ry="9" transform="rotate(-25 31 56)" fill={papier} />
          <ellipse cx="69" cy="56" rx="7" ry="9" transform="rotate(25 69 56)" fill={papier} />
          <ellipse cx="50" cy="64" rx="17" ry="20" fill={papier} />
          <circle cx="38" cy="22" r="6" fill={papier} />
          <circle cx="62" cy="22" r="6" fill={papier} />
          <circle cx="50" cy="34" r="15" fill={papier} />
          <ellipse cx="50" cy="39" rx="6" ry="4.5" strokeWidth={1.4} />
          <circle cx="44" cy="31" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="56" cy="31" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      )

    case "pot":
      return (
        <svg {...commun}>
          <rect x="28" y="30" width="44" height="13" rx="3" fill={papier} />
          <path d="M31 43 H69 V78 a8 8 0 0 1 -8 8 H39 a8 8 0 0 1 -8 -8 Z" fill={papier} />
          <path d="M31 56 Q50 62 69 56" strokeWidth={1.4} />
          <path d="M42 69 Q50 64 58 69 Q50 74 42 69 Z" strokeWidth={1.4} />
        </svg>
      )

    case "parfum":
      return (
        <svg {...commun}>
          <rect x="41" y="16" width="18" height="16" rx="3" fill={papier} />
          <rect x="45" y="32" width="10" height="8" fill={papier} />
          <path
            d="M30 52 a12 12 0 0 1 12 -12 H58 a12 12 0 0 1 12 12 V80 a8 8 0 0 1 -8 8 H38 a8 8 0 0 1 -8 -8 Z"
            fill={papier}
          />
          <path d="M50 52 L60 64 L50 76 L40 64 Z" strokeWidth={1.4} />
        </svg>
      )
  }
}
