import { useId } from "react"
import { cn } from "@/lib/utils/cn"

const NOIR = "#0a0a0a"
const JAUNE_OMBRE = "#d99a00"

/**
 * Tripo, la mascotte du guide : une petite boule jaune toute douce (la
 * couleur du logo), casque de radio sur les oreilles. Façon autocollant :
 * un liseré blanc l'entoure pour qu'il se lise sur fond clair comme sur
 * fond noir. Dessiné en SVG pour rester net de la pastille (40 px) à la
 * page dédiée. Respiration et clignement dans globals.css, coupés par
 * prefers-reduced-motion.
 */
export function Mascotte({
  className,
  anime = false,
  titre,
}: {
  className?: string
  /** Respiration et clignement des yeux. */
  anime?: boolean
  /** Texte alternatif ; sans lui, le dessin est décoratif. */
  titre?: string
}) {
  const id = useId().replace(/:/g, "")
  const relief = `tripo-relief-${id}`

  const corps =
    "M60 22C88 22 103 46 103 72C103 95 86 106 60 106C34 106 17 95 17 72C17 46 32 22 60 22Z"
  const arceau = "M24 60C22 34 40 26 60 26C80 26 98 34 96 60"

  return (
    <svg
      viewBox="0 0 120 124"
      className={cn("mascotte", anime && "mascotte-anime", className)}
      role={titre ? "img" : undefined}
      aria-label={titre}
      aria-hidden={titre ? undefined : true}
    >
      <defs>
        <radialGradient id={relief} cx="40%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#ffe38a" />
          <stop offset="50%" stopColor="#f9b800" />
          <stop offset="100%" stopColor="#e3a400" />
        </radialGradient>
      </defs>

      <g className="mascotte-corps">
        {/* Liseré blanc « autocollant » */}
        <g fill="#fff" stroke="#fff" strokeLinejoin="round" strokeLinecap="round">
          <path d={corps} strokeWidth="9" />
          <path d={arceau} fill="none" strokeWidth="17" />
          <rect x="8" y="50" width="21" height="32" rx="10" strokeWidth="5" />
          <rect x="91" y="50" width="21" height="32" rx="10" strokeWidth="5" />
          <ellipse cx="44" cy="107" rx="12" ry="7.5" strokeWidth="5" />
          <ellipse cx="76" cy="107" rx="12" ry="7.5" strokeWidth="5" />
          <path d="M52 24C50 15 56 10 60 15C62 9 70 10 68 19" strokeWidth="9" />
        </g>

        {/* Pieds */}
        <ellipse
          cx="44"
          cy="107"
          rx="11"
          ry="6.5"
          fill={JAUNE_OMBRE}
          stroke={NOIR}
          strokeWidth="2.5"
        />
        <ellipse
          cx="76"
          cy="107"
          rx="11"
          ry="6.5"
          fill={JAUNE_OMBRE}
          stroke={NOIR}
          strokeWidth="2.5"
        />

        {/* Corps tout doux */}
        <path d={corps} fill={`url(#${relief})`} stroke={NOIR} strokeWidth="2.8" />
        <ellipse
          cx="44"
          cy="44"
          rx="13"
          ry="8"
          fill="#fff"
          opacity="0.32"
          transform="rotate(-24 44 44)"
        />

        {/* Mèche */}
        <path
          d="M52 24C50 15 56 10 60 15C62 9 70 10 68 19"
          fill="none"
          stroke={NOIR}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Casque de radio */}
        <path d={arceau} fill="none" stroke={NOIR} strokeWidth="7" strokeLinecap="round" />
        <rect x="10" y="52" width="17" height="28" rx="8" fill={NOIR} />
        <rect x="93" y="52" width="17" height="28" rx="8" fill={NOIR} />
        <rect x="14" y="57" width="4" height="11" rx="2" fill="#f9b800" />
        <rect x="102" y="57" width="4" height="11" rx="2" fill="#f9b800" />

        {/* Petits bras */}
        <path
          d="M28 86C22 88 20 94 24 97"
          fill="none"
          stroke={NOIR}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M92 86C98 88 100 94 96 97"
          fill="none"
          stroke={NOIR}
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Joues */}
        <ellipse cx="36" cy="80" rx="7" ry="4.2" fill="#ff8f5e" opacity="0.5" />
        <ellipse cx="84" cy="80" rx="7" ry="4.2" fill="#ff8f5e" opacity="0.5" />

        {/* Yeux */}
        <g className="mascotte-yeux">
          <ellipse cx="47" cy="67" rx="6.5" ry="8" fill={NOIR} />
          <ellipse cx="73" cy="67" rx="6.5" ry="8" fill={NOIR} />
          <circle cx="49.5" cy="63.8" r="2.5" fill="#fff" />
          <circle cx="75.5" cy="63.8" r="2.5" fill="#fff" />
          <circle cx="45" cy="70" r="1.1" fill="#fff" opacity="0.8" />
          <circle cx="71" cy="70" r="1.1" fill="#fff" opacity="0.8" />
        </g>

        {/* Sourire */}
        <path
          d="M53 81Q60 88 67 81"
          fill="none"
          stroke={NOIR}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
