/**
 * « Tripo te présente le week-end » : l'agenda du vendredi 30 octobre au
 * dimanche 1er novembre 2026, spécial Halloween. Les cinq sorties viennent
 * de data/events.ts du site (dates, heures, lieux, tarifs publiés) ; rien
 * n'est ajouté. Tripo, la mascotte du guide, ouvre, accompagne et ferme.
 *
 * Nuit d'automne : fond violet nuit, lune orangée, brume qui glisse ; le
 * jaune de la radio pour les dates et les puces, l'orange pour Halloween.
 */
import React from "react"
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion"
import { C, EXPO, Grain, SORTIE, prog, texte, titre } from "../commun"
import { Mascotte } from "../Mascotte"

export const INTRO = 120
export const CARTE = 132
export const OUTRO = 150

type Pays = "FR" | "DE"
type Sortie = {
  jour: string
  titre: string
  accroche: string
  lieu: string
  ville: string
  pays: Pays
  tarif?: string
  affiche?: string
  icone: "lune" | "carte" | "film" | "fete" | "levres"
}

/** data/events.ts, week-end du 30 octobre au 1er novembre 2026, dans l'ordre des horaires. */
const SORTIES: Sortie[] = [
  {
    jour: "Ven. 30 & sam. 31 · à la nuit tombée",
    titre: "Loup-Garou au château",
    accroche: "Jeu grandeur nature spécial Halloween, dès 16 ans",
    lieu: "Château de Sierck",
    ville: "Sierck-les-Bains",
    pays: "FR",
    tarif: "16 €",
    icone: "lune",
  },
  {
    jour: "Sam. 31 · 15 h",
    titre: "Rallye d'Halloween",
    accroche: "Thionville à découvrir, sur réservation",
    lieu: "Office de tourisme",
    ville: "Thionville",
    pays: "FR",
    icone: "carte",
  },
  {
    jour: "Sam. 31 · 18 h",
    titre: "Ciné-Culte : Poltergeist",
    accroche: "Le classique de 1982 en VF, spécial Halloween",
    lieu: "La Scala",
    ville: "Thionville",
    pays: "FR",
    tarif: "7 €",
    icone: "film",
  },
  {
    jour: "Sam. 31 · 18 h → minuit",
    titre: "Halloweenparty",
    accroche: "De 18 h à minuit, dès 14 ans",
    lieu: "Vereinshaus",
    ville: "Perl",
    pays: "DE",
    affiche: "affiches/halloweenparty-vereinshaus-perl-2026.jpg",
    icone: "fete",
  },
  {
    jour: "Sam. 31 · 20 h 30",
    titre: "Rocky Horror Picture Show",
    accroche: "Présenté par les drag queens d'Osmose Thionville",
    lieu: "La Scala",
    ville: "Thionville",
    pays: "FR",
    icone: "levres",
  },
]

/** Taille du titre d'une carte : le mot le plus long doit tenir sur 920 px. */
const tailleTitre = (t: string) => Math.min(128, Math.floor(920 / (Math.max(...t.split(" ").map((m) => m.length)) * 0.74)))

export const DUREE_TRIPO_WEEKEND = INTRO + SORTIES.length * CARTE + OUTRO
const DEBUT_OUTRO = INTRO + SORTIES.length * CARTE

/* ─── Le décor ──────────────────────────────────────────────────────────── */

const Ciel: React.FC = () => {
  const f = useCurrentFrame()
  const brume = (k: number) => ((f * (0.6 + k * 0.25)) % 1600) - 400
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 120% 80% at 50% 20%, #2a1240 0%, ${C.nuit2} 45%, ${C.nuit} 100%)` }}>
      {/* La lune, qui monte doucement, et file en haut pour la fin */}
      <div
        style={{
          position: "absolute",
          right: 70,
          bottom: 300 + f * 0.05 + 1150 * prog(f, DEBUT_OUTRO - 10, DEBUT_OUTRO + 24),
          width: 280,
          height: 280,
          borderRadius: 999,
          background: "radial-gradient(circle at 38% 35%, #ffe2a8 0%, #ffb347 45%, #e2701a 100%)",
          boxShadow: "0 0 160px 40px rgba(255,140,40,0.35)",
          opacity: 0.9,
        }}
      />
      {/* Brume en trois couches */}
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: brume(k),
            top: 1150 + k * 210,
            width: 1400,
            height: 260,
            borderRadius: 999,
            background: "rgba(200,170,255,0.07)",
            filter: "blur(40px)",
          }}
        />
      ))}
    </AbsoluteFill>
  )
}

