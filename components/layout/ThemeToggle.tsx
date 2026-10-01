"use client"

import { useT } from "@/components/i18n/Langue"
import type { Trad } from "@/lib/i18n/langues"
import { Monitor, Moon, Sun } from "lucide-react"
import { useSyncExternalStore } from "react"

type Theme = "auto" | "clair" | "sombre"
const CLE = "rt:theme"
const abonnes = new Set<() => void>()

function lireTheme(): Theme {
  const t = document.documentElement.dataset.theme
  return t === "clair" || t === "sombre" ? t : "auto"
}

function appliquer(t: Theme) {
  if (t === "auto") delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = t
  try {
    if (t === "auto") localStorage.removeItem(CLE)
    else localStorage.setItem(CLE, t)
  } catch {
    /* stockage indisponible */
  }
  abonnes.forEach((f) => f())
}

/** Script inline anti-flash : applique le thème choisi avant le premier rendu. */
export const scriptTheme = `try{var t=localStorage.getItem("${CLE}");if(t==="clair"||t==="sombre")document.documentElement.dataset.theme=t}catch(e){}`

const suivant: Record<Theme, Theme> = { auto: "clair", clair: "sombre", sombre: "auto" }
const libelles: Record<Theme, Trad> = {
  auto: {
    fr: "automatique",
    de: "automatisch",
    lb: "automatesch",
    en: "automatic",
    es: "automático",
  },
  clair: { fr: "clair", de: "hell", lb: "hell", en: "light", es: "claro" },
  sombre: { fr: "sombre", de: "dunkel", lb: "donkel", en: "dark", es: "oscuro" },
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(
    (f) => {
      abonnes.add(f)
      return () => abonnes.delete(f)
    },
    lireTheme,
    () => "auto" as Theme,
  )
  const t = useT()
  const Icone = theme === "clair" ? Sun : theme === "sombre" ? Moon : Monitor
  const libelle = `${t({ fr: "Thème", de: "Design", lb: "Design", en: "Theme", es: "Tema" })} : ${t(libelles[theme])}`
  return (
    <button
      type="button"
      onClick={() => appliquer(suivant[theme])}
      aria-label={`${libelle}. ${t({ fr: "Changer.", de: "Ändern.", lb: "Änneren.", en: "Change.", es: "Cambiar." })}`}
      title={libelle}
      className={className}
    >
      <Icone className="size-4" aria-hidden />
      <span>{t(libelles[theme])}</span>
    </button>
  )
}
