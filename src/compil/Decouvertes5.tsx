/**
 * « Les 5 découvertes musicales du week-end », au format de chaque vendredi
 * (repris de la vidéo modèle) : 22 s d'ouverture sur la voix de Giorgio
 * (public/compil/voix-giorgio.wav, tirée du modèle), puis un compte à
 * rebours de 5 à 1, une carte de 8 s par titre (le clip, son extrait le
 * plus fort, pays, genre, artiste, titre), et le récapitulatif « La musique
 * n'a pas de frontières ! ». Noir et or ; l'égaliseur circulaire lit
 * vraiment le son (voix, puis chaque titre).
 *
 * Pays, genres et précisions : seulement ce qui a été vérifié ; sinon rien.
 */
import { useAudioData, visualizeAudio } from "@remotion/media-utils"
import React from "react"
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion"
import { C, EXPO, prog, SORTIE } from "../commun"

const OR = C.jaune
const FPS = 30
export const OUVERTURE = 660
export const CARTE = 240
export const FIN = 120
export const DUREE_DECOUVERTES5 = OUVERTURE + 5 * CARTE + FIN

type Pays = "fr" | "de" | "lu" | "us" | "ci" | "ng" | "note"

type Titre = {
  rang: number
  video: string
  son: string
  debut: number
  artiste: string
  titre: string
  pays: Pays[]
  libellePays: string
  genre?: string
  precision: string
}

/** Dans l'ordre du compte à rebours : de 5 à 1. */
const TITRES: Titre[] = [
  {
    rang: 5,
    video: "decouvertes/d5.mp4",
    son: "decouvertes/d5.wav",
    debut: 6.9,
    artiste: "The Manky Melters",
    titre: "Festival Interceltique",
    pays: ["fr"],
    libellePays: "France",
    genre: "Folk-punk",
    precision: "Live · folk-punk celtique de Sélestat (Alsace)",
  },
  {
    rang: 4,
    video: "decouvertes/d4.mp4",
    son: "decouvertes/d4.wav",
    debut: 0.6,
    artiste: "Didi B & Khaid",
    titre: "Malade",
    pays: ["ci", "ng"],
    libellePays: "Côte d'Ivoire · Nigeria",
    genre: "Rap",
    precision: "Clip officiel",
  },
  {
    rang: 3,
    video: "decouvertes/d3.mp4",
    son: "decouvertes/d3.wav",
    debut: 9.2,
    artiste: "Blame Emeraude",
    titre: "Bunny Lady",
    pays: ["note"],
    libellePays: "Clip officiel",
    precision: "Chanté en anglais",
  },
  {
    rang: 2,
    video: "decouvertes/d2.mp4",
    son: "decouvertes/d2.wav",
    debut: 10.8,
    artiste: "Meersein",
    titre: "Ruins",
    pays: ["de"],
    libellePays: "Allemagne",
    genre: "Synthpop",
    precision: "Extrait du prochain album « Afterglow »",
  },
  {
    rang: 1,
    video: "decouvertes/d1.mp4",
    son: "decouvertes/d1.wav",
    debut: 0.7,
    artiste: "John Mayer",
    titre: "Tom and Jerry",
    pays: ["us"],
    libellePays: "États-Unis",
    genre: "Pop-rock",
    precision: "Version live vocal",
  },
]

const GENRES = ["Synthpop", "Rap", "Folk-punk", "Pop-rock"]

/* ── Typographie ─────────────────────────────────────────────────────── */

const etroit = (taille: number, couleur: string = C.blanc): React.CSSProperties => ({
  fontFamily: "Anton",
  fontSize: taille,
  lineHeight: 1,
  textTransform: "uppercase",
  color: couleur,
  textShadow: "0 6px 30px rgba(0,0,0,0.6)",
})

const gras = (taille: number, couleur: string = C.blanc, graisse = 800): React.CSSProperties => ({
  fontFamily: "Montserrat",
  fontWeight: graisse,
  fontSize: taille,
  lineHeight: 1.2,
  color: couleur,
})

const espace = (taille: number, couleur = "#d9d0bf"): React.CSSProperties => ({
  ...gras(taille, couleur, 800),
  letterSpacing: "0.22em",
  textTransform: "uppercase",
})

