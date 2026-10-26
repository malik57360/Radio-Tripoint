"use client"

import { Info, Loader2, Save } from "lucide-react"
import { useState, useTransition } from "react"
import { actionPilotage } from "@/app/direction/(espace)/annonces/actions"
import type { PilotageSite } from "@/lib/annonces/config"
import { cn } from "@/lib/utils/cn"

/**
 * Pilotage du site des annonces : les grands interrupteurs, appliqués dès
 * l'enregistrement, sans redéploiement. Chaque ligne dit ce que voit le
 * public dans un cas et dans l'autre.
 */
const champ =
  "border-trait bg-carte-2 text-encre block w-full rounded-lg border px-2.5 py-2 text-sm outline-none focus:border-accent"

function Interrupteur({
  titre,
  oui,
  non,
  valeur,
  changer,
  danger = false,
}: {
  titre: string
  oui: string
  non: string
  valeur: boolean
  changer: (v: boolean) => void
  /** Couper cet interrupteur se voit beaucoup (site en pause…) : il passe en orange. */
  danger?: boolean
}) {
  return (
    <div className="border-trait flex items-start justify-between gap-4 border-b py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="font-bold">{titre}</p>
        <p
          className={cn(
            "text-sm",
            !valeur && danger ? "text-alerte font-semibold" : "text-encre-2",
          )}
        >
          {valeur ? oui : non}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={valeur}
        aria-label={titre}
        onClick={() => changer(!valeur)}
        className={cn(
          "relative h-8 w-14 flex-none rounded-full transition-colors",
          valeur ? "bg-[#1b6e45]" : danger ? "bg-[#b54708]" : "bg-[#5b6470]",
        )}
      >
        <span
          className={cn(
            "absolute top-1 size-6 rounded-full bg-white shadow transition-[left]",
            valeur ? "left-7" : "left-1",
          )}
        />
      </button>
    </div>
  )
}

export function PilotageAnnonces({ initial }: { initial: PilotageSite }) {
  const [p, setP] = useState(initial)
  const [enCours, demarrer] = useTransition()
  const [retour, setRetour] = useState<{ ok: boolean; texte: string } | null>(null)
  const maj = <K extends keyof PilotageSite>(k: K, v: PilotageSite[K]) => {
    setRetour(null)
    setP((x) => ({ ...x, [k]: v }))
  }

  function enregistrer() {
    demarrer(async () => {
      const r = await actionPilotage(p)
      setRetour(r.ok ? { ok: true, texte: r.message } : { ok: false, texte: r.erreur })
    })
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
      <div className="bg-carte border-trait rounded-2xl border px-5">
        <Interrupteur
          titre="Site des annonces"
          valeur={p.ouvert}
          changer={(v) => maj("ouvert", v)}
          oui="Ouvert : tout le monde peut chercher, déposer et écrire."
          non="En pause : chaque page affiche le message de pause ci-dessous."
          danger
        />
        {!p.ouvert && (
          <label className="block pb-4">
            <span className="text-encre-2 text-sm font-semibold">Message de pause</span>
            <textarea
              className={cn(champ, "mt-1")}
              rows={3}
              maxLength={300}
              value={p.messagePause}
              onChange={(e) => maj("messagePause", e.target.value)}
            />
          </label>
        )}
        <Interrupteur
          titre="Inscriptions"
          valeur={p.inscriptionsOuvertes}
          changer={(v) => maj("inscriptionsOuvertes", v)}
          oui="Ouvertes : on peut créer un compte."
          non="Fermées : la page d'inscription l'annonce ; les comptes existants se connectent."
        />
        <Interrupteur
          titre="Messagerie"
          valeur={p.messagerieOuverte}
          changer={(v) => maj("messagerieOuverte", v)}
          oui="Ouverte : les acheteurs écrivent, les annonceurs répondent."
          non="En pause : les discussions restent lisibles, plus personne ne peut écrire."
        />
        <Interrupteur
          titre="Lien « Annonces » sur le site de la radio"
          valeur={p.lienRadio}
          changer={(v) => maj("lienRadio", v)}
          oui="Affiché dans le menu et le pied de page de radio-tripoint-officiel.fr."
          non="Masqué : le site des annonces reste joignable par son adresse."
        />
        <Interrupteur
          titre="Bandeau d'information"
          valeur={p.bandeau.actif}
          changer={(v) => maj("bandeau", { ...p.bandeau, actif: v })}
          oui="Affiché en haut de chaque page du site des annonces."
          non="Aucun bandeau."
        />
        <div className="space-y-3 pb-5">
          <label className="block">
            <span className="text-encre-2 text-sm font-semibold">Texte du bandeau</span>
            <input
              className={cn(champ, "mt-1")}
              maxLength={200}
              placeholder="Ex. : Les dépôts sont gratuits jusqu'au 30 novembre !"
              value={p.bandeau.texte}
              onChange={(e) => maj("bandeau", { ...p.bandeau, texte: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-encre-2 text-sm font-semibold">
              Lien « En savoir plus » (facultatif, https://…)
            </span>
            <input
              className={cn(champ, "mt-1")}
              maxLength={300}
              inputMode="url"
              placeholder="https://www.radio-tripoint-officiel.fr/…"
              value={p.bandeau.lien}
              onChange={(e) => maj("bandeau", { ...p.bandeau, lien: e.target.value })}
            />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-carte border-trait rounded-2xl border p-5">
          <p className="surtitre">Aperçu du bandeau</p>
          {p.bandeau.actif && p.bandeau.texte.trim() ? (
            <p className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#f9b800] px-3 py-2 text-center text-sm font-bold text-black">
              <Info className="size-4 flex-none" aria-hidden />
              <span>
                {p.bandeau.texte}
                {p.bandeau.lien && <span className="underline"> En savoir plus</span>}
              </span>
            </p>
          ) : (
            <p className="text-encre-3 mt-2 text-sm">Pas de bandeau affiché.</p>
          )}
        </div>
        <div className="bg-carte border-trait rounded-2xl border p-5">
          <button
            type="button"
            onClick={enregistrer}
            disabled={enCours}
            className="bg-accent inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 font-extrabold text-black disabled:opacity-60"
          >
            {enCours ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Save className="size-4" aria-hidden />
            )}
            Enregistrer et appliquer
          </button>
          {retour && (
            <p
              role="status"
              className={cn("mt-3 text-sm font-semibold", retour.ok ? "text-bon" : "text-alerte")}
            >
              {retour.texte}
            </p>
          )}
          <p className="text-encre-3 mt-3 text-xs leading-snug">
            Les dépôts se ferment dans « Tarifs &amp; réglages ». Chaque changement est noté au
            journal.
          </p>
        </div>
      </div>
    </div>
  )
}
