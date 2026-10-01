import type { Trad } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"
import { CarteTerritoire } from "./CarteTerritoire"

const pays: { code: string; nom: Trad; lieux: Trad }[] = [
  {
    code: "FR",
    nom: { fr: "France", de: "Frankreich", lb: "Frankräich", en: "France", es: "Francia" },
    lieux: {
      fr: "Sierck-les-Bains · Apach · Thionville · Moselle",
      de: "Sierck-les-Bains · Apach · Diedenhofen · Mosel",
      lb: "Sierck-les-Bains · Apach · Diddenuewen · Musel",
      en: "Sierck-les-Bains · Apach · Thionville · Moselle",
      es: "Sierck-les-Bains · Apach · Thionville · Mosela",
    },
  },
  {
    code: "LU",
    nom: {
      fr: "Luxembourg",
      de: "Luxemburg",
      lb: "Lëtzebuerg",
      en: "Luxembourg",
      es: "Luxemburgo",
    },
    lieux: {
      fr: "Schengen · Remich · Luxembourg",
      de: "Schengen · Remich · Luxemburg",
      lb: "Schengen · Réimech · Lëtzebuerg",
      en: "Schengen · Remich · Luxembourg",
      es: "Schengen · Remich · Luxemburgo",
    },
  },
  {
    code: "DE",
    nom: { fr: "Allemagne", de: "Deutschland", lb: "Däitschland", en: "Germany", es: "Alemania" },
    lieux: {
      fr: "Perl · Merzig · Sarre",
      de: "Perl · Merzig · Saarland",
      lb: "Perl · Mäerzeg · Saarland",
      en: "Perl · Merzig · Saarland",
      es: "Perl · Merzig · Sarre",
    },
  },
]

export async function SectionTerritoire({
  titreNiveau: Titre = "h2",
}: {
  titreNiveau?: "h1" | "h2"
}) {
  const t = await traducteur()
  return (
    <section
      aria-labelledby="titre-territoire"
      className="bg-nuit text-nuit-encre relative overflow-hidden"
    >
      <div className="conteneur grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
        <div>
          <p className="surtitre text-nuit-accent">
            {t({
              fr: "Notre territoire",
              de: "Unsere Region",
              lb: "Eis Regioun",
              en: "Our territory",
              es: "Nuestro territorio",
            })}
          </p>
          <Titre
            id="titre-territoire"
            className="titre-affiche mt-4 text-[clamp(2.6rem,1.4rem+5vw,5.6rem)]"
          >
            {t({
              fr: "Un territoire.",
              de: "Eine Region.",
              lb: "Eng Regioun.",
              en: "One territory.",
              es: "Un territorio.",
            })}
            <br />
            {t({
              fr: "Trois pays.",
              de: "Drei Länder.",
              lb: "Dräi Länner.",
              en: "Three countries.",
              es: "Tres países.",
            })}
            <br />
            <span className="text-nuit-accent">
              {t({
                fr: "Une radio.",
                de: "Ein Radio.",
                lb: "Ee Radio.",
                en: "One radio.",
                es: "Una radio.",
              })}
            </span>
          </Titre>
          <p className="presse text-nuit-encre-2 mt-8 max-w-xl text-[1.3rem] leading-snug">
            {t({
              fr: "Radio Tripoint connecte les habitants, les initiatives, les cultures et les événements du territoire des Trois Frontières — là où la France, le Luxembourg et l'Allemagne se rejoignent, sur la Moselle.",
              de: "Radio Tripoint verbindet die Menschen, Initiativen, Kulturen und Veranstaltungen des Dreiländerecks – dort, wo Frankreich, Luxemburg und Deutschland an der Mosel zusammentreffen.",
              lb: "Radio Tripoint verbënnt d'Leit, d'Initiativen, d'Kulturen an d'Evenementer aus dem Dräilännereck – do, wou Frankräich, Lëtzebuerg an Däitschland sech un der Musel treffen.",
              en: "Radio Tripoint connects the people, initiatives, cultures and events of the Three Borders territory — where France, Luxembourg and Germany meet, on the Moselle.",
              es: "Radio Tripoint conecta a los habitantes, las iniciativas, las culturas y los eventos del territorio de las Tres Fronteras, allí donde Francia, Luxemburgo y Alemania se encuentran, a orillas del Mosela.",
            })}
          </p>
          <ul className="bg-nuit-trait mt-10 grid gap-px sm:grid-cols-3">
            {pays.map((p) => (
              <li key={p.code} className="bg-nuit p-4 sm:p-5">
                <p className="titre-affiche text-nuit-accent text-[2rem]" aria-hidden>
                  {p.code}
                </p>
                <p className="mt-2 font-bold">{t(p.nom)}</p>
                <p className="text-nuit-encre-2 mt-1 text-sm leading-snug">{t(p.lieux)}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-[34rem]">
          <CarteTerritoire />
        </div>
      </div>
    </section>
  )
}
