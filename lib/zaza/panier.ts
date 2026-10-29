"use client"

import { useSyncExternalStore } from "react"

/*
 * Le panier vit dans le navigateur (localStorage), hors de React : un seul
 * état partagé par le bouton de l'en-tête, les fiches et le tiroir. Côté
 * serveur, il est vide ; le vrai contenu arrive à l'hydratation.
 */

export type Ligne = { slug: string; quantite: number }
type Etat = { lignes: Ligne[]; ouvert: boolean }

const CLE = "zaza-panier"
const VIDE: Etat = { lignes: [], ouvert: false }

let etat: Etat = VIDE
let charge = false
const abonnes = new Set<() => void>()

function charger() {
  if (charge || typeof window === "undefined") return
  charge = true
  try {
    const lu = JSON.parse(localStorage.getItem(CLE) ?? "[]")
    if (Array.isArray(lu))
      etat = { ...etat, lignes: lu.filter((l) => typeof l?.slug === "string" && l.quantite > 0) }
  } catch {
    // Stockage indisponible (navigation privée) : panier en mémoire seulement.
  }
}

function changer(suivant: Etat) {
  etat = suivant
  try {
    localStorage.setItem(CLE, JSON.stringify(etat.lignes))
  } catch {
    // idem
  }
  abonnes.forEach((f) => f())
}

const abonner = (f: () => void) => {
  abonnes.add(f)
  return () => abonnes.delete(f)
}

const lire = () => {
  charger()
  return etat
}

export function usePanier() {
  return useSyncExternalStore(abonner, lire, () => VIDE)
}

export const panier = {
  ajouter(slug: string) {
    charger()
    const deja = etat.lignes.find((l) => l.slug === slug)
    const lignes = deja
      ? etat.lignes.map((l) => (l.slug === slug ? { ...l, quantite: l.quantite + 1 } : l))
      : [...etat.lignes, { slug, quantite: 1 }]
    changer({ lignes, ouvert: true })
  },
  modifier(slug: string, ecart: number) {
    const lignes = etat.lignes
      .map((l) => (l.slug === slug ? { ...l, quantite: l.quantite + ecart } : l))
      .filter((l) => l.quantite > 0)
    changer({ ...etat, lignes })
  },
  ouvrir() {
    changer({ ...etat, ouvert: true })
  },
  fermer() {
    changer({ ...etat, ouvert: false })
  },
}
