"use client"

import {
  Activity,
  BarChart3,
  HeartPulse,
  ImagePlus,
  LayoutDashboard,
  Mail,
  Newspaper,
  Radio,
  ServerCog,
  Target,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"

export const PAGES = [
  { href: "/direction", libelle: "Vue d'ensemble", court: "Accueil", icone: LayoutDashboard },
  { href: "/direction/direct", libelle: "En direct", court: "Direct", icone: Activity },
  { href: "/direction/mails", libelle: "Mails", court: "Mails", icone: Mail },
  { href: "/direction/prospection", libelle: "Prospection", court: "Prospection", icone: Target },
  { href: "/direction/flyer", libelle: "Flyer du week-end", court: "Flyer", icone: ImagePlus },
  { href: "/direction/audience", libelle: "Audience", court: "Audience", icone: BarChart3 },
  { href: "/direction/antenne", libelle: "Antenne", court: "Antenne", icone: Radio },
  { href: "/direction/engagement", libelle: "Engagement", court: "Engagement", icone: HeartPulse },
  { href: "/direction/contenu", libelle: "Contenu", court: "Contenu", icone: Newspaper },
  { href: "/direction/technique", libelle: "Technique", court: "Technique", icone: ServerCog },
] as const

const actif = (chemin: string, href: string) =>
  href === "/direction" ? chemin === href : chemin.startsWith(href)

/** Menu latéral sur grand écran, onglets défilants sur téléphone. */
export function Navigation({ alertes }: { alertes: number }) {
  const chemin = usePathname()
  return (
    <>
      <nav aria-label="Pages du tableau de bord" className="hidden lg:block">
        <ul className="sticky top-24 space-y-1">
          {PAGES.map((p) => {
            const Icone = p.icone
            const courant = actif(chemin, p.href)
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  aria-current={courant ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                    courant
                      ? "bg-accent-doux text-accent"
                      : "text-encre-2 hover:bg-carte-2 hover:text-encre",
                  )}
                >
                  <Icone className="size-4.5 flex-none" aria-hidden />
                  {p.libelle}
                  {p.href === "/direction" && alertes > 0 && (
                    <span className="bg-alerte ml-auto rounded-full px-1.5 text-[0.7rem] font-bold text-black">
                      {alertes}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <nav
        aria-label="Pages du tableau de bord"
        className="border-trait bg-fond/95 sticky top-[4.25rem] z-20 -mx-4 overflow-x-auto border-b px-4 backdrop-blur lg:hidden"
      >
        <ul className="flex gap-1 py-2 whitespace-nowrap">
          {PAGES.map((p) => {
            const Icone = p.icone
            const courant = actif(chemin, p.href)
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  aria-current={courant ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold",
                    courant ? "bg-accent text-black" : "text-encre-2 bg-carte",
                  )}
                >
                  <Icone className="size-4" aria-hidden />
                  {p.court}
                  {p.href === "/direction" && alertes > 0 && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[0.65rem] font-bold",
                        courant ? "bg-black text-white" : "bg-alerte text-black",
                      )}
                    >
                      {alertes}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
