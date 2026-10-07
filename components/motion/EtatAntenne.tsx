"use client"

import { useEffect } from "react"
import { useLecteur } from "@/lib/radio/useLecteur"

/**
 * Pose data-antenne="on" sur <html> quand le direct joue : le mouvement du
 * site (ondes du tripoint, spectre) s'accorde à l'antenne, en CSS.
 */
export function EtatAntenne() {
  const { source, statut } = useLecteur()
  const on = source === "direct" && statut === "playing"
  useEffect(() => {
    document.documentElement.dataset.antenne = on ? "on" : "off"
  }, [on])
  return null
}
