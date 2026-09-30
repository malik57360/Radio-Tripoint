"use client"

import { Check, ChevronDown, Globe } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import { useLangue, useT } from "@/components/i18n/Langue"
import { langues, lienLangue, nomsLangues, sansLangue, type Langue } from "@/lib/i18n/langues"
import { cn } from "@/lib/utils/cn"

/** Même page, autre langue : le lecteur continue de jouer (navigation client). */
function useCibles(): Record<Langue, string> {
  const pathname = usePathname()
  const recherche = useSearchParams()?.toString()
  const base = sansLangue(pathname)
  const suffixe = recherche ? `?${recherche}` : ""
  return Object.fromEntries(langues.map((l) => [l, `${lienLangue(base, l)}${suffixe}`])) as Record<
    Langue,
    string
  >
}

function Menu({ className }: { className?: string }) {
  const langue = useLangue()
  const t = useT()
  const cibles = useCibles()
  const [ouvert, setOuvert] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ouvert) return
    const clic = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOuvert(false)
    }
    const echap = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false)
    document.addEventListener("mousedown", clic)
    document.addEventListener("keydown", echap)
    return () => {
      document.removeEventListener("mousedown", clic)
      document.removeEventListener("keydown", echap)
    }
  }, [ouvert])

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={ouvert}
        aria-controls="menu-langues"
        aria-label={t({ fr: "Langue du site", de: "Sprache der Website", lb: "Sprooch vum Site" })}
        onClick={() => setOuvert((v) => !v)}
        className="text-encre-2 hover:bg-papier-2 hover:text-encre inline-flex h-10 items-center gap-1 rounded-full px-2 text-[0.8rem] font-bold tracking-wide uppercase transition-colors"
      >
        <Globe className="size-4" aria-hidden />
        {langue}
        <ChevronDown
          className={cn("size-3.5 transition-transform", ouvert && "rotate-180")}
          aria-hidden
        />
      </button>
      {ouvert && (
        <ul
          id="menu-langues"
          className="fondu border-trait bg-surface shadow-2 absolute top-full right-0 z-50 mt-2 w-52 border py-2 max-sm:fixed max-sm:inset-x-4 max-sm:top-16 max-sm:mt-0 max-sm:w-auto"
        >
          {langues.map((l) => (
            <li key={l}>
              <Link
                href={cibles[l]}
                hrefLang={l}
                lang={l}
                scroll={false}
                onClick={() => setOuvert(false)}
                aria-current={l === langue ? "true" : undefined}
                className="text-encre-2 hover:bg-papier-2 hover:text-encre aria-[current=true]:text-encre flex items-center justify-between gap-3 px-4 py-2.5 text-[0.92rem] font-medium aria-[current=true]:font-bold"
              >
                <span>
                  <span className="text-encre-3 mr-2 inline-block w-6 text-[0.75rem] font-bold uppercase">
                    {l}
                  </span>
                  {nomsLangues[l]}
                </span>
                {l === langue && <Check className="text-accent-encre size-4" aria-hidden />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Sélecteur compact pour l'en-tête. */
export function SelecteurLangue({ className }: { className?: string }) {
  return (
    <Suspense fallback={<span className={cn("inline-block h-10 w-16", className)} />}>
      <Menu className={className} />
    </Suspense>
  )
}

function Liste({ sombre }: { sombre?: boolean }) {
  const langue = useLangue()
  const cibles = useCibles()
  return (
    <ul className="flex gap-2">
      {langues.map((l) => (
        <li key={l}>
          <Link
            href={cibles[l]}
            hrefLang={l}
            lang={l}
            scroll={false}
            aria-current={l === langue ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center border px-3 text-[0.85rem] font-semibold",
              sombre
                ? "border-nuit-trait text-nuit-encre-2 hover:border-nuit-encre aria-[current=true]:border-nuit-accent aria-[current=true]:bg-nuit-accent aria-[current=true]:text-nuit"
                : "border-trait text-encre-2 hover:border-encre aria-[current=true]:border-encre aria-[current=true]:bg-encre aria-[current=true]:text-papier",
            )}
          >
            {nomsLangues[l]}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** Version en boutons, pour le menu mobile. */
export function ListeLangues({ sombre }: { sombre?: boolean }) {
  return (
    <Suspense fallback={null}>
      <Liste sombre={sombre} />
    </Suspense>
  )
}
