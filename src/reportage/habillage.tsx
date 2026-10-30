/**
 * Habillage des reportages Radio Tripoint, repris du reportage sur le
 * gymnase Norbert Noël (Bouzonville, 25 oct.) : titre en capitales étroites
 * (blanc puis or) avec surtitre espacé et filet or, cartouche « Reportage ·
 * Radio Tripoint » en haut à gauche, nom à l'écran avec barre or, sous-titres
 * blancs sur pavé sombre, carton de citation entre guillemets, générique au
 * logo.
 */
import React from "react"
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion"
import { C, prog, SORTIE } from "../commun"

export const OR = C.jaune

const etroit = (taille: number, couleur: string = C.blanc): React.CSSProperties => ({
  fontFamily: "Anton",
  fontWeight: 400,
  fontSize: taille,
  lineHeight: 1.02,
  textTransform: "uppercase",
  color: couleur,
  textShadow: "0 4px 28px rgba(0,0,0,0.55)",
})

const espace = (taille: number, couleur: string = OR): React.CSSProperties => ({
  fontFamily: "Montserrat",
  fontWeight: 800,
  fontSize: taille,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: couleur,
})

const plat = (taille: number, couleur: string = C.blanc, graisse = 700): React.CSSProperties => ({
  fontFamily: "Montserrat",
  fontWeight: graisse,
  fontSize: taille,
  lineHeight: 1.25,
  color: couleur,
})

