import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { weekend } from "@/lib/flyer/weekend"
import { logoDataUrl } from "@/lib/seo/logo-og"

// Polices Archivo (SIL OFL), lues une seule fois.
const police = (f: string) => readFile(join(process.cwd(), "assets/fonts", f))
const polices = Promise.all([
  police("archivo-latin-500-normal.woff"),
  police("archivo-latin-700-normal.woff"),
  police("archivo-latin-900-normal.woff"),
  police("archivo-latin-ext-700-normal.woff"),
  police("archivo-latin-ext-900-normal.woff"),
])

const JAUNE = "#F9B800"
const NOIR = "#0a0a0a"
const MAX = 7

/**
 * Flyer « Ce week-end » (1080 × 1350, format Instagram), tiré de l'agenda
 * publié. `?debut=AAAA-MM-JJ` (un vendredi) pour un autre week-end.
 */
export async function GET(request: Request) {
  const debut = new URL(request.url).searchParams.get("debut") ?? undefined
  const [w, logo, [p500, p700, p900, e700, e900]] = await Promise.all([
    weekend(new Date(), debut),
    logoDataUrl(),
    polices,
  ])
  const lignes = w.lignes.slice(0, MAX)
  const reste = w.lignes.length - lignes.length
  const serre = lignes.length > 5
  const aere = lignes.length <= 4

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: NOIR,
        color: "#fafaf7",
        fontFamily: "Archivo",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: JAUNE,
          color: NOIR,
          padding: "56px 64px 44px",
        }}
      >
        <div
          style={{ fontSize: 30, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}
        >
          Agenda des trois frontières
        </div>
        <div
          style={{
            fontSize: 118,
            fontWeight: 900,
            lineHeight: 0.95,
            marginTop: 14,
            letterSpacing: -2,
          }}
        >
          CE WEEK-END
        </div>
        <div style={{ fontSize: 44, fontWeight: 900, marginTop: 16 }}>{w.titreDates}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "34px 64px 0" }}>
        {lignes.length === 0 ? (
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 40 }}>
            Rien dans l’agenda pour ce week-end… pour l’instant !
          </div>
        ) : (
          lignes.map((l) => (
            <div
              key={l.slug}
              style={{
                display: "flex",
                gap: 28,
                padding: serre ? "16px 0" : aere ? "30px 0" : "22px 0",
                borderBottom: "2px solid #2c2c2c",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 210,
                  flexShrink: 0,
                  color: JAUNE,
                  flexDirection: "column",
                  fontSize: 28,
                  fontWeight: 900,
                  lineHeight: 1.15,
                  paddingTop: 6,
                }}
              >
                {l.quand.map((q) => (
                  <div key={q}>{q}</div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: serre ? 34 : aere ? 42 : 38,
                    fontWeight: 900,
                    lineHeight: 1.08,
                    maxHeight: serre ? 74 : aere ? 92 : 82,
                    overflow: "hidden",
                  }}
                >
                  {l.titre}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    color: "#b9b8b1",
                    marginTop: 8,
                    maxHeight: 30,
                    overflow: "hidden",
                  }}
                >
                  {l.detail}
                </div>
              </div>
            </div>
          ))
        )}
        {lignes.length <= 3 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "auto",
              marginBottom: 34,
              padding: "30px 34px",
              border: `3px solid ${JAUNE}`,
            }}
          >
            <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.05 }}>
              Bon week-end dans les Trois Frontières !
            </div>
            <div style={{ fontSize: 26, fontWeight: 500, color: "#b9b8b1", marginTop: 12 }}>
              Toute l’actu du territoire en direct sur Radio Tripoint.
            </div>
          </div>
        )}
        {reste > 0 && (
          <div style={{ fontSize: 28, fontWeight: 700, color: JAUNE, marginTop: 22 }}>
            {`+ ${reste} autre${reste > 1 ? "s" : ""} rendez-vous dans l’agenda`}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          padding: "26px 64px 46px",
          borderTop: `6px solid ${JAUNE}`,
          margin: "0 64px",
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendu par ImageResponse, pas par le navigateur */}
        <img src={logo} width={112} height={112} alt="" style={{ borderRadius: 9999 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 32, fontWeight: 900 }}>Radio Tripoint</div>
          <div style={{ fontSize: 24, fontWeight: 500, color: "#b9b8b1", marginTop: 4 }}>
            Tout l’agenda : radio-tripoint-officiel.fr/agenda
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1080,
      height: 1350,
      fonts: [
        { name: "Archivo", data: p500, weight: 500, style: "normal" },
        { name: "Archivo", data: p700, weight: 700, style: "normal" },
        { name: "Archivo", data: p900, weight: 900, style: "normal" },
        { name: "Archivo", data: e700, weight: 700, style: "normal" },
        { name: "Archivo", data: e900, weight: 900, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=0, s-maxage=1800" },
    },
  )
}
