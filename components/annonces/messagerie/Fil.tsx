"use client"

import {
  ArrowLeft,
  Check,
  CheckCheck,
  Flag,
  Loader2,
  RotateCcw,
  SendHorizontal,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { actionRepondre, actionSignalerDiscussion } from "@/app/petites-annonces/actions"
import { rafraichirNonLus } from "@/components/annonces/espace/NonLus"
import type { BulleDiscussion } from "@/lib/annonces/discussions"
import { cn } from "@/lib/utils/cn"
import { EVENEMENT_MAJ } from "./ListeDiscussions"
import { heure, initiales, jour, memeJour } from "./temps"

/**
 * Le fil d'une discussion : les bulles, la date du jour quand elle change,
 * « Vu » sous son dernier message quand l'autre l'a lu, et la saisie en bas.
 * Il se tient à jour tout seul (toutes les 4 secondes quand la page est à
 * l'écran) ; un message envoyé apparaît tout de suite, puis se confirme.
 */
type Bulle = BulleDiscussion & { etat?: "envoi" | "echec"; erreur?: string }

const MAX = 2000
const POINTER_FIN = () => window.matchMedia("(pointer: fine)").matches
const prevenirListe = () => window.dispatchEvent(new Event(EVENEMENT_MAJ))
const maintenant = () => Date.now()

export function Fil({
  id,
  avec,
  annonce,
  initiaux,
  luAutreInitial,
  ouverte = true,
}: {
  id: string
  avec: { nom: string; pro: boolean }
  annonce: { titre: string; chemin: string; vignette?: string; prix?: string; etat: string | null }
  initiaux: BulleDiscussion[]
  luAutreInitial: number
  /** Messagerie mise en pause depuis le tableau de bord : on lit, on n'écrit pas. */
  ouverte?: boolean
}) {
  const [bulles, setBulles] = useState<Bulle[]>(initiaux)
  const [luAutre, setLuAutre] = useState(luAutreInitial)
  const [texte, setTexte] = useState("")
  const [erreur, setErreur] = useState<string | null>(null)
  const [signaler, setSignaler] = useState(false)
  const zone = useRef<HTMLDivElement>(null)
  const saisie = useRef<HTMLTextAreaElement>(null)
  const dernierLe = useRef(initiaux.at(-1)?.le ?? 0)
  const collerEnBas = useRef(true)

  const descendre = useCallback((doux = false) => {
    const z = zone.current
    if (z) z.scrollTo({ top: z.scrollHeight, behavior: doux ? "smooth" : "auto" })
  }, [])

  // À l'ouverture : en bas du fil, comme toute messagerie.
  useLayoutEffect(() => descendre(), [descendre])

  const ajouter = useCallback((nouveaux: BulleDiscussion[]) => {
    if (!nouveaux.length) return
    dernierLe.current = Math.max(dernierLe.current, ...nouveaux.map((m) => m.le))
    setBulles((l) => {
      const ids = new Set(l.map((b) => b.id))
      const a = nouveaux.filter((m) => !ids.has(m.id))
      return a.length ? [...l, ...a].sort((x, y) => x.le - y.le) : l
    })
  }, [])

  // Se tenir à jour, et marquer lu ce qui s'affiche à l'écran.
  useEffect(() => {
    let vivant = true
    const relire = async () => {
      const vu = document.visibilityState === "visible"
      try {
        const r = await fetch(`/api/annonces/discussions/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apres: dernierLe.current, vu }),
          cache: "no-store",
        })
        if (!r.ok || !vivant) return
        const d = (await r.json()) as { messages: BulleDiscussion[]; luAutre: number; lu: boolean }
        setLuAutre(d.luAutre)
        if (d.messages.length) {
          ajouter(d.messages)
          prevenirListe()
        }
        if (d.lu) {
          rafraichirNonLus()
          prevenirListe()
        }
      } catch {
        // Réseau coupé : on réessaiera au prochain tour.
      }
    }
    relire()
    const minuterie = setInterval(() => document.visibilityState === "visible" && relire(), 4000)
    document.addEventListener("visibilitychange", relire)
    return () => {
      vivant = false
      clearInterval(minuterie)
      document.removeEventListener("visibilitychange", relire)
    }
  }, [id, ajouter])

  // Un message arrive : on suit si l'on était déjà en bas (ou si c'est le sien).
  const nb = bulles.length
  const dernierMoi = bulles.at(-1)?.moi
  useEffect(() => {
    if (collerEnBas.current || dernierMoi) descendre(true)
  }, [nb, dernierMoi, descendre])

  async function envoyer(contenu: string, remplace?: string) {
    const propre = contenu.trim()
    if (!propre) return
    setErreur(null)
    const provisoire: Bulle = {
      id: remplace ?? `envoi-${maintenant()}`,
      moi: true,
      texte: propre,
      le: maintenant(),
      etat: "envoi",
    }
    setBulles((l) => [...l.filter((b) => b.id !== provisoire.id), provisoire])
    const r = await actionRepondre(id, propre)
    if (r.ok) {
      dernierLe.current = Math.max(dernierLe.current, r.message.le)
      setBulles((l) => [
        ...l.filter((b) => b.id !== provisoire.id && b.id !== r.message.id),
        { ...r.message, moi: true },
      ])
      prevenirListe()
    } else {
      setBulles((l) =>
        l.map((b) => (b.id === provisoire.id ? { ...b, etat: "echec", erreur: r.erreur } : b)),
      )
      setErreur(r.erreur)
    }
  }

  function soumettre(e?: React.FormEvent) {
    e?.preventDefault()
    const t = texte
    if (!t.trim()) return
    setTexte("")
    if (saisie.current) saisie.current.style.height = ""
    void envoyer(t)
    saisie.current?.focus()
  }

  // Le « Vu » : sous son dernier message confirmé, quand l'autre l'a lu.
  const miens = bulles.filter((b) => b.moi && !b.etat)
  const dernierMien = miens.at(-1)
  const vu = dernierMien && luAutre >= dernierMien.le

  return (
    <section aria-label={`Discussion avec ${avec.nom}`} className="flex h-full min-h-0 flex-col">
      <header className="border-trait flex items-center gap-3 border-b px-3 py-2.5 lg:px-5">
        <Link
          href="/messages"
          className="hover:bg-papier-2 -ml-1 grid size-10 flex-none place-items-center rounded-full lg:hidden"
          aria-label="Toutes les discussions"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <span
          aria-hidden
          className="bg-nuit-3 text-nuit-encre grid size-10 flex-none place-items-center rounded-full text-sm font-extrabold"
        >
          {initiales(avec.nom)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[1.02rem] leading-tight font-extrabold">{avec.nom}</p>
          <p className="text-encre-3 text-[0.78rem]">
            {avec.pro ? "Professionnel" : "Particulier"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSignaler((x) => !x)}
          aria-expanded={signaler}
          className="text-encre-2 hover:bg-papier-2 ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[0.82rem] font-bold"
        >
          <Flag className="size-4" aria-hidden />
          <span className="hidden sm:inline">Signaler</span>
          <span className="sr-only sm:hidden">Signaler la discussion</span>
        </button>
      </header>
      {signaler && <Signaler id={id} fermer={() => setSignaler(false)} />}

      {/* L'annonce dont on parle, toujours sous les yeux. */}
      {(() => {
        const contenu = (
          <>
            {annonce.vignette ? (
              // eslint-disable-next-line @next/next/no-img-element -- vignette déjà réduite
              <img
                src={annonce.vignette}
                alt=""
                width={44}
                height={44}
                className="bg-papier-3 size-11 flex-none rounded-lg object-cover"
              />
            ) : (
              <span className="bg-papier-3 size-11 flex-none rounded-lg" aria-hidden />
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.9rem] font-bold">{annonce.titre}</span>
              <span className="text-encre-2 flex items-center gap-2 text-[0.82rem]">
                {annonce.prix && (
                  <span className="font-extrabold tabular-nums">{annonce.prix}</span>
                )}
                {annonce.etat && (
                  <span className="bg-papier-3 text-encre-2 rounded px-1.5 py-px text-[0.7rem] font-extrabold uppercase">
                    {annonce.etat}
                  </span>
                )}
              </span>
            </span>
          </>
        )
        const classe =
          "border-trait bg-papier-2/60 flex items-center gap-3 border-b px-3 py-2 lg:px-5"
        return annonce.etat ? (
          <div className={classe}>{contenu}</div>
        ) : (
          <Link href={annonce.chemin} className={cn(classe, "hover:bg-papier-2")}>
            {contenu}
          </Link>
        )
      })()}

      <div
        ref={zone}
        onScroll={(e) => {
          const z = e.currentTarget
          collerEnBas.current = z.scrollHeight - z.scrollTop - z.clientHeight < 120
        }}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 lg:px-5"
        aria-live="polite"
        aria-relevant="additions"
      >
        <p className="bg-papier-2 text-encre-2 mx-auto mb-4 flex max-w-md items-start gap-2 rounded-xl px-3 py-2.5 text-[0.8rem] leading-snug">
          <ShieldCheck className="text-succes mt-px size-4 flex-none" aria-hidden />
          <span>
            Restez sur la messagerie. Ne payez jamais à l&apos;avance, refusez les coupons, les «
            transporteurs » et les liens de paiement. Rencontrez-vous dans un lieu public.
          </span>
        </p>
        <ol className="space-y-1.5">
          {bulles.map((b, i) => {
            const avant = bulles[i - 1]
            const nouveauJour = !avant || !memeJour(avant.le, b.le)
            const suite =
              avant && !nouveauJour && avant.moi === b.moi && b.le - avant.le < 5 * 60_000
            return (
              <Fragment key={b.id}>
                {nouveauJour && (
                  <li className="text-encre-3 py-2 text-center text-[0.75rem] font-bold first-letter:uppercase">
                    {jour(b.le)}
                  </li>
                )}
                <li
                  className={cn(
                    "flex",
                    b.moi ? "justify-end" : "justify-start",
                    !suite && i > 0 && "pt-1.5",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[82%] rounded-2xl px-3.5 py-2 text-[0.95rem] leading-snug break-words whitespace-pre-wrap sm:max-w-[70%]",
                      b.moi
                        ? "bg-nuit text-nuit-encre rounded-br-md"
                        : "bg-papier-2 text-encre rounded-bl-md",
                      b.etat === "envoi" && "opacity-70",
                      b.etat === "echec" && "ring-alerte ring-2",
                    )}
                  >
                    {b.texte}
                    <span
                      className={cn(
                        "float-right mt-1.5 ml-2.5 inline-flex items-center gap-1 text-[0.68rem] leading-none tabular-nums",
                        b.moi ? "text-nuit-encre-2" : "text-encre-3",
                      )}
                    >
                      {b.etat === "envoi" ? (
                        <Loader2 className="size-3 animate-spin" aria-label="Envoi…" />
                      ) : (
                        heure(b.le)
                      )}
                    </span>
                  </div>
                </li>
                {b.etat === "echec" && (
                  <li className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => void envoyer(b.texte, b.id)}
                      className="text-alerte inline-flex items-center gap-1 text-[0.78rem] font-bold underline"
                    >
                      <RotateCcw className="size-3.5" aria-hidden />
                      Pas envoyé · Réessayer
                    </button>
                  </li>
                )}
                {b.id === dernierMien?.id && (
                  <li className="text-encre-3 flex items-center justify-end gap-1 pr-1 text-[0.72rem] font-semibold">
                    {vu ? (
                      <>
                        <CheckCheck className="size-3.5 text-[#146272]" aria-hidden /> Vu
                      </>
                    ) : (
                      <>
                        <Check className="size-3.5" aria-hidden /> Envoyé
                      </>
                    )}
                  </li>
                )}
              </Fragment>
            )
          })}
        </ol>
      </div>

      {!ouverte ? (
        <p className="border-trait bg-papier-2 text-encre-2 border-t px-4 py-4 text-center text-[0.9rem] font-semibold">
          La messagerie est en pause pour le moment : vous pourrez répondre très vite.
        </p>
      ) : (
        <form
          onSubmit={soumettre}
          className="border-trait bg-surface border-t px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] lg:px-5"
        >
          {erreur && (
            <p role="alert" className="text-alerte mb-2 text-[0.82rem] font-semibold">
              {erreur}
            </p>
          )}
          <div className="flex items-end gap-2">
            <label htmlFor="fil-saisie" className="sr-only">
              Votre message
            </label>
            <textarea
              id="fil-saisie"
              ref={saisie}
              value={texte}
              rows={1}
              maxLength={MAX}
              enterKeyHint="send"
              placeholder="Écrire un message…"
              onChange={(e) => {
                setTexte(e.target.value)
                const t = e.target
                t.style.height = ""
                t.style.height = `${Math.min(t.scrollHeight, 140)}px`
              }}
              onKeyDown={(e) => {
                // Sur ordinateur, Entrée envoie (Maj + Entrée pour aller à la ligne).
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing &&
                  POINTER_FIN()
                ) {
                  e.preventDefault()
                  soumettre()
                }
              }}
              className="champ max-h-[140px] min-h-11 flex-1 resize-none rounded-[1.4rem] py-2.5 leading-snug"
            />
            <button
              type="submit"
              disabled={!texte.trim()}
              aria-label="Envoyer"
              className="bg-accent text-sur-accent grid size-11 flex-none place-items-center rounded-full transition hover:brightness-95 disabled:opacity-40"
            >
              <SendHorizontal className="size-5" aria-hidden />
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

const MOTIFS: [string, string][] = [
  ["arnaque", "Arnaque ou demande de paiement suspecte"],
  ["insultes", "Propos insultants ou menaçants"],
  ["spam", "Publicité ou messages en masse"],
  ["autre", "Autre raison"],
]

/** Signaler la discussion : l'équipe de la radio lit alors ses derniers messages. */
function Signaler({ id, fermer }: { id: string; fermer: () => void }) {
  const [motif, setMotif] = useState("arnaque")
  const [explication, setExplication] = useState("")
  const [etat, setEtat] = useState<"saisie" | "envoi" | "fait">("saisie")
  const [erreur, setErreur] = useState<string | null>(null)
  if (etat === "fait")
    return (
      <div className="border-trait bg-papier-2 flex items-start gap-3 border-b px-4 py-3 text-[0.88rem]">
        <ShieldCheck className="text-succes mt-0.5 size-4 flex-none" aria-hidden />
        <p className="flex-1">
          Merci. L&apos;équipe de Radio Tripoint va regarder. En attendant, ne payez rien et ne
          donnez aucun code.
        </p>
        <button type="button" onClick={fermer} className="font-bold underline">
          Fermer
        </button>
      </div>
    )
  return (
    <form
      className="border-trait bg-papier-2 space-y-2.5 border-b px-4 py-3"
      onSubmit={async (e) => {
        e.preventDefault()
        setEtat("envoi")
        setErreur(null)
        const r = await actionSignalerDiscussion(id, motif, explication)
        if (r.ok) setEtat("fait")
        else {
          setErreur(r.erreur)
          setEtat("saisie")
        }
      }}
    >
      <p className="text-[0.9rem] font-extrabold">Signaler cette discussion</p>
      <select
        className="champ"
        value={motif}
        onChange={(e) => setMotif(e.target.value)}
        aria-label="Raison du signalement"
      >
        {MOTIFS.map(([k, t]) => (
          <option key={k} value={k}>
            {t}
          </option>
        ))}
      </select>
      <textarea
        className="champ"
        rows={2}
        maxLength={1000}
        placeholder="Ce qui s'est passé (facultatif)"
        value={explication}
        onChange={(e) => setExplication(e.target.value)}
        aria-label="Explication"
      />
      <p className="text-encre-3 text-[0.75rem] leading-snug">
        L&apos;équipe de la radio pourra lire les derniers messages de cette discussion pour
        décider.
      </p>
      {erreur && <p className="text-alerte text-[0.82rem] font-semibold">{erreur}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={etat === "envoi"}
          className="btn btn-plein min-h-10 px-4 text-sm"
        >
          {etat === "envoi" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Flag className="size-4" aria-hidden />
          )}
          Envoyer le signalement
        </button>
        <button type="button" onClick={fermer} className="btn btn-trait min-h-10 px-4 text-sm">
          Annuler
        </button>
      </div>
    </form>
  )
}
