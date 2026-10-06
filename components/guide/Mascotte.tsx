import { useId } from "react"
import { cn } from "@/lib/utils/cn"

const TRAIT = "#1c0b2b"

/** Grains de la grappe sous la tête, du haut vers le bas (dessinés derrière). */
const GRAINS = [
  { cx: 37, cy: 90, r: 14 },
  { cx: 83, cy: 90, r: 14 },
  { cx: 60, cy: 96, r: 15 },
  { cx: 47, cy: 113, r: 13 },
  { cx: 73, cy: 113, r: 13 },
  { cx: 60, cy: 129, r: 12 },
] as const

/**
 * Les trois drapeaux, accrochés au foulard comme une petite guirlande :
 * France, Allemagne, Luxembourg (l'ordre du logo). Assez grands et bien
 * à plat pour se lire même sur la pastille de 40 px.
 */
const DRAPEAUX = [
  // France : bandes verticales
  { x: 25, rot: -9, sens: "v", couleurs: ["#0055a4", "#ffffff", "#ef4135"] },
  // Allemagne : bandes horizontales
  { x: 49, rot: 0, sens: "h", couleurs: ["#000000", "#dd0000", "#ffce00"] },
  // Luxembourg : bandes horizontales
  { x: 73, rot: 9, sens: "h", couleurs: ["#ea141d", "#ffffff", "#51adda"] },
] as const
const D_L = 22
const D_H = 15
const D_Y = 95

