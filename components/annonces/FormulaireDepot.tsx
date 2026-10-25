"use client"

import Link from "@/components/ui/Lien"
import { ArrowLeft, Check, ImagePlus, Loader2, Star, Trash2 } from "lucide-react"
import { useMemo, useRef, useState, useTransition } from "react"
import { actionDeposer, actionModifier } from "@/app/petites-annonces/actions"
import {
  CATEGORIES_DEPART,
  PAYS,
  defCategorie,
  type Champ,
  type Pays,
} from "@/lib/annonces/categories"
import {
  euros,
  lignesDepot,
  offreOuverte,
  optionUtile,
  photosPermises,
  total,
  type Annonceur,
  type CodeOffre,
  type Offre,
} from "@/lib/annonces/offres"
import { TYPES_ACCEPTES, preparerEtEnvoyer } from "@/lib/annonces/photos-client"
import type { MentionPrix, Photo } from "@/lib/annonces/types"
import { cn } from "@/lib/utils/cn"
import { Drapeau, IconeCategorie, teinte } from "./Vitrine"

/**
 * Dépôt guidé d'une annonce (et sa modification) : catégorie, texte et
 * champs propres à la catégorie, photos, lieu, formule et options, puis
 * paiement si besoin. Le prix affiché ici n'est qu'un aperçu : le serveur
 * le recalcule avec le tarif en vigueur.
 */

type Existante = {
  id: string
  statut: string
  photosMax: number
  contenu: {
    categorie: string
    titre: string
    description: string
    prix: number | null
    mention?: MentionPrix
    pays: Pays
    ville: string
    codePostal: string
    details: Record<string, string>
    photos: Photo[]
  }
}

type PhotoForm = { cle: string; apercu?: string; photo?: Photo; erreur?: string }

const CP_EXEMPLE: Record<Pays, string> = { FR: "57480", LU: "5570", DE: "66706" }

function Etape({
  n,
  titre,
  children,
  aide,
  fait = false,
}: {
  n: number
  titre: string
  children: React.ReactNode
  aide?: string
  /** Étape complète : son numéro devient une coche (elle « tamponne » en passant). */
  fait?: boolean
}) {
  return (
    <fieldset className="border-trait bg-surface rounded-2xl border p-4 shadow-sm sm:p-6">
      <legend className="sr-only">{titre}</legend>
      <div className="mb-4 flex items-center gap-3">
        <span
          key={fait ? "fait" : "a-faire"}
          className={cn(
            "grid size-8 flex-none place-items-center rounded-full text-sm font-extrabold",
            fait ? "etape-faite bg-[var(--moselle)] text-white" : "bg-accent text-sur-accent",
          )}
        >
          {fait ? <Check className="size-4.5" strokeWidth={3} aria-label="Étape complète" /> : n}
        </span>
        <div>
          <p className="titre-carte text-[1.2rem] leading-tight">{titre}</p>
          {aide && <p className="text-encre-3 text-[0.82rem]">{aide}</p>}
        </div>
      </div>
      {children}
    </fieldset>
  )
}

