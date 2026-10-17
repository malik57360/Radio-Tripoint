"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/*
 * Appel vocal avec Tripo (heytripo.fr, en français).
 *
 * Ce qui faisait « bugger » la première version : la reconnaissance vocale du
 * navigateur (Web Speech API). Sur iPhone, elle ne se relance plus après que
 * Tripo a parlé. Ici, plus rien n'en dépend :
 * - le micro est ouvert UNE fois, au toucher de « Appeler », et reste ouvert
 *   jusqu'au raccrochage ;
 * - la page repère elle-même le début et la fin de la parole (niveau sonore
 *   comparé au bruit de fond) ;
 * - la phrase est transcrite sur le serveur (api/tripo_oreille.py) ;
 * - la voix de Tripo est jouée dans le même contexte audio que le micro, sans
 *   lecteur <audio> : rien à « débloquer » à chaque réponse ;
 * - pendant que Tripo parle, la page n'écoute pas (pas d'écho) ; un toucher
 *   sur « Couper » lui coupe la parole.
 * Chaque étape a un délai maximal : en cas de souci, l'appel revient à
 * l'écoute au lieu de rester bloqué.
 */

export type EtatAppel =
  "repos" | "connexion" | "ecoute" | "parole" | "comprend" | "reflechit" | "parle" | "erreur"

type Ligne = { role: "user" | "assistant"; content: string }

const TAUX_SORTIE = 16000
const SEUIL_MIN_DB = -50
const ECART_DB = 14
const DEBUT_MS = 90
const FIN_SILENCE_MS = 800
const PAROLE_MIN_MS = 250
const PAROLE_MAX_MS = 15000
const AVANT_MS = 300
const PAUSE_APRES_TRIPO_MS = 350
const DELAI_OREILLE_MS = 25000
const DELAI_CERVEAU_MS = 50000
const DELAI_VOIX_MS = 15000
const BONJOUR = "Allô ! C'est Tripo. Je t'écoute !"
const PAS_COMPRIS = "Oups, j'ai perdu le fil. Tu peux répéter ?"
const PAS_ENTENDU = "Je n'ai pas bien entendu. Tu peux répéter ?"
const BRUIT_MS = 3000
const MICRO_MUET_MS = 2500

/** Texte lisible à voix haute : sans Markdown ni adresse web. */
const pourLaVoix = (t: string) =>
  t
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_#>`]/g, "")
    .replace(/\s+/g, " ")
    .trim()

