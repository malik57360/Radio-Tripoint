import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Archivo, Newsreader } from "next/font/google"
import { EnTeteAnnonces, PiedAnnonces } from "@/components/annonces/Chrome"
import { JsonLd } from "@/components/ui/JsonLd"
import { site } from "@/config/site"
import { URL_ANNONCES } from "@/lib/annonces/liens"
import "../globals.css"
import "./annonces.css"

/**
 * annonces.radio-tripoint-officiel.fr : le site des Petites annonces, à part
 * du site de la radio (le proxy sert ces pages à la racine du sous-domaine).
 * Mêmes couleurs et mêmes polices que Radio Tripoint ; ni lecteur, ni
 * rubriques de la radio. Français seulement pour l'instant.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(URL_ANNONCES),
  title: {
    default: "Les Petites Annonces du Tripoint — France, Luxembourg, Allemagne",
    template: "%s · Petites annonces du Tripoint",
  },
  description:
    "Les petites annonces de Radio Tripoint : auto, maison, emploi, services… en France, au Luxembourg et en Allemagne. Chaque annonce est vérifiée avant de paraître.",
  applicationName: "Petites annonces du Tripoint",
  publisher: site.nomOfficiel,
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: { type: "website", locale: "fr_FR", siteName: "Les Petites Annonces du Tripoint" },
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = {
  themeColor: "#0a3640",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function LayoutAnnonces({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="annonces" className={`${archivo.variable} ${newsreader.variable}`}>
      <body>
        <a
          href="#contenu"
          className="bg-encre text-papier sr-only z-50 px-4 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Aller au contenu
        </a>
        <EnTeteAnnonces />
        <main id="contenu" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <PiedAnnonces />
        {/* Mesure d'audience Vercel : sans cookie ni donnée personnelle. */}
        <Analytics />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Les Petites Annonces du Tripoint",
            url: URL_ANNONCES,
            publisher: { "@type": "Organization", name: site.nomOfficiel, url: site.url },
            potentialAction: {
              "@type": "SearchAction",
              target: `${URL_ANNONCES}/?q={q}`,
              "query-input": "required name=q",
            },
          }}
        />
      </body>
    </html>
  )
}
