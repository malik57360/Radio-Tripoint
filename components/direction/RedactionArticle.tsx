"use client"

import { ArrowDown, ArrowUp, ImagePlus, Loader2, Send, Trash2, X } from "lucide-react"
import { useRef, useState, useTransition } from "react"
import {
  actionPublierArticle,
  actionRetirerArticle,
  type DonneesArticle,
} from "@/app/direction/(espace)/articles/actions"
import { cn } from "@/lib/utils/cn"

const champ =
  "border-trait bg-carte-2 text-encre focus:border-accent block w-full rounded-lg border px-3 py-2.5 text-[0.95rem] outline-none"
const etiquette = "text-encre-2 text-xs font-bold"

/** Côté le plus long d'une photo de presse une fois réduite. */
const MAX_COTE = 1800

type Photo = {
  cle: string
  apercu: string
  fichier: File
  legende: string
  credit: string
}

/** Réduit la photo et la convertit en WebP dans le navigateur (≈ 200 à 500 ko). */
async function versWebp(f: File): Promise<{ blob: Blob; largeur: number; hauteur: number }> {
  const img = await createImageBitmap(f)
  const k = Math.min(1, MAX_COTE / Math.max(img.width, img.height))
  const largeur = Math.round(img.width * k)
  const hauteur = Math.round(img.height * k)
  const c = document.createElement("canvas")
  c.width = largeur
  c.height = hauteur
  c.getContext("2d")!.drawImage(img, 0, 0, largeur, hauteur)
  img.close()
  const blob = await new Promise<Blob | null>((ok) => c.toBlob(ok, "image/webp", 0.84))
  if (!blob || blob.type !== "image/webp") throw new Error("Ce navigateur ne sait pas convertir la photo.")
  return { blob, largeur, hauteur }
}

const nouveauDossier = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join("")

