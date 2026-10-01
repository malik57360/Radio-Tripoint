import { PageHero } from "@/components/ui/PageHero"
import { ShowCard } from "@/components/shows/ShowCard"
import { BoutonDirect } from "@/components/radio/BoutonDirect"
import { listerEmissions } from "@/lib/contenu/emissions"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"
import Link from "@/components/ui/Lien"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Nos émissions — les rendez-vous de Radio Tripoint",
      de: "Unsere Sendungen — die Termine von Radio Tripoint",
      lb: "Eis Sendungen — d'Rendez-vousen vu Radio Tripoint",
      en: "Our programmes — Radio Tripoint's shows",
      es: "Nuestros programas — las citas de Radio Tripoint",
    },
    description: {
      fr: "Génération Z, À vous la parole, Histoire & Mémoire Régionale, Talents du coin !… Découvrez les émissions de Radio Tripoint, la radio des Trois Frontières.",
      de: "Génération Z, À vous la parole, Histoire & Mémoire Régionale, Talents du coin !… Entdecken Sie die Sendungen von Radio Tripoint, dem Radio des Dreiländerecks.",
      lb: "Génération Z, À vous la parole, Histoire & Mémoire Régionale, Talents du coin !… Entdeckt d'Sendunge vu Radio Tripoint, dem Radio vum Dräilännereck.",
      en: "Génération Z, À vous la parole, Histoire & Mémoire Régionale, Talents du coin!… Discover the programmes of Radio Tripoint, the radio of the Three Borders.",
      es: "Génération Z, À vous la parole, Histoire & Mémoire Régionale, Talents du coin!… Descubra los programas de Radio Tripoint, la radio de las Tres Fronteras.",
    },
    chemin: "/emissions",
  })

export default async function PageEmissions() {
  const t = await traducteur()
  const emissions = await listerEmissions(t.langue)
  const grilleConnue = emissions.some((e) => e.creneaux.length > 0)
  return (
    <>
      <PageHero
        miettes={[
          {
            nom: t({
              fr: "Émissions",
              de: "Sendungen",
              lb: "Sendungen",
              en: "Programmes",
              es: "Programas",
            }),
            chemin: "/emissions",
          },
        ]}
        surtitre={t({
          fr: "À l'antenne",
          de: "Auf Sendung",
          lb: "Um Sender",
          en: "On air",
          es: "En antena",
        })}
        titre={t({
          fr: "Nos émissions",
          de: "Unsere Sendungen",
          lb: "Eis Sendungen",
          en: "Our programmes",
          es: "Nuestros programas",
        })}
        intro={t({
          fr: "Des voix d'ici, des sujets d'ici. Jeunesse, mémoire, bien-être, talents locaux et parole aux auditeurs : les rendez-vous qui font Radio Tripoint.",
          de: "Stimmen von hier, Themen von hier. Jugend, Erinnerung, Wohlbefinden, lokale Talente und die Stimme der Hörer: die Sendungen, die Radio Tripoint ausmachen.",
          lb: "Stëmme vun hei, Themen vun hei. Jugend, Erënnerung, Wuelbefannen, lokal Talenter an d'Wuert fir d'Auditeuren: d'Rendez-vousen, déi Radio Tripoint ausmaachen.",
          en: "Local voices, local stories. Youth, memory, wellbeing, local talent and listeners' voices: the programmes that make Radio Tripoint.",
          es: "Voces de aquí, temas de aquí. Juventud, memoria, bienestar, talentos locales y la palabra a los oyentes: las citas que hacen Radio Tripoint.",
        })}
        enfants={
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <BoutonDirect taille="grand" />
            <Link href="/podcasts" className="btn btn-trait min-h-14 !px-6">
              {t({
                fr: "Écouter les replays",
                de: "Wiederholungen anhören",
                lb: "Replays lauschteren",
                en: "Listen to replays",
                es: "Escuchar a la carta",
              })}
            </Link>
          </div>
        }
      />
      <section
        aria-label={t({
          fr: "Liste des émissions",
          de: "Liste der Sendungen",
          lb: "Lëscht vun de Sendungen",
          en: "List of programmes",
          es: "Lista de programas",
        })}
        className="conteneur py-12 lg:py-16"
      >
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {emissions.map((e) => (
            <li key={e.slug}>
              <ShowCard emission={e} titreNiveau="h2" />
            </li>
          ))}
        </ul>
        {!grilleConnue && (
          <p className="text-encre-3 mt-10 max-w-2xl text-sm">
            {t({
              fr: "La grille horaire détaillée sera publiée ici prochainement. Pour savoir ce qui passe à l'antenne, lancez le direct.",
              de: "Das ausführliche Programm wird hier in Kürze veröffentlicht. Was gerade läuft, hören Sie im Livestream.",
              lb: "De Programm am Detail gëtt hei geschwënn publizéiert. Wat grad leeft, héiert Dir am Live-Stream.",
              en: "The detailed schedule will be published here soon. To find out what's on air, start the live stream.",
              es: "La parrilla detallada se publicará aquí próximamente. Para saber qué suena en antena, ponga el directo.",
            })}
          </p>
        )}
      </section>
    </>
  )
}
