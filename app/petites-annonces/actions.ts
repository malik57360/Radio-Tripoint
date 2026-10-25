"use server"

import { randomBytes } from "node:crypto"
import { redirect } from "next/navigation"
import { verifierOrganisation } from "@/lib/agenda/propositions"
import { site } from "@/config/site"
import { redis } from "@/lib/direction/redis"
import {
  annoncesDuCompte,
  changerStatut,
  chercherDoublon,
  compterSignalement,
  creerAnnonce,
  empreinteTexte,
  journal,
  lierCommande,
  lireAnnonce,
  modifierAnnonce,
  nombreActives,
  appliquerOptions,
  type Contenu,
} from "@/lib/annonces/annonces"
import { defCategorie, estPays } from "@/lib/annonces/categories"
import {
  annulerCommande,
  creerCommande,
  lireCommande,
  rembourser,
  stripeActif,
  urlPaiement,
} from "@/lib/annonces/commandes"
import {
  EMAIL,
  compteConnecte,
  compteParEmail,
  consommerJeton,
  creerCompte,
  creerJeton,
  enregistrerCompte,
  fermerSession,
  hacher,
  lireCompte,
  motDePasseAcceptable,
  motDePasseCorrect,
  normaliserEmail,
  ouvrirSession,
  perdreDuTemps,
  revoquerSessions,
  supprimerCompte,
  type Compte,
  type InfosPro,
} from "@/lib/annonces/comptes"
import { lireConfig } from "@/lib/annonces/config"
import { autoriser, ipVisiteur } from "@/lib/annonces/limiteur"
import {
  alerteModeration,
  envoyerSansEchec,
  mailContact,
  mailDepotRecu,
  mailReinitialisation,
  mailVerification,
  mailsActifs,
} from "@/lib/annonces/mails"
import {
  lignesDepot,
  offreOuverte,
  optionUtile,
  photosPermises,
  total,
  type CodeOffre,
  type Ligne,
} from "@/lib/annonces/offres"
import {
  CP,
  centimes,
  coordonneesDans,
  mentionValide,
  photoDuCompte,
  schemaContenu,
  schemaDepot,
  verifierDetails,
  type DonneesDepot,
} from "@/lib/annonces/schemas"
import { idAnnonceValide, type Annonce } from "@/lib/annonces/types"

/**
 * Actions des Petites annonces côté public. Chaque action revérifie tout
 * sur le serveur : session, propriétaire de l'annonce, tarif (lu dans les
 * réglages, jamais envoyé par le navigateur), limites et débit. Les
 * actions serveur de Next refusent d'elles-mêmes les envois venus d'un
 * autre site (contrôle de l'origine).
 */

type Etat = { erreur?: string; ok?: string } | null
export type Resultat = { ok: true; url: string; message?: string } | { ok: false; erreur: string }

const ALERTES = () => process.env.FORM_EMAIL_TO || site.contact.email
const ESPACE = "/mon-espace"

/** Chemin de retour après connexion : seulement une page des annonces. */
const suiteSure = (s: unknown) =>
  typeof s === "string" && /^\/[\w\-/?=&%.]*$/.test(s) && !s.includes("//") ? s : ESPACE

const champ = (fd: FormData, k: string, max = 200) => String(fd.get(k) ?? "").slice(0, max)

/* ───────────────────────── Compte ───────────────────────── */