/* ── Drapeaux ────────────────────────────────────────────────────────── */

const Drapeau: React.FC<{ pays: Pays; l: number; rond?: boolean }> = ({ pays, l, rond }) => {
  const h = rond ? l : (l * 2) / 3
  const bandes = (couleurs: string[], vertical: boolean) =>
    couleurs.map((c, k) =>
      vertical ? (
        <rect key={k} x={(k * 30) / couleurs.length} y={0} width={30 / couleurs.length + 0.2} height={20} fill={c} />
      ) : (
        <rect key={k} x={0} y={(k * 20) / couleurs.length} width={30} height={20 / couleurs.length + 0.2} fill={c} />
      ),
    )
  let dessin: React.ReactNode
  if (pays === "fr") dessin = bandes(["#0055a4", "#ffffff", "#ef4135"], true)
  else if (pays === "de") dessin = bandes(["#000000", "#dd0000", "#ffce00"], false)
  else if (pays === "lu") dessin = bandes(["#ef3340", "#ffffff", "#00a3e0"], false)
  else if (pays === "ci") dessin = bandes(["#f77f00", "#ffffff", "#009e60"], true)
  else if (pays === "ng") dessin = bandes(["#008751", "#ffffff", "#008751"], true)
  else if (pays === "us")
    dessin = (
      <>
        {Array.from({ length: 13 }, (_, k) => (
          <rect key={k} x={0} y={(k * 20) / 13} width={30} height={20 / 13 + 0.1} fill={k % 2 ? "#ffffff" : "#b22234"} />
        ))}
        <rect x={0} y={0} width={13} height={(20 * 7) / 13} fill="#3c3b6e" />
        {Array.from({ length: 12 }, (_, k) => (
          <circle key={k} cx={1.8 + (k % 4) * 3.1} cy={1.9 + Math.floor(k / 4) * 3.4} r={0.55} fill="#fff" />
        ))}
      </>
    )
  else
    dessin = (
      <>
        <rect width={30} height={20} fill={OR} />
        <path d="M17 4 v9.2 a3 3 0 1 1 -2 -2.8 V6.5 l6 -1.2 v2.2 z" fill="#1a1206" />
      </>
    )
  return (
    <svg
      width={l}
      height={h}
      viewBox={rond ? "5 0 20 20" : "0 0 30 20"}
      preserveAspectRatio="xMidYMid slice"
      style={{ borderRadius: rond ? 999 : 6, display: "block", boxShadow: "0 0 0 2px rgba(0,0,0,0.35)" }}
    >
      {dessin}
    </svg>
  )
}

const Drapeaux: React.FC<{ pays: Pays[]; l: number }> = ({ pays, l }) => (
  <div style={{ display: "flex", gap: 6 }}>
    {pays.map((p) => (
      <Drapeau key={p} pays={p} l={l} />
    ))}
  </div>
)

/* ── Décor : fond, poussières d'or, égaliseur circulaire ─────────────── */

