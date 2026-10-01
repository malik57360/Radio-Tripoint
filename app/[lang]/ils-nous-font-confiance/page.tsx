import { ArrowRight, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "@/components/ui/Lien"
import { PageHero } from "@/components/ui/PageHero"
import { personnes, structures } from "@/data/confiance"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Ils nous font confiance",
      de: "Sie vertrauen uns",
      lb: "Si vertrauen eis",
    },
    description: {
      fr: "Élus, institutions et acteurs du territoire qui font confiance à Radio Tripoint, la radio transfrontalière des Trois Frontières.",
      de: "Gewählte, Institutionen und Akteure der Region, die Radio Tripoint vertrauen, dem grenzüberschreitenden Radio des Dreiländerecks.",
      lb: "Gewielten, Institutiounen an Acteuren aus der Regioun, déi Radio Tripoint vertrauen, dem grenziwwerschreidende Radio vum Dräilännereck.",
    },
    chemin: "/ils-nous-font-confiance",
  })

export default async function PageConfiance() {
  const t = await traducteur()
  const titre = t({
    fr: "Ils nous font confiance",
    de: "Sie vertrauen uns",
    lb: "Si vertrauen eis",
  })
  return (
    <>
      <PageHero
        miettes={[{ nom: titre, chemin: "/ils-nous-font-confiance" }]}
        surtitre={t({ fr: "Merci", de: "Danke", lb: "Merci" })}
        titre={titre}
        intro={t({
          fr: "Élus, institutions, associations : merci à celles et ceux qui font confiance à Radio Tripoint et font vivre, avec nous, le territoire des Trois Frontières.",
          de: "Gewählte, Institutionen, Vereine: Danke an alle, die Radio Tripoint vertrauen und mit uns das Dreiländereck lebendig halten.",
          lb: "Gewielten, Institutiounen, Veräiner: Merci un all déi, déi Radio Tripoint vertrauen a mat eis d'Dräilännereck lieweg halen.",
        })}
      />

      <div className="conteneur space-y-16 py-14 lg:space-y-20 lg:py-20">
        <section aria-labelledby="personnes">
          <h2 id="personnes" className="titre-section">
            {t({
              fr: "Ils ont pris la parole avec nous",
              de: "Sie haben mit uns gesprochen",
              lb: "Si hu mat eis d'Wuert geholl",
            })}
          </h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:gap-10">
            {personnes.map((p) => (
              <li key={p.nom} className="bg-surface border-trait flex flex-col border">
                <div
                  className="bg-papier-3 relative overflow-hidden"
                  style={{ aspectRatio: `${p.photo.largeur} / ${p.photo.hauteur}` }}
                >
                  <Image
                    src={p.photo.src}
                    alt={t(p.photo.alt)}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="border-accent flex flex-1 flex-col gap-2 border-t-4 p-5 sm:p-6">
                  <h3 className="text-xl leading-tight font-bold sm:text-2xl">{p.nom}</h3>
                  <p className="text-encre-2 font-semibold">{t(p.role)}</p>
                  {p.note && <p className="presse text-encre-2 text-lg">{t(p.note)}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="structures" className="filet-section pt-8">
          <h2 id="structures" className="titre-section">
            {t({
              fr: "Ils travaillent avec nous",
              de: "Sie arbeiten mit uns",
              lb: "Si schaffe mat eis",
            })}
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {structures.map((s) => {
              const contenu = (
                <>
                  <span className="relative block h-28 w-full sm:h-32">
                    <Image
                      src={s.logo.src}
                      alt={s.nom}
                      fill
                      sizes="(min-width: 640px) 40vw, 90vw"
                      className="object-contain"
                    />
                  </span>
                  <span className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm font-semibold">
                    {s.nom}
                    {s.site && <ExternalLink className="size-3.5 flex-none" aria-hidden />}
                  </span>
                </>
              )
              return (
                <li key={s.nom}>
                  {s.site ? (
                    <a
                      href={s.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-trait hover:border-encre block border bg-white p-6 transition-colors"
                    >
                      {contenu}
                    </a>
                  ) : (
                    <div className="border-trait block border bg-white p-6">{contenu}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <section className="bg-nuit text-nuit-encre px-6 py-10 sm:px-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {t({
              fr: "Vous aussi, faites entendre votre voix",
              de: "Lassen auch Sie Ihre Stimme hören",
              lb: "Loosst och Dir Är Stëmm héieren",
            })}
          </h2>
          <p className="text-nuit-encre-2 mt-3 max-w-2xl">
            {t({
              fr: "Commune, association, entreprise : parlez-nous de votre projet ou de votre événement.",
              de: "Gemeinde, Verein, Unternehmen: Erzählen Sie uns von Ihrem Projekt oder Ihrer Veranstaltung.",
              lb: "Gemeng, Veräin, Betrib: Erzielt eis vun Ärem Projet oder Ärem Evenement.",
            })}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-accent text-sur-accent inline-flex items-center gap-2 px-5 py-3 font-bold"
            >
              {t({ fr: "Nous contacter", de: "Kontakt aufnehmen", lb: "Kontakt ophuelen" })}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/publicite"
              className="border-nuit-trait hover:border-nuit-encre inline-flex items-center gap-2 border px-5 py-3 font-bold"
            >
              {t({
                fr: "Devenir partenaire",
                de: "Partner werden",
                lb: "Partner ginn",
              })}
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