/** Tripo qui respire et cligne des yeux. */
const Tripo: React.FC<{ taille: number; decalage?: number }> = ({ taille, decalage = 0 }) => {
  const f = useCurrentFrame() + decalage
  const souffle = Math.sin(f / 9) * 0.018
  const cycle = f % 96
  const ouverture = cycle < 3 ? 1 - cycle / 3 : cycle < 6 ? (cycle - 3) / 3 : 1
  return (
    <div style={{ width: taille, transform: `translateY(${Math.sin(f / 14) * 10}px) scale(${1 + souffle}, ${1 - souffle})`, transformOrigin: "50% 100%" }}>
      <Mascotte ouverture={ouverture} />
    </div>
  )
}

const Bulle: React.FC<{ texte: string; p: number; queue?: "gauche" | "droite" }> = ({ texte: t, p, queue = "gauche" }) => (
  <div
    style={{
      position: "relative",
      background: C.blanc,
      color: C.nuit2,
      borderRadius: 34,
      padding: "22px 34px",
      ...texte(40, C.nuit2, 800),
      transform: `scale(${0.6 + 0.4 * p})`,
      transformOrigin: queue === "gauche" ? "0% 100%" : "100% 100%",
      opacity: p,
      boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
      maxWidth: 520,
    }}
  >
    {t}
    <div
      style={{
        position: "absolute",
        bottom: -18,
        [queue === "gauche" ? "left" : "right"]: 46,
        width: 0,
        height: 0,
        borderLeft: "18px solid transparent",
        borderRight: "18px solid transparent",
        borderTop: `22px solid ${C.blanc}`,
      }}
    />
  </div>
)

/* ─── Icônes des sorties ────────────────────────────────────────────────── */

const Icone: React.FC<{ nom: Sortie["icone"]; taille: number }> = ({ nom, taille }) => {
  const trait = { fill: "none", stroke: C.jaune, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  return (
    <svg width={taille} height={taille} viewBox="0 0 100 100">
      {nom === "lune" && (
        <>
          <path d="M62 14a38 38 0 1 0 24 62A32 32 0 0 1 62 14Z" {...trait} />
          <path d="M28 70l6-10 6 10M52 78l4-7 4 7" {...trait} />
        </>
      )}
      {nom === "carte" && (
        <>
          <path d="M12 22l24-8 28 10 24-8v62l-24 8-28-10-24 8Z" {...trait} />
          <path d="M36 14v62M64 24v62" {...trait} />
          <circle cx="50" cy="48" r="6" {...trait} />
        </>
      )}
      {nom === "film" && (
        <>
          <rect x="14" y="22" width="72" height="56" rx="6" {...trait} />
          <path d="M14 36h72M14 64h72M30 22v14M50 22v14M70 22v14M30 64v14M50 64v14M70 64v14" {...trait} />
        </>
      )}
      {nom === "fete" && (
        <>
          <path d="M20 84L38 30l32 32Z" {...trait} />
          <path d="M60 18v8M78 30h-8M74 16l-6 6M84 50l-8-2" {...trait} />
        </>
      )}
      {nom === "levres" && (
        <>
          <path d="M12 52c12-18 26-20 38-12 12-8 26-6 38 12-14 20-62 20-76 0Z" {...trait} />
          <path d="M12 52c24 6 52 6 76 0" {...trait} />
        </>
      )}
    </svg>
  )
}

const Drapeau: React.FC<{ pays: Pays }> = ({ pays }) => {
  const bandes = pays === "FR" ? ["#0055a4", "#ffffff", "#ef4135"] : ["#000000", "#dd0000", "#ffce00"]
  return (
    <div style={{ display: "flex", flexDirection: pays === "FR" ? "row" : "column", width: 54, height: 36, borderRadius: 6, overflow: "hidden", boxShadow: "0 0 0 2px rgba(255,255,255,0.6)" }}>
      {bandes.map((c) => (
        <div key={c} style={{ flex: 1, background: c }} />
      ))}
    </div>
  )
}

/* ─── Les scènes ────────────────────────────────────────────────────────── */

const Ouverture: React.FC = () => {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const arrivee = spring({ frame: f - 4, fps, config: { damping: 12, mass: 0.8 } })
  const bulle = prog(f, 22, 34)
  const ligne = (k: number) => prog(f, 40 + k * 7, 40 + k * 7 + 16)
  const sortie = prog(f, INTRO - 10, INTRO, SORTIE)
  return (
    <AbsoluteFill style={{ opacity: 1 - sortie, transform: `translateY(${-sortie * 80}px)` }}>
      <div style={{ position: "absolute", left: 80, top: 330 }}>
        <div style={{ ...titre(46, C.orange), letterSpacing: "0.32em", opacity: ligne(0) }}>Spécial Halloween</div>
        {["Ce", "week-end"].map((mot, k) => (
          <div key={mot} style={{ overflow: "hidden" }}>
            <div style={{ ...titre(k ? 168 : 130, k ? C.jaune : C.blanc), whiteSpace: "nowrap", transform: `translateY(${(1 - ligne(k + 1)) * 110}%)` }}>{mot}</div>
          </div>
        ))}
        <div style={{ ...texte(56, C.blanc, 800), marginTop: 22, opacity: ligne(3), transform: `translateX(${(1 - ligne(3)) * -40}px)` }}>
          dans les Trois Frontières
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 34,
            padding: "14px 26px",
            borderRadius: 16,
            background: C.jaune,
            ...texte(44, C.nuit, 900),
            transform: `rotate(-2deg) scale(${0.7 + 0.3 * ligne(4)})`,
            opacity: ligne(4),
          }}
        >
          Ven. 30 oct. → dim. 1er nov.
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 230, transform: `translateY(${(1 - arrivee) * 700}px)` }}>
        <Tripo taille={430} />
      </div>
      <div style={{ position: "absolute", left: 480, bottom: 650 }}>
        <Bulle texte="Salut ! Voici le programme." p={bulle} />
      </div>
    </AbsoluteFill>
  )
}

