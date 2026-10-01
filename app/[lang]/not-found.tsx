import { ArrowRight } from "lucide-react"
import Link from "@/components/ui/Lien"
import { Tripoint } from "@/components/marque/Tripoint"
import { BoutonDirect } from "@/components/radio/BoutonDirect"
import { traducteur } from "@/lib/i18n/serveur"

export const metadata = { title: "404" }

/** 404 : on a perdu la fréquence — mais le direct, lui, est toujours là. */
export default async function NotFound() {
  const t = await traducteur()
  return (
    <section className="bg-nuit text-nuit-encre relative isolate overflow-hidden">
      <Tripoint
        className="text-nuit-trait pointer-events-none absolute top-1/2 left-[70%] -z-10 h-[150%] w-auto -translate-x-1/2 -translate-y-1/2"
        epaisseur={1}
      />
      <div className="conteneur py-20 lg:py-32">
        <p className="surtitre text-nuit-encre-2 flex items-center gap-3">
          <span className="bg-nuit-accent h-px w-8" aria-hidden />
          {t({
            fr: "Erreur 404 · Hors fréquence",
            de: "Fehler 404 · Kein Empfang",
            lb: "Feeler 404 · Keen Empfang",
            en: "Error 404 · Off frequency",
            es: "Error 404 · Fuera de frecuencia",
          })}
        </p>
        <h1 className="titre-affiche mt-5 max-w-4xl text-[clamp(2.6rem,1.2rem+6vw,6.4rem)]">
          {t({
            fr: "Cette page s'est perdue",
            de: "Diese Seite hat sich verirrt –",
            lb: "Dës Säit huet sech verlaf –",
            en: "This page got lost",
            es: "Esta página se ha perdido",
          })}{" "}
          <span className="text-nuit-accent">
            {t({
              fr: "entre deux frontières.",
              de: "zwischen zwei Grenzen.",
              lb: "tëscht zwou Grenzen.",
              en: "between two borders.",
              es: "entre dos fronteras.",
            })}
          </span>
        </h1>
        <p className="presse text-nuit-encre-2 mt-6 max-w-xl text-[1.3rem] leading-snug">
          {t({
            fr: "Le lien est peut-être ancien, ou la page a changé d'adresse avec la nouvelle version du site. Le direct, lui, n'a pas bougé.",
            de: "Vielleicht ist der Link veraltet, oder die Seite hat mit der neuen Website ihre Adresse geändert. Der Livestream ist aber noch da.",
            lb: "Vläicht ass de Link al, oder d'Säit huet mat der neier Versioun vum Site hir Adress geännert. De Live-Stream ass awer nach do.",
            en: "The link may be old, or the page may have moved with the new version of the website. The live stream, however, hasn't moved.",
            es: "Puede que el enlace sea antiguo o que la página haya cambiado de dirección con la nueva versión del sitio. El directo, en cambio, sigue en su sitio.",
          })}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <BoutonDirect taille="grand" />
          <Link href="/" className="btn btn-nuit min-h-14 !px-6">
            {t({
              fr: "Retour à l'accueil",
              de: "Zur Startseite",
              lb: "Zréck op d'Startsäit",
              en: "Back to home",
              es: "Volver al inicio",
            })}
          </Link>
        </div>
        <nav
          aria-label={t({
            fr: "Pages utiles",
            de: "Nützliche Seiten",
            lb: "Nëtzlech Säiten",
            en: "Useful pages",
            es: "Páginas útiles",
          })}
          className="border-nuit-trait mt-16 border-t pt-6"
        >
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              [
                t({
                  fr: "Actualités",
                  de: "Aktuelles",
                  lb: "Aktualitéiten",
                  en: "News",
                  es: "Noticias",
                }),
                "/actualites",
              ],
              [
                t({
                  fr: "Émissions",
                  de: "Sendungen",
                  lb: "Sendungen",
                  en: "Programmes",
                  es: "Programas",
                }),
                "/emissions",
              ],
              ["Podcasts", "/podcasts"],
              ["Agenda", "/agenda"],
              [
                t({ fr: "Contact", de: "Kontakt", lb: "Kontakt", en: "Contact", es: "Contacto" }),
                "/contact",
              ],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="lien-fleche text-nuit-encre hover:text-nuit-accent">
                  {l} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
