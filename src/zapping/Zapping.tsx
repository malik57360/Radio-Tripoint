/**
 * « Le zapping du week-end » : les moments de la semaine en plans courts,
 * comme une télé qu'on zappe. Chaque changement de plan passe par la neige
 * de l'écran ; numéro de chaîne en haut, légende en autocollant, sous-titres
 * de ce qui est dit (transcrit et vérifié). Gags : l'essai raté (« RATÉ »),
 * l'avance rapide, le panier au ralenti avec confettis, et « on coupe, on
 * coupe ! » qui coupe vraiment. Plans découpés par outils/decoupe_zapping.py
 * (public/zapping/timeline.json). Pas d'enfants à l'image.
 */
import React from "react"
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion"
import timeline from "../../public/zapping/timeline.json"
import { C, EXPO, prog } from "../commun"

type Plan = {
  nom: string
  images: number
  chaine: string | null
  legende: string | null
  sous_titres: { t: number; texte: string }[]
  effet: string | null
}
const PLANS = timeline as Plan[]
const FPS = 30
export const OUVERTURE_ZAP = 75
const DEBUTS = PLANS.map((_, k) => OUVERTURE_ZAP + PLANS.slice(0, k).reduce((a, p) => a + p.images, 0))
export const DUREE_ZAPPING = OUVERTURE_ZAP + PLANS.reduce((a, p) => a + p.images, 0)
const FIGE_RATE = 18
const FIGE_COUPE = 24
const FIGE_SON = 60

const COULEURS = [C.jaune, C.orange, "#8546c2", C.blanc, "#19c3a6"]

const etroit = (taille: number, couleur: string = C.blanc): React.CSSProperties => ({
  fontFamily: "Anton",
  fontSize: taille,
  lineHeight: 1,
  textTransform: "uppercase",
  color: couleur,
})

/* ── Neige de l'écran ────────────────────────────────────────────────── */

const Neige: React.FC<{ opacite: number; graine: number }> = ({ opacite, graine }) =>
  opacite <= 0 ? null : (
    <AbsoluteFill style={{ opacity: opacite, pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`neige-${graine}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={graine} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="2.2" intercept="-0.6" />
            <feFuncG type="linear" slope="2.2" intercept="-0.6" />
            <feFuncB type="linear" slope="2.2" intercept="-0.6" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter={`url(#neige-${graine})`} />
      </svg>
      {/* Bandes de décrochage */}
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: ((graine * 137 + k * 641) % 1800) + 20,
            height: 30 + ((graine + k * 7) % 5) * 22,
            background: k === 1 ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.6)",
          }}
        />
      ))}
    </AbsoluteFill>
  )

/** Lignes de balayage et coins sombres, pour l'effet télé. */
const Ecran: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 2px, transparent 2px, transparent 5px)",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)" }} />
  </AbsoluteFill>
)

/* ── Confettis ───────────────────────────────────────────────────────── */

const hasard = (k: number) => {
  const x = Math.sin(k * 91.7 + 17.3) * 43758.5453
  return x - Math.floor(x)
}