const Carte: React.FC<{ s: Sortie; i: number }> = ({ s, i }) => {
  const f = useCurrentFrame()
  const entree = prog(f, 0, 16)
  const el = (k: number) => prog(f, 6 + k * 5, 6 + k * 5 + 16)
  const sortie = prog(f, CARTE - 10, CARTE, SORTIE)
  const affiche = s.affiche ? prog(f, 18, 36) : 0
  return (
    <AbsoluteFill style={{ opacity: 1 - sortie, transform: `translateX(${-sortie * 120}px)` }}>
      {/* Volet jaune qui balaie l'écran à l'entrée */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.jaune,
          transform: `translateX(${interpolate(f, [0, 10], [0, 110], { extrapolateRight: "clamp" })}%) skewX(-12deg)`,
          opacity: f < 11 ? 1 : 0,
        }}
      />
      <div style={{ position: "absolute", left: 80, right: 80, top: 250, opacity: entree }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ ...texte(34, C.gris, 800), letterSpacing: "0.2em" }}>
            {String(i + 1).padStart(2, "0")} <span style={{ opacity: 0.5 }}>/ {String(SORTIES.length).padStart(2, "0")}</span>
          </div>
          <div style={{ transform: `rotate(${(1 - el(0)) * -40}deg) scale(${0.6 + 0.4 * el(0)})`, opacity: el(0) }}>
            <Icone nom={s.icone} taille={130} />
          </div>
        </div>
        <div style={{ display: "inline-block", marginTop: 26, padding: "12px 22px", borderRadius: 14, background: C.jaune, ...texte(40, C.nuit, 900), opacity: el(1), transform: `translateY(${(1 - el(1)) * 20}px)` }}>
          {s.jour}
        </div>
        <div style={{ overflow: "hidden", marginTop: 34 }}>
          <div style={{ ...titre(tailleTitre(s.titre)), transform: `translateY(${(1 - el(2)) * 100}%)` }}>{s.titre}</div>
        </div>
        <div style={{ ...texte(46, "#efe7ff", 700), marginTop: 30, maxWidth: 880, opacity: el(3), transform: `translateY(${(1 - el(3)) * 20}px)` }}>{s.accroche}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 50, opacity: el(4) }}>
          <svg width="44" height="44" viewBox="0 0 24 24">
            <path d="M12 22s7-7.2 7-12.5A7 7 0 0 0 5 9.5C5 14.8 12 22 12 22Z" fill={C.orange} />
            <circle cx="12" cy="9.5" r="2.6" fill={C.nuit} />
          </svg>
          <div>
            <div style={texte(46, C.blanc, 800)}>{s.lieu}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6 }}>
              <div style={texte(38, C.gris, 700)}>{s.ville}</div>
              <Drapeau pays={s.pays} />
            </div>
          </div>
          {s.tarif && (
            <div style={{ marginLeft: "auto", padding: "10px 22px", borderRadius: 999, border: `4px solid ${C.jaune}`, ...texte(44, C.jaune, 900) }}>{s.tarif}</div>
          )}
        </div>
      </div>
      {s.affiche && (
        <div
          style={{
            position: "absolute",
            right: 90,
            bottom: 300,
            width: 400,
            padding: 16,
            paddingBottom: 54,
            background: "#fbf7ee",
            borderRadius: 8,
            boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
            transform: `rotate(${4 - affiche * 2}deg) translateY(${(1 - affiche) * 300}px)`,
            opacity: affiche,
          }}
        >
          <Img src={staticFile(s.affiche)} style={{ width: "100%", display: "block", borderRadius: 3 }} />
          <div style={{ ...texte(26, "#3b2c4a", 800), textAlign: "center", marginTop: 12 }}>L'affiche</div>
        </div>
      )}
      {!s.affiche && (
        <div style={{ position: "absolute", left: 70, bottom: 250, opacity: el(4) }}>
          <Tripo taille={230} decalage={i * 17} />
        </div>
      )}
    </AbsoluteFill>
  )
}

