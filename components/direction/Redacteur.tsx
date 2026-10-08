"use client"

import { Loader2, Save, Send, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import {
  actionBrouillon,
  actionEnvoyer,
  actionProposer,
} from "@/app/direction/(espace)/mails/actions"
import { cn } from "@/lib/utils/cn"

/**
 * Réponse à un e-mail : l'IA propose un texte, une personne le relit et
 * choisit d'envoyer ou de garder en brouillon. Rien ne part tout seul.
 */
export function Redacteur({ uid, destinataire }: { uid: number; destinataire: string }) {
  const router = useRouter()
  const [texte, setTexte] = useState("")
  const [statut, setStatut] = useState<{ ok: boolean; message: string } | null>(null)
  const [action, setAction] = useState<"proposer" | "envoyer" | "brouillon" | null>(null)
  const [enCours, demarrer] = useTransition()

  const lancer = (quoi: "proposer" | "envoyer" | "brouillon") => {
    if (quoi === "envoyer" && !window.confirm(`Envoyer cette réponse à ${destinataire} ?`)) return
    setAction(quoi)
    setStatut(null)
    demarrer(async () => {
      const r =
        quoi === "proposer"
          ? await actionProposer(uid)
          : quoi === "envoyer"
            ? await actionEnvoyer(uid, texte)
            : await actionBrouillon(uid, texte)
      if (!r.ok) setStatut({ ok: false, message: r.erreur })
      else if (quoi === "proposer" && r.texte) {
        setTexte(r.texte)
        setStatut({ ok: true, message: "Proposition prête : relisez-la et corrigez si besoin." })
      } else {
        setStatut({ ok: true, message: r.message ?? "C'est fait." })
        if (quoi === "envoyer") {
          setTexte("")
          router.refresh()
        }
      }
      setAction(null)
    })
  }

  const icone = (quoi: typeof action, Icone: typeof Send) =>
    enCours && action === quoi ? (
      <Loader2 className="size-4 animate-spin" aria-hidden />
    ) : (
      <Icone className="size-4" aria-hidden />
    )

  return (
    <div className="border-trait bg-carte rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="surtitre">Réponse · signée « L&apos;équipe Radio Tripoint »</h3>
        <button
          type="button"
          onClick={() => lancer("proposer")}
          disabled={enCours}
          className="bg-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-black disabled:opacity-60"
        >
          {icone("proposer", Sparkles)}
          {texte ? "Nouvelle proposition" : "Proposer une réponse"}
        </button>
      </div>
      <label className="sr-only" htmlFor={`reponse-${uid}`}>
        Texte de la réponse
      </label>
      <textarea
        id={`reponse-${uid}`}
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        rows={12}
        placeholder="Cliquez sur « Proposer une réponse » : l'IA écrit un brouillon que vous pourrez modifier ici. Vous pouvez aussi écrire vous-même."
        className="border-trait bg-carte-2 text-encre focus:border-accent mt-3 block w-full rounded-lg border p-3 text-[0.95rem] leading-relaxed outline-none"
      />
      {statut && (
        <p
          role="status"
          className={cn("mt-2 text-sm font-semibold", statut.ok ? "text-bon" : "text-alerte")}
        >
          {statut.message}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => lancer("envoyer")}
          disabled={enCours || !texte.trim()}
          className="bg-encre inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-black disabled:opacity-40"
        >
          {icone("envoyer", Send)} Envoyer
        </button>
        <button
          type="button"
          onClick={() => lancer("brouillon")}
          disabled={enCours || !texte.trim()}
          className="border-trait hover:border-encre inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold disabled:opacity-40"
        >
          {icone("brouillon", Save)} Garder en brouillon
        </button>
      </div>
      <p className="text-encre-3 mt-3 text-xs">
        Le message reçu est transmis à l&apos;IA (Anthropic) uniquement quand vous cliquez sur «
        Proposer ». Rien n&apos;est envoyé sans votre clic sur « Envoyer ». La signature Radio
        Tripoint (logo, e-mail, site, Instagram, Facebook) s&apos;ajoute toute seule à l&apos;envoi.
      </p>
    </div>
  )
}
