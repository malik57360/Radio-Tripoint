"use client"

import { Check, Loader2, NotebookPen } from "lucide-react"
import { useState, useTransition } from "react"
import { actionSuivi } from "@/app/direction/(espace)/prospection/actions"
import { cn } from "@/lib/utils/cn"

type Statut = "a_contacter" | "contacte" | "interesse" | "rdv" | "client" | "refus" | "stop"

const STATUTS: Record<Statut, string> = {
  a_contacter: "À contacter",
  contacte: "Contacté",
  interesse: "Intéressé",
  rdv: "Rendez-vous",
  client: "Client",
  refus: "Pas intéressé",
  stop: "Ne plus contacter",
}

const TEINTE: Record<Statut, string> = {
  a_contacter: "border-trait text-encre-2",
  contacte: "border-accent/50 text-accent",
  interesse: "border-accent text-accent",
  rdv: "border-accent bg-accent-doux text-accent",
  client: "border-bon text-bon",
  refus: "border-trait text-encre-3",
  stop: "border-alerte/60 text-alerte",
}

export interface SuiviInitial {
  statut: Statut
  note: string
  email: string
  telephone: string
  dernierEnvoi?: number
}

const champ =
  "border-trait bg-carte-2 text-encre focus:border-accent block w-full rounded-md border px-2.5 py-1.5 text-sm outline-none"

/** Statut commercial, notes et coordonnées trouvées pour une entreprise. */
export function SuiviProspect({
  siren,
  fiche,
  initial,
}: {
  siren: string
  fiche: { nom: string; commune: string; activite: string }
  initial: SuiviInitial | null
}) {
  const [s, setS] = useState<SuiviInitial>(
    initial ?? { statut: "a_contacter", note: "", email: "", telephone: "" },
  )
  const [ouvert, setOuvert] = useState(false)
  const [etat, setEtat] = useState<"ok" | "erreur" | null>(null)
  const [erreur, setErreur] = useState("")
  const [enCours, demarrer] = useTransition()

  const enregistrer = (suivant: SuiviInitial) => {
    setEtat(null)
    demarrer(async () => {
      const r = await actionSuivi(siren, { ...suivant, ...fiche })
      if (r.ok) setEtat("ok")
      else {
        setEtat("erreur")
        setErreur(r.erreur)
      }
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`statut-${siren}`}>
          Statut
        </label>
        <select
          id={`statut-${siren}`}
          value={s.statut}
          onChange={(e) => {
            const suivant = { ...s, statut: e.target.value as Statut }
            setS(suivant)
            enregistrer(suivant)
          }}
          className={cn(
            "bg-carte-2 rounded-full border px-3 py-1.5 text-xs font-bold outline-none",
            TEINTE[s.statut],
          )}
        >
          {Object.entries(STATUTS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setOuvert((o) => !o)}
          aria-expanded={ouvert}
          className="text-encre-2 hover:text-encre inline-flex items-center gap-1 text-xs font-semibold"
        >
          <NotebookPen className="size-3.5" aria-hidden />
          {s.note || s.email || s.telephone ? "Notes et contact" : "Ajouter notes / contact"}
        </button>
        {enCours && (
          <Loader2 className="text-encre-3 size-3.5 animate-spin" aria-label="Enregistrement" />
        )}
        {etat === "ok" && !enCours && (
          <Check className="text-bon size-3.5" aria-label="Enregistré" />
        )}
        {etat === "erreur" && <span className="text-alerte text-xs">{erreur}</span>}
      </div>
      {s.dernierEnvoi && (
        <p className="text-encre-3 text-xs">
          Dernier mail envoyé le {new Date(s.dernierEnvoi).toLocaleDateString("fr-FR")}
        </p>
      )}
      {ouvert && (
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            type="email"
            value={s.email}
            onChange={(e) => setS({ ...s, email: e.target.value })}
            placeholder="E-mail trouvé"
            aria-label="E-mail"
            className={champ}
          />
          <input
            type="tel"
            value={s.telephone}
            onChange={(e) => setS({ ...s, telephone: e.target.value })}
            placeholder="Téléphone trouvé"
            aria-label="Téléphone"
            className={champ}
          />
          <textarea
            value={s.note}
            onChange={(e) => setS({ ...s, note: e.target.value })}
            rows={2}
            placeholder="Notes : qui appeler, ce qui a été dit…"
            aria-label="Notes"
            className={cn(champ, "sm:col-span-2")}
          />
          <button
            type="button"
            onClick={() => enregistrer(s)}
            disabled={enCours}
            className="border-trait hover:border-accent w-fit rounded-full border px-3 py-1.5 text-xs font-bold"
          >
            Enregistrer
          </button>
        </div>
      )}
    </div>
  )
}
