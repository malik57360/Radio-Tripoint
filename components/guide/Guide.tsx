"use client"

import { ArrowUp, Globe, Loader2, RotateCcw, X } from "lucide-react"
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from "react"
import { useT } from "@/components/i18n/Langue"
import Link from "@/components/ui/Lien"
import { cn } from "@/lib/utils/cn"
import { Mascotte } from "./Mascotte"
import { EVENEMENT_TRIPO } from "./ouvrir"
import { TexteGuide } from "./Texte"

type Source = { url: string; titre: string }
type Message = { role: "user" | "assistant"; content: string; sources?: Source[] }

const CLE = "guide-tripo-v1"
const MAX_LONGUEUR = 1500

/** Bulle de Tripo : sa tête à gauche, la réponse sur verre sombre (comme sur heytripo). */
function BulleTripo({ children, anime }: { children: ReactNode; anime?: boolean }) {
  return (
    <div className="tr-entre flex gap-2.5">
      <span className="mt-0.5 block size-8 flex-none">
        <Mascotte anime={anime} className="h-full w-full" />
      </span>
      <div className="border-tr-trait bg-tr-carte/75 text-tr-encre-2 tr-texte min-w-0 rounded-3xl rounded-tl-lg border px-4 py-3 text-[15px] leading-relaxed backdrop-blur">
        {children}
      </div>
    </div>
  )
}

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

  // Ouverture depuis la page /tripo (bouton « Parler à Tripo », suggestions).
  const envoyerRef = useRef(envoyer)
  useEffect(() => {
    envoyerRef.current = envoyer
  }, [envoyer])
  useEffect(() => {
    const ouvrir = (e: Event) => {
      setOuvert(true)
      const q = (e as CustomEvent<{ question?: string }>).detail?.question
      if (q) setTimeout(() => envoyerRef.current(q), 0)
    }
    window.addEventListener(EVENEMENT_TRIPO, ouvrir)
    return () => window.removeEventListener(EVENEMENT_TRIPO, ouvrir)
  }, [])

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
      en: "What to do this weekend in the Three Borders?",
      es: "¿Qué hacer este fin de semana en las Tres Fronteras?",
    }),
    t({
      fr: "Une balade avec une belle vue sur la Moselle",
      de: "Ein Spaziergang mit schönem Blick auf die Mosel",
      lb: "E Spadséiergank mat engem schéine Bléck op d'Musel",
      en: "A walk with a nice view of the Moselle",
      es: "Un paseo con buenas vistas al Mosela",
    }),
    t({
      fr: "Où déguster le vin de Moselle ?",
      de: "Wo kann man Moselwein probieren?",
      lb: "Wou kann ee Muselwäin schmaachen?",
      en: "Where to taste Moselle wine?",
      es: "¿Dónde probar el vino del Mosela?",
    }),
    t({
      fr: "Une sortie en famille avec des enfants",
      de: "Ein Ausflug mit Kindern",
      lb: "En Ausfluch mat Kanner",
      en: "A family outing with children",
      es: "Una salida en familia con niños",
    }),
    t({
      fr: "Aller de Sierck à Schengen à vélo",
      de: "Mit dem Rad von Sierck nach Schengen",
      lb: "Mam Vëlo vu Sierck op Schengen",
      en: "Cycling from Sierck to Schengen",
      es: "Ir de Sierck a Schengen en bici",
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
          "theme-tripo border-tr-jaune/60 fixed right-4 bottom-[calc(var(--bas-fixe)+1rem)] z-40 hidden h-13 items-center gap-2 rounded-full border-2 pr-5 pl-2 shadow-[0_12px_40px_rgba(133,70,194,0.45)] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 lg:inline-flex",
          ouvert && "max-sm:hidden",
        )}
      >
        {ouvert ? (
          <span className="grid size-10 place-items-center">
            <X className="size-5" aria-hidden />
          </span>
        ) : (
          <span className="relative block size-10">
            <span className="tr-halo" aria-hidden />
            <Mascotte anime className="relative h-full w-full" />
          </span>
        )}
        <span className="tr-titre text-xl">
          hey <span className="text-tr-jaune">tripo</span>
        </span>
      </button>

      {ouvert && (
        <section
          id="guide-tripo"
          role="dialog"
          aria-labelledby={idTitre}
          className="theme-tripo fondu sm:border-tr-trait fixed inset-0 isolate z-50 flex flex-col overflow-hidden sm:inset-auto sm:right-4 sm:bottom-[calc(var(--bas-fixe)+1rem)] sm:h-[min(640px,calc(100dvh-var(--bas-fixe)-8rem))] sm:w-[400px] sm:rounded-[28px] sm:border sm:shadow-[0_30px_80px_rgba(0,0,0,0.6)] lg:bottom-[calc(var(--bas-fixe)+4.5rem)]"
        >
          <div className="tr-aurore" aria-hidden />
          <div className="tr-grain" aria-hidden />

          <header className="relative z-10 flex items-center gap-3 px-4 pt-[max(0.9rem,env(safe-area-inset-top))] pb-3">
            <span className="relative block size-11 flex-none">
              <span className="tr-halo" aria-hidden />
              <Mascotte anime className="relative h-full w-full" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id={idTitre} className="tr-titre text-[1.7rem]">
                hey <span className="text-tr-jaune">tripo</span>
              </h2>
              <p className="text-tr-encre-3 mt-1 truncate text-xs font-semibold">
                {t({
                  fr: "Le guide des Trois Frontières",
                  de: "Der Guide für das Dreiländereck",
                  lb: "De Guide fir d'Dräilännereck",
                  en: "The Three Borders guide",
                  es: "El guía de las Tres Fronteras",
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
                  en: "New conversation",
                  es: "Nueva conversación",
                })}
                className="border-tr-trait text-tr-encre-2 hover:text-tr-encre grid size-10 place-items-center rounded-full border"
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
                en: "Close the guide",
                es: "Cerrar el guía",
              })}
              className="border-tr-trait text-tr-encre-2 hover:text-tr-encre grid size-10 place-items-center rounded-full border"
            >
              <X className="size-5" aria-hidden />
            </button>
          </header>

          <div
            ref={fil}
            className="relative z-10 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-3"
            aria-live="polite"
          >
            <BulleTripo anime={messages.length === 0}>
              <p>
                {t({
                  fr: "Salut ! Moi c'est Tripo. Je connais le coin par cœur, de Sierck à Schengen en passant par Perl : balades, châteaux, vins, fêtes de village, bons plans. Dites-moi ce qui vous ferait plaisir.",
                  de: "Hallo! Ich bin Tripo. Ich kenne die Gegend in- und auswendig, von Sierck über Perl bis Schengen: Wanderungen, Burgen, Wein, Dorffeste, gute Tipps. Sagen Sie mir, worauf Sie Lust haben.",
                  lb: "Moien! Ech sinn den Tripo. Ech kennen d'Géigend ausswenneg, vu Sierck iwwer Perl bis op Schengen: Tëppelsweeër, Schlässer, Wäin, Duerffester, gutt Tipps. Sot mer, op wat Dir Loscht hutt.",
                  en: "Hi! I'm Tripo. I know the area inside out, from Sierck to Schengen by way of Perl: walks, castles, wines, village festivals, tips. Tell me what you'd enjoy.",
                  es: "¡Hola! Soy Tripo. Me conozco la zona de memoria, de Sierck a Schengen pasando por Perl: paseos, castillos, vinos, fiestas de pueblo, buenos planes. Dígame qué le apetece.",
                })}
              </p>
            </BulleTripo>

            {messages.length === 0 && (
              <ul
                className="grid grid-cols-2 gap-2"
                aria-label={t({
                  fr: "Suggestions",
                  de: "Vorschläge",
                  lb: "Virschléi",
                  en: "Suggestions",
                  es: "Sugerencias",
                })}
              >
                {suggestions.map((s, i) => (
                  <li
                    key={s}
                    className={cn(i === suggestions.length - 1 && i % 2 === 0 && "col-span-2")}
                  >
                    <button
                      type="button"
                      onClick={() => envoyer(s)}
                      className="tr-entre border-tr-trait bg-tr-carte/60 hover:border-tr-jaune/60 hover:bg-tr-carte text-tr-encre h-full w-full rounded-2xl border px-3.5 py-3 text-left text-sm font-semibold backdrop-blur transition-colors"
                      style={{ animationDelay: `${80 + i * 60}ms` }}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="tr-entre flex justify-end">
                  <p className="bg-tr-jaune max-w-[85%] rounded-3xl rounded-br-lg px-4 py-2.5 text-[15px] leading-relaxed font-semibold whitespace-pre-wrap text-black">
                    {m.content}
                  </p>
                </div>
              ) : m.content || m.sources?.length ? (
                <BulleTripo key={i} anime={i === messages.length - 1 && enCours}>
                  <TexteGuide texte={m.content} />
                  {!!m.sources?.length && (
                    <div className="mt-3">
                      <p className="text-tr-encre-3 text-[0.7rem] font-bold tracking-wider uppercase">
                        {t({
                          fr: "Sources",
                          de: "Quellen",
                          lb: "Quellen",
                          en: "Sources",
                          es: "Fuentes",
                        })}
                      </p>
                      <ul className="mt-1.5 flex flex-wrap gap-1.5">
                        {m.sources.map((s) => (
                          <li key={s.url} className="min-w-0">
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border-tr-trait text-tr-encre-3 hover:text-tr-encre block max-w-[14rem] truncate rounded-full border px-2.5 py-1 text-xs no-underline"
                            >
                              {s.titre}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </BulleTripo>
              ) : null,
            )}

            {enCours && !messages[messages.length - 1]?.content && (
              <BulleTripo anime>
                <span className="text-tr-encre-3 flex items-center gap-2 text-sm font-semibold">
                  {recherche ? (
                    <>
                      <Globe className="text-tr-jaune size-4 flex-none animate-pulse" aria-hidden />
                      <span className="truncate">
                        {t({
                          fr: "Je vérifie :",
                          de: "Ich prüfe:",
                          lb: "Ech kucken no:",
                          en: "Checking:",
                          es: "Lo compruebo:",
                        })}{" "}
                        « {recherche} »
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="tr-points" aria-hidden>
                        <span />
                        <span />
                        <span />
                      </span>
                      {t({
                        fr: "Tripo réfléchit…",
                        de: "Tripo überlegt…",
                        lb: "Den Tripo iwwerleet…",
                        en: "Tripo is thinking…",
                        es: "Tripo está pensando…",
                      })}
                    </>
                  )}
                </span>
              </BulleTripo>
            )}

            {erreur && (
              <p
                role="alert"
                className="tr-entre border-tr-jaune/40 bg-tr-carte text-tr-encre rounded-2xl border px-4 py-2.5 text-sm"
              >
                {erreur === "debit"
                  ? t({
                      fr: "Beaucoup de questions d'un coup ! Réessayez dans quelques minutes.",
                      de: "Viele Fragen auf einmal! Versuchen Sie es in ein paar Minuten erneut.",
                      lb: "Vill Froen op eemol! Probéiert et an e puer Minutten nach eng Kéier.",
                      en: "Lots of questions at once! Try again in a few minutes.",
                      es: "¡Muchas preguntas a la vez! Vuelva a intentarlo dentro de unos minutos.",
                    })
                  : t({
                      fr: "Le guide ne répond pas pour le moment. Réessayez un peu plus tard.",
                      de: "Der Guide antwortet gerade nicht. Versuchen Sie es etwas später erneut.",
                      lb: "De Guide äntwert de Moment net. Probéiert et e bësse méi spéit nach eng Kéier.",
                      en: "The guide isn't responding right now. Try again a little later.",
                      es: "El guía no responde en este momento. Vuelva a intentarlo un poco más tarde.",
                    })}
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              envoyer(saisie)
            }}
            className="relative z-10 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="tr-verre border-tr-trait focus-within:border-tr-jaune/50 flex items-end gap-1.5 rounded-[28px] border p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-colors">
              <label htmlFor="guide-saisie" className="sr-only">
                {t({
                  fr: "Votre question",
                  de: "Ihre Frage",
                  lb: "Är Fro",
                  en: "Your question",
                  es: "Su pregunta",
                })}
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
                  en: "Ask your question…",
                  es: "Haga su pregunta…",
                })}
                className="text-tr-encre placeholder:text-tr-encre-3 max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-base outline-none"
              />
              <button
                type="submit"
                disabled={enCours || !saisie.trim()}
                aria-label={t({
                  fr: "Envoyer",
                  de: "Senden",
                  lb: "Schécken",
                  en: "Send",
                  es: "Enviar",
                })}
                className="bg-tr-jaune grid size-11 flex-none place-items-center rounded-full text-black transition-transform active:scale-95 disabled:opacity-50"
              >
                {enCours ? (
                  <Loader2 className="size-5 animate-spin" aria-hidden />
                ) : (
                  <ArrowUp className="size-5" strokeWidth={2.6} aria-hidden />
                )}
              </button>
            </div>
            <p className="text-tr-encre-3 mt-2 text-center text-[11px] leading-snug">
              {t({
                fr: "Réponses générées par une IA à partir de sources publiques : vérifiez horaires et tarifs avant de partir.",
                de: "Von einer KI aus öffentlichen Quellen erstellte Antworten: Prüfen Sie Zeiten und Preise vor der Abfahrt.",
                lb: "Äntwerten, déi eng KI aus ëffentleche Quelle mécht: kuckt Zäiten a Präisser no, ier Dir lassfuert.",
                en: "Answers generated by AI from public sources: check opening times and prices before you go.",
                es: "Respuestas generadas por una IA a partir de fuentes públicas: compruebe horarios y precios antes de ir.",
              })}{" "}
              <Link
                href="/politique-confidentialite#guide"
                className="hover:text-tr-encre underline underline-offset-2"
              >
                {t({
                  fr: "Confidentialité",
                  de: "Datenschutz",
                  lb: "Dateschutz",
                  en: "Privacy",
                  es: "Privacidad",
                })}
              </Link>
            </p>
          </form>
        </section>
      )}
    </>
  )
}
