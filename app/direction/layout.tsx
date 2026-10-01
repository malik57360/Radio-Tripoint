import type { Metadata, Viewport } from "next"
import { Archivo } from "next/font/google"
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
}

export const viewport: Viewport = {
  themeColor: "#09090a",
  width: "device-width",
  initialScale: 1,
}

/** Mise en page propre au tableau de bord : rien du site public. */
export default function LayoutDirection({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={archivo.variable}>
      <body>{children}</body>
    </html>
  )
}
