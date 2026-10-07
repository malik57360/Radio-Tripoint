import { RubanRose } from "@/components/marque/RubanRose"
import { site } from "@/config/site"
import { traducteur } from "@/lib/i18n/serveur"

/** Octobre rose : bandeau fin en haut du site (campagne, config/site.ts). */
export async function BandeauOctobreRose() {
  if (!site.campagne.octobreRose) return null
  const t = await traducteur()
  return (
    <div
      role="note"
      className="flex items-center bg-[#d6246e] justify-center gap-2 px-4 py-1.5 text-center text-xs font-bold text-white"
    >
      <RubanRose className="h-4 w-auto flex-none [&_path]:fill-white [&_path]:stroke-transparent" />
      <span>
        {t({
          fr: "Octobre rose : Radio Tripoint se mobilise contre le cancer du sein. Pensez au dépistage.",
          de: "Brustkrebsmonat Oktober: Radio Tripoint engagiert sich gegen Brustkrebs. Denken Sie an die Vorsorge.",
          lb: "Octobre rose: Radio Tripoint engagéiert sech géint Broschtkriibs. Denkt un d'Virsuerg.",
          en: "Pink October: Radio Tripoint stands against breast cancer. Remember to get screened.",
          es: "Octubre rosa: Radio Tripoint se moviliza contra el cáncer de mama. Piensa en la detección.",
        })}
      </span>
    </div>
  )
}
