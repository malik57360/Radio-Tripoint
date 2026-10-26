"use client"

import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { createContext, useCallback, useContext, useEffect, useState, useTransition } from "react"
import { actionFavori } from "@/app/petites-annonces/actions"
import { cn } from "@/lib/utils/cn"

/**
 * Favoris côté navigateur. Les pages d'annonces sont mises en cache et
 * communes à tous : on demande une fois au serveur les favoris de la
 * personne connectée, et chaque cœur s'allume d'après cette liste.
 */
type Etat = { connecte: boolean | null; ids: Set<string> }
const Ctx = createContext<{
  etat: Etat
  basculer: (id: string) => Promise<string | null>
} | null>(null)

export function FavorisProvider({ children }: { children: React.ReactNode }) {
  const [etat, setEtat] = useState<Etat>({ connecte: null, ids: new Set() })
  useEffect(() => {
    let actif = true
    fetch("/api/annonces/favoris", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { connecte: boolean; ids: string[] } | null) => {
        if (actif && d) setEtat({ connecte: d.connecte, ids: new Set(d.ids) })
      })
      .catch(() => {})
    return () => {
      actif = false
    }
  }, [])

  const basculer = useCallback(async (id: string) => {
    let voulu = true
    setEtat((e) => {
      const ids = new Set(e.ids)
      voulu = !ids.has(id)
      if (voulu) ids.add(id)
      else ids.delete(id)
      return { ...e, ids }
    })
    const r = await actionFavori(id, voulu)
    if (r.ok) return null
    // Refusé : on remet le cœur comme avant.
    setEtat((e) => {
      const ids = new Set(e.ids)
      if (voulu) ids.delete(id)
      else ids.add(id)
      return { ...e, ids, connecte: r.connexion ? false : e.connecte }
    })
    return r.connexion ? "connexion" : r.erreur
  }, [])

  return <Ctx.Provider value={{ etat, basculer }}>{children}</Ctx.Provider>
}

export function BoutonFavori({
  id,
  grand = false,
  className,
}: {
  id: string
  /** Sur la fiche : un vrai bouton avec son texte. */
  grand?: boolean
  className?: string
}) {
  const ctx = useContext(Ctx)
  const router = useRouter()
  const [, demarrer] = useTransition()
  const [erreur, setErreur] = useState<string | null>(null)
  if (!ctx) return null
  const on = ctx.etat.ids.has(id)

  const clic = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (ctx.etat.connecte === false) {
      router.push(`/connexion?suite=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    demarrer(async () => {
      const r = await ctx.basculer(id)
      if (r === "connexion")
        router.push(`/connexion?suite=${encodeURIComponent(window.location.pathname)}`)
      else setErreur(r)
    })
  }

  if (grand)
    return (
      <div className={className}>
        <button
          type="button"
          onClick={clic}
          aria-pressed={on}
          className={cn("btn min-h-11 w-full", on ? "btn-plein" : "btn-trait")}
        >
          <Heart className={cn("coeur size-4", on && "fill-current")} aria-hidden />
          {on ? "Dans vos favoris" : "Mettre de côté"}
        </button>
        {erreur && (
          <p role="alert" className="text-alerte mt-1.5 text-sm font-semibold">
            {erreur}
          </p>
        )}
      </div>
    )
  return (
    <button
      type="button"
      onClick={clic}
      aria-pressed={on}
      aria-label={on ? "Retirer des favoris" : "Mettre de côté"}
      title={erreur ?? (on ? "Retirer des favoris" : "Mettre de côté")}
      className={cn(
        "bouton-coeur grid size-10 place-items-center rounded-full shadow-md backdrop-blur transition-transform active:scale-90",
        on ? "bg-white text-[#d92d4b]" : "bg-white/90 text-black",
        className,
      )}
    >
      <Heart
        className={cn("coeur size-[1.15rem]", on && "fill-current")}
        strokeWidth={2.2}
        aria-hidden
      />
    </button>
  )
}
