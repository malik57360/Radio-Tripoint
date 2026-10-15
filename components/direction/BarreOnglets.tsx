"use client"

import { LayoutGrid, LogOut, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { seDeconnecter } from "@/app/direction/actions"
import { cn } from "@/lib/utils/cn"
import { BoutonInstaller } from "./AppDirection"
import { PAGES, pageActive } from "./Navigation"

const ONGLETS = PAGES.filter((p) => p.onglet)
const AUTRES = PAGES.filter((p) => !p.onglet)

/** La page affichée (la plus précise qui correspond au chemin). */
const pageCourante = (chemin: string) =>
  [...PAGES].sort((a, b) => b.href.length - a.href.length).find((p) => pageActive(chemin, p.href))

const suivreDefilement = (rappel: () => void) => {
  window.addEventListener("scroll", rappel, { passive: true })
  return () => window.removeEventListener("scroll", rappel)
}
const titreSorti = () => window.scrollY > 64

/**
 * En-tête du téléphone : « Direction » en haut de page ; dès que le grand
 * titre de la page passe sous l'en-tête, c'est lui qui prend sa place.
 */
export function TitrePage() {
  const chemin = usePathname()
  const defile = useSyncExternalStore(suivreDefilement, titreSorti, () => false)
  const titre = pageCourante(chemin)?.libelle ?? "Direction"
  return (
    <span className="min-w-0">
      <span className="text-encre-3 block text-[0.7rem] leading-none font-semibold">
        {defile ? "Direction" : "Radio Tripoint"}
      </span>
      <span className="titre-page mt-0.5 block truncate text-[1.15rem] leading-tight">
        {defile ? titre : "Direction"}
      </span>
    </span>
  )
}

/**
 * Téléphone : barre d'onglets en bas de l'écran, sous le pouce. Les quatre
 * pages du quotidien y ont leur onglet ; « Plus » ouvre une feuille avec les
 * autres, l'installation de l'app et la déconnexion. Un voyant jaune marque
 * l'onglet actif, comme sur une console de régie.
 */
export function BarreOnglets({ alertes }: { alertes: number }) {
  const chemin = usePathname()
  const feuille = useRef<HTMLDialogElement>(null)
  const [ouverte, setOuverte] = useState(false)
  const dansPlus = AUTRES.some((p) => pageActive(chemin, p.href))

  // Une page choisie dans la feuille la referme.
  useEffect(() => {
    feuille.current?.close()
  }, [chemin])

  const ouvrir = () => {
    feuille.current?.showModal()
    setOuverte(true)
  }
  const fermer = () => feuille.current?.close()

  return (
    <>
      <nav
        aria-label="Pages principales"
        className="border-trait bg-fond/90 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto grid h-16 max-w-lg grid-cols-5">
          {ONGLETS.map((p) => {
            const Icone = p.icone
            const courant = pageActive(chemin, p.href)
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  aria-current={courant ? "page" : undefined}
                  className={cn(
                    "relative flex h-full flex-col items-center justify-center gap-1 text-[0.68rem] font-semibold",
                    courant ? "text-encre" : "text-encre-3",
                  )}
                >
                  {courant && (
                    <span
                      aria-hidden
                      className="voyant bg-accent absolute top-0 h-[3px] w-7 rounded-b-full"
                    />
                  )}
                  <span className="relative">
                    <Icone
                      className={cn("size-[1.4rem]", courant && "text-accent")}
                      strokeWidth={courant ? 2.2 : 1.8}
                      aria-hidden
                    />
                    {p.href === "/direction" && alertes > 0 && (
                      <span className="bg-alerte ring-fond absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[0.6rem] font-bold text-black ring-2">
                        {alertes}
                        <span className="sr-only"> alerte{alertes > 1 ? "s" : ""}</span>
                      </span>
                    )}
                  </span>
                  {p.court}
                </Link>
              </li>
            )
          })}
          <li>
            <button
              type="button"
              onClick={ouvrir}
              aria-haspopup="dialog"
              aria-expanded={ouverte}
              className={cn(
                "relative flex h-full w-full flex-col items-center justify-center gap-1 text-[0.68rem] font-semibold",
                dansPlus ? "text-encre" : "text-encre-3",
              )}
            >
              {dansPlus && (
                <span
                  aria-hidden
                  className="voyant bg-accent absolute top-0 h-[3px] w-7 rounded-b-full"
                />
              )}
              <LayoutGrid
                className={cn("size-[1.4rem]", dansPlus && "text-accent")}
                strokeWidth={dansPlus ? 2.2 : 1.8}
                aria-hidden
              />
              Plus
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={feuille}
        aria-label="Toutes les pages"
        className="feuille lg:hidden"
        onClose={() => setOuverte(false)}
        onClick={(e) => {
          // Un toucher à côté de la feuille (sur le fond) la referme.
          if (e.target === e.currentTarget) fermer()
        }}
      >
        <div className="bg-carte border-trait rounded-t-[1.75rem] border-t px-4 pt-2.5 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div aria-hidden className="bg-trait mx-auto h-1.5 w-10 rounded-full" />
          <div className="flex items-center justify-between py-3 pl-1">
            <p className="titre-page text-xl">Toutes les pages</p>
            <button
              type="button"
              onClick={fermer}
              aria-label="Fermer"
              className="bg-carte-2 text-encre-2 grid size-10 place-items-center rounded-full"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <ul className="grid grid-cols-2 gap-2">
            {AUTRES.map((p) => {
              const Icone = p.icone
              const courant = pageActive(chemin, p.href)
              return (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    onClick={fermer}
                    aria-current={courant ? "page" : undefined}
                    className={cn(
                      "flex h-full min-h-[6rem] flex-col rounded-2xl border p-3.5",
                      courant ? "border-accent/50 bg-accent-doux" : "border-trait bg-carte-2",
                    )}
                  >
                    <Icone className="text-accent size-5" aria-hidden />
                    <span className="mt-2.5 text-[0.95rem] leading-tight font-bold">
                      {p.libelle}
                    </span>
                    <span className="text-encre-3 mt-1 text-xs leading-snug">{p.desc}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 space-y-2">
            <BoutonInstaller variante="ligne" />
            <form action={seDeconnecter}>
              <button
                type="submit"
                className="border-trait text-encre-2 flex min-h-12 w-full items-center gap-3 rounded-2xl border px-4 text-sm font-semibold"
              >
                <LogOut className="size-4.5" aria-hidden />
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}
