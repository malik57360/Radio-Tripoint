import {
  ArrowLeftRight,
  ArrowRight,
  CalendarDays,
  Castle,
  Languages,
  MessageCircle,
  Mountain,
  Wine,
} from "lucide-react"
import { BoutonTripo } from "@/components/guide/BoutonTripo"
import { Mascotte } from "@/components/guide/Mascotte"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import Link from "@/components/ui/Lien"
import type { Trad } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Tripo, le guide des Trois Frontières",
      de: "Tripo, der Guide für das Dreiländereck",
      lb: "Tripo, de Guide fir d'Dräilännereck",
      en: "Tripo, the Three Borders guide",
      es: "Tripo, el guía de las Tres Fronteras",
    },
    description: {
      fr: "Balades, châteaux, vins de Moselle, sorties : posez vos questions à Tripo, le guide de Radio Tripoint pour Sierck-les-Bains, Apach, Perl, Schengen et toute la région.",
      de: "Wanderungen, Burgen, Moselwein, Ausflüge: Stellen Sie Ihre Fragen an Tripo, den Guide von Radio Tripoint für Sierck-les-Bains, Apach, Perl, Schengen und die ganze Region.",
      lb: "Tëppelsweeër, Schlässer, Muselwäin, Sortien: Stellt Är Froen dem Tripo, dem Guide vu Radio Tripoint fir Sierck-les-Bains, Apach, Perl, Schengen an d'ganz Regioun.",
      en: "Walks, castles, Moselle wines, outings: ask Tripo, Radio Tripoint's guide to Sierck-les-Bains, Apach, Perl, Schengen and the whole region.",
      es: "Paseos, castillos, vinos del Mosela, salidas: pregunte a Tripo, el guía de Radio Tripoint para Sierck-les-Bains, Apach, Perl, Schengen y toda la región.",
    },
    chemin: "/tripo",
  })

/** Ses clins d'œil au territoire. */
const QUI: { titre: Trad; texte: Trad }[] = [
  {
    titre: {
      fr: "Une grappe de la Moselle",
      de: "Eine Traube von der Mosel",
      lb: "Eng Drauf vun der Musel",
      en: "A bunch of Moselle grapes",
      es: "Un racimo del Mosela",
    },
    texte: {
      fr: "Les vignes de la Moselle courent le long de la rivière, en France, au Luxembourg et en Allemagne : un vignoble pour trois pays.",
      de: "Die Weinberge der Mosel ziehen sich am Fluss entlang, in Frankreich, Luxemburg und Deutschland: ein Weinbaugebiet für drei Länder.",
      lb: "D'Wéngerte vun der Musel zéie sech laanscht de Floss, a Frankräich, Lëtzebuerg an Däitschland: e Wéngert fir dräi Länner.",
      en: "The Moselle vineyards run along the river in France, Luxembourg and Germany: one wine region for three countries.",
      es: "Los viñedos del Mosela recorren el río en Francia, Luxemburgo y Alemania: una región vinícola para tres países.",
    },
  },
  {
    titre: {
      fr: "Un casque de radio",
      de: "Radiokopfhörer",
      lb: "Radioskopfhörer",
      en: "Radio headphones",
      es: "Auriculares de radio",
    },
    texte: {
      fr: "Il ne quitte jamais l'antenne de Radio Tripoint.",
      de: "Er verlässt nie den Sender von Radio Tripoint.",
      lb: "Hie verléisst ni d'Antenn vu Radio Tripoint.",
      en: "He never leaves Radio Tripoint's airwaves.",
      es: "Nunca se aleja de la antena de Radio Tripoint.",
    },
  },
  {
    titre: {
      fr: "Un foulard, trois pays",
      de: "Ein Halstuch, drei Länder",
      lb: "E Foulard, dräi Länner",
      en: "One neckerchief, three countries",
      es: "Un pañuelo, tres países",
    },
    texte: {
      fr: "Son foulard est jaune comme Radio Tripoint, et ses trois pans portent les couleurs de la France, du Luxembourg et de l'Allemagne : il est chez lui des deux côtés de la Moselle.",
      de: "Sein Halstuch ist gelb wie Radio Tripoint, und die drei Enden tragen die Farben Frankreichs, Luxemburgs und Deutschlands: Er ist auf beiden Seiten der Mosel zu Hause.",
      lb: "Säi Foulard ass giel wéi Radio Tripoint, an déi dräi Enner hunn d'Faarwe vu Frankräich, Lëtzebuerg an Däitschland: Hien ass op béide Säite vun der Musel doheem.",
      en: "His neckerchief is yellow like Radio Tripoint, and its three ends bear the colours of France, Luxembourg and Germany: he is at home on both sides of the Moselle.",
      es: "Su pañuelo es amarillo como Radio Tripoint, y sus tres puntas llevan los colores de Francia, Luxemburgo y Alemania: está en casa a ambos lados del Mosela.",
    },
  },
]

