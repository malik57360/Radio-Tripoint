"use server"

import { estConnecte } from "@/lib/direction/acces"
import { trouverCoordonnees, type Coordonnees } from "@/lib/direction/coordonnees"
import { STATUTS, ecrireSuivi, type Statut, type Suivi } from "@/lib/direction/prospection"

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
