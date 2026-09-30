"use client"

import { ArrowUp, Compass, Globe, Loader2, RotateCcw, X } from "lucide-react"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import { useT } from "@/components/i18n/Langue"
import Link from "@/components/ui/Lien"
import { cn } from "@/lib/utils/cn"
import { TexteGuide } from "./Texte"

type Source = { url: string; titre: string }
type Message = { role: "user" | "assistant"; content: string; sources?: Source[] }

const CLE = "guide-tripo-v1"
const MAX_LONGUEUR = 1500

/**
 * Guide des Trois Frontières : bouton flottant au-dessus du lecteur, et
 * panneau de discussion (plein écran sur téléphone). La conversation vit
 * dans l'onglet (sessionStorage) : elle survit à un changement de page,
 * pas à la fermeture du navigateur.
 */
export function Guide() {
  const t = useT()
  const [ouvert, setOuvert] = useState(false)
  // Lu à l'initialisation : le panneau est fermé au premier rendu, donc
  // aucun écart d'hydratation entre serveur (liste vide) et navigateur.
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const s = typeof window === "undefined" ? null : sessionStorage.getItem(CLE)
      return s ? (JSON.parse(s) as Message[]) : []
    } catch {
      return []
    }
  })
  const [saisie, setSaisie] = useState("")
  const [enCours, setEnCours] = useState(false)
  const [recherche, setRecherche] = useState<string | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)
  const fil = useRef<HTMLDivElement>(null)
  const champ = useRef<HTMLTextAreaElement>(null)
  const annul = useRef<AbortController | null>(null)
  const idTitre = useId()

  useEffect(() => {
    if (enCours) return
    try {
      sessionStorage.setItem(CLE, JSON.stringify(messages.slice(-20)))
    } catch {
      /* stockage indisponible */
    }
  }, [messages, enCours])

  useEffect(() => {
    fil.current?.scrollTo({ top: fil.current.scrollHeight, behavior: "smooth" })
  }, [messages, recherche])

  useEffect(() => {
    if (!ouvert) return
    requestAnimationFrame(() => champ.current?.focus())
    const echap = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false)
    window.addEventListener("keydown", echap)
    // Sur téléphone, le panneau couvre l'écran : la page derrière ne défile pas.
    const mobile = window.matchMedia("(max-width: 639px)").matches
    if (mobile) document.documentElement.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", echap)
      if (mobile) document.documentElement.style.overflow = ""
    }
  }, [ouvert])

  const envoyer = useCallback(
    async (question: string) => {
      const q = question.trim().slice(0, MAX_LONGUEUR)
      if (!q || enCours) return
      setErreur(null)
      setSaisie("")
      const historique: Message[] = [...messages, { role: "user", content: q }]
      setMessages([...historique, { role: "assistant", content: "", sources: [] }])
      setEnCours(true)
      const ctrl = new AbortController()
      annul.current = ctrl

      const maj = (f: (m: Message) => Message) =>
        setMessages((liste) => {
          const copie = [...liste]
          copie[copie.length - 1] = f(copie[copie.length - 1])
          return copie
        })

      try {
        const r = await fetch("/api/guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            langue: t.langue,
            messages: historique.map(({ role, content }) => ({ role, content })),
          }),
          signal: ctrl.signal,
        })
        if (!r.ok || !r.body) {
          const d = await r.json().catch(() => ({}))
          throw new Error(d.erreur === "debit" ? "debit" : "indisponible")
        }
        const lecteur = r.body.getReader()
        const dec = new TextDecoder()
        let tampon = ""
        let recu = false
        for (;;) {
          const { done, value } = await lecteur.read()
          if (done) break
          tampon += dec.decode(value, { stream: true })
          let i: number
          while ((i = tampon.indexOf("\n")) >= 0) {
            const ligne = tampon.slice(0, i)
            tampon = tampon.slice(i + 1)
            if (!ligne) continue
            const ev = JSON.parse(ligne) as { t: string; v?: string; url?: string; titre?: string }
            if (ev.t === "texte" && ev.v) {
              recu = true
              setRecherche(null)
              const morceau = ev.v
              maj((m) => ({ ...m, content: m.content + morceau }))
            } else if (ev.t === "recherche" && ev.v) {
              setRecherche(ev.v)
            } else if (ev.t === "source" && ev.url) {
              const s = { url: ev.url, titre: ev.titre ?? ev.url }
              maj((m) => ({ ...m, sources: [...(m.sources ?? []), s].slice(0, 6) }))
            } else if (ev.t === "erreur" && !recu) {
              throw new Error("indisponible")
            }
          }
        }
        if (!recu) throw new Error("indisponible")
      } catch (e) {
        if ((e as Error).name === "AbortError") return
        setMessages((liste) => (liste[liste.length - 1]?.content ? liste : liste.slice(0, -1)))
        setErreur((e as Error).message === "debit" ? "debit" : "indisponible")
      } finally {
        setEnCours(false)
        setRecherche(null)
        annul.current = null
      }
    },
    [enCours, messages, t.langue],
  )

  const recommencer = () => {
    annul.current?.abort()
    setMessages([])
    setErreur(null)
    champ.current?.focus()
  }

  const suggestions = [
    t({
      fr: "Que faire ce week-end dans les Trois Frontières ?",
      de: "Was kann man dieses Wochenende im Dreiländereck unternehmen?",
      lb: "Wat kann ee dëse Weekend am Dräilännereck maachen?",
    }),
    t({
      fr: "Une balade avec une belle vue sur la Moselle",
      de: "Ein Spaziergang mit schönem Blick auf die Mosel",
      lb: "E Spadséiergank mat engem schéine Bléck op d'Musel",
    }),
    t({
      fr: "Où déguster le vin de Moselle ?",
      de: "Wo kann man Moselwein probieren?",
      lb: "Wou kann ee Muselwäin schmaachen?",
    }),
    t({
      fr: "Une sortie en famille avec des enfants",
      de: "Ein Ausflug mit Kindern",
      lb: "En Ausfluch mat Kanner",
    }),
    t({
      fr: "Aller de Sierck à Schengen à vélo",
      de: "Mit dem Rad von Sierck nach Schengen",
      lb: "Mam Vëlo vu Sierck op Schengen",
    }),
  ]

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        aria-controls="guide-tripo"
        className={cn(
          "bg-accent text-sur-accent shadow-2 fixed right-4 bottom-[calc(var(--barre-lecteur)+1rem+env(safe-area-inset-bottom))] z-40 inline-flex h-12 items-center gap-2 rounded-full pr-5 pl-4 text-sm font-bold transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2",
          ouvert && "max-sm:hidden",
        )}
      >
        {ouvert ? <X className="size-5" aria-hidden /> : <Compass className="size-5" aria-hidden />}
        {t({ fr: "Guide", de: "Guide", lb: "Guide" })}
      </button>

      {ouvert && (
        <section
          id="guide-tripo"
          role="dialog"
          aria-labelledby={idTitre}
          className="bg-surface text-encre fondu sm:border-trait sm:shadow-2 fixed inset-0 z-50 flex flex-col sm:inset-auto sm:right-4 sm:bottom-[calc(var(--barre-lecteur)+4.5rem)] sm:h-[min(640px,calc(100dvh-var(--barre-lecteur)-10rem))] sm:w-[400px] sm:border"
        >
          <header className="bg-nuit text-nuit-encre flex items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
            <span className="bg-accent text-sur-accent grid size-10 flex-none place-items-center rounded-full">
              <Compass className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id={idTitre} className="text-base leading-tight font-bold">
                {t({
                  fr: "Tripo, votre guide",
                  de: "Tripo, Ihr Guide",
                  lb: "Tripo, Äre Guide",
                })}
              </h2>
              <p className="text-nuit-encre-2 truncate text-xs">
                {t({
                  fr: "Un enfant du pays des Trois Frontières",
                  de: "Ein Kind des Dreiländerecks",
                  lb: "E Kand vum Dräilännereck",
                })}
              </p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={recommencer}
                aria-label={t({
                  fr: "Nouvelle conversation",
                  de: "Neues Gespräch",
                  lb: "Neit Gespréich",
                })}
                className="hover:bg-nuit-3 grid size-10 place-items-center rounded-full"
              >
                <RotateCcw className="size-4.5" aria-hidden />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOuvert(false)}
              aria-label={t({
                fr: "Fermer le guide",
                de: "Guide schließen",
                lb: "Guide zoumaachen",
              })}
              className="hover:bg-nuit-3 grid size-10 place-items-center rounded-full"
            >
              <X className="size-5" aria-hidden />
            </button>
          </header>

          <div
            ref={fil}
            className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
            aria-live="polite"
          >
            <div className="bg-papier-2 max-w-[92%] px-4 py-3 text-[15px] leading-relaxed">
              <p>
                {t({
                  fr: "Salut ! Moi c'est Tripo. Je connais le coin par cœur, de Sierck à Schengen en passant par Perl : balades, châteaux, vins, fêtes de village, bons plans. Dites-moi ce qui vous ferait plaisir.",
                  de: "Hallo! Ich bin Tripo. Ich kenne die Gegend in- und auswendig, von Sierck über Perl bis Schengen: Wanderungen, Burgen, Wein, Dorffeste, gute Tipps. Sagen Sie mir, worauf Sie Lust haben.",
                  lb: "Moien! Ech sinn den Tripo. Ech kennen d'Géigend ausswenneg, vu Sierck iwwer Perl bis op Schengen: Tëppelsweeër, Schlässer, Wäin, Duerffester, gutt Tipps. Sot mer, op wat Dir Loscht hutt.",
                })}
              </p>
            </div>

            {messages.length === 0 && (
              <ul
                className="flex flex-wrap gap-2"
                aria-label={t({ fr: "Suggestions", de: "Vorschläge", lb: "Virschléi" })}
              >
                {suggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => envoyer(s)}
                      className="puce-filtre h-auto py-2 text-left whitespace-normal"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="bg-encre text-papier max-w-[85%] px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap">
                    {m.content}
                  </p>
                </div>
              ) : m.content || m.sources?.length ? (
                <div
                  key={i}
                  className="bg-papier-2 max-w-[92%] px-4 py-3 text-[15px] leading-relaxed"
                >
                  <TexteGuide texte={m.content} />
                  {!!m.sources?.length && (
                    <div className="border-trait mt-3 border-t pt-2">
                      <p className="surtitre text-encre-3">
                        {t({ fr: "Sources", de: "Quellen", lb: "Quellen" })}
                      </p>
                      <ul className="mt-1 space-y-1 text-xs">
                        {m.sources.map((s) => (
                          <li key={s.url} className="truncate">
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-encre-2 underline underline-offset-2"
                            >
                              {s.titre}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null,
            )}

            {enCours && !messages[messages.length - 1]?.content && (
              <p className="text-encre-3 flex items-center gap-2 text-sm">
                {recherche ? (
                  <>
                    <Globe className="size-4 animate-pulse" aria-hidden />
                    <span className="truncate">
                      {t({ fr: "Je vérifie :", de: "Ich prüfe:", lb: "Ech kucken no:" })} «{" "}
                      {recherche} »
                    </span>
                  </>
                ) : (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    {t({
                      fr: "Tripo réfléchit…",
                      de: "Tripo überlegt…",
                      lb: "Den Tripo iwwerleet…",
                    })}
                  </>
                )}
              </p>
            )}

            {erreur && (
              <p
                role="alert"
                className="border-l-4 border-[var(--alerte)] bg-[var(--erreur-fond)] px-3 py-2 text-sm"
              >
                {erreur === "debit"
                  ? t({
                      fr: "Beaucoup de questions d'un coup ! Réessayez dans quelques minutes.",
                      de: "Viele Fragen auf einmal! Versuchen Sie es in ein paar Minuten erneut.",
                      lb: "Vill Froen op eemol! Probéiert et an e puer Minutten nach eng Kéier.",
                    })
                  : t({
                      fr: "Le guide ne répond pas pour le moment. Réessayez un peu plus tard.",
                      de: "Der Guide antwortet gerade nicht. Versuchen Sie es etwas später erneut.",
                      lb: "De Guide äntwert de Moment net. Probéiert et e bësse méi spéit nach eng Kéier.",
                    })}
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              envoyer(saisie)
            }}
            className="border-trait border-t px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="border-trait focus-within:border-encre flex items-end gap-2 border bg-[var(--surface)] p-1.5">
              <label htmlFor="guide-saisie" className="sr-only">
                {t({ fr: "Votre question", de: "Ihre Frage", lb: "Är Fro" })}
              </label>
              <textarea
                ref={champ}
                id="guide-saisie"
                rows={1}
                value={saisie}
                maxLength={MAX_LONGUEUR}
                onChange={(e) => setSaisie(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    envoyer(saisie)
                  }
                }}
                placeholder={t({
                  fr: "Posez votre question…",
                  de: "Stellen Sie Ihre Frage…",
                  lb: "Stellt Är Fro…",
                })}
                className="placeholder:text-encre-3 max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-base outline-none"
              />
              <button
                type="submit"
                disabled={enCours || !saisie.trim()}
                aria-label={t({ fr: "Envoyer", de: "Senden", lb: "Schécken" })}
                className="bg-accent text-sur-accent grid size-10 flex-none place-items-center rounded-full disabled:opacity-40"
              >
                {enCours ? (
                  <Loader2 className="size-5 animate-spin" aria-hidden />
                ) : (
                  <ArrowUp className="size-5" aria-hidden />
                )}
              </button>
            </div>
            <p className="text-encre-3 mt-2 text-[11px] leading-snug">
              {t({
                fr: "Réponses générées par une IA à partir de sources publiques : vérifiez horaires et tarifs avant de partir.",
                de: "Von einer KI aus öffentlichen Quellen erstellte Antworten: Prüfen Sie Zeiten und Preise vor der Abfahrt.",
                lb: "Äntwerten, déi eng KI aus ëffentleche Quelle mécht: kuckt Zäiten a Präisser no, ier Dir lassfuert.",
              })}{" "}
              <Link
                href="/politique-confidentialite#guide"
                className="underline underline-offset-2"
              >
                {t({ fr: "Confidentialité", de: "Datenschutz", lb: "Dateschutz" })}
              </Link>
            </p>
          </form>
        </section>
      )}
    </>
  )
}
