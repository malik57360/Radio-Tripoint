import { LogOut } from "lucide-react"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { seDeconnecter } from "../actions"
import { Horloge } from "@/components/direction/Horloge"
import { Navigation } from "@/components/direction/Navigation"
import { estConnecte } from "@/lib/direction/acces"
import { horodatage } from "@/lib/direction/donnees"
import { compterAlertes } from "@/lib/direction/alertes"

/** Cadre commun : accès, en-tête, menu. Chaque page se recalcule toute seule (Horloge). */
export default async function EspaceDirection({ children }: { children: React.ReactNode }) {
  await connection()
  if (!(await estConnecte())) redirect("/direction/connexion")
  const nbAlertes = await compterAlertes()

  return (
    <div className="min-h-dvh">
      <header className="border-trait bg-fond/90 sticky top-0 z-30 h-[4.25rem] border-b backdrop-blur">
        <div className="mx-auto flex h-full max-w-[1500px] items-center gap-4 px-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="surtitre text-accent">Radio Tripoint · Direction</p>
            <p className="truncate text-lg font-extrabold tracking-tight">
              <span className="sm:hidden">Giorgio</span>
              <span className="hidden sm:inline">Tableau de bord de Giorgio</span>
            </p>
          </div>
          <Horloge genereLe={horodatage()} />
          <form action={seDeconnecter}>
            <button
              type="submit"
              aria-label="Se déconnecter"
              className="border-trait hover:bg-carte-2 grid size-10 place-items-center rounded-full border"
            >
              <LogOut className="size-4" aria-hidden />
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 sm:px-6 lg:grid-cols-[13rem_1fr] lg:pt-6">
        <Navigation alertes={nbAlertes} />
        <main className="min-w-0 pt-4 pb-16 lg:pt-0">{children}</main>
      </div>
    </div>
  )
}
