"use client"

import { Check, Copy, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import {
  actionAccepter,
  actionMarquerPaye,
  actionRefuser,
  actionRenvoyer,
  actionRetirer,
} from "@/app/direction/(espace)/agenda/actions"
import { cn } from "@/lib/utils/cn"

type Resultat = { ok: true; message: string } | { ok: false; erreur: string }

const bouton =
  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-bold disabled:opacity-50"

/** Boutons de décision d'un dossier. Chaque action est confirmée par un message. */
export function ActionsAgenda({
  id,
  statut,
  lien,
}: {
  id: string
  statut: "a_verifier" | "accepte" | "refuse" | "publie" | "retire"
  lien: string
}) {
  const [enCours, demarrer] = useTransition()
  const [retour, setRetour] = useState<Resultat | null>(null)
  const [refus, setRefus] = useState(false)
  const [motif, setMotif] = useState("")
  const [prevenir, setPrevenir] = useState(true)
  const [copie, setCopie] = useState(false)

  const lancer = (action: () => Promise<Resultat>, confirmation?: string) => {
    if (confirmation && !window.confirm(confirmation)) return
    demarrer(async () => {
      const r = await action()
      setRetour(r)
      // Le dossier change de rubrique (et ce bloc est remonté) : le message
      // passe aussi par une alerte pour ne pas se perdre.
      window.alert(r.ok ? r.message : r.erreur)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(statut === "a_verifier" || statut === "refuse" || statut === "retire") && (
          <button
            type="button"
            disabled={enCours}
            onClick={() =>
              lancer(
                () => actionAccepter(id),
                "Accepter cet événement et envoyer le lien de paiement de 50 € ?",
              )
            }
            className={cn(bouton, "border-accent bg-accent text-black")}
          >
            {enCours ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Check className="size-4" aria-hidden />
            )}
            Accepter
          </button>
        )}
        {statut === "accepte" && (
          <>
            <button
              type="button"
              disabled={enCours}
              onClick={() => lancer(() => actionRenvoyer(id))}
              className={cn(bouton, "border-trait text-encre")}
            >
              Renvoyer le lien
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(lien)
                  setCopie(true)
                  setTimeout(() => setCopie(false), 2000)
                } catch {
                  window.prompt("Lien de paiement :", lien)
                }
              }}
              className={cn(bouton, "border-trait text-encre")}
            >
              <Copy className="size-4" aria-hidden />
              {copie ? "Copié" : "Copier le lien"}
            </button>
            <button
              type="button"
              disabled={enCours}
              onClick={() =>
                lancer(
                  () => actionMarquerPaye(id),
                  "Confirmer que les 50 € sont reçus (virement, espèces…) ? L'événement sera publié tout de suite.",
                )
              }
              className={cn(bouton, "border-bon text-bon")}
            >
              Marquer payé
            </button>
          </>
        )}
        {(statut === "a_verifier" || statut === "accepte") && (
          <button
            type="button"
            disabled={enCours}
            onClick={() => setRefus((v) => !v)}
            className={cn(bouton, "border-trait text-encre-2")}
          >
            Refuser…
          </button>
        )}
        {statut === "publie" && (
          <button
            type="button"
            disabled={enCours}
            onClick={() =>
              lancer(() => actionRetirer(id), "Retirer cet événement de l'agenda public ?")
            }
            className={cn(bouton, "border-trait text-encre-2")}
          >
            Retirer de l&apos;agenda
          </button>
        )}
      </div>

      {refus && (
        <div className="border-trait bg-carte-2 space-y-2 rounded-lg border p-3">
          <label className="block text-xs font-bold" htmlFor={`motif-${id}`}>
            Motif (envoyé à l&apos;organisateur, facultatif)
          </label>
          <textarea
            id={`motif-${id}`}
            rows={3}
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            maxLength={1000}
            className="border-trait bg-carte text-encre block w-full rounded-md border p-2 text-sm outline-none"
            placeholder="Ex. : numéro introuvable dans le registre, événement hors de notre zone…"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={prevenir}
              onChange={(e) => setPrevenir(e.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
            Prévenir l&apos;organisateur par e-mail
          </label>
          <button
            type="button"
            disabled={enCours}
            onClick={() => lancer(() => actionRefuser(id, motif, prevenir))}
            className={cn(bouton, "border-encre text-encre")}
          >
            Confirmer le refus
          </button>
        </div>
      )}

      {retour && (
        <p
          role="status"
          className={cn("text-sm font-semibold", retour.ok ? "text-bon" : "text-alerte")}
        >
          {retour.ok ? retour.message : retour.erreur}
        </p>
      )}
    </div>
  )
}
