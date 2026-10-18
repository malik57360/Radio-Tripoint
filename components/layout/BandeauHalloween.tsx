import { ArrowRight } from "lucide-react"
import Link from "@/components/ui/Lien"
import { Citrouille } from "@/components/marque/Citrouille"
import { site } from "@/config/site"
import { traducteur } from "@/lib/i18n/serveur"

/** Halloween : bandeau fin en haut du site (campagne, config/site.ts). */
export async function BandeauHalloween() {
  if (!site.campagne.halloween) return null
  const t = await traducteur()
  return (
    <div
      role="note"
      className="bandeau-halloween flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-xs font-bold"
    >
      <span className="flex items-center gap-2">
        <Citrouille className="h-4 w-auto flex-none" />
        <span>
          {t({
            fr: "La nuit des Trois Frontières : c’est Halloween sur Radio Tripoint.",
            de: "Die Nacht des Dreiländerecks: Halloween bei Radio Tripoint.",
            lb: "D’Nuecht vum Dräilännereck: Halloween op Radio Tripoint.",
            en: "The night of the Three Borders: it’s Halloween on Radio Tripoint.",
            es: "La noche de las Tres Fronteras: es Halloween en Radio Tripoint.",
          })}
        </span>
      </span>
      <Link
        href="/agenda"
        className="bandeau-halloween-lien inline-flex items-center gap-1 underline-offset-4 hover:underline"
      >
        {t({
          fr: "Les sorties du week-end",
          de: "Ausgehtipps fürs Wochenende",
          lb: "Sortien fir de Weekend",
          en: "This weekend’s outings",
          es: "Planes del fin de semana",
        })}
        <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  )
}
