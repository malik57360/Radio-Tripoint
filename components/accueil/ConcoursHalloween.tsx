import { JeuConcours } from "@/components/concours/JeuConcours"
import { Citrouille } from "@/components/marque/Citrouille"
import { site } from "@/config/site"
import { concoursTermine, FIN_TEXTE } from "@/lib/concours/jeu"
import type { Trad } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"

/**
 * Jeu concours d'Halloween : les lots, photographiés par l'équipe, dessinés
 * ici en pictogrammes (aucun logo de marque), le jeu « Le village hanté »
 * (components/concours/JeuConcours) et son règlement. Le bandeau du haut
 * (BandeauHalloween) renvoie ici, sur l'ancre #concours. Suit la campagne
 * Halloween de config/site.ts.
 */
const lots: { picto: React.ReactNode; nom: Trad; detail: Trad }[] = [
  {
    picto: <PictoGaufrier />,
    nom: {
      fr: "Un mini gaufrier tête de mort",
      de: "Ein Mini-Waffeleisen mit Totenkopf",
      lb: "E Mini-Wafeleisen mat Doudekapp",
      en: "A skull mini waffle maker",
      es: "Una minigofrera de calavera",
    },
    detail: {
      fr: "Ambiano · 550 W",
      de: "Ambiano · 550 W",
      lb: "Ambiano · 550 W",
      en: "Ambiano · 550 W",
      es: "Ambiano · 550 W",
    },
  },
  {
    picto: <PictoTasse />,
    nom: {
      fr: "Une tasse d’Halloween",
      de: "Eine Halloween-Tasse",
      lb: "Eng Halloween-Taass",
      en: "A Halloween mug",
      es: "Una taza de Halloween",
    },
    detail: {
      fr: "Crofton · chauves-souris",
      de: "Crofton · Fledermäuse",
      lb: "Crofton · Fliedermais",
      en: "Crofton · bats",
      es: "Crofton · murciélagos",
    },
  },
  {
    picto: <PictoSachet couleur="#7a4fd6" fonce="#4b2a91" />,
    nom: {
      fr: "Haribo Halloween Mix",
      de: "Haribo Halloween Mix",
      lb: "Haribo Halloween Mix",
      en: "Haribo Halloween Mix",
      es: "Haribo Halloween Mix",
    },
    detail: {
      fr: "Sachet de bonbons",
      de: "Tüte Süßigkeiten",
      lb: "Tut mat Séissegkeeten",
      en: "Bag of sweets",
      es: "Bolsa de golosinas",
    },
  },
  {
    picto: <PictoSachet couleur="#7cc43a" fonce="#3f7a17" />,
    nom: {
      fr: "Trolli Halloween Sweet & Sour",
      de: "Trolli Halloween Sweet & Sour",
      lb: "Trolli Halloween Sweet & Sour",
      en: "Trolli Halloween Sweet & Sour",
      es: "Trolli Halloween Sweet & Sour",
    },
    detail: {
      fr: "Bonbons sucrés et acidulés",
      de: "Süß und sauer",
      lb: "Séiss a sauer",
      en: "Sweet and sour sweets",
      es: "Golosinas dulces y ácidas",
    },
  },
  {
    picto: <PictoSucettes />,
    nom: {
      fr: "Des sucettes en chocolat",
      de: "Schoko-Lollis",
      lb: "Schockela-Lollien",
      en: "Chocolate lollies",
      es: "Piruletas de chocolate",
    },
    detail: {
      fr: "Choco Lolly · citrouilles",
      de: "Choco Lolly · Kürbisse",
      lb: "Choco Lolly · Kürbissen",
      en: "Choco Lolly · pumpkins",
      es: "Choco Lolly · calabazas",
    },
  },
]

