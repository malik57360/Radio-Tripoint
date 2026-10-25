import { CadreCompte } from "@/components/annonces/CadreCompte"
import { FormulaireNouveauMotDePasse } from "@/components/annonces/FormulairesCompte"
import { EtatVide } from "@/components/ui/EtatVide"
import Link from "@/components/ui/Lien"
import { jetonValide } from "@/lib/annonces/comptes"
import { metaAnnonces } from "@/lib/annonces/seo"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Nouveau mot de passe",
    description: "Choisir un nouveau mot de passe.",
    chemin: "/nouveau-mot-de-passe",
    noindex: true,
  })

export default async function PageNouveauMotDePasse(
  props: PageProps<"/petites-annonces/nouveau-mot-de-passe">,
) {
  const sp = await props.searchParams
  const jeton = typeof sp.j === "string" ? sp.j : ""
  // Le lien n'est consommé qu'à l'enregistrement : un antivirus qui l'ouvre ne le grille pas.
  const valide = await jetonValide("reinitialisation", jeton)
  return (
    <CadreCompte titre="Nouveau mot de passe" chemin="/nouveau-mot-de-passe">
      {valide ? (
        <FormulaireNouveauMotDePasse jeton={jeton} />
      ) : (
        <EtatVide
          titre="Ce lien a expiré"
          actions={
            <Link href="/mot-de-passe-oublie" className="btn btn-plein">
              Recevoir un nouveau lien
            </Link>
          }
        >
          Un lien sert une seule fois, pendant une heure.
        </EtatVide>
      )}
    </CadreCompte>
  )
}
