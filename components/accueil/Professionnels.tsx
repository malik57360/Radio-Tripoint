import { ArrowRight } from "lucide-react"
import Link from "@/components/ui/Lien"
import { site } from "@/config/site"
import type { Trad } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"

const offres: Trad[] = [
  {
    fr: "Publicité radio",
    de: "Radiowerbung",
    lb: "Radiosreklamm",
    en: "Radio advertising",
    es: "Publicidad en radio",
  },
  {
    fr: "Campagnes locales",
    de: "Lokale Kampagnen",
    lb: "Lokal Campagnen",
    en: "Local campaigns",
    es: "Campañas locales",
  },
  {
    fr: "Promotion web",
    de: "Web-Promotion",
    lb: "Web-Promotioun",
    en: "Web promotion",
    es: "Promoción web",
  },
  { fr: "Événementiel", de: "Events", lb: "Evenementer", en: "Events", es: "Eventos" },
]

export async function Professionnels() {
  const t = await traducteur()
  return (
    <section aria-labelledby="titre-pro" className="conteneur py-16 lg:py-24">
      <div className="bg-accent text-sur-accent grid overflow-hidden lg:grid-cols-[1.4fr_1fr]">
        <div className="p-7 sm:p-10 lg:p-14">
          <p className="surtitre opacity-80">
            {t({
              fr: "Pour les professionnels",
              de: "Für Unternehmen",
              lb: "Fir Professionneller",
              en: "For businesses",
              es: "Para profesionales",
            })}{" "}
            · {t(site.promessePro)}
          </p>
          <h2
            id="titre-pro"
            className="titre-affiche mt-4 text-[clamp(2.2rem,1.3rem+3.6vw,4.2rem)]"
          >
            {t({
              fr: "Votre entreprise.",
              de: "Ihr Unternehmen.",
              lb: "Är Firma.",
              en: "Your business.",
              es: "Su empresa.",
            })}
            <br />
            {t({
              fr: "Notre antenne.",
              de: "Unser Sender.",
              lb: "Eisen Sender.",
              en: "Our airwaves.",
              es: "Nuestra antena.",
            })}
          </h2>
          <p className="presse mt-5 max-w-lg text-[1.2rem] leading-snug opacity-90">
            {t({
              fr: "Faites entendre votre activité des deux côtés de la frontière : spots radio, campagnes locales, promotion web et opérations événementielles, conçus avec notre équipe.",
              de: "Machen Sie Ihr Unternehmen auf beiden Seiten der Grenze hörbar: Radiospots, lokale Kampagnen, Web-Promotion und Event-Aktionen – gemeinsam mit unserem Team gestaltet.",
              lb: "Maacht Är Aktivitéit op béide Säite vun der Grenz héierbar: Radiospotten, lokal Campagnen, Web-Promotioun an Evenementsaktiounen, zesumme mat eiser Equipe ausgeschafft.",
              en: "Make your business heard on both sides of the border: radio spots, local campaigns, web promotion and event operations, designed with our team.",
              es: "Haga oír su actividad a ambos lados de la frontera: cuñas de radio, campañas locales, promoción web y acciones de eventos, diseñadas con nuestro equipo.",
            })}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/publicite"
              className="btn bg-sur-accent text-accent hover:bg-nuit-3 min-h-12 !px-6"
            >
              {t({
                fr: "Découvrir nos solutions",
                de: "Unsere Angebote entdecken",
                lb: "Eis Léisungen entdecken",
                en: "Discover our solutions",
                es: "Descubrir nuestras soluciones",
              })}{" "}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/publicite#demande"
              className="btn min-h-12 border-[1.5px] border-current !px-6 hover:bg-black/10"
            >
              {t({
                fr: "Demander une offre",
                de: "Angebot anfragen",
                lb: "Offer ufroen",
                en: "Request a quote",
                es: "Solicitar una oferta",
              })}
            </Link>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-px border-t border-black/15 bg-black/15 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:border-black/15">
          {offres.map((o, i) => (
            <li key={o.fr} className="bg-accent flex items-end p-5 sm:p-7">
              <span className="mr-3 text-sm tabular-nums opacity-85">0{i + 1}</span>
              <span className="titre-carte text-[1.1rem] sm:text-[1.25rem]">{t(o)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