async function infosPro(fd: FormData): Promise<InfosPro | string> {
  const pays = champ(fd, "pro_pays", 2)
  if (!estPays(pays)) return "Choisissez le pays de votre entreprise."
  const p = {
    raisonSociale: champ(fd, "raison_sociale", 120).trim(),
    identifiant: champ(fd, "identifiant", 40).replace(/\s/g, "").toUpperCase(),
    pays,
    adresse: champ(fd, "pro_adresse", 160).trim(),
    codePostal: champ(fd, "pro_cp", 10).trim(),
    ville: champ(fd, "pro_ville", 60).trim(),
    telephone: champ(fd, "pro_telephone", 30).trim(),
    site: champ(fd, "pro_site", 200).trim() || undefined,
  }
  if (p.raisonSociale.length < 2) return "Indiquez le nom de votre entreprise."
  if (pays === "FR" && !/^\d{14}$/.test(p.identifiant)) return "Le SIRET compte 14 chiffres."
  if (p.identifiant.length < 4) return "Indiquez votre numéro d'immatriculation."
  if (p.adresse.length < 5 || p.ville.length < 2 || !CP[pays].test(p.codePostal))
    return "Indiquez l'adresse complète de l'entreprise."
  if (!/^\+?[\d\s.\-/()]{8,20}$/.test(p.telephone))
    return "Indiquez un numéro de téléphone professionnel."
  if (p.site && !/^https:\/\/[^\s]+\.[a-z]{2,}(\/\S*)?$/i.test(p.site))
    return "L'adresse du site doit commencer par https://"
  if (fd.get("engagement") !== "on")
    return "Cochez l'engagement : vos offres respectent le droit de l'Union européenne."
  return {
    ...p,
    engagement: Date.now(),
    verification: await verifierOrganisation(pays, p.identifiant),
  }
}

async function envoyerVerification(c: Compte) {
  const jeton = await creerJeton("verification", c.id)
  return envoyerSansEchec({ a: c.email, ...mailVerification(c.nom, jeton) })
}

export async function actionInscription(_e: Etat, fd: FormData): Promise<Etat> {
  if (champ(fd, "site_web")) return { ok: "Compte créé." } // champ piège : un robot l'a rempli
  const ip = await ipVisiteur()
  if (!(await autoriser("inscription", ip, 5, 3600)))
    return { erreur: "Trop d'inscriptions depuis cette connexion. Réessayez dans une heure." }
  const email = normaliserEmail(champ(fd, "email", 200))
  const nom = champ(fd, "nom", 40).trim()
  const mdp = champ(fd, "mot_de_passe", 200)
  const type = fd.get("type") === "pro" ? "pro" : "particulier"
  if (!EMAIL.test(email)) return { erreur: "Adresse e-mail invalide." }
  if (nom.length < 2 || coordonneesDans(nom)) return { erreur: "Indiquez un prénom ou un pseudo." }
  const faible = motDePasseAcceptable(mdp)
  if (faible) return { erreur: faible }
  if (fd.get("conditions") !== "on")
    return { erreur: "Acceptez les conditions d'utilisation pour créer votre compte." }
  let pro: InfosPro | undefined
  if (type === "pro") {
    const p = await infosPro(fd)
    if (typeof p === "string") return { erreur: p }
    pro = p
  }
  let c: Compte | null
  try {
    c = await creerCompte({ email, nom, type, pro }, mdp)
  } catch {
    return { erreur: "Service momentanément indisponible. Réessayez dans un instant." }
  }
  // Adresse déjà inscrite : même réponse, sans dire si elle existe.
  if (!c)
    return {
      erreur:
        "Impossible de créer ce compte. Déjà inscrit ? Connectez-vous ou choisissez « Mot de passe oublié ».",
    }
  await envoyerVerification(c)
  await journal("inscription", { compte: c.id, type })
  await ouvrirSession(c)
  redirect(`${ESPACE}?bienvenue=1`)
}

