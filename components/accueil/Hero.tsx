import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "@/components/ui/Lien"
import { site } from "@/config/site"
import { BoutonDirect } from "@/components/radio/BoutonDirect"
import { EnCeMoment } from "@/components/radio/EnCeMoment"
import { Spectre } from "@/components/motion/Spectre"
import { Tripoint } from "@/components/motion/Tripoint"
import { traducteur } from "@/lib/i18n/serveur"
import type { GrilleClient } from "@/lib/radio/types"

/**
 * L'accueil : le jaune du logo en pleine page, le grand titre en lettrage
 * condensé, puis le cadran — la graduation d'un poste radio où les trois
 * pays sont les stations, et l'aiguille rouge marque le direct.
 * Pas de hauteur plein écran vide : le direct est visible sans défiler.
 */
export async function Hero({ grille }: { grille: GrilleClient }) {
  const t = await traducteur()
  const pays = t(site.pays)
  return (
    <section aria-labelledby="titre-accueil" className="relative isolate">
      <div className="hero-scene bg-accent relative isolate overflow-hidden text-black">
        <div className="hero-lumiere" aria-hidden />
        <Tripoint className="hero-tripoint" />
        {site.visuels.hero && (
          <Image
            src={site.visuels.hero}
            alt=""
            fill
            preload
            sizes="100vw"
            className="-z-10 object-cover opacity-25 mix-blend-multiply grayscale"
          />
        )}
        <div className="conteneur pt-10 pb-10 sm:pt-14 lg:pt-16 lg:pb-14">
          {/* Titre = élément LCP : il monte ligne par ligne, mais reste peint
              dès la première image (jamais d'opacité nulle). */}
          <h1
            id="titre-accueil"
            className="titre-accueil titre-affiche text-[clamp(3.5rem,0.6rem+11vw,12.5rem)]"
          >
            <span className="titre-ligne">
              <span>
                {t({
                  fr: "Le Média des",
                  de: "Das Medium des",
                  lb: "D'Medium vum",
                  en: "The media of",
                  es: "El medio de",
                })}
              </span>
            </span>
            <span className="titre-ligne">
              <span>
                {t({
                  fr: "trois frontières",
                  // Traits d'union conditionnels : le mot tient sur un téléphone.
                  de: "Drei­länder­ecks",
                  lb: "Dräi­länner­eck",
                  en: "the Three Borders",
                  es: "las Tres Fronteras",
                })}
              </span>
            </span>
          </h1>
          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
            <p className="hero-sous-titre presse max-w-xl text-[1.2rem] leading-snug sm:text-[1.35rem]">
              {t({
                fr: "La radio de Sierck-les-Bains, là où la France, le Luxembourg et l'Allemagne se touchent. L'actu, la musique et les sorties du territoire, en direct.",
                de: "Das Radio aus Sierck-les-Bains, wo sich Frankreich, Luxemburg und Deutschland berühren. Nachrichten, Musik und Ausgehtipps aus der Region, live.",
                lb: "De Radio vu Sierck-les-Bains, do wou Frankräich, Lëtzebuerg an Däitschland sech beréieren. Neiegkeeten, Musek an Ausgoen aus der Regioun, live.",
                en: "The radio from Sierck-les-Bains, where France, Luxembourg and Germany meet. Local news, music and what's on, live.",
                es: "La radio de Sierck-les-Bains, donde se tocan Francia, Luxemburgo y Alemania. Actualidad, música y planes del territorio, en directo.",
              })}
            </p>
            <div className="hero-actions grid gap-3 sm:flex sm:flex-wrap">
              <BoutonDirect taille="grand" />
              <Link
                href="/emissions"
                className="btn min-h-14 bg-black !px-6 text-white hover:bg-white hover:text-black"
              >
                {t({
                  fr: "Voir les émissions",
                  de: "Sendungen ansehen",
                  lb: "Sendunge kucken",
                  en: "See the programmes",
                  es: "Ver los programas",
                })}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
        <Defilant
          mots={[
            t({ fr: "En direct", de: "Live", lb: "Live", en: "Live", es: "En directo" }),
            ...pays,
            "Sierck-les-Bains",
            "Radio Tripoint",
          ]}
        />
      </div>

      <div className="bg-nuit text-nuit-encre">
        <div className="conteneur pt-9 pb-8 lg:pb-10">
          <Spectre className="spectre text-nuit-accent mb-7 block h-12 w-full sm:h-16" />
          <Cadran pays={pays} />
          <div className="mt-6 lg:mt-8">
            <EnCeMoment grille={grille} />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Graduation de poste radio : les trois pays sont les stations, l'aiguille rouge le direct. */
function Cadran({ pays }: { pays: string[] }) {
  const positions = ["14%", "50%", "86%"]
  return (
    <div className="relative h-16 select-none" aria-hidden>
      <div
        className="absolute inset-x-0 top-0 h-5"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.8) 0 2px, transparent 2px 10%), repeating-linear-gradient(90deg, rgb(255 255 255 / 0.3) 0 1px, transparent 1px 2%) 0 0 / 100% 55% no-repeat",
        }}
      />
      {pays.map((p, i) => (
        <div
          key={p}
          className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
          style={{ left: positions[i] }}
        >
          <span
            className="station bg-nuit-accent block h-7 w-1"
            style={{ animationDelay: `${0.35 + i * 0.35}s` }}
          />
          <span className="text-nuit-encre mt-2 text-[0.85rem] font-bold whitespace-nowrap sm:text-base">
            {p}
          </span>
        </div>
      ))}
      {/* L'aiguille balaie le cadran comme on cherche une station, puis se cale sur le direct. */}
      <span className="aiguille bg-direct absolute -top-6 left-1/2 h-12 w-0.5 -translate-x-1/2 shadow-[0_0_14px_var(--direct)]" />
    </div>
  )
}

/** Bandeau défilant sous le titre : le site respire, même à l'arrêt. */
function Defilant({ mots }: { mots: string[] }) {
  const suite = [...mots, ...mots]
  return (
    <div className="defilant border-t-2 border-black" aria-hidden>
      <div className="defilant-piste">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {suite.map((m, i) => (
              <span
                key={`${k}-${i}`}
                className="titre-affiche flex items-center text-[1.35rem] sm:text-[1.6rem]"
              >
                <span className="px-5">{m}</span>
                <span className="inline-block size-2.5 rounded-full bg-black" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
