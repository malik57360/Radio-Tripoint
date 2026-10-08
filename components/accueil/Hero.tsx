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
            <div className="hero-sous-titre max-w-xl">
              <p className="presse text-[1.2rem] leading-snug sm:text-[1.35rem]">
                {t({
                  fr: "Nous donnons de la visibilité à vos projets, vos entreprises, vos événements, votre musique.",
                  de: "Wir machen Ihre Projekte, Ihre Unternehmen, Ihre Veranstaltungen und Ihre Musik sichtbar.",
                  lb: "Mir maachen Är Projeten, Är Betriber, Är Evenementer an Är Musek siichtbar.",
                  en: "We give visibility to your projects, your businesses, your events and your music.",
                  es: "Damos visibilidad a sus proyectos, sus empresas, sus eventos y su música.",
                })}
              </p>
              {/* La promesse, dans le lettrage des titres. */}
              <p className="promesse mt-4 text-[1.3rem] sm:text-[1.55rem]">
                <span className="block">
                  {t({
                    fr: "Nous vous apportons de la visibilité.",
                    de: "Wir bringen Ihnen Sichtbarkeit.",
                    lb: "Mir bréngen Iech Siichtbarkeet.",
                    en: "We bring you visibility.",
                    es: "Les aportamos visibilidad.",
                  })}
                </span>
                <span className="block">
                  {t({
                    fr: "Vous la transformez en opportunités, en clients et en chiffre d’affaires.",
                    de: "Sie machen daraus Chancen, Kunden und Umsatz.",
                    lb: "Dir maacht doraus Chancen, Clienten an Ëmsaz.",
                    en: "You turn it into opportunities, customers and revenue.",
                    es: "Ustedes la convierten en oportunidades, clientes y facturación.",
                  })}
                </span>
              </p>
              {/* Chaque métier porte son point devant lui, et la liste déborde
                  d'un point à gauche, rogné : si elle passe sur deux lignes,
                  aucune ne commence par « • ». */}
              <div className="mt-4 overflow-hidden">
                <ul className="-ml-5 flex flex-wrap text-[0.72rem] font-bold tracking-[0.06em] text-black/75 uppercase [font-variation-settings:'wdth'_75]">
                  {t({
                    fr: ["Radio", "Média", "Reportages", "Podcasts", "Événements"],
                    de: ["Radio", "Medien", "Reportagen", "Podcasts", "Events"],
                    lb: ["Radio", "Medien", "Reportagen", "Podcasten", "Evenementer"],
                    en: ["Radio", "Media", "Reports", "Podcasts", "Events"],
                    es: ["Radio", "Medios", "Reportajes", "Podcasts", "Eventos"],
                  }).map((m) => (
                    <li key={m}>
                      <span aria-hidden className="inline-block w-5 text-center">
                        •
                      </span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