export async function actionConnexion(_e: Etat, fd: FormData): Promise<Etat> {
  const ip = await ipVisiteur()
  const email = normaliserEmail(champ(fd, "email", 200))
  const mdp = champ(fd, "mot_de_passe", 200)
  if (
    !(await autoriser("connexion-ip", ip, 20, 900)) ||
    !(await autoriser("connexion", email, 8, 900))
  )
    return { erreur: "Trop d'essais. Réessayez dans un quart d'heure." }
  const c = EMAIL.test(email) ? await compteParEmail(email) : null
  if (!c) {
    await perdreDuTemps(mdp)
    return { erreur: "E-mail ou mot de passe incorrect." }
  }
  if (!(await motDePasseCorrect(mdp, c.hache)))
    return { erreur: "E-mail ou mot de passe incorrect." }
  if (c.bloque) return { erreur: "Ce compte est suspendu. Écrivez-nous à " + site.contact.email }
  await ouvrirSession(c)
  redirect(suiteSure(fd.get("suite")))
}

export async function actionDeconnexion() {
  await fermerSession()
  redirect("/")
}

export async function actionRenvoyerVerification(): Promise<Etat> {
  const c = await compteConnecte()
  if (!c) return { erreur: "Connectez-vous d'abord." }
  if (c.emailVerifie) return { ok: "Votre adresse est déjà confirmée." }
  if (!(await autoriser("verif", c.id, 3, 3600)))
    return {
      erreur: "Lien déjà renvoyé plusieurs fois : regardez dans vos courriers indésirables.",
    }
  if (!mailsActifs() || !(await envoyerVerification(c)))
    return { erreur: "L'e-mail n'a pas pu partir. Réessayez plus tard." }
  return { ok: `Lien envoyé à ${c.email}.` }
}

export async function actionMotDePasseOublie(_e: Etat, fd: FormData): Promise<Etat> {
  const email = normaliserEmail(champ(fd, "email", 200))
  const reponse = {
    ok: "Si un compte existe pour cette adresse, un lien vient de lui être envoyé (valable 1 heure).",
  }
  if (!EMAIL.test(email)) return { erreur: "Adresse e-mail invalide." }
  if (
    !(await autoriser("oubli-ip", await ipVisiteur(), 10, 3600)) ||
    !(await autoriser("oubli", email, 3, 3600))
  )
    return reponse
  const c = await compteParEmail(email)
  if (c && !c.bloque) {
    const jeton = await creerJeton("reinitialisation", c.id)
    await envoyerSansEchec({ a: c.email, ...mailReinitialisation(c.nom, jeton) })
  }
  return reponse
}

export async function actionNouveauMotDePasse(_e: Etat, fd: FormData): Promise<Etat> {
  const mdp = champ(fd, "mot_de_passe", 200)
  const faible = motDePasseAcceptable(mdp)
  if (faible) return { erreur: faible }
  const c = await consommerJeton("reinitialisation", champ(fd, "jeton", 80))
  if (!c) return { erreur: "Ce lien a expiré ou a déjà servi. Refaites une demande." }
  c.hache = await hacher(mdp)
  // Ouvrir le lien prouve l'accès à la boîte mail.
  c.emailVerifie ??= Date.now()
  await enregistrerCompte(c)
  await revoquerSessions(c.id)
  await journal("mot-de-passe", { compte: c.id })
  if (c.bloque) return { ok: "Mot de passe changé." }
  await ouvrirSession(c)
  redirect(`${ESPACE}?mdp=1`)
}

/** Espace personnel : nom, informations pro, mot de passe. */
export async function actionProfil(_e: Etat, fd: FormData): Promise<Etat> {
  const c = await compteConnecte()
  if (!c) return { erreur: "Session expirée : reconnectez-vous." }
  const nom = champ(fd, "nom", 40).trim()
  if (nom.length < 2 || coordonneesDans(nom)) return { erreur: "Indiquez un prénom ou un pseudo." }
  c.nom = nom
  if (c.type === "pro" || fd.get("devenir_pro") === "on") {
    const p = await infosPro(fd)
    if (typeof p === "string") return { erreur: p }
    // Numéro inchangé : la vérification déjà faite (et celle de la modération) reste.
    const meme = c.pro?.identifiant === p.identifiant && c.pro?.pays === p.pays
    c.pro = meme
      ? { ...p, verification: c.pro?.verification, valideParModeration: c.pro?.valideParModeration }
      : p
    if (c.type !== "pro") await journal("passage-pro", { compte: c.id })
    c.type = "pro"
  }
  await enregistrerCompte(c)
  return { ok: "Informations enregistrées." }
}