const Fin: React.FC = () => {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const saut = spring({ frame: f - 2, fps, config: { damping: 10 } })
  const el = (k: number) => prog(f, 8 + k * 7, 8 + k * 7 + 18)
  const fondu = prog(f, OUTRO - 14, OUTRO, SORTIE)
  return (
    <AbsoluteFill style={{ alignItems: "center", opacity: 1 - fondu }}>
      <div style={{ marginTop: 300, transform: `scale(${0.5 + 0.5 * saut})` }}>
        <Tripo taille={380} decalage={40} />
      </div>
      <div style={{ marginTop: -40 }}>
        <Bulle texte="Bon week-end !" p={prog(f, 14, 26)} queue="droite" />
      </div>
      <div style={{ ...titre(120, C.jaune), marginTop: 70, opacity: el(1), transform: `translateY(${(1 - el(1)) * 40}px)` }}>Tout l'agenda</div>
      <div style={{ marginTop: 26, padding: "14px 28px", borderRadius: 16, background: C.blanc, ...texte(42, C.nuit, 900), opacity: el(2) }}>
        radio-tripoint-officiel.fr/agenda
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 90, opacity: el(3) }}>
        <Img src={staticFile("logo.png")} style={{ width: 130, height: 130, borderRadius: 999, boxShadow: "0 0 70px rgba(249,184,0,0.35)" }} />
        <div>
          <div style={titre(64)}>Radio Tripoint</div>
          <div style={{ ...texte(34, C.jaune, 800), marginTop: 8 }}>Le Média des trois frontières</div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

export const TripoWeekend: React.FC = () => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: C.nuit }}>
      <Ciel />
      <Sequence durationInFrames={INTRO}>
        <Ouverture />
      </Sequence>
      {SORTIES.map((s, i) => (
        <Sequence key={s.titre} from={INTRO + i * CARTE} durationInFrames={CARTE}>
          <Carte s={s} i={i} />
        </Sequence>
      ))}
      <Sequence from={DEBUT_OUTRO} durationInFrames={OUTRO}>
        <Fin />
      </Sequence>
      {/* En haut : la radio, pendant les cartes */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: prog(f, INTRO - 6, INTRO + 8) * (1 - prog(f, DEBUT_OUTRO - 8, DEBUT_OUTRO + 4)),
        }}
      >
        <div style={{ ...titre(40, C.nuit), background: C.jaune, padding: "10px 18px 8px", borderRadius: 10, transform: "rotate(-2deg)" }}>L'agenda du week-end</div>
        <Img src={staticFile("logo.png")} style={{ width: 84, height: 84, borderRadius: 999 }} />
      </div>
      <Grain />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(1 - prog(f, 0, 8, EXPO), 0) }} />
    </AbsoluteFill>
  )
}
