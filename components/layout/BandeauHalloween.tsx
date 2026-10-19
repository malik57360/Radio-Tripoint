import { ArrowRight } from "lucide-react"
import Link from "@/components/ui/Lien"
import { Citrouille } from "@/components/marque/Citrouille"
import { site } from "@/config/site"
import { traducteur } from "@/lib/i18n/serveur"

/** Halloween : bandeau fin en haut du site (campagne, config/site.ts), qui annonce le jeu concours de l'accueil. */
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
            fr: "Jeu concours d’Halloween : un lot à gagner chaque jour à 18 h.",
            de: "Halloween-Gewinnspiel: jeden Tag um 18 Uhr ein Preis zu gewinnen.",
            lb: "Halloween-Gewinnspill: all Dag um 18 Auer e Präis ze gewannen.",
            en: "Halloween contest: a prize to win every day at 6 pm.",
            es: "Concurso de Halloween: un premio cada día a las 18:00.",
          })}
        </span>
      </span>
      <Link
        href="/#concours"
        className="bandeau-halloween-lien inline-flex items-center gap-1 underline-offset-4 hover:underline"
      >
        {t({
          fr: "Jouer et gagner",
          de: "Spielen und gewinnen",
          lb: "Spillen a gewannen",
          en: "Play and win",
          es: "Jugar y ganar",
        })}
        <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  )
}