/** Coupe le texte reçu en phrases complètes ; garde le reste pour la suite. */
function phrases(tampon: string): { pretes: string[]; reste: string } {
  const pretes: string[] = []
  const motif = /[^.!?…]*[.!?…]+["»”)]*\s+/g
  let fin = 0
  let m: RegExpExecArray | null
  while ((m = motif.exec(tampon))) {
    const p = m[0].trim()
    if (p) pretes.push(p)
    fin = motif.lastIndex
  }
  return { pretes, reste: tampon.slice(fin) }
}

/** Ramène le son du micro à 16 kHz (moyenne par fenêtre : filtre anti-repliement simple). */
function versSeizeK(morceaux: Float32Array[], taux: number): Int16Array {
  const total = morceaux.reduce((n, m) => n + m.length, 0)
  const brut = new Float32Array(total)
  let k = 0
  for (const m of morceaux) {
    brut.set(m, k)
    k += m.length
  }
  const pas = taux / TAUX_SORTIE
  const n = Math.floor(total / pas)
  const sortie = new Int16Array(n)
  for (let i = 0; i < n; i++) {
    const a = Math.floor(i * pas)
    const b = Math.min(total, Math.floor((i + 1) * pas))
    let s = 0
    for (let j = a; j < b; j++) s += brut[j]
    const v = s / Math.max(1, b - a)
    sortie[i] = Math.max(-32768, Math.min(32767, Math.round(v * 32767)))
  }
  return sortie
}

const avecDelai = (ms: number, parent?: AbortSignal) => {
  const c = new AbortController()
  const minuterie = setTimeout(() => c.abort(), ms)
  const relais = () => c.abort()
  parent?.addEventListener("abort", relais)
  return {
    signal: c.signal,
    fin: () => {
      clearTimeout(minuterie)
      parent?.removeEventListener("abort", relais)
    },
  }
}

class Appel {
  etat: EtatAppel = "repos"
  private ctx: AudioContext | null = null
  private flux: MediaStream | null = null
  private noeuds: AudioNode[] = []
  private verrouEcran: { release: () => Promise<void> } | null = null
  private generation = 0
  private tour: AbortController | null = null
  // Détection de parole
  private plancher = -60
  private niveaux: number[] = []
  private avant: Float32Array[] = []
  private parole: Float32Array[] = []
  private dureeParole = 0
  private dureeSilence = 0
  private dureeVoix = 0
  private ecouteDepuis = 0
  // Lecture
  private enLecture: AudioBufferSourceNode[] = []
  // Garde : le micro envoie-t-il toujours du son ?
  private dernierMorceau = 0
  private veille: ReturnType<typeof setInterval> | null = null
  private bloque = false

  constructor(
    private rappels: {
      etat: (e: EtatAppel) => void
      niveau: (n: number) => void
      entendu: (t: string) => void
      repond: (t: string) => void
      historique: () => Ligne[]
      ajouter: (l: Ligne) => void
      erreur: (m: string) => void
      toucher: (attendu: boolean) => void
    },
  ) {}

  private apresToucher: (() => void) | null = null

  /** Second toucher, si iPhone a remis le son en pause pendant la demande d'accès au micro. */
  toucher() {
    void this.ctx?.resume().catch(() => {})
    this.apresToucher?.()
  }

  private changer(e: EtatAppel) {
    this.etat = e
    this.rappels.etat(e)
  }

  /** À appeler directement dans le toucher « Appeler » (iPhone exige ce geste). */
  async demarrer() {
    if (this.etat !== "repos" && this.etat !== "erreur") return
    const gen = ++this.generation
    this.changer("connexion")
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx || !navigator.mediaDevices?.getUserMedia) {
      this.rappels.erreur(
        "Ton navigateur ne permet pas l'appel. Ouvre heytripo.fr dans Safari ou Chrome.",
      )
      return this.changer("erreur")
    }
    // Le contexte audio naît et démarre pendant le geste, avant tout « await ».
    const ctx = new Ctx()
    this.ctx = ctx
    void ctx.resume()
    try {
      const nav = navigator as unknown as { audioSession?: { type: string } }
      if (nav.audioSession) nav.audioSession.type = "play-and-record"
    } catch {
      /* propriété en lecture seule ou absente */
    }
    // Le serveur se réveille pendant que Tripo dit bonjour.
    void fetch("/api/tripo_oreille", { cache: "no-store" }).catch(() => {})
    try {
      this.flux = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      })
    } catch (e) {
      this.liberer()
      const refus = (e as Error).name === "NotAllowedError"
      this.rappels.erreur(
        refus
          ? "Tripo n'a pas accès au micro. Autorise le micro pour ce site (Réglages › Safari › Micro sur iPhone), puis réessaie."
          : "Le micro ne répond pas. Vérifie qu'aucune autre appli ne l'utilise, puis réessaie.",
      )
      return this.changer("erreur")
    }
    if (gen !== this.generation) return this.liberer()
    await ctx.resume().catch(() => {})
    if (ctx.state !== "running") {
      // La fenêtre « Autoriser le micro » a pu suspendre le son : un toucher le relance.
      this.rappels.toucher(true)
      await new Promise<void>((ok) => (this.apresToucher = ok))
      this.apresToucher = null
      this.rappels.toucher(false)
      if (gen !== this.generation) return this.liberer()
      await ctx.resume().catch(() => {})
    }
    try {
      await this.brancherMicro(ctx, this.flux)
      this.surveiller(ctx, this.flux)
    } catch {
      this.liberer()
      this.rappels.erreur("Impossible de démarrer le micro sur ce navigateur.")
      return this.changer("erreur")
    }
    try {
      const wl = (
        navigator as unknown as {
          wakeLock?: { request: (t: string) => Promise<{ release: () => Promise<void> }> }
        }
      ).wakeLock
      this.verrouEcran = (await wl?.request("screen")) ?? null
    } catch {
      /* l'écran pourra se mettre en veille : l'appel s'arrêtera proprement */
    }
    if (gen !== this.generation) return this.liberer()
    // Bonjour, puis à toi.
    this.rappels.repond(BONJOUR)
    await this.dire([BONJOUR], gen)
    if (gen === this.generation) this.ecouter()
  }

  private async brancherMicro(ctx: AudioContext, flux: MediaStream) {
    const source = ctx.createMediaStreamSource(flux)
    // Un gain à zéro vers la sortie : le traitement tourne sans renvoyer le micro dans le haut-parleur.
    const muet = ctx.createGain()
    muet.gain.value = 0
    muet.connect(ctx.destination)
    let capteur: AudioNode
    try {
      if (!ctx.audioWorklet) throw new Error("sans worklet")
      await ctx.audioWorklet.addModule("/heytripo-capteur.js")
      const n = new AudioWorkletNode(ctx, "capteur-tripo", {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        channelCount: 1,
      })
      n.port.onmessage = (e: MessageEvent<Float32Array>) => this.morceau(e.data)
      capteur = n
    } catch {
      // Repli pour les navigateurs sans AudioWorklet.
      const sp = ctx.createScriptProcessor(2048, 1, 1)
      sp.onaudioprocess = (e) => this.morceau(new Float32Array(e.inputBuffer.getChannelData(0)))
      capteur = sp
    }
    source.connect(capteur)
    capteur.connect(muet)
    this.noeuds = [source, capteur, muet]
  }

  /** Appel entrant, Siri, autre appli qui prend le micro : l'appel ne reste jamais muet sans rien dire. */
  private surveiller(ctx: AudioContext, flux: MediaStream) {
    this.dernierMorceau = performance.now()
    this.veille = setInterval(() => {
      const muet = performance.now() - this.dernierMorceau
      if (this.ctx !== ctx || muet < MICRO_MUET_MS) return
      // Plus de son : iPhone a mis l'audio en pause. On relance ; si ça ne
      // repart pas, un toucher le fera.
      void ctx.resume().catch(() => {})
      if (muet >= MICRO_MUET_MS + 1000 && !this.bloque) {
        this.bloque = true
        this.rappels.toucher(true)
      }
    }, 500)
    const piste = flux.getAudioTracks()[0]
    if (piste)
      piste.onended = () => {
        if (this.flux !== flux) return
        this.generation++
        this.tour?.abort()
        this.liberer()
        this.rappels.erreur("Le micro s'est arrêté. Touche « Réessayer » pour rappeler Tripo.")
        this.changer("erreur")
      }
  }

  private ecouter() {
    if (!this.ctx) return
    this.parole = []
    this.avant = []
    this.dureeParole = 0
    this.dureeSilence = 0
    this.dureeVoix = 0
    this.ecouteDepuis = performance.now() + PAUSE_APRES_TRIPO_MS
    this.changer("ecoute")
  }

  /** Chaque paquet du micro (~40 ms) : niveau, début et fin de parole. */
  private morceau(m: Float32Array) {
    const ctx = this.ctx
    if (!ctx) return
    this.dernierMorceau = performance.now()
    if (this.bloque) {
      this.bloque = false
      this.rappels.toucher(false)
    }
    // Pendant que Tripo parle, le micro n'entend que lui : on ne mesure rien.
    if (this.etat === "parle" || this.etat === "connexion") return
    const ms = (m.length / ctx.sampleRate) * 1000
    let s = 0
    for (let i = 0; i < m.length; i++) s += m[i] * m[i]
    const db = 10 * Math.log10(s / m.length + 1e-12)
    // Bruit de fond : le niveau bas des 3 dernières secondes. Les blancs entre
    // les mots y comptent, donc il suit aussi un lieu bruyant (café, voiture).
    this.niveaux.push(db)
    if (this.niveaux.length > BRUIT_MS / ms) this.niveaux.shift()
    if (this.etat !== "ecoute" && this.etat !== "parole") return
    if (performance.now() < this.ecouteDepuis) return
    const tri = [...this.niveaux].sort((a, b) => a - b)
    this.plancher = Math.max(-90, Math.min(-35, tri[Math.floor(tri.length * 0.1)]))
    const seuil = Math.max(SEUIL_MIN_DB, this.plancher + ECART_DB)
    const voix = db > seuil
    this.rappels.niveau(Math.max(0, Math.min(1, (db - this.plancher) / 35)))

    if (this.etat === "ecoute") {
      this.avant.push(m)
      let garde = 0
      for (let i = this.avant.length - 1; i >= 0 && garde < AVANT_MS; i--)
        garde += (this.avant[i].length / ctx.sampleRate) * 1000
      while (this.avant.length > 1 && garde > AVANT_MS + ms) {
        garde -= (this.avant[0].length / ctx.sampleRate) * 1000
        this.avant.shift()
      }
      this.dureeVoix = voix ? this.dureeVoix + ms : 0
      if (this.dureeVoix >= DEBUT_MS) {
        this.parole = [...this.avant]
        this.dureeParole = this.dureeVoix
        this.dureeSilence = 0
        this.changer("parole")
      }
      return
    }
    // En train de parler
    this.parole.push(m)
    this.dureeParole += ms
    this.dureeSilence = voix ? 0 : this.dureeSilence + ms
    if (this.dureeSilence >= FIN_SILENCE_MS || this.dureeParole >= PAROLE_MAX_MS) {
      const utile = this.dureeParole - this.dureeSilence
      const morceaux = this.parole
      this.parole = []
      if (utile < PAROLE_MIN_MS) return this.ecouter() // un clic, une toux : on ignore
      void this.traiter(morceaux, ctx.sampleRate)
    }
  }

  /** Une phrase entendue : transcription, réponse de Tripo, voix. */
  private async traiter(morceaux: Float32Array[], taux: number) {
    const gen = this.generation
    const tour = new AbortController()
    this.tour = tour
    this.changer("comprend")
    const pcm = versSeizeK(morceaux, taux)

    // 1. Ce que la personne a dit
    let texte = ""
    let echec = false
    const d1 = avecDelai(DELAI_OREILLE_MS, tour.signal)
    try {
      const r = await fetch("/api/tripo_oreille", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: pcm.buffer as ArrayBuffer,
        signal: d1.signal,
      })
      if (r.ok) texte = String(((await r.json()) as { texte?: string }).texte ?? "").trim()
      else echec = true
    } catch {
      echec = true // délai dépassé ou réseau coupé
    } finally {
      d1.fin()
    }
    if (gen !== this.generation) return
    if (texte.length < 2) {
      // Un bruit : Tripo réécoute sans rien dire. Le serveur n'a pas répondu :
      // il le dit, pour que personne ne parle dans le vide.
      if (echec) {
        this.rappels.repond(PAS_ENTENDU)
        await this.dire([PAS_ENTENDU], gen)
        if (gen !== this.generation) return
      }
      return this.ecouter()
    }
    this.rappels.entendu(texte)
    this.rappels.repond("")
    const historique = this.rappels.historique()
    this.rappels.ajouter({ role: "user", content: texte })

    // 2. La réponse, phrase par phrase, dite dès qu'elle est prête
    this.changer("reflechit")
    let reponse = ""
    let tampon = ""
    const aDire: string[] = []
    let finTexte = false
    let reveil: (() => void) | null = null
    const signaler = () => {
      reveil?.()
      reveil = null
    }
    const lecture = (async () => {
      while (gen === this.generation) {
        if (aDire.length) {
          const lot = aDire.splice(0)
          await this.dire(lot, gen)
        } else if (finTexte) break
        else await new Promise<void>((ok) => (reveil = ok))
      }
    })()

    const d2 = avecDelai(DELAI_CERVEAU_MS, tour.signal)
    try {
      const r = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          langue: "fr",
          appel: true,
          oral: true,
          messages: [...historique, { role: "user", content: texte }].slice(-24),
        }),
        signal: d2.signal,
      })
      if (!r.ok || !r.body) throw new Error("indisponible")
      const lecteur = r.body.getReader()
      const dec = new TextDecoder()
      let brut = ""
      for (;;) {
        const { done, value } = await lecteur.read()
        if (done) break
        brut += dec.decode(value, { stream: true })
        let i: number
        while ((i = brut.indexOf("\n")) >= 0) {
          const ligne = brut.slice(0, i)
          brut = brut.slice(i + 1)
          if (!ligne) continue
          const ev = JSON.parse(ligne) as { t: string; v?: string }
          if (ev.t === "texte" && ev.v) {
            reponse += ev.v
            tampon += ev.v
            this.rappels.repond(pourLaVoix(reponse))
            const { pretes, reste } = phrases(tampon)
            tampon = reste
            for (const p of pretes) {
              const v = pourLaVoix(p)
              if (v) aDire.push(v)
            }
            if (pretes.length) signaler()
          }
        }
      }
    } catch {
      if (gen === this.generation && !reponse) {
        reponse = PAS_COMPRIS
        this.rappels.repond(PAS_COMPRIS)
        aDire.push(PAS_COMPRIS)
      }
    } finally {
      d2.fin()
    }
    const fin = pourLaVoix(tampon)
    if (fin) aDire.push(fin)
    if (!reponse.trim() && gen === this.generation) {
      reponse = PAS_COMPRIS
      this.rappels.repond(PAS_COMPRIS)
      aDire.push(PAS_COMPRIS)
    }
    finTexte = true
    signaler()
    await lecture
    // Même coupée ou raccrochée en route, la réponse déjà reçue reste dans la conversation.
    if (reponse.trim()) this.rappels.ajouter({ role: "assistant", content: reponse.trim() })
    if (gen !== this.generation) return
    this.ecouter()
  }

  /** Dit des phrases avec la voix de Tripo, dans l'ordre ; les suivantes se préparent pendant ce temps. */
  private async dire(liste: string[], gen: number) {
    const ctx = this.ctx
    if (!ctx || !liste.length) return
    const sons = liste.map((p) => this.synthese(p, ctx))
    for (const son of sons) {
      const tampon = await son
      if (gen !== this.generation) return
      if (!tampon) continue // une phrase sans voix : le texte reste affiché
      if (this.etat !== "parle") this.changer("parle")
      await new Promise<void>((ok) => {
        const s = ctx.createBufferSource()
        s.buffer = tampon
        s.connect(ctx.destination)
        this.enLecture.push(s)
        const garde = setTimeout(ok, tampon.duration * 1000 + 1500)
        s.onended = () => {
          clearTimeout(garde)
          this.enLecture = this.enLecture.filter((x) => x !== s)
          ok()
        }
        s.start()
      })
    }
  }

  private async synthese(texte: string, ctx: AudioContext): Promise<AudioBuffer | null> {
    const d = avecDelai(DELAI_VOIX_MS, this.tour?.signal)
    try {
      const r = await fetch("/api/tripo_voix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texte }),
        signal: d.signal,
      })
      if (!r.ok) return null
      return await ctx.decodeAudioData(await r.arrayBuffer())
    } catch {
      return null
    } finally {
      d.fin()
    }
  }

  /** Coupe la parole à Tripo (ou abandonne la question en cours) et réécoute. */
  couper() {
    if (this.etat !== "parle" && this.etat !== "reflechit" && this.etat !== "comprend") return
    this.generation++
    this.tour?.abort()
    this.arreterLecture()
    this.ecouter()
  }

  raccrocher() {
    this.apresToucher?.()
    this.generation++
    this.tour?.abort()
    this.liberer()
    this.changer("repos")
  }

  private arreterLecture() {
    for (const s of this.enLecture) {
      try {
        s.stop()
      } catch {
        /* déjà terminé */
      }
    }
    this.enLecture = []
  }

  private liberer() {
    if (this.veille) clearInterval(this.veille)
    this.veille = null
    this.arreterLecture()
    for (const n of this.noeuds) {
      try {
        n.disconnect()
      } catch {
        /* déjà débranché */
      }
    }
    this.noeuds = []
    this.flux?.getTracks().forEach((t) => t.stop())
    this.flux = null
    void this.verrouEcran?.release().catch(() => {})
    this.verrouEcran = null
    void this.ctx?.close().catch(() => {})
    this.ctx = null
  }
}

