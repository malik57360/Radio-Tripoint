"use client"

import { useEffect, useState } from "react"

const hm = (ms: number) =>
  new Date(ms).toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
  })
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

/** Avancement du titre à l'antenne, seconde par seconde. */
export function Progression({
  debut,
  fin,
  genereLe,
}: {
  debut: string
  fin: string
  genereLe: number
}) {
  const d = Date.parse(debut)
  const f = Date.parse(fin)
  const [maintenant, setMaintenant] = useState(genereLe)
  useEffect(() => {
    const tic = setInterval(() => setMaintenant(Date.now()), 1000)
    return () => clearInterval(tic)
  }, [])
  const ecoule = Math.min(f - d, Math.max(0, maintenant - d)) / 1000
  const pct = (ecoule / ((f - d) / 1000)) * 100
  return (
    <div className="mt-4">
      <div className="bg-grille h-1.5 overflow-hidden rounded-full">
        <div
          className="bg-accent h-full rounded-full transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-encre-3 mt-1.5 flex justify-between text-xs tabular-nums">
        <span>{hm(d)}</span>
        <span className="text-encre-2 font-semibold">
          {mmss(ecoule)} / {mmss((f - d) / 1000)}
        </span>
        <span>fin {hm(f)}</span>
      </p>
    </div>
  )
}
