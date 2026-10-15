"use client"

import { useEffect } from "react"

/**
 * Page Horoscope lue sans l'horoscope du jour (ou sans sa traduction) : on
 * demande sa rédaction, une fois par visite. Il s'affiche quand il est prêt.
 */
export function DemandeHoroscope({ jour }: { jour: string }) {
  useEffect(() => {
    const cle = `horoscope:${jour}`
    try {
      if (sessionStorage.getItem(cle)) return
      sessionStorage.setItem(cle, "1")
    } catch {
      /* stockage indisponible : on demande quand même */
    }
    fetch("/api/horoscope", { method: "POST", keepalive: true }).catch(() => {})
  }, [jour])
  return null
}