export async function actionChangerMotDePasse(_e: Etat, fd: FormData): Promise<Etat> {
  const c = await compteConnecte()
  if (!c) return { erreur: "Session expirée : reconnectez-vous." }
  if (!(await autoriser("mdp", c.id, 5, 900)))
    return { erreur: "Trop d'essais. Réessayez plus tard." }
  if (!(await motDePasseCorrect(champ(fd, "actuel", 200), c.hache)))
    return { erreur: "Mot de passe actuel incorrect." }
  const mdp = champ(fd, "mot_de_passe", 200)
  const faible = motDePasseAcceptable(mdp)
  if (faible) return { erreur: faible }
  c.hache = await hacher(mdp)
  await enregistrerCompte(c)
  await revoquerSessions(c.id)
  await ouvrirSession(c)
  return { ok: "Mot de passe changé. Vos autres appareils sont déconnectés." }
}

/** Suppression du compte : annonces retirées, paiements non consommés remboursés. */
export async function actionSupprimerCompte(_e: Etat, fd: FormData): Promise<Etat> {
  const c = await compteConnecte()
  if (!c) return { erreur: "Session expirée : reconnectez-vous." }
  if (!(await motDePasseCorrect(champ(fd, "mot_de_passe", 200), c.hache)))
    return { erreur: "Mot de passe incorrect." }
  for (const a of await annoncesDuCompte(c.id)) await retirerParAnnonceur(a, "Compte supprimé")
  await supprimerCompte(c)
  await journal("suppression-compte", { compte: c.id })
  await fermerSession()
  redirect("/?compte=supprime")
}

/* ───────────────────────── Dépôt ───────────────────────── */

async function garde(): Promise<Compte | string> {
  const c = await compteConnecte()
  if (!c) return "Session expirée : reconnectez-vous."
  if (!c.emailVerifie) return "Confirmez d'abord votre adresse e-mail (lien reçu à l'inscription)."
  return c
}

/** Contenu commun au dépôt et à la modification ; renvoie l'erreur à afficher ou le contenu propre. */
async function contenuValide(
  brut: unknown,
  c: Compte,
  photosMax: number | null,
): Promise<{ erreur: string } | { contenu: Contenu; precautions: string[] | undefined }> {
  const r = schemaContenu.safeParse(brut)
  if (!r.success) return { erreur: r.error.issues[0]?.message ?? "Formulaire incomplet." }
  const d = r.data
  const cfg = await lireConfig()
  const cat = cfg.categories.find((x) => x.slug === d.categorie && x.actif)
  const def = defCategorie(d.categorie)
  if (!cat || !def) return { erreur: "Cette catégorie n'est pas ouverte." }
  const coord = coordonneesDans(d.titre) ?? coordonneesDans(d.description)
  if (coord) return { erreur: coord }
  const pays = d.pays as Contenu["pays"]
  const cp = d.codePostal.toUpperCase().replace(/^L-?/, "")
  if (!CP[pays].test(cp)) return { erreur: "Code postal invalide pour ce pays." }
  const { erreur, propres } = verifierDetails(d.categorie, d.details)
  if (erreur) return { erreur }
  const mention = mentionValide(d.mention)
  let prix: number | null = null
  if (def.prix !== "aucun" && mention !== "don") {
    const p = centimes(d.prix)
    if (p === "invalide")
      return { erreur: "Prix invalide : un nombre en euros, par exemple 150 ou 12,50." }
    prix = p
  }
  if (photosMax !== null && d.photos.length > photosMax)
    return { erreur: `${photosMax} photos au plus avec cette formule.` }
  if (!d.photos.every((p) => photoDuCompte(p, c.id)))
    return { erreur: "Une photo n'est pas valide : renvoyez-la." }
  return {
    contenu: {
      categorie: d.categorie,
      titre: d.titre,
      description: d.description,
      prix,
      mention,
      pays,
      ville: d.ville,
      codePostal: cp,
      details: propres,
      photos: d.photos,
    },
    precautions: def.precautions,
  }
}

