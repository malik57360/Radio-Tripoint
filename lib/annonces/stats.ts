import "server-only"
import { redis } from "@/lib/direction/redis"
import type { Commande } from "./commandes"
import type { Compte } from "./comptes"
import { STATS_JOUR } from "./discussions"
import { jourParis } from "./espace"
import type { Annonce } from "./types"

/**
 * Statistiques des Petites annonces pour le tableau de bord, jour par jour
 * (heure de Paris). Tout est compté, rien n'est estimé : vues des fiches,
 * dépôts, publications, inscriptions, discussions et messages (des nombres,
 * jamais leur contenu), et l'argent réellement encaissé.
 */
export interface JourStats {
  jour: string
  vues: number
  depots: number
  publications: number
  inscriptions: number
  discussions: number
  messages: number
}

const derniersJours = (n: number) =>
  Array.from({ length: n }, (_, i) => jourParis(Date.now() - (n - 1 - i) * 864e5))

const nb = (v: unknown) => Math.max(0, Number(v) || 0)

export async function statsDirection(
  o: { annonces: Annonce[]; comptes: Compte[]; commandes: Commande[] },
  n = 30,
) {
  const jours = derniersJours(n)
  const r = await redis([
    ...jours.map((j) => ["HVALS", `rt:annonces:vues:${j}`]),
    ...jours.map((j) => ["HGETALL", STATS_JOUR(j)]),
    ["HGETALL", "rt:annonces:vues"],
    ["SCARD", "rt:annonces:comptes-alertes"],
    ["HGETALL", "rt:annonces:nb-favoris"],
  ])
  const parJour = new Map<string, JourStats>(
    jours.map((j) => [
      j,
      {
        jour: j,
        vues: 0,
        depots: 0,
        publications: 0,
        inscriptions: 0,
        discussions: 0,
        messages: 0,
      },
    ]),
  )
  jours.forEach((j, i) => {
    const s = parJour.get(j)!
    s.vues = ((r?.[i] as string[] | null) ?? []).reduce((t, v) => t + nb(v), 0)
    const h = (r?.[n + i] as string[] | null) ?? []
    for (let k = 0; k < h.length; k += 2) {
      if (h[k] === "messages") s.messages = nb(h[k + 1])
      if (h[k] === "discussions") s.discussions = nb(h[k + 1])
    }
  })
  for (const a of o.annonces) {
    const d = parJour.get(jourParis(a.creeLe))
    if (d) d.depots++
    const p = a.publieeLe ? parJour.get(jourParis(a.publieeLe)) : undefined
    if (p) p.publications++
  }
  for (const c of o.comptes) {
    const d = parJour.get(jourParis(c.creeLe))
    if (d) d.inscriptions++
  }

  const vuesTotal = new Map<string, number>()
  const brut = (r?.[2 * n] as string[] | null) ?? []
  for (let k = 0; k < brut.length; k += 2) vuesTotal.set(brut[k], nb(brut[k + 1]))
  const favoris = new Map<string, number>()
  const f = (r?.[2 * n + 2] as string[] | null) ?? []
  for (let k = 0; k < f.length; k += 2) favoris.set(f[k], nb(f[k + 1]))

  const enLigne = o.annonces.filter((a) => a.statut === "publiee")
  const compter = (cles: string[]) => {
    const m = new Map<string, number>()
    for (const c of cles) m.set(c, (m.get(c) ?? 0) + 1)
    return [...m].map(([cle, n]) => ({ cle, n })).sort((a, b) => b.n - a.n)
  }

  // L'argent encaissé, mois par mois (12 derniers mois), remboursements déduits.
  const mois = Array.from({ length: 12 }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - (11 - i))
    return jourParis(d.getTime()).slice(0, 7)
  })
  const revenus = new Map(mois.map((m) => [m, 0]))
  for (const c of o.commandes) {
    if (c.statut !== "payee" || !c.payeeLe) continue
    const m = jourParis(c.payeeLe).slice(0, 7)
    if (revenus.has(m)) revenus.set(m, (revenus.get(m) ?? 0) + c.total)
  }

  const serie = [...parJour.values()]
  const somme = (k: keyof Omit<JourStats, "jour">) => serie.reduce((t, s) => t + s[k], 0)
  return {
    jours: serie,
    totaux: {
      vues: somme("vues"),
      depots: somme("depots"),
      publications: somme("publications"),
      inscriptions: somme("inscriptions"),
      discussions: somme("discussions"),
      messages: somme("messages"),
    },
    comptesAvecAlertes: nb(r?.[2 * n + 1]),
    topVues: o.annonces
      .map((a) => ({ a, n: vuesTotal.get(a.id) ?? 0, favoris: favoris.get(a.id) ?? 0 }))
      .filter((x) => x.n > 0)
      .sort((x, y) => y.n - x.n)
      .slice(0, 10),
    parCategorie: compter(enLigne.map((a) => a.categorie)),
    parPays: compter(enLigne.map((a) => a.pays)),
    revenus: [...revenus].map(([mois, centimes]) => ({ mois, centimes })),
    comptes: {
      total: o.comptes.length,
      pros: o.comptes.filter((c) => c.type === "pro").length,
      confirmes: o.comptes.filter((c) => c.emailVerifie).length,
      bloques: o.comptes.filter((c) => c.bloque).length,
    },
  }
}
