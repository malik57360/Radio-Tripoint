import { ArrowRight } from "lucide-react"
import Link from "@/components/ui/Lien"
import { BoutonDirect } from "@/components/radio/BoutonDirect"
import { SectionTerritoire } from "@/components/territoire/SectionTerritoire"
import { PageHero } from "@/components/ui/PageHero"
import { site } from "@/config/site"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "À propos — la radio des Trois Frontières",
      de: "Über uns — das Radio des Dreiländerecks",
      lb: "Iwwer eis — de Radio vum Dräilännereck",
      en: "About — the radio of the Three Borders",
      es: "Quiénes somos — la radio de las Tres Fronteras",
    },
    description: {
      fr: "Radio Tripoint, radio et média transfrontalier basé à Sierck-les-Bains : notre histoire, notre mission et notre territoire entre France, Luxembourg et Allemagne.",
      de: "Radio Tripoint, grenzüberschreitendes Radio und Medium aus Sierck-les-Bains: unsere Geschichte, unsere Aufgabe und unsere Region zwischen Frankreich, Luxemburg und Deutschland.",
      lb: "Radio Tripoint, grenziwwerschreidende Radio a Medium vu Sierck-les-Bains: eis Geschicht, eis Missioun an eis Regioun tëscht Frankräich, Lëtzebuerg an Däitschland.",
      en: "Radio Tripoint, a cross-border radio station and media outlet based in Sierck-les-Bains: our story, our mission and our territory between France, Luxembourg and Germany.",
      es: "Radio Tripoint, radio y medio transfronterizo con sede en Sierck-les-Bains: nuestra historia, nuestra misión y nuestro territorio entre Francia, Luxemburgo y Alemania.",
    },
    chemin: "/a-propos",
  })

function Chapitre({ n, titre, children }: { n: string; titre: string; children: React.ReactNode }) {
  return (
    <section
      aria-labelledby={`ch-${n}`}
      className="filet-section grid gap-6 pt-6 lg:grid-cols-[1fr_2fr] lg:gap-14"
    >
      <div className="flex items-baseline gap-4 lg:block">
        <span className="titre-affiche text-accent-encre text-[2.4rem] tabular-nums lg:text-[3.6rem]">
          {n}
        </span>
        <h2
          id={`ch-${n}`}
          className="titre-section !text-[clamp(1.7rem,1.2rem+1.8vw,2.6rem)] lg:mt-3"
        >
          {titre}
        </h2>
      </div>
      <div className="presse text-encre-2 space-y-5 text-[1.22rem] leading-relaxed">{children}</div>
    </section>
  )
}