const Confettis: React.FC<{ depuis: number }> = ({ depuis }) => {
  const f = useCurrentFrame() - depuis
  if (f < 0) return null
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 90 }, (_, k) => {
        const x0 = 540 + (hasard(k) - 0.5) * 300
        const vx = (hasard(k + 1) - 0.5) * 46
        const vy = -30 - hasard(k + 2) * 30
        const x = x0 + vx * f
        const y = 700 + vy * f + 1.6 * f * f
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 18,
              height: 30,
              background: COULEURS[k % COULEURS.length],
              transform: `rotate(${f * (8 + (k % 7) * 5)}deg)`,
              borderRadius: 3,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

/* ── Habillage d'un plan ─────────────────────────────────────────────── */

const Tampon: React.FC<{ texte: string; couleur: string; p: number; inclinaison?: number }> = ({ texte, couleur, p, inclinaison = -12 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
    <div
      style={{
        ...etroit(230, couleur),
        border: `14px solid ${couleur}`,
        borderRadius: 26,
        padding: "10px 46px 0",
        transform: `rotate(${inclinaison}deg) scale(${2.2 - 1.2 * p})`,
        opacity: p,
        textShadow: "0 8px 40px rgba(0,0,0,0.6)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        background: "rgba(0,0,0,0.25)",
      }}
    >
      {texte}
    </div>
  </AbsoluteFill>
)

const PlanZapping: React.FC<{ p: Plan; k: number }> = ({ p, k }) => {
  const f = useCurrentFrame()
  const zap = 1 - prog(f, 0, 6)
  const decale = zap > 0 ? Math.sin(f * 3.1 + k) * 40 * zap : 0
  const fige = (p.effet === "rate" && f >= p.images - FIGE_RATE) || (p.effet === "fige_son" && f >= p.images - FIGE_SON)
  const coupe = p.effet === "coupe" && f >= p.images - FIGE_COUPE
  const zoom =
    p.effet === "zoom" ? (f < 4 ? 1 : 1.18 + 0.1 * prog(f, 4, p.images)) : p.effet === "fin" ? 1 + 0.06 * prog(f, 0, p.images) : 1
  const legende = prog(f, 6, 14, EXPO)
  const couleur = COULEURS[k % COULEURS.length]
  const st = [...p.sous_titres].reverse().find((s) => f >= s.t * FPS)
  const imageBall = 50 // le ballon entre dans le panier (ralenti)
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {!coupe && (
        <AbsoluteFill style={{ transform: `translateX(${decale}px) scale(${zoom})`, filter: fige ? "grayscale(1) contrast(1.2)" : undefined }}>
          <OffthreadVideo src={staticFile(`zapping/${p.nom}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      )}
      {/* Décalage des couleurs à l'arrivée sur la chaîne */}
      {zap > 0 && !coupe && (
        <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.5 * zap, transform: `translateX(${-decale * 0.6}px)` }}>
          <OffthreadVideo src={staticFile(`zapping/${p.nom}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(1) hue-rotate(300deg) saturate(6)" }} />
        </AbsoluteFill>
      )}
      <Ecran />

      {/* Numéro de chaîne, façon télé */}
      {p.chaine && !coupe && (
        <div style={{ position: "absolute", left: 56, top: 120, opacity: f < 50 ? 1 : 0.8 }}>
          <div style={{ ...etroit(f < 40 ? 96 : 60, "#7dff6a"), textShadow: "0 0 18px rgba(125,255,106,0.6), 3px 3px 0 #000", transition: "none" }}>
            {p.chaine.split(" · ")[0]}
          </div>
          {p.chaine.includes(" · ") && (
            <div style={{ ...etroit(f < 40 ? 44 : 34, C.blanc), marginTop: 6, textShadow: "3px 3px 0 #000" }}>{p.chaine.split(" · ")[1]}</div>
          )}
        </div>
      )}
      {p.effet === "avance" && (
        <div style={{ position: "absolute", right: 60, top: 130, ...etroit(120, C.blanc), textShadow: "4px 4px 0 #000", opacity: Math.floor(f / 6) % 2 ? 1 : 0.4 }}>
          {">> ×3"}
        </div>
      )}
      {p.effet === "panier" && (
        <>
          <div style={{ position: "absolute", left: 56, top: 120, ...etroit(96, C.orange), textShadow: "3px 3px 0 #000" }}>Ralenti</div>
          <div style={{ position: "absolute", right: 56, top: 132, ...etroit(60, C.blanc), textShadow: "3px 3px 0 #000", opacity: Math.floor(f / 10) % 2 ? 1 : 0.3 }}>
            <span style={{ display: "inline-block", width: 34, height: 34, borderRadius: 99, background: "#ff2d2d", marginRight: 14, verticalAlign: "middle" }} />
            Replay
          </div>
          <Confettis depuis={imageBall} />
          <Tampon texte="Panier !" couleur={C.jaune} p={prog(f, imageBall, imageBall + 8, EXPO)} inclinaison={-8} />
        </>
      )}
      {fige && p.effet === "rate" && <Tampon texte="Raté" couleur="#ff2d2d" p={prog(f, p.images - FIGE_RATE, p.images - FIGE_RATE + 6, EXPO)} />}
      {fige && p.effet === "fige_son" && (
        <div style={{ position: "absolute", right: 60, top: 130, display: "flex", alignItems: "center", gap: 16, opacity: Math.floor(f / 8) % 2 ? 1 : 0.35 }}>
          <div style={{ width: 22, height: 80, background: C.blanc, boxShadow: "3px 3px 0 #000" }} />
          <div style={{ width: 22, height: 80, background: C.blanc, boxShadow: "3px 3px 0 #000" }} />
          <div style={{ ...etroit(84, C.blanc), marginLeft: 10, textShadow: "4px 4px 0 #000" }}>Pause</div>
        </div>
      )}

      {/* Légende en autocollant */}
      {p.legende && !coupe && !(p.effet === "rate" && fige) && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1260, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              ...etroit(p.legende.length > 24 ? 70 : 90, couleur === C.blanc ? "#111" : couleur === C.jaune ? "#111" : C.blanc),
              background: couleur,
              padding: "16px 34px 10px",
              borderRadius: 14,
              transform: `rotate(${k % 2 ? 3 : -3}deg) scale(${0.4 + 0.6 * legende})`,
              opacity: legende,
              boxShadow: "0 12px 34px rgba(0,0,0,0.45)",
              maxWidth: 940,
              textAlign: "center",
            }}
          >
            {p.legende}
          </div>
        </div>
      )}

      {/* Sous-titres de ce qui est dit */}
      {st && !coupe && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 1560, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: "Montserrat",
              fontWeight: 800,
              fontSize: 50,
              lineHeight: 1.22,
              color: C.blanc,
              background: "rgba(0,0,0,0.72)",
              padding: "12px 26px",
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            {st.texte}
          </div>
        </div>
      )}

      {/* « On coupe ! » : on coupe vraiment */}
      {coupe && (
        <>
          <Neige opacite={1} graine={f} />
          <Tampon texte="Coupé !" couleur={C.blanc} p={prog(f, p.images - FIGE_COUPE, p.images - FIGE_COUPE + 5, EXPO)} inclinaison={6} />
        </>
      )}

      {/* La fin : bon week-end, puis la télé s'éteint */}
      {p.effet === "fin" && (
        <>
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 560, background: `rgba(0,0,0,${0.45 * prog(f, 0, 10)})` }}>
            <Img
              src={staticFile("logo.png")}
              style={{ width: 260, height: 260, borderRadius: 999, opacity: prog(f, 4, 14), transform: `scale(${0.6 + 0.4 * prog(f, 4, 14, EXPO)})` }}
            />
            <div style={{ ...etroit(150), marginTop: 50, opacity: prog(f, 8, 16), textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>Bon week-end !</div>
            <div style={{ ...etroit(64, C.jaune), marginTop: 18, opacity: prog(f, 12, 20) }}>Le zapping · Radio Tripoint</div>
          </AbsoluteFill>
          <Eteindre debut={p.images - 12} />
        </>
      )}

      <Neige opacite={zap} graine={k * 31 + f} />
      <AbsoluteFill style={{ background: "#fff", opacity: f === 0 ? 0.8 : 0 }} />
    </AbsoluteFill>
  )
}

