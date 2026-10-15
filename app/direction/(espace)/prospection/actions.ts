"use server"

import { estConnecte } from "@/lib/direction/acces"
import {
  ecrireBrouillon,
  lireConseils,
  oublierBrouillon,
  preparerUneEtape,
  selectionnerDuJour,
} from "@/lib/direction/conseils"
import {
  coordonneesConnues,
  trouverCoordonnees,
  type Coordonnees,
} from "@/lib/direction/coordonnees"
import { envoyerNouveau } from "@/lib/direction/mails"
import {
  STATUTS,
  ecrireSuivi,
  lireSuivi,
  type Statut,
  type Suivi,
} from "@/lib/direction/prospection"

/** Enregistre le suivi d'un prospect (statut, note, coordonnées trouvées). */
export async function actionSuivi(
  siren: string,
  donnees: Omit<Suivi, "maj">,
): Promise<{ ok: true } | { ok: false; erreur: string }> {
  if (!(await estConnecte())) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  if (!/^\d{9}$/.test(siren)) return { ok: false, erreur: "Entreprise invalide." }
  if (!(donnees.statut in STATUTS)) return { ok: false, erreur: "Statut invalide." }
  const propre = (s: string, n: number) => String(s ?? "").slice(0, n)
  try {
    await ecrireSuivi(siren, {
      statut: donnees.statut as Statut,
      note: propre(donnees.note, 2000),
      email: propre(donnees.email, 200).trim(),
      telephone: propre(donnees.telephone, 40).trim(),
      nom: propre(donnees.nom, 200),
      commune: propre(donnees.commune, 100),
      activite: propre(donnees.activite, 100),
      dernierEnvoi: donnees.dernierEnvoi,
      maj: Date.now(),
    })
    return { ok: true }
  } catch (e) {
    return { ok: false, erreur: (e as Error).message }
  }
}

/** Cherche l'e-mail et le téléphone publics d'une entreprise (IA + recherche web). */
export async function actionTrouverCoordonnees(fiche: {
  siren: string
  nom: string
  enseigne?: string | null
  activite: string
  adresse?: string
  commune: string
}): Promise<{ ok: true; coordonnees: Coordonnees } | { ok: false; erreur: string }> {
  if (!(await estConnecte())) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  if (!/^\d{9}$/.test(String(fiche?.siren))) return { ok: false, erreur: "Entreprise invalide." }
  const t = (s: unknown, n: number) => String(s ?? "").slice(0, n)
  try {
    const coordonnees = await trouverCoordonnees({
      siren: fiche.siren,
      nom: t(fiche.nom, 200),
      enseigne: t(fiche.enseigne, 200) || null,
      activite: t(fiche.activite, 100),
      adresse: t(fiche.adresse, 300),
      commune: t(fiche.commune, 100),
    })
    return { ok: true, coordonnees }
  } catch (e) {
    console.error("[prospection] coordonnées", (e as Error).message)
    return { ok: false, erreur: "Recherche impossible pour le moment : réessayez." }
  }
}

/* ───────────── Conseils du jour ───────────── */

/** Une étape de préparation (recherche des mails, écriture des messages). */
export async function actionPreparer(): Promise<
  { ok: true; reste: boolean } | { ok: false; erreur: string }
> {
  if (!(await estConnecte())) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  try {
    const conseils = await selectionnerDuJour()
    if (!conseils) return { ok: false, erreur: "L'annuaire ne répond pas : réessayez plus tard." }
    const etat = await preparerUneEtape()
    return { ok: true, reste: etat.reste }
  } catch (e) {
    console.error("[conseils] préparation :", (e as Error).message)
    return {
      ok: false,
      erreur: "Préparation interrompue : elle reprendra à la prochaine ouverture.",
    }
  }
}

/**
 * Envoie le message préparé pour une entreprise conseillée, à l'adresse
 * trouvée (lue côté serveur, pas fournie par la page). La fiche passe en
 * « Contacté » et le brouillon est retiré.
 */
export async function actionEnvoyerConseil(
  siren: string,
  objet: string,
  texte: string,
): Promise<{ ok: true; a: string } | { ok: false; erreur: string }> {
  if (!(await estConnecte())) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  if (!/^\d{9}$/.test(siren)) return { ok: false, erreur: "Entreprise invalide." }
  if (!texte.trim() || !objet.trim()) return { ok: false, erreur: "Le message est vide." }
  try {
    const [conseils, coords, avant] = await Promise.all([
      lireConseils(),
      coordonneesConnues([siren]),
      lireSuivi(siren).catch(() => null),
    ])
    if (avant && avant.statut !== "a_contacter")
      return { ok: false, erreur: "Déjà contactée ou à ne plus contacter." }
    const email = coords[siren]?.email
    if (!email) return { ok: false, erreur: "Pas d'adresse e-mail pour cette entreprise." }
    const c = conseils?.entreprises.find((e) => e.siren === siren)
    const a = await envoyerNouveau(email, objet.slice(0, 200), texte.slice(0, 20_000))
    await ecrireSuivi(siren, {
      statut: "contacte",
      note: avant?.note ?? "",
      email: a,
      telephone: avant?.telephone || coords[siren]?.telephone || "",
      nom: c ? (c.enseigne ?? c.nom) : (avant?.nom ?? ""),
      commune: c?.commune ?? avant?.commune ?? "",
      activite: c?.activite ?? avant?.activite ?? "",
      maj: Date.now(),
      dernierEnvoi: Date.now(),
    })
    await oublierBrouillon(siren)
    return { ok: true, a }
  } catch (e) {
    console.error("[conseils] envoi :", (e as Error).message)
    return { ok: false, erreur: (e as Error).message || "Envoi impossible." }
  }
}

/** « Chercher le mail » d'une entreprise conseillée (hors des 30 du matin) puis écrire son message. */
export async function actionChercherConseil(
  siren: string,
): Promise<{ ok: true; trouve: boolean } | { ok: false; erreur: string }> {
  if (!(await estConnecte())) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  const c = (await lireConseils())?.entreprises.find((e) => e.siren === siren)
  if (!c) return { ok: false, erreur: "Entreprise introuvable dans les conseils du jour." }
  try {
    const coords = await trouverCoordonnees({
      siren: c.siren,
      nom: c.nom,
      enseigne: c.enseigne,
      activite: c.activite,
      adresse: c.adresse,
      commune: c.commune,
    })
    if (coords.email) await ecrireBrouillon(c)
    return { ok: true, trouve: Boolean(coords.email) }
  } catch (e) {
    console.error("[conseils] recherche :", (e as Error).message)
    return { ok: false, erreur: "Recherche impossible pour le moment : réessayez." }
  }
}
