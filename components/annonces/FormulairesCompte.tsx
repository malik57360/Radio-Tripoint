"use client"

import Link from "@/components/ui/Lien"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useActionState, useState } from "react"
import {
  actionChangerMotDePasse,
  actionConnexion,
  actionDeconnecterAutres,
  actionInscription,
  actionMotDePasseOublie,
  actionNouveauMotDePasse,
  actionProfil,
  actionRenvoyerVerification,
  actionSupprimerCompte,
} from "@/app/petites-annonces/actions"
import { PAYS, type Pays } from "@/lib/annonces/categories"
import { cn } from "@/lib/utils/cn"

/** Formulaires du compte des Petites annonces (inscription, connexion, profil…). */

type Etat = { erreur?: string; ok?: string } | null

function Retour({ etat }: { etat: Etat }) {
  if (!etat) return null
  return (
    <p
      role={etat.erreur ? "alert" : "status"}
      className={cn(
        "rounded-lg p-3 text-sm font-semibold",
        etat.erreur ? "bg-erreur-fond text-alerte" : "bg-papier-2 text-encre",
      )}
    >
      {etat.erreur ?? etat.ok}
    </p>
  )
}

function Bouton({
  enCours,
  children,
  className,
}: {
  enCours: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="submit"
      disabled={enCours}
      className={cn("btn btn-plein min-h-12 w-full", className)}
    >
      {enCours && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

function Champ({
  nom,
  libelle,
  aide,
  ...p
}: { nom: string; libelle: string; aide?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={`c-${nom}`} className="etiquette">
        {libelle}
      </label>
      <input id={`c-${nom}`} name={nom} className="champ" {...p} />
      {aide && <p className="text-encre-3 mt-1 text-xs">{aide}</p>}
    </div>
  )
}

function MotDePasse({
  nom = "mot_de_passe",
  libelle = "Mot de passe",
  nouveau = false,
}: {
  nom?: string
  libelle?: string
  nouveau?: boolean
}) {
  const [voir, setVoir] = useState(false)
  return (
    <div>
      <label htmlFor={`c-${nom}`} className="etiquette">
        {libelle}
      </label>
      <div className="relative">
        <input
          id={`c-${nom}`}
          name={nom}
          type={voir ? "text" : "password"}
          className="champ pr-12"
          required
          minLength={nouveau ? 10 : undefined}
          autoComplete={nouveau ? "new-password" : "current-password"}
        />
        <button
          type="button"
          onClick={() => setVoir((v) => !v)}
          className="text-encre-2 absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center"
          aria-label={voir ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {voir ? (
            <EyeOff className="size-5" aria-hidden />
          ) : (
            <Eye className="size-5" aria-hidden />
          )}
        </button>
      </div>
      {nouveau && (
        <p className="text-encre-3 mt-1 text-xs">
          10 caractères au moins. Une phrase facile à retenir fait très bien l&apos;affaire.
        </p>
      )}
    </div>
  )
}

/** Champs de l'entreprise (inscription pro et profil). */
function ChampsPro({ pro }: { pro?: Partial<Record<string, string>> & { pays?: Pays } }) {
  const [pays, setPays] = useState<Pays>(pro?.pays ?? "FR")
  return (
    <div className="border-trait space-y-4 rounded-lg border p-4">
      <p className="text-encre-2 text-[0.85rem] leading-snug">
        Ces informations figurent sur vos annonces : la loi impose aux professionnels de se
        présenter comme tels aux acheteurs.
      </p>
      <Champ
        nom="raison_sociale"
        libelle="Nom de l'entreprise"
        defaultValue={pro?.raisonSociale}
        required
        maxLength={120}
        autoComplete="organization"
      />
      <div>
        <label htmlFor="c-pro_pays" className="etiquette">
          Pays d&apos;immatriculation
        </label>
        <select
          id="c-pro_pays"
          name="pro_pays"
          className="champ"
          value={pays}
          onChange={(e) => setPays(e.target.value as Pays)}
        >
          {(Object.keys(PAYS) as Pays[]).map((p) => (
            <option key={p} value={p}>
              {PAYS[p]}
            </option>
          ))}
        </select>
      </div>
      <Champ
        nom="identifiant"
        libelle={
          pays === "FR"
            ? "SIRET"
            : pays === "LU"
              ? "Numéro RCS (Luxembourg)"
              : "Numéro Handelsregister"
        }
        aide={
          pays === "FR"
            ? "14 chiffres : vérifié automatiquement dans l'annuaire des entreprises."
            : "Vérifié par notre équipe."
        }
        defaultValue={pro?.identifiant}
        required
        maxLength={40}
        inputMode={pays === "FR" ? "numeric" : "text"}
      />
      <Champ
        nom="pro_adresse"
        libelle="Adresse"
        defaultValue={pro?.adresse}
        required
        maxLength={160}
        autoComplete="street-address"
      />
      <div className="grid grid-cols-[7.5rem_1fr] gap-3">
        <Champ
          nom="pro_cp"
          libelle="Code postal"
          defaultValue={pro?.codePostal}
          required
          maxLength={10}
          autoComplete="postal-code"
        />
        <Champ
          nom="pro_ville"
          libelle="Commune"
          defaultValue={pro?.ville}
          required
          maxLength={60}
          autoComplete="address-level2"
        />
      </div>
      <Champ
        nom="pro_telephone"
        libelle="Téléphone professionnel"
        defaultValue={pro?.telephone}
        required
        maxLength={30}
        type="tel"
        autoComplete="tel"
      />
      <Champ
        nom="pro_site"
        libelle="Site internet (facultatif)"
        defaultValue={pro?.site}
        maxLength={200}
        type="url"
        placeholder="https://"
      />
      <label className="flex gap-3 text-[0.88rem] leading-snug">
        <input
          type="checkbox"
          name="engagement"
          defaultChecked={!!pro?.raisonSociale}
          className="accent-accent mt-0.5 size-4 flex-none"
          required
        />
        <span>
          Je m&apos;engage à ne proposer que des produits et services conformes au droit de
          l&apos;Union européenne et du pays de vente.
        </span>
      </label>
    </div>
  )
}

export function FormulaireInscription() {
  const [etat, action, enCours] = useActionState(actionInscription, null)
  const [type, setType] = useState<"particulier" | "pro">("particulier")
  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Vous êtes">
        {(
          [
            ["particulier", "Particulier", "Annonce gratuite"],
            ["pro", "Professionnel", "Entreprise, commerce, artisan"],
          ] as const
        ).map(([v, t, d]) => (
          <label
            key={v}
            className={cn(
              "cursor-pointer rounded-lg border-2 p-3",
              type === v ? "border-encre bg-papier-2" : "border-trait",
            )}
          >
            <input
              type="radio"
              name="type"
              value={v}
              checked={type === v}
              onChange={() => setType(v)}
              className="sr-only"
            />
            <span className="block font-extrabold">{t}</span>
            <span className="text-encre-3 text-xs">{d}</span>
          </label>
        ))}
      </div>
      <Champ
        nom="nom"
        libelle={type === "pro" ? "Votre prénom" : "Prénom ou pseudo (affiché sur vos annonces)"}
        required
        maxLength={40}
        autoComplete="given-name"
      />
      <Champ
        nom="email"
        libelle="E-mail"
        type="email"
        required
        maxLength={200}
        autoComplete="email"
        aide="Jamais affiché : les acheteurs vous écrivent par le site."
      />
      <MotDePasse nouveau />
      {type === "pro" && <ChampsPro />}
      {/* Champ piège : invisible pour une personne, rempli par les robots. */}
      <input
        type="text"
        name="site_web"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <label className="flex gap-3 text-[0.88rem] leading-snug">
        <input
          type="checkbox"
          name="conditions"
          className="accent-accent mt-0.5 size-4 flex-none"
          required
        />
        <span>
          J&apos;accepte{" "}
          <Link href="/conditions" target="_blank" className="underline">
            les conditions d&apos;utilisation
          </Link>{" "}
          et{" "}
          <Link href="/politique-confidentialite" target="_blank" className="underline">
            la politique de confidentialité
          </Link>
          .
        </span>
      </label>
      <Retour etat={etat} />
      <Bouton enCours={enCours}>Créer mon compte</Bouton>
    </form>
  )
}

export function FormulaireConnexion({ suite }: { suite?: string }) {
  const [etat, action, enCours] = useActionState(actionConnexion, null)
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="suite" value={suite ?? ""} />
      <Champ
        nom="email"
        libelle="E-mail"
        type="email"
        required
        maxLength={200}
        autoComplete="email"
      />
      <MotDePasse />
      <Retour etat={etat} />
      <Bouton enCours={enCours}>Se connecter</Bouton>
    </form>
  )
}

export function FormulaireOubli() {
  const [etat, action, enCours] = useActionState(actionMotDePasseOublie, null)
  return (
    <form action={action} className="space-y-4">
      <Champ
        nom="email"
        libelle="E-mail du compte"
        type="email"
        required
        maxLength={200}
        autoComplete="email"
      />
      <Retour etat={etat} />
      <Bouton enCours={enCours}>Recevoir un lien</Bouton>
    </form>
  )
}

export function FormulaireNouveauMotDePasse({ jeton }: { jeton: string }) {
  const [etat, action, enCours] = useActionState(actionNouveauMotDePasse, null)
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="jeton" value={jeton} />
      <MotDePasse libelle="Nouveau mot de passe" nouveau />
      <Retour etat={etat} />
      <Bouton enCours={enCours}>Enregistrer</Bouton>
    </form>
  )
}

export function RenvoyerVerification() {
  const [etat, action, enCours] = useActionState(actionRenvoyerVerification, null)
  return (
    <form action={action} className="mt-3 space-y-2">
      <button type="submit" disabled={enCours} className="btn btn-trait min-h-10 text-sm">
        {enCours && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Renvoyer le lien
      </button>
      <Retour etat={etat} />
    </form>
  )
}

export function FormulaireProfil({
  nom,
  type,
  pro,
}: {
  nom: string
  type: "particulier" | "pro"
  pro?: Partial<Record<string, string>> & { pays?: Pays }
}) {
  const [etat, action, enCours] = useActionState(actionProfil, null)
  const [devenirPro, setDevenirPro] = useState(false)
  return (
    <form action={action} className="space-y-4">
      <Champ
        nom="nom"
        libelle={type === "pro" ? "Votre prénom" : "Prénom ou pseudo affiché"}
        defaultValue={nom}
        required
        maxLength={40}
      />
      {type === "pro" ? (
        <ChampsPro pro={pro} />
      ) : (
        <>
          <label className="flex gap-3 text-[0.88rem]">
            <input
              type="checkbox"
              name="devenir_pro"
              checked={devenirPro}
              onChange={(e) => setDevenirPro(e.target.checked)}
              className="accent-accent mt-0.5 size-4 flex-none"
            />
            <span>Je suis un professionnel (entreprise, commerce, artisan)</span>
          </label>
          {devenirPro && <ChampsPro />}
        </>
      )}
      <Retour etat={etat} />
      <Bouton enCours={enCours} className="sm:w-auto">
        Enregistrer
      </Bouton>
    </form>
  )
}

export function FormulaireChangerMotDePasse() {
  const [etat, action, enCours] = useActionState(actionChangerMotDePasse, null)
  return (
    <form action={action} className="space-y-4">
      <MotDePasse nom="actuel" libelle="Mot de passe actuel" />
      <MotDePasse libelle="Nouveau mot de passe" nouveau />
      <Retour etat={etat} />
      <Bouton enCours={enCours} className="sm:w-auto">
        Changer le mot de passe
      </Bouton>
    </form>
  )
}

export function FormulaireSuppression() {
  const [etat, action, enCours] = useActionState(actionSupprimerCompte, null)
  return (
    <form action={action} className="space-y-3">
      <p className="text-encre-2 text-[0.88rem] leading-snug">
        Vos annonces sont retirées et votre compte effacé. Une annonce payée mais pas encore publiée
        vous est remboursée. Les paiements restent dans notre comptabilité, comme la loi
        l&apos;exige.
      </p>
      <MotDePasse libelle="Confirmez avec votre mot de passe" />
      <Retour etat={etat} />
      <button type="submit" disabled={enCours} className="btn btn-trait text-alerte min-h-11">
        {enCours && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Supprimer mon compte
      </button>
    </form>
  )
}

/** Ferme les sessions ouvertes ailleurs (téléphone perdu, ordinateur partagé). */
export function FormulaireDeconnecterAutres({ appareils }: { appareils: number }) {
  const [etat, action, enCours] = useActionState(actionDeconnecterAutres, null)
  return (
    <form action={action} className="space-y-3">
      <p className="text-encre-2 text-[0.9rem]">
        {appareils > 1
          ? `Votre compte est ouvert sur ${appareils} appareils ou navigateurs.`
          : "Votre compte n'est ouvert que sur cet appareil."}
      </p>
      <Retour etat={etat} />
      {appareils > 1 && (
        <button type="submit" disabled={enCours} className="btn btn-trait min-h-11">
          {enCours && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Déconnecter les autres appareils
        </button>
      )}
    </form>
  )
}
