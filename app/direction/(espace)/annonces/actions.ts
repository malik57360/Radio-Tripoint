"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import {
  changerStatut,
  journal,
  lireAnnonce,
  publierAnnonce,
  rafraichir,
  annoncesDuCompte,
} from "@/lib/annonces/annonces"
import {
  annulerCommande,
  commandesDeLAnnonce,
  lireCommande,
  rembourser,
  rembourserAnnonce,
} from "@/lib/annonces/commandes"
import {
  enregistrerCompte,
  idCompteValide,
  lireCompte,
  revoquerSessions,
} from "@/lib/annonces/comptes"
import { TAG_CONFIG, enregistrerConfig, lireConfig, type Config } from "@/lib/annonces/config"
import {
  envoyerSansEchec,
  mailPubliee,
  mailRefusee,
  mailRetireeModeration,
} from "@/lib/annonces/mails"
import { STATUTS_ACTIFS, idAnnonceValide } from "@/lib/annonces/types"
import { estConnecte } from "@/lib/direction/acces"

/**
 * Décisions de la modération (Giorgio) sur les Petites annonces. Chaque
 * action vérifie la session du tableau de bord, s'inscrit au journal, et
 * prévient l'annonceur par un e-mail à texte fixe.
 */
type Resultat = { ok: true; message: string } | { ok: false; erreur: string }

async function garde(travail: () => Promise<string>): Promise<Resultat> {
  if (!(await estConnecte())) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  try {
    const message = await travail()
    revalidatePath("/direction/annonces")
    return { ok: true, message }
  } catch (e) {
    console.error("[annonces] direction :", (e as Error).message)
    return { ok: false, erreur: (e as Error).message || "Erreur inattendue." }
  }
}

async function annonce(id: string) {
  const a = idAnnonceValide(id) ? await lireAnnonce(id) : null
  if (!a) throw new Error("Annonce introuvable.")
  return a
}

export async function actionPublier(id: string) {
  return garde(async () => {
    const a = await annonce(id)
    const cfg = await lireConfig()
    const p = await publierAnnonce(a, cfg)
    const c = await lireCompte(a.compte)
    const parti = c ? await envoyerSansEchec({ a: c.email, ...mailPubliee(c.nom, p) }) : false
    return `Publiée.${parti ? " L'annonceur est prévenu." : " (E-mail à l'annonceur non envoyé.)"}`
  })
}

export async function actionRefuser(id: string, motif: string, prevenir: boolean) {
  return garde(async () => {
    const a = await annonce(id)
    if (!["en_attente", "attente_paiement", "signalee"].includes(a.statut))
      throw new Error("Seule une annonce en vérification ou masquée peut être refusée.")
    const m = String(motif ?? "")
      .trim()
      .slice(0, 600)
    // Jamais publiée : tout ce qui a été payé est rendu.
    const rembourse = a.publieeLe ? 0 : await rembourserAnnonce(a.id, m || "Annonce refusée")
    for (const cmd of await commandesDeLAnnonce(a.id)) await annulerCommande(cmd)
    await changerStatut(a, "refusee", m)
    const c = await lireCompte(a.compte)
    const parti =
      prevenir && c
        ? await envoyerSansEchec({ a: c.email, ...mailRefusee(c.nom, a, m, rembourse) })
        : false
    return [
      "Refusée.",
      rembourse ? `${(rembourse / 100).toLocaleString("fr-FR")} € remboursés.` : "",
      parti
        ? "L'annonceur est prévenu."
        : prevenir
          ? "(E-mail non envoyé.)"
          : "L'annonceur n'est pas prévenu.",
    ]
      .filter(Boolean)
      .join(" ")
  })
}

export async function actionRetirer(id: string, motif: string, prevenir: boolean) {
  return garde(async () => {
    const a = await annonce(id)
    const m = String(motif ?? "")
      .trim()
      .slice(0, 600)
    await changerStatut(a, "retiree", m)
    const c = await lireCompte(a.compte)
    const parti =
      prevenir && c
        ? await envoyerSansEchec({ a: c.email, ...mailRetireeModeration(c.nom, a, m) })
        : false
    return `Retirée du site.${parti ? " L'annonceur est prévenu." : ""}`
  })
}

/** Annonce masquée après des signalements, jugée correcte : elle revient en ligne. */
export async function actionRetablir(id: string) {
  return garde(async () => {
    const a = await annonce(id)
    if (a.statut !== "signalee") throw new Error("Cette annonce n'est pas masquée.")
    a.signalements = 0
    await publierAnnonce(a, await lireConfig())
    return "Rétablie : l'annonce est de nouveau en ligne."
  })
}

