"use client"

import { CalendarDays, Headphones, House, Menu, Newspaper } from "lucide-react"
import type { ComponentType, ReactNode } from "react"
import { usePathname } from "next/navigation"
import Link from "@/components/ui/Lien"
import { estActif } from "@/config/navigation"
import { useT } from "@/components/i18n/Langue"
import { Mascotte } from "@/components/guide/Mascotte"
import { ouvrirTripo } from "@/components/guide/ouvrir"
import type { Trad } from "@/lib/i18n/langues"
import { cn } from "@/lib/utils/cn"

/** Événement qui ouvre le menu complet (écouté par l'en-tête). */
export const EVENEMENT_MENU = "menu:ouvrir"

type Onglet = {
  libelle: Trad
  icone: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  href: string
}

const ACCUEIL: Onglet = {
  libelle: { fr: "Accueil", de: "Start", lb: "Start", en: "Home", es: "Inicio" },
  icone: House,
  href: "/",
}
const ACTUS: Onglet = {
  libelle: { fr: "Actus", de: "News", lb: "News", en: "News", es: "Noticias" },
  icone: Newspaper,
  href: "/actualites",
}
const PODCASTS: Onglet = {
  libelle: { fr: "Podcasts", de: "Podcasts", lb: "Podcasts", en: "Podcasts", es: "Pódcasts" },
  icone: Headphones,
  href: "/podcasts",
}
const AGENDA: Onglet = {
  libelle: { fr: "Agenda", de: "Agenda", lb: "Agenda", en: "Events", es: "Agenda" },
  icone: CalendarDays,
  href: "/agenda",
}

const classeOnglet =
  "relative flex h-full flex-1 flex-col items-center justify-center gap-1 text-[0.68rem] font-semibold tracking-wide transition-colors"

function Indicateur({ actif }: { actif: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-nuit-accent absolute top-0 left-1/2 h-[3px] w-8 -translate-x-1/2 transition-transform",
        actif ? "scale-x-100" : "scale-x-0",
      )}
    />
  )
}

/**
 * Navigation du téléphone, en bas de l'écran, à portée de pouce : les
 * rubriques les plus utilisées, Tripo et le menu complet. Absente sur
 * grand écran, où l'en-tête porte la navigation.
 */
export function BarreOnglets({ guide }: { guide: boolean }) {
  const pathname = usePathname()
  const t = useT()

  const lien = (o: Onglet) => {
    const actif = estActif(pathname, o.href)
    const Icone = o.icone
    return (
      <Link
        key={o.href}
        href={o.href}
        aria-current={actif ? "page" : undefined}
        className={cn(classeOnglet, actif ? "text-nuit-accent" : "text-nuit-encre-2")}
      >
        <Indicateur actif={actif} />
        <Icone className="size-[1.35rem]" aria-hidden />
        {t(o.libelle)}
      </Link>
    )
  }

  const bouton = (libelle: string, icone: ReactNode, action: () => void) => (
    <button
      type="button"
      onClick={action}
      className={cn(classeOnglet, "text-nuit-encre-2 active:text-nuit-encre")}
    >
      {icone}
      {libelle}
    </button>
  )

  return (
    <nav
      aria-label={t({
        fr: "Navigation rapide",
        de: "Schnellnavigation",
        lb: "Séier Navigatioun",
        en: "Quick navigation",
        es: "Navegación rápida",
      })}
      className="bg-nuit text-nuit-encre border-nuit-trait fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="mx-auto flex h-[var(--barre-onglets)] max-w-xl items-stretch px-1">
        {lien(ACCUEIL)}
        {lien(ACTUS)}
        {lien(PODCASTS)}
        {guide
          ? bouton("Tripo", <Mascotte className="-my-1 size-7" />, () => ouvrirTripo())
          : lien(AGENDA)}
        {bouton(
          t({ fr: "Menu", de: "Menü", lb: "Menü", en: "Menu", es: "Menú" }),
          <Menu className="size-[1.35rem]" aria-hidden />,
          () => window.dispatchEvent(new Event(EVENEMENT_MENU)),
        )}
      </div>
    </nav>
  )
}
