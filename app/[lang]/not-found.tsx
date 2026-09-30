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
          })}
        </p>
        <h1 className="titre-affiche mt-5 max-w-4xl text-[clamp(2.6rem,1.2rem+6vw,6.4rem)]">
          {t({
            fr: "Cette page s'est perdue",
            de: "Diese Seite hat sich verirrt –",
            lb: "Dës Säit huet sech verlaf –",
          })}{" "}
          <span className="text-nuit-accent">
            {t({
              fr: "entre deux frontières.",
              de: "zwischen zwei Grenzen.",
              lb: "tëscht zwou Grenzen.",
            })}
          </span>
        </h1>
        <p className="presse text-nuit-encre-2 mt-6 max-w-xl text-[1.3rem] leading-snug">
          {t({
            fr: "Le lien est peut-être ancien, ou la page a changé d'adresse avec la nouvelle version du site. Le direct, lui, n'a pas bougé.",
            de: "Vielleicht ist der Link veraltet, oder die Seite hat mit der neuen Website ihre Adresse geändert. Der Livestream ist aber noch da.",
            lb: "Vläicht ass de Link al, oder d'Säit huet mat der neier Versioun vum Site hir Adress geännert. De Live-Stream ass awer nach do.",
          })}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <BoutonDirect taille="grand" />
          <Link href="/" className="btn btn-nuit min-h-14 !px-6">
            {t({ fr: "Retour à l'accueil", de: "Zur Startseite", lb: "Zréck op d'Startsäit" })}
          </Link>
        </div>
        <nav
          aria-label={t({ fr: "Pages utiles", de: "Nützliche Seiten", lb: "Nëtzlech Säiten" })}
          className="border-nuit-trait mt-16 border-t pt-6"
        >
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              [t({ fr: "Actualités", de: "Aktuelles", lb: "Aktualitéiten" }), "/actualites"],
              [t({ fr: "Émissions", de: "Sendungen", lb: "Sendungen" }), "/emissions"],
              ["Podcasts", "/podcasts"],
              ["Agenda", "/agenda"],
              [t({ fr: "Contact", de: "Kontakt", lb: "Kontakt" }), "/contact"],
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
