"use client"

import { useEffect } from "react"

/** Une vue de la fiche, une fois par session de navigation (le serveur trie le reste). */
export function CompteurVue({ id }: { id: string }) {
  useEffect(() => {
    const cle = `vue:${id}`
    try {
      if (sessionStorage.getItem(cle)) return
      sessionStorage.setItem(cle, "1")
    } catch {
      /* stockage indisponible : on compte quand même */
    }
    fetch("/api/annonces/vue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      keepalive: true,
    }).catch(() => {})
  }, [id])
  return null
}