/**
 * Tripo, la mascotte du guide : une grappe de raisin de la Moselle, le
 * vignoble que partagent la France, le Luxembourg et l'Allemagne. Sa tête
 * est le gros grain du haut, coiffé d'une feuille de vigne et d'une vrille,
 * casque de radio sur les oreilles ; il porte un foulard jaune Radio
 * Tripoint d'où pend une guirlande des trois drapeaux. Façon
 * autocollant : un liseré blanc l'entoure pour se lire sur fond clair comme
 * sur fond noir. SVG net de la pastille (40 px) à la page ; respiration et
 * clignement dans globals.css, coupés par prefers-reduced-motion.
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
  const grain = `tripo-grain-${id}`

  const tete = "M60 22C82 22 95 38 95 58C95 78 80 90 60 90C40 90 25 78 25 58C25 38 38 22 60 22Z"
  const arceau = "M28 58C26 33 43 22 60 22C77 22 94 33 92 58"
  const queue = "M60 24C60 17 62 12 66 8"
  const feuille =
    "M66 9C63 3 67 -2 72 0C73 -6 81 -7 83 -2C88 -5 95 -1 92 4C97 7 95 14 88 13C86 18 78 18 76 13C71 16 66 14 66 9Z"
  const vrille = "M58 20C51 17 48 11 52 7C55 5 59 8 56 11"
  const foulard = "M33 80Q60 94 87 80L84 90Q60 103 36 90Z"
  const drapeau = (x: number, rot: number) => ({
    x,
    y: D_Y,
    width: D_L,
    height: D_H,
    rx: 1.5,
    transform: `rotate(${rot} ${x + D_L / 2} ${D_Y})`,
  })

  return (
    <svg
      viewBox="0 -8 120 154"
      className={cn("mascotte", anime && "mascotte-anime", className)}
      role={titre ? "img" : undefined}
      aria-label={titre}
      aria-hidden={titre ? undefined : true}
    >
      <defs>
        <radialGradient id={grain} cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#c9a2ec" />
          <stop offset="45%" stopColor="#8546c2" />
          <stop offset="100%" stopColor="#4c1d7c" />
        </radialGradient>
        {DRAPEAUX.map((d, i) => (
          // Pas de rotation ici : le groupe qui l'utilise est déjà tourné.
          <clipPath key={i} id={`tripo-drapeau-${i}-${id}`}>
            <rect x={d.x} y={D_Y} width={D_L} height={D_H} rx={1.5} />
          </clipPath>
        ))}
      </defs>

      <g className="mascotte-corps">
        {/* Liseré blanc « autocollant » */}
        <g fill="#fff" stroke="#fff" strokeLinejoin="round" strokeLinecap="round">
          {GRAINS.map((g, i) => (
            <circle key={i} cx={g.cx} cy={g.cy} r={g.r} strokeWidth="9" />
          ))}
          <path d={tete} strokeWidth="9" />
          <path d={arceau} fill="none" strokeWidth="17" />
          <rect x="15" y="46" width="21" height="31" rx="10" strokeWidth="5" />
          <rect x="84" y="46" width="21" height="31" rx="10" strokeWidth="5" />
          <path d={queue} fill="none" strokeWidth="10" />
          <path d={feuille} strokeWidth="7" />
          <path d={vrille} fill="none" strokeWidth="7" />
          <path d={foulard} strokeWidth="6" />
          <path d="M30 96Q60 104 90 96" fill="none" strokeWidth="6" />
          {DRAPEAUX.map((d, i) => (
            <rect key={i} {...drapeau(d.x, d.rot)} strokeWidth="7" />
          ))}
        </g>

        {/* La grappe */}
        {GRAINS.map((g, i) => (
          <g key={i}>
            <circle
              cx={g.cx}
              cy={g.cy}
              r={g.r}
              fill={`url(#${grain})`}
              stroke={TRAIT}
              strokeWidth="2.6"
            />
            <ellipse
              cx={g.cx - g.r * 0.35}
              cy={g.cy - g.r * 0.4}
              rx={g.r * 0.32}
              ry={g.r * 0.2}
              fill="#fff"
              opacity="0.55"
              transform={`rotate(-30 ${g.cx - g.r * 0.35} ${g.cy - g.r * 0.4})`}
            />
          </g>
        ))}

        {/* La tête : le gros grain du haut */}
        <path d={tete} fill={`url(#${grain})`} stroke={TRAIT} strokeWidth="2.8" />
        <ellipse
          cx="45"
          cy="38"
          rx="11"
          ry="6"
          fill="#fff"
          opacity="0.5"
          transform="rotate(-30 45 38)"
        />
        <circle cx="36" cy="49" r="2.4" fill="#fff" opacity="0.6" />

        {/* Casque de radio */}
        <path d={arceau} fill="none" stroke={TRAIT} strokeWidth="7" strokeLinecap="round" />
        <rect x="17" y="48" width="17" height="27" rx="8" fill={TRAIT} />
        <rect x="86" y="48" width="17" height="27" rx="8" fill={TRAIT} />
        <rect x="21" y="53" width="4" height="10" rx="2" fill="#f9b800" />
        <rect x="95" y="53" width="4" height="10" rx="2" fill="#f9b800" />

        {/* Queue, vrille et feuille de vigne */}
        <path d={queue} fill="none" stroke="#6b5a2b" strokeWidth="4" strokeLinecap="round" />
        <path d={vrille} fill="none" stroke="#5e8a26" strokeWidth="2.4" strokeLinecap="round" />
        <path d={feuille} fill="#6fb03d" stroke={TRAIT} strokeWidth="2.4" strokeLinejoin="round" />
        <path
          d="M68 9L74 1M68 9L82 -2M68 9L90 4M68 9L86 12M68 9L78 14"
          fill="none"
          stroke="#3f6b1b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Joues */}
        <ellipse cx="40" cy="66" rx="6.5" ry="4" fill="#ff8fb1" opacity="0.6" />
        <ellipse cx="80" cy="66" rx="6.5" ry="4" fill="#ff8fb1" opacity="0.6" />

        {/* Yeux */}
        <g className="mascotte-yeux">
          <ellipse cx="49" cy="55" rx="6" ry="7.5" fill={TRAIT} />
          <ellipse cx="71" cy="55" rx="6" ry="7.5" fill={TRAIT} />
          <circle cx="51.3" cy="51.8" r="2.4" fill="#fff" />
          <circle cx="73.3" cy="51.8" r="2.4" fill="#fff" />
          <circle cx="47" cy="58" r="1.1" fill="#fff" opacity="0.85" />
          <circle cx="69" cy="58" r="1.1" fill="#fff" opacity="0.85" />
        </g>

        {/* Sourire */}
        <path
          d="M52 66Q60 76 68 66Z"
          fill="#2a0f1f"
          stroke={TRAIT}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <ellipse cx="60" cy="71" rx="3.6" ry="2" fill="#ff7a9a" />

        {/* Foulard jaune Radio Tripoint, pans aux couleurs des trois pays */}
        <path d={foulard} fill="#f9b800" stroke={TRAIT} strokeWidth="2.4" strokeLinejoin="round" />
        {/* Guirlande : la ficelle, puis les trois drapeaux */}
        <path d="M30 96Q60 104 90 96" fill="none" stroke={TRAIT} strokeWidth="1.6" />
        {DRAPEAUX.map((d, i) => {
          const r = drapeau(d.x, d.rot)
          return (
            <g key={i} transform={r.transform}>
              <g clipPath={`url(#tripo-drapeau-${i}-${id})`}>
                {d.couleurs.map((couleur, j) =>
                  d.sens === "v" ? (
                    <rect
                      key={j}
                      x={r.x + (j * D_L) / 3}
                      y={r.y}
                      width={D_L / 3}
                      height={D_H}
                      fill={couleur}
                    />
                  ) : (
                    <rect
                      key={j}
                      x={r.x}
                      y={r.y + (j * D_H) / 3}
                      width={D_L}
                      height={D_H / 3}
                      fill={couleur}
                    />
                  ),
                )}
              </g>
              <rect {...r} transform={undefined} fill="none" stroke={TRAIT} strokeWidth="1.6" />
            </g>
          )
        })}
        <circle cx="84" cy="88" r="5.5" fill="#f9b800" stroke={TRAIT} strokeWidth="2.4" />
      </g>
    </svg>
  )
}