const identitePro = (c: Compte): Annonce["pro"] =>
  c.type === "pro" && c.pro
    ? {
        raisonSociale: c.pro.raisonSociale,
        identifiant: c.pro.identifiant,
        pays: c.pro.pays,
        ville: c.pro.ville,
        site: c.pro.site,
        telephone: c.pro.telephone,
      }
    : undefined

export async function actionDeposer(brut: DonneesDepot): Promise<Resultat> {
  const c = await garde()
  if (typeof c === "string") return { ok: false, erreur: c }
  const cfg = await lireConfig()
  if (!cfg.depotsOuverts)
    return { ok: false, erreur: "Les dépôts sont momentanément fermés. Réessayez plus tard." }
  const r = schemaDepot.safeParse(brut)
  if (!r.success)
    return { ok: false, erreur: r.error.issues[0]?.message ?? "Formulaire incomplet." }
  const d = r.data
  if (c.type === "pro" && !c.pro)
    return {
      ok: false,
      erreur: "Complétez d'abord les informations de votre entreprise (Mon espace).",
    }

  let lignes: Ligne[]
  try {
    lignes = lignesDepot(cfg.offres, c.type, d.formule as CodeOffre, d.options as CodeOffre[])
  } catch (e) {
    return { ok: false, erreur: (e as Error).message }
  }
  const photosMax = photosPermises(
    cfg.offres,
    d.formule as CodeOffre,
    lignes.map((l) => l.code),
  )
  const v = await contenuValide(d, c, photosMax)
  if ("erreur" in v) return { ok: false, erreur: v.erreur }
  if (v.precautions?.length && !d.precautions)
    return { ok: false, erreur: "Cochez les précautions propres à cette catégorie." }
  const aPayer = total(lignes)
  if (aPayer > 0 && !stripeActif())
    return {
      ok: false,
      erreur: "Le paiement en ligne n'est pas encore ouvert : choisissez une formule gratuite.",
    }
  if (aPayer > 0 && c.type === "particulier" && !d.executionImmediate)
    return {
      ok: false,
      erreur: "Cochez la case sur l'exécution immédiate pour continuer vers le paiement.",
    }

  const miennes = await annoncesDuCompte(c.id)
  if (c.type === "particulier" && nombreActives(miennes) >= cfg.limites.activesParticulier)
    return {
      ok: false,
      erreur: `${cfg.limites.activesParticulier} annonces actives au plus pour un particulier : retirez-en une d'abord.`,
    }
  if (!(await autoriser("depot", c.id, cfg.limites.depotsParJour, 24 * 3600)))
    return { ok: false, erreur: "Nombre de dépôts du jour atteint. Réessayez demain." }

  const doublon = await chercherDoublon(empreinteTexte(v.contenu.titre, v.contenu.description))
  if (doublon?.compte === c.id)
    return { ok: false, erreur: "Vous avez déjà une annonce avec ce texte." }

  const a = await creerAnnonce({
    ...v.contenu,
    compte: c.id,
    annonceur: c.type,
    nom: c.type === "pro" && c.pro ? c.pro.raisonSociale : c.nom,
    pro: identitePro(c),
    formule: d.formule as CodeOffre,
    optionsDepot: lignes.slice(1).map((l) => l.code),
    photosMax,
    doublonDe: doublon?.id,
    payante: aPayer > 0,
  })

  if (aPayer > 0) {
    const cmd = await creerCommande({
      compte: c.id,
      email: c.email,
      annonce: a.id,
      nature: "depot",
      lignes,
      executionImmediate: d.executionImmediate ? Date.now() : 0,
    })
    await lierCommande(a, cmd.id)
    try {
      return { ok: true, url: await urlPaiement(cmd, a.titre) }
    } catch (e) {
      console.error("[annonces] stripe :", (e as Error).message)
      return {
        ok: true,
        url: `${ESPACE}?paiement=erreur`,
        message: "Annonce enregistrée : réglez-la depuis Mon espace.",
      }
    }
  }
  await envoyerSansEchec({ a: c.email, ...mailDepotRecu(c.nom, a) })
  await envoyerSansEchec({ a: ALERTES(), ...alerteModeration(a, "depot") })
  return { ok: true, url: `${ESPACE}?depot=ok` }
}

