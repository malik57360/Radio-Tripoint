"use client"

import Link from "@/components/ui/Lien"
import { Flag, Loader2, Send } from "lucide-react"
import { useActionState, useState, useTransition } from "react"
import {
  actionContacter,
  actionOptions,
  actionPayer,
  actionRetirer,
  actionSignaler,
} from "@/app/petites-annonces/actions"
import { euros, type Offre } from "@/lib/annonces/offres"
import { cn } from "@/lib/utils/cn"

/** Contact de l'annonceur, signalement, et boutons de « Mes annonces ». */

type Etat = { erreur?: string; ok?: string } | null

function Retour({ etat }: { etat: Etat }) {
  if (!etat) return null
  return (
    <p
      role={etat.erreur ? "alert" : "status"}
      className={cn(
        "rounded-lg p-3 text-sm font-semibold",
        etat.erreur ? "bg-erreur-fond text-alerte" : "bg-papier-2",
      )}
    >
      {etat.erreur ?? etat.ok}
    </p>
  )
}

export function FormulaireContact({
  annonce,
  connecte,
  verifie,
  chemin,
}: {
  annonce: string
  connecte: boolean
  verifie: boolean
  chemin: string
}) {
  const [etat, action, enCours] = useActionState(actionContacter, null)
  if (etat?.ok) return <Retour etat={etat} />
  if (connecte && !verifie)
    return (
      <p className="text-encre-2 text-[0.9rem] leading-snug">
        Confirmez d&apos;abord votre adresse e-mail (lien reçu à l&apos;inscription), puis revenez
        écrire à l&apos;annonceur.{" "}
        <Link href="/mon-espace" className="font-semibold underline">
          Mon espace
        </Link>
      </p>
    )
  if (!connecte)
    return (
      <div className="space-y-3">
        <p className="text-encre-2 text-[0.9rem] leading-snug">
          Pour écrire à l&apos;annonceur, connectez-vous : c&apos;est gratuit, et ça tient les
          arnaqueurs à distance.
        </p>
        <Link
          href={`/connexion?suite=${encodeURIComponent(chemin)}`}
          className="btn btn-plein w-full"
        >
          Se connecter pour écrire
        </Link>
        <Link href="/inscription" className="btn btn-trait w-full">
          Créer un compte
        </Link>
      </div>
    )
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="annonce" value={annonce} />
      <input
        type="text"
        name="site_web"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <label htmlFor="contact-message" className="etiquette">
        Votre message
      </label>
      <textarea
        id="contact-message"
        name="message"
        rows={5}
        required
        minLength={10}
        maxLength={2000}
        className="champ"
        placeholder="Bonjour, votre annonce m'intéresse. Est-elle toujours disponible ?"
      />
      <p className="text-encre-3 text-xs leading-snug">
        Votre message lui est transmis par e-mail avec votre adresse, pour qu&apos;il puisse vous
        répondre. La sienne reste privée.
      </p>
      <Retour etat={etat} />
      <button type="submit" disabled={enCours} className="btn btn-plein w-full">
        {enCours ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Send className="size-4" aria-hidden />
        )}
        Envoyer
      </button>
    </form>
  )
}

const MOTIFS = [
  ["arnaque", "Arnaque ou tentative de fraude"],
  ["interdit", "Produit ou service interdit"],
  ["illicite", "Contenu illicite ou choquant"],
  ["discrimination", "Discrimination (emploi, logement…)"],
  ["trompeuse", "Annonce trompeuse ou fausse"],
  ["doublon", "Doublon ou spam"],
  ["autre", "Autre raison"],
] as const

