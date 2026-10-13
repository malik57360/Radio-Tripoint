"use client"

import { useEffect } from "react"

/**
 * Article du tableau de bord lu dans une langue où il n'est pas encore
 * traduit : on demande sa traduction (une fois par visite et par article).
 * Elle s'affiche à la visite suivante, quand elle est prête.
 */
export function DemandeTraduction({ slug }: { slug: string }) {
  useEffect(() => {
    const cle = `trad:${slug}`
    try {
      if (sessionStorage.getItem(cle)) return
      sessionStorage.setItem(cle, "1")
    } catch {
      /* stockage indisponible : on demande quand même */
    }
    fetch("/api/articles/traduire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {})
  }, [slug])
  return null
}
