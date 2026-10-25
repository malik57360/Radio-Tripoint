import { BarreRecherche } from "./Vitrine"

/**
 * Ouverture de l'accueil des annonces : le tripoint. Trois lignes partent
 * du sud-ouest (France), du nord (Luxembourg) et de l'est (Allemagne) et se
 * rejoignent en un point — là où, à Schengen, les trois pays se touchent.
 * C'est la seule animation qui joue d'elle-même sur le site, une fois, au
 * chargement ; la recherche apparaît au point de rencontre.
 */
export function HeroTripoint({
  q,
  lieu,
  enLigne,
}: {
  q?: string
  lieu?: string
  /** Nombre réel d'annonces en ligne (rien n'est arrondi ni gonflé). */
  enLigne: number
}) {
  return (
    <section className="ouverture-tripoint" aria-labelledby="titre-annonces">
      <svg
        className="traces"
        viewBox="0 0 400 320"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#f9b800" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f9b800" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* France, du sud-ouest */}
        <path
          className="trace"
          pathLength={1}
          d="M-60 330 C 30 280, 140 250, 206 196 S 262 128, 270 112"
          stroke="rgb(255 255 255 / 0.32)"
          strokeWidth="1.4"
        />
        {/* Luxembourg, du nord */}
        <path
          className="trace"
          pathLength={1}
          d="M232 -20 C 222 30, 270 58, 268 84 S 270 104, 270 112"
          stroke="#f9b800"
          strokeWidth="1.6"
        />
        {/* Allemagne, de l'est */}
        <path
          className="trace"
          pathLength={1}
          d="M440 210 C 350 196, 322 172, 300 150 S 274 118, 270 112"
          stroke="rgb(255 255 255 / 0.32)"
          strokeWidth="1.4"
        />
        <circle cx="270" cy="112" r="34" fill="url(#halo)" className="point" />
        <circle
          cx="270"
          cy="112"
          r="4"
          fill="none"
          stroke="#f9b800"
          strokeWidth="0.8"
          className="onde"
        />
        <circle cx="270" cy="112" r="3.6" fill="#f9b800" className="point" />
      </svg>

      <div className="conteneur relative pt-9 pb-11 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-24">
        <p
          className="apparait text-nuit-accent text-[0.95rem] font-bold"
          style={{ "--delai": "0.15s" } as React.CSSProperties}
        >
          Les Petites Annonces du Tripoint
        </p>
        <h1 id="titre-annonces" className="titre-hero mt-3">
          <span className="ligne">
            <span>Achetez.</span>
          </span>
          <span className="ligne">
            <span>Vendez.</span>
          </span>
          <span className="ligne">
            <span>Recrutez.</span>
          </span>
        </h1>
        <p
          className="apparait text-nuit-encre-2 mt-5 max-w-xl text-[1.05rem] leading-snug sm:text-[1.15rem]"
          style={{ "--delai": "0.55s" } as React.CSSProperties}
        >
          Entre voisins de France, du Luxembourg et d&apos;Allemagne. Chaque annonce est relue par
          l&apos;équipe de Radio Tripoint avant de paraître.
        </p>
        <div
          className="apparait capsule mt-7 max-w-3xl"
          style={{ "--delai": "0.85s" } as React.CSSProperties}
        >
          <BarreRecherche q={q} lieu={lieu} />
        </div>
        <p
          className="apparait text-nuit-encre-2 mt-4 text-sm"
          style={{ "--delai": "1.05s" } as React.CSSProperties}
        >
          {enLigne > 0
            ? `${enLigne.toLocaleString("fr-FR")} annonce${enLigne > 1 ? "s" : ""} en ligne en ce moment`
            : "La rubrique ouvre : les premières annonces arrivent."}
        </p>
      </div>
    </section>
  )
}
