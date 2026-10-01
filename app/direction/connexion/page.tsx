import { redirect } from "next/navigation"
import { connection } from "next/server"
import { FormulaireConnexion } from "@/components/direction/FormulaireConnexion"
import { accesConfigure, estConnecte } from "@/lib/direction/acces"

export default async function PageConnexion() {
  // Lu à chaque visite : le mot de passe est configuré à l'exécution.
  await connection()
  if (await estConnecte()) redirect("/direction")
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="border-trait bg-carte w-full max-w-sm rounded-2xl border p-8">
        <p className="surtitre text-accent">Radio Tripoint</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
          Tableau de bord de la direction
        </h1>
        {accesConfigure() ? (
          <FormulaireConnexion />
        ) : (
          <p className="text-encre-2 mt-6 text-sm leading-relaxed">
            L&apos;accès n&apos;est pas encore configuré : il manque la variable
            DIRECTION_MOT_DE_PASSE sur Vercel.
          </p>
        )}
      </div>
    </main>
  )
}
