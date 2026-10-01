"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const heure = (d: Date) =>
  d.toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" })

/** Heure de Paris et rafraîchissement complet de l'écran toutes les 60 s. */
export function Horloge({ genereLe }: { genereLe: number }) {
  const router = useRouter()
  const [maintenant, setMaintenant] = useState(genereLe)

  useEffect(() => {
    const tic = setInterval(() => setMaintenant(Date.now()), 1000)
    const rafraichir = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh()
    }, 60_000)
    return () => {
      clearInterval(tic)
      clearInterval(rafraichir)
    }
  }, [router])

  const age = Math.max(0, Math.round((maintenant - genereLe) / 1000))
  return (
    <div className="text-right">
      <p className="text-2xl leading-none font-extrabold">{heure(new Date(maintenant))}</p>
      <p className="text-encre-3 mt-1 text-[0.7rem]">
        {age < 5
          ? "à jour"
          : `données d'il y a ${age < 60 ? `${age} s` : `${Math.floor(age / 60)} min`}`}
      </p>
    </div>
  )
}