export async function ConcoursHalloween() {
  if (!site.campagne.halloween) return null
  const t = await traducteur()
  const [premier, ...autres] = lots
  const ferme = concoursTermine()
  const reglement = <Reglement />
  return (
    <section
      id="concours"
      aria-labelledby="titre-concours"
      className="conteneur scroll-mt-24 pt-10 lg:pt-14"
    >
      <div className="concours-hw relative isolate overflow-hidden p-6 sm:p-9 lg:p-12">
        <div className="concours-hw-lueur" aria-hidden />
        <div className="lg:grid lg:grid-cols-[0.85fr_1.5fr] lg:gap-12">
          <div>
            <p className="surtitre concours-hw-surtitre flex items-center gap-2">
              <Citrouille className="h-5 w-auto flex-none" />
              {t({
                fr: "Jeu concours d’Halloween",
                de: "Halloween-Gewinnspiel",
                lb: "Halloween-Gewinnspill",
                en: "Halloween contest",
                es: "Concurso de Halloween",
              })}
            </p>
            <h2
              id="titre-concours"
              className="titre-affiche mt-4 text-[clamp(2.4rem,1.4rem+4vw,4.4rem)]"
            >
              {t({
                fr: "Des lots",
                de: "Preise",
                lb: "Präisser",
                en: "Prizes",
                es: "Premios",
              })}
              <br />
              <span className="concours-hw-accent">
                {t({
                  fr: "à gagner",
                  de: "zu gewinnen",
                  lb: "ze gewannen",
                  en: "to win",
                  es: "en juego",
                })}
              </span>
            </h2>
            <p className="presse concours-hw-texte mt-4 max-w-sm text-[1.1rem] leading-snug">
              {t({
                fr: "Un gaufrier, une tasse, des bonbons et du chocolat : la nuit des Trois Frontières se fête aussi à table.",
                de: "Ein Waffeleisen, eine Tasse, Süßigkeiten und Schokolade: Die Nacht des Dreiländerecks wird auch am Tisch gefeiert.",
                lb: "E Wafeleisen, eng Taass, Séissegkeeten a Schockela: D’Nuecht vum Dräilännereck gëtt och um Dësch gefeiert.",
                en: "A waffle maker, a mug, sweets and chocolate: the night of the Three Borders is celebrated at the table too.",
                es: "Una gofrera, una taza, golosinas y chocolate: la noche de las Tres Fronteras también se celebra en la mesa.",
              })}
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-0">
            <li className="concours-lot concours-lot-vedette col-span-2 flex items-center gap-5 p-5 sm:p-6">
              <span className="concours-picto size-24 flex-none sm:size-28">{premier.picto}</span>
              <span>
                <span className="titre-carte block text-[1.3rem] leading-tight sm:text-[1.55rem]">
                  {t(premier.nom)}
                </span>
                <span className="concours-lot-detail mt-1.5 block text-sm">
                  {t(premier.detail)}
                </span>
              </span>
            </li>
            {autres.map((lot, i) => (
              <li key={lot.nom.fr} className="concours-lot flex flex-col gap-3 p-4 sm:p-5">
                <span
                  className="concours-picto size-14 sm:size-16"
                  style={{ animationDelay: `${0.6 + i * 0.45}s` }}
                >
                  {lot.picto}
                </span>
                <span>
                  <span className="block text-[0.98rem] leading-snug font-bold">{t(lot.nom)}</span>
                  <span className="concours-lot-detail mt-1 block text-[0.8rem]">
                    {t(lot.detail)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <JeuConcours ferme={ferme} reglement={reglement} />

        <details id="reglement-concours" className="concours-reglement mt-10 scroll-mt-24">
          <summary className="cursor-pointer text-sm font-bold">
            {t({
              fr: "Règlement du jeu",
              de: "Teilnahmebedingungen",
              lb: "Reglement vum Spill",
              en: "Contest rules",
              es: "Bases del concurso",
            })}
          </summary>
          {reglement}
        </details>
      </div>
    </section>
  )
}

/** Règlement : les règles que le serveur applique (lib/concours/serveur.ts), en clair. */
const ARTICLES: { titre: Trad; texte: Trad }[] = [
  {
    titre: {
      fr: "Organisateur",
      de: "Veranstalter",
      lb: "Organisateur",
      en: "Organiser",
      es: "Organizador",
    },
    texte: {
      fr: "Radio Tripoint, éditée par {societe}.",
      de: "Radio Tripoint, herausgegeben von {societe}.",
      lb: "Radio Tripoint, erausginn vun {societe}.",
      en: "Radio Tripoint, published by {societe}.",
      es: "Radio Tripoint, editada por {societe}.",
    },
  },
  {
    titre: { fr: "Durée", de: "Dauer", lb: "Dauer", en: "Dates", es: "Duración" },
    texte: {
      fr: "Du lancement du jeu sur ce site jusqu’au {fin} (heure de Paris), en manches d’un jour : chaque manche se termine à 18 h. Une partie commencée avant 18 h compte pour la manche du jour.",
      de: "Vom Start des Spiels auf dieser Website bis zum {fin} (Pariser Zeit), in Tagesrunden: Jede Runde endet um 18 Uhr. Eine vor 18 Uhr begonnene Runde zählt für den laufenden Tag.",
      lb: "Vum Start vum Spill op dësem Site bis den {fin} (Paräisser Zäit), an Ronne vun engem Dag: All Ronn hält um 18 Auer op. Eng Partie, déi virun 18 Auer ugefaang gouf, zielt fir deen Dag.",
      en: "From the launch of the game on this site until {fin} (Paris time), in daily rounds: each round ends at 6 pm. A game started before 6 pm counts for that day’s round.",
      es: "Desde el lanzamiento del juego en este sitio hasta el {fin} (hora de París), en rondas diarias: cada ronda termina a las 18:00. Una partida empezada antes de las 18:00 cuenta para la ronda del día.",
    },
  },
  {
    titre: {
      fr: "Participation",
      de: "Teilnahme",
      lb: "Participatioun",
      en: "Entry",
      es: "Participación",
    },
    texte: {
      fr: "Gratuite, sans obligation d’achat, ouverte à toute personne physique ; les mineurs jouent avec l’accord d’un parent. Parties illimitées : dans chaque manche, seul le meilleur score de chaque adresse e-mail compte.",
      de: "Kostenlos, ohne Kaufverpflichtung, offen für alle natürlichen Personen; Minderjährige spielen mit Zustimmung eines Elternteils. Unbegrenzt viele Spiele: In jeder Tagesrunde zählt nur das beste Ergebnis jeder E-Mail-Adresse.",
      lb: "Gratis, ouni Kafverflichtung, op fir all natierlech Persoun; Mannerjäreg spille mam Accord vun engem Elterendeel. Onlimitéiert Parties: An all Ronn zielt just de beschte Score vun all E-Mail-Adress.",
      en: "Free, no purchase necessary, open to any individual; minors play with a parent’s consent. Unlimited games: in each round, only the best score of each email address counts.",
      es: "Gratuita, sin obligación de compra, abierta a cualquier persona física; los menores juegan con el permiso de un padre o madre. Partidas ilimitadas: en cada ronda solo cuenta la mejor puntuación de cada correo.",
    },
  },
  {
    titre: { fr: "Gagnants", de: "Gewinner", lb: "Gewënner", en: "Winners", es: "Ganadores" },
    texte: {
      fr: "Chaque jour à 18 h, le meilleur score de la manche remporte le lot du jour, parmi les lots présentés ci-dessus. À égalité, le premier à avoir atteint ce score l’emporte. Les gagnants sont affichés sous le classement, par leur pseudo.",
      de: "Jeden Tag um 18 Uhr gewinnt die beste Punktzahl der Runde den Tagespreis, aus den oben gezeigten Preisen. Bei Gleichstand gewinnt, wer die Punktzahl zuerst erreicht hat. Die Gewinner stehen mit ihrem Spitznamen unter der Rangliste.",
      lb: "All Dag um 18 Auer gewënnt de beschte Score vun der Ronn de Präis vum Dag, ënnert de Präisser hei uewen. Bei Gläichstand gewënnt deen, deen de Score fir d’éischt erreecht huet. D’Gewënner stinn mat hirem Spëtznumm ënner dem Classement.",
      en: "Every day at 6 pm, the round’s best score wins the prize of the day, from the prizes shown above. In a tie, whoever reached that score first wins. Winners are listed by nickname under the leaderboard.",
      es: "Cada día a las 18:00, la mejor puntuación de la ronda gana el premio del día, entre los premios presentados arriba. En caso de empate, gana quien alcanzó primero esa puntuación. Los ganadores aparecen con su seudónimo bajo la clasificación.",
    },
  },
  {
    titre: {
      fr: "Remise du lot",
      de: "Übergabe",
      lb: "Iwwergab",
      en: "Prize delivery",
      es: "Entrega",
    },
    texte: {
      fr: "Chaque gagnant est prévenu par e-mail dans les 7 jours suivant sa manche. Sans réponse 7 jours après ce message, le lot revient au joueur suivant de la manche. Les lots ne sont ni échangeables ni remboursables en argent.",
      de: "Jeder Gewinner wird innerhalb von 7 Tagen nach seiner Runde per E-Mail benachrichtigt. Ohne Antwort 7 Tage nach dieser Nachricht geht der Preis an den Nächsten der Runde. Die Preise können nicht getauscht oder ausgezahlt werden.",
      lb: "All Gewënner kritt bannent 7 Deeg no senger Ronn eng E-Mail. Ouni Äntwert 7 Deeg no dësem Message geet de Präis un deen nächste vun der Ronn. D’Präisser kënnen net getosch oder an Suen ausbezuelt ginn.",
      en: "Each winner is notified by email within 7 days of their round. With no reply 7 days after that message, the prize goes to the next player of that round. Prizes cannot be exchanged or paid out in cash.",
      es: "Cada ganador recibe un correo en los 7 días siguientes a su ronda. Sin respuesta 7 días después de ese mensaje, el premio pasa al siguiente jugador de la ronda. Los premios no se cambian ni se canjean por dinero.",
    },
  },
  {
    titre: { fr: "Loyauté", de: "Fairness", lb: "Fairness", en: "Fair play", es: "Juego limpio" },
    texte: {
      fr: "Chaque score est recalculé et vérifié par notre serveur. Radio Tripoint peut écarter une partie truquée ou un pseudo inapproprié.",
      de: "Jede Punktzahl wird von unserem Server neu berechnet und geprüft. Radio Tripoint kann manipulierte Runden oder unangemessene Spitznamen ausschließen.",
      lb: "All Score gëtt vun eisem Server nei gerechent a kontrolléiert. Radio Tripoint kann eng manipuléiert Partie oder en onpassende Spëtznumm ausschléissen.",
      en: "Every score is recalculated and checked by our server. Radio Tripoint may exclude a rigged game or an inappropriate nickname.",
      es: "Cada puntuación la recalcula y verifica nuestro servidor. Radio Tripoint puede excluir una partida amañada o un seudónimo inapropiado.",
    },
  },
  {
    titre: { fr: "Données", de: "Daten", lb: "Donnéeën", en: "Your data", es: "Datos" },
    texte: {
      fr: "Le pseudo apparaît dans le classement. L’e-mail sert uniquement à prévenir le gagnant : il n’est jamais affiché ni transmis. Tout est effacé 30 jours après la clôture. Questions et droits : {email}.",
      de: "Der Spitzname erscheint in der Rangliste. Die E-Mail dient nur zur Benachrichtigung des Gewinners: Sie wird nie angezeigt oder weitergegeben. Alles wird 30 Tage nach Spielende gelöscht. Fragen und Rechte: {email}.",
      lb: "De Spëtznumm steet am Classement. D’E-Mail déngt just dofir, de Gewënner ze kontaktéieren: Si gëtt ni ugewisen oder weiderginn. Alles gëtt 30 Deeg nom Enn geläscht. Froen a Rechter: {email}.",
      en: "Your nickname appears on the leaderboard. Your email is used only to contact the winner: it is never shown or shared. Everything is deleted 30 days after closing. Questions and rights: {email}.",
      es: "El seudónimo aparece en la clasificación. El correo solo sirve para avisar al ganador: nunca se muestra ni se cede. Todo se borra 30 días después del cierre. Preguntas y derechos: {email}.",
    },
  },
]

async function Reglement() {
  const t = await traducteur()
  const { raisonSociale, formeJuridique, siegeSocial } = site.legal
  const valeurs: Record<string, string> = {
    societe: [raisonSociale, formeJuridique, siegeSocial].filter(Boolean).join(", "),
    fin: t(FIN_TEXTE),
    email: site.contact.email,
  }
  return (
    <dl className="concours-hw-texte mt-4 grid gap-3 text-sm leading-relaxed sm:grid-cols-2 lg:grid-cols-3">
      {ARTICLES.map((a, i) => (
        <div key={a.titre.fr}>
          <dt className="font-bold">
            {i + 1}. {t(a.titre)}
          </dt>
          <dd className="mt-0.5">
            {t(a.texte).replace(/\{(\w+)\}/g, (_, k: string) => valeurs[k] ?? "")}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/* Pictogrammes des lots : dessinés pour le site, à la manière de la citrouille du logo. */

function PictoGaufrier() {
  return (
    <svg viewBox="0 0 64 64" className="size-full" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#1b1424" stroke="#3a2f45" strokeWidth="2" />
      <circle cx="32" cy="32" r="25" fill="#e5a04a" />
      <clipPath id="concours-gaufre">
        <circle cx="32" cy="32" r="25" />
      </clipPath>
      <g stroke="#b9772c" strokeWidth="1.6" opacity="0.85" clipPath="url(#concours-gaufre)">
        <path d="M7 20h50M7 28h50M7 36h50M7 44h50M20 7v50M28 7v50M36 7v50M44 7v50" />
      </g>
      <circle cx="32" cy="32" r="25" fill="none" stroke="#c98535" strokeWidth="2" />
      {/* La tête de mort, en relief dans la pâte. */}
      <g fill="#f6d391" stroke="#c98535" strokeWidth="1.2">
        <path d="M32 15c-8 0-13 5.4-13 12.3 0 4 1.8 7 4.6 8.8V41c0 1.4 1.1 2.5 2.5 2.5h11.8c1.4 0 2.5-1.1 2.5-2.5v-4.9c2.8-1.8 4.6-4.8 4.6-8.8C45 20.4 40 15 32 15Z" />
      </g>
      <g fill="#b9772c">
        <ellipse cx="26.6" cy="28.4" rx="3.6" ry="3.9" />
        <ellipse cx="37.4" cy="28.4" rx="3.6" ry="3.9" />
        <path d="M32 31.6 34 35.4h-4Z" />
        <path d="M27.4 38.4h9.2v1.4h-9.2z" />
        <path d="M29.6 37.6h1.2v3.4h-1.2zM33.2 37.6h1.2v3.4h-1.2z" />
      </g>
    </svg>
  )
}

function PictoTasse() {
  return (
    <svg viewBox="0 0 64 64" className="size-full" aria-hidden>
      {/* Vapeur */}
      <g
        className="concours-vapeur"
        stroke="var(--citrouille)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M23 15c-2.5-2.5 2.5-4.5 0-7" />
        <path d="M31 15c-2.5-2.5 2.5-4.5 0-7" />
        <path d="M39 15c-2.5-2.5 2.5-4.5 0-7" />
      </g>
      <path d="M46 26h3.5a7 7 0 0 1 0 14H46" fill="none" stroke="var(--hw-os)" strokeWidth="4.5" />
      <path d="M13 20h34v26a8 8 0 0 1-8 8H21a8 8 0 0 1-8-8Z" fill="var(--hw-os)" />
      <ellipse cx="30" cy="20" rx="17" ry="2.6" fill="#d9cfc0" />
      {/* Chauves-souris du décor */}
      <g fill="#17101e">
        <path d="M24 31c-1.6-2-4-2.8-6.5-2.4.7.6 1 1.4.6 2.1-1-.4-2.4-.3-3.3.3 1 .3 1.6 1 1.7 2 .7-.7 2-1 3-.7.6-1 2.3-1.4 4.5-1.3Zm0 0c1.6-2 4-2.8 6.5-2.4-.7.6-1 1.4-.6 2.1 1-.4 2.4-.3 3.3.3-1 .3-1.6 1-1.7 2-.7-.7-2-1-3-.7-.6-1-2.3-1.4-4.5-1.3Z" />
        <path d="M37 41c-1.2-1.5-3-2.1-4.9-1.8.5.5.8 1 .5 1.6-.8-.3-1.8-.2-2.5.2.8.2 1.2.8 1.3 1.5.5-.5 1.5-.7 2.3-.5.5-.8 1.7-1 3.3-1Zm0 0c1.2-1.5 3-2.1 4.9-1.8-.5.5-.8 1-.5 1.6.8-.3 1.8-.2 2.5.2-.8.2-1.2.8-1.3 1.5-.5-.5-1.5-.7-2.3-.5-.5-.8-1.7-1-3.3-1Z" />
      </g>
    </svg>
  )
}

function PictoSachet({ couleur, fonce }: { couleur: string; fonce: string }) {
  return (
    <svg viewBox="0 0 64 64" className="size-full" aria-hidden>
      {/* Sachet soudé en dents de scie, une fenêtre sur les bonbons. */}
      <path
        d="M14 12l3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 2 44c0 1.2-1 2-2.2 2H14.2c-1.2 0-2.2-.8-2.2-2Z"
        fill={couleur}
      />
      <path d="M13.6 17h36.8" stroke={fonce} strokeWidth="2" />
      <rect x="19" y="24" width="26" height="24" rx="5" fill="#120c18" opacity="0.85" />
      <circle cx="26" cy="31" r="3.6" fill="var(--citrouille)" />
      <circle cx="37" cy="30" r="3" fill="#f5eee3" />
      <circle cx="33" cy="40" r="3.8" fill="#e8394a" />
      <circle cx="24.5" cy="41.5" r="2.8" fill="#9ee05a" />
      <circle cx="40" cy="41" r="2.4" fill="var(--bougie)" />
      <path d="M17 52h30" stroke={fonce} strokeWidth="2" opacity="0.7" />
    </svg>
  )
}

function PictoSucettes() {
  return (
    <svg viewBox="0 0 64 64" className="size-full" aria-hidden>
      {[
        { x: 12, r: -10 },
        { x: 30, r: 8 },
      ].map(({ x, r }) => (
        <g key={x} transform={`rotate(${r} ${x + 11} 40)`}>
          <rect x={x + 9.5} y="38" width="3" height="22" rx="1.5" fill="var(--hw-os)" />
          <rect x={x} y="6" width="22" height="34" rx="3" fill="#6b3f22" />
          <path
            d={`M${x + 7.3} 6v34M${x + 14.7} 6v34M${x} 17.3h22M${x} 28.6h22`}
            stroke="#4a2914"
            strokeWidth="1.4"
          />
          <circle cx={x + 11} cy="23" r="5" fill="var(--citrouille)" />
          <path d={`M${x + 11} 18v-2.4`} stroke="#3d5a1e" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  )
}
