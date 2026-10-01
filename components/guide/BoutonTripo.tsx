"use client"

import type { ReactNode } from "react"
import { ouvrirTripo } from "./ouvrir"

/** Ouvre le panneau de Tripo, en posant éventuellement une question. */
export function BoutonTripo({
  question,
  className,
  children,
}: {
  question?: string
  className?: string
  children: ReactNode
}) {
  return (
    <button type="button" onClick={() => ouvrirTripo(question)} className={className}>
      {children}
    </button>
  )
}
