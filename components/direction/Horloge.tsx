"use client"

import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"
import { cn } from "@/lib/utils/cn"

/** Tout l'écran est recalculé à ce rythme ; le bloc « En direct », lui, toutes les 8 s. */
const PERIODE_S = 30
const TOUR = 2 * Math.PI * 15 // anneau du téléphone (rayon 15)

const heure = (d: Date) =>
  d.toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" })

/**
 * Heure de Paris et actualisation automatique de tout le tableau de bord,
 * sans recharger la page ni perdre la position de lecture. Elle reprend
 * aussitôt quand on revient sur l'onglet.
 * Téléphone : un anneau qui se remplit jusqu'à la prochaine actualisation ;
 * le toucher actualise tout de suite.
 */
export function Horloge({ genereLe }: { genereLe: number }) {
  const router = useRouter()
  const [maintenant, setMaintenant] = useState(genereLe)
  const [enCours, demarrer] = useTransition()
  const actualiser = useCallback(() => demarrer(() => router.refresh()), [router])

  useEffect(() => {
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
  }, [actualiser])

  const age = Math.max(0, Math.floor((maintenant - genereLe) / 1000))
  const reste = Math.max(0, PERIODE_S - (age % PERIODE_S))

  return (
    <>
      <button
        type="button"
        onClick={actualiser}
        aria-label={`Actualiser maintenant (automatique dans ${reste} s)`}
        className="relative grid size-10 flex-none place-items-center rounded-full lg:hidden"
      >
        <svg viewBox="0 0 36 36" aria-hidden className="absolute inset-0 size-10 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--d-trait)" strokeWidth="2.5" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="var(--d-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={TOUR}
            strokeDashoffset={enCours ? 0 : TOUR * (reste / PERIODE_S)}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
          />
        </svg>
        <RefreshCw
          className={cn("text-encre-2 size-4", enCours && "text-accent animate-spin")}
          aria-hidden
        />
      </button>
      <div className="hidden text-right lg:block">
        <p className="chiffre text-2xl leading-none">{heure(new Date(maintenant))}</p>
        <p className="text-encre-3 mt-1 inline-flex items-center gap-1.5 text-[0.7rem]">
          <RefreshCw className={cn("size-3", enCours && "text-accent animate-spin")} aria-hidden />
          {enCours ? "Actualisation…" : <>Actualisation auto · dans {reste} s</>}
        </p>
      </div>
    </>
  )
}
