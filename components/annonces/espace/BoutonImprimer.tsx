"use client"

import { Printer } from "lucide-react"

export function BoutonImprimer() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn btn-trait min-h-10 px-3.5 text-sm"
    >
      <Printer className="size-4" aria-hidden />
      Imprimer ou enregistrer en PDF
    </button>
  )
}
