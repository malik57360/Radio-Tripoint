"use client"

import { Check, ChevronDown, Loader2, Mail, Send, Sparkles, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  actionEcarterPrepare,
  actionEnvoyerPrepare,
} from "@/app/direction/(espace)/prospection/actions"
import { cn } from "@/lib/utils/cn"

export interface MailPrepareVue {
  id: string
  nom: string
  activite: string
  commune: string
  email: string
  verifie: boolean
  source: string
  objet: string
  texte: string
}

type Message = { email: string; objet: string; texte: string }

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms))
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/

/**
 * Les mails préparés à l'avance, chacun écrit pour son entreprise : on relit,
 * on corrige au besoin, on envoie depuis info@. Les adresses vérifiées sont
 * cochées d'office ; une adresse vide (au nom d'une personne) se saisit ici.
 */
export function MailsPrepares({ mails }: { mails: MailPrepareVue[] }) {
  const router = useRouter()
  const [modifs, setModifs] = useState<Record<string, Message>>({})
  const message = (m: MailPrepareVue): Message =>
    modifs[m.id] ?? { email: m.email, objet: m.objet, texte: m.texte }
  const [choix, setChoix] = useState<Record<string, boolean>>({})
  const coche = (m: MailPrepareVue) => choix[m.id] ?? (m.verifie && EMAIL.test(m.email))
  const [etats, setEtats] = useState<Record<string, "ok" | "ecarte" | string>>({})
  const [envoi, setEnvoi] = useState<{ fait: number; total: number } | null>(null)

  const restants = mails.filter((m) => etats[m.id] !== "ok" && etats[m.id] !== "ecarte")
  const choisis = restants.filter((m) => coche(m))
  const nbOk = Object.values(etats).filter((v) => v === "ok").length

  const toutEnvoyer = async () => {
    const lot = choisis.filter((m) => EMAIL.test(message(m).email.trim()))
    const sansAdresse = choisis.length - lot.length
    if (!lot.length) return
    const avertir = sansAdresse ? ` (${sansAdresse} sans adresse valable resteront de côté)` : ""
    if (
      !window.confirm(
        `Envoyer ${lot.length} mail${lot.length > 1 ? "s" : ""} depuis info@${avertir} ?`,
      )
    )
      return
    setEnvoi({ fait: 0, total: lot.length })
    for (const [k, m] of lot.entries()) {
      const msg = message(m)
      const r = await actionEnvoyerPrepare(m.id, msg.email.trim(), msg.objet, msg.texte).catch(
        () => null,
      )
      setEtats((e) => ({ ...e, [m.id]: r?.ok ? "ok" : (r?.erreur ?? "Envoi impossible.") }))
      setEnvoi({ fait: k + 1, total: lot.length })
      // Un mail toutes les ~2 s : la boîte info@ reste loin des seuils anti-spam.
      if (k < lot.length - 1) await pause(1800)
    }
    setEnvoi(null)
    router.refresh()
  }

  const ecarter = async (m: MailPrepareVue) => {
    const r = await actionEcarterPrepare(m.id).catch(() => null)
    setEtats((e) => ({ ...e, [m.id]: r?.ok ? "ecarte" : (r?.erreur ?? "Impossible.") }))
  }

  return (
    <section aria-labelledby="t-prepares" className="space-y-3">
      <div className="border-trait bg-carte rounded-2xl border bg-[radial-gradient(120%_120%_at_100%_0%,rgb(249_184_0/0.10),transparent_55%)] p-4 sm:p-5">
        <p className="surtitre flex items-center gap-2">
          <Sparkles className="text-accent size-4" aria-hidden /> Préparés pour vous
        </p>
        <h2 id="t-prepares" className="chiffre mt-1 text-[2.2rem] leading-none">
          {restants.length} mail{restants.length > 1 ? "s" : ""} à relire
        </h2>
        <p className="text-encre-2 mt-2 text-sm">
          Chaque message est écrit pour son entreprise, à partir de sa fiche publique. Relisez,
          corrigez si besoin, puis envoyez : ils partent de info@.
        </p>
      </div>

      <ul className="space-y-2">
        {mails.map((m) => (
          <CartePrepare
            key={m.id}
            m={m}
            message={message(m)}
            onModifier={(msg) => setModifs((x) => ({ ...x, [m.id]: msg }))}
            coche={coche(m)}
            onCocher={() => setChoix((x) => ({ ...x, [m.id]: !coche(m) }))}
            onEcarter={() => ecarter(m)}
            etat={etats[m.id]}
            verrouille={envoi !== null}
          />
        ))}
      </ul>

      {/* Le bouton reste sous le pouce, au-dessus de la barre d'onglets. */}
      <div className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-10 lg:bottom-4">
        <button
          type="button"
          onClick={toutEnvoyer}
          disabled={!choisis.length || envoi !== null}
          className={cn(
            "flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl px-5 text-base font-extrabold shadow-[0_10px_30px_rgb(0_0_0/0.55)]",
            choisis.length || envoi
              ? "bg-accent text-black"
              : nbOk
                ? "border-bon/40 bg-carte-2 text-bon border"
                : "border-trait bg-carte-2 text-encre-3 border",
          )}
        >
          {envoi ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden />
              Envoi {envoi.fait} / {envoi.total}…
            </>
          ) : choisis.length ? (
            <>
              <Send className="size-5" aria-hidden />
              {choisis.length === 1 ? "Envoyer le mail" : `Envoyer les ${choisis.length} mails`}
            </>
          ) : nbOk ? (
            <>
              <Check className="size-5" aria-hidden />
              {nbOk} mail{nbOk > 1 ? "s" : ""} envoyé{nbOk > 1 ? "s" : ""}
            </>
          ) : (
            "Cochez au moins un mail"
          )}
        </button>
      </div>
    </section>
  )
}

