"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { useLecteur } from "@/lib/radio/useLecteur"

/** Tiré au hasard à l'ouverture de la page, gardé en mémoire seulement. */
const ID = Array.from(crypto.getRandomValues(new Uint8Array(12)), (o) =>
  (o % 36).toString(36),
).join("")

const INTERVALLE_MS = 20_000

function envoyer(corps: object, balise = false) {
  const donnees = JSON.stringify({ id: ID, ...corps })
  if (balise && navigator.sendBeacon) {
    navigator.sendBeacon("/api/presence", donnees)
    return
  }
  fetch("/api/presence", { method: "POST", body: donnees, keepalive: true }).catch(() => {})
}

/**
 * Signe de vie anonyme pour le tableau de bord de la direction : qui est
 * sur le site en ce moment, sur quelle page, et qui écoute quoi. Aucun
 * cookie, aucun stockage sur l'appareil (voir app/api/presence).
 */
export function Presence() {
  const pathname = usePathname()
  const l = useLecteur()
  const joue = l.statut === "playing"
  const etat = joue ? (l.source === "direct" ? "direct" : "podcast") : null
  const episode = l.source === "episode" ? (l.episode?.slug ?? null) : null

  const courant = useRef({ page: pathname, etat, episode })
  useEffect(() => {
    courant.current = { page: pathname, etat, episode }
  })

  // Signe de vie à chaque page, puis régulièrement tant que l'onglet est visible.
  useEffect(() => {
    envoyer(courant.current)
    const minuterie = setInterval(() => {
      if (document.visibilityState === "visible" || courant.current.etat) envoyer(courant.current)
    }, INTERVALLE_MS)
    return () => clearInterval(minuterie)
  }, [pathname])

  // Démarrage d'une écoute : compté une fois.
  const dernier = useRef<string | null>(null)
  useEffect(() => {
    const cle = etat ? `${etat}:${episode ?? ""}` : null
    if (cle && cle !== dernier.current) envoyer({ ...courant.current, evenement: etat })
    dernier.current = cle
  }, [etat, episode])

  // Départ : on libère la place tout de suite, sauf si la radio continue.
  useEffect(() => {
    const surVisibilite = () => {
      if (document.visibilityState === "hidden" && !courant.current.etat)
        envoyer({ quitter: true }, true)
      else if (document.visibilityState === "visible") envoyer(courant.current)
    }
    document.addEventListener("visibilitychange", surVisibilite)
    return () => document.removeEventListener("visibilitychange", surVisibilite)
  }, [])

  return null
}
