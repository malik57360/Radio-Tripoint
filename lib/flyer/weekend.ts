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
