"use client"

import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { cn } from "@/lib/utils/cn"

/** Tout l'écran est recalculé à ce rythme ; le bloc « En direct », lui, toutes les 8 s. */
const PERIODE_S = 30

const heure = (d: Date) =>
  d.toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" })

/**
 * Heure de Paris et actualisation automatique de tout le tableau de bord,
 * sans recharger la page ni perdre la position de lecture. Elle reprend
 * aussitôt quand on revient sur l'onglet.
 */
export function Horloge({ genereLe }: { genereLe: number }) {
  const router = useRouter()
  const [maintenant, setMaintenant] = useState(genereLe)
  const [enCours, demarrer] = useTransition()

  useEffect(() => {
    const actualiser = () => demarrer(() => router.refresh())
    const tic = setInterval(() => setMaintenant(Date.now()), 1000)
    const minuterie = setInterval(() => {
      if (document.visibilityState === "visible") actualiser()
    }, PERIODE_S * 1000)
    const surRetour = () => {
      if (document.visibilityState === "visible") actualiser()
    }
    document.addEventListener("visibilitychange", surRetour)
    return () => {
      clearInterval(tic)
      clearInterval(minuterie)
      document.removeEventListener("visibilitychange", surRetour)
    }
  }, [router])

  const age = Math.max(0, Math.floor((maintenant - genereLe) / 1000))
  const reste = Math.max(0, PERIODE_S - (age % PERIODE_S))

  return (
    <div className="text-right">
      <p className="text-2xl leading-none font-extrabold">{heure(new Date(maintenant))}</p>
      <p className="text-encre-3 mt-1 inline-flex items-center gap-1.5 text-[0.7rem]">
        <RefreshCw className={cn("size-3", enCours && "text-accent animate-spin")} aria-hidden />
        {enCours ? "Actualisation…" : `Actualisation auto · dans ${reste} s`}
      </p>
    </div>
  )
}
