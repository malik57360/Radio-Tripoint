import type { Metadata, Viewport } from "next"
import { Fraunces, Manrope } from "next/font/google"
import { BOUTIQUE } from "@/lib/zaza/boutique"
import "./zaza.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
})
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })

export const metadata: Metadata = {
  metadataBase: new URL("https://zaza-riviera-herbs.com"),
  title: {
    default: `${BOUTIQUE.nom} · CBD shop à ${BOUTIQUE.ville}`,
    template: `%s · ${BOUTIQUE.nom}`,
  },
  description: `${BOUTIQUE.accroche}. Boutique au ${BOUTIQUE.rue}, ${BOUTIQUE.ville}.`,
  // Maquette : rien ne doit être indexé tant que Giorgio n'a pas validé.
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: "#173b2c",
}

/**
 * Le site de Zaza Riviera Herbs (boutique CBD de Giorgio à Sierck-les-Bains) :
 * un site à part, servi à zaza-riviera-herbs.com. Rien du site radio.
 *
 * L'accueil affiche « Bientôt disponible » ; la maquette complète (apercu,
 * boutique, fiches produit) vit dans (boutique), avec son propre cadre, le
 * temps que Giorgio la valide.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  )
}