/** Le plan filmé, éventuellement flouté et assombri, avec un léger zoom. */
export const Plan: React.FC<{
  src: string
  depart?: number
  flou?: number
  sombre?: number
  zoom?: number
  /** Point fixe du zoom (le micro, en général). */
  centre?: string
}> = ({ src, depart = 0, flou = 0, sombre = 0, zoom = 1, centre = "50% 50%" }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    <OffthreadVideo
      src={staticFile(src)}
      trimBefore={depart}
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${zoom * (flou ? 1.08 : 1)})`,
        transformOrigin: centre,
        filter: flou ? `blur(${flou}px)` : undefined,
      }}
    />
    <AbsoluteFill style={{ background: `rgba(0,0,0,${sombre})` }} />
    <AbsoluteFill
      style={{ background: "radial-gradient(ellipse 90% 75% at 50% 45%, transparent 55%, rgba(0,0,0,0.45) 100%)" }}
    />
  </AbsoluteFill>
)

/** Ouverture : surtitre, deux lignes de titre, filet or et chapeau. */
export const TitreReportage: React.FC<{
  f: number
  duree: number
  surtitre: string
  ligne1: string
  ligne2: string
  chapeau: string
}> = ({ f, duree, surtitre, ligne1, ligne2, chapeau }) => {
  const e = (k: number) => prog(f, 4 + k * 5, 4 + k * 5 + 16)
  const sortie = prog(f, duree - 10, duree, SORTIE)
  const monte = (p: number): React.CSSProperties => ({
    opacity: p,
    transform: `translateY(${(1 - p) * 60}px)`,
  })
  return (
    <AbsoluteFill style={{ opacity: 1 - sortie }}>
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.25) 100%)" }}
      />
      <div style={{ position: "absolute", left: 80, right: 80, top: 960 }}>
        <div style={{ ...espace(30), ...monte(e(0)) }}>{surtitre}</div>
        <div style={{ overflow: "hidden", marginTop: 18 }}>
          <div style={{ ...etroit(150), ...monte(e(1)) }}>{ligne1}</div>
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ ...etroit(150, OR), ...monte(e(2)) }}>{ligne2}</div>
        </div>
        <div style={{ height: 6, width: 640 * e(3), background: OR, marginTop: 18, borderRadius: 3 }} />
        <div style={{ ...plat(38), marginTop: 24, maxWidth: 860, ...monte(e(4)) }}>{chapeau}</div>
      </div>
    </AbsoluteFill>
  )
}

/** Cartouche en haut à gauche, pendant le reportage. */
export const Cartouche: React.FC<{ p: number }> = ({ p }) => (
  <div
    style={{
      position: "absolute",
      left: 48,
      top: 56,
      display: "flex",
      alignItems: "center",
      gap: 20,
      opacity: p,
      transform: `translateX(${(1 - p) * -30}px)`,
    }}
  >
    <Img
      src={staticFile("logo.png")}
      style={{ width: 92, height: 92, borderRadius: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.45)" }}
    />
    <div>
      <div style={espace(24)}>Reportage</div>
      <div style={{ ...plat(30, C.blanc, 800), marginTop: 2, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>Radio Tripoint</div>
    </div>
  </div>
)

/** Nom à l'écran : barre or, nom en blanc, précision en or. */
export const Tiers: React.FC<{ p: number; nom: string; precision: string }> = ({ p, nom, precision }) => (
  <div
    style={{
      position: "absolute",
      left: 80,
      top: 1150,
      display: "flex",
      gap: 22,
      padding: "18px 30px 18px 22px",
      borderRadius: 14,
      background: "rgba(10,8,14,0.62)",
      opacity: p,
      transform: `translateX(${(1 - p) * -60}px)`,
    }}
  >
    <div style={{ width: 7, borderRadius: 4, background: OR, transform: `scaleY(${p})` }} />
    <div>
      <div style={plat(42, C.blanc, 800)}>{nom}</div>
      <div style={{ ...plat(30, OR, 700), marginTop: 4 }}>{precision}</div>
    </div>
  </div>
)

/** Sous-titre : une ligne blanche (or pour la question de la radio) sur pavé sombre. */
export const SousTitre: React.FC<{ texte: string; question?: boolean; p: number }> = ({ texte, question, p }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 1420, display: "flex", justifyContent: "center" }}>
    <div
      style={{
        ...plat(48, question ? OR : C.blanc, 800),
        textAlign: "center",
        padding: "12px 26px",
        borderRadius: 12,
        background: "rgba(10,8,14,0.66)",
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
      }}
    >
      {texte}
    </div>
  </div>
)

/** Carton de citation, entre guillemets or, sur le plan assombri. */
export const Citation: React.FC<{
  f: number
  surtitre: string
  ligne1: string
  ligne2: string
  appel?: [string, string]
}> = ({ f, surtitre, ligne1, ligne2, appel }) => {
  const e = (k: number) => prog(f, 2 + k * 5, 2 + k * 5 + 16)
  const pose = (p: number): React.CSSProperties => ({ opacity: p, transform: `scale(${1.15 - 0.15 * p})` })
  return (
    <AbsoluteFill style={{ alignItems: "center", textAlign: "center", paddingTop: 560 }}>
      <div style={{ ...espace(28), opacity: e(0) }}>{surtitre}</div>
      <div style={{ ...etroit(110, OR), marginTop: 30, ...pose(e(1)) }}>«</div>
      <div style={{ ...etroit(140), ...pose(e(2)) }}>{ligne1}</div>
      <div style={{ ...etroit(140, OR), ...pose(e(3)) }}>{ligne2}</div>
      <div style={{ ...etroit(110, OR), ...pose(e(4)) }}>»</div>
      {appel && (
        <div style={{ marginTop: 70, opacity: e(7), transform: `translateY(${(1 - e(7)) * 30}px)` }}>
          <div style={plat(44, C.blanc, 800)}>{appel[0]}</div>
          <div style={{ ...plat(34, OR, 700), marginTop: 8 }}>{appel[1]}</div>
        </div>
      )}
    </AbsoluteFill>
  )
}

/** Générique : logo, nom de la radio, devise, adresse ; fondu au noir. */
export const Generique: React.FC<{ f: number; duree: number }> = ({ f, duree }) => {
  const e = (k: number) => prog(f, 2 + k * 6, 2 + k * 6 + 18)
  const noir = prog(f, duree - 24, duree, SORTIE)
  return (
    <AbsoluteFill style={{ alignItems: "center", textAlign: "center", paddingTop: 640 }}>
      <Img
        src={staticFile("logo.png")}
        style={{
          width: 230,
          height: 230,
          borderRadius: 999,
          boxShadow: "0 0 90px rgba(249,184,0,0.35)",
          opacity: e(0),
          transform: `scale(${0.8 + 0.2 * e(0)})`,
        }}
      />
      <div style={{ ...etroit(120), marginTop: 50, opacity: e(1) }}>Radio Tripoint</div>
      <div style={{ ...plat(40, OR, 700), marginTop: 10, opacity: e(2) }}>Le Média des trois frontières</div>
      <div style={{ ...plat(32, C.gris, 600), marginTop: 26, opacity: e(3) }}>radio-tripoint-officiel.fr</div>
      <AbsoluteFill style={{ background: "#000", opacity: noir }} />
    </AbsoluteFill>
  )
}
