"use client"

import { ArrowRight, Loader2, Search, X } from "lucide-react"
import Link from "@/components/ui/Lien"
import { useRouter } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"
import { libellesTypes, type Resultat } from "@/lib/contenu/recherche-types"
import { useT } from "@/components/i18n/Langue"
import { Dialogue } from "./Dialogue"

const suggestions = ["Sierck-les-Bains", "Schengen", "Perl", "Génération Z", "Sport"]

export function SearchDialog({ ouvert, fermer }: { ouvert: boolean; fermer: () => void }) {
  const router = useRouter()
  const t = useT()
  const [q, setQ] = useState("")
  const [resultats, setResultats] = useState<Resultat[] | null>(null)
  const [charge, setCharge] = useState(false)
  const champ = useRef<HTMLInputElement>(null)
  const idListe = useId()

  const clore = () => {
    setQ("")
    setResultats(null)
    fermer()
  }

  useEffect(() => {
    if (ouvert) requestAnimationFrame(() => champ.current?.focus())
  }, [ouvert])

  useEffect(() => {
    const terme = q.trim()
    if (terme.length < 2) return
    const ctrl = new AbortController()
    const minuterie = setTimeout(async () => {
      setCharge(true)
      try {
        const r = await fetch(`/api/recherche?q=${encodeURIComponent(terme)}&langue=${t.langue}`, {
          signal: ctrl.signal,
        })
        const d = (await r.json()) as { resultats: Resultat[] }
        setResultats(d.resultats)
      } catch {
        /* requête annulée ou hors ligne : on garde l'état précédent */
      } finally {
        if (!ctrl.signal.aborted) setCharge(false)
      }
    }, 180)
    return () => {
      clearTimeout(minuterie)
      ctrl.abort()
    }
  }, [q, t.langue])

  const terme = q.trim()
  const aAfficher = terme.length >= 2 ? resultats : null

  return (
    <Dialogue
      ouvert={ouvert}
      fermer={clore}
      label={t({ fr: "Recherche", de: "Suche", lb: "Sich", en: "Search", es: "Búsqueda" })}
      className="w-full"
    >
      <div className="fondu bg-surface text-encre shadow-2 sm:border-trait mx-auto mt-0 w-full max-w-2xl sm:mt-[10vh] sm:border">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            if (!terme) return
            clore()
            router.push(t.lien(`/recherche?q=${encodeURIComponent(terme)}`))
          }}
          className="border-trait flex items-center gap-3 border-b px-4"
        >
          {charge ? (
            <Loader2 className="text-encre-3 size-5 flex-none animate-spin" aria-hidden />
          ) : (
            <Search className="text-encre-3 size-5 flex-none" aria-hidden />
          )}
          <label htmlFor="recherche-globale" className="sr-only">
            {t({
              fr: "Rechercher des articles, émissions, podcasts, événements",
              de: "Artikel, Sendungen, Podcasts, Veranstaltungen suchen",
              lb: "Artikelen, Sendungen, Podcasts, Evenementer sichen",
              en: "Search articles, programmes, podcasts, events",
              es: "Buscar artículos, programas, pódcasts, eventos",
            })}
          </label>
          <input
            ref={champ}
            id="recherche-globale"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t({
              fr: "Rechercher un article, une émission, une ville…",
              de: "Artikel, Sendung, Ort suchen…",
              lb: "En Artikel, eng Sendung, eng Uertschaft sichen…",
              en: "Search for an article, a programme, a town…",
              es: "Buscar un artículo, un programa, una localidad…",
            })}
            autoComplete="off"
            aria-controls={idListe}
            className="placeholder:text-encre-3 h-16 min-w-0 flex-1 bg-transparent text-lg outline-none"
          />
          <button
            type="button"
            onClick={clore}
            aria-label={t({
              fr: "Fermer la recherche",
              de: "Suche schließen",
              lb: "Sich zoumaachen",
              en: "Close search",
              es: "Cerrar la búsqueda",
            })}
            className="hover:bg-papier-2 grid size-10 flex-none place-items-center rounded-full"
          >
            <X className="size-5" aria-hidden />
          </button>
        </form>

        <div id={idListe} aria-live="polite" className="max-h-[65dvh] overflow-y-auto">
          {aAfficher === null ? (
            <div className="px-4 py-5">
              <p className="surtitre text-encre-3">
                {t({
                  fr: "Suggestions",
                  de: "Vorschläge",
                  lb: "Virschléi",
                  en: "Suggestions",
                  es: "Sugerencias",
                })}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <li key={s}>
                    <button type="button" onClick={() => setQ(s)} className="puce-filtre">
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : aAfficher.length === 0 ? (
            <p className="text-encre-2 px-4 py-8">
              {t({
                fr: "Aucun résultat pour",
                de: "Keine Ergebnisse für",
                lb: "Keng Resultater fir",
                en: "No results for",
                es: "Ningún resultado para",
              })}{" "}
              « <span className="text-encre font-semibold">{terme}</span> ».{" "}
              {t({
                fr: "Essayez un nom de ville ou d'émission.",
                de: "Versuchen Sie einen Ortsnamen oder eine Sendung.",
                lb: "Probéiert et mat engem Uertschafts- oder Sendungsnumm.",
                en: "Try a town or programme name.",
                es: "Pruebe con un nombre de localidad o de programa.",
              })}
            </p>
          ) : (
            <ul className="py-2">
              {aAfficher.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    onClick={clore}
                    className="group hover:bg-papier-2 focus-visible:bg-papier-2 flex items-start gap-4 px-4 py-3"
                  >
                    <span className="surtitre text-encre-3 mt-1 w-20 flex-none">
                      {t(libellesTypes[r.type])}
                    </span>
                    <span className="min-w-0">
                      <span className="group-hover:text-accent-encre block font-semibold">
                        {r.titre}
                      </span>
                      <span className="text-encre-3 block text-sm">{r.contexte}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {terme.length >= 2 && (
            <Link
              href={`/recherche?q=${encodeURIComponent(terme)}`}
              onClick={clore}
              className="lien-fleche border-trait text-accent-encre flex border-t px-4 py-4"
            >
              {t({
                fr: "Tous les résultats pour",
                de: "Alle Ergebnisse für",
                lb: "All Resultater fir",
                en: "All results for",
                es: "Todos los resultados para",
              })}{" "}
              « {terme} » <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </Dialogue>
  )
}
