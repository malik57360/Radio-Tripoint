import { ImageResponse } from "next/og"
import { choisir, estLangue } from "@/lib/i18n/langues"
import { logoDataUrl } from "@/lib/seo/logo-og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Radio Tripoint — La radio transfrontalière"

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const l = estLangue(lang) ? lang : "fr"
  const logo = await logoDataUrl()
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        background: "#0a0a0a",
        color: "#fafaf7",
        padding: 72,
        gap: 64,
      }}
    >
      <img src={logo} width={430} height={430} alt="" style={{ borderRadius: 9999 }} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 70,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          <span>
            {choisir(
              {
                fr: "Le Média des",
                de: "Das Medium des",
                lb: "D'Medium vum",
                en: "The media of",
                es: "El medio de",
              },
              l,
            )}
          </span>
          <span style={{ color: "#f9b800" }}>
            {choisir(
              {
                fr: "trois frontières",
                de: "Dreiländerecks",
                lb: "Dräilännereck",
                en: "the Three Borders",
                es: "las Tres Fronteras",
              },
              l,
            )}
          </span>
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 30, color: "#a9a8a2" }}>
          {choisir(
            {
              fr: "France · Luxembourg · Allemagne",
              de: "Frankreich · Luxemburg · Deutschland",
              lb: "Frankräich · Lëtzebuerg · Däitschland",
              en: "France · Luxembourg · Germany",
              es: "Francia · Luxemburgo · Alemania",
            },
            l,
          )}
        </div>
      </div>
    </div>,
    size,
  )
}
