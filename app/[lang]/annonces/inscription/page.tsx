import { redirect } from "next/navigation"
import { CadreCompte } from "@/components/annonces/CadreCompte"
import { FormulaireInscription } from "@/components/annonces/FormulairesCompte"
import Link from "@/components/ui/Lien"
import { compteConnecte } from "@/lib/annonces/comptes"
import { metaAnnonces } from "@/lib/annonces/seo"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Créer un compte — Petites annonces",
    description: "Créez votre compte pour déposer une annonce sur Radio Tripoint.",
    chemin: "/annonces/inscription",
    noindex: true,
  })

export default async function PageInscription() {
  if (await compteConnecte()) redirect("/annonces/mon-espace")
  return (
    <CadreCompte
      titre="Créer un compte"
      chemin="/annonces/inscription"
      intro="Pour déposer une annonce et écrire aux annonceurs. Votre adresse e-mail n'est jamais affichée."
    >
      <FormulaireInscription />
      <p className="border-trait text-encre-2 mt-6 border-t pt-5">
        Déjà un compte ?{" "}
        <Link href="/annonces/connexion" className="font-bold underline">
          Se connecter
        </Link>
      </p>
    </CadreCompte>
  )
}
