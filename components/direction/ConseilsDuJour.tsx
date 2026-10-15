"use client"

import {
  Check,
  ChevronDown,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  Search,
  Send,
  Sparkles,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  actionChercherConseil,
  actionEnvoyerConseil,
  actionPreparer,
} from "@/app/direction/(espace)/prospection/actions"
import { telephoneLisible } from "@/lib/direction/coordonnees-outils"
import { cn } from "@/lib/utils/cn"

export interface ConseilVue {
  siren: string
  rang: number
  nom: string
  enseigne: string | null
  activite: string
  commune: string
  raison: string
  email: string | null
  telephone: string | null
  /** Adresse lue sur le site de l'entreprise (sinon : réseau social ou annuaire, à vérifier). */
  verifie: boolean
  /** Le mail a déjà été cherché. */
  cherche: boolean
  brouillon: { objet: string; texte: string } | null
  /** Déjà contactée (ou à ne plus contacter). */
  traitee: boolean
}

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms))
const nomDe = (c: ConseilVue) => c.enseigne ?? c.nom

/**
 * Les conseils du jour : les mails prêts en tête, avec « Envoyer tout »
 * (adresses vérifiées cochées d'office), puis les entreprises sans mail
 * (à appeler) et les autres conseils, à découvrir d'un toucher.
 */
