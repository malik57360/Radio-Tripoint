"use client"

import { upload } from "@vercel/blob/client"
import { FileAudio, Loader2, Pencil, Save, Send, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState, useTransition } from "react"
import {
  actionModifierPodcast,
  actionOublierSon,
  actionPublierPodcast,
  actionRetirerPodcast,
  type DonneesPodcast,
} from "@/app/direction/(espace)/podcasts/actions"
import { EXTENSIONS_AUDIO, extensionAudio, MAX_OCTETS_AUDIO } from "@/lib/direction/podcasts"
import { cn } from "@/lib/utils/cn"

const champ =
  "border-trait bg-carte-2 text-encre focus:border-accent block w-full rounded-lg border px-3 py-2.5 text-[0.95rem] outline-none"
const etiquette = "text-encre-2 text-xs font-bold"

/** Au-delà, le son part en plusieurs morceaux, relancés un par un en cas de coupure. */
const MORCEAUX_DES = 20 * 1024 * 1024

export interface BrouillonPodcast {
  slug: string
  titre: string
  description: string
  emission: string
  theme: DonneesPodcast["theme"]
  diffuseLe: string
  audioUrl: string
  duree: number
}

const taille = (o: number) =>
  o >= 1024 * 1024
    ? `${(o / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`
    : `${Math.ceil(o / 1024)} ko`
const minutes = (s: number) =>
  `${Math.floor(s / 60)} min ${String(Math.round(s % 60)).padStart(2, "0")} s`

/** Durée du son, lue dans le navigateur (aucun envoi). */
function mesurer(url: string): Promise<number> {
  return new Promise((ok, ko) => {
    const a = new Audio()
    a.preload = "metadata"
    a.onloadedmetadata = () =>
      Number.isFinite(a.duration) && a.duration > 0
        ? ok(Math.round(a.duration))
        : ko(new Error("Durée illisible."))
    a.onerror = () => ko(new Error("Ce fichier audio est illisible par le navigateur."))
    a.src = url
  })
}

const nouveauDossier = () =>
  Array.from(
    crypto.getRandomValues(new Uint8Array(12)),
    (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36],
  ).join("")

/** Nom du fichier en ligne, tiré du titre (« norbert-noel-maire-de-bouzonville »). */
const nomFichier = (titre: string) =>
  titre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "") || "podcast"

type Son = { fichier: File; apercu: string; duree: number | null; envoye?: string }

/**
 * Formulaire de podcast du tableau de bord. Le son part directement du
 * navigateur vers le stockage (barre de progression), puis la fiche est
 * enregistrée : le podcast est en ligne aussitôt, sans déploiement.
 * Avec un brouillon (bouton « Modifier ») : même lien, son gardé sauf si on
 * en choisit un autre.
 */
