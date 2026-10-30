import React from "react"
import { Composition } from "remotion"
import { DUREE_TRIPO_WEEKEND, TripoWeekend } from "./agenda/TripoWeekend"
import { chargerPolices } from "./commun"
import { DUREE_GENZ_POLITIQUE, GenZPolitique } from "./reportage/GenZPolitique"

chargerPolices()

const story = { width: 1080, height: 1920, fps: 30 } as const

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="TripoWeekend" component={TripoWeekend} durationInFrames={DUREE_TRIPO_WEEKEND} {...story} />
    <Composition id="GenZPolitique" component={GenZPolitique} durationInFrames={DUREE_GENZ_POLITIQUE} {...story} />
  </>
)