function CartePrepare({
  m,
  message,
  onModifier,
  coche,
  onCocher,
  onEcarter,
  etat,
  verrouille,
}: {
  m: MailPrepareVue
  message: Message
  onModifier: (m: Message) => void
  coche: boolean
  onCocher: () => void
  onEcarter: () => void
  etat?: "ok" | "ecarte" | string
  verrouille: boolean
}) {
  const [ouvert, setOuvert] = useState(false)
  const envoye = etat === "ok"
  const ecarte = etat === "ecarte"
  const adresseValable = EMAIL.test(message.email.trim())
  if (ecarte)
    return (
      <li className="border-trait text-encre-3 rounded-2xl border border-dashed px-4 py-3 text-sm">
        {m.nom} : écarté, il ne sera pas envoyé.
      </li>
    )
  return (
    <li
      className={cn(
        "bg-carte rounded-2xl border transition-colors",
        envoye ? "border-bon/40" : coche ? "border-accent/45" : "border-trait",
      )}
    >
      <div className="flex items-start gap-3 p-4">
        {envoye ? (
          <span className="bg-bon/15 text-bon grid size-7 flex-none place-items-center rounded-full">
            <Check className="size-4" aria-hidden />
          </span>
        ) : (
          <input
            type="checkbox"
            checked={coche}
            onChange={onCocher}
            disabled={verrouille}
            aria-label={`Envoyer à ${m.nom}`}
            className="mt-0.5 size-6 flex-none accent-[var(--d-accent)]"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{m.nom}</p>
          <p className="text-encre-2 truncate text-sm">
            {m.activite} · {m.commune}
          </p>
          {envoye ? (
            <p className="text-bon mt-1 text-sm font-bold">Envoyé à {message.email}</p>
          ) : (
            <label className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm">
              <Mail className="text-encre-3 size-3.5 flex-none" aria-hidden />
              <input
                type="email"
                value={message.email}
                onChange={(e) => onModifier({ ...message, email: e.target.value })}
                disabled={verrouille}
                placeholder="Adresse à saisir"
                aria-label={`Adresse de ${m.nom}`}
                className={cn(
                  "bg-carte-2 focus:border-accent min-w-0 flex-1 rounded-lg border px-2 py-1 font-semibold outline-none",
                  adresseValable ? "border-trait" : "border-alerte/60",
                )}
              />
              {!m.verifie && adresseValable && (
                <span className="text-alerte flex-none text-[0.7rem] font-bold">à vérifier</span>
              )}
            </label>
          )}
          <p className="text-encre-3 mt-1 text-xs">Source : {m.source}</p>
          {!envoye && <p className="text-encre-2 mt-1 line-clamp-1 text-sm">{message.objet}</p>}
          {etat && !envoye && <p className="text-alerte mt-1 text-sm font-semibold">{etat}</p>}
        </div>
        {!envoye && (
          <button
            type="button"
            onClick={onEcarter}
            disabled={verrouille}
            aria-label={`Ne pas envoyer à ${m.nom}`}
            className="border-trait text-encre-3 grid size-9 flex-none place-items-center rounded-full border"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>
      {!envoye && (
        <>
          <button
            type="button"
            onClick={() => setOuvert((o) => !o)}
            aria-expanded={ouvert}
            className="border-trait text-encre-2 flex min-h-11 w-full items-center justify-center gap-1.5 border-t text-sm font-semibold"
          >
            {ouvert ? "Fermer le message" : "Lire ou modifier le message"}
            <ChevronDown
              className={cn("size-4 transition-transform", ouvert && "rotate-180")}
              aria-hidden
            />
          </button>
          {ouvert && (
            <div className="space-y-2 px-4 pb-4">
              <input
                value={message.objet}
                onChange={(e) => onModifier({ ...message, objet: e.target.value })}
                disabled={verrouille}
                aria-label="Objet"
                className="border-trait bg-carte-2 focus:border-accent w-full rounded-xl border px-3 py-2.5 text-sm font-semibold outline-none"
              />
              <textarea
                value={message.texte}
                onChange={(e) => onModifier({ ...message, texte: e.target.value })}
                disabled={verrouille}
                rows={14}
                aria-label="Message"
                className="border-trait bg-carte-2 focus:border-accent w-full rounded-xl border px-3 py-2.5 text-sm leading-relaxed outline-none"
              />
            </div>
          )}
        </>
      )}
    </li>
  )
}
