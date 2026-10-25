import { LogOut, MessageSquare } from "lucide-react"
import { redirect } from "next/navigation"
import { actionDeconnexion } from "@/app/[lang]/annonces/actions"
import { CadreCompte } from "@/components/annonces/CadreCompte"
import {
  FormulaireChangerMotDePasse,
  FormulaireProfil,
  FormulaireSuppression,
  RenvoyerVerification,
} from "@/components/annonces/FormulairesCompte"
import { ActionsMonAnnonce } from "@/components/annonces/Interactions"
import { Vignette, dateLongue, prixAffiche } from "@/components/annonces/Vitrine"
import Link from "@/components/ui/Lien"
import { redis } from "@/lib/direction/redis"
import { annoncesDuCompte } from "@/lib/annonces/annonces"
import { compteConnecte } from "@/lib/annonces/comptes"
import { lireConfig, nomCategorie } from "@/lib/annonces/config"
import { offreOuverte, optionUtile } from "@/lib/annonces/offres"
import { metaAnnonces } from "@/lib/annonces/seo"
import { LIBELLES_STATUT, actif, cheminAnnonce, type Annonce } from "@/lib/annonces/types"
import { cn } from "@/lib/utils/cn"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Mon espace — Petites annonces",
    description: "Gérer vos annonces et votre compte.",
    chemin: "/annonces/mon-espace",
    noindex: true,
  })

const MESSAGES: Record<string, Record<string, string>> = {
  bienvenue: {
    "1": "Bienvenue ! Confirmez votre adresse e-mail grâce au lien que nous venons de vous envoyer.",
  },
  verifie: {
    ok: "Adresse e-mail confirmée : vous pouvez déposer vos annonces.",
    expire: "Ce lien a expiré ou a déjà servi. Renvoyez-en un ci-dessous.",
    erreur: "La confirmation n'a pas abouti. Réessayez dans un instant.",
  },
  depot: {
    ok: "Annonce reçue ! L'équipe la vérifie avant de la publier, en général dans la journée.",
  },
  paiement: {
    ok: "Paiement reçu, merci ! Votre annonce est en cours de vérification (ou votre option est active).",
    attente: "Paiement en cours de confirmation : actualisez la page dans un instant.",
    annule:
      "Paiement annulé : rien n'a été débité. Vous pouvez régler plus tard depuis cette page.",
    erreur: "Le paiement n'a pas pu démarrer. Réessayez avec le bouton « Régler maintenant ».",
  },
  modifiee: {
    ok: "Modifications enregistrées.",
    verif: "Modifications enregistrées : l'annonce est revérifiée avant de réapparaître.",
  },
  retiree: { "1": "Annonce retirée." },
  options: { ok: "Option activée." },
  mdp: { "1": "Mot de passe changé : vous êtes connecté." },
}

const COULEURS: Record<string, string> = {
  publiee: "bg-[#dff3e4] text-[#14532d]",
  en_attente: "bg-[#fdefc0] text-black",
  attente_paiement: "bg-[#fdefc0] text-black",
  signalee: "bg-papier-3 text-encre",
  refusee: "bg-papier-3 text-encre-2",
  expiree: "bg-papier-3 text-encre-2",
  retiree: "bg-papier-3 text-encre-2",
}

