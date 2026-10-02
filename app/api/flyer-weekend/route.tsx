import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { programmeFlyer, type CarteFlyer } from "@/lib/flyer/weekend"
import type { Visuel } from "@/types/media"

// Polices Montserrat (SIL OFL), lues une seule fois.
const police = (f: string) => readFile(join(process.cwd(), "assets/fonts", f))
const polices = Promise.all([
  police("montserrat-latin-700-normal.woff"),
  police("montserrat-latin-800-normal.woff"),
  police("montserrat-latin-900-normal.woff"),
  police("montserrat-latin-ext-800-normal.woff"),
  police("montserrat-latin-ext-900-normal.woff"),
  police("montserrat-latin-600-italic.woff"),
])

const L = 1080
const H = 1920
const NUIT = "#1a2048"
const NUIT_FONCE = "#0d1130"
const JAUNE = "#F9B800"
const ROUGE = "#ec3640"
const BLEU = "#2f6bf2"
const VERT = "#1fb866"
const ROSE = "#d63c9c"
const ORANGE = "#f47b20"
const TONS = [VERT, ROUGE, BLEU, ROSE]
const MACARONS = [JAUNE, JAUNE, ROSE, JAUNE]

const svg = (contenu: string, l: number, h: number) =>
  `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${h}" viewBox="0 0 ${l} ${h}">${contenu}</svg>`,
  ).toString("base64")}`

/** Étoile à pointes (macarons). */
function etoile(couleur: string, taille: number, pointes = 14) {
  const c = taille / 2
  const pts = Array.from({ length: pointes * 2 }, (_, i) => {
    const r = i % 2 ? c * 0.8 : c
    const a = (Math.PI * i) / pointes
    return `${(c + r * Math.sin(a)).toFixed(1)},${(c - r * Math.cos(a)).toFixed(1)}`
  }).join(" ")
  return svg(`<polygon points="${pts}" fill="${couleur}"/>`, taille, taille)
}

/** Fond : rayons et trames de points, comme sur l'affiche de référence. */
const fond = (() => {
  const cx = L / 2
  const cy = 1000
  const n = 32
  const R = 2400
  let rayons = ""
  for (let i = 0; i < n; i += 2) {
    const a1 = (2 * Math.PI * i) / n
    const a2 = (2 * Math.PI * (i + 1)) / n
    rayons += `<polygon points="${cx},${cy} ${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} ${cx + R * Math.cos(a2)},${cy + R * Math.sin(a2)}" fill="#222a5e"/>`
  }
  const points = (x: number, y: number, l: number, h: number) =>
    `<rect x="${x}" y="${y}" width="${l}" height="${h}" fill="url(#p)"/>`
  return svg(
    `<defs><pattern id="p" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="3" fill="${JAUNE}" fill-opacity="0.55"/></pattern></defs>` +
      `<rect width="${L}" height="${H}" fill="${NUIT}"/>${rayons}` +
      points(0, 0, 330, 360) +
      points(860, 760, 220, 320) +
      points(0, 1260, 200, 320) +
      points(900, 1480, 180, 260),
    L,
    H,
  )
})()

const epingle = svg(
  `<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="${ROUGE}"/>`,
  24,
  24,
)

/** Affiche en data-URL (fichier du site, ou visuel distant converti en JPEG). */
async function imageDe(v?: Visuel): Promise<string | null> {
  if (!v) return null
  try {
    if (v.src.startsWith("/")) {
      const buf = await readFile(join(process.cwd(), "public", v.src))
      const type = v.src.endsWith(".png") ? "image/png" : "image/jpeg"
      return `data:${type};base64,${buf.toString("base64")}`
    }
    const r = await fetch(v.src, { signal: AbortSignal.timeout(5000) })
    if (!r.ok) return null
    let buf: Buffer = Buffer.from(await r.arrayBuffer())
    // Le type annoncé ment parfois (WebP servi en « .png ») : on lit la signature.
    const png = buf.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))
    const jpeg = buf[0] === 0xff && buf[1] === 0xd8
    let type = png ? "image/png" : "image/jpeg"
    if (!png && !jpeg) {
      const sharp = (await import("sharp")).default
      buf = await sharp(buf)
        .resize({ width: 500, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer()
      type = "image/jpeg"
    }
    return `data:${type};base64,${buf.toString("base64")}`
  } catch {
    return null
  }
}

const TONS_PASTILLE = { gratuit: VERT, prix: ORANGE, horaire: BLEU } as const

function Carte({
  c,
  image,
  index,
  compact,
}: {
  c: CarteFlyer
  image: string | null
  index: number
  compact: boolean
}) {
  const gauche = index % 2 === 0
  const largeurImage = compact ? 170 : 200
  const retrait = compact ? 130 : 160
  const cote = gauche ? "left" : "right"
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        justifyContent: gauche ? "flex-end" : "flex-start",
        padding: gauche ? "0 30px 0 0" : "0 0 0 30px",
        marginTop: compact ? 14 : 26,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: image ? 800 : 960,
          background: "#ffffff",
          color: "#141a3a",
          borderRadius: 28,
          paddingTop: compact ? 18 : 24,
          paddingBottom: compact ? 20 : 26,
          paddingLeft: image && gauche ? retrait : 40,
          paddingRight: image && !gauche ? retrait : 40,
          transform: `rotate(${gauche ? -1.2 : 1.2}deg)`,
          boxShadow: "0 14px 0 rgba(0,0,0,0.28)",
        }}
      >
        <div style={{ fontSize: compact ? 36 : 42, fontWeight: 900, lineHeight: 1.05 }}>
          {c.titre}
        </div>
        {!compact && (
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#3a4166",
              marginTop: 6,
              lineHeight: 1.2,
            }}
          >
            {c.accroche}
          </div>
        )}
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, marginTop: compact ? 6 : 10 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- rendu par ImageResponse */}
          <img src={epingle} width={30} height={30} alt="" />
          <div style={{ fontSize: compact ? 26 : 29, fontWeight: 900 }}>{c.lieu}</div>
        </div>
        {c.pastille && (
          <div style={{ display: "flex", marginTop: compact ? 8 : 12 }}>
            <div
              style={{
                display: "flex",
                background: TONS_PASTILLE[c.pastille.ton],
                color: "#ffffff",
                fontSize: compact ? 22 : 25,
                fontWeight: 900,
                padding: "6px 18px",
                borderRadius: 14,
              }}
            >
              {c.pastille.texte}
            </div>
          </div>
        )}
      </div>

      {image && (
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: compact ? -8 : -16,
            [cote]: 0,
            background: "#ffffff",
            padding: "12px 12px 38px",
            transform: `rotate(${gauche ? -5 : 5}deg)`,
            boxShadow: "0 12px 24px rgba(0,0,0,0.45)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- rendu par ImageResponse */}
          <img
            src={image}
            width={largeurImage}
            height={Math.round(largeurImage * 1.15)}
            alt=""
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: compact ? -20 : -26,
          ...(image ? { [cote]: compact ? 100 : 130 } : { right: 34 }),
          width: compact ? 116 : 136,
          height: compact ? 116 : 136,
          alignItems: "center",
          justifyContent: "center",
          transform: `rotate(${gauche ? -8 : 8}deg)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendu par ImageResponse */}
        <img
          src={etoile(MACARONS[index % MACARONS.length], 150)}
          width={compact ? 116 : 136}
          height={compact ? 116 : 136}
          alt=""
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#141a3a",
            fontSize: c.macaron.join("").length > 9 ? 20 : compact ? 27 : 31,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {c.macaron.map((m) => (
            <div key={m}>{m}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Flyer « Agenda du week-end » (1080 × 1920, format story), tiré de
 * l'agenda publié. `?debut=AAAA-MM-JJ` (un vendredi) pour un autre week-end.
 */
export async function GET(request: Request) {
  const debut = new URL(request.url).searchParams.get("debut") ?? undefined
  const [p, [m700, m800, m900, e800, e900, i600]] = await Promise.all([
    programmeFlyer(new Date(), debut),
    polices,
  ])

  // Six cartes au plus ; au-delà de quatre, version compacte.
  let reste = 6
  const sections = p.sections
    .map((s) => {
      const cartes = s.cartes.slice(0, Math.max(0, reste))
      reste -= cartes.length
      return { ...s, cartes }
    })
    .filter((s) => s.cartes.length)
  const affichees = sections.reduce((n, s) => n + s.cartes.length, 0)
  const compact = affichees > 4
  const images = new Map(
    await Promise.all(
      sections
        .flatMap((s) => s.cartes)
        .map(async (c) => [c.slug, await imageDe(c.visuel)] as const),
    ),
  )
  let index = 0

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: "Montserrat",
        color: "#ffffff",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- rendu par ImageResponse */}
      <img
        src={fond}
        width={L}
        height={H}
        alt=""
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 44 }}
      >
        <div style={{ display: "flex", fontSize: 46, fontWeight: 900, letterSpacing: 1 }}>
          RADIO&nbsp;<span style={{ color: JAUNE }}>TRIPOINT</span>
        </div>
        <div
          style={{
            fontSize: 196,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -6,
            textShadow: `9px 9px 0 ${ROUGE}`,
            transform: "rotate(-3deg)",
            marginTop: 8,
          }}
        >
          AGENDA
        </div>
        <div
          style={{
            display: "flex",
            background: JAUNE,
            color: "#141a3a",
            fontSize: 70,
            fontWeight: 900,
            padding: "4px 30px",
            marginTop: 6,
            marginRight: 230,
            transform: "rotate(-3deg)",
            boxShadow: `10px 10px 0 ${NUIT_FONCE}`,
          }}
        >
          DU WEEK-END !
        </div>
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 222,
          right: 18,
          width: 240,
          height: 240,
          alignItems: "center",
          justifyContent: "center",
          transform: "rotate(10deg)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendu par ImageResponse */}
        <img
          src={etoile(ROUGE, 240, 16)}
          width={240}
          height={240}
          alt=""
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: p.dates.length > 16 ? 26 : 36,
            fontWeight: 900,
            lineHeight: 1.05,
            textAlign: "center",
            maxWidth: 170,
          }}
        >
          {p.dates}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-around",
          padding: "18px 40px 34px",
        }}
      >
        {sections.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "#ffffff",
              color: "#141a3a",
              borderRadius: 28,
              padding: 50,
              transform: "rotate(-1.5deg)",
            }}
          >
            <div style={{ fontSize: 50, fontWeight: 900, textAlign: "center" }}>
              L’agenda de ce week-end arrive bientôt !
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 14, textAlign: "center" }}>
              Un événement à annoncer ? info@radio-tripoint-officiel.fr
            </div>
          </div>
        ) : (
          sections.map((s, si) => (
            <div
              key={s.titre}
              style={{ display: "flex", flexDirection: "column", position: "relative" }}
            >
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  top: 6,
                  left: -120,
                  width: L + 240,
                  height: 26,
                  background: TONS[(si + 1) % TONS.length],
                  transform: "rotate(-5deg)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  top: 38,
                  left: -120,
                  width: L + 240,
                  height: 20,
                  background: TONS[(si + 2) % TONS.length],
                  transform: "rotate(-5deg)",
                }}
              />
              <div style={{ display: "flex", justifyContent: si % 2 ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    display: "flex",
                    background: TONS[si % TONS.length],
                    fontSize: compact ? 36 : 40,
                    fontWeight: 900,
                    padding: "6px 26px",
                    textTransform: "uppercase",
                    transform: `rotate(${si % 2 ? 2 : -2}deg)`,
                    boxShadow: "0 8px 0 rgba(0,0,0,0.3)",
                  }}
                >
                  {s.titre}
                </div>
              </div>
              {s.cartes.map((c) => (
                <Carte
                  key={c.slug}
                  c={c}
                  image={images.get(c.slug) ?? null}
                  index={index++}
                  compact={compact}
                />
              ))}
            </div>
          ))
        )}
        {p.total > affichees && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 900,
              color: JAUNE,
            }}
          >
            {`+ ${p.total - affichees} autre${p.total - affichees > 1 ? "s" : ""} rendez-vous sur le site !`}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: NUIT_FONCE,
          padding: "26px 54px 32px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 46, fontWeight: 900 }}>RADIO TRIPOINT</div>
          <div
            style={{
              fontSize: 30,
              fontStyle: "italic",
              fontWeight: 600,
              color: JAUNE,
              marginTop: 4,
            }}
          >
            La radio transfrontalière
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div style={{ fontSize: 30, fontWeight: 800 }}>Tout l’agenda sur</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: JAUNE, marginTop: 4 }}>
            radio-tripoint-officiel.fr
          </div>
        </div>
      </div>
    </div>,
    {
      width: L,
      height: H,
      fonts: [
        { name: "Montserrat", data: m700, weight: 700, style: "normal" },
        { name: "Montserrat", data: m800, weight: 800, style: "normal" },
        { name: "Montserrat", data: m900, weight: 900, style: "normal" },
        { name: "Montserrat", data: e800, weight: 800, style: "normal" },
        { name: "Montserrat", data: e900, weight: 900, style: "normal" },
        { name: "Montserrat", data: i600, weight: 600, style: "italic" },
      ],
      headers: { "Cache-Control": "public, max-age=0, s-maxage=1800" },
    },
  )
}