/** La télé s'éteint : l'image s'écrase en une ligne, puis en un point. */
const Eteindre: React.FC<{ debut: number }> = ({ debut }) => {
  const f = useCurrentFrame() - debut
  if (f < 0) return null
  const ligne = prog(f, 0, 6)
  const point = prog(f, 6, 12)
  return (
    <AbsoluteFill style={{ background: "#000", clipPath: `inset(${50 * ligne - 0.2}% ${50 * point}% ${50 * ligne - 0.2}% ${50 * point}%)` }}>
      <AbsoluteFill style={{ background: "#fff", opacity: 0.9 }} />
    </AbsoluteFill>
  )
}

/* ── Ouverture : la télé s'allume ────────────────────────────────────── */

const Allumage: React.FC = () => {
  const f = useCurrentFrame()
  const ligne = prog(f, 2, 8)
  const ouverture = prog(f, 8, 14, EXPO)
  const titre = prog(f, 18, 26, EXPO)
  const secoue = f >= 18 && f < 26 ? Math.sin(f * 5) * 14 : 0
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ clipPath: `inset(${50 - 50 * ouverture - 0.3 * ligne}% 0% ${50 - 50 * ouverture - 0.3 * ligne}% 0%)`, opacity: ligne }}>
        <Neige opacite={1 - prog(f, 22, 40) * 0.75} graine={f} />
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 50% at 50% 50%, rgba(133,70,194,0.55), rgba(0,0,0,0.9))`, opacity: prog(f, 16, 26) }} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateX(${secoue}px)` }}>
          <Img src={staticFile("logo.png")} style={{ width: 200, height: 200, borderRadius: 999, opacity: titre, marginBottom: 40 }} />
          <div style={{ position: "relative", ...etroit(230), opacity: titre, transform: `scale(${1.8 - 0.8 * titre}) rotate(-4deg)` }}>
            <span style={{ position: "absolute", left: 8, top: 0, color: "#ff2d6f", opacity: 0.8 }}>Le zapping</span>
            <span style={{ position: "absolute", left: -8, top: 0, color: "#2de0ff", opacity: 0.8 }}>Le zapping</span>
            <span style={{ position: "relative" }}>Le zapping</span>
          </div>
          <div
            style={{
              ...etroit(96, "#111"),
              background: C.jaune,
              padding: "12px 34px 6px",
              borderRadius: 14,
              marginTop: 26,
              opacity: prog(f, 26, 32),
              transform: `rotate(3deg) scale(${0.5 + 0.5 * prog(f, 26, 32, EXPO)})`,
            }}
          >
            du week-end
          </div>
        </AbsoluteFill>
        <Ecran />
      </AbsoluteFill>
      <Neige opacite={prog(f, OUVERTURE_ZAP - 6, OUVERTURE_ZAP)} graine={f + 900} />
    </AbsoluteFill>
  )
}

export const Zapping: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence durationInFrames={OUVERTURE_ZAP}>
      <Allumage />
    </Sequence>
    {PLANS.map((p, k) => (
      <Sequence key={p.nom} from={DEBUTS[k]} durationInFrames={p.images}>
        <PlanZapping p={p} k={k} />
      </Sequence>
    ))}
  </AbsoluteFill>
)

export const REPERES_ZAPPING = { debuts: DEBUTS, plans: PLANS.map((p) => ({ nom: p.nom, images: p.images, effet: p.effet })) }
