"use client"

import {
  CalendarPlus,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  MailCheck,
  PartyPopper,
  PencilLine,
  Rocket,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import {
  actionConfirmerEmail,
  actionCorriger,
  actionDeconnecterCompte,
  actionEcrireCompte,
  actionLienMotDePasse,
  actionOffrir,
  actionSupprimerAnnonce,
  actionSupprimerCompteDirection,
  actionVendueDirection,
} from "@/app/direction/(espace)/annonces/actions"
import type { Cadeau } from "@/lib/annonces/annonces"
import { cn } from "@/lib/utils/cn"

/**
 * Les interventions directes des fiches du tableau de bord (annonce et
 * compte). Chaque bouton dit ce qu'il fait ; ce qui ne se défait pas
 * (suppression) demande de taper SUPPRIMER.
 */
type Resultat = { ok: true; message: string } | { ok: false; erreur: string }

const bouton =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full border border-trait px-4 text-sm font-bold disabled:opacity-50 hover:bg-carte-2"
const champ =
  "border-trait bg-carte-2 text-encre block w-full rounded-lg border px-2.5 py-2 text-sm outline-none focus:border-accent"

function useAction() {
  const router = useRouter()
  const [enCours, demarrer] = useTransition()
  const [retour, setRetour] = useState<{ ok: boolean; texte: string } | null>(null)
  const lancer = (action: () => Promise<Resultat>, apres?: () => void) =>
    demarrer(async () => {
      setRetour(null)
      const r = await action()
      setRetour(r.ok ? { ok: true, texte: r.message } : { ok: false, texte: r.erreur })
      if (r.ok) {
        if (apres) apres()
        else router.refresh()
      }
    })
  const message = retour && (
    <p
      role="status"
      className={cn("text-sm font-semibold", retour.ok ? "text-bon" : "text-alerte")}
    >
      {retour.texte}
    </p>
  )
  return { enCours, lancer, message, router }
}

function Suppression({
  libelle,
  explication,
  action,
}: {
  libelle: string
  explication: string
  action: (confirmation: string) => Promise<Resultat>
}) {
  const { enCours, lancer, message, router } = useAction()
  const [ouvert, setOuvert] = useState(false)
  const [mot, setMot] = useState("")
  return (
    <div className="border-alerte/40 rounded-2xl border p-4">
      {!ouvert ? (
        <button type="button" className={cn(bouton, "text-alerte")} onClick={() => setOuvert(true)}>
          <Trash2 className="size-4" aria-hidden />
          {libelle}
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm">{explication}</p>
          <label className="block text-sm font-semibold">
            Tapez SUPPRIMER pour confirmer
            <input
              className={cn(champ, "mt-1")}
              value={mot}
              onChange={(e) => setMot(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={enCours || mot.trim().toUpperCase() !== "SUPPRIMER"}
              className={cn(bouton, "border-alerte text-alerte")}
              onClick={() =>
                lancer(
                  () => action(mot),
                  () => router.push("/direction/annonces"),
                )
              }
            >
              {enCours ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Trash2 className="size-4" aria-hidden />
              )}
              Supprimer définitivement
            </button>
            <button type="button" className={bouton} onClick={() => setOuvert(false)}>
              Annuler
            </button>
          </div>
        </div>
      )}
      <div className="mt-2">{message}</div>
    </div>
  )
}

const CADEAUX: { cle: Cadeau; nom: string; jours: number | null }[] = [
  { cle: "prolongation", nom: "Prolonger la durée en ligne", jours: 30 },
  { cle: "remontee", nom: "Remonter en tête de liste", jours: null },
  { cle: "accueil", nom: "Mettre à la une de l'accueil", jours: 7 },
  { cle: "categorie", nom: "Mettre en avant dans sa catégorie", jours: 7 },
  { cle: "renforcee", nom: "Visibilité renforcée", jours: 7 },
]

export function ActionsFicheAnnonce({
  id,
  statut,
  valeurs,
  categories,
}: {
  id: string
  statut: string
  valeurs: { titre: string; description: string; prix: string; ville: string; categorie: string }
  categories: { slug: string; nom: string }[]
}) {
  const { enCours, lancer, message } = useAction()
  const [edition, setEdition] = useState(false)
  const [v, setV] = useState(valeurs)
  const [cadeau, setCadeau] = useState<Cadeau>("prolongation")
  const [jours, setJours] = useState(30)
  const def = CADEAUX.find((c) => c.cle === cadeau)!
  const enLigne = statut === "publiee" || statut === "expiree"

  return (
    <div className="space-y-4">
      <div className="bg-carte border-trait space-y-3 rounded-2xl border p-4">
        <p className="surtitre">Coup de pouce offert par la radio</p>
        {enLigne ? (
          <>
            <div className="grid gap-2 sm:grid-cols-[1fr_7rem]">
              <select
                className={champ}
                value={cadeau}
                onChange={(e) => {
                  const c = e.target.value as Cadeau
                  setCadeau(c)
                  setJours(CADEAUX.find((x) => x.cle === c)?.jours ?? 0)
                }}
                aria-label="Coup de pouce"
              >
                {CADEAUX.map((c) => (
                  <option key={c.cle} value={c.cle}>
                    {c.nom}
                  </option>
                ))}
              </select>
              {def.jours !== null && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="number"
                    min={1}
                    max={365}
                    className={champ}
                    value={jours}
                    onChange={(e) => setJours(Number(e.target.value))}
                    aria-label="Nombre de jours"
                  />
                  j
                </label>
              )}
            </div>
            <button
              type="button"
              disabled={enCours}
              className={cn(bouton, "bg-accent border-accent text-black")}
              onClick={() => lancer(() => actionOffrir(id, cadeau, jours))}
            >
              {cadeau === "prolongation" ? (
                <CalendarPlus className="size-4" aria-hidden />
              ) : (
                <Rocket className="size-4" aria-hidden />
              )}
              Offrir
            </button>
            <p className="text-encre-3 text-xs">
              L&apos;annonceur le voit dans son activité (« offert par Radio Tripoint »). Rien
              n&apos;est facturé.
            </p>
          </>
        ) : (
          <p className="text-encre-3 text-sm">Disponible quand l&apos;annonce est en ligne.</p>
        )}
      </div>

      <div className="bg-carte border-trait space-y-3 rounded-2xl border p-4">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={bouton} onClick={() => setEdition((x) => !x)}>
            <PencilLine className="size-4" aria-hidden />
            {edition ? "Fermer la correction" : "Corriger le texte, le prix, la catégorie"}
          </button>
          {["publiee", "signalee", "expiree"].includes(statut) && (
            <button
              type="button"
              disabled={enCours}
              className={bouton}
              onClick={() => {
                if (window.confirm("Marquer l'annonce comme vendue ? Elle quitte le site."))
                  lancer(() => actionVendueDirection(id))
              }}
            >
              <PartyPopper className="size-4" aria-hidden />
              Marquer vendue
            </button>
          )}
        </div>
        {edition && (
          <form
            className="space-y-2.5"
            onSubmit={(e) => {
              e.preventDefault()
              lancer(() => actionCorriger(id, v))
            }}
          >
            <label className="block text-sm font-semibold">
              Titre
              <input
                className={cn(champ, "mt-1")}
                maxLength={80}
                value={v.titre}
                onChange={(e) => setV({ ...v, titre: e.target.value })}
              />
            </label>
            <label className="block text-sm font-semibold">
              Description
              <textarea
                className={cn(champ, "mt-1")}
                rows={7}
                maxLength={4000}
                value={v.description}
                onChange={(e) => setV({ ...v, description: e.target.value })}
              />
            </label>
            <div className="grid gap-2.5 sm:grid-cols-3">
              <label className="block text-sm font-semibold">
                Prix (€, vide = aucun)
                <input
                  className={cn(champ, "mt-1")}
                  inputMode="decimal"
                  value={v.prix}
                  onChange={(e) => setV({ ...v, prix: e.target.value })}
                />
              </label>
              <label className="block text-sm font-semibold">
                Ville
                <input
                  className={cn(champ, "mt-1")}
                  maxLength={60}
                  value={v.ville}
                  onChange={(e) => setV({ ...v, ville: e.target.value })}
                />
              </label>
              <label className="block text-sm font-semibold">
                Catégorie
                <select
                  className={cn(champ, "mt-1")}
                  value={v.categorie}
                  onChange={(e) => setV({ ...v, categorie: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="submit"
              disabled={enCours}
              className={cn(bouton, "bg-accent border-accent text-black")}
            >
              {enCours ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <PencilLine className="size-4" aria-hidden />
              )}
              Enregistrer la correction
            </button>
            <p className="text-encre-3 text-xs">
              La correction s&apos;applique tout de suite, sans nouvelle vérification.
            </p>
          </form>
        )}
        {message}
      </div>

      <Suppression
        libelle="Supprimer l'annonce"
        explication="L'annonce et ses photos sont effacées pour de bon (annonce illicite, en double…). Pour la cacher seulement, utilisez plutôt « Retirer »."
        action={(m) => actionSupprimerAnnonce(id, m)}
      />
    </div>
  )
}

export function ActionsFicheCompte({
  id,
  emailVerifie,
  bloque,
}: {
  id: string
  emailVerifie: boolean
  bloque: boolean
}) {
  const { enCours, lancer, message } = useAction()
  const [ecrire, setEcrire] = useState(false)
  const [objet, setObjet] = useState("")
  const [texte, setTexte] = useState("")
  return (
    <div className="space-y-4">
      <div className="bg-carte border-trait space-y-3 rounded-2xl border p-4">
        <div className="flex flex-wrap gap-2">
          {!emailVerifie && (
            <button
              type="button"
              disabled={enCours}
              className={bouton}
              onClick={() => lancer(() => actionConfirmerEmail(id))}
            >
              <MailCheck className="size-4" aria-hidden />
              Confirmer l&apos;e-mail à la main
            </button>
          )}
          {!bloque && (
            <button
              type="button"
              disabled={enCours}
              className={bouton}
              onClick={() => {
                if (window.confirm("Envoyer un lien pour choisir un nouveau mot de passe ?"))
                  lancer(() => actionLienMotDePasse(id))
              }}
            >
              <KeyRound className="size-4" aria-hidden />
              Envoyer un lien de mot de passe
            </button>
          )}
          <button
            type="button"
            disabled={enCours}
            className={bouton}
            onClick={() => {
              if (window.confirm("Déconnecter ce compte de tous ses appareils ?"))
                lancer(() => actionDeconnecterCompte(id))
            }}
          >
            <LogOut className="size-4" aria-hidden />
            Déconnecter partout
          </button>
          <button type="button" className={bouton} onClick={() => setEcrire((x) => !x)}>
            <Mail className="size-4" aria-hidden />
            {ecrire ? "Fermer" : "Lui écrire"}
          </button>
        </div>
        {ecrire && (
          <form
            className="space-y-2.5"
            onSubmit={(e) => {
              e.preventDefault()
              lancer(async () => {
                const r = await actionEcrireCompte(id, objet, texte)
                if (r.ok) {
                  setObjet("")
                  setTexte("")
                  setEcrire(false)
                }
                return r
              })
            }}
          >
            <label className="block text-sm font-semibold">
              Objet
              <input
                className={cn(champ, "mt-1")}
                maxLength={150}
                value={objet}
                onChange={(e) => setObjet(e.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Message (« Bonjour … » et la signature de la radio sont ajoutés)
              <textarea
                className={cn(champ, "mt-1")}
                rows={6}
                maxLength={5000}
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
              />
            </label>
            <button
              type="submit"
              disabled={enCours}
              className={cn(bouton, "bg-accent border-accent text-black")}
            >
              {enCours ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Mail className="size-4" aria-hidden />
              )}
              Envoyer depuis info@
            </button>
          </form>
        )}
        {message}
      </div>
      <Suppression
        libelle="Supprimer le compte"
        explication="Ses annonces sont retirées, ses paiements non consommés remboursés, ses favoris, alertes et discussions effacés, puis le compte disparaît. C'est définitif."
        action={(m) => actionSupprimerCompteDirection(id, m)}
      />
    </div>
  )
}
