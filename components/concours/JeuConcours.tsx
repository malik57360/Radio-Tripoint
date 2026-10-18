"use client"

import { Play, X } from "lucide-react"
import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useLangue } from "@/components/i18n/Langue"
import { Citrouille } from "@/components/marque/Citrouille"
import { site } from "@/config/site"
import {
  compter,
  DUREE_MS,
  FIN_TEXTE,
  gainPour,
  multiplicateur,
  PAYS,
  REPONSE_MIN_MS,
  suiteVilles,
  VIES,
  VILLES,
  type Pays,
  type Reponse,
} from "@/lib/concours/jeu"
import { choisir, type Langue, type Trad } from "@/lib/i18n/langues"
import { cn } from "@/lib/utils/cn"

/**
 * « Frontières hantées » : le bouton Jouer, le classement, et la partie en
 * plein écran. Le score affiché ici est recalculé par le serveur à
 * l'enregistrement (app/api/concours/score) ; seules les réponses et leurs
 * temps partent.
 */

type Classement = { total: number; lignes: { pseudo: string; points: number }[] }

const TX = {
  titre: {
    fr: "Frontières hantées",
    de: "Spuk an der Grenze",
    lb: "Spuk op der Grenz",
    en: "Haunted Borders",
    es: "Fronteras embrujadas",
  },
  commentJouer: {
    fr: "Comment participer",
    de: "So machen Sie mit",
    lb: "Esou maacht Dir mat",
    en: "How to take part",
    es: "Cómo participar",
  },
  etape1: {
    fr: "Une ville apparaît : dites vite si elle est en France, au Luxembourg ou en Allemagne.",
    de: "Ein Ort erscheint: Sagen Sie schnell, ob er in Frankreich, Luxemburg oder Deutschland liegt.",
    lb: "En Uert erschéngt: Sot séier, ob en a Frankräich, Lëtzebuerg oder Däitschland läit.",
    en: "A town appears: say quickly whether it is in France, Luxembourg or Germany.",
    es: "Aparece una localidad: diga rápido si está en Francia, Luxemburgo o Alemania.",
  },
  etape2: {
    fr: "60 secondes, 3 vies. Plus vous répondez vite, plus vous marquez ; 5 bonnes réponses d’affilée doublent les points.",
    de: "60 Sekunden, 3 Leben. Je schneller Sie antworten, desto mehr Punkte; 5 richtige Antworten in Folge verdoppeln die Punkte.",
    lb: "60 Sekonnen, 3 Liewen. Wat Dir méi séier äntwert, wat Dir méi Punkte kritt; 5 richteg Äntwerten hannereneen verduebelen d’Punkten.",
    en: "60 seconds, 3 lives. The faster you answer, the more you score; 5 right answers in a row double the points.",
    es: "60 segundos, 3 vidas. Cuanto más rápido responda, más puntos; 5 aciertos seguidos duplican los puntos.",
  },
  etape3: {
    fr: "Enregistrez votre score avec un pseudo. Le {fin}, le meilleur score gagne tous les lots.",
    de: "Speichern Sie Ihr Ergebnis mit einem Spitznamen. Am {fin} gewinnt die beste Punktzahl alle Preise.",
    lb: "Späichert Äre Score mat engem Spëtznumm. Den {fin} gewënnt de beschte Score all d’Präisser.",
    en: "Save your score under a nickname. On {fin}, the best score wins all the prizes.",
    es: "Guarde su puntuación con un seudónimo. El {fin}, la mejor puntuación gana todos los premios.",
  },
  jouer: { fr: "Jouer", de: "Spielen", lb: "Spillen", en: "Play", es: "Jugar" },
  jouerPlaisir: {
    fr: "Jouer pour le plaisir",
    de: "Zum Spaß spielen",
    lb: "Fir de Spaass spillen",
    en: "Play for fun",
    es: "Jugar por diversión",
  },
  termine: {
    fr: "Le concours est terminé. Merci d’avoir joué !",
    de: "Das Gewinnspiel ist beendet. Danke fürs Mitspielen!",
    lb: "D’Gewinnspill ass eriwwer. Merci fir d’Matspillen!",
    en: "The contest is over. Thanks for playing!",
    es: "El concurso ha terminado. ¡Gracias por jugar!",
  },
  classement: {
    fr: "Classement",
    de: "Rangliste",
    lb: "Classement",
    en: "Leaderboard",
    es: "Clasificación",
  },
  classementVide: {
    fr: "Personne n’a encore joué : la première place est à prendre.",
    de: "Noch hat niemand gespielt: Platz eins ist frei.",
    lb: "Nach keen huet gespillt: déi éischt Plaz ass fräi.",
    en: "Nobody has played yet: first place is up for grabs.",
    es: "Nadie ha jugado aún: el primer puesto está libre.",
  },
  classementIndispo: {
    fr: "Classement indisponible pour le moment.",
    de: "Rangliste im Moment nicht verfügbar.",
    lb: "De Classement ass de Moment net disponibel.",
    en: "Leaderboard unavailable right now.",
    es: "Clasificación no disponible por ahora.",
  },
  points: { fr: "pts", de: "Pkt.", lb: "Pkt.", en: "pts", es: "pts" },
  fermer: { fr: "Fermer", de: "Schließen", lb: "Zoumaachen", en: "Close", es: "Cerrar" },
  cestParti: {
    fr: "C’est parti",
    de: "Los geht’s",
    lb: "Et geet lass",
    en: "Let’s go",
    es: "¡Vamos!",
  },
  question: {
    fr: "Cette ville est en…",
    de: "Dieser Ort liegt in…",
    lb: "Dësen Uert läit an…",
    en: "This town is in…",
    es: "Esta localidad está en…",
  },
  clavier: {
    fr: "Au clavier : ← ↓ → ou 1 2 3.",
    de: "Mit der Tastatur: ← ↓ → oder 1 2 3.",
    lb: "Mat der Tastatur: ← ↓ → oder 1 2 3.",
    en: "Keyboard: ← ↓ → or 1 2 3.",
    es: "Con el teclado: ← ↓ → o 1 2 3.",
  },
  score: { fr: "Score", de: "Punkte", lb: "Punkten", en: "Score", es: "Puntos" },
  vies: { fr: "Vies", de: "Leben", lb: "Liewen", en: "Lives", es: "Vidas" },
  tempsEcoule: {
    fr: "Temps écoulé",
    de: "Zeit abgelaufen",
    lb: "Zäit ofgelaf",
    en: "Time’s up",
    es: "Se acabó el tiempo",
  },
  plusDeVies: {
    fr: "Plus de vies",
    de: "Keine Leben mehr",
    lb: "Keng Liewe méi",
    en: "No lives left",
    es: "Sin vidas",
  },
  bonnes: {
    fr: "bonnes réponses",
    de: "richtige Antworten",
    lb: "richteg Äntwerten",
    en: "right answers",
    es: "aciertos",
  },
  serie: {
    fr: "meilleure série",
    de: "beste Serie",
    lb: "bescht Serie",
    en: "best streak",
    es: "mejor racha",
  },
  pseudo: {
    fr: "Pseudo, affiché dans le classement",
    de: "Spitzname, in der Rangliste sichtbar",
    lb: "Spëtznumm, am Classement ze gesinn",
    en: "Nickname, shown on the leaderboard",
    es: "Seudónimo, visible en la clasificación",
  },
  email: {
    fr: "E-mail, jamais affiché : seulement pour prévenir le gagnant",
    de: "E-Mail, nie angezeigt: nur um den Gewinner zu benachrichtigen",
    lb: "E-Mail, ni ugewisen: just fir de Gewënner ze kontaktéieren",
    en: "Email, never shown: only to contact the winner",
    es: "Correo, nunca visible: solo para avisar al ganador",
  },
  consentement: {
    fr: "J’accepte le règlement du jeu.",
    de: "Ich akzeptiere die Teilnahmebedingungen.",
    lb: "Ech akzeptéieren de Reglement vum Spill.",
    en: "I accept the contest rules.",
    es: "Acepto las bases del concurso.",
  },
  enregistrer: {
    fr: "Enregistrer mon score",
    de: "Ergebnis speichern",
    lb: "Score späicheren",
    en: "Save my score",
    es: "Guardar mi puntuación",
  },
  rejouer: {
    fr: "Rejouer",
    de: "Nochmal spielen",
    lb: "Nach eng Kéier",
    en: "Play again",
    es: "Jugar otra vez",
  },
  record: {
    fr: "Score enregistré : vous êtes {rang} sur {total}.",
    de: "Gespeichert: Sie sind auf Platz {rang} von {total}.",
    lb: "Gespäichert: Dir sidd op der Plaz {rang} vun {total}.",
    en: "Saved: you are number {rang} of {total}.",
    es: "Guardado: está en el puesto {rang} de {total}.",
  },
  pasRecord: {
    fr: "Votre meilleur score reste {meilleur} pts : vous êtes {rang} sur {total}.",
    de: "Ihr bestes Ergebnis bleibt {meilleur} Pkt.: Platz {rang} von {total}.",
    lb: "Äre beschte Score bleift {meilleur} Pkt.: Plaz {rang} vun {total}.",
    en: "Your best score stays at {meilleur} pts: you are number {rang} of {total}.",
    es: "Su mejor puntuación sigue en {meilleur} pts: puesto {rang} de {total}.",
  },
  horsFerme: {
    fr: "Le concours est terminé : cette partie est pour le plaisir.",
    de: "Das Gewinnspiel ist beendet: Diese Runde ist nur zum Spaß.",
    lb: "D’Gewinnspill ass eriwwer: Dës Partie ass just fir de Spaass.",
    en: "The contest is over: this game is just for fun.",
    es: "El concurso ha terminado: esta partida es solo por diversión.",
  },
  horsStockage: {
    fr: "Classement indisponible : cette partie ne peut pas être enregistrée.",
    de: "Rangliste nicht verfügbar: Diese Runde kann nicht gespeichert werden.",
    lb: "Classement net disponibel: Dës Partie kann net gespäichert ginn.",
    en: "Leaderboard unavailable: this game can’t be saved.",
    es: "Clasificación no disponible: esta partida no se puede guardar.",
  },
  erreurs: {
    pseudo: {
      fr: "Pseudo : 2 à 20 lettres ou chiffres.",
      de: "Spitzname: 2 bis 20 Buchstaben oder Ziffern.",
      lb: "Spëtznumm: 2 bis 20 Buschtawen oder Zifferen.",
      en: "Nickname: 2 to 20 letters or digits.",
      es: "Seudónimo: de 2 a 20 letras o cifras.",
    },
    email: {
      fr: "Adresse e-mail invalide.",
      de: "Ungültige E-Mail-Adresse.",
      lb: "Ongëlteg E-Mail-Adress.",
      en: "Invalid email address.",
      es: "Correo no válido.",
    },
    consentement: {
      fr: "Cochez la case du règlement.",
      de: "Bitte bestätigen Sie die Teilnahmebedingungen.",
      lb: "Klickt w.e.g. de Reglement un.",
      en: "Please tick the rules box.",
      es: "Marque la casilla de las bases.",
    },
    partie: {
      fr: "Cette partie a expiré : rejouez pour enregistrer un score.",
      de: "Diese Runde ist abgelaufen: Spielen Sie erneut, um zu speichern.",
      lb: "Dës Partie ass ofgelaf: Spillt nach eng Kéier fir ze späicheren.",
      en: "This game has expired: play again to save a score.",
      es: "Esta partida ha caducado: juegue de nuevo para guardar.",
    },
    invalide: {
      fr: "Partie refusée : réponses trop rapides pour être humaines.",
      de: "Runde abgelehnt: Antworten zu schnell für einen Menschen.",
      lb: "Partie refuséiert: Äntwerten ze séier fir e Mënsch.",
      en: "Game refused: answers too fast to be human.",
      es: "Partida rechazada: respuestas demasiado rápidas para ser humanas.",
    },
    ferme: {
      fr: "Le concours est terminé : cette partie ne compte plus.",
      de: "Das Gewinnspiel ist beendet: Diese Runde zählt nicht mehr.",
      lb: "D’Gewinnspill ass eriwwer: Dës Partie zielt net méi.",
      en: "The contest is over: this game no longer counts.",
      es: "El concurso ha terminado: esta partida ya no cuenta.",
    },
    autre: {
      fr: "Enregistrement impossible pour le moment. Réessayez dans un instant.",
      de: "Speichern im Moment nicht möglich. Bitte gleich nochmal versuchen.",
      lb: "Späicheren de Moment net méiglech. Probéiert gläich nach eng Kéier.",
      en: "Saving isn’t possible right now. Try again in a moment.",
      es: "No se puede guardar ahora. Inténtelo de nuevo en un momento.",
    },
  },
} satisfies Record<string, Trad | Record<string, Trad>>