const hasard = (k: number) => {
  const x = Math.sin(k * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const Fond: React.FC = () => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: "#070604" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(249,184,0,0.13) 0%, transparent 70%), radial-gradient(ellipse 90% 40% at 50% 100%, rgba(255,122,26,0.16) 0%, transparent 70%)",
        }}
      />
      {Array.from({ length: 70 }, (_, k) => {
        const x = hasard(k) * 1080
        const vitesse = 0.3 + hasard(k + 99) * 0.9
        const y = (((hasard(k + 7) * 1920 - f * vitesse) % 1920) + 1920) % 1920
        const taille = 2 + hasard(k + 3) * 4
        const eclat = 0.25 + 0.6 * Math.abs(Math.sin(f * 0.05 + k))
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: taille,
              height: taille,
              borderRadius: 999,
              background: OR,
              opacity: eclat * 0.7,
              boxShadow: `0 0 ${taille * 3}px ${OR}`,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

/** Rayons d'or autour d'un centre, à la hauteur du son. */
const Anneau: React.FC<{
  son: string
  decalage: number
  cx: number
  cy: number
  rayon: number
  longueur: number
  opacite?: number
}> = ({ son, decalage, cx, cy, rayon, longueur, opacite = 1 }) => {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const donnees = useAudioData(staticFile(son))
  const N = 84
  const niveaux = donnees
    ? visualizeAudio({ fps, frame: f + decalage, audioData: donnees, numberOfSamples: 64, optimizeFor: "speed" })
    : new Array(64).fill(0)
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", left: 0, top: 0, opacity: opacite, overflow: "visible" }}
    >
      {Array.from({ length: N }, (_, k) => {
        const a = (k / N) * Math.PI * 2 - Math.PI / 2
        // Graves en haut et en bas, aigus sur les côtés : symétrique.
        const i = Math.floor((Math.abs(Math.cos(a / 1)) * 0.5 + 0.02) * 63 * 0.9)
        const v = Math.min(1, Math.sqrt(niveaux[Math.min(63, i)] ?? 0) * 2.2)
        const l = longueur * (0.12 + 0.88 * v)
        const x1 = cx + Math.cos(a) * rayon
        const y1 = cy + Math.sin(a) * rayon
        const x2 = cx + Math.cos(a) * (rayon + l)
        const y2 = cy + Math.sin(a) * (rayon + l)
        return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={OR} strokeWidth={7} strokeLinecap="round" opacity={0.55 + 0.45 * v} />
      })}
    </svg>
  )
}

const Pastille: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 106,
      right: 106,
      bottom: 300,
      height: 76,
      borderRadius: 999,
      border: `2px solid ${OR}`,
      background: "rgba(7,6,4,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      boxShadow: "0 0 30px rgba(249,184,0,0.2)",
    }}
  >
    <Img src={staticFile("logo.png")} style={{ width: 54, height: 54, borderRadius: 999 }} />
    <div style={{ ...gras(28, C.blanc, 900), letterSpacing: "0.02em" }}>
      RADIO <span style={{ color: OR }}>TRIPOINT</span> · LA RADIO TRANSFRONTALIÈRE
    </div>
  </div>
)

/* ── Ouverture ───────────────────────────────────────────────────────── */