export function ConseilsDuJour({
  conseils,
  aPreparer,
}: {
  conseils: ConseilVue[]
  aPreparer: boolean
}) {
  const router = useRouter()
  const prets = conseils.filter((c) => !c.traitee && c.email && c.brouillon)
  const enEcriture = conseils.filter((c) => !c.traitee && c.email && !c.brouillon)
  const sansMail = conseils.filter((c) => !c.traitee && c.cherche && !c.email)
  const aDecouvrir = conseils.filter((c) => !c.traitee && !c.cherche)
  const traitees = conseils.filter((c) => c.traitee)

  /* Préparation : continue celle du matin si elle n'est pas finie. */
  const [preparation, setPreparation] = useState<"en-cours" | "finie" | "erreur">(
    aPreparer ? "en-cours" : "finie",
  )
  const lancee = useRef(false)
  useEffect(() => {
    if (!aPreparer || lancee.current) return
    lancee.current = true
    ;(async () => {
      for (let n = 0; n < 40; n++) {
        const r = await actionPreparer().catch(() => null)
        router.refresh()
        if (!r || !r.ok) return setPreparation("erreur")
        if (!r.reste) return setPreparation("finie")
        await pause(400)
      }
      setPreparation("finie")
    })()
  }, [aPreparer, router])

  /* Envoi : cases cochées (adresses vérifiées par défaut), messages modifiables. */
  // Choix de Giorgio ; sans choix, seules les adresses vérifiées sont cochées.
  const [choix, setChoix] = useState<Record<string, boolean>>({})
  const coche = (c: ConseilVue) => choix[c.siren] ?? c.verifie
  const [modifs, setModifs] = useState<Record<string, { objet: string; texte: string }>>({})
  const [envoyes, setEnvoyes] = useState<Record<string, "ok" | string>>({})
  const [envoi, setEnvoi] = useState<{ fait: number; total: number } | null>(null)
  const choisis = prets.filter((c) => coche(c) && envoyes[c.siren] !== "ok")
  const basculer = (c: ConseilVue) => setChoix((x) => ({ ...x, [c.siren]: !coche(c) }))

  const toutEnvoyer = async () => {
    const lot = [...choisis]
    if (!lot.length) return
    if (
      !window.confirm(
        `Envoyer ${lot.length} mail${lot.length > 1 ? "s" : ""} depuis info@ ? Chaque entreprise passera en « Contacté ».`,
      )
    )
      return
    setEnvoi({ fait: 0, total: lot.length })
    for (const [k, c] of lot.entries()) {
      const m = modifs[c.siren] ?? c.brouillon!
      const r = await actionEnvoyerConseil(c.siren, m.objet, m.texte).catch(() => null)
      setEnvoyes((e) => ({ ...e, [c.siren]: r?.ok ? "ok" : (r?.erreur ?? "Envoi impossible.") }))
      setEnvoi({ fait: k + 1, total: lot.length })
      // Un mail toutes les ~2 s : la boîte info@ reste loin des seuils anti-spam.
      if (k < lot.length - 1) await pause(1800)
    }
    setEnvoi(null)
    router.refresh()
  }

  const nbOk = Object.values(envoyes).filter((v) => v === "ok").length

  return (
    <div className="space-y-6">
      {/* En-tête du jour */}
      <section className="border-trait bg-carte rounded-2xl border bg-[radial-gradient(120%_120%_at_100%_0%,rgb(249_184_0/0.10),transparent_55%)] p-4 sm:p-5">
        <p className="surtitre flex items-center gap-2">
          <Sparkles className="text-accent size-4" aria-hidden /> Conseillées aujourd&apos;hui
        </p>
        <p className="chiffre mt-1 text-[2.6rem] leading-none">{conseils.length} entreprises</p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["Prêts à envoyer", prets.filter((c) => envoyes[c.siren] !== "ok").length],
            ["Sans mail", sansMail.length],
            ["À découvrir", aDecouvrir.length],
          ].map(([t, n]) => (
            <div key={t} className="bg-carte-2 rounded-xl px-2 py-2.5">
              <dd className="chiffre text-2xl leading-none">{n}</dd>
              <dt className="text-encre-3 mt-1 text-[0.7rem] leading-tight font-semibold">{t}</dt>
            </div>
          ))}
        </dl>
        {preparation === "en-cours" && (
          <p
            role="status"
            className="text-encre-2 mt-4 flex items-center gap-2 text-sm font-semibold"
          >
            <Loader2 className="text-accent size-4 animate-spin" aria-hidden />
            L&apos;IA cherche les adresses et écrit les mails… ils apparaissent au fur et à mesure.
          </p>
        )}
        {preparation === "erreur" && (
          <p role="status" className="text-alerte mt-4 text-sm font-semibold">
            Préparation interrompue : elle reprendra à la prochaine ouverture de la page.
          </p>
        )}
      </section>

      {/* Prêts à envoyer */}
      <section aria-labelledby="t-prets" className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="t-prets" className="titre-page text-[1.35rem]">
            Prêts à envoyer
          </h2>
          {enEcriture.length > 0 && (
            <span className="text-encre-3 text-xs">
              {enEcriture.length} en cours d&apos;écriture
            </span>
          )}
        </div>
        {prets.length === 0 ? (
          <p className="border-trait text-encre-3 rounded-2xl border border-dashed p-4 text-sm">
            {preparation === "en-cours"
              ? "Les premiers mails arrivent dans une minute."
              : "Aucun mail prêt pour l'instant. Touchez « Chercher le mail » sur une entreprise à découvrir."}
          </p>
        ) : (
          <>
            <ul className="space-y-2">
              {prets.map((c) => (
                <CartePret
                  key={c.siren}
                  c={c}
                  coche={coche(c)}
                  onCocher={() => basculer(c)}
                  message={modifs[c.siren] ?? c.brouillon!}
                  onModifier={(m) => setModifs((x) => ({ ...x, [c.siren]: m }))}
                  etat={envoyes[c.siren]}
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
                    {choisis.length === 1
                      ? "Envoyer le mail"
                      : `Envoyer les ${choisis.length} mails`}
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
          </>
        )}
      </section>

      {sansMail.length > 0 && (
        <section aria-labelledby="t-sans" className="space-y-3">
          <h2 id="t-sans" className="titre-page text-[1.35rem]">
            Sans mail : à appeler
          </h2>
          <ul className="border-trait bg-carte divide-trait divide-y overflow-hidden rounded-2xl border">
            {sansMail.map((c) => (
              <li key={c.siren} className="flex items-center gap-3 px-4 py-3">
                <Entreprise c={c} />
                {c.telephone ? (
                  <a
                    href={`tel:${c.telephone}`}
                    aria-label={`Appeler ${nomDe(c)} au ${telephoneLisible(c.telephone)}`}
                    className="border-trait text-accent grid size-11 flex-none place-items-center rounded-full border"
                  >
                    <Phone className="size-4.5" aria-hidden />
                  </a>
                ) : (
                  <FicheOfficielle siren={c.siren} />
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {aDecouvrir.length > 0 && (
        <section aria-labelledby="t-decouvrir" className="space-y-3">
          <div>
            <h2 id="t-decouvrir" className="titre-page text-[1.35rem]">
              À découvrir
            </h2>
            <p className="text-encre-3 mt-1 text-xs">
              Le mail n&apos;a pas encore été cherché. Un toucher : l&apos;IA le cherche et écrit le
              message.
            </p>
          </div>
          <ul className="border-trait bg-carte divide-trait divide-y overflow-hidden rounded-2xl border">
            {aDecouvrir.map((c) => (
              <LigneADecouvrir key={c.siren} c={c} />
            ))}
          </ul>
        </section>
      )}

      {traitees.length > 0 && (
        <p className="text-encre-3 text-sm">
          {traitees.length} entreprise{traitees.length > 1 ? "s" : ""} du jour déjà contactée
          {traitees.length > 1 ? "s" : ""} : elles sont dans « Mon suivi ».
        </p>
      )}
    </div>
  )
}

function Entreprise({ c, detail = true }: { c: ConseilVue; detail?: boolean }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate font-bold">{nomDe(c)}</p>
      <p className="text-encre-2 truncate text-sm">
        {c.activite} · {c.commune}
      </p>
      {detail && c.raison && <p className="text-encre-3 mt-0.5 line-clamp-2 text-xs">{c.raison}</p>}
    </div>
  )
}

function FicheOfficielle({ siren }: { siren: string }) {
  return (
    <a
      href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${siren}`}
      target="_blank"
      rel="noopener"
      aria-label="Fiche officielle"
      className="border-trait text-encre-3 grid size-11 flex-none place-items-center rounded-full border"
    >
      <ExternalLink className="size-4" aria-hidden />
    </a>
  )
}

function CartePret({
  c,
  coche,
  onCocher,
  message,
  onModifier,
  etat,
  verrouille,
}: {
  c: ConseilVue
  coche: boolean
  onCocher: () => void
  message: { objet: string; texte: string }
  onModifier: (m: { objet: string; texte: string }) => void
  etat?: "ok" | string
  verrouille: boolean
}) {
  const [ouvert, setOuvert] = useState(false)
  const envoye = etat === "ok"
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
            aria-label={`Envoyer à ${nomDe(c)}`}
            className="mt-0.5 size-6 flex-none accent-[var(--d-accent)]"
          />
        )}
        <div className="min-w-0 flex-1">
          <Entreprise c={c} detail={false} />
          <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm">
            <Mail className="text-encre-3 size-3.5 flex-none" aria-hidden />
            <span className="truncate font-semibold">{c.email}</span>
            {!c.verifie && (
              <span className="text-alerte flex-none text-[0.7rem] font-bold">à vérifier</span>
            )}
          </p>
          <p className="text-encre-2 mt-1 line-clamp-1 text-sm">{message.objet}</p>
          {envoye && <p className="text-bon mt-1 text-sm font-bold">Envoyé</p>}
          {etat && !envoye && <p className="text-alerte mt-1 text-sm font-semibold">{etat}</p>}
        </div>
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
                rows={12}
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

function LigneADecouvrir({ c }: { c: ConseilVue }) {
  const router = useRouter()
  const [etat, setEtat] = useState<"" | "cherche" | "rien" | string>("")
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span className="text-encre-3 chiffre w-7 flex-none text-center text-lg">{c.rang}</span>
      <div className="min-w-0 flex-1">
        <Entreprise c={c} />
        {etat === "rien" && (
          <p className="text-encre-3 mt-1 text-xs font-semibold">Pas de mail publié en ligne.</p>
        )}
        {etat && etat !== "cherche" && etat !== "rien" && (
          <p className="text-alerte mt-1 text-xs font-semibold">{etat}</p>
        )}
      </div>
      <button
        type="button"
        disabled={etat === "cherche"}
        onClick={async () => {
          setEtat("cherche")
          const r = await actionChercherConseil(c.siren).catch(() => null)
          if (!r || !r.ok) return setEtat(r?.erreur ?? "Recherche impossible.")
          setEtat(r.trouve ? "" : "rien")
          router.refresh()
        }}
        aria-label={`Chercher le mail de ${nomDe(c)}`}
        className="border-trait text-accent grid size-11 flex-none place-items-center rounded-full border disabled:opacity-60"
      >
        {etat === "cherche" ? (
          <Loader2 className="size-4.5 animate-spin" aria-hidden />
        ) : (
          <Search className="size-4.5" aria-hidden />
        )}
      </button>
    </li>
  )
}