export function Signalement({ annonce, connecte }: { annonce: string; connecte: boolean }) {
  const [ouvert, setOuvert] = useState(false)
  const [etat, action, enCours] = useActionState(actionSignaler, null)
  if (!ouvert)
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="text-encre-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-2"
      >
        <Flag className="size-4" aria-hidden />
        Signaler cette annonce
      </button>
    )
  if (etat?.ok) return <Retour etat={etat} />
  return (
    <form action={action} className="border-trait space-y-3 rounded-lg border p-4">
      <p className="font-extrabold">Signaler cette annonce</p>
      <input type="hidden" name="annonce" value={annonce} />
      <input
        type="text"
        name="site_web"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div>
        <label htmlFor="sig-motif" className="etiquette">
          Motif
        </label>
        <select id="sig-motif" name="motif" required className="champ" defaultValue="">
          <option value="" disabled>
            Choisir…
          </option>
          {MOTIFS.map(([v, t]) => (
            <option key={v} value={v}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="sig-explication" className="etiquette">
          Ce qui ne va pas
        </label>
        <textarea
          id="sig-explication"
          name="explication"
          rows={3}
          required
          minLength={10}
          maxLength={1000}
          className="champ"
        />
      </div>
      {!connecte && (
        <div>
          <label htmlFor="sig-email" className="etiquette">
            Votre e-mail{" "}
            <span className="text-encre-3 font-normal">
              (facultatif, pour vous tenir au courant)
            </span>
          </label>
          <input id="sig-email" name="email" type="email" maxLength={200} className="champ" />
        </div>
      )}
      <label className="flex gap-3 text-[0.85rem] leading-snug">
        <input
          type="checkbox"
          name="bonne_foi"
          required
          className="accent-accent mt-0.5 size-4 flex-none"
        />
        <span>
          Je signale de bonne foi : les informations données sont exactes à ma connaissance.
        </span>
      </label>
      <Retour etat={etat} />
      <button type="submit" disabled={enCours} className="btn btn-plein">
        {enCours && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Envoyer le signalement
      </button>
    </form>
  )
}

/** Boutons d'une annonce dans « Mes annonces ». */
export function ActionsMonAnnonce({
  id,
  statut,
  modifiable,
  options,
  particulier,
}: {
  id: string
  statut: string
  modifiable: boolean
  options: Pick<Offre, "code" | "nom" | "description" | "prixCentimes" | "effet">[]
  particulier: boolean
}) {
  const [enCours, demarrer] = useTransition()
  const [erreur, setErreur] = useState<string | null>(null)
  const [choix, setChoix] = useState<string[]>([])
  const [execution, setExecution] = useState(false)
  const [confirmer, setConfirmer] = useState(false)
  const [ouvrirOptions, setOuvrirOptions] = useState(false)

  const lancer = (f: () => Promise<{ ok: true; url: string } | { ok: false; erreur: string }>) =>
    demarrer(async () => {
      setErreur(null)
      const r = await f()
      if (!r.ok) return setErreur(r.erreur)
      window.location.assign(r.url)
    })

  const aPayer = options
    .filter((o) => choix.includes(o.code))
    .reduce((n, o) => n + o.prixCentimes, 0)

  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap gap-2">
        {statut === "attente_paiement" && (
          <button
            type="button"
            disabled={enCours}
            onClick={() => lancer(() => actionPayer(id))}
            className="btn btn-accent min-h-10 text-sm"
          >
            Régler maintenant
          </button>
        )}
        {modifiable && (
          <Link href={`/deposer?modifier=${id}`} className="btn btn-trait min-h-10 text-sm">
            Modifier
          </Link>
        )}
        {options.length > 0 && (
          <button
            type="button"
            onClick={() => setOuvrirOptions((v) => !v)}
            aria-expanded={ouvrirOptions}
            className="btn btn-trait min-h-10 text-sm"
          >
            {statut === "expiree" ? "Remettre en ligne" : "Booster"}
          </button>
        )}
        {!["retiree", "refusee"].includes(statut) &&
          (confirmer ? (
            <button
              type="button"
              disabled={enCours}
              onClick={() => lancer(() => actionRetirer(id))}
              className="btn btn-plein min-h-10 text-sm"
            >
              Confirmer le retrait
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmer(true)}
              className="btn btn-trait min-h-10 text-sm"
            >
              Retirer
            </button>
          ))}
      </div>
      {ouvrirOptions && (
        <div className="border-trait space-y-2 rounded-lg border p-3">
          {options.map((o) => {
            const coche = choix.includes(o.code)
            return (
              <label key={o.code} className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={coche}
                  onChange={() =>
                    setChoix((c) => (coche ? c.filter((x) => x !== o.code) : [...c, o.code]))
                  }
                  className="accent-accent mt-1 size-4 flex-none"
                />
                <span className="min-w-0 flex-1 text-sm">
                  <span className="flex justify-between gap-3 font-bold">
                    <span>{o.nom}</span>
                    <span className="flex-none">{euros(o.prixCentimes)}</span>
                  </span>
                  <span className="text-encre-2 block text-[0.8rem] leading-snug">
                    {o.description}
                  </span>
                </span>
              </label>
            )
          })}
          {aPayer > 0 && particulier && (
            <label className="flex gap-3 pt-1 text-[0.8rem] leading-snug">
              <input
                type="checkbox"
                checked={execution}
                onChange={(e) => setExecution(e.target.checked)}
                className="accent-accent mt-0.5 size-4 flex-none"
              />
              <span>
                Je demande l&apos;exécution immédiate. Pour une remontée, exécutée aussitôt, je
                perds mon droit de rétractation ; pour les autres options, je paierai la part déjà
                fournie si je me rétracte.
              </span>
            </label>
          )}
          <button
            type="button"
            disabled={enCours || !choix.length}
            onClick={() => lancer(() => actionOptions(id, choix, execution))}
            className="btn btn-plein min-h-10 text-sm"
          >
            {enCours && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {aPayer > 0 ? `Payer ${euros(aPayer)}` : "Activer"}
          </button>
        </div>
      )}
      {erreur && (
        <p role="alert" className="text-alerte text-sm font-semibold">
          {erreur}
        </p>
      )}
    </div>
  )
}
