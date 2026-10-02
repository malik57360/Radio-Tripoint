import "server-only"
import { redis, redisActif } from "./redis"

/**
 * Prospection publicitaire : les entreprises actives autour de la radio,
 * lues dans l'annuaire officiel des entreprises françaises
 * (recherche-entreprises.api.gouv.fr, données INSEE et RNE, API publique et
 * gratuite). Rien n'est inventé : ni nom, ni adresse, ni coordonnées. Le
 * suivi commercial (statut, note, e-mail trouvé) est gardé dans Redis.
 *
 * Côté Luxembourg et Allemagne, il n'existe pas d'annuaire public équivalent
 * en accès libre : la page le dit.
 */

const API = "https://recherche-entreprises.api.gouv.fr/search"
export const PAR_PAGE = 25

export const ZONES = [
  {
    id: "sierck",
    nom: "Sierck et la frontière",
    detail: "Sierck-les-Bains, Apach, Rettel, Contz, Manderen, Cattenom, Mondorff, Roussy…",
    codes: ["57480", "57570"],
  },
  {
    id: "thionville",
    nom: "Thionville et environs",
    detail: "Thionville, Yutz, Hettange-Grande, Guénange, Kœnigsmacker, Metzervisse…",
    codes: ["57100", "57970", "57330", "57310", "57940", "57920"],
  },
  {
    id: "fensch",
    nom: "Vallée de la Fensch et de l'Orne",
    detail: "Hayange, Florange, Fameck, Algrange, Audun-le-Tiche, Amnéville, Hagondange…",
    codes: ["57700", "57190", "57290", "57440", "57390", "57360", "57300", "57280"],
  },
  {
    id: "bouzonville",
    nom: "Bouzonville et le Pays de Nied",
    detail: "Bouzonville, Waldwisse, Launstroff, Freistroff…",
    codes: ["57320"],
  },
  { id: "metz", nom: "Metz", detail: "Metz et ses quartiers", codes: ["57000", "57050", "57070"] },
] as const
export type ZoneId = (typeof ZONES)[number]["id"]

/** Sections NAF, regroupées comme on parle des annonceurs d'une radio locale. */
export const SECTEURS = [
  { id: "G", nom: "Commerces et garages" },
  { id: "I", nom: "Restaurants, bars, hôtels" },
  { id: "F", nom: "Bâtiment et artisans" },
  { id: "C", nom: "Artisans de fabrication (boulangers, bouchers…)" },
  { id: "S", nom: "Services aux particuliers (coiffure, beauté…)" },
  { id: "L", nom: "Immobilier" },
  { id: "R", nom: "Loisirs, culture, sport" },
  { id: "Q", nom: "Santé et action sociale" },
  { id: "K", nom: "Banques et assurances" },
  { id: "P", nom: "Enseignement (auto-écoles, formation…)" },
  { id: "N", nom: "Location, agences, voyages" },
  { id: "M", nom: "Conseil, comptabilité, communication" },
] as const

