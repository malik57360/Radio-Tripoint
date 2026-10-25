import { redirect } from "next/navigation"
import { CadreCompte } from "@/components/annonces/CadreCompte"
import { FormulaireDepot } from "@/components/annonces/FormulaireDepot"
import { RenvoyerVerification } from "@/components/annonces/FormulairesCompte"
import { EncadreArnaques } from "@/components/annonces/Vitrine"
import { EtatVide } from "@/components/ui/EtatVide"
import Link from "@/components/ui/Lien"
import { lireAnnonce, nombreActives, annoncesDuCompte } from "@/lib/annonces/annonces"
import { stripeActif } from "@/lib/annonces/commandes"
import { compteConnecte } from "@/lib/annonces/comptes"
import { categoriesOuvertes, lireConfig } from "@/lib/annonces/config"
import { metaAnnonces } from "@/lib/annonces/seo"
import { idAnnonceValide } from "@/lib/annonces/types"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Déposer une annonce — Petites annonces",
    description: "Déposez votre annonce : vue en France, au Luxembourg et en Allemagne.",
    chemin: "/annonces/deposer",
    noindex: true,
  })

const ETAPES = [
  ["Vous déposez", "Catégorie, texte, photos : quelques minutes."],
  ["Nous vérifions", "L'équipe relit chaque annonce avant de la publier."],
  ["C'est en ligne", "Les acheteurs vous écrivent par le site."],
]

export default async function PageDeposer(props: PageProps<"/[lang]/annonces/deposer">) {
  const sp = await props.searchParams
  const modifier = typeof sp.modifier === "string" ? sp.modifier : undefined
  const c = await compteConnecte()
  if (!c)
    redirect(
      `/annonces/connexion?suite=${encodeURIComponent(modifier ? `/annonces/deposer?modifier=${modifier}` : "/annonces/deposer")}`,
    )
  const cfg = await lireConfig()
  const titre = modifier ? "Modifier l'annonce" : "Déposer une annonce"
  const cadre = (contenu: React.ReactNode) => (
    <CadreCompte titre={titre} chemin="/annonces/deposer" connecte={c.nom} large>
      <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
        <div className="min-w-0">{contenu}</div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <ol className="space-y-4">
            {ETAPES.map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="bg-nuit text-nuit-encre grid size-8 flex-none place-items-center rounded-full text-sm font-extrabold">
                  {i + 1}
                </span>
                <span>
                  <span className="titre-carte block">{t}</span>
                  <span className="text-encre-2 block text-sm">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <EncadreArnaques />
        </aside>
      </div>
    </CadreCompte>
  )

  if (!c.emailVerifie)
    return cadre(
      <EtatVide titre="Confirmez votre adresse e-mail">
        Nous vous avons envoyé un lien à <strong>{c.email}</strong>. Ouvrez-le, puis revenez ici :
        c&apos;est notre première protection contre les faux comptes.
        <RenvoyerVerification />
      </EtatVide>,
    )
  if (c.type === "pro" && !c.pro)
    return cadre(
      <EtatVide
        titre="Il manque les informations de votre entreprise"
        actions={
          <Link href="/annonces/mon-espace#compte" className="btn btn-plein">
            Compléter mon compte
          </Link>
        }
      />,
    )

  if (modifier) {
    const a = idAnnonceValide(modifier) ? await lireAnnonce(modifier) : null
    if (
      !a ||
      a.compte !== c.id ||
      !["attente_paiement", "en_attente", "publiee", "expiree"].includes(a.statut)
    )
      return cadre(<EtatVide titre="Cette annonce ne peut pas être modifiée" />)
    return cadre(
      <FormulaireDepot
        categories={categoriesOuvertes(cfg)}
        offres={cfg.offres}
        annonceur={a.annonceur}
        paiementOuvert={stripeActif()}
        existante={{
          id: a.id,
          statut: a.statut,
          photosMax: a.photosMax,
          contenu: {
            categorie: a.categorie,
            titre: a.titre,
            description: a.description,
            prix: a.prix,
            mention: a.mention,
            pays: a.pays,
            ville: a.ville,
            codePostal: a.codePostal,
            details: a.details,
            photos: a.photos,
          },
        }}
      />,
    )
  }

  if (!cfg.depotsOuverts)
    return cadre(
      <EtatVide titre="Les dépôts sont momentanément fermés">Revenez un peu plus tard.</EtatVide>,
    )
  if (
    c.type === "particulier" &&
    nombreActives(await annoncesDuCompte(c.id)) >= cfg.limites.activesParticulier
  )
    return cadre(
      <EtatVide
        titre={`Vous avez déjà ${cfg.limites.activesParticulier} annonces actives`}
        actions={
          <Link href="/annonces/mon-espace" className="btn btn-plein">
            Gérer mes annonces
          </Link>
        }
      >
        Retirez une annonce vendue pour en déposer une nouvelle.
      </EtatVide>,
    )
  return cadre(
    <FormulaireDepot
      categories={categoriesOuvertes(cfg)}
      offres={cfg.offres}
      annonceur={c.type}
      paiementOuvert={stripeActif()}
    />,
  )
}
