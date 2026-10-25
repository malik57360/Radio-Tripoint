import type { ReactNode } from "react"
import { FilAnnonces } from "@/components/annonces/Chrome"

/** Mise en page des pages de compte (connexion, inscription…) : étroite, lisible au téléphone. */
export function CadreCompte({
  titre,
  chemin,
  intro,
  children,
  large = false,
}: {
  titre: string
  chemin: string
  intro?: ReactNode
  children: ReactNode
  large?: boolean
}) {
  return (
    <>
      <div className={large ? "conteneur py-6 sm:py-8" : "conteneur max-w-xl py-6 sm:py-10"}>
        <FilAnnonces elements={[{ nom: titre, chemin }]} />
        <h1 className="titre-page mt-6 text-[clamp(2.1rem,1.4rem+3.5vw,4rem)]">{titre}</h1>
        {intro && <div className="text-encre-2 mt-3 text-[1.02rem] leading-snug">{intro}</div>}
        <div className="mt-6">{children}</div>
      </div>
    </>
  )
}
