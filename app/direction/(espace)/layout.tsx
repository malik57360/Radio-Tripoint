import { LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { seDeconnecter } from "../actions"
import { BoutonInstaller } from "@/components/direction/AppDirection"
import { BarreOnglets, TitrePage } from "@/components/direction/BarreOnglets"
import { Horloge } from "@/components/direction/Horloge"
import { Navigation } from "@/components/direction/Navigation"
import { estConnecte } from "@/lib/direction/acces"
import { horodatage } from "@/lib/direction/donnees"
import { compterAlertes } from "@/lib/direction/alertes"

/**
 * Cadre commun : accès, en-tête, menu. Chaque page se recalcule toute seule (Horloge).
 * Téléphone : en-tête compact (icône de l'app, page en cours, anneau
 * d'actualisation) et barre d'onglets en bas ; ordinateur : menu latéral.
 */
export default async function EspaceDirection({ children }: { children: React.ReactNode }) {
  await connection()
  if (!(await estConnecte())) redirect("/direction/connexion")
  const nbAlertes = await compterAlertes()

  return (
    <div className="min-h-dvh">
      <header className="border-trait bg-fond/85 sticky top-0 z-30 border-b pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-3 px-4 sm:px-6 lg:h-[4.25rem] lg:gap-4">
          <Link href="/direction" className="flex min-w-0 flex-1 items-center gap-3 lg:hidden">
            <Image
              src="/direction/icon-192.png"
              alt=""
              width={36}
              height={36}
              className="flex-none rounded-[10px]"
            />
            <TitrePage />
          </Link>
          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="surtitre text-accent">Radio Tripoint · Direction</p>
            <p className="truncate text-lg font-extrabold tracking-tight">
              <span className="sm:hidden">Giorgio</span>
              <span className="hidden sm:inline">Tableau de bord de Giorgio</span>
            </p>
          </div>
          <Horloge genereLe={horodatage()} />
          <div className="hidden lg:block">
            <BoutonInstaller />
          </div>
          <form action={seDeconnecter} className="hidden lg:block">
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
        <main className="min-w-0 pt-5 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pt-0 lg:pb-16">
          {children}
        </main>
      </div>
      <BarreOnglets alertes={nbAlertes} />
    </div>
  )
}
