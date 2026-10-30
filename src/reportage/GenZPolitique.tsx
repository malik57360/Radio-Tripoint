/**
 * « Génération Z · Pas fan de la politique » : un jeune de la rubrique des
 * 15-17 ans, filmé au micro Radio Tripoint sans visage, répond à la radio sur
 * la politique. Habillage du reportage du gymnase (habillage.tsx).
 *
 * public/genz-politique : parole.mp4 = le rush de 2,8 s à 13,4 s (question et
 * réponse), plan.mp4 = le rush de 13,6 s à 17,6 s (sous le titre, sans le son).
 * Les sous-titres reprennent la transcription vérifiée ; personne n'est nommé.
 */
import React from "react"
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion"
import { Grain, prog } from "../commun"
import { Cartouche, Citation, Generique, Plan, SousTitre, Tiers, TitreReportage } from "./habillage"

const FPS = 30
const s = (sec: number) => Math.round(sec * FPS)

export const TITRE = 105
export const PAROLE = 318
export const CITATION = 105
export const FIN = 105
export const DUREE_GENZ_POLITIQUE = TITRE + PAROLE + CITATION + FIN

/** (seconde dans la parole, texte, question de la radio ?) */
const LIGNES: [number, string, boolean][] = [
  [0.35, "Déjà, tu dis ne pas aimer la politique.", true],
  [2.35, "Pourquoi ?", true],
  [3.5, "Parce que ça ne m'intéresse pas.", false],
  [6.1, "Je ne trouve pas intéressant de regarder ça.", false],
]
const FIN_PAROLE = 10.35
/** La réponse : saut de cadre serré. */
const REPONSE = 3.4

const Parole: React.FC = () => {
  const f = useCurrentFrame()
  const t = f / FPS
  const serre = t >= REPONSE
  const zoom = serre ? 1.16 + 0.03 * prog(f, s(REPONSE), PAROLE) : 1 + 0.04 * prog(f, 0, s(REPONSE))
  const i = LIGNES.findIndex(([debut], k) => t >= debut && t < (LIGNES[k + 1]?.[0] ?? FIN_PAROLE))
  return (
    <AbsoluteFill>
      <Plan src="genz-politique/parole.mp4" zoom={zoom} centre="40% 30%" />
      {/* Pendant la réponse, le micro levé porte déjà le logo : le cartouche s'efface. */}
      <Cartouche p={prog(f, 0, 14) * (1 - prog(f, s(REPONSE) - 6, s(REPONSE)))} />
      <Tiers
        p={prog(f, s(REPONSE) + 4, s(REPONSE) + 18) * (1 - prog(f, s(8.6), s(9.1)))}
        nom="Génération Z"
        precision="Le rendez-vous des 15-17 ans"
      />
      {i >= 0 && (
        <SousTitre
          key={i}
          texte={LIGNES[i][1]}
          question={LIGNES[i][2]}
          p={prog(f, s(LIGNES[i][0]), s(LIGNES[i][0]) + 5)}
        />
      )}
    </AbsoluteFill>
  )
}

export const GenZPolitique: React.FC = () => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={TITRE}>
        <Plan src="genz-politique/plan.mp4" zoom={1.04 + 0.04 * prog(f, 0, TITRE)} />
        <TitreReportage
          f={f}
          duree={TITRE}
          surtitre="Reportage · Génération Z"
          ligne1="Pas fan de"
          ligne2="la politique"
          chapeau="Le rendez-vous des 15-17 ans, au micro de Radio Tripoint"
        />
      </Sequence>
      <Sequence from={TITRE} durationInFrames={PAROLE}>
        <Parole />
      </Sequence>
      <Sequence from={TITRE + PAROLE} durationInFrames={CITATION}>
        <Plan src="genz-politique/parole.mp4" depart={s(REPONSE)} flou={14} sombre={0.62} zoom={1.1} />
        <Citation
          f={f - TITRE - PAROLE}
          surtitre="Génération Z · La politique"
          ligne1="Ça ne"
          ligne2="m'intéresse pas"
          appel={["Et toi, la politique ?", "Dis-le en commentaire"]}
        />
      </Sequence>
      <Sequence from={TITRE + PAROLE + CITATION} durationInFrames={FIN}>
        <Plan src="genz-politique/plan.mp4" flou={18} sombre={0.75} zoom={1.1} />
        <Generique f={f - TITRE - PAROLE - CITATION} duree={FIN} />
      </Sequence>
      <Grain force={0.06} />
      <AbsoluteFill style={{ background: "#000", opacity: 1 - prog(f, 0, 8) }} />
    </AbsoluteFill>
  )
}