/** Libellés courts des activités les plus fréquentes chez les annonceurs locaux (NAF rév. 2). */
const NAF: Record<string, string> = {
  "10.71A": "Boulangerie industrielle",
  "10.71B": "Cuisson de produits de boulangerie",
  "10.71C": "Boulangerie-pâtisserie",
  "10.71D": "Pâtisserie",
  "10.13B": "Charcuterie",
  "11.02B": "Viticulture (vins)",
  "41.20A": "Construction de maisons",
  "41.20B": "Construction de bâtiments",
  "43.21A": "Électricité",
  "43.22A": "Plomberie, chauffage",
  "43.22B": "Climatisation, chauffage",
  "43.29A": "Isolation",
  "43.31Z": "Plâtrerie",
  "43.32A": "Menuiserie bois et PVC",
  "43.32B": "Menuiserie métallique, serrurerie",
  "43.33Z": "Revêtement des sols et murs",
  "43.34Z": "Peinture et vitrerie",
  "43.39Z": "Travaux de finition",
  "43.91B": "Couverture",
  "43.99C": "Maçonnerie",
  "45.11Z": "Vente de voitures",
  "45.20A": "Garage, entretien automobile",
  "45.20B": "Carrosserie, entretien",
  "45.32Z": "Pièces automobiles",
  "45.40Z": "Motos",
  "47.11B": "Commerce d'alimentation générale",
  "47.11C": "Supérette",
  "47.11D": "Supermarché",
  "47.11F": "Hypermarché",
  "47.22Z": "Boucherie-charcuterie",
  "47.24Z": "Boulangerie (commerce)",
  "47.25Z": "Boissons, cave",
  "47.26Z": "Tabac",
  "47.29Z": "Commerce alimentaire",
  "47.30Z": "Station-service",
  "47.41Z": "Informatique",
  "47.43Z": "Hi-fi, vidéo",
  "47.52A": "Quincaillerie, bricolage",
  "47.52B": "Grande surface de bricolage",
  "47.54Z": "Électroménager",
  "47.59A": "Meubles",
  "47.59B": "Équipement de la maison",
  "47.61Z": "Librairie",
  "47.62Z": "Presse, papeterie",
  "47.64Z": "Articles de sport",
  "47.65Z": "Jeux et jouets",
  "47.71Z": "Habillement",
  "47.72A": "Chaussures",
  "47.73Z": "Pharmacie",
  "47.74Z": "Matériel médical, optique",
  "47.75Z": "Parfumerie, beauté",
  "47.76Z": "Fleuriste, jardinerie",
  "47.77Z": "Bijouterie, horlogerie",
  "47.78A": "Optique",
  "47.78C": "Commerce de détail spécialisé",
  "47.79Z": "Brocante, occasion",
  "47.91B": "Vente à distance",
  "55.10Z": "Hôtel",
  "55.20Z": "Hébergement touristique, gîte",
  "55.30Z": "Camping",
  "56.10A": "Restauration traditionnelle",
  "56.10B": "Cafétéria, libre-service",
  "56.10C": "Restauration rapide",
  "56.21Z": "Traiteur",
  "56.29A": "Restauration collective sous contrat",
  "56.29B": "Restauration (autre)",
  "56.30Z": "Bar, café",
  "68.10Z": "Marchand de biens",
  "68.20A": "Location de logements",
  "68.20B": "Location de terrains et locaux",
  "68.31Z": "Agence immobilière",
  "68.32A": "Syndic, gestion immobilière",
  "69.10Z": "Juridique",
  "69.20Z": "Expertise comptable",
  "70.22Z": "Conseil",
  "73.11Z": "Agence de publicité",
  "74.10Z": "Design",
  "74.20Z": "Photographie",
  "77.11A": "Location de voitures",
  "79.11Z": "Agence de voyages",
  "85.53Z": "Auto-école",
  "85.59A": "Formation continue",
  "85.59B": "Formation, soutien scolaire",
  "86.21Z": "Médecin généraliste",
  "86.23Z": "Dentiste",
  "86.90E": "Paramédical",
  "86.90F": "Santé (autre)",
  "93.11Z": "Équipement sportif",
  "93.12Z": "Club de sport",
  "93.13Z": "Salle de sport, fitness",
  "93.21Z": "Parc de loisirs",
  "93.29Z": "Loisirs",
  "96.02A": "Coiffure",
  "96.02B": "Soins de beauté",
  "96.04Z": "Bien-être, spa",
  "96.09Z": "Services à la personne",
  "64.19Z": "Banque",
  "65.12Z": "Assurance",
  "66.22Z": "Courtier, agent d'assurances",
}

const EFFECTIFS: Record<string, string> = {
  NN: "sans salarié",
  "00": "0 salarié",
  "01": "1-2 salariés",
  "02": "3-5 salariés",
  "03": "6-9 salariés",
  "11": "10-19 salariés",
  "12": "20-49 salariés",
  "21": "50-99 salariés",
  "22": "100-199 salariés",
  "31": "200-249 salariés",
  "32": "250-499 salariés",
  "41": "500-999 salariés",
  "42": "1 000-1 999 salariés",
  "51": "2 000-4 999 salariés",
  "52": "5 000-9 999 salariés",
  "53": "10 000 salariés et +",
}
const AVEC_SALARIES = [
  "01",
  "02",
  "03",
  "11",
  "12",
  "21",
  "22",
  "31",
  "32",
  "41",
  "42",
  "51",
  "52",
  "53",
]