export default async function PageAPropos() {
  const t = await traducteur()
  return (
    <>
      <PageHero
        miettes={[
          {
            nom: t({
              fr: "À propos",
              de: "Über uns",
              lb: "Iwwer eis",
              en: "About",
              es: "Quiénes somos",
            }),
            chemin: "/a-propos",
          },
        ]}
        surtitre={t({
          fr: "Radio · Média · Territoire",
          de: "Radio · Medium · Region",
          lb: "Radio · Medium · Regioun",
          en: "Radio · Media · Territory",
          es: "Radio · Medio · Territorio",
        })}
        titre={
          <>
            {t({
              fr: "Une radio qui connecte",
              de: "Ein Radio, das Regionen",
              lb: "E Radio, deen d'Regiounen",
              en: "A radio that connects",
              es: "Una radio que conecta",
            })}
            <br className="hidden sm:block" />{" "}
            {t({
              fr: "les régions et les esprits.",
              de: "und Menschen verbindet.",
              lb: "an d'Leit verbënnt.",
              en: "regions and minds.",
              es: "regiones y personas.",
            })}
          </>
        }
        intro={t({
          fr: "Radio Tripoint est la radio et le média des Trois Frontières. Depuis Sierck-les-Bains, elle parle à celles et ceux qui vivent, travaillent et sortent entre la France, le Luxembourg et l'Allemagne.",
          de: "Radio Tripoint ist das Radio und Medium des Dreiländerecks. Aus Sierck-les-Bains spricht es alle an, die zwischen Frankreich, Luxemburg und Deutschland leben, arbeiten und ausgehen.",
          lb: "Radio Tripoint ass de Radio an d'Medium vum Dräilännereck. Vu Sierck-les-Bains aus schwätzt en all déi un, déi tëscht Frankräich, Lëtzebuerg an Däitschland liewen, schaffen an erausginn.",
          en: "Radio Tripoint is the radio station and media outlet of the Three Borders. From Sierck-les-Bains, it speaks to everyone who lives, works and goes out between France, Luxembourg and Germany.",
          es: "Radio Tripoint es la radio y el medio de las Tres Fronteras. Desde Sierck-les-Bains, habla a quienes viven, trabajan y salen entre Francia, Luxemburgo y Alemania.",
        })}
      />

      <div className="conteneur space-y-16 py-16 lg:space-y-24 lg:py-24">
        <Chapitre
          n="01"
          titre={t({
            fr: "Notre histoire",
            de: "Unsere Geschichte",
            lb: "Eis Geschicht",
            en: "Our story",
            es: "Nuestra historia",
          })}
        >
          <p>
            {t({
              fr: "Radio Tripoint est née à Sierck-les-Bains, au cœur du Sierckois, là où la Moselle fait frontière. Elle s'est installée à l'hôtel de ville, sur le quai des Ducs de Lorraine, avec une idée simple : donner au territoire des Trois Frontières une radio qui lui ressemble.",
              de: "Radio Tripoint ist in Sierck-les-Bains entstanden, im Herzen des Sierckois, dort, wo die Mosel die Grenze bildet. Der Sender hat sich im Rathaus am Quai des Ducs de Lorraine niedergelassen, mit einer einfachen Idee: dem Dreiländereck ein Radio zu geben, das zu ihm passt.",
              lb: "Radio Tripoint ass zu Sierck-les-Bains entstanen, am Häerz vum Sierckois, do wou d'Musel d'Grenz mécht. De Radio huet sech am Gemengenhaus um Quai des Ducs de Lorraine néiergelooss, mat enger einfacher Iddi: dem Dräilännereck e Radio ze ginn, deen zu him passt.",
              en: "Radio Tripoint was born in Sierck-les-Bains, in the heart of the Sierckois area, where the Moselle forms the border. It set up in the town hall, on the Quai des Ducs de Lorraine, with a simple idea: to give the Three Borders territory a radio station that reflects it.",
              es: "Radio Tripoint nació en Sierck-les-Bains, en el corazón del Sierckois, allí donde el Mosela hace de frontera. Se instaló en el ayuntamiento, en el quai des Ducs de Lorraine, con una idea sencilla: dar al territorio de las Tres Fronteras una radio que se le parezca.",
            })}
          </p>
          <p>
            {t({
              fr: "Ce site accompagne une nouvelle étape : faire de Radio Tripoint un média complet, où l'on écoute, où l'on lit, et où l'on participe.",
              de: "Diese Website begleitet einen neuen Schritt: Radio Tripoint zu einem vollständigen Medium zu machen, in dem man hört, liest und mitmacht.",
              lb: "Dëse Site begleet eng nei Etapp: Radio Tripoint zu engem kompletten Medium ze maachen, wou ee lauschtert, liest a matmécht.",
              en: "This website marks a new stage: making Radio Tripoint a complete media outlet, where you can listen, read and take part.",
              es: "Esta web acompaña una nueva etapa: hacer de Radio Tripoint un medio completo, donde se escucha, se lee y se participa.",
            })}
          </p>
        </Chapitre>

        <Chapitre
          n="02"
          titre={t({
            fr: "Notre mission",
            de: "Unsere Aufgabe",
            lb: "Eis Missioun",
            en: "Our mission",
            es: "Nuestra misión",
          })}
        >
          <p>
            {t({
              fr: "Informer, divertir et relier. Radio Tripoint diffuse des programmes et des contenus de qualité, relaie l'actualité locale, la culture, le sport et les messages de prévention, et donne la parole aux habitants.",
              de: "Informieren, unterhalten und verbinden. Radio Tripoint sendet hochwertige Programme und Inhalte, berichtet über lokale Nachrichten, Kultur, Sport und Präventionsbotschaften und gibt den Menschen vor Ort eine Stimme.",
              lb: "Informéieren, ënnerhalen a verbannen. Radio Tripoint iwwerdréit Programmer an Inhalter vu Qualitéit, bericht iwwer lokal Neiegkeeten, Kultur, Sport a Preventiounsmessagen, a gëtt de Leit aus der Regioun d'Wuert.",
              en: "To inform, entertain and connect. Radio Tripoint broadcasts quality programmes and content, relays local news, culture, sport and prevention messages, and gives local people a voice.",
              es: "Informar, entretener y unir. Radio Tripoint emite programas y contenidos de calidad, difunde la actualidad local, la cultura, el deporte y los mensajes de prevención, y da la palabra a los habitantes.",
            })}
          </p>
          <p>
            {t({
              fr: "Elle accompagne aussi les acteurs économiques du territoire : vente d'espaces publicitaires, conception de campagnes marketing et promotion de sites internet, avec la même exigence de qualité et de service.",
              de: "Der Sender begleitet auch die Unternehmen der Region: Verkauf von Werbeflächen, Konzeption von Marketingkampagnen und Promotion von Websites – mit demselben Anspruch an Qualität und Service.",
              lb: "De Radio begleet och d'Betriber aus der Regioun: Verkaf vu Reklammsplaz, Konzeptioun vu Marketingcampagnen a Promotioun vun Internetsiten – mam selwechten Usproch u Qualitéit a Service.",
              en: "It also supports the area's businesses: sale of advertising space, design of marketing campaigns and promotion of websites, with the same commitment to quality and service.",
              es: "También acompaña a los actores económicos del territorio: venta de espacios publicitarios, diseño de campañas de marketing y promoción de sitios web, con la misma exigencia de calidad y servicio.",
            })}
          </p>
        </Chapitre>

        <Chapitre
          n="03"
          titre={t({
            fr: "Notre territoire",
            de: "Unsere Region",
            lb: "Eis Regioun",
            en: "Our territory",
            es: "Nuestro territorio",
          })}
        >
          <p>
            {t({
              fr: "Sierck-les-Bains, Apach, Schengen, Perl, la Moselle, le Luxembourg, la Sarre : un même bassin de vie, trois pays, et des trajets quotidiens d'une rive à l'autre. C'est ce territoire que Radio Tripoint raconte.",
              de: "Sierck-les-Bains, Apach, Schengen, Perl, die Mosel, Luxemburg, das Saarland: ein gemeinsamer Lebensraum, drei Länder und tägliche Wege von einem Ufer zum anderen. Diese Region erzählt Radio Tripoint.",
              lb: "Sierck-les-Bains, Apach, Schengen, Perl, d'Musel, Lëtzebuerg, d'Saarland: ee gemeinsame Liewensraum, dräi Länner an alldeeglech Weeër vun engem Ufer op deen aneren. Dës Regioun erzielt Radio Tripoint.",
              en: "Sierck-les-Bains, Apach, Schengen, Perl, the Moselle, Luxembourg, Saarland: one shared living area, three countries, and daily journeys from one bank to the other. This is the territory Radio Tripoint tells the story of.",
              es: "Sierck-les-Bains, Apach, Schengen, Perl, el Mosela, Luxemburgo, el Sarre: una misma cuenca de vida, tres países y trayectos diarios de una orilla a la otra. Es el territorio que cuenta Radio Tripoint.",
            })}
          </p>
        </Chapitre>

        <Chapitre
          n="04"
          titre={t({
            fr: "Notre vision",
            de: "Unsere Vision",
            lb: "Eis Visioun",
            en: "Our vision",
            es: "Nuestra visión",
          })}
        >
          <p>
            {t({
              fr: "Une radio de proximité qui ne s'arrête pas aux frontières. Radio, site, podcasts, agenda, réseaux : un seul média pour suivre ce qui se passe près de chez soi, quel que soit le côté de la Moselle.",
              de: "Ein Lokalradio, das nicht an Grenzen haltmacht. Radio, Website, Podcasts, Agenda, Netzwerke: ein einziges Medium, um zu verfolgen, was in der Nähe passiert – egal auf welcher Seite der Mosel.",
              lb: "E Lokalradio, deen net un de Grenzen ophält. Radio, Site, Podcasts, Agenda, Netzwierker: een eenzegt Medium, fir ze verfollegen, wat bei engem an der Géigend geschitt – egal op wéi enger Säit vun der Musel.",
              en: "A local radio station that doesn't stop at borders. Radio, website, podcasts, events, social media: one media outlet to follow what's happening near you, whichever side of the Moselle you're on.",
              es: "Una radio de proximidad que no se detiene en las fronteras. Radio, web, pódcasts, agenda, redes: un solo medio para seguir lo que pasa cerca de casa, a cualquier lado del Mosela.",
            })}
          </p>
        </Chapitre>

        <Chapitre
          n="05"
          titre={t({
            fr: "Notre équipe",
            de: "Unser Team",
            lb: "Eis Equipe",
            en: "Our team",
            es: "Nuestro equipo",
          })}
        >
          <p>
            {t({
              fr: "La présentation de l'équipe de Radio Tripoint — les voix de l'antenne et celles et ceux qui la font vivre — sera publiée prochainement sur cette page.",
              de: "Die Vorstellung des Teams von Radio Tripoint – die Stimmen im Radio und alle, die den Sender lebendig machen – wird in Kürze auf dieser Seite veröffentlicht.",
              lb: "D'Presentatioun vun der Equipe vu Radio Tripoint – d'Stëmmen um Radio an all déi, déi en lieweg maachen – gëtt geschwënn op dëser Säit publizéiert.",
              en: "An introduction to the Radio Tripoint team — the voices on air and the people who keep it going — will be published on this page soon.",
              es: "La presentación del equipo de Radio Tripoint — las voces de la antena y quienes la hacen vivir — se publicará próximamente en esta página.",
            })}
          </p>
          <p className="font-sans text-base">
            {t({
              fr: "Envie de participer, de proposer une émission ou de rejoindre l'aventure ?",
              de: "Lust mitzumachen, eine Sendung vorzuschlagen oder beim Abenteuer dabei zu sein?",
              lb: "Loscht matzemaachen, eng Sendung ze proposéieren oder beim Abenteuer dobäi ze sinn?",
              en: "Want to take part, suggest a programme or join the adventure?",
              es: "¿Quiere participar, proponer un programa o unirse a la aventura?",
            })}{" "}
            <Link href="/contact" className="lien text-encre font-semibold">
              {t({
                fr: "Écrivez-nous",
                de: "Schreiben Sie uns",
                lb: "Schreift eis",
                en: "Write to us",
                es: "Escríbanos",
              })}
            </Link>
            .
          </p>
        </Chapitre>
      </div>

      <SectionTerritoire />

      <section aria-labelledby="titre-trois" className="conteneur py-16 lg:py-24">
        <h2 id="titre-trois" className="sr-only">
          {t({
            fr: "Radio, média, territoire",
            de: "Radio, Medium, Region",
            lb: "Radio, Medium, Regioun",
            en: "Radio, media, territory",
            es: "Radio, medio, territorio",
          })}
        </h2>
        <ul className="border-trait bg-trait grid gap-px border md:grid-cols-3">
          {[
            {
              t: t({ fr: "Radio", de: "Radio", lb: "Radio", en: "Radio", es: "Radio" }),
              x: t({
                fr: "Le direct, les émissions, les voix du territoire.",
                de: "Der Livestream, die Sendungen, die Stimmen der Region.",
                lb: "De Live-Stream, d'Sendungen, d'Stëmme vun der Regioun.",
                en: "Live radio, programmes, the voices of the territory.",
                es: "El directo, los programas, las voces del territorio.",
              }),
              href: "/emissions",
              l: t({
                fr: "Nos émissions",
                de: "Unsere Sendungen",
                lb: "Eis Sendungen",
                en: "Our programmes",
                es: "Nuestros programas",
              }),
            },
            {
              t: t({ fr: "Média", de: "Medium", lb: "Medium", en: "Media", es: "Medio" }),
              x: t({
                fr: "Actualités, podcasts, agenda : l'info locale au quotidien.",
                de: "Nachrichten, Podcasts, Agenda: lokale Infos für jeden Tag.",
                lb: "Neiegkeeten, Podcasts, Agenda: lokal Infoen all Dag.",
                en: "News, podcasts, events: local news every day.",
                es: "Noticias, pódcasts, agenda: la información local cada día.",
              }),
              href: "/actualites",
              l: t({
                fr: "Les actualités",
                de: "Die Nachrichten",
                lb: "D'Neiegkeeten",
                en: "The news",
                es: "Las noticias",
              }),
            },
            {
              t: t({
                fr: "Territoire",
                de: "Region",
                lb: "Regioun",
                en: "Territory",
                es: "Territorio",
              }),
              x: t({
                fr: "Trois pays, un bassin de vie, une antenne commune.",
                de: "Drei Länder, ein Lebensraum, ein gemeinsamer Sender.",
                lb: "Dräi Länner, ee Liewensraum, eng gemeinsam Antenn.",
                en: "Three countries, one living area, one shared station.",
                es: "Tres países, una cuenca de vida, una antena común.",
              }),
              href: "/agenda",
              l: t({
                fr: "L'agenda",
                de: "Die Agenda",
                lb: "D'Agenda",
                en: "Events",
                es: "La agenda",
              }),
            },
          ].map((b) => (
            <li key={b.href} className="bg-papier p-7 sm:p-9">
              <p className="titre-affiche text-[2.6rem]">{b.t}</p>
              <p className="text-encre-2 mt-3">{b.x}</p>
              <Link href={b.href} className="lien-fleche hover:text-accent-encre mt-6">
                {b.l} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <BoutonDirect taille="grand" />
          <p className="text-encre-3 text-sm">
            {site.nomOfficiel} · {t(site.contact.adresse.lieu)}, {site.contact.adresse.ville}
          </p>
        </div>
      </section>
    </>
  )
}
