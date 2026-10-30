import { cn } from "@/lib/utils/cn"

/**
 * La signature du site : trois frontières (France, Luxembourg, Allemagne)
 * qui se dessinent et se rejoignent en un point — le tripoint — d'où part
 * l'antenne. Les ondes s'accélèrent quand le direct joue (data-antenne sur
 * <html>, posé par EtatAntenne). SVG + CSS : rien à charger, rien à attendre.
 *
 * Ce qui tourne en boucle (orbite, ondes, battement du point) vit dans des
 * calques à part, animés par transform et opacité : le navigateur les
 * déplace sans redessiner le tracé à chaque image. Les frontières et les
 * pays restent un seul dessin. Le point de rencontre (330, 300 sur 600) est
 * à 55 % de la largeur et 50 % de la hauteur (app/globals.css, .tripoint).
 */
export function Tripoint({ className }: { className?: string }) {
  // Point de rencontre des trois tracés.
  const cx = 330
  const cy = 300
  return (
    <span className={cn("tripoint", className)} aria-hidden>
      {/* Orbite radar qui tourne lentement : tout le calque tourne. */}
      <svg viewBox="0 0 600 600" className="tripoint-orbite" fill="none">
        <circle
          cx={cx}
          cy={cy}
          r="210"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.5"
          strokeDasharray="2 10"
        />
        <circle
          cx={cx}
          cy={cy}
          r="150"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeDasharray="1 6"
        />
      </svg>

      {/* Ondes émises par l'antenne. */}
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="tripoint-onde" style={{ animationDelay: `${1.8 + i * 0.9}s` }} />
      ))}

      <svg viewBox="0 0 600 600" className="tripoint-dessin" fill="none">
        {/* Les trois frontières : elles se tracent puis se rejoignent. */}
        <path
          className="tripoint-trace"
          style={{ animationDelay: "0.15s" }}
          d={`M-10 590 C 80 520, 120 470, 170 430 S 260 360, ${cx} ${cy}`}
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
        />
        <path
          className="tripoint-trace"
          style={{ animationDelay: "0.35s" }}
          d={`M370 -10 C 350 60, 390 110, 360 170 S 320 250, ${cx} ${cy}`}
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
        />
        <path
          className="tripoint-trace"
          style={{ animationDelay: "0.55s" }}
          d={`M610 470 C 540 440, 500 380, 450 360 S 380 320, ${cx} ${cy}`}
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
        />

        {/* Les pays, à l'extrémité de leur frontière. */}
        <g
          className="tripoint-pays"
          fontWeight="900"
          fontSize="22"
          fill="currentColor"
          letterSpacing="2"
        >
          <text x="40" y="520" style={{ animationDelay: "1.3s" }}>
            FR
          </text>
          <text x="392" y="48" style={{ animationDelay: "1.45s" }}>
            LU
          </text>
          <text x="520" y="410" style={{ animationDelay: "1.6s" }}>
            DE
          </text>
        </g>
      </svg>

      {/* Le point : l'antenne, en rouge comme le direct. */}
      <span className="tripoint-point" />
    </span>
  )
}