/** Repli par division NAF (deux premiers chiffres) quand le code exact n'est pas listé. */
const DIVISIONS: Record<string, string> = {
  "10": "Industrie alimentaire",
  "11": "Fabrication de boissons",
  "13": "Textile",
  "14": "Habillement (fabrication)",
  "16": "Travail du bois",
  "18": "Imprimerie",
  "20": "Industrie chimique",
  "22": "Caoutchouc et plastique",
  "23": "Matériaux (verre, béton, pierre)",
  "24": "Métallurgie",
  "25": "Travail des métaux",
  "26": "Électronique",
  "27": "Équipements électriques",
  "28": "Machines et équipements",
  "29": "Industrie automobile",
  "31": "Fabrication de meubles",
  "32": "Autres industries",
  "33": "Réparation et installation de machines",
  "41": "Construction de bâtiments",
  "42": "Génie civil",
  "43": "Travaux du bâtiment",
  "45": "Automobile (vente, réparation)",
  "46": "Commerce de gros",
  "47": "Commerce de détail",
  "55": "Hébergement",
  "56": "Restauration",
  "64": "Services financiers",
  "65": "Assurance",
  "66": "Services financiers et d'assurance",
  "68": "Immobilier",
  "69": "Juridique et comptabilité",
  "70": "Conseil de gestion",
  "71": "Architecture, ingénierie",
  "72": "Recherche",
  "73": "Publicité, études de marché",
  "74": "Services spécialisés (design, photo…)",
  "75": "Vétérinaire",
  "77": "Location",
  "78": "Emploi, intérim",
  "79": "Voyages",
  "80": "Sécurité",
  "81": "Nettoyage, entretien",
  "82": "Services aux entreprises",
  "85": "Enseignement",
  "86": "Santé",
  "87": "Hébergement médico-social",
  "88": "Action sociale",
  "90": "Arts et spectacles",
  "91": "Bibliothèques, musées",
  "92": "Jeux",
  "93": "Sport et loisirs",
  "94": "Associations, organisations",
  "95": "Réparation",
  "96": "Services à la personne",
}

export const libelleActivite = (code: string | null | undefined) =>
  code ? (NAF[code] ?? DIVISIONS[code.slice(0, 2)] ?? `Activité ${code}`) : "Activité non précisée"

const titre = (s: string) =>
  s.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase())

export interface Prospect {
  siren: string
  nom: string
  enseigne: string | null
  activite: string
  codeActivite: string | null
  adresse: string
  commune: string
  effectif: string
  dirigeant: string | null
  siegeAilleurs: string | null
  creation: string | null
}

type Brut = {
  siren: string
  nom_complet: string
  activite_principale?: string
  tranche_effectif_salarie?: string | null
  nature_juridique?: string
  date_creation?: string | null
  siege?: { code_postal?: string; libelle_commune?: string }
  dirigeants?: {
    nom?: string
    prenoms?: string
    denomination?: string
    type_dirigeant?: string
  }[]
  matching_etablissements?: {
    adresse?: string
    libelle_commune?: string
    code_postal?: string
    liste_enseignes?: string[] | null
    nom_commercial?: string | null
    activite_principale?: string
    tranche_effectif_salarie?: string | null
    etat_administratif?: string
  }[]
}