async function miennePourModifier(id: string, c: Compte) {
  if (!idAnnonceValide(id)) return null
  const a = await lireAnnonce(id)
  return a && a.compte === c.id ? a : null
}

export async function actionModifier(id: string, brut: unknown): Promise<Resultat> {
  const c = await garde()
  if (typeof c === "string") return { ok: false, erreur: c }
  const a = await miennePourModifier(id, c)
  if (!a) return { ok: false, erreur: "Annonce introuvable." }
  const v = await contenuValide(brut, c, a.photosMax)
  if ("erreur" in v) return { ok: false, erreur: v.erreur }
  if (!(await autoriser("modif", c.id, 20, 24 * 3600)))
    return { ok: false, erreur: "Trop de modifications aujourd'hui. Réessayez demain." }
  const doublon = await chercherDoublon(
    empreinteTexte(v.contenu.titre, v.contenu.description),
    a.id,
  )
  if (doublon?.compte === c.id)
    return { ok: false, erreur: "Vous avez déjà une autre annonce avec ce texte." }
  const etaitEnLigne = a.statut === "publiee" || a.statut === "signalee"
  try {
    await modifierAnnonce(a, v.contenu, doublon?.id)
  } catch (e) {
    return { ok: false, erreur: (e as Error).message }
  }
  if (etaitEnLigne) await envoyerSansEchec({ a: ALERTES(), ...alerteModeration(a, "modification") })
  return {
    ok: true,
    url: `${ESPACE}?modifiee=${etaitEnLigne ? "verif" : "ok"}`,
  }
}

/** Retrait par l'annonceur. Payée mais jamais publiée : remboursée (le service n'a pas commencé). */
async function retirerParAnnonceur(a: Annonce, motif: string) {
  if (a.statut === "retiree" || a.statut === "refusee") return
  if (a.commande) {
    const cmd = await lireCommande(a.commande)
    if (cmd?.statut === "attente") await annulerCommande(cmd)
    if (cmd?.statut === "payee" && !a.publieeLe)
      await rembourser(cmd, `${motif} avant publication`).catch((e) =>
        console.error("[annonces] remboursement :", (e as Error).message),
      )
  }
  await changerStatut(a, "retiree", motif, "annonceur")
}

export async function actionRetirer(id: string): Promise<Resultat> {
  const c = await compteConnecte()
  if (!c) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  const a = await miennePourModifier(id, c)
  if (!a) return { ok: false, erreur: "Annonce introuvable." }
  await retirerParAnnonceur(a, "Retirée par l'annonceur")
  return { ok: true, url: `${ESPACE}?retiree=1` }
}

/** Reprendre le paiement d'une annonce déposée mais pas encore réglée. */
export async function actionPayer(id: string): Promise<Resultat> {
  const c = await compteConnecte()
  if (!c) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  const a = await miennePourModifier(id, c)
  if (!a || a.statut !== "attente_paiement" || !a.commande)
    return { ok: false, erreur: "Rien à régler pour cette annonce." }
  const cmd = await lireCommande(a.commande)
  if (!cmd || cmd.statut !== "attente")
    return { ok: false, erreur: "Rien à régler pour cette annonce." }
  try {
    return { ok: true, url: await urlPaiement(cmd, a.titre) }
  } catch (e) {
    return { ok: false, erreur: (e as Error).message }
  }
}