/** L'appel vu par React : état, niveau du micro, dernières paroles. */
export function useAppel(o: { historique: () => Ligne[]; ajouter: (l: Ligne) => void }) {
  const [etat, setEtat] = useState<EtatAppel>("repos")
  const [niveau, setNiveau] = useState(0)
  const [entendu, setEntendu] = useState("")
  const [reponse, setReponse] = useState("")
  const [erreur, setErreur] = useState<string | null>(null)
  const [aToucher, setAToucher] = useState(false)
  const options = useRef(o)
  useEffect(() => {
    options.current = o
  })
  const appel = useRef<Appel | null>(null)

  const demarrer = useCallback(() => {
    setErreur(null)
    setEntendu("")
    setReponse("")
    appel.current?.raccrocher()
    const a = new Appel({
      etat: setEtat,
      niveau: setNiveau,
      entendu: setEntendu,
      repond: setReponse,
      historique: () => options.current.historique(),
      ajouter: (l) => options.current.ajouter(l),
      erreur: setErreur,
      toucher: setAToucher,
    })
    appel.current = a
    void a.demarrer()
  }, [])

  const raccrocher = useCallback(() => {
    appel.current?.raccrocher()
    appel.current = null
    setEtat("repos")
    setNiveau(0)
    setAToucher(false)
  }, [])

  const couper = useCallback(() => appel.current?.couper(), [])
  const toucher = useCallback(() => appel.current?.toucher(), [])

  // Appli en arrière-plan, écran verrouillé : on raccroche proprement (micro rendu).
  useEffect(() => {
    const cache = () => {
      if (document.hidden && appel.current) raccrocher()
    }
    document.addEventListener("visibilitychange", cache)
    window.addEventListener("pagehide", cache)
    return () => {
      document.removeEventListener("visibilitychange", cache)
      window.removeEventListener("pagehide", cache)
      appel.current?.raccrocher()
    }
  }, [raccrocher])

  return { etat, niveau, entendu, reponse, erreur, aToucher, demarrer, raccrocher, couper, toucher }
}