const remplir = (texte: string, valeurs: Record<string, string | number>) =>
  texte.replace(/\{(\w+)\}/g, (_, k: string) => String(valeurs[k] ?? ""))

/** « 1er », « 2e »… en français ; ailleurs le chiffre seul suffit dans la phrase. */
const rangTexte = (rang: number, l: Langue) =>
  l === "fr" ? `${rang}${rang === 1 ? "er" : "e"}` : String(rang)

const nombre = (n: number, l: Langue) => n.toLocaleString(l === "lb" ? "de-LU" : l)

async function lireClassement(): Promise<Classement | "erreur"> {
  try {
    const r = await fetch("/api/concours/classement", { cache: "no-store" })
    return r.ok ? ((await r.json()) as Classement) : "erreur"
  } catch {
    return "erreur"
  }
}

export function JeuConcours({ ferme, reglement }: { ferme: boolean; reglement: React.ReactNode }) {
  const langue = useLangue()
  const t = <T,>(x: Trad<T>) => choisir(x, langue)
  const [ouvert, setOuvert] = useState(false)
  const [classement, setClassement] = useState<Classement | "erreur" | null>(null)
  const bouton = useRef<HTMLButtonElement>(null)

  // Le classement se charge à part : l'accueil est mis en cache, pas lui.
  useEffect(() => {
    let actif = true
    void lireClassement().then((c) => actif && setClassement(c))
    return () => {
      actif = false
    }
  }, [])
  const charger = useCallback(() => void lireClassement().then(setClassement), [])
  const fermer = useCallback(() => {
    setOuvert(false)
    bouton.current?.focus()
  }, [])

  return (
    <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[1fr_1fr] lg:gap-12">
      <div>
        <p className="surtitre concours-hw-surtitre">{t(TX.commentJouer)}</p>
        <h3 className="titre-affiche mt-3 text-[clamp(1.9rem,1.2rem+2.6vw,3rem)]">{t(TX.titre)}</h3>
        {ferme ? (
          <p className="concours-hw-texte mt-4 text-[1.02rem]">{t(TX.termine)}</p>
        ) : (
          <ol className="concours-etapes mt-5 space-y-3 text-[1rem] leading-snug">
            {[TX.etape1, TX.etape2, TX.etape3].map((e, i) => (
              <li key={i} className="flex gap-3">
                <span className="concours-etape-num flex-none" aria-hidden>
                  {i + 1}
                </span>
                <span>{remplir(t(e), { fin: t(FIN_TEXTE) })}</span>
              </li>
            ))}
          </ol>
        )}
        <button
          ref={bouton}
          type="button"
          onClick={() => setOuvert(true)}
          className="concours-jouer btn mt-7 min-h-14 w-full !px-8 text-[1.05rem] sm:w-auto"
        >
          <Play className="size-5 fill-current" aria-hidden />
          {t(ferme ? TX.jouerPlaisir : TX.jouer)}
        </button>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="surtitre concours-hw-surtitre">{t(TX.classement)}</p>
          {classement && classement !== "erreur" && classement.total > 0 && (
            <p className="concours-lot-detail text-xs">
              {remplir(
                t({
                  fr: "{n} joueur{s}",
                  de: "{n} Teilnehmende",
                  lb: "{n} Spiller",
                  en: "{n} player{s}",
                  es: "{n} participante{s}",
                }),
                { n: nombre(classement.total, langue), s: classement.total > 1 ? "s" : "" },
              )}
            </p>
          )}
        </div>
        <div className="concours-classement mt-3" aria-live="polite">
          {classement === null ? (
            <ol aria-hidden className="space-y-1.5">
              {[0, 1, 2].map((i) => (
                <li key={i} className="concours-ligne concours-ligne-vide h-11" />
              ))}
            </ol>
          ) : classement === "erreur" ? (
            <p className="concours-lot-detail py-3 text-sm">{t(TX.classementIndispo)}</p>
          ) : classement.lignes.length === 0 ? (
            <p className="concours-lot-detail py-3 text-sm">{t(TX.classementVide)}</p>
          ) : (
            <ol className="space-y-1.5">
              {classement.lignes.map((l, i) => (
                <li
                  key={`${i}-${l.pseudo}`}
                  className={cn(
                    "concours-ligne flex items-center gap-3 px-3 py-2.5",
                    i < 3 && "concours-podium",
                  )}
                >
                  <span className="concours-rang w-7 flex-none text-center font-bold tabular-nums">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-bold">{l.pseudo}</span>
                  <span className="flex-none tabular-nums">
                    {nombre(l.points, langue)}{" "}
                    <span className="concours-lot-detail text-xs">{t(TX.points)}</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {ouvert && (
        <Partie
          langue={langue}
          ferme={ferme}
          reglement={reglement}
          fermer={fermer}
          apresEnregistrement={charger}
        />
      )}
    </div>
  )
}

/* ─── La partie ─────────────────────────────────────────────────────────── */

type Retour = { bon: boolean; pays: Pays; gain: number }
type Etat = {
  phase: "regles" | "compte" | "jeu" | "fin"
  compte: number
  partie: { id: string | null; graine: number; hors: "ferme" | "stockage" | null }
  suite: number[]
  i: number
  reponses: Reponse[]
  tempsMs: number
  score: number
  serie: number
  vies: number
  retour: Retour | null
  fin: "temps" | "vies" | null
}
type Action =
  | { type: "compter" }
  | { type: "decompte" }
  | { type: "partir"; partie: Etat["partie"] }
  | { type: "repondre"; pays: Pays; ms: number }
  | { type: "suivant" }
  | { type: "tempsEcoule" }

const depart: Etat = {
  phase: "regles",
  compte: 3,
  partie: { id: null, graine: 0, hors: null },
  suite: [],
  i: 0,
  reponses: [],
  tempsMs: 0,
  score: 0,
  serie: 0,
  vies: VIES,
  retour: null,
  fin: null,
}

function jeu(e: Etat, a: Action): Etat {
  switch (a.type) {
    case "compter":
      return { ...depart, phase: "compte" }
    case "decompte":
      return { ...e, compte: Math.max(0, e.compte - 1) }
    case "partir":
      return { ...e, phase: "jeu", partie: a.partie, suite: suiteVilles(a.partie.graine) }
    case "repondre": {
      if (e.phase !== "jeu" || e.retour) return e
      // Même règle que le serveur : la réponse qui dépasse le temps ne compte pas.
      if (e.tempsMs + a.ms > DUREE_MS) return { ...e, phase: "fin", fin: "temps" }
      const bon = VILLES[e.suite[e.i]].pays === a.pays
      const serie = bon ? e.serie + 1 : 0
      const gain = bon ? gainPour(a.ms, serie) : 0
      return {
        ...e,
        reponses: [...e.reponses, { pays: a.pays, ms: a.ms }],
        tempsMs: e.tempsMs + a.ms,
        score: e.score + gain,
        serie,
        vies: bon ? e.vies : e.vies - 1,
        retour: { bon, pays: a.pays, gain },
      }
    }
    case "suivant":
      if (e.vies <= 0) return { ...e, phase: "fin", fin: "vies", retour: null }
      return { ...e, i: e.i + 1, retour: null }
    case "tempsEcoule":
      return e.phase === "jeu" ? { ...e, phase: "fin", fin: "temps" } : e
  }
}

const COULEURS: Record<Pays, string> = { FR: "fr", LU: "lu", DE: "de" }
const TOUCHES: Record<string, Pays> = {
  "1": "FR",
  ArrowLeft: "FR",
  "2": "LU",
  ArrowDown: "LU",
  "3": "DE",
  ArrowRight: "DE",
}

/** Le visiteur garde son pseudo et son e-mail d'une partie à l'autre, sur son appareil. */
const MEMO = "rt-concours-joueur"
function lireMemo(): { pseudo: string; email: string } {
  try {
    const m = JSON.parse(localStorage.getItem(MEMO) ?? "null") as {
      pseudo?: string
      email?: string
    } | null
    return { pseudo: m?.pseudo ?? "", email: m?.email ?? "" }
  } catch {
    return { pseudo: "", email: "" }
  }
}

function Partie({
  langue,
  ferme,
  reglement,
  fermer,
  apresEnregistrement,
}: {
  langue: Langue
  ferme: boolean
  reglement: React.ReactNode
  fermer: () => void
  apresEnregistrement: () => void
}) {
  const t = <T,>(x: Trad<T>) => choisir(x, langue)
  const nomsPays = choisir(site.pays, langue)
  const nomPays = (p: Pays) => nomsPays[PAYS.indexOf(p)]
  const [e, envoyer] = useReducer(jeu, depart)
  const debutVille = useRef<number | null>(null)
  const tempsJoue = useRef(0)
  const demandePartie = useRef<Promise<Etat["partie"]> | null>(null)
  const barre = useRef<HTMLSpanElement>(null)
  const secondes = useRef<HTMLSpanElement>(null)

  // Plein écran : la page ne défile plus derrière, Échap ferme.
  useEffect(() => {
    const avant = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    const touche = (ev: KeyboardEvent) => ev.key === "Escape" && fermer()
    window.addEventListener("keydown", touche)
    return () => {
      document.documentElement.style.overflow = avant
      window.removeEventListener("keydown", touche)
    }
  }, [fermer])

  const lancer = () => {
    demandePartie.current = fetch("/api/concours/partie", { method: "POST" })
      .then(async (r) => {
        if (r.ok) {
          const p = (await r.json()) as { id: string; graine: number }
          return { id: p.id, graine: p.graine, hors: null }
        }
        return {
          id: null,
          graine: Math.floor(Math.random() * 2 ** 32),
          hors: r.status === 410 ? "ferme" : "stockage",
        } as const
      })
      .catch(
        () =>
          ({ id: null, graine: Math.floor(Math.random() * 2 ** 32), hors: "stockage" }) as const,
      )
    envoyer({ type: "compter" })
  }

  // Décompte 3, 2, 1, puis la partie démarre dès que le serveur a répondu.
  useEffect(() => {
    if (e.phase !== "compte") return
    if (e.compte > 0) {
      const id = setTimeout(() => envoyer({ type: "decompte" }), 650)
      return () => clearTimeout(id)
    }
    let actif = true
    void demandePartie.current?.then((partie) => actif && envoyer({ type: "partir", partie }))
    return () => {
      actif = false
    }
  }, [e.phase, e.compte])

  // Une nouvelle ville est à l'écran : son chronomètre part.
  useEffect(() => {
    if (e.phase === "jeu" && !e.retour) debutVille.current = performance.now()
    else debutVille.current = null
  }, [e.phase, e.i, e.retour])

  useEffect(() => {
    tempsJoue.current = e.tempsMs
  }, [e.tempsMs])

  // Après une réponse : un temps pour voir le résultat, puis la ville suivante.
  useEffect(() => {
    if (!e.retour) return
    const id = setTimeout(() => envoyer({ type: "suivant" }), e.retour.bon ? 420 : 1100)
    return () => clearTimeout(id)
  }, [e.retour])

  // Le sablier : 60 s de temps de réponse, arrêté pendant les pauses.
  useEffect(() => {
    if (e.phase !== "jeu") return
    let image = 0
    const tic = () => {
      const enCours = debutVille.current === null ? 0 : performance.now() - debutVille.current
      const reste = Math.max(0, DUREE_MS - tempsJoue.current - enCours)
      if (barre.current) barre.current.style.transform = `scaleX(${reste / DUREE_MS})`
      if (secondes.current) secondes.current.textContent = String(Math.ceil(reste / 1000))
      if (reste <= 0 && debutVille.current !== null) {
        debutVille.current = null
        envoyer({ type: "tempsEcoule" })
        return
      }
      image = requestAnimationFrame(tic)
    }
    image = requestAnimationFrame(tic)
    return () => cancelAnimationFrame(image)
  }, [e.phase])

  const repondre = useCallback((pays: Pays) => {
    const d = debutVille.current
    if (d === null) return
    const ms = Math.round(performance.now() - d)
    // La ville vient d'apparaître : un appui aussi rapide est un appui en trop, pas une réponse.
    if (ms < REPONSE_MIN_MS) return
    debutVille.current = null
    envoyer({ type: "repondre", pays, ms })
    if (navigator.vibrate) {
      try {
        navigator.vibrate(12)
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (e.phase !== "jeu") return
    const touche = (ev: KeyboardEvent) => {
      const p = TOUCHES[ev.key]
      if (!p) return
      ev.preventDefault()
      repondre(p)
    }
    window.addEventListener("keydown", touche)
    return () => window.removeEventListener("keydown", touche)
  }, [e.phase, repondre])

  const ville = e.phase === "jeu" ? VILLES[e.suite[e.i]] : null
  const bonPays = ville?.pays

  // Rendu dans <body> : la page est animée (.ecran), et un parent transformé
  // ferait de « fixed » une position relative à la page au lieu de l'écran.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titre-partie"
      className="jeu-hw fixed inset-0 z-[90] flex flex-col"
    >
      <div className="jeu-hw-ciel" aria-hidden />
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <h2 id="titre-partie" className="titre-affiche flex-1 text-[1.35rem]">
            {t(TX.titre)}
          </h2>
          <button
            type="button"
            onClick={fermer}
            className="jeu-fermer grid size-11 place-items-center rounded-full"
            aria-label={t(TX.fermer)}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {e.phase === "regles" && (
          <div className="flex flex-1 flex-col justify-center gap-6 py-6">
            <Citrouille className="jeu-citrouille h-20 w-auto self-start" />
            <ol className="concours-etapes space-y-3 text-[1.05rem] leading-snug">
              {[TX.etape1, TX.etape2].map((x, i) => (
                <li key={i} className="flex gap-3">
                  <span className="concours-etape-num flex-none" aria-hidden>
                    {i + 1}
                  </span>
                  <span>{t(x)}</span>
                </li>
              ))}
            </ol>
            <p className="concours-lot-detail hidden text-sm sm:block">{t(TX.clavier)}</p>
            <button
              type="button"
              autoFocus
              onClick={lancer}
              className="concours-jouer btn mt-2 min-h-14 w-full text-[1.1rem]"
            >
              <Play className="size-5 fill-current" aria-hidden />
              {t(TX.cestParti)}
            </button>
          </div>
        )}

        {e.phase === "compte" && (
          <div className="grid flex-1 place-items-center">
            <span
              key={e.compte}
              className="jeu-compte titre-affiche text-[9rem] leading-none"
              aria-live="assertive"
            >
              {e.compte > 0 ? e.compte : "…"}
            </span>
          </div>
        )}

        {e.phase === "jeu" && ville && (
          <>
            <div className="mt-4 flex items-center gap-3">
              <span className="jeu-sablier relative h-2.5 flex-1 overflow-hidden rounded-full">
                <span
                  ref={barre}
                  className="jeu-sablier-reste absolute inset-0 origin-left rounded-full"
                />
              </span>
              <span ref={secondes} className="w-7 text-right font-bold tabular-nums" aria-hidden>
                60
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="tabular-nums">
                <span className="sr-only">{t(TX.score)} : </span>
                <span className="titre-affiche text-[2rem] leading-none">
                  {nombre(e.score, langue)}
                </span>
                {multiplicateur(e.serie) > 1 && (
                  <span key={multiplicateur(e.serie)} className="jeu-combo ml-2 align-middle">
                    ×{multiplicateur(e.serie)}
                  </span>
                )}
              </p>
              <p className="flex gap-1" aria-label={`${t(TX.vies)} : ${e.vies}`}>
                {Array.from({ length: VIES }, (_, k) => (
                  <Citrouille
                    key={k}
                    className={cn(
                      "h-7 w-auto transition-opacity",
                      k >= e.vies && "opacity-20 grayscale",
                    )}
                  />
                ))}
              </p>
            </div>

            <div className="relative grid flex-1 place-items-center py-6">
              <div
                key={e.i}
                className={cn(
                  "jeu-ville text-center",
                  e.retour &&
                    (e.retour.bon
                      ? `jeu-ville-bon jeu-vers-${COULEURS[e.retour.pays]}`
                      : "jeu-ville-faux"),
                )}
              >
                <p className="concours-lot-detail text-sm">{t(TX.question)}</p>
                <p
                  className="titre-affiche jeu-ville-nom mt-2 text-[clamp(2.2rem,1.2rem+6vw,4rem)] leading-[0.95] break-words"
                  aria-live="polite"
                >
                  {ville.nom}
                </p>
                <p className="jeu-retour mt-3 h-7 text-[1.05rem] font-bold">
                  {e.retour?.bon && <span className="jeu-gain">+{e.retour.gain}</span>}
                  {e.retour && !e.retour.bon && bonPays && (
                    <span className="jeu-correction">→ {nomPays(bonPays)}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {PAYS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => repondre(p)}
                  className={cn(
                    `jeu-porte jeu-porte-${COULEURS[p]} flex min-h-24 flex-col items-center justify-center gap-1 px-1`,
                    e.retour?.pays === p && (e.retour.bon ? "jeu-porte-bon" : "jeu-porte-faux"),
                    e.retour && !e.retour.bon && bonPays === p && "jeu-porte-attendue",
                  )}
                >
                  <span className="text-[0.7rem] font-bold tracking-[0.12em] opacity-70">{p}</span>
                  <span className="text-[0.95rem] leading-tight font-bold sm:text-[1.05rem]">
                    {nomPays(p)}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {e.phase === "fin" && (
          <Fin
            langue={langue}
            etat={e}
            ferme={ferme}
            reglement={reglement}
            rejouer={lancer}
            apresEnregistrement={apresEnregistrement}
          />
        )}
      </div>
    </div>,
    document.body,
  )
}

function Fin({
  langue,
  etat,
  ferme,
  reglement,
  rejouer,
  apresEnregistrement,
}: {
  langue: Langue
  etat: Etat
  ferme: boolean
  reglement: React.ReactNode
  rejouer: () => void
  apresEnregistrement: () => void
}) {
  const t = <T,>(x: Trad<T>) => choisir(x, langue)
  const bilan = compter(etat.partie.graine, etat.reponses)
  const [memo] = useState(lireMemo)
  const [pseudo, setPseudo] = useState(memo.pseudo)
  const [email, setEmail] = useState(memo.email)
  const [accord, setAccord] = useState(false)
  const [envoi, setEnvoi] = useState<"pret" | "envoi" | "fait">("pret")
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null)
  const hors = etat.partie.hors ?? (ferme ? "ferme" : null)

  const enregistrer = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!accord) return setMessage({ ok: false, texte: t(TX.erreurs.consentement) })
    setEnvoi("envoi")
    setMessage(null)
    try {
      localStorage.setItem(MEMO, JSON.stringify({ pseudo: pseudo.trim(), email: email.trim() }))
    } catch {}
    try {
      const r = await fetch("/api/concours/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: etat.partie.id,
          reponses: etat.reponses,
          pseudo: pseudo.trim(),
          email: email.trim(),
          consentement: true,
        }),
      })
      const d = (await r.json().catch(() => ({}))) as {
        erreur?: keyof typeof TX.erreurs
        record?: boolean
        rang?: number
        total?: number
        meilleur?: number
      }
      if (!r.ok) {
        const cle = d.erreur && d.erreur in TX.erreurs ? d.erreur : "autre"
        setMessage({ ok: false, texte: t(TX.erreurs[cle]) })
        // Une partie refusée ou expirée ne peut pas être renvoyée : il faut rejouer.
        setEnvoi(
          cle === "pseudo" || cle === "email" || cle === "consentement" || cle === "autre"
            ? "pret"
            : "fait",
        )
        return
      }
      setEnvoi("fait")
      const valeurs = {
        rang: rangTexte(d.rang ?? 0, langue),
        total: nombre(d.total ?? 0, langue),
        meilleur: nombre(d.meilleur ?? 0, langue),
      }
      setMessage({ ok: true, texte: remplir(t(d.record ? TX.record : TX.pasRecord), valeurs) })
      apresEnregistrement()
    } catch {
      setEnvoi("pret")
      setMessage({ ok: false, texte: t(TX.erreurs.autre) })
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-5 overflow-y-auto py-6">
      <div>
        <p className="surtitre concours-hw-surtitre">
          {t(etat.fin === "vies" ? TX.plusDeVies : TX.tempsEcoule)}
        </p>
        <p className="titre-affiche jeu-score-final mt-2 text-[clamp(3.5rem,2rem+8vw,5.5rem)] leading-none tabular-nums">
          {nombre(bilan.points, langue)}
          <span className="concours-lot-detail ml-2 text-[1.2rem]">{t(TX.points)}</span>
        </p>
        <p className="concours-lot-detail mt-2 text-sm">
          {bilan.bonnes} {t(TX.bonnes)} · {t(TX.serie)} {bilan.serieMax}
        </p>
      </div>

      {hors ? (
        <p className="concours-lot-detail text-sm">
          {t(hors === "ferme" ? TX.horsFerme : TX.horsStockage)}
        </p>
      ) : envoi !== "fait" ? (
        <form onSubmit={enregistrer} className="space-y-3" noValidate>
          <label className="block">
            <span className="concours-lot-detail text-sm">{t(TX.pseudo)}</span>
            <input
              value={pseudo}
              onChange={(ev) => setPseudo(ev.target.value)}
              required
              minLength={2}
              maxLength={20}
              autoComplete="nickname"
              className="jeu-champ mt-1 block w-full px-3 py-3"
            />
          </label>
          <label className="block">
            <span className="concours-lot-detail text-sm">{t(TX.email)}</span>
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
              maxLength={160}
              autoComplete="email"
              inputMode="email"
              className="jeu-champ mt-1 block w-full px-3 py-3"
            />
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={accord}
              onChange={(ev) => setAccord(ev.target.checked)}
              className="mt-0.5 size-5 flex-none accent-[var(--citrouille)]"
            />
            <span>{t(TX.consentement)}</span>
          </label>
          <details className="concours-reglement text-sm">
            <summary className="cursor-pointer underline underline-offset-2">
              {t({
                fr: "Lire le règlement",
                de: "Teilnahmebedingungen lesen",
                lb: "De Reglement liesen",
                en: "Read the rules",
                es: "Leer las bases",
              })}
            </summary>
            {reglement}
          </details>
          <button
            type="submit"
            disabled={envoi === "envoi"}
            className="concours-jouer btn min-h-13 w-full disabled:opacity-60"
          >
            {t(TX.enregistrer)}
          </button>
        </form>
      ) : null}

      {message && (
        <p
          role="status"
          className={cn(
            "text-[1rem] font-bold",
            message.ok ? "jeu-message-ok" : "jeu-message-erreur",
          )}
        >
          {message.texte}
        </p>
      )}

      <button type="button" onClick={rejouer} className="jeu-rejouer btn min-h-13 w-full">
        {t(TX.rejouer)}
      </button>
    </div>
  )
}