export function PublicationPodcast({
  emissions,
  themes,
  maintenant,
  brouillon,
}: {
  emissions: { slug: string; nom: string }[]
  themes: { valeur: DonneesPodcast["theme"]; libelle: string }[]
  /** Date et heure à Paris (datetime-local), proposées par défaut. */
  maintenant: string
  brouillon?: BrouillonPodcast
}) {
  const modification = Boolean(brouillon)
  const [titre, setTitre] = useState(brouillon?.titre ?? "")
  const [description, setDescription] = useState(brouillon?.description ?? "")
  const [emission, setEmission] = useState(brouillon?.emission ?? "")
  const [theme, setTheme] = useState<DonneesPodcast["theme"]>(brouillon?.theme ?? "emissions")
  const [diffuseLe, setDiffuseLe] = useState(brouillon?.diffuseLe ?? maintenant)
  const [son, setSon] = useState<Son | null>(null)
  const [etape, setEtape] = useState("")
  const [retour, setRetour] = useState<{ ok: boolean; texte: string; lien?: string } | null>(null)
  const [enCours, demarrer] = useTransition()
  const choix = useRef<HTMLInputElement>(null)
  const dossier = useRef(nouveauDossier())

  // L'aperçu local est libéré quand on change de son ou qu'on quitte la page.
  const apercu = son?.apercu
  useEffect(
    () => () => {
      if (apercu) URL.revokeObjectURL(apercu)
    },
    [apercu],
  )

  const choisir = (f: File | undefined) => {
    if (choix.current) choix.current.value = ""
    if (!f) return
    setRetour(null)
    if (!extensionAudio(f.name))
      return setRetour({
        ok: false,
        texte: "Format non accepté : choisissez un fichier MP3 ou M4A.",
      })
    if (f.size > MAX_OCTETS_AUDIO)
      return setRetour({
        ok: false,
        texte: "Fichier trop lourd (300 Mo au plus). Exportez-le en MP3.",
      })
    // Un son déjà envoyé mais pas publié ne reste pas dans le stockage.
    if (son?.envoye) void actionOublierSon(son.envoye)
    const apercu = URL.createObjectURL(f)
    setSon({ fichier: f, apercu, duree: null })
    mesurer(apercu)
      .then((duree) => setSon((s) => (s?.apercu === apercu ? { ...s, duree } : s)))
      .catch((e: Error) => {
        setSon(null)
        setRetour({ ok: false, texte: e.message })
      })
  }

  /** Envoie le son (une seule fois, même si la publication est relancée). */
  async function envoyer(s: Son): Promise<string> {
    if (s.envoye) return s.envoye
    const ext = extensionAudio(s.fichier.name)!
    try {
      const b = await upload(
        `podcasts/tableau/${dossier.current}/${nomFichier(titre)}.${ext}`,
        s.fichier,
        {
          access: "public",
          handleUploadUrl: "/api/direction/podcasts/audio",
          contentType: EXTENSIONS_AUDIO[ext],
          multipart: s.fichier.size > MORCEAUX_DES,
          onUploadProgress: ({ percentage }) =>
            setEtape(`Envoi du son : ${Math.min(99, Math.round(percentage))} %`),
        },
      )
      setSon((x) => (x?.apercu === s.apercu ? { ...x, envoye: b.url } : x))
      return b.url
    } catch (e) {
      const m = (e as Error).message ?? ""
      throw new Error(
        /client token/i.test(m)
          ? "Envoi du son refusé : reconnectez-vous au tableau de bord, puis réessayez."
          : "Envoi du son impossible : vérifiez la connexion et réessayez.",
      )
    }
  }

  const publier = () => {
    setRetour(null)
    if (!modification && !son) return setRetour({ ok: false, texte: "Ajoutez le fichier audio." })
    if (son && son.duree === null)
      return setRetour({ ok: false, texte: "Lecture du son en cours : réessayez dans un instant." })
    if (
      !window.confirm(
        modification
          ? "Enregistrer les modifications ? Le podcast en ligne sera mis à jour tout de suite."
          : "Publier ce podcast sur le site maintenant ?",
      )
    )
      return
    demarrer(async () => {
      try {
        const audio = son ? { url: await envoyer(son), duree: son.duree! } : undefined
        setEtape(modification ? "Enregistrement…" : "Mise en ligne…")
        const donnees: DonneesPodcast = {
          titre,
          description,
          emission: emission || undefined,
          theme,
          diffuseLe,
          audio,
        }
        const r = brouillon
          ? await actionModifierPodcast(brouillon.slug, donnees)
          : await actionPublierPodcast(donnees)
        if (!r.ok) return setRetour({ ok: false, texte: r.erreur })
        setRetour({ ok: true, texte: r.message, lien: r.lien })
        setSon(null)
        dossier.current = nouveauDossier()
        if (modification) return
        setTitre("")
        setDescription("")
        setDiffuseLe(maintenant)
      } catch (e) {
        setRetour({ ok: false, texte: (e as Error).message || "Erreur inattendue." })
      } finally {
        setEtape("")
      }
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        publier()
      }}
      className="space-y-4"
    >
      <div className="border-trait bg-carte-2 rounded-xl border border-dashed p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={etiquette}>Le son (MP3 ou M4A, 300 Mo au plus)</span>
          <button
            type="button"
            onClick={() => choix.current?.click()}
            disabled={enCours}
            className="border-trait hover:border-accent inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-bold disabled:opacity-50"
          >
            <FileAudio className="size-4" aria-hidden />
            {son || modification ? "Changer le son" : "Choisir le fichier audio"}
          </button>
          <input
            ref={choix}
            type="file"
            accept=".mp3,.m4a,.aac,audio/mpeg,audio/mp4,audio/aac,audio/x-m4a"
            hidden
            onChange={(e) => choisir(e.target.files?.[0])}
          />
        </div>
        {son ? (
          <div className="mt-3 space-y-2">
            <p className="text-sm">
              <b className="break-all">{son.fichier.name}</b>
              <span className="text-encre-3">
                {" "}
                · {taille(son.fichier.size)}
                {son.duree !== null ? ` · ${minutes(son.duree)}` : " · lecture…"}
              </span>
            </p>
            <audio src={son.apercu} controls preload="metadata" className="w-full" />
          </div>
        ) : brouillon ? (
          <div className="mt-3 space-y-2">
            <p className="text-encre-3 text-sm">Son en ligne · {minutes(brouillon.duree)}</p>
            <audio src={brouillon.audioUrl} controls preload="none" className="w-full" />
          </div>
        ) : (
          <p className="text-encre-3 mt-2 text-sm">
            Le replay tel qu&apos;il est passé à l&apos;antenne. Écoutez-le ici avant de publier.
          </p>
        )}
      </div>

      <label className="block">
        <span className={etiquette}>Titre</span>
        <input
          required
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          maxLength={160}
          className={cn(champ, "mt-1.5 text-lg font-bold")}
          placeholder="Ex. : « Norbert Noël, maire de Bouzonville (1949-1971) »"
        />
      </label>

      <label className="block">
        <span className={etiquette}>Description (ce qu&apos;on va entendre)</span>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={4}
          className={cn(champ, "mt-1.5")}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={etiquette}>Émission</span>
          <select
            value={emission}
            onChange={(e) => setEmission(e.target.value)}
            className={cn(champ, "mt-1.5")}
          >
            <option value="">Aucune (podcast seul)</option>
            {emissions.map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.nom}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={etiquette}>Thème</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as DonneesPodcast["theme"])}
            className={cn(champ, "mt-1.5")}
          >
            {themes.map((t) => (
              <option key={t.valeur} value={t.valeur}>
                {t.libelle}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={etiquette}>Diffusé à l&apos;antenne le</span>
          <input
            type="datetime-local"
            required
            value={diffuseLe}
            onChange={(e) => setDiffuseLe(e.target.value)}
            className={cn(champ, "mt-1.5")}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={enCours}
          className="border-accent bg-accent inline-flex min-h-11 items-center gap-2 rounded-full border px-5 font-bold text-black disabled:opacity-50"
        >
          {enCours ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : modification ? (
            <Save className="size-4" aria-hidden />
          ) : (
            <Send className="size-4" aria-hidden />
          )}
          {modification ? "Enregistrer les modifications" : "Publier sur le site"}
        </button>
        {modification && (
          <Link href="/direction/podcasts" className="text-encre-2 text-sm font-semibold underline">
            Annuler
          </Link>
        )}
        {etape && (
          <span role="status" className="text-encre-2 text-sm">
            {etape}
          </span>
        )}
      </div>

      {retour && (
        <p
          role="status"
          className={cn(
            "rounded-lg border px-3 py-2.5 text-sm font-semibold",
            retour.ok ? "border-accent text-encre" : "border-trait text-encre",
          )}
        >
          {retour.ok ? "✅ " : "⚠️ "}
          {retour.texte}{" "}
          {retour.lien && (
            <a href={retour.lien} target="_blank" rel="noopener" className="text-accent underline">
              Écouter sur le site
            </a>
          )}
        </p>
      )}
    </form>
  )
}

/** Bouton « Modifier » : rouvre le formulaire pré-rempli avec ce podcast. */
export function ModifierPodcast({ slug, actif }: { slug: string; actif?: boolean }) {
  return (
    <Link
      href={`/direction/podcasts?modifier=${encodeURIComponent(slug)}`}
      aria-current={actif ? "true" : undefined}
      className={cn(
        "inline-flex min-h-8 flex-none items-center gap-1 rounded-full border px-2.5 text-xs font-bold",
        actif ? "border-accent bg-accent text-black" : "border-trait text-encre-2",
      )}
    >
      <Pencil className="size-3.5" aria-hidden />
      Modifier
    </Link>
  )
}

/** Bouton « Retirer » d'un podcast publié depuis le tableau de bord. */
export function RetirerPodcast({ slug }: { slug: string }) {
  const [enCours, demarrer] = useTransition()
  return (
    <button
      type="button"
      disabled={enCours}
      onClick={() => {
        if (!window.confirm("Retirer ce podcast du site ? Son fichier audio sera supprimé.")) return
        demarrer(async () => {
          const r = await actionRetirerPodcast(slug)
          window.alert(r.ok ? r.message : r.erreur)
        })
      }}
      className="border-trait text-encre-2 inline-flex min-h-8 flex-none items-center gap-1 rounded-full border px-2.5 text-xs font-bold disabled:opacity-50"
    >
      {enCours ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
      Retirer
    </button>
  )
}
