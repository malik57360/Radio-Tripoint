import { Download, KeyRound, LogOut, MonitorSmartphone, ShieldAlert, UserRound } from "lucide-react"
import { redirect } from "next/navigation"
import { actionDeconnexion } from "@/app/petites-annonces/actions"
import { Carte, EnTete } from "@/components/annonces/espace/Blocs"
import {
  FormulaireChangerMotDePasse,
  FormulaireDeconnecterAutres,
  FormulaireProfil,
  FormulaireSuppression,
} from "@/components/annonces/FormulairesCompte"
import { nombreSessions } from "@/lib/annonces/comptes"
import { compteEspace } from "@/lib/annonces/espace-donnees"
import { metaAnnonces } from "@/lib/annonces/seo"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Compte et sécurité",
    description: "Votre compte.",
    chemin: "/mon-espace/compte",
    noindex: true,
  })

const date = (ms: number) =>
  new Date(ms).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  })

export default async function Compte() {
  const c = await compteEspace()
  if (!c) redirect("/connexion?suite=/mon-espace/compte")
  const appareils = await nombreSessions(c.id)

  return (
    <div className="space-y-5">
      <EnTete
        titre="Compte et sécurité"
        sousTitre={`${c.email} · compte créé le ${date(c.creeLe)}`}
      />

      <Carte>
        <h2 className="flex items-center gap-2 text-[1.02rem] font-extrabold">
          <UserRound className="size-4" aria-hidden /> Profil
        </h2>
        <p className="text-encre-2 mt-1 mb-4 text-sm">
          {c.type === "pro"
            ? "Votre raison sociale et vos coordonnées professionnelles s'affichent sur vos annonces, comme la loi le demande."
            : "Seul votre prénom ou pseudo s'affiche sur vos annonces. Votre adresse e-mail reste privée."}
        </p>
        <FormulaireProfil
          nom={c.nom}
          type={c.type}
          pro={
            c.pro && {
              raisonSociale: c.pro.raisonSociale,
              identifiant: c.pro.identifiant,
              pays: c.pro.pays,
              adresse: c.pro.adresse,
              codePostal: c.pro.codePostal,
              ville: c.pro.ville,
              telephone: c.pro.telephone,
              site: c.pro.site,
            }
          }
        />
      </Carte>

      <div className="grid gap-5 xl:grid-cols-2">
        <Carte>
          <h2 className="mb-4 flex items-center gap-2 text-[1.02rem] font-extrabold">
            <KeyRound className="size-4" aria-hidden /> Mot de passe
          </h2>
          <FormulaireChangerMotDePasse />
        </Carte>
        <div className="space-y-5">
          <Carte>
            <h2 className="mb-2 flex items-center gap-2 text-[1.02rem] font-extrabold">
              <MonitorSmartphone className="size-4" aria-hidden /> Appareils connectés
            </h2>
            {c.derniereConnexion && (
              <p className="text-encre-3 mb-2 text-[0.8rem]">
                Dernière connexion : {date(c.derniereConnexion)}
              </p>
            )}
            <FormulaireDeconnecterAutres appareils={appareils} />
          </Carte>
          <Carte>
            <h2 className="mb-2 flex items-center gap-2 text-[1.02rem] font-extrabold">
              <Download className="size-4" aria-hidden /> Mes données
            </h2>
            <p className="text-encre-2 text-[0.9rem]">
              Votre compte, vos annonces, vos messages, vos favoris, vos alertes et vos paiements,
              dans un fichier que vous gardez (format JSON).
            </p>
            {/* Téléchargement servi par un point d'entrée serveur : un vrai lien. */}
            <a href="/api/annonces/export" className="btn btn-trait mt-3 min-h-11" download>
              <Download className="size-4" aria-hidden />
              Télécharger mes données
            </a>
          </Carte>
        </div>
      </div>

      <form action={actionDeconnexion}>
        <button type="submit" className="btn btn-trait min-h-11">
          <LogOut className="size-4" aria-hidden />
          Se déconnecter
        </button>
      </form>

      <details className="border-trait rounded-2xl border p-4">
        <summary className="text-encre-2 flex cursor-pointer items-center gap-2 text-sm font-bold">
          <ShieldAlert className="size-4" aria-hidden /> Supprimer mon compte
        </summary>
        <div className="mt-4">
          <FormulaireSuppression />
        </div>
      </details>
    </div>
  )
}
