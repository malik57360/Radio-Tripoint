"use client"

import { useEffect } from "react"
import { demarrerDirectAuto, ecouterDirect, lire } from "@/lib/radio/moteur"

/**
 * Lance le direct dès l'arrivée sur le site. Si le navigateur refuse le son
 * sans geste (Chrome, Safari, Firefox le font par défaut), le premier geste
 * du visiteur n'importe où sur la page lance le direct. Les boutons du
 * lecteur (data-controle-lecteur) sont exclus : ils gèrent eux-mêmes la
 * lecture, sinon le même toucher lancerait puis couperait le son.
 */
const GESTES = ["pointerdown", "pointerup", "touchend", "keydown", "click"] as const

export function DirectAuto() {
  useEffect(() => {
    let actif = true
    let fait = false

    const retirer = () => GESTES.forEach((g) => document.removeEventListener(g, surGeste, true))

    function surGeste(e: Event) {
      if (fait) return
      const cible = e.target instanceof Element ? e.target : null
      if (cible?.closest("[data-controle-lecteur]")) {
        fait = true
        retirer()
        return
      }
      if (e instanceof KeyboardEvent && e.key === "Escape") return
      fait = true
      retirer()
      const { statut, source, attenteGeste } = lire()
      if (attenteGeste && source === "direct" && statut !== "playing" && statut !== "loading") {
        void ecouterDirect()
      }
    }

    void demarrerDirectAuto().then((r) => {
      if (actif && r === "bloque") {
        GESTES.forEach((g) => document.addEventListener(g, surGeste, true))
      }
    })

    return () => {
      actif = false
      retirer()
    }
  }, [])

  return null
}
