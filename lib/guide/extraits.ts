import { tousArticles } from "@/lib/contenu/articles"
import { normaliser, texteBlocs } from "@/lib/utils/texte"
import type { Article } from "@/types/article"

/**
 * Mémoire des articles de Radio Tripoint : pour la question posée, on
 * retrouve les deux ou trois articles du site qui en parlent le plus et on
 * en donne des passages à Tripo. Il connaît ainsi le détail de tout ce que
 * la radio a publié, sans recharger les 200 000 caractères du site à chaque
 * message. Recherche par mots, pondérée par leur rareté (un nom propre pèse
 * plus que « Moselle », présent partout).
 */

/** Mots trop courants pour départager (≥ 4 lettres, sans accents). */
const VIDES = new Set(
  (
    "dans pour avec sont quel quelle quels quelles quoi comment cette votre notre vous nous elle elles " +
    "leur leurs tout tous toute toutes plus moins faire fait fais peux peut veux veut voudrais connais " +
    "connait sais savoir parle parler dire entre depuis encore aussi bien tres alors donc mais quand " +
    "chez sans sous etre avoir celui celle ceux merci salut " +
    "bonjour bonsoir coucou hello tripo radio tripoint what with that this about have does tell know " +
    "wann welche welcher welches eine einen einem nicht oder sind gibt kannst bitte weisst ueber " +
    "wien wat weess kanns gëtt dass oder fuer"
  ).split(/\s+/),
)

const MAX_ARTICLES = 3
const MAX_PAR_ARTICLE = 2200

interface Fiche {
  a: Article
  /** Mots du titre, du chapeau, des lieux et tags. */
  titre: Set<string>
  chapeau: Set<string>
  reperes: Set<string>
  /** Mot → nombre d'occurrences dans le corps. */
  corps: Map<string, number>
  paragraphes: { brut: string; mots: Set<string> }[]
}

/** Mots d'un texte, sans accents ; « faiences » et « faience » se rejoignent. */
const mots = (texte: string) =>
  normaliser(texte)
    .split(/[^a-z0-9]+/)
    .filter((m) => m.length >= 3)
    .map((m) => (m.length > 4 ? m.replace(/[sx]$/, "") : m))

let index: { cle: string; fiches: Fiche[] } | null = null

async function fiches(): Promise<Fiche[]> {
  const articles = await tousArticles("fr")
  const cle = `${articles.length}:${articles[0]?.slug ?? ""}`
  if (index?.cle === cle) return index.fiches
  const liste = articles.map((a) => {
    const paragraphes = a.corps
      .map((b) => texteBlocs([b]).trim())
      .filter(Boolean)
      .map((brut) => ({ brut, mots: new Set(mots(brut)) }))
    const corps = new Map<string, number>()
    for (const b of a.corps)
      for (const m of mots(texteBlocs([b]))) corps.set(m, (corps.get(m) ?? 0) + 1)
    return {
      a,
      titre: new Set(mots(a.titre)),
      chapeau: new Set(mots(a.chapeau)),
      reperes: new Set(mots([...(a.lieux ?? []), ...(a.tags ?? [])].join(" "))),
      corps,
      paragraphes,
    }
  })
  index = { cle, fiches: liste }
  return liste
}

const motsDe = (texte: string) => [
  ...new Set(mots(texte).filter((m) => m.length >= 4 && !VIDES.has(m))),
]

/** Passages des articles du site liés à la question (vide si rien ne correspond). */
export async function extraitsArticles(question: string, lien: (p: string) => string) {
  const cherches = motsDe(question).slice(0, 14)
  if (!cherches.length) return ""
  const liste = await fiches()
  const n = liste.length || 1
  // Rareté : un mot présent dans peu d'articles compte beaucoup ; un mot
  // présent dans plus d'un article sur quatre ne départage rien.
  const poids = new Map(
    cherches.map((m) => {
      const df = liste.filter((f) => f.titre.has(m) || f.corps.has(m)).length
      return [m, df && df / n <= 0.25 ? Math.log(n / df) : 0]
    }),
  )
  const notees = liste
    .map((f) => {
      let score = 0
      for (const m of cherches) {
        const w = poids.get(m) ?? 0
        if (!w) continue
        score +=
          w *
          ((f.titre.has(m) ? 4 : 0) +
            (f.chapeau.has(m) ? 2 : 0) +
            (f.reperes.has(m) ? 2 : 0) +
            Math.min(4, f.corps.get(m) ?? 0))
      }
      return { f, score }
    })
    .filter((x) => x.score >= 6)
    .sort((x, y) => y.score - x.score)
  // Seulement les articles proches du meilleur : pas de remplissage.
  const notes = notees.filter((x) => x.score >= notees[0]?.score * 0.4).slice(0, MAX_ARTICLES)
  if (!notes.length) return ""

  return notes
    .map(({ f }) => {
      // Les paragraphes qui contiennent les mots cherchés d'abord, dans l'ordre du texte.
      const utiles = f.paragraphes.filter((p) =>
        cherches.some((m) => (poids.get(m) ?? 0) > 0 && p.mots.has(m)),
      )
      const choisis = utiles.length ? utiles : f.paragraphes.slice(0, 2)
      let texte = ""
      for (const p of choisis) {
        if (texte.length + p.brut.length > MAX_PAR_ARTICLE) {
          if (!texte) texte = p.brut.slice(0, MAX_PAR_ARTICLE) + "…"
          break
        }
        texte += (texte ? "\n" : "") + p.brut
      }
      const date = f.a.publieLe ? ` (${f.a.publieLe.slice(0, 10)})` : ""
      return `### ${f.a.titre}${date} — ${lien(`/actualites/${f.a.slug}`)}\n${f.a.chapeau}\n${texte}`
    })
    .join("\n\n")
}
