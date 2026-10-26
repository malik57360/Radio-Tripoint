"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useSyncExternalStore } from "react"
import { cn } from "@/lib/utils/cn"

/**
 * Messages non lus de la messagerie, pour la pastille de l'onglet Messages.
 * L'en-tête ne se redessine pas d'une page à l'autre : le chiffre se relit
 * à chaque changement de page, quand on revient sur l'onglet, et quand une
 * discussion ouverte vient d'être lue.
 */
let valeur: number | null = null
let cheminVu: string | null = null
let enCours = false
let encore = false
const abonnes = new Set<() => void>()
const prevenir = () => abonnes.forEach((f) => f())
const abonner = (f: () => void) => {
  abonnes.add(f)
  return () => {
    abonnes.delete(f)
  }
}

export function rafraichirNonLus() {
  // Une demande pendant une autre : on relira une fois la première revenue.
  if (enCours) {
    encore = true
    return
  }
  enCours = true
  fetch("/api/annonces/messages", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { n?: number } | null) => {
      if (typeof d?.n !== "number") return
      valeur = d.n
      prevenir()
    })
    .catch(() => {})
    .finally(() => {
      enCours = false
      if (encore) {
        encore = false
        rafraichirNonLus()
      }
    })
}

export function useNonLus(initial: number, connecte = true) {
  const chemin = usePathname().replace(/^\/petites-annonces/, "") || "/"
  const n = useSyncExternalStore(
    abonner,
    () => valeur ?? initial,
    () => initial,
  )

  useEffect(() => {
    if (!connecte || cheminVu === chemin) return
    const premiereVisite = cheminVu === null
    cheminVu = chemin
    if (!premiereVisite) rafraichirNonLus()
  }, [chemin, connecte])

  useEffect(() => {
    if (!connecte) return
    const auRetour = () => document.visibilityState === "visible" && rafraichirNonLus()
    document.addEventListener("visibilitychange", auRetour)
    return () => document.removeEventListener("visibilitychange", auRetour)
  }, [connecte])

  return n
}

/** Pastille jaune (le rouge est réservé au direct de la radio). */
export function Pastille({ n, className }: { n: number; className?: string }) {
  if (n <= 0) return null
  return (
    <span
      aria-hidden
      className={cn(
        "bg-accent text-sur-accent grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full px-1 text-[0.68rem] leading-none font-extrabold tabular-nums",
        className,
      )}
    >
      {n > 9 ? "9+" : n}
    </span>
  )
}

/** L'onglet « Messages » de l'en-tête : la messagerie en un geste, depuis n'importe quelle page. */
export function OngletMessages({ connecte, initial }: { connecte: boolean; initial: number }) {
  const n = useNonLus(initial, connecte)
  return (
    <Link
      href={connecte ? "/messages" : "/connexion?suite=/messages"}
      aria-label={n > 0 ? `Messages, ${n} non lu${n > 1 ? "s" : ""}` : "Messages"}
      className="hover:bg-nuit-2 inline-flex min-h-10 flex-none items-center gap-1.5 rounded-full px-1.5 text-sm font-bold md:px-3"
    >
      <span className="relative">
        <MessageCircle className="size-6" aria-hidden />
        <Pastille n={n} className="ring-nuit absolute -top-1.5 -right-2 ring-2" />
      </span>
      <span className="hidden md:inline">Messages</span>
    </Link>
  )
}
