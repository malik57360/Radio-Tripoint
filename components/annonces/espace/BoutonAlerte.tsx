"use client"

import { BellPlus, Check, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { actionCreerAlerte } from "@/app/petites-annonces/actions"
import Link from "@/components/ui/Lien"

/** « Créer une alerte » : enregistre la recherche affichée (ses paramètres d'adresse). */
export function BoutonAlerte({ categorie }: { categorie?: string }) {
  const sp = useSearchParams()
  const router = useRouter()
  const [enCours, demarrer] = useTransition()
  const [fait, setFait] = useState<string | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)

  const creer = () =>
    demarrer(async () => {
      setErreur(null)
      const params = Object.fromEntries(sp.entries())
      const r = await actionCreerAlerte(params, categorie)
      if (r.ok) return setFait(r.message)
      if (r.connexion) {
        const ici = `${window.location.pathname}${window.location.search}`
        return router.push(`/connexion?suite=${encodeURIComponent(ici)}`)
      }
      setErreur(r.erreur)
    })

  if (fait)
    return (
      <p role="status" className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        <Check className="text-succes size-4" aria-hidden />
        {fait}
        <Link href="/mon-espace/alertes" className="lien">
          Mes alertes
        </Link>
      </p>
    )
  return (
    <div>
      <button
        type="button"
        onClick={creer}
        disabled={enCours}
        className="btn btn-trait min-h-10 px-3.5 text-sm"
      >
        {enCours ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <BellPlus className="size-4" aria-hidden />
        )}
        Créer une alerte
      </button>
      {erreur && (
        <p role="alert" className="text-alerte mt-1.5 text-sm font-semibold">
          {erreur}
        </p>
      )}
    </div>
  )
}
