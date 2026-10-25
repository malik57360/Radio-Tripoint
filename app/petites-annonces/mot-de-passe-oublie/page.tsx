import { CadreCompte } from "@/components/annonces/CadreCompte"
import { FormulaireOubli } from "@/components/annonces/FormulairesCompte"
import { metaAnnonces } from "@/lib/annonces/seo"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Mot de passe oublié",
    description: "Recevoir un lien pour choisir un nouveau mot de passe.",
    chemin: "/mot-de-passe-oublie",
    noindex: true,
  })

export default function PageOubli() {
  return (
    <CadreCompte
      titre="Mot de passe oublié"
      chemin="/mot-de-passe-oublie"
      intro="Indiquez l'adresse de votre compte : vous recevrez un lien pour choisir un nouveau mot de passe."
    >
      <FormulaireOubli />
    </CadreCompte>
  )
}
