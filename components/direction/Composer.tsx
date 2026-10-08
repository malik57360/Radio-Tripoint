"use client"

import { Loader2, Send, Sparkles } from "lucide-react"
import { useState, useTransition } from "react"
import { actionEnvoyerNouveau, actionProposerMessage } from "@/app/direction/(espace)/mails/actions"
import { cn } from "@/lib/utils/cn"

export interface ProspectCible {
  siren: string
  nom: string
  activite: string
  commune: string
  dirigeant?: string
}

const champ =
  "border-trait bg-carte-2 text-encre focus:border-accent block w-full rounded-lg border px-3 py-2.5 text-[0.95rem] outline-none"

/**
 * Nouveau message depuis info@. L'IA peut rédiger à partir d'une consigne
 * (et de la fiche de l'entreprise en prospection) ; une personne relit et
 * envoie. Rien ne part sans clic.
 */
export function Composer({
  initial,
  prospect,
}: {
  initial: { a: string; objet: string }
  prospect?: ProspectCible
}) {
  const [a, setA] = useState(initial.a)
  const [objet, setObjet] = useState(initial.objet)
  const [texte, setTexte] = useState("")
  const [consigne, setConsigne] = useState(
    prospect ? "Présenter nos solutions de publicité locale et proposer un court rendez-vous." : "",
  )
  const [statut, setStatut] = useState<{ ok: boolean; message: string } | null>(null)
  const [action, setAction] = useState<"ia" | "envoyer" | null>(null)
  const [enCours, demarrer] = useTransition()

  const rediger = () => {
    setAction("ia")
    setStatut(null)
    demarrer(async () => {
      const r = await actionProposerMessage(
        consigne,
        prospect && {
          nom: prospect.nom,
          activite: prospect.activite,
          commune: prospect.commune,
          dirigeant: prospect.dirigeant,
        },
      )
      if (!r.ok) setStatut({ ok: false, message: r.erreur })
      else {
        if (r.objet) setObjet(r.objet)
        setTexte(r.texte ?? "")
        setStatut({ ok: true, message: "Proposition prête : relisez-la et corrigez si besoin." })
      }
      setAction(null)
    })
  }

  const manque = [
    !a.trim() && "l'adresse e-mail du destinataire (case « À », en haut)",
    !objet.trim() && "l'objet",
    !texte.trim() && "le message",
  ].filter((m): m is string => Boolean(m))

  const envoyer = () => {
    if (!window.confirm(`Envoyer ce message à ${a} ?`)) return
    setAction("envoyer")
    setStatut(null)
    demarrer(async () => {
      const r = await actionEnvoyerNouveau(
        a,
        objet,
        texte,
        prospect && {
          siren: prospect.siren,
          nom: prospect.nom,
          commune: prospect.commune,
          activite: prospect.activite,
        },
      )
      if (!r.ok) setStatut({ ok: false, message: r.erreur })
      else {
        setStatut({ ok: true, message: r.message ?? "Envoyé." })
        setTexte("")
      }
      setAction(null)
    })
  }

  return (
    <div className="border-trait bg-carte space-y-3 rounded-xl border p-4">
      <h2 className="text-lg font-extrabold">
        Nouveau message{prospect && <span className="text-accent"> · {prospect.nom}</span>}
      </h2>
      {prospect && (
        <p className="text-encre-3 text-xs">
          {prospect.activite} · {prospect.commune}
          {prospect.dirigeant && ` · ${prospect.dirigeant}`}
        </p>
      )}
      <label className="block">
        <span className="surtitre">À</span>
        <input
          type="email"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="adresse@entreprise.fr"
          className={cn(champ, "mt-1.5")}
        />
      </label>
      {prospect && !a && (
        <p className="text-alerte text-xs font-semibold">
          L&apos;annuaire officiel ne donne pas les e-mails : trouvez l&apos;adresse de
          l&apos;entreprise (site, Google, page Facebook) et collez-la ici.
        </p>
      )}
      <label className="block">
        <span className="surtitre">Objet</span>
        <input
          value={objet}
          onChange={(e) => setObjet(e.target.value)}
          className={cn(champ, "mt-1.5")}
        />
      </label>

      <div className="bg-carte-2 rounded-lg p-3">
        <label className="block">
          <span className="surtitre">Consigne pour l&apos;IA (facultatif)</span>
          <textarea
            value={consigne}
            onChange={(e) => setConsigne(e.target.value)}
            rows={2}
            placeholder="Ex. : remercier la mairie pour son accueil au salon du livre et proposer une interview."
            className={cn(champ, "mt-1.5 bg-[var(--d-carte)]")}
          />
        </label>
        <button
          type="button"
          onClick={rediger}
          disabled={enCours || !consigne.trim()}
          className="bg-accent mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
        >
          {enCours && action === "ia" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Sparkles className="size-4" aria-hidden />
          )}
          Rédiger avec l&apos;IA
        </button>
      </div>

      <label className="block">
        <span className="surtitre">Message</span>
        <textarea
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          rows={14}
          className={cn(champ, "mt-1.5 leading-relaxed")}
        />
      </label>

      {statut && (
        <p
          role="status"
          className={cn("text-sm font-semibold", statut.ok ? "text-bon" : "text-alerte")}
        >
          {statut.message}
        </p>
      )}
      {manque.length > 0 && !enCours && (
        <p className="text-alerte text-sm font-semibold">
          Pour envoyer, il manque : {manque.join(", ")}.
        </p>
      )}
      <button
        type="button"
        onClick={envoyer}
        disabled={enCours || manque.length > 0}
        className="bg-encre inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-black disabled:opacity-40"
      >
        {enCours && action === "envoyer" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Send className="size-4" aria-hidden />
        )}
        Envoyer depuis info@
      </button>
      <p className="text-encre-3 text-xs">
        Le message part de info@radio-tripoint-officiel.fr, avec la signature Radio Tripoint, et une
        copie est rangée dans « Envoyés ». L&apos;IA n&apos;invente ni prix ni chiffres
        d&apos;audience : relisez avant d&apos;envoyer.
      </p>
    </div>
  )
}