const Ouverture: React.FC = () => {
  const f = useCurrentFrame()
  const pop = (a: number) => prog(f, a, a + 10, EXPO)
  const apparait = (a: number): React.CSSProperties => ({ opacity: pop(a), transform: `scale(${1.25 - 0.25 * pop(a)})` })
  // Bloc « Les 5 découvertes musicales du week-end » : grand, puis il remonte et rapetisse.
  const replie = prog(f, 295, 320, EXPO)
  const blocVisible = f >= 120 && f < 420
  const genre = f >= 450 && f < 570 ? GENRES[Math.min(3, Math.floor((f - 450) / 30))] : null
  const debutGenre = genre ? 450 + GENRES.indexOf(genre) * 30 : 0
  const vendredi = f >= 570
  const anneau = (f >= 20 && f < 120) || (f >= 420 && f < 570)
  return (
    <AbsoluteFill>
      <Audio src={staticFile("compil/voix-giorgio.wav")} />
      {anneau && (
        <Anneau
          son="compil/voix-giorgio.wav"
          decalage={0}
          cx={540}
          cy={800}
          rayon={200}
          longueur={110}
          opacite={prog(f, 20, 34) * (1 - prog(f, 110, 120)) + (f >= 420 ? prog(f, 420, 432) : 0)}
        />
      )}
      {f >= 45 && f < 120 && (
        <AbsoluteFill style={{ alignItems: "center", opacity: prog(f, 45, 58) * (1 - prog(f, 100, 115)) }}>
          <Img
            src={staticFile("logo.png")}
            style={{ position: "absolute", top: 610, width: 380, height: 380, borderRadius: 999, boxShadow: "0 0 80px rgba(249,184,0,0.4)" }}
          />
          <div style={{ position: "absolute", top: 1100, textAlign: "center" }}>
            <div style={espace(30)}>La radio transfrontalière</div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
              <Drapeaux pays={["fr", "de", "lu"]} l={54} />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {blocVisible && (
        <AbsoluteFill style={{ alignItems: "center", opacity: 1 - prog(f, 405, 420) }}>
          <div
            style={{
              position: "absolute",
              top: 420,
              width: 1080,
              textAlign: "center",
              transform: `translateY(${-170 * replie}px) scale(${1 - 0.38 * replie})`,
              transformOrigin: "50% 0%",
            }}
          >
            <div style={{ ...etroit(96), ...apparait(120) }}>Les</div>
            {f >= 150 && <div style={{ ...etroit(420, OR), marginTop: -10, ...apparait(150) }}>5</div>}
            {f >= 150 && <div style={{ ...etroit(150), marginTop: -6, ...apparait(158) }}>Découvertes</div>}
            {f >= 210 && <div style={{ ...etroit(150), ...apparait(210) }}>musicales</div>}
            {f >= 210 && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 18, ...apparait(218) }}>
                <div style={{ ...etroit(64, "#1a1206"), textShadow: "none", background: OR, padding: "8px 26px 4px", borderRadius: 8 }}>
                  Du week-end
                </div>
              </div>
            )}
          </div>
          <div style={{ position: "absolute", top: 1180, width: 1080, textAlign: "center" }}>
            {f >= 330 && <div style={{ ...etroit(84), ...apparait(330) }}>Nouveaux talents</div>}
            {f >= 360 && <div style={{ ...etroit(84), marginTop: 8, ...apparait(360) }}>Nouveaux sons</div>}
            {f >= 390 && <div style={{ ...etroit(84, OR), marginTop: 8, ...apparait(390) }}>Sans frontières</div>}
          </div>
        </AbsoluteFill>
      )}

      {f >= 420 && f < 570 && (
        <AbsoluteFill style={{ alignItems: "center", opacity: 1 - prog(f, 558, 570) }}>
          <div style={{ position: "absolute", top: 1150, ...espace(28, "#bfb6a5") }}>{GENRES.join(" · ")}</div>
          {genre && (
            <div
              key={genre}
              style={{
                position: "absolute",
                top: 700,
                width: 1080,
                textAlign: "center",
                ...etroit(150, OR),
                opacity: pop(debutGenre),
                transform: `scale(${(1.3 - 0.3 * pop(debutGenre)) * (1 + 0.002 * (f - debutGenre))})`,
              }}
            >
              {genre}
            </div>
          )}
        </AbsoluteFill>
      )}

      {vendredi && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            opacity: 1 - prog(f, OUVERTURE - 12, OUVERTURE),
            transform: `scale(${1 + 0.1 * prog(f, 570, OUVERTURE, SORTIE)})`,
          }}
        >
          <div style={{ position: "absolute", top: 520, width: 1080, textAlign: "center" }}>
            <div style={{ ...etroit(120), ...apparait(570) }}>Chaque</div>
            <div style={{ ...etroit(220, OR), marginTop: 4, ...apparait(578) }}>Vendredi</div>
            <div style={{ ...etroit(84), marginTop: 10, ...apparait(588) }}>Sur Radio Tripoint</div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 34, ...apparait(596) }}>
              <Drapeaux pays={["fr", "de", "lu"]} l={60} />
            </div>
            <div style={{ ...espace(30), marginTop: 26, opacity: pop(604) }}>Trois pays · une seule radio</div>
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "#000", opacity: 1 - prog(f, 0, 15) }} />
    </AbsoluteFill>
  )
}

/* ── Une carte du compte à rebours ───────────────────────────────────── */

const CARTE_X = 148
const CARTE_Y = 522
const CARTE_L = 784
const CARTE_H = 441

const Disque: React.FC<{ pays: Pays }> = ({ pays }) => {
  const f = useCurrentFrame()
  return (
    <div
      style={{
        position: "absolute",
        left: CARTE_X + CARTE_L - 86 + 10,
        top: CARTE_Y + 36 - 86,
        width: 172,
        height: 172,
        borderRadius: 999,
        background: "repeating-radial-gradient(circle, #111 0 5px, #1d1d1d 5px 7px)",
        border: `6px solid ${OR}`,
        boxShadow: "0 0 30px rgba(249,184,0,0.35)",
        display: "grid",
        placeItems: "center",
        transform: `rotate(${f * 4}deg)`,
      }}
    >
      <div style={{ borderRadius: 999, overflow: "hidden", border: "4px solid #fff" }}>
        <Drapeau pays={pays} l={70} rond />
      </div>
    </div>
  )
}

