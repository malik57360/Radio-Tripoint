"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import {
  changerStatut,
  corrigerParModeration,
  effacerAnnonce,
  journal,
  lireAnnonce,
  offrirParModeration,
  publierAnnonce,
  rafraichir,
  annoncesDuCompte,
  viderPhotos,
  type Cadeau,
} from "@/lib/annonces/annonces"
import {
  classerSignalementDiscussion,
  effacerDiscussions,
  supprimerDiscussion,
} from "@/lib/annonces/discussions"
import { effacerEspace } from "@/lib/annonces/espace"
import {
  annulerCommande,
  commandesDeLAnnonce,
  lireCommande,
  rembourser,
  rembourserAnnonce,
} from "@/lib/annonces/commandes"
import {
  creerJeton,
  enregistrerCompte,
  idCompteValide,
  lireCompte,
  revoquerSessions,
  supprimerCompte,
} from "@/lib/annonces/comptes"
import {
  PILOTAGE_DEPART,
  TAG_CONFIG,
  enregistrerConfig,
  lireConfig,
  type Config,
  type PilotageSite,
} from "@/lib/annonces/config"
import {
  envoyerMail,
  envoyerSansEchec,
  mailReinitialisation,
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

/**
 * Pilotage du site des annonces : pause, inscriptions, messagerie, bandeau,
 * lien sur le site de la radio. Appliqué tout de suite, sans redéployer.
 */
export async function actionPilotage(brut: PilotageSite) {
  return garde(async () => {
    const cfg = await lireConfig()
    const lien = texte(brut.bandeau?.lien, 300)
    if (lien && !/^https:\/\/\S+$/.test(lien))
      throw new Error("Le lien du bandeau doit commencer par https://")
    const bandeau = texte(brut.bandeau?.texte, 200)
    const avant = cfg.site
    cfg.site = {
      ouvert: Boolean(brut.ouvert),
      messagePause: texte(brut.messagePause, 300) || PILOTAGE_DEPART.messagePause,
      inscriptionsOuvertes: Boolean(brut.inscriptionsOuvertes),
      messagerieOuverte: Boolean(brut.messagerieOuverte),
      lienRadio: Boolean(brut.lienRadio),
      bandeau: { actif: Boolean(brut.bandeau?.actif) && bandeau.length > 0, texte: bandeau, lien },
    }
    await enregistrerConfig(cfg)
    const changes = (Object.keys(cfg.site) as (keyof PilotageSite)[]).filter(
      (k) => JSON.stringify(cfg.site[k]) !== JSON.stringify(avant[k]),
    )
    await journal("pilotage", { changes })
    revalidateTag(TAG_CONFIG, { expire: 0 })
    rafraichir()
    // Le lien « Annonces » vit dans le menu du site de la radio.
    if (avant.lienRadio !== cfg.site.lienRadio) revalidatePath("/[lang]", "layout")
    return changes.length ? "Enregistré : c'est appliqué tout de suite." : "Rien n'a changé."
  })
}

/* ───────────────────────── Fiche annonce : interventions directes ───────────────────────── */

/** Corriger une annonce (faute, prix, catégorie) sans la renvoyer en vérification. */
export async function actionCorriger(
  id: string,
  brut: { titre: string; description: string; prix: string; ville: string; categorie: string },
) {
  return garde(async () => {
    const a = await annonce(id)
    const cfg = await lireConfig()
    const titre = texte(brut.titre, 80)
    const description = texte(brut.description, 4000)
    const ville = texte(brut.ville, 60)
    if (titre.length < 5) throw new Error("Titre trop court (5 caractères au moins).")
    if (description.length < 20)
      throw new Error("Description trop courte (20 caractères au moins).")
    if (ville.length < 2) throw new Error("Indiquez la ville.")
    if (!cfg.categories.some((c) => c.slug === brut.categorie))
      throw new Error("Catégorie inconnue.")
    const p = String(brut.prix ?? "")
      .replace(/\s/g, "")
      .replace(",", ".")
    const prix = p === "" ? null : Math.round(Number(p) * 100)
    if (prix !== null && (!Number.isFinite(prix) || prix < 0 || prix > 1_000_000_000))
      throw new Error("Prix invalide.")
    await corrigerParModeration(a, { titre, description, prix, ville, categorie: brut.categorie })
    return "Annonce corrigée : c'est en ligne tout de suite."
  })
}

/** Offrir un coup de pouce (prolongation, remontée, à la une, mise en avant). */
export async function actionOffrir(id: string, cadeau: Cadeau, jours: number) {
  return garde(async () => {
    const a = await annonce(id)
    if (!["prolongation", "remontee", "accueil", "categorie", "renforcee"].includes(cadeau))
      throw new Error("Option inconnue.")
    if (!["publiee", "expiree"].includes(a.statut))
      throw new Error(
        "Seule une annonce en ligne (ou expirée, pour la prolonger) peut en profiter.",
      )
    if (a.statut === "expiree" && cadeau !== "prolongation")
      throw new Error("Prolongez d'abord l'annonce : elle n'est plus en ligne.")
    await offrirParModeration(a, cadeau, entier(jours, cadeau === "remontee" ? 0 : 1, 365))
    return "C'est fait : l'annonce en profite tout de suite."
  })
}

export async function actionVendueDirection(id: string) {
  return garde(async () => {
    const a = await annonce(id)
    if (!["publiee", "signalee", "expiree"].includes(a.statut))
      throw new Error("Cette annonce ne peut pas être marquée vendue.")
    a.vendueLe = Date.now()
    await changerStatut(a, "retiree", "Vendue", "direction")
    return "Annonce marquée vendue et retirée du site."
  })
}

/** Suppression définitive (photos comprises) : pour une annonce illicite ou en double. */
export async function actionSupprimerAnnonce(id: string, confirmation: string) {
  return garde(async () => {
    if (confirmation.trim().toUpperCase() !== "SUPPRIMER")
      throw new Error("Tapez SUPPRIMER pour confirmer.")
    const a = await annonce(id)
    await viderPhotos(a).catch((e) => console.error("[annonces] photos :", (e as Error).message))
    await effacerAnnonce(a)
    await journal("suppression-annonce", { annonce: a.id, compte: a.compte, titre: a.titre })
    rafraichir()
    return "Annonce supprimée définitivement."
  })
}

/* ───────────────────────── Fiche compte : interventions directes ───────────────────────── */

async function compteValide(id: string) {
  const c = idCompteValide(id) ? await lireCompte(id) : null
  if (!c) throw new Error("Compte introuvable.")
  return c
}

export async function actionConfirmerEmail(id: string) {
  return garde(async () => {
    const c = await compteValide(id)
    if (c.emailVerifie) return "L'adresse était déjà confirmée."
    c.emailVerifie = Date.now()
    await enregistrerCompte(c)
    await journal("email-confirme", { compte: c.id, par: "direction" })
    return "Adresse confirmée à la main."
  })
}

export async function actionLienMotDePasse(id: string) {
  return garde(async () => {
    const c = await compteValide(id)
    if (c.bloque) throw new Error("Compte suspendu : débloquez-le d'abord.")
    const jeton = await creerJeton("reinitialisation", c.id)
    await envoyerMail({ a: c.email, ...mailReinitialisation(c.nom, jeton) })
    await journal("lien-mot-de-passe", { compte: c.id, par: "direction" })
    return "Lien envoyé (valable 1 heure)."
  })
}

export async function actionDeconnecterCompte(id: string) {
  return garde(async () => {
    const c = await compteValide(id)
    await revoquerSessions(c.id)
    await journal("deconnexion", { compte: c.id, par: "direction" })
    return "Toutes ses sessions sont fermées."
  })
}

/** Un e-mail écrit à la main par la radio, envoyé depuis info@ (signé « L'équipe Radio Tripoint »). */
export async function actionEcrireCompte(id: string, objet: string, message: string) {
  return garde(async () => {
    const c = await compteValide(id)
    const o = texte(objet, 150)
    const m = texte(message, 5000)
    if (o.length < 3) throw new Error("Indiquez un objet.")
    if (m.length < 10) throw new Error("Le message est trop court.")
    await envoyerMail({ a: c.email, objet: o, texte: `Bonjour ${c.nom},\n\n${m}` })
    await journal("email-direction", { compte: c.id, objet: o })
    return "E-mail envoyé."
  })
}

/** Suppression du compte par la radio : annonces retirées, paiements non consommés remboursés. */
export async function actionSupprimerCompteDirection(id: string, confirmation: string) {
  return garde(async () => {
    if (confirmation.trim().toUpperCase() !== "SUPPRIMER")
      throw new Error("Tapez SUPPRIMER pour confirmer.")
    const c = await compteValide(id)
    for (const a of await annoncesDuCompte(c.id)) {
      if (a.statut === "retiree" || a.statut === "refusee") continue
      if (a.commande) {
        const cmd = await lireCommande(a.commande)
        if (cmd?.statut === "attente") await annulerCommande(cmd)
        if (cmd?.statut === "payee" && !a.publieeLe)
          await rembourser(cmd, "Compte supprimé avant publication").catch((e) =>
            console.error("[annonces] remboursement :", (e as Error).message),
          )
      }
      await changerStatut(a, "retiree", "Compte supprimé", "direction")
    }
    await effacerEspace(c.id)
    await effacerDiscussions(c.id)
    await supprimerCompte(c)
    await journal("suppression-compte", { compte: c.id, par: "direction" })
    return "Compte supprimé."
  })
}

/* ───────────────────────── Discussions signalées ───────────────────────── */

export async function actionClasserDiscussion(signalement: string) {
  return garde(async () => {
    await classerSignalementDiscussion(signalement)
    await journal("discussion-classee", { signalement })
    return "Signalement classé."
  })
}

/** Abus avéré : la discussion disparaît pour les deux participants. */
export async function actionSupprimerDiscussion(signalement: string, discussion: string) {
  return garde(async () => {
    await supprimerDiscussion(discussion)
    await classerSignalementDiscussion(signalement)
    await journal("discussion-supprimee", { discussion })
    return "Discussion supprimée pour les deux participants."
  })
}
