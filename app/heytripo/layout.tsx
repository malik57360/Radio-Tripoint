import type { Metadata, Viewport } from "next"
import { Archivo } from "next/font/google"
import "./heytripo.css"

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://heytripo.fr"),
  title: "Hey Tripo — le guide des Trois Frontières, par Radio Tripoint",
  description:
    "Parlez à Tripo, la mascotte de Radio Tripoint : posez vos questions à voix haute ou par écrit, envoyez une photo, il vous répond en français, allemand, luxembourgeois, anglais ou espagnol.",
  applicationName: "Hey Tripo",
  openGraph: {
    type: "website",
    siteName: "Hey Tripo",
    title: "Hey Tripo — le guide des Trois Frontières",
    description: "Parlez à Tripo, la mascotte de Radio Tripoint. Voix, photos, cinq langues.",
  },
}

export const viewport: Viewport = {
  themeColor: "#07060a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
}

/** heytripo.fr : un site à part, rattaché à Radio Tripoint. Rien du site radio. */
export default function LayoutHeyTripo({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={archivo.variable}>
      <body>{children}</body>
    </html>
  )
}