/** Volume d'un extrait : entrée en 6 images, sortie en 10. */
const volumeExtrait = (duree: number) => (x: number) =>
  interpolate(x, [0, 6, duree - 10, duree], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })

const CarteTitre: React.FC<{ t: Titre; avecSon: boolean }> = ({ t, avecSon }) => {
  const f = useCurrentFrame()
  const debut = Math.round(t.debut * FPS)
  const e = (k: number) => prog(f, 2 + k * 6, 2 + k * 6 + 14, EXPO)
  const monte = (p: number): React.CSSProperties => ({ opacity: p, transform: `translateY(${(1 - p) * 40}px)` })
  const cx = CARTE_X + CARTE_L / 2
  const cy = CARTE_Y + CARTE_H / 2
  const avance = Math.min(1, f / CARTE)
  return (
    <AbsoluteFill>
      {avecSon && <Audio src={staticFile(t.son)} trimBefore={debut} volume={volumeExtrait(CARTE)} />}
      {/* En-tête et compte à rebours */}
      <div style={{ position: "absolute", top: 200, width: 1080, textAlign: "center", ...espace(30) }}>
        Les 5 découvertes du week-end
      </div>
      <div style={{ position: "absolute", top: 250, width: 1080, display: "flex", justifyContent: "center", gap: 22 }}>
        {[5, 4, 3, 2, 1].map((n) => (
          <div key={n} style={{ ...etroit(64, n === t.rang ? OR : "rgba(217,208,191,0.28)"), textShadow: n === t.rang ? `0 0 24px ${OR}` : "none" }}>
            {n}
          </div>
        ))}
      </div>
      {/* Le grand chiffre, en filigrane derrière la carte */}
      <div
        style={{
          position: "absolute",
          top: 300,
          width: 1080,
          textAlign: "center",
          fontFamily: "Anton",
          fontSize: 820,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `4px rgba(249,184,0,${0.45 * e(0)})`,
        }}
      >
        {t.rang}
      </div>
      <Anneau son={t.son} decalage={debut} cx={cx} cy={cy} rayon={330} longueur={95} opacite={e(0)} />
      {/* Le clip */}
      <div
        style={{
          position: "absolute",
          left: CARTE_X,
          top: CARTE_Y,
          width: CARTE_L,
          height: CARTE_H,
          borderRadius: 22,
          overflow: "hidden",
          border: `5px solid ${OR}`,
          boxShadow: `0 0 50px rgba(249,184,0,0.45), 0 30px 60px rgba(0,0,0,0.6)`,
          background: "#000",
          opacity: e(0),
          transform: `scale(${0.94 + 0.06 * e(0)})`,
        }}
      >
        <OffthreadVideo src={staticFile(t.video)} trimBefore={debut} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <Disque pays={t.pays[0]} />
      {/* Pays, genre, artiste, titre */}
      <div style={{ position: "absolute", top: 1100, width: 1080, display: "flex", justifyContent: "center", gap: 18, ...monte(e(1)) }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            height: 66,
            padding: "0 24px 0 16px",
            borderRadius: 999,
            border: "2px solid rgba(255,255,255,0.28)",
            background: "rgba(255,255,255,0.07)",
          }}
        >
          <Drapeaux pays={t.pays} l={48} />
          <div style={{ ...gras(28, C.blanc, 900), letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.libellePays}</div>
        </div>
        {t.genre && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 66,
              padding: "0 26px",
              borderRadius: 999,
              background: OR,
              ...gras(28, "#1a1206", 900),
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {t.genre}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", top: 1196, width: 1080, textAlign: "center", ...etroit(t.artiste.length > 14 ? 112 : 132), ...monte(e(2)) }}>
        {t.artiste}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1350,
          width: 1080,
          textAlign: "center",
          fontFamily: "Montserrat",
          fontWeight: 800,
          fontStyle: "italic",
          fontSize: t.titre.length > 16 ? 56 : 68,
          color: OR,
          ...monte(e(5)),
        }}
      >
        « {t.titre} »
      </div>
      <div style={{ position: "absolute", top: 1446, width: 1080, textAlign: "center", ...gras(30, "#bfb6a5", 700), ...monte(e(6)) }}>
        {t.precision}
      </div>
      {/* Avancée du titre */}
      <div style={{ position: "absolute", left: 190, width: 700, top: 1506, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.14)" }}>
        <div style={{ width: `${avance * 100}%`, height: "100%", borderRadius: 3, background: OR }} />
      </div>
      <Pastille />
      <AbsoluteFill style={{ background: "#000", opacity: 1 - prog(f, 0, 5) }} />
    </AbsoluteFill>
  )
}

