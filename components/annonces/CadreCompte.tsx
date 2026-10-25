import type { ReactNode } from "react"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { NavAnnonces } from "./Vitrine"

/** Mise en page des pages de compte (connexion, inscription…) : étroite, lisible au téléphone. */
export function CadreCompte({
  titre,
  chemin,
  intro,
  children,
  connecte = null,
  large = false,
}: {
  titre: string
  chemin: string
  intro?: ReactNode
  children: ReactNode
  connecte?: string | null
  large?: boolean
}) {
  return (
    <>
      <NavAnnonces connecte={connecte} />
      <div className={large ? "conteneur py-6 sm:py-8" : "conteneur max-w-xl py-6 sm:py-10"}>
        <Breadcrumbs
          elements={[
            { nom: "Petites annonces", chemin: "/annonces" },
            { nom: titre, chemin },
          ]}
        />
        <h1 className="titre-page mt-6 text-[clamp(2.1rem,1.4rem+3.5vw,4rem)]">{titre}</h1>
        {intro && <div className="text-encre-2 mt-3 text-[1.02rem] leading-snug">{intro}</div>}
        <div className="mt-6">{children}</div>
      </div>
    </>
  )
}
