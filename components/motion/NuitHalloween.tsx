/**
 * Halloween, « la nuit des Trois Frontières » (campagne, config/site.ts) :
 * le jaune du logo devient la pleine lune, des chauves-souris la traversent,
 * la brume monte de la Moselle. SVG + CSS seulement (app/globals.css,
 * section « Saison : Halloween ») ; tout s'immobilise si l'utilisateur
 * demande moins d'animations.
 */

/** Une chauve-souris : les ailes battent (CSS), le corps suit sa trajectoire. */
function ChauveSouris({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 64 28" className={className} style={style} aria-hidden>
      <g fill="currentColor">
        <path
          className="aile aile-g"
          d="M32 12C27 6 20 3 12 4c2 2 3 4 2 6-3-1-7-1-10 1 3 1 5 3 5 6 2-2 6-3 9-2 2-3 7-4 12-3Z"
        />
        <path
          className="aile aile-d"
          d="M32 12c5-6 12-9 20-8-2 2-3 4-2 6 3-1 7-1 10 1-3 1-5 3-5 6-2-2-6-3-9-2-2-3-7-4-12-3Z"
        />
        <path d="M29 9.5 30 6l1.5 2.4h1L34 6l1 3.5c1.2 1.5 1.3 4.6 0 6.5-1 1.6-5 1.6-6 0-1.3-1.9-1.2-5 0-6.5Z" />
      </g>
    </svg>
  )
}

export function LuneHalloween() {
  return (
    <div className="hw-ciel" aria-hidden>
      <div className="hw-etoiles" />
      <div className="hw-lune">
        <span className="hw-cratere hw-cratere-1" />
        <span className="hw-cratere hw-cratere-2" />
        <span className="hw-cratere hw-cratere-3" />
      </div>
      <ChauveSouris className="hw-chauve-souris hw-vol-1" />
      <ChauveSouris className="hw-chauve-souris hw-vol-2" />
      <ChauveSouris className="hw-chauve-souris hw-vol-3" />
      <div className="hw-brume" />
    </div>
  )
}

/**
 * La silhouette du pays, la nuit : collines de la Moselle, le château de
 * Sierck sur son éperon, des arbres tordus. Elle borde le haut du pied de page.
 */
export function SilhouetteHalloween() {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className="hw-silhouette block h-16 w-full sm:h-24"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 120V78c60-10 120-24 190-22 60 2 100 18 160 16 52-2 80-22 128-30l6-14h4v-18h8v-10l8-6 8 6v10h8v18h4l6 14c40 4 70-8 112-8 30 0 52 10 82 12l2-26h3v-7h5v7h3l2 26c46-6 92-26 150-26 64 0 108 26 170 26 56 0 88-18 140-22 40-3 80 6 118 14 52 10 100 6 137-2V120Z"
      />
      {/* Arbres morts sur la crête */}
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M268 74v-26m0 10-9-9m9 4 8-10m-8 18-6-4" />
        <path d="M1080 68v-30m0 12-10-10m10 5 9-12m-9 20 7-5" />
        <path d="M1236 74v-20m0 8-7-7m7 3 6-8" />
      </g>
    </svg>
  )
}
