"use client"

import {
  Activity,
  BarChart3,
  CalendarCheck,
  HeartPulse,
  ImagePlus,
  LayoutDashboard,
  Mail,
  Mic,
  Newspaper,
  PenLine,
  Radio,
  ServerCog,
  Target,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"

/**
 * Pages du tableau de bord. `desc` sert au menu « Plus » du téléphone ;
 * les pages `onglet` ont leur place dans la barre du bas.
 */
export const PAGES = [
  {
    href: "/direction",
    libelle: "Vue d'ensemble",
    court: "Accueil",
    icone: LayoutDashboard,
    onglet: true,
    desc: "L'essentiel en dix secondes",
  },
  {
    href: "/direction/direct",
    libelle: "En direct",
    court: "Direct",
    icone: Activity,
    onglet: false,
    desc: "Qui est sur le site en ce moment",
  },
  {
    href: "/direction/mails",
    libelle: "Mails",
    court: "Mails",
    icone: Mail,
    onglet: true,
    desc: "La boîte info@, réponses proposées par l'IA",
  },
  {
    href: "/direction/prospection",
    libelle: "Prospection",
    court: "Prospection",
    icone: Target,
    onglet: true,
    desc: "Entreprises à contacter",
  },
  {
    href: "/direction/articles",
    libelle: "Articles",
    court: "Articles",
    icone: PenLine,
    onglet: true,
    desc: "Écrire et publier un article",
  },
  {
    href: "/direction/podcasts",
    libelle: "Podcasts",
    court: "Podcasts",
    icone: Mic,
    onglet: false,
    desc: "Publier un replay ou un podcast",
  },
  {
    href: "/direction/agenda",
    libelle: "Agenda payant",
    court: "Agenda",
    icone: CalendarCheck,
    onglet: false,
    desc: "Événements proposés par les organisateurs",
  },
  {
    href: "/direction/flyer",
    libelle: "Flyer du week-end",
    court: "Flyer",
    icone: ImagePlus,
    onglet: false,
    desc: "Prêt à poster sur Instagram et Facebook",
  },
  {
    href: "/direction/audience",
    libelle: "Audience",
    court: "Audience",
    icone: BarChart3,
    onglet: false,
    desc: "Visiteurs et pages vues du site",
  },
  {
    href: "/direction/antenne",
    libelle: "Antenne",
    court: "Antenne",
    icone: Radio,
    onglet: false,
    desc: "Flux, titres diffusés et grille",
  },
  {
    href: "/direction/engagement",
    libelle: "Engagement",
    court: "Engagement",
    icone: HeartPulse,
    onglet: false,
    desc: "Écoutes du direct et questions à Tripo",
  },
  {
    href: "/direction/contenu",
    libelle: "Contenu",
    court: "Contenu",
    icone: Newspaper,
    onglet: false,
    desc: "Articles et agenda en ligne",
  },
  {
    href: "/direction/technique",
    libelle: "Technique",
    court: "Technique",
    icone: ServerCog,
    onglet: false,
    desc: "Santé du site et des services",
  },
] as const

export const pageActive = (chemin: string, href: string) =>
  href === "/direction" ? chemin === href : chemin.startsWith(href)

/** Menu latéral, sur grand écran. Sur téléphone : la barre d'onglets du bas (BarreOnglets). */
export function Navigation({ alertes }: { alertes: number }) {
  const chemin = usePathname()
  return (
    <nav aria-label="Pages du tableau de bord" className="hidden lg:block">
      <ul className="sticky top-24 space-y-1">
        {PAGES.map((p) => {
          const Icone = p.icone
          const courant = pageActive(chemin, p.href)
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
  )
}
