import { Presence } from "@/components/mesure/Presence"
import { BarreOnglets } from "@/components/layout/BarreOnglets"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Archivo, Newsreader } from "next/font/google"
import { BandeauDemo } from "@/components/layout/BandeauDemo"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { scriptTheme } from "@/components/layout/ThemeToggle"
import { DirectAuto } from "@/components/radio/DirectAuto"
import { Guide } from "@/components/guide/Guide"
import { LecteurBarre } from "@/components/radio/LecteurBarre"
import { Consentement } from "@/components/rgpd/Consentement"
import { JsonLd } from "@/components/ui/JsonLd"
import { FournisseurLangue } from "@/components/i18n/Langue"
import { site } from "@/config/site"
import { choisir, codesLangues, langues } from "@/lib/i18n/langues"
import { langue } from "@/lib/i18n/serveur"
import { listerEmissions } from "@/lib/contenu/emissions"
import { versGrille } from "@/lib/radio/types"
import { jsonLdOrganisation } from "@/lib/seo/jsonld"
import { alternatesLangues } from "@/lib/seo/metadata"
import "../globals.css"

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})

// Serif de presse : textes longs, sous la ligne de flottaison. Pas de
// préchargement, pour laisser la bande passante aux titres (LCP).
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  preload: false,
})

export function generateStaticParams() {
  return langues.map((lang) => ({ lang }))
}

export async function generateMetadata(): Promise<Metadata> {
  const l = await langue()
  const titre = choisir(
    {
      fr: "Radio Tripoint — Radio transfrontalière France, Luxembourg, Allemagne",
      de: "Radio Tripoint — Grenzüberschreitendes Radio Frankreich, Luxemburg, Deutschland",
      lb: "Radio Tripoint — Grenziwwerschreidende Radio Frankräich, Lëtzebuerg, Däitschland",
      en: "Radio Tripoint — Cross-border radio France, Luxembourg, Germany",
      es: "Radio Tripoint — Radio transfronteriza Francia, Luxemburgo, Alemania",
    },
    l,
  )
  const description = choisir(site.description, l)
  const accueil = l === "fr" ? "/" : `/${l}`
  return {
    metadataBase: new URL(site.url),
    title: { default: titre, template: "%s | Radio Tripoint" },
    description,
    applicationName: site.nomOfficiel,
    keywords: [
      "Radio Tripoint",
      "radio Sierck-les-Bains",
      "radio Trois Frontières",
      "radio transfrontalière",
      "Radio Dreiländereck",
      "radio Moselle",
      "Schengen",
      "Perl",
      "Apach",
    ],
    authors: [{ name: site.nomOfficiel, url: site.url }],
    publisher: site.nomOfficiel,
    formatDetection: { telephone: false, address: false, email: false },
    openGraph: {
      type: "website",
      locale: codesLangues[l].og,
      alternateLocale: langues.filter((x) => x !== l).map((x) => codesLangues[x].og),
      siteName: site.nomOfficiel,
      url: accueil,
      title: `Radio Tripoint — ${choisir(site.signature, l).replace(/\.$/, "")}`,
      description,
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: accueil, languages: alternatesLangues("/") },
    appleWebApp: { capable: true, title: "Radio Tripoint", statusBarStyle: "black-translucent" },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const l = await langue()
  const grille = versGrille(await listerEmissions(l))
  return (
    <html
      lang={codesLangues[l].html}
      className={`${archivo.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTheme }} />
      </head>
      <body>
        <FournisseurLangue langue={l}>
          <a
            href="#contenu"
            className="bg-encre text-papier sr-only z-50 px-4 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            {choisir(
              {
                fr: "Aller au contenu",
                de: "Zum Inhalt",
                lb: "Op den Inhalt",
                en: "Skip to content",
                es: "Ir al contenido",
              },
              l,
            )}
          </a>
          <BandeauDemo />
          <Header />
          <main id="contenu" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <LecteurBarre grille={grille} />
          <BarreOnglets guide={process.env.GUIDE_ACTIF === "1"} />
          {process.env.GUIDE_ACTIF === "1" && <Guide />}
          <DirectAuto />
          <Presence />
          <Consentement />
          {/* Mesure d'audience Vercel : sans cookie ni donnée personnelle. */}
          <Analytics />
          <JsonLd data={jsonLdOrganisation(l)} />
        </FournisseurLangue>
      </body>
    </html>
  )
}