/** Options après publication : remontée, mise en avant, photos, prolongation. */
export async function actionOptions(
  id: string,
  codes: string[],
  executionImmediate: boolean,
): Promise<Resultat> {
  const c = await garde()
  if (typeof c === "string") return { ok: false, erreur: c }
  const a = await miennePourModifier(id, c)
  if (!a) return { ok: false, erreur: "Annonce introuvable." }
  const cfg = await lireConfig()
  const formule = cfg.offres.find((o) => o.code === a.formule)
  const choisies = [...new Set(codes)].slice(0, 6)
  const lignes: Ligne[] = []
  for (const code of choisies) {
    const o = cfg.offres.find((x) => x.code === code && x.genre === "option")
    if (!o || !offreOuverte(o, a.annonceur)) return { ok: false, erreur: "Option indisponible." }
    if (!optionUtile(formule, o))
      return { ok: false, erreur: `« ${o.nom} » est déjà compris dans votre formule.` }
    const permise =
      o.effet === "prolongation"
        ? a.statut === "publiee" || a.statut === "expiree"
        : a.statut === "publiee"
    if (!permise)
      return { ok: false, erreur: `« ${o.nom} » n'est possible que pour une annonce en ligne.` }
    lignes.push({ code: o.code, libelle: o.nom, centimes: o.prixCentimes })
  }
  if (!lignes.length) return { ok: false, erreur: "Choisissez au moins une option." }
  const aPayer = total(lignes)
  if (aPayer === 0) {
    await appliquerOptions(
      a,
      cfg,
      lignes.map((l) => l.code),
    )
    return { ok: true, url: `${ESPACE}?options=ok` }
  }
  if (!stripeActif()) return { ok: false, erreur: "Le paiement en ligne n'est pas encore ouvert." }
  if (a.annonceur === "particulier" && !executionImmediate)
    return { ok: false, erreur: "Cochez la case sur l'exécution immédiate pour continuer." }
  const cmd = await creerCommande({
    compte: c.id,
    email: c.email,
    annonce: a.id,
    nature: "options",
    lignes,
    executionImmediate: executionImmediate ? Date.now() : 0,
  })
  try {
    return { ok: true, url: await urlPaiement(cmd, a.titre) }
  } catch (e) {
    return { ok: false, erreur: (e as Error).message }
  }
}

/* ───────────────────────── Contact et signalement ───────────────────────── */

export async function actionContacter(_e: Etat, fd: FormData): Promise<Etat> {
  if (champ(fd, "site_web")) return { ok: "Message envoyé." }
  const c = await garde()
  if (typeof c === "string") return { erreur: c }
  const id = champ(fd, "annonce", 20)
  const message = champ(fd, "message", 2500).trim()
  if (message.length < 10) return { erreur: "Votre message est trop court." }
  if (message.length > 2000) return { erreur: "2 000 caractères au plus." }
  if (/\b(?:https?:\/\/|www\.)\S+/i.test(message))
    return { erreur: "Pas de lien dans le message : c'est la technique n° 1 des arnaques." }
  const ip = await ipVisiteur()
  if (
    !(await autoriser("contact", c.id, 15, 3600)) ||
    !(await autoriser("contact-ip", ip, 30, 3600))
  )
    return { erreur: "Beaucoup de messages en peu de temps. Réessayez dans une heure." }
  if (!(await autoriser(`contact-${id}`, c.id, 3, 24 * 3600)))
    return { erreur: "Vous avez déjà écrit plusieurs fois à cet annonceur aujourd'hui." }
  const a = idAnnonceValide(id) ? await lireAnnonce(id) : null
  if (!a || a.statut !== "publiee") return { erreur: "Cette annonce n'est plus en ligne." }
  if (a.compte === c.id) return { erreur: "C'est votre propre annonce." }
  const annonceur = await lireCompte(a.compte)
  if (!annonceur || annonceur.bloque) return { erreur: "Cette annonce n'est plus en ligne." }
  const parti = await envoyerSansEchec({
    a: annonceur.email,
    repondreA: c.email,
    ...mailContact({ nomAnnonceur: annonceur.nom, a, nomExpediteur: c.nom, message }),
  })
  if (!parti) return { erreur: "Le message n'a pas pu partir. Réessayez plus tard." }
  await redis([["HINCRBY", "rt:annonces:contacts", a.id, 1]])
  return { ok: "Message envoyé ! L'annonceur vous répondra directement par e-mail." }
}

