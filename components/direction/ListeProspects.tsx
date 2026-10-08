"use client"

import {
  Check,
  ExternalLink,
  Globe,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Send,
  X,
} from "lucide-react"
import { useState } from "react"
import { actionEnvoyerNouveau, actionProposerMessage } from "@/app/direction/(espace)/mails/actions"
import { actionTrouverCoordonnees } from "@/app/direction/(espace)/prospection/actions"
import type { Coordonnees } from "@/lib/direction/coordonnees"
import { telephoneLisible } from "@/lib/direction/coordonnees-outils"
import { cn } from "@/lib/utils/cn"
import { SuiviProspect, type SuiviInitial } from "./SuiviProspect"

export interface FicheProspect {
  siren: string
  /** Raison sociale (annuaire officiel). */
  nom: string
  enseigne?: string | null
  activite: string
  commune: string
  effectif?: string
  adresse?: string
  dirigeant?: string | null
}

const CONSIGNE = "Présenter nos solutions de publicité locale et proposer un court rendez-vous."
/** Recherches menées en même temps quand on lance toute la page. */
const EN_PARALLELE = 3

const champ =
  "border-trait bg-carte-2 text-encre focus:border-accent block w-full rounded-lg border px-3 py-2 text-[0.95rem] outline-none"

/**
 * Les prospects d'une page : coordonnées trouvées par l'IA (une fois, puis
 * gardées), et l'envoi d'un mail en deux clics — « Envoyer un mail » ouvre
 * un mail déjà écrit, on relit, on envoie.
 */
export function ListeProspects({
  fiches,
  suivis,
  coordonnees,
  toutChercher = false,
}: {
  fiches: FicheProspect[]
  suivis: Record<string, SuiviInitial>
  coordonnees: Record<string, Coordonnees>
  toutChercher?: boolean
}) {
  const [coords, setCoords] = useState(coordonnees)
  const [enCours, setEnCours] = useState<Record<string, boolean>>({})
  const [erreurs, setErreurs] = useState<Record<string, string>>({})
  const [lot, setLot] = useState<{ fait: number; total: number } | null>(null)

  const chercher = async (f: FicheProspect) => {
    setEnCours((e) => ({ ...e, [f.siren]: true }))
    setErreurs((e) => Object.fromEntries(Object.entries(e).filter(([k]) => k !== f.siren)))
    const r = await actionTrouverCoordonnees({
      siren: f.siren,
      nom: f.nom,
      enseigne: f.enseigne,
      activite: f.activite,
      adresse: f.adresse,
      commune: f.commune,
    })
    if (r.ok) setCoords((c) => ({ ...c, [f.siren]: r.coordonnees }))
    else setErreurs((e) => ({ ...e, [f.siren]: r.erreur }))
    setEnCours((e) => ({ ...e, [f.siren]: false }))
  }

  const restantes = fiches.filter((f) => !coords[f.siren])
  const toutTrouver = async () => {
    const file = [...restantes]
    setLot({ fait: 0, total: file.length })
    const travailleur = async () => {
      for (let f = file.shift(); f; f = file.shift()) {
        await chercher(f)
        setLot((l) => l && { ...l, fait: l.fait + 1 })
      }
    }
    await Promise.all(Array.from({ length: EN_PARALLELE }, travailleur))
    setLot(null)
  }

  return (
    <div>
      {toutChercher && (restantes.length > 0 || lot) && (
        <div className="bg-accent-doux mb-3 flex flex-wrap items-center gap-3 rounded-xl p-3">
          <button
            type="button"
            onClick={toutTrouver}
            disabled={lot !== null}
            className="bg-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-black disabled:opacity-60"
          >
            {lot ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Search className="size-4" aria-hidden />
            )}
            {lot
              ? `Recherche en cours : ${lot.fait} / ${lot.total}`
              : `Trouver mails et téléphones (${restantes.length})`}
          </button>
          <p className="text-encre-2 text-xs">
            L&apos;IA cherche sur le web, puis chaque page source est relue. Une entreprise
            n&apos;est cherchée qu&apos;une fois.
          </p>
        </div>
      )}
      <ul className="divide-trait divide-y">
        {fiches.map((f) => (
          <CarteProspect
            key={f.siren}
            fiche={f}
            suivi={suivis[f.siren] ?? null}
            coords={coords[f.siren] ?? null}
            enRecherche={Boolean(enCours[f.siren])}
            erreur={erreurs[f.siren]}
            onChercher={() => chercher(f)}
          />
        ))}
      </ul>
    </div>
  )
}