export default async function PageMonEspace(props: PageProps<"/[lang]/annonces/mon-espace">) {
  const c = await compteConnecte()
  if (!c) redirect("/annonces/connexion?suite=/annonces/mon-espace")
  const sp = await props.searchParams
  const message = Object.entries(MESSAGES)
    .map(([k, v]) => (typeof sp[k] === "string" ? v[sp[k] as string] : undefined))
    .find(Boolean)
  const [annonces, cfg] = await Promise.all([annoncesDuCompte(c.id), lireConfig()])
  const contacts = annonces.length
    ? (((await redis([["HMGET", "rt:annonces:contacts", ...annonces.map((a) => a.id)]]))?.[0] as
        (string | null)[] | null) ?? [])
    : []
  const nbContacts = (i: number) => Number(contacts[i] ?? 0)

  const optionsPour = (a: Annonce) => {
    const formule = cfg.offres.find((o) => o.code === a.formule)
    return cfg.offres
      .filter(
        (o) =>
          o.genre === "option" &&
          offreOuverte(o, a.annonceur) &&
          optionUtile(formule, o) &&
          (a.statut === "expiree" ? o.effet === "prolongation" : a.statut === "publiee") &&
          // Mise en avant déjà en cours : pas de doublon.
          !(o.effet === "categorie" && actif(a.categorieJusqu)) &&
          !(o.effet === "renforcee" && actif(a.renforceeJusqu)) &&
          !(o.effet === "accueil" && actif(a.accueilJusqu)),
      )
      .map(({ code, nom, description, prixCentimes, effet }) => ({
        code,
        nom,
        description,
        prixCentimes,
        effet,
      }))
  }

  return (
    <CadreCompte titre="Mon espace" chemin="/annonces/mon-espace" connecte={c.nom} large>
      {message && (
        <p
          role="status"
          className="bg-papier-2 border-trait-fort mb-6 rounded-lg border-l-4 p-4 font-semibold"
        >
          {message}
        </p>
      )}
      {!c.emailVerifie && (
        <div className="mb-6 rounded-lg bg-[#fdefc0] p-4 text-black">
          <p className="font-extrabold">Confirmez votre adresse e-mail</p>
          <p className="mt-1 text-sm">
            Un lien a été envoyé à <strong>{c.email}</strong>. Il faut l&apos;ouvrir avant de
            déposer une annonce ou d&apos;écrire à un annonceur. Pensez à regarder dans les
            courriers indésirables.
          </p>
          <RenvoyerVerification />
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <section aria-labelledby="t-mes-annonces">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id="t-mes-annonces"
              className="titre-section text-[clamp(1.7rem,1.2rem+1.8vw,2.6rem)]"
            >
              Mes annonces
            </h2>
            <Link href="/annonces/deposer" className="btn btn-accent min-h-11">
              + Déposer
            </Link>
          </div>
          {annonces.length === 0 ? (
            <p className="text-encre-2 mt-5">Vous n&apos;avez pas encore d&apos;annonce.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {annonces.map((a, i) => {
                const prix = prixAffiche({ prix: a.prix, mention: a.mention, details: a.details })
                return (
                  <li key={a.id} className="border-trait rounded-xl border p-4">
                    <div className="flex gap-3.5">
                      <Vignette a={a} className="bg-papier-2 size-20 flex-none rounded-md" />
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[0.72rem] font-extrabold",
                              COULEURS[a.statut],
                            )}
                          >
                            {LIBELLES_STATUT[a.statut]}
                          </span>
                          <span className="text-encre-3 text-xs">
                            {nomCategorie(cfg, a.categorie)}
                          </span>
                        </p>
                        <p className="titre-carte mt-1 truncate text-[1.05rem]">
                          {a.statut === "publiee" ? (
                            <Link href={cheminAnnonce(a)} className="hover:underline">
                              {a.titre}
                            </Link>
                          ) : (
                            a.titre
                          )}
                        </p>
                        <p className="text-encre-2 text-sm">
                          {prix && <strong>{prix} · </strong>}
                          {a.ville}
                        </p>
                        <p className="text-encre-3 mt-1 text-xs">
                          {a.statut === "publiee" &&
                            a.expireLe &&
                            `En ligne jusqu'au ${dateLongue(a.expireLe)}`}
                          {a.statut === "expiree" &&
                            a.expireLe &&
                            `Expirée le ${dateLongue(a.expireLe)}`}
                          {a.statut === "en_attente" &&
                            "Vérification en cours, en général dans la journée"}
                          {a.statut === "attente_paiement" &&
                            "Elle sera vérifiée dès le paiement reçu"}
                          {a.statut === "signalee" &&
                            "Masquée après plusieurs signalements : l'équipe vérifie"}
                          {nbContacts(i) > 0 && (
                            <span className="ml-2 inline-flex items-center gap-1">
                              <MessageSquare className="size-3.5" aria-hidden />
                              {nbContacts(i)} message{nbContacts(i) > 1 ? "s" : ""}
                            </span>
                          )}
                        </p>
                        {a.motif && (a.statut === "refusee" || a.statut === "retiree") && (
                          <p className="text-encre-2 mt-1 text-sm">Motif : {a.motif}</p>
                        )}
                      </div>
                    </div>
                    <ActionsMonAnnonce
                      id={a.id}
                      statut={a.statut}
                      modifiable={["attente_paiement", "en_attente", "publiee"].includes(a.statut)}
                      options={optionsPour(a)}
                      particulier={a.annonceur === "particulier"}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <aside id="compte" className="scroll-mt-24 space-y-8">
          <section aria-labelledby="t-compte">
            <h2 id="t-compte" className="titre-carte text-xl">
              Mon compte
            </h2>
            <p className="text-encre-2 mt-1 text-sm">
              {c.email} · {c.type === "pro" ? "Professionnel" : "Particulier"}
            </p>
            <div className="mt-4">
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
            </div>
          </section>
          <details className="border-trait rounded-lg border p-4">
            <summary className="cursor-pointer font-bold">Changer de mot de passe</summary>
            <div className="mt-4">
              <FormulaireChangerMotDePasse />
            </div>
          </details>
          <form action={actionDeconnexion}>
            <button type="submit" className="btn btn-trait min-h-11 w-full">
              <LogOut className="size-4" aria-hidden />
              Se déconnecter
            </button>
          </form>
          <details className="border-trait rounded-lg border p-4">
            <summary className="text-encre-2 cursor-pointer text-sm font-bold">
              Supprimer mon compte
            </summary>
            <div className="mt-4">
              <FormulaireSuppression />
            </div>
          </details>
        </aside>
      </div>
    </CadreCompte>
  )
}