/** Ce que Tripo connaît : chaque carte pose directement la question. */
const SUJETS: { icone: typeof Mountain; titre: Trad; texte: Trad; question: Trad }[] = [
  {
    icone: Mountain,
    titre: {
      fr: "Balades et panoramas",
      de: "Wanderungen und Aussichten",
      lb: "Tëppelsweeër a Panoramaen",
      en: "Walks and viewpoints",
      es: "Paseos y miradores",
    },
    texte: {
      fr: "Les sentiers, les points de vue sur la Moselle, les boucles à faire à pied ou à vélo.",
      de: "Wege, Aussichtspunkte über der Mosel, Rundtouren zu Fuß oder mit dem Rad.",
      lb: "Weeër, Aussiichtspunkten iwwer der Musel, Tier ze Fouss oder mam Vëlo.",
      en: "Trails, viewpoints over the Moselle, loops to do on foot or by bike.",
      es: "Senderos, miradores sobre el Mosela, rutas a pie o en bici.",
    },
    question: {
      fr: "Une balade avec une belle vue sur la Moselle",
      de: "Ein Spaziergang mit schönem Blick auf die Mosel",
      lb: "E Spadséiergank mat engem schéine Bléck op d'Musel",
      en: "A walk with a nice view of the Moselle",
      es: "Un paseo con buenas vistas al Mosela",
    },
  },
  {
    icone: Castle,
    titre: {
      fr: "Châteaux et patrimoine",
      de: "Burgen und Kulturerbe",
      lb: "Schlässer a Patrimoine",
      en: "Castles and heritage",
      es: "Castillos y patrimonio",
    },
    texte: {
      fr: "Le château de Sierck, Malbrouck, Schengen, les chapelles et l'histoire du coin.",
      de: "Die Burg Sierck, Malbrouck, Schengen, die Kapellen und die Geschichte der Gegend.",
      lb: "D'Buerg vu Sierck, Malbrouck, Schengen, d'Kapellen an d'Geschicht vun der Géigend.",
      en: "Sierck castle, Malbrouck, Schengen, the chapels and local history.",
      es: "El castillo de Sierck, Malbrouck, Schengen, las capillas y la historia de la zona.",
    },
    question: {
      fr: "Quels châteaux visiter autour de Sierck-les-Bains ?",
      de: "Welche Burgen kann man rund um Sierck-les-Bains besichtigen?",
      lb: "Wéi eng Schlässer kann ee ronderëm Sierck-les-Bains besichen?",
      en: "Which castles can I visit around Sierck-les-Bains?",
      es: "¿Qué castillos visitar cerca de Sierck-les-Bains?",
    },
  },
  {
    icone: Wine,
    titre: {
      fr: "Vins et bonnes tables",
      de: "Wein und gute Küche",
      lb: "Wäin a gutt Kichen",
      en: "Wine and good food",
      es: "Vinos y buena mesa",
    },
    texte: {
      fr: "Les caves de la Moselle luxembourgeoise et allemande, les spécialités à goûter.",
      de: "Die Weinkeller an der luxemburgischen und deutschen Mosel, Spezialitäten zum Probieren.",
      lb: "D'Wäikelleren un der lëtzebuerger an däitscher Musel, Spezialitéiten zum Schmaachen.",
      en: "Wine cellars on the Luxembourg and German Moselle, specialities to try.",
      es: "Bodegas del Mosela luxemburgués y alemán, especialidades para probar.",
    },
    question: {
      fr: "Où déguster le vin de Moselle ?",
      de: "Wo kann man Moselwein probieren?",
      lb: "Wou kann ee Muselwäin schmaachen?",
      en: "Where to taste Moselle wine?",
      es: "¿Dónde probar el vino del Mosela?",
    },
  },
  {
    icone: CalendarDays,
    titre: {
      fr: "Sorties et agenda",
      de: "Ausgehen und Termine",
      lb: "Sortien an Agenda",
      en: "Outings and events",
      es: "Salidas y agenda",
    },
    texte: {
      fr: "Il connaît l'agenda publié par Radio Tripoint : fêtes, concerts, marchés, expositions.",
      de: "Er kennt die Termine von Radio Tripoint: Feste, Konzerte, Märkte, Ausstellungen.",
      lb: "Hie kennt d'Agenda vu Radio Tripoint: Fester, Concerten, Mäert, Ausstellungen.",
      en: "He knows the events published by Radio Tripoint: festivals, concerts, markets, exhibitions.",
      es: "Conoce la agenda publicada por Radio Tripoint: fiestas, conciertos, mercados, exposiciones.",
    },
    question: {
      fr: "Que faire ce week-end dans les Trois Frontières ?",
      de: "Was kann man dieses Wochenende im Dreiländereck unternehmen?",
      lb: "Wat kann ee dëse Weekend am Dräilännereck maachen?",
      en: "What to do this weekend in the Three Borders?",
      es: "¿Qué hacer este fin de semana en las Tres Fronteras?",
    },
  },
  {
    icone: ArrowLeftRight,
    titre: {
      fr: "Passer la frontière",
      de: "Über die Grenze",
      lb: "Iwwer d'Grenz",
      en: "Crossing the border",
      es: "Cruzar la frontera",
    },
    texte: {
      fr: "Aller de France au Luxembourg ou en Allemagne : routes, vélo, transports.",
      de: "Von Frankreich nach Luxemburg oder Deutschland: Straßen, Rad, Verkehrsmittel.",
      lb: "Vu Frankräich op Lëtzebuerg oder an Däitschland: Stroossen, Vëlo, Transport.",
      en: "Getting from France to Luxembourg or Germany: roads, cycling, transport.",
      es: "Ir de Francia a Luxemburgo o Alemania: carreteras, bici, transporte.",
    },
    question: {
      fr: "Aller de Sierck à Schengen à vélo",
      de: "Mit dem Rad von Sierck nach Schengen",
      lb: "Mam Vëlo vu Sierck op Schengen",
      en: "Cycling from Sierck to Schengen",
      es: "Ir de Sierck a Schengen en bici",
    },
  },
  {
    icone: Languages,
    titre: {
      fr: "Dans votre langue",
      de: "In Ihrer Sprache",
      lb: "An Ärer Sprooch",
      en: "In your language",
      es: "En su idioma",
    },
    texte: {
      fr: "Il répond dans la langue dans laquelle vous lui écrivez.",
      de: "Er antwortet in der Sprache, in der Sie ihm schreiben.",
      lb: "Hien äntwert an der Sprooch, an där Dir him schreift.",
      en: "He answers in the language you write to him in.",
      es: "Responde en el idioma en el que usted le escriba.",
    },
    question: {
      fr: "Une sortie en famille avec des enfants",
      de: "Ein Ausflug mit Kindern",
      lb: "En Ausfluch mat Kanner",
      en: "A family outing with children",
      es: "Una salida en familia con niños",
    },
  },
]

