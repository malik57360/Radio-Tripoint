import type { Metadata, Viewport } from "next"
import { Archivo } from "next/font/google"
import { EnregistrerApp } from "@/components/direction/AppDirection"
import "./direction.css"

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Direction — Radio Tripoint",
  robots: { index: false, follow: false, nocache: true },
  // App installable à part (manifeste, icônes et service worker sous /direction).
  manifest: "/direction/manifest.webmanifest",
  applicationName: "Direction",
  appleWebApp: { capable: true, title: "Direction", statusBarStyle: "black" },
}

export const viewport: Viewport = {
  themeColor: "#09090a",
  width: "device-width",
  initialScale: 1,
  // L'app installée occupe tout l'écran : les barres tiennent compte des bords (encoche, barre d'accueil).
  viewportFit: "cover",
}

/** Mise en page propre au tableau de bord : rien du site public. */
export default function LayoutDirection({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={archivo.variable}>
      <body>
        {children}
        <EnregistrerApp />
      </body>
    </html>
  )
}
