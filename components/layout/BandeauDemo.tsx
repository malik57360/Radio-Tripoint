import { traducteur } from "@/lib/i18n/serveur"
import { modeDemo } from "@/lib/contenu/demo"

/** Visible sur tout le site quand le contenu fictif est chargé. */
export async function BandeauDemo() {
  if (!modeDemo) return null
  const t = await traducteur()
  return (
    <div role="note" className="bg-alerte px-4 py-1.5 text-center text-xs font-semibold text-white">
      {t({
        fr: "Mode démonstration : les contenus marqués « Exemple » sont fictifs et ne seront pas publiés.",
        de: "Demo-Modus: Mit „Beispiel“ markierte Inhalte sind fiktiv und werden nicht veröffentlicht.",
        lb: "Demo-Modus: Inhalter mat „Beispill“ si fiktiv a ginn net publizéiert.",
      })}
    </div>
  )
}
