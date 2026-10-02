import "server-only"
import { categories } from "@/data/categories"
import { personnes, structures } from "@/data/confiance"
import { tousArticles } from "@/lib/contenu/articles"
import { listerEmissions } from "@/lib/contenu/emissions"
import { tousEvenements } from "@/lib/contenu/evenements"
import { listerEpisodes } from "@/lib/contenu/podcasts"
import { programmeEnCours, programmeSuivant } from "@/lib/radio/grille"
import { versGrille } from "@/lib/radio/types"
import { radioConfig } from "@/config/radioConfig"
import { site } from "@/config/site"
import { jourParis, redis, redisActif, trancheParis } from "./redis"

/**
 * Toutes les données du tableau de bord de la direction. Règle unique :
 * aucune valeur inventée. Une source absente ou muette renvoie null, et
 * l'écran l'affiche comme telle.
 */

const EQUIPE = "team_wVJapAdQjpIDSkr7lhcXApdC"
const PROJET = "prj_md90ycd004kwU29KYIkmCzg0fQTF"
const SLUG_RADIOKING = "radio-tripoint-la-radio-transfrontaliere"
const FUSEAU = "Europe/Paris"

/* ───────────────────────── Dates (heure de Paris) ───────────────────────── */

/** Minuit à Paris pour le jour de `d`, en instant UTC. */
export function minuitParis(d = new Date()) {
  const jour = jourParis(d)
  const midiUtc = new Date(`${jour}T12:00:00Z`)
  const heureParis = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: FUSEAU, hour: "2-digit", hour12: false }).format(
      midiUtc,
    ),
  )
  return new Date(midiUtc.getTime() - heureParis * 3600_000)
}

const JOUR_MS = 86_400_000

/** Instant du rendu (le tableau de bord est recalculé à chaque visite). */
export const horodatage = () => Date.now()

/* ───────────────────────── Vercel Web Analytics ───────────────────────── */

export const analyticsActif = () => Boolean(process.env.VERCEL_STATS_TOKEN)