function CarteProspect({
  fiche,
  suivi,
  coords,
  enRecherche,
  erreur,
  onChercher,
}: {
  fiche: FicheProspect
  suivi: SuiviInitial | null
  coords: Coordonnees | null
  enRecherche: boolean
  erreur?: string
  onChercher: () => void
}) {
  const nom = fiche.enseigne ?? fiche.nom
  const [statut, setStatut] = useState(suivi?.statut ?? "a_contacter")
  const [suiviCourant, setSuiviCourant] = useState(suivi)
  const [version, setVersion] = useState(0)
  const [panneau, setPanneau] = useState(false)
  const [envoye, setEnvoye] = useState<string | null>(null)
  const [brouillon, setBrouillon] = useState<{ objet: string; texte: string; n: number } | null>(
    null,
  )
  const [redaction, setRedaction] = useState(false)
  const [erreurRedaction, setErreurRedaction] = useState("")
  const email = coords?.email ?? suiviCourant?.email ?? ""
  const telephone = coords?.telephone ?? null
  const bloque = statut === "stop"

  // L'IA écrit le mail dès le clic sur « Envoyer un mail » (et à « Réécrire »).
  const rediger = async () => {
    setRedaction(true)
    setErreurRedaction("")
    const r = await actionProposerMessage(CONSIGNE, {
      nom,
      activite: fiche.activite,
      commune: fiche.commune,
      dirigeant: fiche.dirigeant ?? undefined,
    })
    if (!r.ok) setErreurRedaction(r.erreur)
    else
      setBrouillon((b) => ({
        objet: r.objet || `Radio Tripoint × ${nom}`,
        texte: r.texte ?? "",
        n: (b?.n ?? 0) + 1,
      }))
    setRedaction(false)
  }

  return (
    <li className="grid gap-3 py-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="min-w-0 space-y-2">
        <div>
          <p className="font-bold">
            {nom}
            {fiche.enseigne && fiche.enseigne !== fiche.nom && (
              <span className="text-encre-3 font-normal"> · {fiche.nom}</span>
            )}
          </p>
          <p className="text-encre-2 text-sm">
            {fiche.activite} · <span className="font-semibold">{fiche.commune}</span>
            {fiche.effectif && ` · ${fiche.effectif}`}
          </p>
        </div>

        <Contacts
          coords={coords}
          enRecherche={enRecherche}
          erreur={erreur}
          onChercher={onChercher}
        />

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setPanneau(true)
              setEnvoye(null)
              if (!brouillon) void rediger()
            }}
            disabled={panneau || bloque}
            className="bg-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
          >
            <Send className="size-4" aria-hidden /> Envoyer un mail
          </button>
          {telephone && (
            <a
              href={`tel:${telephone}`}
              className="border-trait hover:border-accent inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
            >
              <Phone className="size-4" aria-hidden /> Appeler
            </a>
          )}
          <a
            href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${fiche.siren}`}
            target="_blank"
            rel="noopener"
            className="text-encre-3 hover:text-encre inline-flex items-center gap-1 text-xs font-semibold"
          >
            Fiche officielle <ExternalLink className="size-3" aria-hidden />
          </a>
        </div>
        {bloque && (
          <p className="text-alerte text-xs font-semibold">
            Cette entreprise a demandé à ne plus être contactée.
          </p>
        )}
        {envoye && (
          <p role="status" className="text-bon inline-flex items-center gap-1.5 text-sm font-bold">
            <Check className="size-4" aria-hidden /> {envoye}
          </p>
        )}
        {panneau && (
          <PanneauMail
            key={brouillon?.n ?? 0}
            fiche={fiche}
            emailInitial={email}
            brouillon={brouillon}
            redaction={redaction}
            erreurRedaction={erreurRedaction}
            onReecrire={rediger}
            onFermer={() => setPanneau(false)}
            onEnvoye={(a, message) => {
              setPanneau(false)
              setEnvoye(message)
              setBrouillon(null)
              const s: SuiviInitial = {
                statut: !suiviCourant || statut === "a_contacter" ? "contacte" : statut,
                note: suiviCourant?.note ?? "",
                email: a,
                telephone: suiviCourant?.telephone ?? "",
                dernierEnvoi: Date.now(),
              }
              setSuiviCourant(s)
              setStatut(s.statut)
              setVersion((v) => v + 1)
            }}
          />
        )}
      </div>
      <SuiviProspect
        key={version}
        siren={fiche.siren}
        fiche={{ nom, commune: fiche.commune, activite: fiche.activite }}
        initial={suiviCourant}
        onStatut={setStatut}
      />
    </li>
  )
}

function Contacts({
  coords,
  enRecherche,
  erreur,
  onChercher,
}: {
  coords: Coordonnees | null
  enRecherche: boolean
  erreur?: string
  onChercher: () => void
}) {
  if (enRecherche)
    return (
      <p className="text-encre-2 inline-flex items-center gap-2 text-sm">
        <Loader2 className="size-4 animate-spin" aria-hidden /> Recherche du mail et du téléphone…
      </p>
    )
  if (!coords)
    return (
      <div className="space-y-1">
        <button
          type="button"
          onClick={onChercher}
          className="text-accent inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
        >
          <Search className="size-4" aria-hidden /> Trouver mail et téléphone
        </button>
        {erreur && <p className="text-alerte text-xs font-semibold">{erreur}</p>}
      </div>
    )
  const rien = !coords.email && !coords.telephone && !coords.site
  return (
    <div className="space-y-1">
      {rien ? (
        <p className="text-encre-3 text-sm">Pas de mail ni de téléphone publiés en ligne.</p>
      ) : (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
          {coords.email && (
            <Valeur icone={Mail} source={coords.sourceEmail}>
              <span className="font-semibold break-all">{coords.email}</span>
            </Valeur>
          )}
          {coords.telephone && (
            <Valeur icone={Phone} source={coords.sourceTelephone}>
              <a href={`tel:${coords.telephone}`} className="hover:text-accent font-semibold">
                {telephoneLisible(coords.telephone)}
              </a>
            </Valeur>
          )}
          {coords.site && (
            <a
              href={coords.site}
              target="_blank"
              rel="noopener"
              className="text-encre-2 hover:text-encre inline-flex items-center gap-1.5"
            >
              <Globe className="size-4" aria-hidden /> Site
            </a>
          )}
        </div>
      )}
      <p className="text-encre-3 flex flex-wrap items-center gap-x-3 text-xs">
        {!rien && !coords.verifie && (
          <span>Lu sur un réseau social ou un annuaire : à vérifier.</span>
        )}
        <button
          type="button"
          onClick={onChercher}
          className="hover:text-encre inline-flex items-center gap-1 font-semibold"
        >
          <RefreshCw className="size-3" aria-hidden /> Chercher à nouveau
        </button>
      </p>
      {erreur && <p className="text-alerte text-xs font-semibold">{erreur}</p>}
    </div>
  )
}

function Valeur({
  icone: Icone,
  source,
  children,
}: {
  icone: typeof Mail
  source: string | null
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <Icone className="text-encre-3 size-4 flex-none" aria-hidden />
      {children}
      {source && (
        <a
          href={source}
          target="_blank"
          rel="noopener"
          className="text-encre-3 hover:text-encre text-xs"
          title={source}
        >
          (source)
        </a>
      )}
    </span>
  )
}

/** Le mail, déjà écrit par l'IA à l'ouverture : on relit, on corrige au besoin, on envoie. */
function PanneauMail({
  fiche,
  emailInitial,
  brouillon,
  redaction,
  erreurRedaction,
  onReecrire,
  onFermer,
  onEnvoye,
}: {
  fiche: FicheProspect
  emailInitial: string
  brouillon: { objet: string; texte: string } | null
  redaction: boolean
  erreurRedaction: string
  onReecrire: () => void
  onFermer: () => void
  onEnvoye: (a: string, message: string) => void
}) {
  const nom = fiche.enseigne ?? fiche.nom
  const [a, setA] = useState(emailInitial)
  const [objet, setObjet] = useState(brouillon?.objet ?? `Radio Tripoint × ${nom}`)
  const [texte, setTexte] = useState(brouillon?.texte ?? "")
  const [envoi, setEnvoi] = useState(false)
  const [erreurEnvoi, setErreurEnvoi] = useState("")
  const erreur = erreurEnvoi || erreurRedaction

  const envoyer = async () => {
    if (!window.confirm(`Envoyer ce mail à ${a.trim()} ?`)) return
    setEnvoi(true)
    setErreurEnvoi("")
    const r = await actionEnvoyerNouveau(a, objet, texte, {
      siren: fiche.siren,
      nom,
      commune: fiche.commune,
      activite: fiche.activite,
    })
    setEnvoi(false)
    if (!r.ok) setErreurEnvoi(r.erreur)
    else onEnvoye(a.trim(), r.message ?? "Mail envoyé.")
  }

  const pret = a.trim() && objet.trim() && texte.trim()
  return (
    <div className="border-accent bg-carte mt-2 space-y-3 rounded-xl border-2 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-extrabold">Mail à {nom}</p>
        <button
          type="button"
          onClick={onFermer}
          aria-label="Fermer"
          className="text-encre-3 hover:text-encre rounded-full p-1"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      <label className="block">
        <span className="surtitre">À</span>
        <input
          type="email"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="adresse@entreprise.fr"
          className={cn(champ, "mt-1")}
        />
      </label>
      {!a.trim() && (
        <p className="text-alerte text-xs font-semibold">
          Pas d&apos;e-mail trouvé : collez l&apos;adresse si vous la connaissez.
        </p>
      )}
      <label className="block">
        <span className="surtitre">Objet</span>
        <input
          value={objet}
          onChange={(e) => setObjet(e.target.value)}
          className={cn(champ, "mt-1")}
        />
      </label>
      <label className="block">
        <span className="surtitre">Message</span>
        {redaction ? (
          <span className="text-encre-2 mt-1 flex items-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" aria-hidden /> L&apos;IA écrit le mail…
          </span>
        ) : (
          <textarea
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            rows={12}
            className={cn(champ, "mt-1 leading-relaxed")}
          />
        )}
      </label>
      {erreur && <p className="text-alerte text-sm font-semibold">{erreur}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={envoyer}
          disabled={!pret || envoi || redaction}
          className="bg-encre inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-black disabled:opacity-40"
        >
          {envoi ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4" aria-hidden />
          )}
          Envoyer
        </button>
        <button
          type="button"
          onClick={onReecrire}
          disabled={envoi || redaction}
          className="border-trait hover:border-encre inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold disabled:opacity-40"
        >
          <RefreshCw className="size-4" aria-hidden /> Réécrire
        </button>
      </div>
      <p className="text-encre-3 text-xs">
        Part de info@ avec la signature Radio Tripoint ; la fiche passe en « Contacté ». Relisez
        avant d&apos;envoyer.
      </p>
    </div>
  )
}
