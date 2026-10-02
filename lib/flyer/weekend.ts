import { tousEvenements } from "@/lib/contenu/evenements"
import { cleJour, heure } from "@/lib/utils/dates"
import type { Evenement } from "@/types/event"

const JOURS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."]
const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
]
const MOIS_COURT = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
]

/** Date « calendaire » (midi UTC) d'une clé AAAA-MM-JJ, pour compter les jours sans fuseau. */
const jourDe = (cle: string) => new Date(`${cle}T12:00:00Z`)
const cleDe = (d: Date) => d.toISOString().slice(0, 10)
const plus = (cle: string, n: number) => cleDe(new Date(jourDe(cle).getTime() + n * 86_400_000))

/** Coupe proprement un texte trop long pour sa ligne. */
const court = (t: string, max: number) =>
  t.length <= max ? t : `${t.slice(0, max - 1).replace(/[\s,·–-]+\S*$/, "")}…`

export interface LigneFlyer {
  slug: string
  titre: string
  ville: string
  pays: Evenement["pays"]
  /** Une ou deux lignes : « SAM. 03 », « SAM. 03 / AU DIM. 04 », « JUSQU’AU / 03 JANV. ». */
  quand: string[]
  detail: string
}

export interface Weekend {
  vendredi: string
  dimanche: string
  /** « 3 – 4 octobre 2026 », « 30 octobre – 1er novembre 2026 »… */
  titreDates: string
  lignes: LigneFlyer[]
}

/**
 * Le week-end à venir (ou en cours, du vendredi au dimanche), heure de Paris,
 * et les événements de l'agenda qui s'y déroulent — y compris ceux qui ont
 * commencé avant et durent encore.
 */
export async function weekend(reference = new Date(), debut?: string): Promise<Weekend> {
  let vendredi: string
  if (debut && /^\d{4}-\d{2}-\d{2}$/.test(debut)) vendredi = debut
  else {
    const auj = cleJour(reference)
    const dow = jourDe(auj).getUTCDay()
    // Ven., sam., dim. : le week-end en cours. Sinon le prochain vendredi.
    const recul = dow === 5 ? 0 : dow === 6 ? -1 : dow === 0 ? -2 : 5 - dow
    vendredi = plus(auj, recul)
  }
  const dimanche = plus(vendredi, 2)

  const tous = await tousEvenements("fr")
  const dans = tous.filter((e) => {
    const d = cleJour(new Date(e.debut))
    const f = cleJour(new Date(e.fin ?? e.debut))
    return d <= dimanche && f >= vendredi
  })
  const aVendredi = dans.some((e) => cleJour(new Date(e.debut)) === vendredi)
  const premier = aVendredi ? vendredi : plus(vendredi, 1)

  const a = jourDe(premier)
  const b = jourDe(dimanche)
  const jour = (d: Date) => (d.getUTCDate() === 1 ? "1er" : String(d.getUTCDate()))
  const titreDates =
    a.getUTCMonth() === b.getUTCMonth()
      ? `${jour(a)} – ${jour(b)} ${MOIS[b.getUTCMonth()]} ${b.getUTCFullYear()}`
      : `${jour(a)} ${MOIS[a.getUTCMonth()]} – ${jour(b)} ${MOIS[b.getUTCMonth()]} ${b.getUTCFullYear()}`

  const lignes = dans.map((e): LigneFlyer => {
    const d = cleJour(new Date(e.debut))
    const f = cleJour(new Date(e.fin ?? e.debut))
    const commenceAvant = d < vendredi
    const dureLongtemps = f > dimanche
    const jour = (k: string) =>
      `${JOURS[jourDe(k).getUTCDay()]} ${String(jourDe(k).getUTCDate()).padStart(2, "0")}`
    let quand: string[]
    if (commenceAvant) {
      const fin = jourDe(f)
      quand = [
        "jusqu’au",
        `${String(fin.getUTCDate()).padStart(2, "0")} ${MOIS_COURT[fin.getUTCMonth()]}`,
      ]
    } else if (dureLongtemps) quand = ["dès", jour(d)]
    else quand = f !== d ? [jour(d), `au ${jour(f)}`] : [jour(d)]
    const h = !e.journee && !commenceAvant && f === d ? heure(e.debut, "fr") : null
    return {
      slug: e.slug,
      titre: e.titre,
      ville: e.ville,
      pays: e.pays,
      quand: quand.map((q) => q.toUpperCase()),
      detail: court(
        [`${e.ville} (${NOM_PAYS[e.pays]})`, h, e.lieu !== e.ville ? e.lieu : null]
          .filter(Boolean)
          .join(" · "),
        62,
      ),
    }
  })

  return { vendredi, dimanche, titreDates, lignes }
}

export const NOM_PAYS: Record<Evenement["pays"], string> = {
  FR: "France",
  LU: "Luxembourg",
  DE: "Allemagne",
}

const JOURS_LONGS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
const heureCourte = (iso: string) =>
  heure(iso, "fr")
    .replace(/ h 00$/, "H")
    .replace(" h ", "H")
    .replace(/^0/, "")