async function vercel<T>(chemin: string, params: Record<string, string | string[]>) {
  const jeton = process.env.VERCEL_STATS_TOKEN
  if (!jeton) return null
  const q = new URLSearchParams({ teamId: EQUIPE })
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach((x) => q.append(k, x))
    else q.set(k, v)
  }
  try {
    const r = await fetch(`https://api.vercel.com${chemin}?${q}`, {
      headers: { Authorization: `Bearer ${jeton}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) return null
    return (await r.json()) as T
  } catch {
    return null
  }
}

export interface Compte {
  visiteurs: number
  pages: number
}

async function compte(depuis: Date, jusqua: Date): Promise<Compte | null> {
  const r = await vercel<{ data: { visitors: number; pageviews: number } }>(
    "/v1/query/web-analytics/visits/count",
    { projectId: PROJET, since: depuis.toISOString(), until: jusqua.toISOString() },
  )
  return r ? { visiteurs: r.data.visitors, pages: r.data.pageviews } : null
}

export interface Ligne extends Compte {
  cle: string
}

async function repartition(
  par: string,
  depuis: Date,
  jusqua: Date,
  limite = 10,
): Promise<Ligne[] | null> {
  const r = await vercel<{ data: Record<string, string | number>[] }>(
    "/v1/query/web-analytics/visits/aggregate",
    {
      projectId: PROJET,
      by: [par],
      since: depuis.toISOString(),
      until: jusqua.toISOString(),
      limit: String(limite),
    },
  )
  if (!r) return null
  return r.data.map((d) => ({
    cle: String(d[par] ?? d.timestamp ?? ""),
    visiteurs: Number(d.visitors) || 0,
    pages: Number(d.pageviews) || 0,
  }))
}

/** Périodes proposées par l'écran Audience, en jours. */
export const PERIODES = [7, 30, 90] as const
export type Periode = (typeof PERIODES)[number]

export async function audience(jours: Periode = 30) {
  if (!analyticsActif()) return null
  const maintenant = new Date()
  const minuit = minuitParis(maintenant)
  // Vercel arrondit les bornes au jour (UTC) et la fin est exclue : on
  // demande donc des journées entières, de minuit à minuit, par date.
  const aujourdhuiUtc = Date.parse(`${jourParis(maintenant)}T00:00:00Z`)
  const jour = (decalage: number) => new Date(aujourdhuiUtc + decalage * JOUR_MS)
  const demain = jour(1)

  const [
    aujourdhui,
    veille,
    semaine,
    semainePrec,
    mois,
    moisPrec,
    parJour,
    parHeure,
    pages,
    pays,
    appareils,
    systemes,
    navigateurs,
    sources,
    campagnes,
  ] = await Promise.all([
    compte(jour(0), demain),
    compte(jour(-1), jour(0)),
    compte(jour(-6), demain),
    compte(jour(-13), jour(-6)),
    compte(jour(1 - jours), demain),
    compte(jour(1 - 2 * jours), jour(1 - jours)),
    repartition("day", jour(1 - jours), demain, 100),
    repartition("hour", minuit, maintenant, 24),
    repartition("requestPath", jour(1 - jours), demain, 15),
    repartition("country", jour(1 - jours), demain, 12),
    repartition("deviceType", jour(1 - jours), demain, 5),
    repartition("osName", jour(1 - jours), demain, 6),
    repartition("browserName", jour(1 - jours), demain, 6),
    repartition("referrerHostname", jour(1 - jours), demain, 12),
    repartition("utmSource", jour(1 - jours), demain, 8),
  ])
  if (!aujourdhui) return { erreur: true as const }
  const heureCourante = parHeure?.at(-1) ?? null
  return {
    erreur: false as const,
    jours,
    aujourdhui,
    veille,
    semaine,
    semainePrec,
    mois,
    moisPrec,
    heureCourante,
    parJour: parJour ?? [],
    parHeure: parHeure ?? [],
    pages: pages ?? [],
    pays: pays ?? [],
    appareils: appareils ?? [],
    systemes: systemes ?? [],
    navigateurs: navigateurs ?? [],
    sources: sources ?? [],
    campagnes: (campagnes ?? []).filter((c) => c.cle),
  }
}

/* ───────────────────────── Direct (Redis) ───────────────────────── */

export interface Fiche {
  page: string
  etat: "direct" | "podcast" | null
  episode: string | null
  pays: string | null
  ville: string | null
  appareil: string
  langue: string
  vu: number
  debut?: number
}

const compterPar = <T>(liste: T[], cle: (x: T) => string | null) => {
  const m = new Map<string, number>()
  for (const x of liste) {
    const k = cle(x)
    if (k) m.set(k, (m.get(k) ?? 0) + 1)
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([cle, n]) => ({ cle, n }))
}

/** Qui est là maintenant : lu toutes les quelques secondes par l'écran. */
export async function direct() {
  if (!redisActif()) return null
  const maintenant = Date.now()
  const jour = jourParis()
  const r = await redis([
    ["ZRANGEBYSCORE", "rt:presence", maintenant - 70_000, "+inf"],
    ["ZSCORE", "rt:pics", jour],
    ["ZREVRANGE", "rt:pics", 0, 0, "WITHSCORES"],
    ["HGETALL", `rt:j:${jour}`],
    ["ZRANGE", `rt:c:${jour}`, 0, -1, "WITHSCORES"],
  ])
  if (!r) return { erreur: true as const }
  const ids = (r[0] as string[] | null) ?? []
  let fiches: Fiche[] = []
  if (ids.length) {
    const brut = await redis([["MGET", ...ids.slice(0, 500).map((i) => `rt:p:${i}`)]])
    fiches = ((brut?.[0] as (string | null)[] | null) ?? [])
      .filter((x): x is string => Boolean(x))
      .map((x) => JSON.parse(x) as Fiche)
  }
  const record = (r[2] as string[] | null) ?? []
  return {
    erreur: false as const,
    enLigne: fiches.length,
    auditeursDirect: fiches.filter((f) => f.etat === "direct").length,
    auditeursPodcast: fiches.filter((f) => f.etat === "podcast").length,
    picJour: Number(r[1]) || 0,
    record: record.length ? { jour: record[0], n: Number(record[1]) } : null,
    compteurs: champs(r[3]),
    pages: compterPar(fiches, (f) => f.page).slice(0, 8),
    pays: compterPar(fiches, (f) => f.pays),
    villes: compterPar(fiches, (f) =>
      f.ville ? `${f.ville}${f.pays ? ` (${f.pays})` : ""}` : null,
    ).slice(0, 8),
    appareils: compterPar(fiches, (f) => f.appareil),
    langues: compterPar(fiches, (f) => f.langue),
    episodes: compterPar(fiches, (f) => f.episode),
    // Personnes présentes, sans rien qui les identifie : page, lieu approximatif, appareil.
    actifs: fiches
      .sort((a, b) => (a.debut ?? a.vu) - (b.debut ?? b.vu))
      .slice(0, 50)
      .map((f) => ({
        page: f.page,
        etat: f.etat,
        episode: f.episode,
        lieu: f.ville ? `${f.ville}${f.pays ? ` (${f.pays})` : ""}` : (f.pays ?? null),
        appareil: f.appareil,
        langue: f.langue,
        depuis: f.debut ?? f.vu,
      })),
    courbe: courbeDuJour(r[4]),
    a: maintenant,
  }
}

/** Les 288 tranches de 5 minutes de la journée jusqu'à maintenant ; une tranche sans signe de vie vaut 0. */
function courbeDuJour(brut: unknown) {
  const valeurs = new Map(Object.entries(champs(brut)))
  const [h, m] = trancheParis().split(":").map(Number)
  const fin = h * 12 + m / 5
  return Array.from({ length: fin + 1 }, (_, i) => {
    const t = `${String(Math.floor(i / 12)).padStart(2, "0")}:${String((i % 12) * 5).padStart(2, "0")}`
    return { tranche: t, n: valeurs.get(t) ?? 0 }
  })
}

/** HGETALL renvoie [champ, valeur, champ, valeur…]. */
function champs(brut: unknown): Record<string, number> {
  const l = (brut as string[] | null) ?? []
  const o: Record<string, number> = {}
  for (let i = 0; i + 1 < l.length; i += 2) o[l[i]] = Number(l[i + 1]) || 0
  return o
}

/** Compteurs maison jour par jour (30 jours) et podcasts les plus lancés. */
export async function engagement() {
  if (!redisActif()) return null
  const minuit = minuitParis()
  const jours = Array.from({ length: 30 }, (_, i) =>
    jourParis(new Date(minuit.getTime() - (29 - i) * JOUR_MS + 12 * 3600_000)),
  )
  const r = await redis([
    ...jours.map((j) => ["HGETALL", `rt:j:${j}`]),
    ["ZREVRANGE", "rt:podcasts", 0, 9, "WITHSCORES"],
    ["ZRANGE", "rt:pics", 0, -1, "WITHSCORES"],
  ])
  if (!r) return { erreur: true as const }
  const parJour = jours.map((jour, i) => ({ jour, ...champs(r[i]) }))
  const somme = (champ: string, n = 30) =>
    parJour.slice(-n).reduce((s, j) => s + (Number((j as Record<string, unknown>)[champ]) || 0), 0)
  const top = (r[jours.length] as string[] | null) ?? []
  const pics = champs(r[jours.length + 1])
  const episodes = await listerEpisodes()
  const titre = new Map(episodes.map((e) => [e.slug, e.titre]))
  return {
    erreur: false as const,
    parJour: parJour.map((j) => ({ ...j, pic: pics[j.jour] ?? 0 })),
    totaux: {
      visites7: somme("visites", 7),
      visites30: somme("visites"),
      direct7: somme("direct", 7),
      direct30: somme("direct"),
      podcast7: somme("podcast", 7),
      podcast30: somme("podcast"),
      tripo7: somme("tripo", 7),
      tripo30: somme("tripo"),
      formOk30: somme("form_ok"),
      formPerdu30: somme("form_perdu"),
      contact30: somme("form:contact"),
      information30: somme("form:information"),
      publicite30: somme("form:publicite"),
      newsletter30: somme("form:newsletter"),
    },
    topPodcasts: Array.from({ length: top.length / 2 }, (_, i) => ({
      slug: top[2 * i],
      titre: titre.get(top[2 * i]) ?? top[2 * i],
      n: Number(top[2 * i + 1]),
    })),
  }
}

/* ───────────────────────── Radio (RadioKing, API publique) ───────────────────────── */

async function json<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(5000) })
    return r.ok ? ((await r.json()) as T) : null
  } catch {
    return null
  }
}

export async function radio() {
  const base = `https://api.radioking.io/widget/radio/${SLUG_RADIOKING}`
  const [info, enCours, historique] = await Promise.all([
    json<{ stream_status?: string; status?: string; name?: string }>(base),
    json<{
      title?: string
      artist?: string | null
      started_at?: string
      end_at?: string
      duration?: number
      is_live?: boolean
    }>(`${base}/track/current`),
    json<{ title?: string; artist?: string | null; started_at?: string; duration?: number }[]>(
      `${base}/track/ckoi?limit=30`,
    ),
  ])
  const emissions = versGrille(await listerEmissions())
  const maintenant = new Date()
  return {
    flux: info?.stream_status ?? null,
    enCours: enCours?.title
      ? {
          titre: enCours.title,
          artiste: enCours.artist ?? null,
          debut: enCours.started_at ?? null,
          fin: enCours.end_at ?? null,
          duree: enCours.duration ?? null,
          live: Boolean(enCours.is_live),
        }
      : null,
    historique: (historique ?? [])
      .filter((h) => h.title)
      .map((h) => ({
        titre: h.title as string,
        artiste: h.artist ?? null,
        debut: h.started_at ?? null,
        duree: h.duration ?? null,
      })),
    grille: emissions,
    programme: programmeEnCours(emissions, maintenant, radioConfig.timeZone),
    suivant: programmeSuivant(emissions, maintenant, radioConfig.timeZone),
  }
}

/* ───────────────────────── Contenu du site ───────────────────────── */

export async function contenu() {
  const [articles, episodes, emissions, evenements] = await Promise.all([
    tousArticles(),
    listerEpisodes(),
    listerEmissions(),
    tousEvenements(),
  ])
  const maintenant = Date.now()
  const dates = articles.filter((a) => a.publieLe).map((a) => Date.parse(a.publieLe as string))
  const parCategorie = Object.values(categories)
    .map((c) => ({ cle: c.court, n: articles.filter((a) => a.categorie === c.slug).length }))
    .sort((a, b) => b.n - a.n)
  const aVenir = evenements
    .filter((e) => Date.parse(e.fin ?? e.debut) >= minuitParis().getTime())
    .sort((a, b) => a.debut.localeCompare(b.debut))
  // Articles publiés par semaine (lundi), sur 12 semaines.
  const lundi = (t: number) => {
    const d = new Date(t)
    const decalage = (d.getUTCDay() + 6) % 7
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - decalage)
  }
  const cetteSemaine = lundi(maintenant)
  const parSemaine = Array.from({ length: 12 }, (_, i) => {
    const debut = cetteSemaine - (11 - i) * 7 * JOUR_MS
    return {
      debut,
      n: dates.filter((d) => d >= debut && d < debut + 7 * JOUR_MS).length,
    }
  })
  return {
    articles: {
      total: articles.length,
      dates: dates.length,
      parSemaine,
      semaine: dates.filter((d) => maintenant - d < 7 * JOUR_MS).length,
      mois: dates.filter((d) => maintenant - d < 30 * JOUR_MS).length,
      parCategorie,
      derniers: articles.slice(0, 15).map((a) => ({
        titre: a.titre,
        slug: a.slug,
        date: a.publieLe ?? null,
        categorie: categories[a.categorie].court,
      })),
    },
    podcasts: {
      total: episodes.length,
      heures: Math.round(episodes.reduce((s, e) => s + (e.duree || 0), 0) / 360) / 10,
      parEmission: emissions
        .map((e) => ({ cle: e.nom, n: episodes.filter((p) => p.emission === e.slug).length }))
        .filter((x) => x.n > 0),
    },
    emissions: emissions.length,
    evenements: {
      aVenir: aVenir.length,
      semaine: aVenir.filter((e) => Date.parse(e.debut) - maintenant < 7 * JOUR_MS).length,
      prochains: aVenir.slice(0, 12).map((e) => ({
        titre: e.titre,
        debut: e.debut,
        ville: e.ville,
        pays: e.pays,
        journee: Boolean(e.journee),
      })),
    },
    partenaires: personnes.length + structures.length,
  }
}

/* ───────────────────────── Technique ───────────────────────── */

async function sonde(url: string, flux = false) {
  const debut = Date.now()
  const ctrl = new AbortController()
  const minuterie = setTimeout(() => ctrl.abort(), 6000)
  try {
    const r = await fetch(url, { cache: "no-store", signal: ctrl.signal, redirect: "follow" })
    const ms = Date.now() - debut
    // Un flux radio ne finit jamais : les en-têtes suffisent.
    if (flux) ctrl.abort()
    else await r.arrayBuffer()
    return { ok: r.ok, statut: r.status, ms }
  } catch {
    return { ok: false, statut: 0, ms: Date.now() - debut }
  } finally {
    clearTimeout(minuterie)
  }
}

export async function technique() {
  const [siteEtat, fluxEtat, deploiements] = await Promise.all([
    sonde(site.url),
    sonde(radioConfig.streamUrl, true),
    vercel<{
      deployments: {
        state?: string
        readyState?: string
        created: number
        meta?: { githubCommitMessage?: string }
      }[]
    }>("/v6/deployments", { projectId: PROJET, target: "production", limit: "6" }),
  ])
  return {
    site: siteEtat,
    flux: fluxEtat,
    deploiements:
      deploiements?.deployments.map((d) => ({
        etat: d.readyState ?? d.state ?? "?",
        date: d.created,
        message: (d.meta?.githubCommitMessage ?? "").split("\n")[0].slice(0, 90),
      })) ?? null,
    redis: redisActif(),
    analytics: analyticsActif(),
  }
}

/* ───────────────────────── Alertes ───────────────────────── */

export const formulairesBranches = () =>
  Boolean(process.env.RESEND_API_KEY || process.env.FORM_WEBHOOK_URL)

export type Alerte = { texte: string; page: string }

/** Ce qui mérite l'attention de la direction, avec la page où regarder. */
export function alertes(
  tech: Awaited<ReturnType<typeof technique>>,
  rad: Awaited<ReturnType<typeof radio>>,
  formulairesPerdus = 0,
): Alerte[] {
  const a: Alerte[] = []
  if (!tech.site.ok) a.push({ texte: "Le site ne répond pas correctement.", page: "technique" })
  if (!tech.flux.ok || (rad.flux && rad.flux !== "started"))
    a.push({
      texte: "Le flux radio ne répond pas : l'antenne est peut-être coupée.",
      page: "antenne",
    })
  if (!formulairesBranches())
    a.push({
      texte: `Les formulaires du site (contact, publicité, newsletter, infos) ne sont pas branchés : les messages envoyés ne vous parviennent pas${
        formulairesPerdus
          ? ` (${formulairesPerdus} perdu${formulairesPerdus > 1 ? "s" : ""} en 30 jours)`
          : ""
      }.`,
      page: "engagement",
    })
  if (!tech.redis)
    a.push({ texte: "Le compteur « en ce moment » n'est pas encore activé.", page: "direct" })
  if (!tech.analytics)
    a.push({ texte: "Les statistiques d'audience ne sont pas encore reliées.", page: "audience" })
  return a
}