export async function actionRembourser(commande: string) {
  return garde(async () => {
    const c = await lireCommande(commande)
    if (!c) throw new Error("Commande introuvable.")
    const n = await rembourser(c, "Geste de la direction")
    if (!n) throw new Error("Cette commande n'est pas payée (ou déjà remboursée).")
    return `${(n / 100).toLocaleString("fr-FR")} € remboursés.`
  })
}

/* ───────────────────────── Comptes ───────────────────────── */

export async function actionBloquer(id: string, motif: string) {
  return garde(async () => {
    if (!idCompteValide(id)) throw new Error("Compte invalide.")
    const c = await lireCompte(id)
    if (!c) throw new Error("Compte introuvable.")
    const m =
      String(motif ?? "")
        .trim()
        .slice(0, 300) || "Non-respect des règles"
    c.bloque = { le: Date.now(), motif: m }
    await enregistrerCompte(c)
    await revoquerSessions(c.id)
    let n = 0
    for (const a of await annoncesDuCompte(c.id))
      if (STATUTS_ACTIFS.includes(a.statut)) {
        await changerStatut(a, "retiree", "Compte suspendu")
        n++
      }
    await journal("blocage", { compte: c.id, motif: m })
    return `Compte suspendu, ${n} annonce(s) retirée(s).`
  })
}

export async function actionDebloquer(id: string) {
  return garde(async () => {
    const c = idCompteValide(id) ? await lireCompte(id) : null
    if (!c) throw new Error("Compte introuvable.")
    c.bloque = undefined
    await enregistrerCompte(c)
    await journal("deblocage", { compte: c.id })
    return "Compte rétabli (ses annonces retirées restent retirées)."
  })
}

/** Professionnel vérifié à la main (registre LU / DE, ou doute levé). */
export async function actionValiderPro(id: string) {
  return garde(async () => {
    const c = idCompteValide(id) ? await lireCompte(id) : null
    if (!c?.pro) throw new Error("Ce compte n'est pas un compte pro.")
    c.pro.valideParModeration = Date.now()
    await enregistrerCompte(c)
    await journal("pro-valide", { compte: c.id })
    return "Professionnel marqué comme vérifié."
  })
}

/* ───────────────────────── Réglages ───────────────────────── */

const entier = (v: unknown, min: number, max: number) => {
  const n = Math.round(Number(v))
  if (!Number.isFinite(n) || n < min || n > max) throw new Error("Valeur hors limites.")
  return n
}
const texte = (v: unknown, max: number) =>
  String(v ?? "")
    .trim()
    .slice(0, max)

export async function actionReglages(brut: {
  offres: Pick<
    Config["offres"][number],
    "code" | "nom" | "description" | "prixCentimes" | "jours" | "photos" | "actif"
  >[]
  categories: Pick<Config["categories"][number], "slug" | "nom" | "accroche" | "actif" | "ordre">[]
  limites: Config["limites"]
  depotsOuverts: boolean
}) {
  return garde(async () => {
    const cfg = await lireConfig()
    for (const o of cfg.offres) {
      const r = brut.offres.find((x) => x.code === o.code)
      if (!r) continue
      o.nom = texte(r.nom, 60) || o.nom
      o.description = texte(r.description, 300) || o.description
      o.prixCentimes = entier(r.prixCentimes, 0, 100_000)
      o.jours = entier(r.jours, o.effet === "remontee" || o.effet === "photos" ? 0 : 1, 365)
      o.photos = entier(r.photos, 0, 30)
      o.actif = Boolean(r.actif)
    }
    if (!cfg.offres.some((o) => o.genre === "formule" && o.pour === "particulier" && o.actif))
      throw new Error("Gardez au moins une formule ouverte aux particuliers.")
    for (const c of cfg.categories) {
      const r = brut.categories.find((x) => x.slug === c.slug)
      if (!r) continue
      c.nom = texte(r.nom, 40) || c.nom
      c.accroche = texte(r.accroche, 120) || c.accroche
      c.actif = Boolean(r.actif)
      c.ordre = entier(r.ordre, 0, 100)
    }
    cfg.categories.sort((a, b) => a.ordre - b.ordre)
    cfg.limites = {
      activesParticulier: entier(brut.limites.activesParticulier, 1, 200),
      depotsParJour: entier(brut.limites.depotsParJour, 1, 100),
      seuilSignalements: entier(brut.limites.seuilSignalements, 1, 50),
    }
    cfg.depotsOuverts = Boolean(brut.depotsOuverts)
    await enregistrerConfig(cfg)
    await journal("reglages", {})
    revalidateTag(TAG_CONFIG, { expire: 0 })
    rafraichir()
    return "Réglages enregistrés : ils s'appliquent tout de suite."
  })
}
