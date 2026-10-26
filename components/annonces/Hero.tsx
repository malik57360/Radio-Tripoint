import { BarreRecherche } from "./Vitrine"

/**
 * L'ouverture ne démarre qu'une fois la police des titres arrivée (1,2 s au
 * plus). Sans cela, au téléphone, le titre monte dans la police de secours,
 * plus large, puis saute d'un coup à Archivo en pleine animation.
 */
const ATTENDRE_POLICE = `(function(){var s=document.currentScript,o=s&&s.closest(".ouverture-tripoint"),t=o&&o.querySelector(".titre-hero");if(!t||!document.fonts||!document.fonts.load)return;var go=function(){o.removeAttribute("data-attente")};try{var f="900 1em "+getComputedStyle(t).fontFamily.split(",")[0];if(document.fonts.check(f))return;o.setAttribute("data-attente","");document.fonts.load(f).then(go,go);setTimeout(go,1200)}catch(e){go()}})()`

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
    // data-attente est posé par le script avant l'hydratation : React ne doit pas s'en émouvoir.
    <section
      className="ouverture-tripoint"
      aria-labelledby="titre-annonces"
      suppressHydrationWarning
    >
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
        {/* Les cercles sont centrés sur l'origine d'un groupe placé au point de
            rencontre : ils grandissent depuis leur centre sur tous les navigateurs,
            Safari d'iPhone compris, sans dépendre de transform-box. */}
        <g transform="translate(270 112)">
          <circle r="34" fill="url(#halo)" className="point" />
          <circle r="4" fill="none" stroke="#f9b800" strokeWidth="0.8" className="onde" />
          <circle r="3.6" fill="#f9b800" className="point" />
        </g>
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
        <script dangerouslySetInnerHTML={{ __html: ATTENDRE_POLICE }} />
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
