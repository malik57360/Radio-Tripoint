/**
 * « Le village hanté », le jeu du concours d'Halloween : une ville des
 * Trois Frontières apparaît, on dit vite de quel pays elle est.
 *
 * Ce fichier est partagé par le navigateur (le jeu) et le serveur (qui
 * rejoue la partie pour recalculer le score) : même suite de villes pour
 * une même graine, même barème. Le navigateur n'envoie que ses réponses et
 * ses temps de réponse ; le score qu'il affiche n'est jamais cru tel quel.
 */
import type { Trad } from "@/lib/i18n/langues"

export type Pays = "FR" | "LU" | "DE"
export const PAYS: Pays[] = ["FR", "LU", "DE"]

/** Communes et villages réels, nom officiel local. Pas de nom porté par deux pays. */
export const VILLES: { nom: string; pays: Pays }[] = [
  // France — Moselle
  { nom: "Sierck-les-Bains", pays: "FR" },
  { nom: "Apach", pays: "FR" },
  { nom: "Thionville", pays: "FR" },
  { nom: "Cattenom", pays: "FR" },
  { nom: "Rodemack", pays: "FR" },
  { nom: "Manderen", pays: "FR" },
  { nom: "Contz-les-Bains", pays: "FR" },
  { nom: "Kerling-lès-Sierck", pays: "FR" },
  { nom: "Rustroff", pays: "FR" },
  { nom: "Launstroff", pays: "FR" },
  { nom: "Merschweiller", pays: "FR" },
  { nom: "Évrange", pays: "FR" },
  { nom: "Basse-Rentgen", pays: "FR" },
  { nom: "Kœnigsmacker", pays: "FR" },
  { nom: "Hettange-Grande", pays: "FR" },
  { nom: "Yutz", pays: "FR" },
  { nom: "Metz", pays: "FR" },
  { nom: "Bouzonville", pays: "FR" },
  { nom: "Waldwisse", pays: "FR" },
  { nom: "Mondorff", pays: "FR" },
  // Luxembourg
  { nom: "Schengen", pays: "LU" },
  { nom: "Remich", pays: "LU" },
  { nom: "Mondorf-les-Bains", pays: "LU" },
  { nom: "Grevenmacher", pays: "LU" },
  { nom: "Wormeldange", pays: "LU" },
  { nom: "Remerschen", pays: "LU" },
  { nom: "Schwebsange", pays: "LU" },
  { nom: "Wellenstein", pays: "LU" },
  { nom: "Bech-Kleinmacher", pays: "LU" },
  { nom: "Stadtbredimus", pays: "LU" },
  { nom: "Ehnen", pays: "LU" },
  { nom: "Wasserbillig", pays: "LU" },
  { nom: "Mertert", pays: "LU" },
  { nom: "Dudelange", pays: "LU" },
  { nom: "Esch-sur-Alzette", pays: "LU" },
  { nom: "Bettembourg", pays: "LU" },
  { nom: "Echternach", pays: "LU" },
  { nom: "Frisange", pays: "LU" },
  { nom: "Dalheim", pays: "LU" },
  // Allemagne — Sarre et Rhénanie-Palatinat
  { nom: "Perl", pays: "DE" },
  { nom: "Nennig", pays: "DE" },
  { nom: "Besch", pays: "DE" },
  { nom: "Sinz", pays: "DE" },
  { nom: "Borg", pays: "DE" },
  { nom: "Orscholz", pays: "DE" },
  { nom: "Mettlach", pays: "DE" },
  { nom: "Merzig", pays: "DE" },
  { nom: "Saarburg", pays: "DE" },
  { nom: "Nittel", pays: "DE" },
  { nom: "Palzem", pays: "DE" },
  { nom: "Wincheringen", pays: "DE" },
  { nom: "Konz", pays: "DE" },
  { nom: "Trier", pays: "DE" },
  { nom: "Saarlouis", pays: "DE" },
  { nom: "Saarbrücken", pays: "DE" },
  { nom: "Oberbillig", pays: "DE" },
  { nom: "Wellen", pays: "DE" },
  { nom: "Temmels", pays: "DE" },
  { nom: "Losheim am See", pays: "DE" },
]

