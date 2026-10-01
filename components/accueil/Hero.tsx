import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "@/components/ui/Lien"
import { site } from "@/config/site"
import { Tripoint } from "@/components/marque/Tripoint"
import { BoutonDirect } from "@/components/radio/BoutonDirect"
import { EnCeMoment } from "@/components/radio/EnCeMoment"
import { traducteur } from "@/lib/i18n/serveur"
import type { GrilleClient } from "@/lib/radio/types"

/**
 * Le studio : fond nuit, grand titre, module du direct. Pas de hauteur
 * plein écran vide — le direct est visible sans défiler, même sur 320 px.
 */
export async function Hero({ grille }: { grille: GrilleClient }) {
  const t = await traducteur()
  const [fr, lu, de] = t(site.pays)
  return (
    <section
      aria-labelledby="titre-accueil"
      className="bg-nuit text-nuit-encre relative isolate overflow-hidden"
    >
      {site.visuels.hero ? (
        <>
          <Image
            src={site.visuels.hero}
            alt=""
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="from-nuit via-nuit/85 to-nuit/40 absolute inset-0 -z-10 bg-gradient-to-r" />
        </>
      ) : (
        <Tripoint
          className="text-nuit-trait pointer-events-none absolute top-[6%] left-[88%] -z-10 h-[150%] w-auto -translate-x-1/2 -translate-y-1/2 sm:top-1/2 lg:left-[46%]"
          epaisseur={1}
        />
      )}

      <div className="conteneur grid gap-10 pt-10 pb-12 sm:pt-14 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-14 lg:pt-20 lg:pb-20">
        {/* Pas d'animation ici : le titre est l'élément LCP de la page. */}
        <div>
          <p className="surtitre text-nuit-encre-2 flex items-center gap-3">
            <span className="bg-nuit-accent h-px w-8" aria-hidden />
            {t(site.baseline)}
            <span className="hidden sm:inline"> · Sierck-les-Bains</span>
          </p>
          <h1
            id="titre-accueil"
            className="titre-affiche mt-5 text-[clamp(2.6rem,1.2rem+6.4vw,6.4rem)]"
          >
            {t({
              fr: "Le Média des",
              de: "Das Medium des",
              lb: "D'Medium vum",
              en: "The media of",
              es: "El medio de",
            })}{" "}
            <span className="text-nuit-accent">
              {t({
                fr: "trois frontières",
                // Traits d'union conditionnels : le mot tient sur un téléphone.
                de: "Drei\u00adländer\u00adecks",
                lb: "Dräi\u00adlänner\u00adeck",
                en: "the Three Borders",
                es: "las Tres Fronteras",
              })}
            </span>
          </h1>
          <p className="text-nuit-encre-2 mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] font-semibold tracking-[0.02em] sm:text-base">
            <span>{fr}</span>
            <span className="text-nuit-accent" aria-hidden>
              ·
            </span>
            <span>{lu}</span>
            <span className="text-nuit-accent" aria-hidden>
              ·
            </span>
            <span>{de}</span>
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <BoutonDirect taille="grand" />
            <Link href="/emissions" className="btn btn-nuit min-h-14 !px-6">
              {t({
                fr: "Découvrir nos émissions",
                de: "Unsere Sendungen entdecken",
                lb: "Eis Sendungen entdecken",
                en: "Discover our programmes",
                es: "Descubrir nuestros programas",
              })}{" "}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
        <div className="entree-2">
          <EnCeMoment grille={grille} />
        </div>
      </div>
    </section>
  )
}