export interface CarteFlyer {
  slug: string
  titre: string
  accroche: string
  lieu: string
  /** Pastille de couleur : tarif publié, ou horaire pour ce qui dure. */
  pastille?: { texte: string; ton: "gratuit" | "prix" | "horaire" }
  /** Macaron : « 18H », « 10H / 18H », « SAM. & DIM. ». */
  macaron: string[]
  visuel?: Evenement["visuel"]
}

export interface SectionFlyer {
  titre: string
  cartes: CarteFlyer[]
}

const PAYS_COURT: Record<Evenement["pays"], string> = { FR: "", LU: " (LU)", DE: " (DE)" }

function accrocheDe(e: Evenement) {
  if (e.flyer?.accroche) return e.flyer.accroche
  const phrase = e.description.split(/(?<=[.!?])\s/)[0].replace(/[.!]$/, "")
  return phrase.length <= 60 ? phrase : `${phrase.slice(0, 58).replace(/[\s,;:–-]+\S*$/, "")}…`
}

function pastilleDe(e: Evenement, multi: boolean, debutCle: string): CarteFlyer["pastille"] {
  if (e.flyer?.tarif)
    return { texte: e.flyer.tarif, ton: /GRATUIT/i.test(e.flyer.tarif) ? "gratuit" : "prix" }
  if (e.gratuit) return { texte: "ENTRÉE GRATUITE", ton: "gratuit" }
  if (multi && !e.journee)
    return {
      texte: `Dès ${heureCourte(e.debut).toLowerCase()} le ${JOURS_LONGS[jourDe(debutCle).getUTCDay()]}`,
      ton: "horaire",
    }
  return undefined
}

/**
 * Le programme du flyer : d'abord ce qui dure tout le week-end, puis un
 * bloc par jour. Les événements commencés avant le vendredi (foires de
 * plusieurs semaines) n'y figurent pas, sauf s'ils démarrent ce week-end.
 */
export async function programmeFlyer(
  reference = new Date(),
  debut?: string,
): Promise<{
  vendredi: string
  dimanche: string
  dates: string
  sections: SectionFlyer[]
  total: number
}> {
  const w = await weekend(reference, debut)
  const tous = (await tousEvenements("fr")).filter((e) => {
    const d = cleJour(new Date(e.debut))
    const f = cleJour(new Date(e.fin ?? e.debut))
    return d >= w.vendredi && d <= w.dimanche && f >= d
  })
  const multi: CarteFlyer[] = []
  const parJour = new Map<string, CarteFlyer[]>()
  for (const e of tous) {
    const d = cleJour(new Date(e.debut))
    const f = cleJour(new Date(e.fin ?? e.debut))
    const plusieurs = f > d
    const fin = f > w.dimanche ? w.dimanche : f
    const j = (k: string) => JOURS[jourDe(k).getUTCDay()].toUpperCase()
    const macaron = plusieurs
      ? fin === plus(d, 1)
        ? [`${j(d)}`, `& ${j(fin)}`]
        : [`${j(d)}`, `AU ${j(fin)}`]
      : e.journee
        ? ["TOUTE LA", "JOURNÉE"]
        : e.fin && !e.journee
          ? [heureCourte(e.debut), heureCourte(e.fin)]
          : [heureCourte(e.debut)]
    const carte: CarteFlyer = {
      slug: e.slug,
      titre: e.flyer?.titre ?? e.titre,
      accroche: accrocheDe(e),
      lieu:
        e.flyer?.lieu ??
        `${e.lieu === e.ville ? e.ville : `${e.lieu}, ${e.ville}`}${PAYS_COURT[e.pays]}`,
      pastille: pastilleDe(e, plusieurs, d),
      macaron,
      visuel: e.visuel,
    }
    if (plusieurs) multi.push(carte)
    else parJour.set(d, [...(parJour.get(d) ?? []), carte])
  }
  const sections: SectionFlyer[] = []
  if (multi.length) sections.push({ titre: "Tout le week-end", cartes: multi })
  for (const k of [...parJour.keys()].sort()) {
    const j = jourDe(k)
    sections.push({
      titre: `${JOURS_LONGS[j.getUTCDay()]} ${j.getUTCDate() === 1 ? "1er" : j.getUTCDate()} ${MOIS[j.getUTCMonth()]}`,
      cartes: parJour.get(k)!,
    })
  }
  // Macaron de dates : « 3 & 4 OCTOBRE », « 23 AU 25 OCTOBRE ».
  const premier = tous.length
    ? tous.map((e) => cleJour(new Date(e.debut))).sort()[0]
    : plus(w.vendredi, 1)
  const a = jourDe(premier)
  const b = jourDe(w.dimanche)
  const sep = plus(premier, 1) === w.dimanche ? " & " : " AU "
  const dates =
    a.getUTCMonth() === b.getUTCMonth()
      ? `${a.getUTCDate()}${sep}${b.getUTCDate()} ${MOIS[b.getUTCMonth()]}`
      : `${a.getUTCDate()} ${MOIS_COURT[a.getUTCMonth()]}${sep}${b.getUTCDate()} ${MOIS_COURT[b.getUTCMonth()]}`
  return {
    vendredi: w.vendredi,
    dimanche: w.dimanche,
    dates: dates.toUpperCase(),
    sections,
    total: tous.length,
  }
}