const MOTIFS_SIGNALEMENT = {
  arnaque: "Arnaque ou tentative de fraude",
  interdit: "Produit ou service interdit",
  illicite: "Contenu illicite ou choquant",
  discrimination: "Discrimination (emploi, logement…)",
  trompeuse: "Annonce trompeuse ou fausse",
  doublon: "Doublon ou spam",
  autre: "Autre raison",
} as const
export type MotifSignalement = keyof typeof MOTIFS_SIGNALEMENT

export async function actionSignaler(_e: Etat, fd: FormData): Promise<Etat> {
  if (champ(fd, "site_web")) return { ok: "Merci, signalement reçu." }
  const id = champ(fd, "annonce", 20)
  const motif = champ(fd, "motif", 20) as MotifSignalement
  const explication = champ(fd, "explication", 1200).trim()
  if (!(motif in MOTIFS_SIGNALEMENT)) return { erreur: "Choisissez un motif." }
  if (explication.length < 10) return { erreur: "Expliquez en quelques mots ce qui ne va pas." }
  if (fd.get("bonne_foi") !== "on") return { erreur: "Cochez la case de bonne foi." }
  const c = await compteConnecte()
  const email = c?.email ?? normaliserEmail(champ(fd, "email", 200))
  if (!c && email && !EMAIL.test(email)) return { erreur: "Adresse e-mail invalide." }
  const ip = await ipVisiteur()
  if (!(await autoriser("signalement", c?.id ?? ip, 6, 3600)))
    return { erreur: "Beaucoup de signalements en peu de temps. Réessayez plus tard." }
  const a = idAnnonceValide(id) ? await lireAnnonce(id) : null
  if (!a || (a.statut !== "publiee" && a.statut !== "signalee"))
    return { ok: "Merci, signalement reçu." }
  // Une même personne (compte ou connexion) ne compte qu'une fois par annonce.
  const qui = c?.id ?? ip
  const neuf = await redis([
    ["SET", `rt:annonces:signale:${a.id}:${qui}`, "1", "NX", "EX", 90 * 24 * 3600],
  ])
  await redis([
    [
      "LPUSH",
      "rt:annonces:signalements",
      JSON.stringify({
        id: randomBytes(6).toString("hex"),
        annonce: a.id,
        motif,
        libelle: MOTIFS_SIGNALEMENT[motif],
        explication,
        email: email || undefined,
        compte: c?.id,
        le: Date.now(),
        doublon: neuf?.[0] !== "OK",
      }),
    ],
    ["LTRIM", "rt:annonces:signalements", 0, 1999],
  ])
  if (neuf?.[0] === "OK") {
    const cfg = await lireConfig()
    const masquee = await compterSignalement(a, cfg)
    if (masquee || (a.signalements ?? 0) === 1)
      await envoyerSansEchec({ a: ALERTES(), ...alerteModeration(a, "signalement") })
  }
  await journal("signalement", { annonce: a.id, motif })
  return { ok: "Merci, signalement reçu. L'équipe de modération va l'examiner." }
}
