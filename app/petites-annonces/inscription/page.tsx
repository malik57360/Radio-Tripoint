import { redirect } from "next/navigation"
import { CadreCompte } from "@/components/annonces/CadreCompte"
import { FormulaireInscription } from "@/components/annonces/FormulairesCompte"
import Link from "@/components/ui/Lien"
import { compteConnecte } from "@/lib/annonces/comptes"
import { configPublique } from "@/lib/annonces/config"
import { metaAnnonces } from "@/lib/annonces/seo"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Créer un compte",
    description: "Créez votre compte pour déposer une annonce sur Radio Tripoint.",
    chemin: "/inscription",
    noindex: true,
  })

export default async function PageInscription() {
  if (await compteConnecte()) redirect("/mon-espace")
  const { site } = await configPublique()
  if (!site.inscriptionsOuvertes)
    return (
      <CadreCompte titre="Créer un compte" chemin="/inscription">
        <p className="bg-papier-2 rounded-xl p-4 font-semibold">
          Les inscriptions sont momentanément fermées. Revenez un peu plus tard !
        </p>
        <p className="text-encre-2 mt-4">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-bold underline">
            Se connecter
          </Link>
        </p>
      </CadreCompte>
    )
  return (
    <CadreCompte
      titre="Créer un compte"
      chemin="/inscription"
      intro="Pour déposer une annonce et écrire aux annonceurs. Votre adresse e-mail n'est jamais affichée."
    >
      <FormulaireInscription />
      <p className="border-trait text-encre-2 mt-6 border-t pt-5">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-bold underline">
          Se connecter
        </Link>
      </p>
    </CadreCompte>
  )
}
