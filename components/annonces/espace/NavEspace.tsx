"use client"

import { Bell, Heart, LayoutGrid, Receipt, Settings2, Tag, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"

/**
 * Menu de « Mon espace » : colonne à gauche sur ordinateur, bande qui
 * défile sous l'en-tête au téléphone. Un chiffre jaune signale ce qui
 * attend (nouvelles annonces d'une alerte).
 */
const ENTREES: { href: string; nom: string; icone: LucideIcon; cle?: keyof Compteurs }[] = [
  { href: "/mon-espace", nom: "Tableau de bord", icone: LayoutGrid },
  { href: "/mon-espace/annonces", nom: "Mes annonces", icone: Tag, cle: "annonces" },
  { href: "/mon-espace/favoris", nom: "Favoris", icone: Heart, cle: "favoris" },
  { href: "/mon-espace/alertes", nom: "Alertes", icone: Bell, cle: "alertes" },
  { href: "/mon-espace/paiements", nom: "Paiements", icone: Receipt },
  { href: "/mon-espace/compte", nom: "Compte et sécurité", icone: Settings2 },
]

export interface Compteurs {
  annonces: number
  favoris: number
  alertes: number
}

/** Ce qui demande l'attention : en jaune. Le reste : un total discret. */
const ATTENTION: (keyof Compteurs)[] = ["alertes"]

export function NavEspace({ compteurs }: { compteurs: Compteurs }) {
  const chemin = usePathname().replace(/^\/petites-annonces/, "") || "/"
  const actif = (href: string) =>
    href === "/mon-espace" ? chemin === href : chemin === href || chemin.startsWith(`${href}/`)
  return (
    <nav aria-label="Mon espace" className="nav-espace">
      <ul className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
        {ENTREES.map(({ href, nom, icone: Icone, cle }) => {
          const n = cle ? compteurs[cle] : 0
          const on = actif(href)
          return (
            <li key={href} className="flex-none">
              <Link
                href={href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2.5 rounded-xl px-3.5 text-[0.92rem] font-bold whitespace-nowrap transition-colors lg:rounded-lg lg:px-3",
                  on
                    ? "bg-nuit text-nuit-encre"
                    : "text-encre-2 hover:bg-papier-2 bg-surface border-trait border lg:border-transparent lg:bg-transparent",
                )}
              >
                <Icone className="size-[1.1rem] flex-none" strokeWidth={2.1} aria-hidden />
                <span className="lg:flex-1">{nom}</span>
                {n > 0 && (
                  <span
                    className={cn(
                      "min-w-6 rounded-full px-1.5 text-center text-[0.72rem] leading-5 font-extrabold tabular-nums",
                      cle && ATTENTION.includes(cle)
                        ? "bg-accent text-black"
                        : on
                          ? "bg-nuit-2 text-nuit-encre-2"
                          : "bg-papier-2 text-encre-3",
                    )}
                  >
                    {n}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
