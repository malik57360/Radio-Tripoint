/**
 * « La découverte musicale du week-end » : un clip par vidéo, recadré depuis
 * l'enregistrement d'écran YouTube (public/decouvertes, sans les pubs ni les
 * boutons), posé en carte sur sa propre image floutée. Sous le clip :
 * l'artiste, le titre, ce qu'on sait de lui (vérifié, sinon rien) et sa
 * chaîne YouTube, pour que l'on puisse le retrouver.
 */
import React from "react"
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion"
import { C, Grain, prog, SORTIE } from "../commun"

export type FicheDecouverte = {
  n: number
  src: string
  images: number
  artiste: string
  titre: string
  nature: string
  infos?: string
  chaine: string
}

export const TOTAL = 5

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

/** Anton est étroit : environ une demi-cadratin par lettre ; le mot le plus long doit tenir. */
const tailleQuiTient = (texte: string, largeur: number, max: number) =>
  Math.min(max, Math.floor(largeur / (Math.max(...texte.split(" ").map((m) => m.length)) * 0.5)))

/** Le titre, guillemets compris, sur une seule ligne. */
const tailleSurUneLigne = (texte: string, largeur: number, max: number) =>
  Math.min(max, Math.floor(largeur / (texte.length * 0.47)))

/** Petit égaliseur décoratif (il ne lit pas le son). */
const Egaliseur: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 34 }}>
    {[0, 1, 2, 3].map((k) => (
      <div
        key={k}
        style={{
          width: 7,
          borderRadius: 3,
          background: OR,
          height: 8 + 26 * Math.abs(Math.sin(f * (0.21 + k * 0.07) + k * 1.3)),
        }}
      />
    ))}
  </div>
)

export const Decouverte: React.FC<FicheDecouverte> = ({ n, src, images, artiste, titre, nature, infos, chaine }) => {
  const f = useCurrentFrame()
  const e = (k: number) => prog(f, 4 + k * 6, 4 + k * 6 + 18)
  const monte = (p: number): React.CSSProperties => ({ opacity: p, transform: `translateY(${(1 - p) * 50}px)` })
  const noir = prog(f, images - 20, images, SORTIE)
  const carte = e(1)
  return (
    <AbsoluteFill style={{ background: C.nuit }}>
      {/* Le clip lui-même, flouté, en fond */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.25)", filter: "blur(42px) saturate(1.2)" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(11,6,20,0.82) 0%, rgba(11,6,20,0.45) 28%, rgba(11,6,20,0.55) 55%, rgba(11,6,20,0.92) 100%)",
        }}
      />

      {/* En-tête */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 120, display: "flex", alignItems: "center", gap: 26, ...monte(e(0)) }}>
        <Img src={staticFile("logo.png")} style={{ width: 104, height: 104, borderRadius: 999, boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ ...plat(28, OR, 800), letterSpacing: "0.16em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Découverte musicale
            </div>
            <Egaliseur f={f} />
          </div>
          <div style={{ ...plat(40, C.blanc, 800), marginTop: 4 }}>du week-end</div>
        </div>
        <div style={{ ...etroit(56, C.nuit), textShadow: "none", background: OR, borderRadius: 14, padding: "6px 18px 4px" }}>
          {String(n).padStart(2, "0")}
          <span style={{ opacity: 0.55 }}>/{String(TOTAL).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Le clip, en carte */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 400,
          width: 1000,
          height: 562,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          border: "2px solid rgba(255,255,255,0.14)",
          opacity: carte,
          transform: `scale(${0.92 + 0.08 * carte})`,
        }}
      >
        <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 7, width: `${(f / images) * 100}%`, background: OR }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 990,
          ...plat(28, C.gris, 700),
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          opacity: e(2),
        }}
      >
        {nature}
      </div>

      {/* Qui, quoi */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 1070 }}>
        <div style={{ ...etroit(tailleQuiTient(artiste, 940, 150)), ...monte(e(2)) }}>{artiste}</div>
        <div
          style={{ ...etroit(tailleSurUneLigne(`« ${titre} »`, 940, 92), OR), whiteSpace: "nowrap", marginTop: 14, ...monte(e(3)) }}
        >
          « {titre} »
        </div>
        <div style={{ height: 6, width: 320 * e(4), background: OR, borderRadius: 3, marginTop: 30 }} />
        {infos && <div style={{ ...plat(40, C.blanc, 700), marginTop: 30, ...monte(e(5)) }}>{infos}</div>}
        <div style={{ ...plat(34, C.gris, 600), marginTop: infos ? 14 : 30, ...monte(e(6)) }}>
          Sur YouTube : <span style={{ color: C.blanc, fontWeight: 800 }}>{chaine}</span>
        </div>
      </div>

      {/* Signature */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", opacity: e(7) }}>
        <div style={etroit(54)}>Radio Tripoint</div>
        <div style={{ ...plat(30, OR, 700), marginTop: 6 }}>Le Média des trois frontières</div>
      </div>

      <Grain force={0.05} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(1 - prog(f, 0, 8), noir) }} />
    </AbsoluteFill>
  )
}

export const DECOUVERTES: FicheDecouverte[] = [
  {
    n: 1,
    src: "decouvertes/d1.mp4",
    images: 741,
    artiste: "John Mayer",
    titre: "Tom and Jerry",
    nature: "Live vocal",
    infos: "Chanteur et guitariste américain",
    chaine: "@johnmayer",
  },
  {
    n: 2,
    src: "decouvertes/d2.mp4",
    images: 714,
    artiste: "Meersein",
    titre: "Ruins",
    nature: "Clip officiel",
    infos: "Darkwave et synthpop, Allemagne",
    chaine: "@meersein_official",
  },
  {
    n: 3,
    src: "decouvertes/d3.mp4",
    images: 717,
    artiste: "Blame Emeraude",
    titre: "Bunny Lady",
    nature: "Clip officiel",
    chaine: "@blame.emeraude",
  },
  {
    n: 4,
    src: "decouvertes/d4.mp4",
    images: 442,
    artiste: "Didi B & Khaid",
    titre: "Malade",
    nature: "Clip officiel",
    infos: "Côte d'Ivoire × Nigeria",
    chaine: "@DidiBKiffnobeatTV",
  },
  {
    n: 5,
    src: "decouvertes/d5.mp4",
    images: 591,
    artiste: "The Manky Melters",
    titre: "Festival Interceltique",
    nature: "Live",
    infos: "Folk-punk celtique, Sélestat (Alsace)",
    chaine: "@themankymelters",
  },
]
