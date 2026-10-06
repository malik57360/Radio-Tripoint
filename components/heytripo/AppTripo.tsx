"use client"

import { ArrowUp, Camera, Mic, Plus, Radio, Square, Volume2, VolumeX, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { Mascotte } from "@/components/guide/Mascotte"
import { estLangue, type Langue } from "@/lib/i18n/langues"
import { cn } from "@/lib/utils/cn"
import { ECOUTE, LANGUES, TEXTES } from "./textes"

/*
 * Hey Tripo — l'appli plein écran de heytripo.fr.
 * Même cerveau que le guide du site (/api/guide, Claude + recherche web),
 * avec en plus : la voix (Web Speech API, dans le navigateur), le micro, et
 * les photos (réduites ici avant l'envoi, jamais conservées).
 */

const RADIO = "https://www.radio-tripoint-officiel.fr"
const CLE = "heytripo-v1"
const MAX = 1500

type Source = { url: string; titre: string }
type Message = {
  role: "user" | "assistant"
  content: string
  photo?: string
  sources?: Source[]
  /** Échange vocal : question dite au micro, réponse en message vocal. */
  vocal?: boolean
  /** Message vocal de Tripo (URL locale du fichier audio) et sa durée. */
  audio?: string
  duree?: number
}
type Photo = { apercu: string; data: string; type: string }

/* ─── Petits outils ───────────────────────────────────────────────────── */

/** Texte prêt à être lu : sans Markdown ni adresse web. */
const pourLaVoix = (t: string) =>
  t
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_#>`]/g, "")
    .replace(/^\s*-\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim()

/** Réduit une photo (≤ 1280 px, JPEG) pour l'envoyer vite et sans gaspiller. */
async function reduire(fichier: File): Promise<Photo> {
  const url = URL.createObjectURL(fichier)
  try {
    const img = await new Promise<HTMLImageElement>((ok, ko) => {
      const i = new Image()
      i.onload = () => ok(i)
      i.onerror = ko
      i.src = url
    })
    const k = Math.min(1, 1280 / Math.max(img.naturalWidth, img.naturalHeight))
    const c = document.createElement("canvas")
    c.width = Math.max(1, Math.round(img.naturalWidth * k))
    c.height = Math.max(1, Math.round(img.naturalHeight * k))
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height)
    const apercu = c.toDataURL("image/jpeg", 0.82)
    return { apercu, data: apercu.split(",")[1], type: "image/jpeg" }
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Markdown réduit (gras, liens, listes, paragraphes), sans HTML injecté. */
function Texte({ texte }: { texte: string }) {
  const enLigne = (s: string, cle: string) => {
    const out: ReactNode[] = []
    const motif = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g
    let d = 0
    let m: RegExpExecArray | null
    let i = 0
    while ((m = motif.exec(s))) {
      if (m.index > d) out.push(s.slice(d, m.index))
      const k = `${cle}-${i++}`
      if (m[1])
        out.push(
          <strong key={k} className="text-encre font-bold">
            {m[1]}
          </strong>,
        )
      else {
        const brut = m[3]
        const url = brut.startsWith("/") ? RADIO + brut : brut
        if (/^https:\/\//.test(url))
          out.push(
            <a
              key={k}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-jaune decoration-jaune/40 hover:decoration-jaune font-semibold underline underline-offset-4"
            >
              {m[2]}
            </a>,
          )
        else out.push(m[2])
      }
      d = m.index + m[0].length
    }
    if (d < s.length) out.push(s.slice(d))
    return out
  }
  const blocs = texte.split(/\n{2,}/)
  return (
    <div className="space-y-3 leading-relaxed">
      {blocs.map((b, i) => {
        const lignes = b.split("\n").filter(Boolean)
        if (lignes.length && lignes.every((l) => /^\s*[-•*]\s+/.test(l)))
          return (
            <ul key={i} className="space-y-1.5">
              {lignes.map((l, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="bg-jaune mt-2.5 size-1.5 flex-none rounded-full" />
                  <span>{enLigne(l.replace(/^\s*[-•*]\s+/, ""), `${i}-${j}`)}</span>
                </li>
              ))}
            </ul>
          )
        return (
          <p key={i}>
            {lignes.flatMap((l, j) =>
              j ? [<br key={`br${j}`} />, ...enLigne(l, `${i}-${j}`)] : enLigne(l, `${i}-${j}`),
            )}
          </p>
        )
      })}
    </div>
  )
}

/** Onde du message vocal : des barres stables, dérivées du texte. */
function barres(texte: string, n = 34) {
  let h = 7
  return Array.from({ length: n }, (_, i) => {
    h = (h * 31 + texte.charCodeAt(i % Math.max(1, texte.length)) + i) % 997
    return 0.25 + ((h % 100) / 100) * 0.75
  })
}

const duree = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

/** Bulle « message vocal » de Tripo, façon messagerie. */
function BulleVocale({
  m,
  enLecture,
  progres,
  total,
  pret,
  onJouer,
  libelle,
}: {
  m: Message
  enLecture: boolean
  progres: number
  total: number
  pret: boolean
  onJouer: () => void
  libelle: string
}) {
  const b = barres(m.content)
  return (
    <div className="border-jaune/30 bg-carte/80 flex items-center gap-3 rounded-3xl rounded-tl-lg border px-3 py-2.5 backdrop-blur">
      <button
        onClick={onJouer}
        disabled={!pret}
        aria-label={libelle}
        className="bg-jaune grid size-11 flex-none place-items-center rounded-full text-black transition-transform active:scale-95 disabled:opacity-60"
      >
        {!pret ? (
          <span className="points scale-75">
            <span className="!bg-black" />
            <span className="!bg-black" />
            <span className="!bg-black" />
          </span>
        ) : enLecture ? (
          <Square className="size-4" fill="currentColor" />
        ) : (
          <svg viewBox="0 0 24 24" className="ml-0.5 size-5" fill="currentColor" aria-hidden>
            <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
          </svg>
        )}
      </button>
      <div className="flex h-9 min-w-0 flex-1 items-center gap-[3px]">
        {b.map((v, i) => {
          const joue = total > 0 && i / b.length < progres
          return (
            <span
              key={i}
              className={cn(
                "w-[3px] flex-none rounded-full transition-colors",
                joue ? "bg-jaune" : "bg-encre-3/60",
                enLecture && "animate-pulse",
              )}
              style={{ height: `${Math.round(v * 100)}%` }}
            />
          )
        })}
      </div>
      <span className="text-encre-3 w-10 flex-none text-right text-xs font-bold tabular-nums">
        {total ? duree(enLecture ? total * progres : total) : "·:··"}
      </span>
    </div>
  )
}

/** Tripo en grand : halo, ondes quand il écoute ou parle. */
function GrandTripo({
  className,
  etat,
}: {
  className: string
  etat: "repos" | "parle" | "ecoute"
}) {
  return (
    <div className={cn("relative flex-none", className)}>
      <div className="halo" />
      {etat !== "repos" && (
        <div className="absolute inset-0">
          <div className="onde" />
          <div className="onde" />
          <div className="onde" />
        </div>
      )}
      <div className={cn("relative h-full w-full p-[12%]", etat === "parle" ? "parle" : "flotte")}>
        <Mascotte
          anime
          className="h-full w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
          titre="Tripo"
        />
      </div>
    </div>
  )
}

/* ─── Types minimaux de la reconnaissance vocale (absents de lib.dom) ─── */
type Reco = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult:
    | ((e: {
        results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>
      }) => void)
    | null
  onend: (() => void) | null
  onerror: ((e: { error: string }) => void) | null
}

/* ─── L'appli ─────────────────────────────────────────────────────────── */

export function AppTripo() {
  // Rendu seulement dans le navigateur (voir Chargeur) : lecture directe.
  const [depart] = useState(() => {
    try {
      const d = JSON.parse(sessionStorage.getItem(CLE) ?? "null") as {
        langue?: string
        messages?: Message[]
      } | null
      if (d) return { langue: estLangue(d.langue) ? d.langue : null, messages: d.messages ?? [] }
    } catch {
      /* stockage indisponible */
    }
    return { langue: null, messages: [] as Message[] }
  })
  const [langue, setLangue] = useState<Langue>(() => {
    if (depart.langue) return depart.langue
    const nav = (navigator.language || "fr").slice(0, 2).toLowerCase()
    return estLangue(nav) ? nav : "fr"
  })
  const t = TEXTES[langue]
  const [messages, setMessages] = useState<Message[]>(() =>
    Array.isArray(depart.messages) ? depart.messages : [],
  )
  const [saisie, setSaisie] = useState("")
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [enCours, setEnCours] = useState(false)
  const [recherche, setRecherche] = useState<string | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)
  const [son, setSon] = useState(true)
  const [parle, setParle] = useState(false)
  const [ecoute, setEcoute] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [lecture, setLecture] = useState<{ i: number; progres: number; total: number } | null>(null)
  const [texteVisible, setTexteVisible] = useState<Record<number, boolean>>({})
  const fil = useRef<HTMLDivElement>(null)
  const champ = useRef<HTMLTextAreaElement>(null)
  const fichier = useRef<HTMLInputElement>(null)
  const annul = useRef<AbortController | null>(null)
  const reco = useRef<Reco | null>(null)
  const aDire = useRef("")
  const enFile = useRef(0)
  const sonRef = useRef(son)
  sonRef.current = son

  useEffect(() => {
    document.documentElement.lang = langue
    if (enCours) return
    try {
      // Les photos ne sont pas gardées, même dans l'onglet.
      const sansPhotos = messages
        .slice(-20)
        .map(({ role, content, sources, vocal }) => ({ role, content, sources, vocal }))
      sessionStorage.setItem(CLE, JSON.stringify({ langue, messages: sansPhotos }))
    } catch {
      /* stockage indisponible */
    }
  }, [messages, langue, enCours])

  useEffect(() => {
    fil.current?.scrollTo({ top: fil.current.scrollHeight, behavior: "smooth" })
  }, [messages, recherche, enCours])

  /* ─── Voix de Tripo (synthèse dans le navigateur) ─── */
  const voix = useCallback((): SpeechSynthesisVoice | null => {
    if (typeof speechSynthesis === "undefined") return null
    const toutes = speechSynthesis.getVoices()
    for (const code of LANGUES.find((l) => l.code === langue)!.voix) {
      const v = toutes.filter((x) =>
        x.lang.replace("_", "-").toLowerCase().startsWith(code.toLowerCase()),
      )
      if (v.length) return v.find((x) => /google|premium|enhanced|natural/i.test(x.name)) ?? v[0]
    }
    return null
  }, [langue])

  /** Voix du navigateur : pour les langues où Tripo n'a pas (encore) sa voix. */
  const direNavigateur = useCallback(
    (p: string, fin: () => void) => {
      if (typeof speechSynthesis === "undefined") return fin()
      const u = new SpeechSynthesisUtterance(p)
      const v = voix()
      if (v) {
        u.voice = v
        u.lang = v.lang
      }
      u.rate = 1.05
      u.pitch = 1.35 // plus aigu : au plus près de la voix de Tripo
      u.onend = fin
      u.onerror = fin
      speechSynthesis.speak(u)
    },
    [voix],
  )

  /*
   * Voix de Tripo (celle des vidéos) en français : chaque phrase est
   * synthétisée sur le serveur dès qu'elle est prête, et jouée dans l'ordre
   * par un seul lecteur audio (débloqué au premier geste, pour iOS).
   */
  const lecteur = useRef<HTMLAudioElement | null>(null)
  const chaine = useRef<Promise<void>>(Promise.resolve())
  const generation = useRef(0)

  const debloquerAudio = useCallback(() => {
    if (!lecteur.current) lecteur.current = new Audio()
    const a = lecteur.current
    // Un court silence joué pendant le geste autorise les lectures suivantes.
    a.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
    a.play().catch(() => {})
  }, [])

  const dire = useCallback(
    (phrase: string) => {
      const p = pourLaVoix(phrase)
      if (!p || !sonRef.current) return
      const gen = generation.current
      enFile.current++
      setParle(true)
      const fin = () => {
        if (gen !== generation.current) return
        enFile.current = Math.max(0, enFile.current - 1)
        if (!enFile.current) setParle(false)
      }
      if (langue !== "fr") {
        chaine.current = chaine.current.then(
          () => new Promise<void>((ok) => direNavigateur(p, () => (fin(), ok()))),
        )
        return
      }
      // La requête part tout de suite (préchargement) ; la lecture attend son tour.
      const audio = fetch("/api/tripo_voix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texte: p }),
      })
        .then((r) => (r.ok ? r.blob() : null))
        .catch(() => null)
      chaine.current = chaine.current.then(async () => {
        if (gen !== generation.current) return
        const blob = await audio
        if (gen !== generation.current) return
        if (!blob) return new Promise<void>((ok) => direNavigateur(p, () => (fin(), ok())))
        const url = URL.createObjectURL(blob)
        const a = (lecteur.current ??= new Audio())
        await new Promise<void>((ok) => {
          const fini = () => {
            a.onended = a.onerror = null
            URL.revokeObjectURL(url)
            fin()
            ok()
          }
          a.onended = fini
          a.onerror = fini
          a.src = url
          a.play().catch(fini)
        })
      })
    },
    [langue, direNavigateur],
  )

  const taire = useCallback(() => {
    generation.current++
    chaine.current = Promise.resolve()
    aDire.current = ""
    enFile.current = 0
    setParle(false)
    setLecture(null)
    lecteur.current?.pause()
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel()
  }, [])

  useEffect(() => {
    if (typeof speechSynthesis === "undefined") return
    speechSynthesis.getVoices()
    const maj = () => speechSynthesis.getVoices()
    speechSynthesis.addEventListener?.("voiceschanged", maj)
    return () => speechSynthesis.removeEventListener?.("voiceschanged", maj)
  }, [])

  /** Lit au fil de l'eau : chaque phrase terminée part tout de suite. */
  const alimenterVoix = useCallback(
    (morceau: string, finir = false) => {
      aDire.current += morceau
      const motif = /^[\s\S]*?[.!?…:](?=\s)/
      let m: RegExpExecArray | null
      while ((m = motif.exec(aDire.current)) && m[0].trim().length > 1) {
        dire(m[0])
        aDire.current = aDire.current.slice(m[0].length)
      }
      if (finir) {
        dire(aDire.current)
        aDire.current = ""
      }
    },
    [dire],
  )

  /* ─── Messages vocaux de Tripo ─── */

  /** Fichier audio d'une réponse : voix humaine (ElevenLabs) si elle est
   * branchée, sinon la voix des vidéos (français), sinon rien. */
  const produireAudio = useCallback(
    async (texte: string): Promise<{ url: string; duree: number } | null> => {
      const corps = JSON.stringify({ texte: pourLaVoix(texte) })
      const sources = ["/api/tripo_vocal", ...(langue === "fr" ? ["/api/tripo_voix"] : [])]
      for (const src of sources) {
        const r = await fetch(src, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: corps,
        }).catch(() => null)
        if (!r?.ok) continue
        const url = URL.createObjectURL(await r.blob())
        const duree = await new Promise<number>((ok) => {
          const x = new Audio()
          x.preload = "metadata"
          x.onloadedmetadata = () => ok(Number.isFinite(x.duration) ? x.duration : 0)
          x.onerror = () => ok(0)
          x.src = url
        })
        return { url, duree }
      }
      return null
    },
    [langue],
  )

  const jouerVocal = useCallback(
    (i: number, m: Message) => {
      const dejaEnCours = lecture?.i === i
      taire()
      if (dejaEnCours) return
      const fin = () => {
        setLecture(null)
        setParle(false)
      }
      setLecture({ i, progres: 0, total: m.duree ?? 0 })
      setParle(true)
      if (!m.audio) {
        // Après un rechargement, le fichier n'existe plus : on le refait.
        produireAudio(m.content).then((audio) => {
          if (!audio) return direNavigateur(pourLaVoix(m.content), fin)
          setMessages((l) =>
            l.map((x, j) => (j === i ? { ...x, audio: audio.url, duree: audio.duree } : x)),
          )
          jouerFichier.current(audio.url, i)
        })
        return
      }
      jouerFichier.current(m.audio, i)
    },
    [lecture, taire, direNavigateur, produireAudio],
  )

  /** Lecture d'un fichier vocal dans le lecteur unique (débloqué pour iOS). */
  const jouerFichier = useRef<(url: string, i: number) => void>(() => {})
  jouerFichier.current = (url: string, i: number) => {
    const fin = () => {
      setLecture(null)
      setParle(false)
    }
    const a = (lecteur.current ??= new Audio())
    a.ontimeupdate = () =>
      setLecture((l) =>
        l && l.i === i
          ? {
              i,
              progres: a.duration ? a.currentTime / a.duration : 0,
              total: a.duration || l.total,
            }
          : l,
      )
    a.onended = fin
    a.onerror = fin
    a.src = url
    a.play().catch(fin)
  }

  /* ─── Envoi ─── */
  const envoyer = useCallback(
    async (question: string, oral = false) => {
      const jointe = photo
      const q = (question.trim() || (jointe ? t.photoDefaut : "")).slice(0, MAX)
      if (!q || enCours) return
      taire()
      if (sonRef.current) debloquerAudio()
      setErreur(null)
      setSaisie("")
      setPhoto(null)
      const historique: Message[] = [
        ...messages,
        { role: "user", content: q, photo: jointe?.apercu, vocal: oral },
      ]
      const indexReponse = historique.length
      let complet = ""
      setMessages([...historique, { role: "assistant", content: "", sources: [], vocal: oral }])
      setEnCours(true)
      const ctrl = new AbortController()
      annul.current = ctrl
      const maj = (f: (m: Message) => Message) =>
        setMessages((l) => {
          const c = [...l]
          c[c.length - 1] = f(c[c.length - 1])
          return c
        })
      try {
        const r = await fetch("/api/guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            langue,
            oral: oral || son,
            image: jointe ? { media_type: jointe.type, data: jointe.data } : undefined,
            messages: historique.map(({ role, content, photo: p }) => ({
              role,
              content: p && role === "user" ? `[photo] ${content}` : content,
            })),
          }),
          signal: ctrl.signal,
        })
        if (!r.ok || !r.body) {
          const d = await r.json().catch(() => ({}))
          throw new Error(
            d.erreur === "debit" ? "debit" : d.erreur === "image" ? "image" : "indisponible",
          )
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
              const v = ev.v
              complet += v
              maj((m) => ({ ...m, content: m.content + v }))
              if (!oral) alimenterVoix(v)
            } else if (ev.t === "recherche" && ev.v) setRecherche(ev.v)
            else if (ev.t === "source" && ev.url) {
              const s = { url: ev.url, titre: ev.titre ?? ev.url }
              maj((m) => ({ ...m, sources: [...(m.sources ?? []), s].slice(0, 5) }))
            } else if (ev.t === "erreur" && !recu) throw new Error("indisponible")
          }
        }
        if (!recu) throw new Error("indisponible")
        if (oral) {
          // Message vocal : Tripo « enregistre » toute sa réponse d'un coup,
          // pour une voix continue et naturelle, puis elle part toute seule.
          const audio = await produireAudio(complet)
          const final: Message = {
            role: "assistant",
            content: complet,
            vocal: true,
            audio: audio?.url,
            duree: audio?.duree,
          }
          maj((m) => ({ ...m, audio: final.audio, duree: final.duree }))
          if (sonRef.current) jouerVocal(indexReponse, final)
        } else alimenterVoix("", true)
      } catch (e) {
        if ((e as Error).name === "AbortError") return
        setMessages((l) => (l[l.length - 1]?.content ? l : l.slice(0, -1)))
        const k = (e as Error).message
        setErreur(k === "debit" ? t.debit : k === "image" ? t.photoTrop : t.erreur)
      } finally {
        setEnCours(false)
        setRecherche(null)
        annul.current = null
      }
    },
    [
      photo,
      t,
      enCours,
      taire,
      debloquerAudio,
      messages,
      langue,
      son,
      alimenterVoix,
      produireAudio,
      jouerVocal,
    ],
  )

  /* ─── Micro (reconnaissance vocale du navigateur) ─── */
  const ecouter = useCallback(() => {
    const W = window as unknown as {
      SpeechRecognition?: new () => Reco
      webkitSpeechRecognition?: new () => Reco
    }
    const R = W.SpeechRecognition ?? W.webkitSpeechRecognition
    if (!R) {
      setErreur(t.micIndispo)
      return
    }
    taire()
    if (sonRef.current) debloquerAudio()
    setErreur(null)
    const r = new R()
    r.lang = ECOUTE[langue]
    r.interimResults = true
    r.continuous = false
    let texte = ""
    r.onresult = (e) => {
      texte = Array.from(e.results)
        .map((x) => x[0].transcript)
        .join(" ")
      setTranscription(texte)
    }
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setErreur(t.micIndispo)
    }
    r.onend = () => {
      setEcoute(false)
      setTranscription("")
      reco.current = null
      if (texte.trim()) envoyer(texte, true)
    }
    reco.current = r
    setTranscription("")
    setEcoute(true)
    try {
      r.start()
    } catch {
      setEcoute(false)
    }
  }, [langue, t, taire, debloquerAudio, envoyer])

  const choisirPhoto = async (f: File | undefined) => {
    if (!f) return
    try {
      setPhoto(await reduire(f))
      setErreur(null)
      champ.current?.focus()
    } catch {
      setErreur(t.photoTrop)
    }
  }

  const nouvelle = () => {
    annul.current?.abort()
    taire()
    setMessages([])
    setErreur(null)
    setPhoto(null)
  }

  const vide = messages.length === 0
  const etatTripo = ecoute ? "ecoute" : parle ? "parle" : "repos"
  const dernier = messages.length - 1

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden">
      <div className="aurore" />
      <div className="grain" />

      {/* En-tête */}
      <header className="relative z-10 flex items-center gap-3 px-4 pt-[max(0.9rem,env(safe-area-inset-top))] pb-3 sm:px-6">
        <button onClick={nouvelle} className="flex items-center gap-2.5" aria-label={t.nouvelle}>
          <span className={cn("block size-10", parle && "parle")}>
            <Mascotte anime className="h-full w-full" />
          </span>
          <span className="titre-tripo text-2xl">
            hey <span className="text-jaune">tripo</span>
          </span>
        </button>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="border-trait hidden rounded-full border p-1 sm:flex">
            {LANGUES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  taire()
                  setLangue(l.code)
                }}
                title={l.nom}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-bold transition-colors",
                  langue === l.code ? "bg-jaune text-black" : "text-encre-2 hover:text-encre",
                )}
              >
                {l.court}
              </button>
            ))}
          </div>
          <select
            value={langue}
            onChange={(e) => {
              taire()
              setLangue(e.target.value as Langue)
            }}
            aria-label="Langue"
            className="border-trait bg-carte text-encre rounded-full border px-3 py-2 text-sm font-bold sm:hidden"
          >
            {LANGUES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.court}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (son) taire()
              setSon(!son)
            }}
            aria-label={son ? t.son : t.muet}
            title={son ? t.son : t.muet}
            className={cn(
              "grid size-10 place-items-center rounded-full border transition-colors",
              son ? "border-jaune/50 text-jaune" : "border-trait text-encre-3",
            )}
          >
            {son ? <Volume2 className="size-4.5" /> : <VolumeX className="size-4.5" />}
          </button>
          {!vide && (
            <button
              onClick={nouvelle}
              aria-label={t.nouvelle}
              title={t.nouvelle}
              className="border-trait text-encre-2 hover:text-encre grid size-10 place-items-center rounded-full border"
            >
              <Plus className="size-4.5" />
            </button>
          )}
          <a
            href={RADIO}
            target="_blank"
            rel="noopener"
            title={t.radio}
            className="border-trait text-encre-2 hover:text-encre hidden items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold md:flex"
          >
            <Radio className="size-4" />
            Radio Tripoint
          </a>
        </div>
      </header>

      {/* Fil */}
      <div ref={fil} className="defile relative z-10 flex-1 overflow-y-auto">
        {vide ? (
          <section className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center-safe px-5 pt-2 pb-8 text-center">
            <GrandTripo className="size-44 sm:size-60" etat={etatTripo} />
            <h1 className="titre-tripo mt-4 text-[clamp(2.6rem,9vw,5rem)]" key={langue}>
              {t.salut[0].split(" ").map((m, i) => (
                <span key={i} className="mot mr-[0.22em]" style={{ animationDelay: `${i * 70}ms` }}>
                  {m}
                </span>
              ))}
              <br />
              <span className="mot text-jaune" style={{ animationDelay: "260ms" }}>
                {t.salut[1]}
              </span>
            </h1>
            <p
              className="entre text-encre-2 mt-4 max-w-md text-base sm:text-lg"
              style={{ animationDelay: "380ms" }}
            >
              {t.intro}
            </p>
            <button
              onClick={ecouter}
              className="entre group bg-jaune relative mt-7 flex items-center gap-3 rounded-full py-3 pr-7 pl-3 text-lg font-extrabold text-black shadow-[0_12px_40px_rgba(249,184,0,0.35)] transition-transform active:scale-95"
              style={{ animationDelay: "440ms" }}
            >
              <span className="text-jaune relative grid size-11 place-items-center rounded-full bg-black">
                <span className="onde !inset-0 !border-black/40" />
                <Mic className="size-5" strokeWidth={2.4} />
              </span>
              {t.parlerA}
            </button>
            <div className="mt-6 grid w-full max-w-xl grid-cols-2 gap-2 sm:gap-2.5">
              {t.suggestions.map((s, i) => (
                <button
                  key={s}
                  onClick={() => envoyer(s)}
                  className="entre border-trait bg-carte/60 hover:border-jaune/60 hover:bg-carte rounded-2xl border px-3.5 py-3 text-left text-sm font-semibold backdrop-blur transition-colors sm:px-4 sm:py-3.5 sm:text-[0.95rem]"
                  style={{ animationDelay: `${480 + i * 80}ms` }}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="entre flex justify-end">
                  <div className="max-w-[85%]">
                    {m.photo && (
                      // eslint-disable-next-line @next/next/no-img-element -- aperçu local, déjà réduit
                      <img
                        src={m.photo}
                        alt=""
                        className="mb-2 ml-auto max-h-64 rounded-2xl border border-white/10 object-cover shadow-lg"
                      />
                    )}
                    <div className="bg-jaune flex items-start gap-2 rounded-3xl rounded-br-lg px-4 py-3 font-semibold text-black">
                      {m.vocal && <Mic className="mt-0.5 size-4 flex-none opacity-70" />}
                      <span>{m.content}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="entre flex gap-3">
                  <span
                    className={cn("mt-1 block size-9 flex-none", i === dernier && parle && "parle")}
                  >
                    <Mascotte anime={i === dernier} className="h-full w-full" />
                  </span>
                  <div className="min-w-0 flex-1">
                    {m.vocal && !(enCours && i === dernier) ? (
                      <>
                        <BulleVocale
                          m={m}
                          enLecture={lecture?.i === i}
                          progres={lecture?.i === i ? lecture.progres : 0}
                          total={lecture?.i === i && lecture.total ? lecture.total : (m.duree ?? 0)}
                          pret
                          onJouer={() => jouerVocal(i, m)}
                          libelle={t.ecouterVocal}
                        />
                        <button
                          onClick={() => setTexteVisible((v) => ({ ...v, [i]: !v[i] }))}
                          className="text-encre-3 hover:text-encre mt-1.5 ml-2 text-xs font-semibold underline-offset-2 hover:underline"
                        >
                          {texteVisible[i] ? t.cacherTexte : t.voirTexte}
                        </button>
                        {texteVisible[i] && (
                          <div className="entre border-trait bg-carte/60 text-encre-2 mt-2 rounded-2xl border px-4 py-3 text-[0.95rem]">
                            <Texte texte={m.content} />
                          </div>
                        )}
                      </>
                    ) : m.vocal ? (
                      <div className="border-jaune/30 bg-carte/80 text-jaune flex items-center gap-3 rounded-3xl rounded-tl-lg border px-4 py-3.5 text-sm font-bold backdrop-blur">
                        <span className="eq flex h-4 items-center">
                          <span />
                          <span />
                          <span />
                          <span />
                        </span>
                        {recherche ? `${t.cherche} : ${recherche}` : t.vocalEnCours}
                      </div>
                    ) : (
                      <div className="border-trait bg-carte/75 text-encre-2 rounded-3xl rounded-tl-lg border px-4 py-3 text-[1.02rem] backdrop-blur">
                        {m.content ? (
                          <Texte texte={m.content} />
                        ) : (
                          <span className="text-encre-3 flex items-center gap-2 text-sm font-semibold">
                            <span className="points">
                              <span />
                              <span />
                              <span />
                            </span>
                            {recherche ? `${t.cherche} : ${recherche}` : t.reflechit}
                          </span>
                        )}
                      </div>
                    )}
                    {i === dernier && parle && !m.vocal && (
                      <p className="text-jaune mt-2 flex items-center gap-2 text-xs font-bold">
                        <span className="eq flex h-4 items-center">
                          <span />
                          <span />
                          <span />
                          <span />
                        </span>
                        {t.parle}
                        <button
                          onClick={taire}
                          className="text-encre-3 hover:text-encre ml-1 underline"
                        >
                          {t.arreter}
                        </button>
                      </p>
                    )}
                    {!!m.sources?.length && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.sources.map((s) => (
                          <a
                            key={s.url}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-trait text-encre-3 hover:text-encre max-w-[14rem] truncate rounded-full border px-2.5 py-1 text-xs"
                          >
                            {new URL(s.url).hostname.replace(/^www\./, "")}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Saisie */}
      <div className="relative z-10 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="mx-auto max-w-3xl">
          {erreur && (
            <p
              role="alert"
              className="entre border-jaune/40 bg-carte text-encre mb-2 rounded-2xl border px-4 py-2.5 text-sm"
            >
              {erreur}
            </p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              envoyer(saisie)
            }}
            className="verre border-trait focus-within:border-jaune/50 rounded-[28px] border p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-colors"
          >
            {photo && (
              <div className="entre relative mb-2 ml-1 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local */}
                <img src={photo.apercu} alt="" className="h-20 rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  aria-label={t.retirer}
                  className="bg-encre absolute -top-2 -right-2 grid size-6 place-items-center rounded-full text-black shadow"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
            <div className="flex items-end gap-1.5">
              <input
                ref={fichier}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  choisirPhoto(e.target.files?.[0])
                  e.target.value = ""
                }}
              />
              <button
                type="button"
                onClick={() => fichier.current?.click()}
                aria-label={t.photo}
                title={t.photo}
                className="text-encre-2 hover:bg-carte-2 hover:text-encre grid size-11 flex-none place-items-center rounded-full transition-colors"
              >
                <Camera className="size-5" />
              </button>
              <textarea
                ref={champ}
                value={saisie}
                onChange={(e) => setSaisie(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    envoyer(saisie)
                  }
                }}
                rows={1}
                maxLength={MAX}
                placeholder={t.placeholder}
                aria-label={t.placeholder}
                className="text-encre placeholder:text-encre-3 max-h-40 min-h-11 flex-1 resize-none bg-transparent px-1 py-2.5 text-base outline-none"
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />
              {saisie.trim() || photo ? (
                <button
                  type="submit"
                  disabled={enCours}
                  aria-label={t.envoyer}
                  className="bg-jaune grid size-11 flex-none place-items-center rounded-full text-black transition-transform active:scale-95 disabled:opacity-50"
                >
                  <ArrowUp className="size-5" strokeWidth={2.6} />
                </button>
              ) : enCours ? (
                <button
                  type="button"
                  onClick={() => {
                    annul.current?.abort()
                    taire()
                  }}
                  aria-label={t.arreter}
                  className="bg-encre grid size-11 flex-none place-items-center rounded-full text-black"
                >
                  <Square className="size-4" fill="currentColor" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={ecouter}
                  aria-label={t.micro}
                  title={t.micro}
                  className="bg-jaune grid size-11 flex-none place-items-center rounded-full text-black transition-transform active:scale-95"
                >
                  <Mic className="size-5" strokeWidth={2.4} />
                </button>
              )}
            </div>
          </form>
          <p className="text-encre-3 mt-2 text-center text-[0.7rem]">
            {t.pied} ·{" "}
            <a href={RADIO} target="_blank" rel="noopener" className="hover:text-encre underline">
              Radio Tripoint
            </a>
          </p>
        </div>
      </div>

      {/* Écoute : Tripo tend l'oreille */}
      {ecoute && (
        <div className="verre entre fixed inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
          <GrandTripo className="size-64" etat="ecoute" />
          <p className="titre-tripo text-jaune mt-6 text-4xl">{t.ecoute}</p>
          <p className="text-encre mt-4 min-h-[3.5rem] max-w-xl text-xl font-semibold">
            {transcription}
          </p>
          <button
            onClick={() => reco.current?.stop()}
            className="bg-encre mt-8 flex items-center gap-2 rounded-full px-6 py-3 font-bold text-black"
          >
            <Square className="size-4" fill="currentColor" />
            {t.arreter}
          </button>
        </div>
      )}
    </main>
  )
}