/* ── Fin : récapitulatif ─────────────────────────────────────────────── */

const Recap: React.FC = () => {
  const f = useCurrentFrame()
  const e = (k: number) => prog(f, 2 + k * 5, 2 + k * 5 + 14, EXPO)
  const monte = (p: number): React.CSSProperties => ({ opacity: p, transform: `translateY(${(1 - p) * 30}px)` })
  const dernier = TITRES[TITRES.length - 1]
  return (
    <AbsoluteFill>
      <Anneau
        son={dernier.son}
        decalage={Math.round(dernier.debut * FPS) + CARTE}
        cx={540}
        cy={316}
        rayon={150}
        longueur={60}
        opacite={e(0)}
      />
      <Img
        src={staticFile("logo.png")}
        style={{ position: "absolute", left: 540 - 135, top: 316 - 135, width: 270, height: 270, borderRadius: 999, boxShadow: "0 0 60px rgba(249,184,0,0.45)", ...monte(e(0)) }}
      />
      <div style={{ position: "absolute", top: 560, width: 1080, textAlign: "center", ...monte(e(1)) }}>
        <div style={etroit(82)}>La musique n&apos;a pas</div>
        <div style={{ ...etroit(82, OR), marginTop: 6 }}>de frontières !</div>
      </div>
      <div style={{ position: "absolute", top: 820, left: 120, right: 120 }}>
        {TITRES.map((t, k) => (
          <div
            key={t.rang}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              height: 108,
              borderBottom: k < TITRES.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
              ...monte(e(2 + k)),
            }}
          >
            <div style={{ ...etroit(58, OR), width: 40, textAlign: "center" }}>{t.rang}</div>
            <div style={{ width: 120, display: "flex", justifyContent: "center" }}>
              <Drapeaux pays={t.pays} l={t.pays.length > 1 ? 54 : 66} />
            </div>
            <div>
              <div style={etroit(46)}>{t.artiste}</div>
              <div style={{ ...gras(26, "#bfb6a5", 800), marginTop: 6 }}>
                <span style={{ fontStyle: "italic" }}>{t.titre}</span>
                {t.genre && <span style={{ color: OR }}> · {t.genre}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1445, width: 1080, textAlign: "center", ...gras(36, C.blanc, 800), ...monte(e(8)) }}>
        radio-tripoint-officiel.fr
      </div>
      <Pastille />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(1 - prog(f, 0, 5), prog(f, FIN - 18, FIN, SORTIE)) }} />
    </AbsoluteFill>
  )
}

export const Decouvertes5: React.FC = () => (
  <AbsoluteFill>
    <Fond />
    <Sequence durationInFrames={OUVERTURE}>
      <Ouverture />
    </Sequence>
    {TITRES.map((t, k) => {
      const dernier = k === TITRES.length - 1
      return (
        <Sequence key={t.rang} from={OUVERTURE + k * CARTE} durationInFrames={dernier ? CARTE + FIN : CARTE}>
          {dernier ? (
            <>
              {/* Le n° 1 continue sous le récapitulatif. */}
              <Audio src={staticFile(t.son)} trimBefore={Math.round(t.debut * FPS)} volume={volumeExtrait(CARTE + FIN)} />
              <Sequence durationInFrames={CARTE}>
                <CarteTitre t={t} avecSon={false} />
              </Sequence>
            </>
          ) : (
            <CarteTitre t={t} avecSon />
          )}
        </Sequence>
      )
    })}
    <Sequence from={OUVERTURE + 5 * CARTE} durationInFrames={FIN}>
      <Recap />
    </Sequence>
  </AbsoluteFill>
)
