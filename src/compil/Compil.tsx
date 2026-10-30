/**
 * La vidéo du week-end, en un seul fichier : ouverture sur la voix de
 * Giorgio, l'agenda présenté par Tripo, un passage, les cinq découvertes
 * musicales, puis la fin de l'agenda (« Bon week-end ! »). Les morceaux déjà
 * rendus sont mis bout à bout par compil.sh ; ici, seulement les deux
 * cartons neufs : l'ouverture et le passage vers les découvertes.
 */
import React from "react"
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from "remotion"
import { C, Grain, prog, SORTIE } from "../commun"

const OR = C.jaune

const etroit = (taille: number, couleur: string = C.blanc): React.CSSProperties => ({
  fontFamily: "Anton",
  fontSize: taille,
  lineHeight: 1.02,
  textTransform: "uppercase",
  color: couleur,
  textShadow: "0 6px 30px rgba(0,0,0,0.55)",
})

const plat = (taille: number, couleur: string = C.blanc, graisse = 700): React.CSSProperties => ({
  fontFamily: "Montserrat",
  fontWeight: graisse,
  fontSize: taille,
  lineHeight: 1.25,
  color: couleur,
})

const Fond: React.FC = () => (
  <AbsoluteFill
    style={{ background: `radial-gradient(ellipse 120% 80% at 50% 25%, #2a1240 0%, ${C.nuit2} 45%, ${C.nuit} 100%)` }}
  />
)

/** Barres d'égaliseur décoratives (elles ne lisent pas le son). */
const Barres: React.FC<{ f: number; n: number; hauteur: number }> = ({ f, n, hauteur }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, height: hauteur }}>
    {Array.from({ length: n }, (_, k) => (
      <div
        key={k}
        style={{
          width: 12,
          borderRadius: 6,
          background: k % 3 === 1 ? C.blanc : OR,
          height: hauteur * (0.2 + 0.8 * Math.abs(Math.sin(f * (0.13 + (k % 5) * 0.03) + k * 0.9))),
        }}
      />
    ))}
  </div>
)

/** Ouverture : le titre du week-end, sur la voix de Giorgio (public/compil/voix-giorgio.wav). */
export const OuvertureWeekend: React.FC<{ duree: number; dates: string }> = ({ duree, dates }) => {
  const f = useCurrentFrame()
  const e = (k: number) => prog(f, 4 + k * 6, 4 + k * 6 + 18)
  const monte = (p: number): React.CSSProperties => ({ opacity: p, transform: `translateY(${(1 - p) * 50}px)` })
  const sortie = prog(f, duree - 12, duree, SORTIE)
  return (
    <AbsoluteFill>
      <Fond />
      <Audio src={staticFile("compil/voix-giorgio.wav")} />
      <AbsoluteFill style={{ alignItems: "center", textAlign: "center", paddingTop: 300, opacity: 1 - sortie }}>
        <Img
          src={staticFile("logo.png")}
          style={{ width: 260, height: 260, borderRadius: 999, boxShadow: "0 0 90px rgba(249,184,0,0.35)", ...monte(e(0)) }}
        />
        <div style={{ ...plat(32, OR, 800), letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 70, ...monte(e(1)) }}>
          Radio Tripoint présente
        </div>
        <div style={{ ...etroit(190), marginTop: 20, ...monte(e(2)) }}>Le week-end</div>
        <div style={{ ...etroit(96, OR), ...monte(e(3)) }}>des trois frontières</div>
        <div
          style={{
            ...plat(40, C.nuit, 900),
            background: OR,
            borderRadius: 999,
            padding: "14px 34px",
            marginTop: 50,
            ...monte(e(4)),
          }}
        >
          {dates}
        </div>
        <div style={{ marginTop: 110, opacity: e(5) }}>
          <Barres f={f} n={15} hauteur={120} />
        </div>
        <div style={{ ...plat(34, C.gris, 700), marginTop: 70, ...monte(e(6)) }}>
          L&apos;agenda · 5 découvertes musicales
        </div>
      </AbsoluteFill>
      <Grain force={0.06} />
      <AbsoluteFill style={{ background: "#000", opacity: 1 - prog(f, 0, 8) }} />
    </AbsoluteFill>
  )
}

export const DUREE_PASSAGE = 75

/** Passage de l'agenda aux découvertes musicales. */
export const PassageDecouvertes: React.FC = () => {
  const f = useCurrentFrame()
  const e = (k: number) => prog(f, 2 + k * 5, 2 + k * 5 + 14)
  const pose = (p: number): React.CSSProperties => ({ opacity: p, transform: `scale(${1.2 - 0.2 * p})` })
  const sortie = prog(f, DUREE_PASSAGE - 10, DUREE_PASSAGE, SORTIE)
  return (
    <AbsoluteFill>
      <Fond />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", opacity: 1 - sortie }}>
        <div style={{ ...plat(32, OR, 800), letterSpacing: "0.3em", textTransform: "uppercase", opacity: e(0) }}>
          Et maintenant
        </div>
        <div style={{ ...etroit(170), marginTop: 24, ...pose(e(1)) }}>Les 5</div>
        <div style={{ ...etroit(150, OR), ...pose(e(2)) }}>découvertes</div>
        <div style={{ ...etroit(150), ...pose(e(3)) }}>musicales</div>
        <div style={{ marginTop: 60, opacity: e(4) }}>
          <Barres f={f} n={11} hauteur={90} />
        </div>
      </AbsoluteFill>
      <Grain force={0.06} />
      <AbsoluteFill style={{ background: "#000", opacity: 1 - prog(f, 0, 6) }} />
    </AbsoluteFill>
  )
}