export default async function PageTripo() {
  const t = await traducteur()
  const actif = process.env.GUIDE_ACTIF === "1"
  const nom = "Tripo"

  return (
    <>
      <header className="bg-nuit text-nuit-encre overflow-hidden">
        <div className="conteneur pt-6 pb-12 sm:pt-8 lg:pb-16">
          <Breadcrumbs elements={[{ nom, chemin: "/tripo" }]} sombre />
          <div className="mt-6 grid items-center gap-8 sm:mt-10 md:grid-cols-[1fr_auto]">
            <div className="max-md:order-2">
              <p className="surtitre text-nuit-accent">
                {t({
                  fr: "Le guide des Trois Frontières",
                  de: "Der Guide für das Dreiländereck",
                  lb: "De Guide fir d'Dräilännereck",
                  en: "The Three Borders guide",
                  es: "El guía de las Tres Fronteras",
                })}
              </p>
              <h1 className="titre-affiche mt-3 text-[clamp(3.2rem,1.6rem+7vw,7rem)]">{nom}</h1>
              <p className="text-nuit-encre-2 mt-5 max-w-xl text-lg leading-relaxed">
                {t({
                  fr: "Salut ! Moi c'est Tripo. Je connais le coin par cœur, de Sierck à Schengen en passant par Perl : balades, châteaux, vins, fêtes de village, bons plans. Dites-moi ce qui vous ferait plaisir.",
                  de: "Hallo! Ich bin Tripo. Ich kenne die Gegend in- und auswendig, von Sierck über Perl bis Schengen: Wanderungen, Burgen, Wein, Dorffeste, gute Tipps. Sagen Sie mir, worauf Sie Lust haben.",
                  lb: "Moien! Ech sinn den Tripo. Ech kennen d'Géigend ausswenneg, vu Sierck iwwer Perl bis op Schengen: Tëppelsweeër, Schlässer, Wäin, Duerffester, gutt Tipps. Sot mer, op wat Dir Loscht hutt.",
                  en: "Hi! I'm Tripo. I know the area inside out, from Sierck to Schengen by way of Perl: walks, castles, wines, village festivals, tips. Tell me what you'd enjoy.",
                  es: "¡Hola! Soy Tripo. Me conozco la zona de memoria, de Sierck a Schengen pasando por Perl: paseos, castillos, vinos, fiestas de pueblo, buenos planes. Dígame qué le apetece.",
                })}
              </p>
              {actif ? (
                <BoutonTripo className="bg-accent text-sur-accent mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold transition-transform hover:scale-[1.03]">
                  <MessageCircle className="size-5" aria-hidden />
                  {t({
                    fr: "Parler à Tripo",
                    de: "Mit Tripo sprechen",
                    lb: "Mam Tripo schwätzen",
                    en: "Talk to Tripo",
                    es: "Hablar con Tripo",
                  })}
                </BoutonTripo>
              ) : (
                <p className="text-nuit-encre-2 mt-8 font-semibold">
                  {t({
                    fr: "Tripo arrive bientôt sur le site.",
                    de: "Tripo kommt bald auf die Website.",
                    lb: "Den Tripo kënnt geschwënn op de Site.",
                    en: "Tripo is coming to the website soon.",
                    es: "Tripo llegará pronto al sitio.",
                  })}
                </p>
              )}
            </div>
            <Mascotte
              anime
              titre={t({
                fr: "Tripo, une grappe de raisin souriante avec un casque de radio, une feuille de vigne sur la tête et un foulard jaune aux pans couleurs de la France, du Luxembourg et de l'Allemagne",
                de: "Tripo, eine lächelnde Weintraube mit Radiokopfhörern, einem Weinblatt auf dem Kopf und einem gelben Halstuch, dessen Enden die Farben Frankreichs, Luxemburgs und Deutschlands tragen",
                lb: "Tripo, eng laachend Wäidrauf mat Radioskopfhörer, engem Wäibliet um Kapp an engem giele Foulard, deem seng Enner d'Faarwe vu Frankräich, Lëtzebuerg an Däitschland hunn",
                en: "Tripo, a smiling bunch of grapes with radio headphones, a vine leaf on his head and a yellow neckerchief whose ends bear the colours of France, Luxembourg and Germany",
                es: "Tripo, un racimo de uvas sonriente con auriculares de radio, una hoja de parra en la cabeza y un pañuelo amarillo cuyas puntas llevan los colores de Francia, Luxemburgo y Alemania",
              })}
              className="mx-auto size-64 sm:size-72 lg:size-80"
            />
          </div>
        </div>
      </header>

      <div className="conteneur space-y-16 py-14 lg:space-y-20 lg:py-20">
        <section aria-labelledby="qui">
          <h2 id="qui" className="titre-section">
            {t({
              fr: "Qui est Tripo ?",
              de: "Wer ist Tripo?",
              lb: "Wien ass den Tripo?",
              en: "Who is Tripo?",
              es: "¿Quién es Tripo?",
            })}
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {QUI.map((q) => (
              <li key={q.titre.fr} className="border-accent bg-surface border-l-4 p-5">
                <p className="text-lg leading-snug font-bold">{t(q.titre)}</p>
                <p className="text-encre-2 mt-2">{t(q.texte)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sujets">
          <h2 id="sujets" className="titre-section">
            {t({
              fr: "Ce que Tripo connaît",
              de: "Was Tripo kennt",
              lb: "Wat den Tripo kennt",
              en: "What Tripo knows",
              es: "Lo que Tripo conoce",
            })}
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SUJETS.map((s) => {
              const Icone = s.icone
              const contenu = (
                <>
                  <span className="bg-accent text-sur-accent grid size-11 place-items-center rounded-full">
                    <Icone className="size-5" aria-hidden />
                  </span>
                  <span className="mt-4 block text-lg leading-snug font-bold">{t(s.titre)}</span>
                  <span className="text-encre-2 mt-2 block">{t(s.texte)}</span>
                  {actif && (
                    <span className="text-accent-encre mt-4 inline-flex items-center gap-1.5 text-sm font-bold">
                      « {t(s.question)} »
                      <ArrowRight className="size-4 flex-none" aria-hidden />
                    </span>
                  )}
                </>
              )
              return (
                <li key={s.titre.fr}>
                  {actif ? (
                    <BoutonTripo
                      question={t(s.question)}
                      className="bg-surface border-trait hover:border-accent block h-full w-full border p-5 text-left transition-colors"
                    >
                      {contenu}
                    </BoutonTripo>
                  ) : (
                    <div className="bg-surface border-trait h-full border p-5">{contenu}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="fonctionnement" className="filet-section pt-8">
          <h2 id="fonctionnement" className="titre-section">
            {t({
              fr: "Comment il répond",
              de: "Wie er antwortet",
              lb: "Wéi hien äntwert",
              en: "How he answers",
              es: "Cómo responde",
            })}
          </h2>
          <ul className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed">
            <li>
              {t({
                fr: "Il s'appuie sur les sources officielles (offices de tourisme, communes, sites des lieux) et sur l'agenda, les émissions et les actualités de Radio Tripoint.",
                de: "Er stützt sich auf offizielle Quellen (Tourismusbüros, Gemeinden, Websites der Orte) sowie auf die Termine, Sendungen und Nachrichten von Radio Tripoint.",
                lb: "Hie stäipt sech op offiziell Quellen (Tourismusbüroen, Gemengen, Websäite vun de Plazen) an op d'Agenda, d'Sendungen an d'Neiegkeete vu Radio Tripoint.",
                en: "He relies on official sources (tourist offices, towns, venue websites) and on Radio Tripoint's events, programmes and news.",
                es: "Se basa en fuentes oficiales (oficinas de turismo, municipios, webs de los lugares) y en la agenda, los programas y las noticias de Radio Tripoint.",
              })}
            </li>
            <li>
              {t({
                fr: "Pour ce qui change (horaires, tarifs, ouvertures), il vérifie sur le web et cite ses sources. Et quand il ne sait pas, il le dit.",
                de: "Bei allem, was sich ändert (Öffnungszeiten, Preise), prüft er im Web nach und nennt seine Quellen. Und wenn er etwas nicht weiß, sagt er es.",
                lb: "Fir alles, wat ännert (Ëffnungszäiten, Präisser), kuckt hien um Internet no a seet seng Quellen. A wann hien eppes net weess, seet hien et.",
                en: "For anything that changes (opening times, prices), he checks online and cites his sources. And when he doesn't know, he says so.",
                es: "Para lo que cambia (horarios, precios, aperturas), lo comprueba en la web y cita sus fuentes. Y cuando no lo sabe, lo dice.",
              })}
            </li>
            <li className="text-encre-2 text-base">
              {t({
                fr: "Réponses générées par une IA à partir de sources publiques : vérifiez horaires et tarifs avant de partir.",
                de: "Antworten werden von einer KI aus öffentlichen Quellen erstellt: Prüfen Sie Öffnungszeiten und Preise vor der Abfahrt.",
                lb: "Äntwerte gi vun enger KI aus ëffentleche Quelle generéiert: Kuckt Ëffnungszäiten a Präisser no, ier Dir lassfuert.",
                en: "Answers generated by AI from public sources: check opening times and prices before you go.",
                es: "Respuestas generadas por una IA a partir de fuentes públicas: compruebe horarios y precios antes de ir.",
              })}{" "}
              <Link href="/politique-confidentialite#guide" className="lien">
                {t({
                  fr: "Confidentialité",
                  de: "Datenschutz",
                  lb: "Dateschutz",
                  en: "Privacy",
                  es: "Privacidad",
                })}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}