export function RedactionArticle({ rubriques }: { rubriques: { slug: string; nom: string }[] }) {
  const [titre, setTitre] = useState("")
  const [chapeau, setChapeau] = useState("")
  const [categorie, setCategorie] = useState(rubriques[0]?.slug ?? "actualites")
  const [auteur, setAuteur] = useState("")
  const [lieux, setLieux] = useState("")
  const [texte, setTexte] = useState("")
  const [une, setUne] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [etape, setEtape] = useState("")
  const [retour, setRetour] = useState<{ ok: boolean; texte: string; lien?: string } | null>(null)
  const [enCours, demarrer] = useTransition()
  const choix = useRef<HTMLInputElement>(null)

  const ajouter = (liste: FileList | null) => {
    if (!liste) return
    const nouvelles = Array.from(liste)
      .filter((f) => f.type.startsWith("image/"))
      .map((fichier) => ({
        cle: `${fichier.name}-${fichier.size}-${Math.random()}`,
        apercu: URL.createObjectURL(fichier),
        fichier,
        legende: "",
        credit: "",
      }))
    setPhotos((p) => [...p, ...nouvelles].slice(0, 12))
    if (choix.current) choix.current.value = ""
  }
  const modifier = (i: number, x: Partial<Photo>) =>
    setPhotos((p) => p.map((ph, j) => (j === i ? { ...ph, ...x } : ph)))
  const deplacer = (i: number, sens: -1 | 1) =>
    setPhotos((p) => {
      const c = [...p]
      const j = i + sens
      if (j < 0 || j >= c.length) return p
      ;[c[i], c[j]] = [c[j], c[i]]
      return c
    })
  const enlever = (i: number) =>
    setPhotos((p) => {
      URL.revokeObjectURL(p[i].apercu)
      return p.filter((_, j) => j !== i)
    })

  const publier = () => {
    setRetour(null)
    if (!photos.length) return setRetour({ ok: false, texte: "Ajoutez au moins une photo." })
    if (!window.confirm("Publier cet article sur le site maintenant ?")) return
    demarrer(async () => {
      try {
        const dossier = nouveauDossier()
        const envoyees: DonneesArticle["photos"] = []
        for (const [i, p] of photos.entries()) {
          setEtape(`Photo ${i + 1} sur ${photos.length}…`)
          const { blob, largeur, hauteur } = await versWebp(p.fichier)
          const r = await fetch(`/api/direction/articles/photo?dossier=${dossier}`, {
            method: "POST",
            headers: { "Content-Type": "image/webp" },
            body: blob,
          })
          const d = (await r.json().catch(() => ({}))) as { url?: string; erreur?: string }
          if (!r.ok || !d.url) throw new Error(d.erreur ?? "Envoi de la photo impossible.")
          envoyees.push({
            url: d.url,
            largeur,
            hauteur,
            legende: p.legende.trim() || undefined,
            credit: p.credit.trim() || undefined,
          })
        }
        setEtape("Mise en ligne…")
        const r = await actionPublierArticle({
          titre,
          chapeau,
          categorie: categorie as DonneesArticle["categorie"],
          auteur: auteur.trim() || undefined,
          lieux: lieux.trim() || undefined,
          texte,
          photos: envoyees,
          une,
        })
        if (!r.ok) return setRetour({ ok: false, texte: r.erreur })
        setRetour({ ok: true, texte: r.message, lien: r.lien })
        photos.forEach((p) => URL.revokeObjectURL(p.apercu))
        setTitre("")
        setChapeau("")
        setAuteur("")
        setLieux("")
        setTexte("")
        setUne(false)
        setPhotos([])
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
      <label className="block">
        <span className={etiquette}>Titre</span>
        <input
          required
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          maxLength={160}
          className={cn(champ, "mt-1.5 text-lg font-bold")}
          placeholder="Ex. : Le Schengen Museum ouvre sa saison de courts-métrages"
        />
      </label>

      <label className="block">
        <span className={etiquette}>Chapeau (1 à 2 phrases, affiché sous le titre)</span>
        <textarea
          required
          value={chapeau}
          onChange={(e) => setChapeau(e.target.value)}
          maxLength={400}
          rows={2}
          className={cn(champ, "mt-1.5")}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={etiquette}>Rubrique</span>
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className={cn(champ, "mt-1.5")}
          >
            {rubriques.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.nom}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={etiquette}>Auteur (facultatif)</span>
          <input
            value={auteur}
            onChange={(e) => setAuteur(e.target.value)}
            maxLength={80}
            className={cn(champ, "mt-1.5")}
          />
        </label>
        <label className="block">
          <span className={etiquette}>Lieux (séparés par des virgules)</span>
          <input
            value={lieux}
            onChange={(e) => setLieux(e.target.value)}
            maxLength={200}
            className={cn(champ, "mt-1.5")}
            placeholder="Schengen, Sierck-les-Bains"
          />
        </label>
      </div>

      <label className="block">
        <span className={etiquette}>Texte de l&apos;article</span>
        <textarea
          required
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          rows={16}
          className={cn(champ, "mt-1.5 leading-relaxed")}
        />
        <span className="text-encre-3 mt-1.5 block text-xs leading-relaxed">
          Une ligne vide entre deux paragraphes. <b>## Titre</b> = intertitre · <b>&gt; texte</b>{" "}
          = citation (<b>— Nom</b> sur la ligne suivante) · <b>- élément</b> = liste ·{" "}
          <b>[photo 2]</b> = place de la 2e photo. Sinon les photos se répartissent toutes seules.
        </span>
      </label>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={etiquette}>
            Photos de presse · la 1re est la photo principale ({photos.length}/12)
          </span>
          <button
            type="button"
            onClick={() => choix.current?.click()}
            className="border-trait hover:border-accent inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-bold"
          >
            <ImagePlus className="size-4" aria-hidden />
            Ajouter des photos
          </button>
          <input
            ref={choix}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => ajouter(e.target.files)}
          />
        </div>
        {photos.length > 0 && (
          <ul className="mt-3 space-y-3">
            {photos.map((p, i) => (
              <li
                key={p.cle}
                className={cn(
                  "border-trait bg-carte-2 flex gap-3 rounded-lg border p-2.5",
                  i === 0 && "border-accent",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local (blob:) */}
                <img
                  src={p.apercu}
                  alt=""
                  className="size-24 flex-none rounded-md object-cover sm:size-28"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-xs font-bold">
                    {i === 0 ? "Photo principale" : `Photo ${i + 1}`}
                    <span className="text-encre-3 font-normal"> · {p.fichier.name}</span>
                  </p>
                  <input
                    value={p.legende}
                    onChange={(e) => modifier(i, { legende: e.target.value })}
                    maxLength={300}
                    placeholder="Légende (ce qu'on voit)"
                    className={cn(champ, "py-1.5 text-sm")}
                  />
                  <input
                    value={p.credit}
                    onChange={(e) => modifier(i, { credit: e.target.value })}
                    maxLength={120}
                    placeholder="Crédit photo (ex. : © Schengen Museum)"
                    className={cn(champ, "py-1.5 text-sm")}
                  />
                </div>
                <div className="flex flex-none flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => deplacer(i, -1)}
                    disabled={i === 0}
                    aria-label="Monter"
                    className="text-encre-2 rounded p-1 disabled:opacity-30"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deplacer(i, 1)}
                    disabled={i === photos.length - 1}
                    aria-label="Descendre"
                    className="text-encre-2 rounded p-1 disabled:opacity-30"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => enlever(i)}
                    aria-label="Retirer la photo"
                    className="text-encre-2 rounded p-1"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={une} onChange={(e) => setUne(e.target.checked)} />
        Mettre à la une de la page d&apos;accueil
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={enCours}
          className="border-accent bg-accent inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-bold text-black disabled:opacity-50"
        >
          {enCours ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4" aria-hidden />
          )}
          Publier sur le site
        </button>
        {etape && <span className="text-encre-2 text-sm">{etape}</span>}
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
              Voir l&apos;article
            </a>
          )}
        </p>
      )}
    </form>
  )
}

/** Bouton « Retirer » d'un article publié depuis le tableau de bord. */
export function RetirerArticle({ slug }: { slug: string }) {
  const [enCours, demarrer] = useTransition()
  return (
    <button
      type="button"
      disabled={enCours}
      onClick={() => {
        if (!window.confirm("Retirer cet article du site ? Ses photos seront supprimées.")) return
        demarrer(async () => {
          const r = await actionRetirerArticle(slug)
          window.alert(r.ok ? r.message : r.erreur)
        })
      }}
      className="border-trait text-encre-2 inline-flex flex-none items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold disabled:opacity-50"
    >
      {enCours ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
      Retirer
    </button>
  )
}

