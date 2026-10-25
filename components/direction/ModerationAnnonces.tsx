"use client"

import { Check, Loader2, X } from "lucide-react"
import { useState, useTransition } from "react"
import {
  actionBloquer,
  actionDebloquer,
  actionPublier,
  actionRefuser,
  actionRembourser,
  actionRetablir,
  actionRetirer,
  actionValiderPro,
} from "@/app/direction/(espace)/annonces/actions"
import { cn } from "@/lib/utils/cn"

type Resultat = { ok: true; message: string } | { ok: false; erreur: string }

const bouton =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-bold disabled:opacity-50"

/** Motifs de refus les plus courants : un clic, puis on complète si besoin. */
const MOTIFS = [
  "Photos absentes, floues ou sans rapport avec l'annonce.",
  "Description trop courte ou peu claire.",
  "Produit ou service interdit par les règles de la rubrique.",
  "Coordonnées ou liens dans le texte : le contact passe par le site.",
  "Annonce en double.",
  "Annonce professionnelle déposée avec un compte de particulier.",
  "Offre d'emploi non conforme (critère discriminatoire, frais demandés…).",
  "Soupçon de fraude.",
]

function useAction() {
  const [enCours, demarrer] = useTransition()
  const lancer = (action: () => Promise<Resultat>, confirmation?: string) => {
    if (confirmation && !window.confirm(confirmation)) return
    demarrer(async () => {
      const r = await action()
      // Le bloc change de rubrique après l'action : le message passe par une alerte.
      window.alert(r.ok ? r.message : r.erreur)
    })
  }
  return { enCours, lancer }
}

export function ModerationAnnonce({
  id,
  statut,
  payee,
}: {
  id: string
  statut: string
  payee: boolean
}) {
  const { enCours, lancer } = useAction()
  const [mode, setMode] = useState<null | "refuser" | "retirer">(null)
  const [motif, setMotif] = useState("")
  const [prevenir, setPrevenir] = useState(true)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {statut === "en_attente" && (
          <button
            type="button"
            disabled={enCours}
            onClick={() => lancer(() => actionPublier(id))}
            className={cn(bouton, "border-accent bg-accent text-black")}
          >
            {enCours ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Check className="size-4" aria-hidden />
            )}
            Publier
          </button>
        )}
        {statut === "signalee" && (
          <button
            type="button"
            disabled={enCours}
            onClick={() => lancer(() => actionRetablir(id))}
            className={cn(bouton, "border-accent bg-accent text-black")}
          >
            <Check className="size-4" aria-hidden />
            Rétablir (signalement infondé)
          </button>
        )}
        {["en_attente", "attente_paiement", "signalee"].includes(statut) && (
          <button
            type="button"
            onClick={() => setMode(mode === "refuser" ? null : "refuser")}
            className={cn(bouton, "border-trait text-encre")}
          >
            <X className="size-4" aria-hidden />
            Refuser…
          </button>
        )}
        {["publiee", "signalee", "expiree"].includes(statut) && (
          <button
            type="button"
            onClick={() => setMode(mode === "retirer" ? null : "retirer")}
            className={cn(bouton, "border-trait text-encre-2")}
          >
            Retirer…
          </button>
        )}
      </div>
      {mode && (
        <div className="border-trait space-y-2.5 rounded-xl border p-3">
          <p className="text-encre-2 text-xs font-bold">Motif envoyé à l&apos;annonceur</p>
          <div className="flex flex-wrap gap-1.5">
            {MOTIFS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMotif((x) => (x.includes(m) ? x : `${x ? `${x} ` : ""}${m}`))}
                className="border-trait text-encre-2 rounded-full border px-2.5 py-1 text-left text-xs"
              >
                {m}
              </button>
            ))}
          </div>
          <textarea
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            rows={3}
            maxLength={600}
            className="border-trait bg-carte-2 text-encre w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Motif (facultatif mais conseillé)"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={prevenir}
              onChange={(e) => setPrevenir(e.target.checked)}
            />
            Prévenir l&apos;annonceur par e-mail
          </label>
          {mode === "refuser" && payee && (
            <p className="text-encre-2 text-xs">
              Annonce payée et jamais publiée : le remboursement intégral part automatiquement.
            </p>
          )}
          <button
            type="button"
            disabled={enCours}
            onClick={() =>
              lancer(
                () =>
                  mode === "refuser"
                    ? actionRefuser(id, motif, prevenir)
                    : actionRetirer(id, motif, prevenir),
                mode === "refuser" ? "Refuser cette annonce ?" : "Retirer cette annonce du site ?",
              )
            }
            className={cn(bouton, "border-encre bg-encre text-fond")}
          >
            {enCours && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {mode === "refuser" ? "Confirmer le refus" : "Confirmer le retrait"}
          </button>
        </div>
      )}
    </div>
  )
}

export function ActionsCompte({
  id,
  bloque,
  pro,
  proValide,
}: {
  id: string
  bloque: boolean
  pro: boolean
  proValide: boolean
}) {
  const { enCours, lancer } = useAction()
  return (
    <div className="flex flex-wrap gap-2">
      {pro && !proValide && (
        <button
          type="button"
          disabled={enCours}
          onClick={() =>
            lancer(() => actionValiderPro(id), "Marquer ce professionnel comme vérifié ?")
          }
          className={cn(bouton, "border-trait")}
        >
          Pro vérifié
        </button>
      )}
      {bloque ? (
        <button
          type="button"
          disabled={enCours}
          onClick={() => lancer(() => actionDebloquer(id), "Rétablir ce compte ?")}
          className={cn(bouton, "border-trait")}
        >
          Débloquer
        </button>
      ) : (
        <button
          type="button"
          disabled={enCours}
          onClick={() => {
            const motif = window.prompt(
              "Motif de la suspension (gardé au journal) :",
              "Soupçon de fraude",
            )
            if (motif !== null) lancer(() => actionBloquer(id, motif))
          }}
          className={cn(bouton, "border-trait text-encre-2")}
        >
          Suspendre
        </button>
      )}
    </div>
  )
}

export function BoutonRembourser({ commande, montant }: { commande: string; montant: string }) {
  const { enCours, lancer } = useAction()
  return (
    <button
      type="button"
      disabled={enCours}
      onClick={() => lancer(() => actionRembourser(commande), `Rembourser ${montant} ?`)}
      className={cn(bouton, "border-trait min-h-8 px-3 text-xs")}
    >
      Rembourser
    </button>
  )
}
