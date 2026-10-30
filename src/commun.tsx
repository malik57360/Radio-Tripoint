/**
 * Socle commun des vidéos Radio Tripoint : couleurs de la marque, polices
 * Montserrat (celles du site) et Anton (titres des reportages), chargées
 * depuis public/fonts, courbes
 * d'animation et grain de pellicule.
 */
import React from "react"
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, staticFile, useCurrentFrame } from "remotion"

export const C = {
  jaune: "#f9b800",
  orange: "#ff7a1a",
  violet: "#8546c2",
  nuit: "#0b0614",
  nuit2: "#1c0b2b",
  blanc: "#ffffff",
  gris: "#cfc7da",
}

export const EXPO = Easing.bezier(0.16, 1, 0.3, 1)
export const SORTIE = Easing.bezier(0.7, 0, 0.84, 0)

/** 0 → 1 entre deux images, avec une courbe. */
export const prog = (f: number, a: number, b: number, courbe = EXPO) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: courbe })

const POLICES: [string, string, string, string][] = [
  ["Montserrat", "montserrat-latin-700-normal.woff", "700", "normal"],
  ["Montserrat", "montserrat-latin-800-normal.woff", "800", "normal"],
  ["Montserrat", "montserrat-latin-900-normal.woff", "900", "normal"],
  ["Montserrat", "montserrat-latin-600-italic.woff", "600", "italic"],
  ["Montserrat", "montserrat-latin-ext-800-normal.woff", "800", "normal"],
  ["Montserrat", "montserrat-latin-ext-900-normal.woff", "900", "normal"],
  ["Montserrat", "montserrat-latin-ext-700-normal.woff", "700", "normal"],
  ["Montserrat", "montserrat-latin-800-italic.woff", "800", "italic"],
  ["Montserrat", "montserrat-latin-ext-800-italic.woff", "800", "italic"],
  // Titres des reportages : capitales étroites.
  ["Anton", "anton-latin-400-normal.woff", "400", "normal"],
  ["Anton", "anton-latin-ext-400-normal.woff", "400", "normal"],
]

let charge = false
export function chargerPolices() {
  if (charge || typeof document === "undefined") return
  charge = true
  const attente = delayRender("Polices Montserrat")
  Promise.all(
    POLICES.map(([famille, fichier, graisse, style]) => {
      const f = new FontFace(famille, `url(${staticFile(`fonts/${fichier}`)})`, { weight: graisse, style })
      return f.load().then((p) => document.fonts.add(p))
    }),
  ).then(() => continueRender(attente))
}

export const titre = (taille: number, couleur: string = C.blanc): React.CSSProperties => ({
  fontFamily: "Montserrat",
  fontWeight: 900,
  fontSize: taille,
  lineHeight: 0.95,
  letterSpacing: "-0.02em",
  textTransform: "uppercase",
  color: couleur,
})

export const texte = (taille: number, couleur: string = C.blanc, graisse = 700): React.CSSProperties => ({
  fontFamily: "Montserrat",
  fontWeight: graisse,
  fontSize: taille,
  lineHeight: 1.2,
  color: couleur,
})

/** Grain de pellicule, qui bouge d'une image à l'autre. */
export const Grain: React.FC<{ force?: number }> = ({ force = 0.08 }) => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: force, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  )
}
