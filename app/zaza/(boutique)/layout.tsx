import { BandeauMaquette, Entete, PiedDePage } from "@/components/zaza/Gabarit"
import { TiroirPanier } from "@/components/zaza/Panier"
import { PorteAge } from "@/components/zaza/Vivants"

/** Cadre de la maquette : bandeau, en-tête, pied de page, panier, contrôle de l'âge. */
export default function CadreBoutique({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <BandeauMaquette />
      <Entete />
      <main>{children}</main>
      <PiedDePage />
      <TiroirPanier />
      <PorteAge />
    </>
  )
}