function ChampCategorie({
  c,
  valeur,
  changer,
}: {
  c: Champ
  valeur: string
  changer: (v: string) => void
}) {
  const id = `d-${c.cle}`
  const libelle = (
    <label htmlFor={id} className="etiquette">
      {c.libelle}
      {!c.requis && <span className="text-encre-3 ml-1.5 font-normal">(facultatif)</span>}
      {c.type === "nombre" && c.unite && (
        <span className="text-encre-3 ml-1 font-normal">en {c.unite}</span>
      )}
    </label>
  )
  if (c.type === "choix")
    return (
      <div>
        {libelle}
        <select
          id={id}
          className="champ"
          value={valeur}
          onChange={(e) => changer(e.target.value)}
          required={c.requis}
        >
          <option value="">Choisir…</option>
          {c.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
    )
  return (
    <div>
      {libelle}
      <input
        id={id}
        className="champ"
        value={valeur}
        onChange={(e) => changer(e.target.value)}
        required={c.requis}
        inputMode={c.type === "nombre" ? "numeric" : undefined}
        maxLength={c.type === "texte" ? (c.max ?? 100) : 9}
        aria-describedby={c.type === "texte" && c.aide ? `${id}-aide` : undefined}
      />
      {c.type === "texte" && c.aide && (
        <p id={`${id}-aide`} className="text-encre-3 mt-1 text-xs">
          {c.aide}
        </p>
      )}
    </div>
  )
}

export function FormulaireDepot({
  categories,
  offres,
  annonceur,
  paiementOuvert,
  existante,
}: {
  categories: { slug: string; nom: string; accroche: string }[]
  offres: Offre[]
  annonceur: Annonceur
  paiementOuvert: boolean
  existante?: Existante
}) {
  const e = existante?.contenu
  const [categorie, setCategorie] = useState(e?.categorie ?? "")
  const [titre, setTitre] = useState(e?.titre ?? "")
  const [description, setDescription] = useState(e?.description ?? "")
  const [prix, setPrix] = useState(
    e?.prix != null ? (e.prix / 100).toLocaleString("fr-FR", { useGrouping: false }) : "",
  )
  const [mention, setMention] = useState<MentionPrix | "">(e?.mention ?? "")
  const [details, setDetails] = useState<Record<string, string>>(e?.details ?? {})
  const [pays, setPays] = useState<Pays>(e?.pays ?? "FR")
  const [codePostal, setCodePostal] = useState(e?.codePostal ?? "")
  const [ville, setVille] = useState(e?.ville ?? "")
  const [photos, setPhotos] = useState<PhotoForm[]>(
    (e?.photos ?? []).map((p, i) => ({ cle: `e${i}`, photo: p })),
  )
  const formules = offres.filter((o) => o.genre === "formule" && offreOuverte(o, annonceur))
  const [formule, setFormule] = useState<CodeOffre>(formules[0]?.code ?? "classique")
  const [options, setOptions] = useState<CodeOffre[]>([])
  const [precautions, setPrecautions] = useState(false)
  const [certification, setCertification] = useState(false)
  const [execution, setExecution] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()
  const fichier = useRef<HTMLInputElement>(null)

  const def = defCategorie(categorie)
  const f = formules.find((o) => o.code === formule)
  const optionsPossibles = offres.filter(
    (o) =>
      o.genre === "option" &&
      offreOuverte(o, annonceur) &&
      o.effet !== "remontee" &&
      o.effet !== "prolongation" &&
      optionUtile(f, o),
  )
  const optionsValides = options.filter((c) => optionsPossibles.some((o) => o.code === c))
  const resume = useMemo(() => {
    try {
      const l = lignesDepot(offres, annonceur, formule, optionsValides)
      return { lignes: l, total: total(l) }
    } catch {
      return { lignes: [], total: 0 }
    }
  }, [offres, annonceur, formule, optionsValides])
  const photosMax = existante
    ? existante.photosMax
    : photosPermises(offres, formule, optionsValides)
  const envoiPhotos = photos.some((p) => !p.photo && !p.erreur)
  const pretes = photos.filter((p) => p.photo)

  async function ajouterPhotos(liste: FileList | null) {
    if (!liste?.length) return
    const place = photosMax - photos.filter((p) => !p.erreur).length
    const choisies = [...liste].slice(0, Math.max(0, place))
    if (liste.length > choisies.length)
      setErreur(`${photosMax} photos au plus${existante ? "" : " avec cette formule"}.`)
    const nouvelles = choisies.map((file) => ({
      cle: `${Date.now()}-${Math.random()}`,
      apercu: URL.createObjectURL(file),
      file,
    }))
    setPhotos((p) => [...p, ...nouvelles.map(({ cle, apercu }) => ({ cle, apercu }))])
    for (const n of nouvelles) {
      try {
        const photo = await preparerEtEnvoyer(n.file)
        setPhotos((p) => p.map((x) => (x.cle === n.cle ? { ...x, photo } : x)))
      } catch (err) {
        setPhotos((p) =>
          p.map((x) => (x.cle === n.cle ? { ...x, erreur: (err as Error).message } : x)),
        )
      }
    }
    if (fichier.current) fichier.current.value = ""
  }

  const retirerPhoto = (cle: string) =>
    setPhotos((p) => {
      const x = p.find((y) => y.cle === cle)
      if (x?.apercu) URL.revokeObjectURL(x.apercu)
      return p.filter((y) => y.cle !== cle)
    })
  const enPremier = (cle: string) =>
    setPhotos((p) => [...p.filter((y) => y.cle === cle), ...p.filter((y) => y.cle !== cle)])

  function envoyer(ev: React.FormEvent) {
    ev.preventDefault()
    setErreur(null)
    if (!def) return setErreur("Choisissez une catégorie.")
    if (envoiPhotos) return setErreur("Patientez : les photos sont encore en cours d'envoi.")
    const contenu = {
      categorie,
      titre,
      description,
      prix,
      mention,
      pays,
      ville,
      codePostal,
      details: Object.fromEntries(def.champs.map((c) => [c.cle, details[c.cle] ?? ""])),
      photos: pretes.map((p) => p.photo!),
    }
    demarrer(async () => {
      const r = existante
        ? await actionModifier(existante.id, contenu)
        : await actionDeposer({
            ...contenu,
            formule,
            options: optionsValides,
            certification: certification as true,
            precautions,
            executionImmediate: execution,
          })
      if (!r.ok) return setErreur(r.erreur)
      window.location.assign(r.url)
    })
  }

  const enLigne = existante?.statut === "publiee" || existante?.statut === "signalee"
  let n = 0
  const requisRemplis = (def?.champs ?? []).every((c) => !c.requis || (details[c.cle] ?? "").trim())
  const faits = {
    categorie: Boolean(def),
    texte: titre.trim().length >= 5 && description.trim().length >= 20 && requisRemplis,
    photos: pretes.length > 0,
    lieu: codePostal.trim().length >= 4 && ville.trim().length >= 2,
    formule: certification,
  }
  const etapes = existante
    ? [faits.categorie, faits.texte, faits.photos, faits.lieu]
    : [faits.categorie, faits.texte, faits.photos, faits.lieu, faits.formule]
  const nbFaits = etapes.filter(Boolean).length

  return (
    <form onSubmit={envoyer} className="space-y-5" noValidate>
      <div className="bg-papier sticky top-16 z-30 -mx-1 px-1 py-2.5 shadow-[0_10px_12px_-12px_rgb(0_0_0/0.35)]">
        <div
          className="rail-etapes"
          style={{ "--etapes": etapes.length } as React.CSSProperties}
          aria-hidden
        >
          {etapes.map((f, i) => (
            <span key={i} data-fait={f ? "1" : "0"} />
          ))}
        </div>
        <p className="text-encre-3 mt-1.5 text-xs font-semibold" aria-live="polite">
          {nbFaits === etapes.length
            ? "Tout est prêt"
            : `${nbFaits} étape${nbFaits > 1 ? "s" : ""} sur ${etapes.length}`}
        </p>
      </div>
      {!existante || !categorie ? (
        <Etape
          n={++n}
          titre="Catégorie"
          aide="Où les acheteurs chercheront-ils votre annonce ?"
          fait={faits.categorie}
        >
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {categories.map((c) => {
              const choisi = c.slug === categorie
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={choisi}
                  onClick={() => {
                    setCategorie(c.slug)
                    setDetails({})
                  }}
                  className={cn(
                    "relative flex min-h-[4.25rem] items-center gap-2.5 rounded-lg border-2 p-2.5 text-left transition-colors",
                    choisi ? "border-encre bg-papier-2" : "border-trait hover:border-trait-fort",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-10 flex-none place-items-center rounded-md",
                      teinte(c.slug),
                    )}
                  >
                    <IconeCategorie slug={c.slug} className="size-5" />
                  </span>
                  <span className="text-[0.88rem] leading-tight font-bold">{c.nom}</span>
                  {choisi && <Check className="absolute top-1.5 right-1.5 size-4" aria-hidden />}
                </button>
              )
            })}
          </div>
        </Etape>
      ) : (
        <p className="text-encre-2 text-sm">
          Catégorie :{" "}
          <strong>
            {categories.find((c) => c.slug === categorie)?.nom ??
              CATEGORIES_DEPART.find((c) => c.slug === categorie)?.nom}
          </strong>
        </p>
      )}

      {def && (
        <>
          <Etape
            n={++n}
            fait={faits.texte}
            titre="Votre annonce"
            aide="Soyez précis : une annonce claire se vend plus vite."
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="d-titre" className="etiquette">
                  Titre
                </label>
                <input
                  id="d-titre"
                  className="champ"
                  value={titre}
                  onChange={(x) => setTitre(x.target.value)}
                  maxLength={80}
                  required
                  placeholder={
                    def.slug === "emploi"
                      ? "Ex. Vendeur·se en boulangerie (CDI)"
                      : "Ex. Vélo de ville taille M, très bon état"
                  }
                />
                <p className="text-encre-3 mt-1 text-right text-xs">{titre.length} / 80</p>
              </div>
              <div>
                <label htmlFor="d-description" className="etiquette">
                  Description
                </label>
                <textarea
                  id="d-description"
                  className="champ min-h-40"
                  value={description}
                  onChange={(x) => setDescription(x.target.value)}
                  maxLength={4000}
                  required
                  placeholder="État, dimensions, raison de la vente, disponibilités…"
                />
                <p className="text-encre-3 mt-1 flex justify-between gap-3 text-xs">
                  <span>
                    Pas de téléphone, d&apos;e-mail ni de lien : les acheteurs vous écrivent par le
                    site.
                  </span>
                  <span className="flex-none">{description.length} / 4000</span>
                </p>
              </div>
              {def.prix !== "aucun" && (
                <div className="grid grid-cols-[1fr_1fr] gap-3">
                  <div>
                    <label htmlFor="d-prix" className="etiquette">
                      {def.prix === "tarif" ? "Tarif" : "Prix"}{" "}
                      <span className="text-encre-3 font-normal">en €</span>
                    </label>
                    <input
                      id="d-prix"
                      className="champ"
                      value={mention === "don" ? "" : prix}
                      disabled={mention === "don"}
                      onChange={(x) => setPrix(x.target.value)}
                      inputMode="decimal"
                      maxLength={12}
                      placeholder={mention === "don" ? "Gratuit" : "Ex. 150"}
                    />
                  </div>
                  <div>
                    <label htmlFor="d-mention" className="etiquette">
                      Précision
                    </label>
                    <select
                      id="d-mention"
                      className="champ"
                      value={mention}
                      onChange={(x) => setMention(x.target.value as MentionPrix | "")}
                    >
                      <option value="">Prix ferme</option>
                      <option value="a_debattre">À débattre</option>
                      {def.prix === "prix" ? (
                        <option value="don">À donner</option>
                      ) : (
                        <option value="sur_devis">Sur devis</option>
                      )}
                    </select>
                  </div>
                </div>
              )}
              {def.champs.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {def.champs.map((c) => (
                    <ChampCategorie
                      key={c.cle}
                      c={c}
                      valeur={details[c.cle] ?? ""}
                      changer={(v) => setDetails((d) => ({ ...d, [c.cle]: v }))}
                    />
                  ))}
                </div>
              )}
            </div>
          </Etape>

          <Etape
            n={++n}
            fait={faits.photos}
            titre="Photos"
            aide={`${photosMax} photos au plus · la première est la vignette.`}
          >
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {photos.map((p, i) => (
                <li
                  key={p.cle}
                  className="bg-papier-2 relative aspect-square overflow-hidden rounded-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local */}
                  <img
                    src={p.photo?.vignette ?? p.apercu}
                    alt={`Photo ${i + 1}`}
                    className="size-full object-cover"
                  />
                  {!p.photo && !p.erreur && (
                    <span className="absolute inset-0 grid place-items-center bg-black/45 text-white">
                      <Loader2 className="size-6 animate-spin" aria-label="Envoi en cours" />
                    </span>
                  )}
                  {p.erreur && (
                    <span className="bg-erreur-fond text-alerte absolute inset-0 grid place-items-center p-1.5 text-center text-[0.7rem] font-bold">
                      {p.erreur}
                    </span>
                  )}
                  {i === 0 && p.photo && (
                    <span className="bg-accent text-sur-accent absolute top-1 left-1 rounded px-1.5 text-[0.65rem] font-extrabold">
                      Vignette
                    </span>
                  )}
                  <span className="absolute right-1 bottom-1 flex gap-1">
                    {i > 0 && p.photo && (
                      <button
                        type="button"
                        onClick={() => enPremier(p.cle)}
                        className="grid size-8 place-items-center rounded-full bg-black/70 text-white"
                        aria-label={`Mettre la photo ${i + 1} en vignette`}
                      >
                        <Star className="size-4" aria-hidden />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => retirerPhoto(p.cle)}
                      className="grid size-8 place-items-center rounded-full bg-black/70 text-white"
                      aria-label={`Retirer la photo ${i + 1}`}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </span>
                </li>
              ))}
              {photos.filter((p) => !p.erreur).length < photosMax && (
                <li>
                  <label className="border-trait-fort text-encre-2 hover:bg-papier-2 grid aspect-square cursor-pointer place-items-center rounded-md border-2 border-dashed text-center text-xs font-bold">
                    <span>
                      <ImagePlus className="mx-auto mb-1 size-7" aria-hidden />
                      Ajouter
                    </span>
                    <input
                      ref={fichier}
                      type="file"
                      accept={TYPES_ACCEPTES}
                      multiple
                      className="sr-only"
                      onChange={(x) => ajouterPhotos(x.target.files)}
                    />
                  </label>
                </li>
              )}
            </ul>
            <p className="text-encre-3 mt-2 text-xs">
              Photos réduites avant l&apos;envoi ; la position GPS de vos photos est effacée.
            </p>
          </Etape>

          <Etape
            n={++n}
            fait={faits.lieu}
            titre="Où ?"
            aide="Seule la commune est affichée, jamais votre adresse."
          >
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PAYS) as Pays[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={pays === p}
                  onClick={() => setPays(p)}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-bold",
                    pays === p ? "border-encre bg-papier-2" : "border-trait",
                  )}
                >
                  <Drapeau pays={p} />
                  {PAYS[p]}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-[7.5rem_1fr] gap-3">
              <div>
                <label htmlFor="d-cp" className="etiquette">
                  Code postal
                </label>
                <input
                  id="d-cp"
                  className="champ"
                  value={codePostal}
                  onChange={(x) => setCodePostal(x.target.value)}
                  inputMode={pays === "LU" ? "text" : "numeric"}
                  maxLength={7}
                  placeholder={CP_EXEMPLE[pays]}
                  required
                />
              </div>
              <div>
                <label htmlFor="d-ville" className="etiquette">
                  Commune
                </label>
                <input
                  id="d-ville"
                  className="champ"
                  value={ville}
                  onChange={(x) => setVille(x.target.value)}
                  maxLength={60}
                  placeholder="Ex. Sierck-les-Bains"
                  required
                />
              </div>
            </div>
          </Etape>

          {!existante && (
            <Etape
              n={++n}
              fait={faits.formule}
              titre={annonceur === "pro" ? "Formule professionnelle" : "Formule et options"}
            >
              <div className="space-y-2.5">
                {formules.map((o) => (
                  <label
                    key={o.code}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3.5",
                      formule === o.code ? "border-encre bg-papier-2" : "border-trait",
                    )}
                  >
                    <input
                      type="radio"
                      name="formule"
                      className="accent-accent mt-1 size-4 flex-none"
                      checked={formule === o.code}
                      onChange={() => setFormule(o.code)}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="font-extrabold">{o.nom}</span>
                        <span className="flex-none font-extrabold">
                          {euros(o.prixCentimes)}
                          {o.prixCentimes > 0 && (
                            <span className="text-encre-3 text-xs font-semibold">
                              {" "}
                              / {o.jours} j
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="text-encre-2 mt-0.5 block text-[0.85rem] leading-snug">
                        {o.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {optionsPossibles.length > 0 && (
                <>
                  <p className="surtitre text-encre-2 mt-5 mb-2">Options pour plus de visibilité</p>
                  <div className="space-y-2">
                    {optionsPossibles.map((o) => {
                      const coche = optionsValides.includes(o.code)
                      return (
                        <label
                          key={o.code}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-lg border p-3",
                            coche ? "border-encre" : "border-trait",
                          )}
                        >
                          <input
                            type="checkbox"
                            className="accent-accent mt-1 size-4 flex-none"
                            checked={coche}
                            onChange={() =>
                              setOptions((x) =>
                                coche ? x.filter((c) => c !== o.code) : [...x, o.code],
                              )
                            }
                          />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-baseline justify-between gap-3">
                              <span className="font-bold">{o.nom}</span>
                              <span className="flex-none font-bold">+ {euros(o.prixCentimes)}</span>
                            </span>
                            <span className="text-encre-2 block text-[0.82rem] leading-snug">
                              {o.description}
                            </span>
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </>
              )}
              <dl className="border-trait-fort mt-5 border-t-2 pt-3">
                {resume.lignes.map((l) => (
                  <div key={l.code} className="text-encre-2 flex justify-between text-sm">
                    <dt>{l.libelle}</dt>
                    <dd>{euros(l.centimes)}</dd>
                  </div>
                ))}
                <div className="mt-1.5 flex justify-between text-lg font-extrabold">
                  <dt>Total</dt>
                  <dd>{resume.total ? euros(resume.total) : "Gratuit"}</dd>
                </div>
              </dl>
              {resume.total > 0 && !paiementOuvert && (
                <p className="text-alerte mt-2 text-sm font-semibold">
                  Le paiement en ligne n&apos;est pas encore ouvert : choisissez la formule
                  gratuite.
                </p>
              )}
            </Etape>
          )}

          <div className="space-y-3 px-1">
            {def.precautions && (
              <label className="flex gap-3 text-[0.9rem] leading-snug">
                <input
                  type="checkbox"
                  className="accent-accent mt-0.5 size-4 flex-none"
                  checked={precautions}
                  onChange={(x) => setPrecautions(x.target.checked)}
                />
                <span>
                  <strong>Précautions {def.nom} :</strong>
                  <ul className="text-encre-2 mt-1 list-disc space-y-0.5 pl-4">
                    {def.precautions.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </span>
              </label>
            )}
            {!existante && (
              <label className="flex gap-3 text-[0.9rem] leading-snug">
                <input
                  type="checkbox"
                  className="accent-accent mt-0.5 size-4 flex-none"
                  checked={certification}
                  onChange={(x) => setCertification(x.target.checked)}
                />
                <span>
                  Je certifie que mon annonce est exacte et respecte{" "}
                  <Link href="/regles" target="_blank" className="underline">
                    les règles de la rubrique
                  </Link>{" "}
                  et{" "}
                  <Link href="/conditions" target="_blank" className="underline">
                    les conditions
                  </Link>
                  .
                </span>
              </label>
            )}
            {!existante && resume.total > 0 && annonceur === "particulier" && (
              <label className="flex gap-3 text-[0.9rem] leading-snug">
                <input
                  type="checkbox"
                  className="accent-accent mt-0.5 size-4 flex-none"
                  checked={execution}
                  onChange={(x) => setExecution(x.target.checked)}
                />
                <span>
                  Je demande que le service commence dès la publication, avant la fin du délai de
                  rétractation de 14 jours. Si je me rétracte ensuite, je paierai la part déjà
                  fournie.
                </span>
              </label>
            )}
          </div>

          {erreur && (
            <p
              role="alert"
              className="bg-erreur-fond text-alerte rounded-lg p-3 text-sm font-semibold"
            >
              {erreur}
            </p>
          )}
          {enLigne && (
            <p className="text-encre-2 text-sm">
              Votre annonce sera revérifiée par l&apos;équipe avant de réapparaître (en général dans
              la journée).
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={enCours || envoiPhotos}
              className="btn btn-plein min-h-12 w-full sm:w-auto"
            >
              {enCours && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {existante
                ? "Enregistrer les modifications"
                : resume.total > 0
                  ? `Payer ${euros(resume.total)} et envoyer`
                  : "Envoyer pour vérification"}
            </button>
            {existante && (
              <Link href="/mon-espace" className="lien-fleche text-sm">
                <ArrowLeft className="size-4" aria-hidden />
                Annuler
              </Link>
            )}
          </div>
          {!existante && (
            <p className="text-encre-3 text-[0.82rem] leading-snug">
              {resume.total > 0
                ? "Paiement sécurisé par Stripe : Radio Tripoint ne voit jamais votre carte. Votre annonce est vérifiée avant publication ; si elle est refusée, vous êtes remboursé en totalité."
                : "L'équipe de Radio Tripoint vérifie chaque annonce avant de la publier, en général dans la journée."}
            </p>
          )}
        </>
      )}
    </form>
  )
}