/**
 * Le concours se joue en manches d'un jour : chaque jour à 18 h (heure de
 * Paris), le meilleur score de la manche gagne le lot du jour. La dernière
 * manche se termine le 31 octobre à 18 h.
 */
export const HEURE_TIRAGE = 18
export const FIN_CONCOURS = "2026-10-31T18:00:00+01:00"
export const concoursTermine = (maintenant = Date.now()) =>
  maintenant >= new Date(FIN_CONCOURS).getTime()
export const FIN_TEXTE: Trad = {
  fr: "31 octobre, 18 h",
  de: "31. Oktober, 18 Uhr",
  lb: "31. Oktober, 18 Auer",
  en: "31 October, 6 pm",
  es: "31 de octubre, 18:00",
}

/** Durée d'une partie : le temps passé devant les villes, pauses entre deux villes exclues. */
export const DUREE_MS = 60_000
export const VIES = 3
/** En dessous, ce n'est pas une main humaine : la partie est refusée. */
export const REPONSE_MIN_MS = 250
/** Le plus de villes qu'on puisse voir en une partie (60 s ÷ 250 ms). */
export const VILLES_MAX = Math.floor(DUREE_MS / REPONSE_MIN_MS)

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
function hasard(graine: number) {
  let a = graine >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * La suite des villes d'une partie : toutes les villes mélangées, puis un
 * nouveau mélange quand la liste est épuisée, sans jamais deux fois la même
 * ville de suite.
 */
export function suiteVilles(graine: number, n = VILLES_MAX): number[] {
  const r = hasard(graine)
  const suite: number[] = []
  while (suite.length < n) {
    const paquet = VILLES.map((_, i) => i)
    for (let i = paquet.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1))
      ;[paquet[i], paquet[j]] = [paquet[j], paquet[i]]
    }
    if (paquet[0] === suite.at(-1)) paquet.push(paquet.shift()!)
    suite.push(...paquet)
  }
  return suite.slice(0, n)
}

export type Reponse = { pays: Pays; ms: number }

/** Multiplicateur de série : ×2 dès 5 bonnes réponses d'affilée, ×3 dès 10, ×4 dès 15. */
export const multiplicateur = (serie: number) => Math.min(4, 1 + Math.floor(serie / 5))

/** Bonus de vitesse : 100 points pour une réponse immédiate, 0 au-delà de 2,5 s. */
export const bonusVitesse = (ms: number) => Math.max(0, Math.min(100, Math.round((2500 - ms) / 25)))

export type Bilan = {
  points: number
  bonnes: number
  serieMax: number
  vies: number
  /** Réponses comptées : celles d'après la fin de la partie sont ignorées. */
  comptees: number
  tempsMs: number
}

/** Une bonne réponse rapporte (100 + bonus de vitesse) × multiplicateur de série. */
export function gainPour(ms: number, serie: number) {
  return (100 + bonusVitesse(ms)) * multiplicateur(serie)
}

/**
 * Rejoue une partie et compte les points. Les règles s'appliquent à la
 * lettre : la partie s'arrête à la troisième erreur ou quand le temps est
 * écoulé, et la réponse qui fait dépasser le temps ne compte pas.
 */
export function compter(graine: number, reponses: Reponse[]): Bilan {
  const suite = suiteVilles(graine, Math.min(reponses.length, VILLES_MAX))
  const b: Bilan = { points: 0, bonnes: 0, serieMax: 0, vies: VIES, comptees: 0, tempsMs: 0 }
  let serie = 0
  for (let i = 0; i < suite.length; i++) {
    const { pays, ms } = reponses[i]
    if (b.vies <= 0 || b.tempsMs + ms > DUREE_MS) break
    b.tempsMs += ms
    b.comptees++
    if (VILLES[suite[i]].pays === pays) {
      serie++
      b.bonnes++
      b.serieMax = Math.max(b.serieMax, serie)
      b.points += gainPour(ms, serie)
    } else {
      serie = 0
      b.vies--
    }
  }
  return b
}
