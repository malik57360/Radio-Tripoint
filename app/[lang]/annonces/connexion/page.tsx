import { redirect } from "next/navigation"
import { CadreCompte } from "@/components/annonces/CadreCompte"
import { FormulaireConnexion } from "@/components/annonces/FormulairesCompte"
import Link from "@/components/ui/Lien"
import { compteConnecte } from "@/lib/annonces/comptes"
import { metaAnnonces } from "@/lib/annonces/seo"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Se connecter — Petites annonces",
    description: "Connexion à votre compte des Petites annonces de Radio Tripoint.",
    chemin: "/annonces/connexion",
    noindex: true,
  })

export default async function PageConnexion(props: PageProps<"/[lang]/annonces/connexion">) {
  const sp = await props.searchParams
  const suite = typeof sp.suite === "string" ? sp.suite : undefined
  if (await compteConnecte()) redirect("/annonces/mon-espace")
  return (
    <CadreCompte titre="Se connecter" chemin="/annonces/connexion">
      <FormulaireConnexion suite={suite} />
      <p className="mt-5 text-sm">
        <Link href="/annonces/mot-de-passe-oublie" className="underline">
          Mot de passe oublié ?
        </Link>
      </p>
      <p className="border-trait text-encre-2 mt-6 border-t pt-5">
        Pas encore de compte ?{" "}
        <Link href="/annonces/inscription" className="font-bold underline">
          Créer un compte
        </Link>
      </p>
    </CadreCompte>
  )
}