function versProspect(r: Brut, codes: readonly string[]): Prospect | null {
  // Personnes publiques (communes, établissements publics…) : pas des annonceurs.
  if (r.nature_juridique?.startsWith("7")) return null
  const local = (r.matching_etablissements ?? []).find(
    (e) => e.etat_administratif === "A" && (!e.code_postal || codes.includes(e.code_postal)),
  )
  if (!local) return null
  const d = r.dirigeants?.[0]
  const dirigeant = d
    ? d.type_dirigeant === "personne morale"
      ? (d.denomination ?? null)
      : [d.prenoms?.split(" ")[0], d.nom]
          .filter(Boolean)
          .map((x) => titre(x as string))
          .join(" ") || null
    : null
  const code = local.activite_principale ?? r.activite_principale ?? null
  const siegeLocal = r.siege?.code_postal && codes.includes(r.siege.code_postal)
  return {
    siren: r.siren,
    nom: titre(r.nom_complet),
    enseigne: local.liste_enseignes?.[0]
      ? titre(local.liste_enseignes[0])
      : local.nom_commercial
        ? titre(local.nom_commercial)
        : null,
    activite: libelleActivite(code),
    codeActivite: code,
    adresse: local.adresse ?? "",
    commune: titre(local.libelle_commune ?? ""),
    effectif:
      EFFECTIFS[local.tranche_effectif_salarie ?? r.tranche_effectif_salarie ?? "NN"] ?? "—",
    dirigeant,
    siegeAilleurs: siegeLocal
      ? null
      : r.siege?.libelle_commune
        ? titre(r.siege.libelle_commune)
        : null,
    creation: r.date_creation ?? null,
  }
}

export async function rechercherProspects(opts: {
  zone: ZoneId
  secteur: string
  page: number
  salaries: boolean
  q?: string
}) {
  const zone = ZONES.find((z) => z.id === opts.zone) ?? ZONES[0]
  const params = new URLSearchParams({
    code_postal: zone.codes.join(","),
    section_activite_principale: opts.secteur,
    etat_administratif: "A",
    per_page: String(PAR_PAGE),
    page: String(Math.max(1, Math.min(opts.page, 400))),
  })
  if (opts.salaries) params.set("tranche_effectif_salarie", AVEC_SALARIES.join(","))
  if (opts.q && opts.q.trim().length >= 3) params.set("q", opts.q.trim().slice(0, 80))
  const r = await fetch(`${API}?${params}`, {
    next: { revalidate: 6 * 3600 },
    signal: AbortSignal.timeout(10_000),
  })
  if (r.status === 429)
    throw new Error("L'annuaire limite le nombre de recherches : réessayez dans quelques secondes.")
  if (!r.ok) throw new Error(`L'annuaire des entreprises ne répond pas (${r.status}).`)
  const j = (await r.json()) as { results: Brut[]; total_results: number; total_pages: number }
  return {
    total: j.total_results,
    pages: j.total_pages,
    prospects: j.results
      .map((x) => versProspect(x, zone.codes))
      .filter((x): x is Prospect => x !== null),
  }
}

/* ───────────────────────── Suivi commercial ───────────────────────── */

export const STATUTS = {
  a_contacter: "À contacter",
  contacte: "Contacté",
  interesse: "Intéressé",
  rdv: "Rendez-vous",
  client: "Client",
  refus: "Pas intéressé",
  stop: "Ne plus contacter",
} as const
export type Statut = keyof typeof STATUTS

export interface Suivi {
  statut: Statut
  note: string
  email: string
  telephone: string
  nom: string
  commune: string
  activite: string
  maj: number
  dernierEnvoi?: number
}

const CLE = "rt:prospects"

export async function lireSuivis(): Promise<Record<string, Suivi>> {
  if (!redisActif()) return {}
  const r = await redis([["HGETALL", CLE]])
  const l = (r?.[0] as string[] | null) ?? []
  const o: Record<string, Suivi> = {}
  for (let i = 0; i + 1 < l.length; i += 2) {
    try {
      o[l[i]] = JSON.parse(l[i + 1]) as Suivi
    } catch {}
  }
  return o
}

export async function lireSuivi(siren: string): Promise<Suivi | null> {
  if (!redisActif()) return null
  const r = await redis([["HGET", CLE, siren]])
  return r?.[0] ? (JSON.parse(String(r[0])) as Suivi) : null
}

export async function ecrireSuivi(siren: string, suivi: Suivi) {
  if (!redisActif()) throw new Error("Le suivi demande la base Redis.")
  await redis([["HSET", CLE, siren, JSON.stringify(suivi)]])
}
