import React from "react"
import { Composition } from "remotion"
import { DUREE_TRIPO_WEEKEND, TripoWeekend } from "./agenda/TripoWeekend"
import { chargerPolices } from "./commun"
import { DUREE_PASSAGE, OuvertureWeekend, PassageDecouvertes } from "./compil/Compil"
import { Decouvertes5, DUREE_DECOUVERTES5 } from "./compil/Decouvertes5"
import { Decouverte, DECOUVERTES } from "./decouverte/Decouverte"
import { DUREE_GENZ_POLITIQUE, GenZPolitique } from "./reportage/GenZPolitique"

chargerPolices()

const story = { width: 1080, height: 1920, fps: 30 } as const

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="TripoWeekend" component={TripoWeekend} durationInFrames={DUREE_TRIPO_WEEKEND} {...story} />
    {DECOUVERTES.map((d) => (
      <Composition key={d.n} id={`Decouverte${d.n}`} component={Decouverte} durationInFrames={d.images} defaultProps={d} {...story} />
    ))}
    <Composition id="Decouvertes5" component={Decouvertes5} durationInFrames={DUREE_DECOUVERTES5} {...story} />
    <Composition id="PassageDecouvertes" component={PassageDecouvertes} durationInFrames={DUREE_PASSAGE} {...story} />
    <Composition
      id="OuvertureWeekend"
      component={OuvertureWeekend}
      durationInFrames={300}
      defaultProps={{ duree: 300, dates: "Ven. 30 oct. → dim. 1er nov." }}
      calculateMetadata={({ props }) => ({ durationInFrames: props.duree })}
      {...story}
    />
    <Composition id="GenZPolitique" component={GenZPolitique} durationInFrames={DUREE_GENZ_POLITIQUE} {...story} />
  </>
)
