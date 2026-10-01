import { ArrowDown, Globe, Megaphone, Phone, Radio, Sparkles, Ticket } from "lucide-react"
import { FormulairePublicite } from "@/components/forms/FormulairePublicite"
import { Tripoint } from "@/components/marque/Tripoint"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { site } from "@/config/site"
import type { Trad } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Publicité radio et web dans les Trois Frontières",
      de: "Radio- und Webwerbung im Dreiländereck",
      lb: "Radios- a Webreklamm am Dräilännereck",
      en: "Radio and web advertising in the Three Borders",
      es: "Publicidad en radio y web en las Tres Fronteras",
    },
    description: {
      fr: "Faites connaître votre entreprise sur Radio Tripoint : publicité radio, campagnes locales, promotion web et événementielle entre Moselle, Luxembourg et Sarre.",
      de: "Machen Sie Ihr Unternehmen auf Radio Tripoint bekannt: Radiowerbung, lokale Kampagnen, Web- und Event-Promotion zwischen Mosel, Luxemburg und Saarland.",
      lb: "Maacht Är Firma op Radio Tripoint bekannt: Radiosreklamm, lokal Campagnen, Web- an Evenementspromotioun tëscht Musel, Lëtzebuerg a Saarland.",
      en: "Promote your business on Radio Tripoint: radio advertising, local campaigns, web and event promotion between the Moselle, Luxembourg and Saarland.",
      es: "Dé a conocer su empresa en Radio Tripoint: publicidad en radio, campañas locales, promoción web y de eventos entre el Mosela, Luxemburgo y el Sarre.",
    },
    chemin: "/publicite",
  })

const solutions: { icone: typeof Radio; titre: Trad; texte: Trad }[] = [
  {
    icone: Radio,
    titre: {
      fr: "Publicité radio",
      de: "Radiowerbung",
      lb: "Radiosreklamm",
      en: "Radio advertising",
      es: "Publicidad en radio",
    },
    texte: {
      fr: "Des spots diffusés sur l'antenne de Radio Tripoint, pour une présence régulière auprès des auditeurs du territoire.",
      de: "Spots auf Radio Tripoint für eine regelmäßige Präsenz bei den Hörerinnen und Hörern der Region.",
      lb: "Spotten op Radio Tripoint, fir reegelméisseg bei den Auditeuren aus der Regioun präsent ze sinn.",
      en: "Spots broadcast on Radio Tripoint, for a regular presence among the area's listeners.",
      es: "Cuñas emitidas en la antena de Radio Tripoint, para una presencia regular entre los oyentes del territorio.",
    },
  },
  {
    icone: Megaphone,
    titre: {
      fr: "Campagnes locales",
      de: "Lokale Kampagnen",
      lb: "Lokal Campagnen",
      en: "Local campaigns",
      es: "Campañas locales",
    },
    texte: {
      fr: "Un message pensé pour votre zone de chalandise, de Sierck-les-Bains à la Grande Région, construit et suivi avec notre équipe.",
      de: "Eine Botschaft für Ihr Einzugsgebiet, von Sierck-les-Bains bis zur Großregion, gemeinsam mit unserem Team entwickelt und begleitet.",
      lb: "E Message fir Ären Aklagebitt, vu Sierck-les-Bains bis an d'Groussregioun, zesumme mat eiser Equipe ausgeschafft a begleet.",
      en: "A message designed for your catchment area, from Sierck-les-Bains to the Greater Region, built and monitored with our team.",
      es: "Un mensaje pensado para su zona de influencia, de Sierck-les-Bains a la Gran Región, construido y seguido con nuestro equipo.",
    },
  },
  {
    icone: Globe,
    titre: {
      fr: "Promotion web",
      de: "Web-Promotion",
      lb: "Web-Promotioun",
      en: "Web promotion",
      es: "Promoción web",
    },
    texte: {
      fr: "La mise en avant de votre activité et de votre site internet sur les supports numériques de Radio Tripoint.",
      de: "Die Präsentation Ihres Unternehmens und Ihrer Website auf den digitalen Kanälen von Radio Tripoint.",
      lb: "D'Presentatioun vun Ärer Aktivitéit an Ärem Internetsite op den digitale Kanäl vu Radio Tripoint.",
      en: "Showcasing your business and your website on Radio Tripoint's digital channels.",
      es: "La puesta en valor de su actividad y de su sitio web en los soportes digitales de Radio Tripoint.",
    },
  },
  {
    icone: Ticket,
    titre: {
      fr: "Campagnes événementielles",
      de: "Veranstaltungskampagnen",
      lb: "Evenementscampagnen",
      en: "Event campaigns",
      es: "Campañas de eventos",
    },
    texte: {
      fr: "Un lancement, une ouverture, une fête, un salon : un dispositif radio et web autour de votre date.",
      de: "Ein Launch, eine Eröffnung, ein Fest, eine Messe: ein Radio- und Web-Paket rund um Ihren Termin.",
      lb: "E Lancement, eng Ouverture, eng Fest, e Salon: e Radio- a Web-Pak ronderëm Ären Datum.",
      en: "A launch, an opening, a festival, a trade fair: a radio and web campaign around your date.",
      es: "Un lanzamiento, una inauguración, una fiesta, una feria: un dispositivo de radio y web en torno a su fecha.",
    },
  },
  {
    icone: Sparkles,
    titre: {
      fr: "Visibilité digitale",
      de: "Digitale Sichtbarkeit",
      lb: "Digital Visibilitéit",
      en: "Digital visibility",
      es: "Visibilidad digital",
    },
    texte: {
      fr: "Présence sur le site et les réseaux de la radio, en complément de l'antenne, pour prolonger votre message.",
      de: "Präsenz auf der Website und in den Netzwerken des Senders, ergänzend zum Radio, damit Ihre Botschaft weiterwirkt.",
      lb: "Präsenz um Site an an de Netzwierker vum Radio, als Ergänzung zur Antenn, fir Äre Message ze verlängeren.",
      en: "Presence on the radio's website and social media, alongside the airwaves, to extend your message.",
      es: "Presencia en la web y las redes de la radio, como complemento de la antena, para prolongar su mensaje.",
    },
  },
]

const etapes: { titre: Trad; texte: Trad }[] = [
  {
    titre: {
      fr: "Vous nous parlez de votre projet",
      de: "Sie erzählen uns von Ihrem Projekt",
      lb: "Dir erzielt eis vun Ärem Projet",
      en: "You tell us about your project",
      es: "Nos habla de su proyecto",
    },
    texte: {
      fr: "Votre activité, votre objectif, votre calendrier, votre zone.",
      de: "Ihr Unternehmen, Ihr Ziel, Ihr Zeitplan, Ihr Gebiet.",
      lb: "Är Aktivitéit, Äert Zil, Äre Kalenner, Äert Gebitt.",
      en: "Your business, your goal, your timeline, your area.",
      es: "Su actividad, su objetivo, su calendario, su zona.",
    },
  },
  {
    titre: {
      fr: "Nous construisons une proposition",
      de: "Wir erstellen ein Angebot",
      lb: "Mir schaffen eng Propose aus",
      en: "We build a proposal",
      es: "Elaboramos una propuesta",
    },
    texte: {
      fr: "Un dispositif sur mesure : antenne, web, ou les deux.",
      de: "Ein Paket nach Maß: Radio, Web oder beides.",
      lb: "E Pak op Mooss: Radio, Web oder allebéid.",
      en: "A tailor-made package: on air, online, or both.",
      es: "Un dispositivo a medida: antena, web o ambas.",
    },
  },
  {
    titre: {
      fr: "Votre message est diffusé",
      de: "Ihre Botschaft wird ausgestrahlt",
      lb: "Äre Message gëtt iwwerdroen",
      en: "Your message goes out",
      es: "Su mensaje se difunde",
    },
    texte: {
      fr: "Conception, diffusion et suivi, avec un interlocuteur unique.",
      de: "Konzeption, Ausstrahlung und Begleitung, mit einem einzigen Ansprechpartner.",
      lb: "Konzeptioun, Iwwerdroung a Suivi, mat engem eenzege Kontakt.",
      en: "Design, broadcasting and follow-up, with a single point of contact.",
      es: "Diseño, difusión y seguimiento, con un único interlocutor.",
    },
  },
]

const atouts: { titre: Trad; texte: Trad }[] = [
  {
    titre: {
      fr: "Transfrontalier par nature",
      de: "Grenzüberschreitend von Natur aus",
      lb: "Grenziwwerschreidend vun Natur aus",
      en: "Cross-border by nature",
      es: "Transfronteriza por naturaleza",
    },
    texte: {
      fr: "Basée à Sierck-les-Bains, à quelques kilomètres du tripoint de Schengen, la radio s'adresse à un bassin de vie partagé entre la France, le Luxembourg et l'Allemagne.",
      de: "Mit Sitz in Sierck-les-Bains, wenige Kilometer vom Dreiländereck bei Schengen, richtet sich der Sender an einen gemeinsamen Lebensraum zwischen Frankreich, Luxemburg und Deutschland.",
      lb: "Vu Sierck-les-Bains aus, e puer Kilometer vum Dräilännerpunkt vu Schengen, riicht de Radio sech un e gemeinsame Liewensraum tëscht Frankräich, Lëtzebuerg an Däitschland.",
      en: "Based in Sierck-les-Bains, a few kilometres from the Schengen tripoint, the radio speaks to a living area shared between France, Luxembourg and Germany.",
      es: "Con sede en Sierck-les-Bains, a pocos kilómetros del trifinio de Schengen, la radio se dirige a una cuenca de vida compartida entre Francia, Luxemburgo y Alemania.",
    },
  },
  {
    titre: {
      fr: "Radio et web",
      de: "Radio und Web",
      lb: "Radio a Web",
      en: "Radio and web",
      es: "Radio y web",
    },
    texte: {
      fr: "L'antenne, le site et les réseaux : votre message peut vivre sur plusieurs supports, dans une même campagne.",
      de: "Radio, Website und Netzwerke: Ihre Botschaft kann in einer einzigen Kampagne auf mehreren Kanälen leben.",
      lb: "Antenn, Site an Netzwierker: Äre Message kann an enger eenzeger Campagne op méi Kanäl liewen.",
      en: "On air, online and on social media: your message can live on several channels within one campaign.",
      es: "La antena, la web y las redes: su mensaje puede vivir en varios soportes dentro de una misma campaña.",
    },
  },
  {
    titre: {
      fr: "Un accompagnement de proximité",
      de: "Betreuung aus der Nähe",
      lb: "Eng Begleedung vu no",
      en: "Local, hands-on support",
      es: "Un acompañamiento cercano",
    },
    texte: {
      fr: "Un interlocuteur qui connaît le territoire, attentif aux détails de votre projet.",
      de: "Ein Ansprechpartner, der die Region kennt und auf die Details Ihres Projekts achtet.",
      lb: "E Kontakt, deen d'Regioun kennt an op d'Detailer vun Ärem Projet oppasst.",
      en: "A contact who knows the area and pays attention to the details of your project.",
      es: "Un interlocutor que conoce el territorio, atento a los detalles de su proyecto.",
    },
  },
]

export default async function PagePublicite() {
  const t = await traducteur()
  return (
    <>
      <header className="bg-accent text-sur-accent relative isolate overflow-hidden">
        <Tripoint
          className="pointer-events-none absolute top-1/2 left-[80%] -z-10 h-[160%] w-auto -translate-x-1/2 -translate-y-1/2 text-black/15"
          epaisseur={1}
        />
        <div className="conteneur pt-6 pb-14 sm:pt-8 lg:pb-24">
          <Breadcrumbs
            sombre
            elements={[
              {
                nom: t({
                  fr: "Publicité",
                  de: "Werbung",
                  lb: "Reklamm",
                  en: "Advertising",
                  es: "Publicidad",
                }),
                chemin: "/publicite",
              },
            ]}
            className="[&_*]:!text-black/70"
          />
          <p className="surtitre mt-10 opacity-80">{t(site.promessePro)}</p>
          <h1 className="titre-affiche mt-4 text-[clamp(2.8rem,1.4rem+6.4vw,7rem)]">
            {t({
              fr: "Votre entreprise.",
              de: "Ihr Unternehmen.",
              lb: "Är Firma.",
              en: "Your business.",
              es: "Su empresa.",
            })}
            <br />
            {t({
              fr: "Notre audience.",
              de: "Unser Publikum.",
              lb: "Eise Public.",
              en: "Our audience.",
              es: "Nuestra audiencia.",
            })}
          </h1>
          <p className="presse mt-6 max-w-2xl text-[1.3rem] leading-snug opacity-90 sm:text-[1.45rem]">
            {t({
              fr: "Radio Tripoint diffuse ses programmes, vend des espaces publicitaires et conçoit des campagnes marketing pour les entreprises des Trois Frontières — avec l'exigence d'un service soigné, du premier échange à la diffusion.",
              de: "Radio Tripoint sendet sein Programm, verkauft Werbeflächen und entwickelt Marketingkampagnen für Unternehmen im Dreiländereck – mit dem Anspruch eines sorgfältigen Service, vom ersten Gespräch bis zur Ausstrahlung.",
              lb: "Radio Tripoint iwwerdréit säi Programm, verkeeft Reklammsplaz a schafft Marketingcampagne fir d'Firmen aus dem Dräilännereck aus – mam Usproch vun engem suergfältege Service, vum éischte Gespréich bis zur Iwwerdroung.",
              en: "Radio Tripoint broadcasts its programmes, sells advertising space and designs marketing campaigns for businesses in the Three Borders — with a commitment to careful service, from the first conversation to broadcast.",
              es: "Radio Tripoint emite sus programas, vende espacios publicitarios y diseña campañas de marketing para las empresas de las Tres Fronteras, con la exigencia de un servicio cuidado, desde el primer contacto hasta la difusión.",
            })}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={`tel:${site.contact.telephoneE164}`}
              className="btn bg-sur-accent text-accent hover:bg-nuit-3 min-h-14 !px-6"
            >
              <Phone className="size-4" aria-hidden />{" "}
              {t({
                fr: "Parler à notre équipe",
                de: "Mit unserem Team sprechen",
                lb: "Mat eiser Equipe schwätzen",
                en: "Talk to our team",
                es: "Hablar con nuestro equipo",
              })}
            </a>
            <a
              href="#demande"
              className="btn min-h-14 border-[1.5px] border-current !px-6 hover:bg-black/10"
            >
              {t({
                fr: "Demander une offre",
                de: "Angebot anfragen",
                lb: "Offer ufroen",
                en: "Request a quote",
                es: "Solicitar una oferta",
              })}{" "}
              <ArrowDown className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </header>

      <section aria-labelledby="titre-solutions" className="conteneur py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="surtitre text-accent-encre">
              {t({
                fr: "Nos solutions",
                de: "Unsere Angebote",
                lb: "Eis Léisungen",
                en: "Our solutions",
                es: "Nuestras soluciones",
              })}
            </p>
            <h2 id="titre-solutions" className="titre-section mt-2">
              {t({
                fr: "Se faire entendre, des deux côtés de la frontière.",
                de: "Gehört werden – auf beiden Seiten der Grenze.",
                lb: "Sech héiere loossen – op béide Säite vun der Grenz.",
                en: "Be heard on both sides of the border.",
                es: "Hacerse oír a ambos lados de la frontera.",
              })}
            </h2>
          </div>
          <ul className="border-trait bg-trait grid gap-px border sm:grid-cols-2">
            {solutions.map(({ icone: Icone, titre, texte }, i) => (
              <li
                key={titre.fr}
                className={`bg-papier p-6 sm:p-8 ${i === 0 ? "sm:col-span-2" : ""}`}
              >
                <Icone className="text-accent-encre size-7" aria-hidden strokeWidth={1.6} />
                <h3 className="titre-carte mt-5 text-[1.35rem]">{t(titre)}</h3>
                <p className="text-encre-2 mt-2">{t(texte)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="titre-pourquoi" className="bg-nuit text-nuit-encre">
        <div className="conteneur grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="surtitre text-nuit-accent">
              {t({
                fr: "Pourquoi Radio Tripoint",
                de: "Warum Radio Tripoint",
                lb: "Firwat Radio Tripoint",
                en: "Why Radio Tripoint",
                es: "Por qué Radio Tripoint",
              })}
            </p>
            <h2 id="titre-pourquoi" className="titre-section mt-2">
              {t({
                fr: "Un média ancré dans un territoire unique.",
                de: "Ein Medium, verwurzelt in einer einzigartigen Region.",
                lb: "E Medium, verankert an enger eenzegaarteger Regioun.",
                en: "A media outlet rooted in a unique territory.",
                es: "Un medio arraigado en un territorio único.",
              })}
            </h2>
          </div>
          <ul className="space-y-8">
            {atouts.map((a) => (
              <li key={a.titre.fr} className="border-nuit-trait border-t pt-5">
                <h3 className="titre-carte text-xl">{t(a.titre)}</h3>
                <p className="text-nuit-encre-2 mt-2">{t(a.texte)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="titre-etapes" className="conteneur py-16 lg:py-24">
        <p className="surtitre text-accent-encre">
          {t({
            fr: "Comment ça marche",
            de: "So funktioniert's",
            lb: "Sou funktionéiert et",
            en: "How it works",
            es: "Cómo funciona",
          })}
        </p>
        <h2 id="titre-etapes" className="titre-section mt-2">
          {t({
            fr: "Trois étapes, un interlocuteur.",
            de: "Drei Schritte, ein Ansprechpartner.",
            lb: "Dräi Schrëtt, ee Kontakt.",
            en: "Three steps, one contact.",
            es: "Tres etapas, un interlocutor.",
          })}
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {etapes.map((e, i) => (
            <li key={e.titre.fr} className="border-trait-fort border-t-2 pt-5">
              <span className="titre-affiche text-accent-encre text-[3rem] tabular-nums">
                0{i + 1}
              </span>
              <h3 className="titre-carte mt-3 text-xl">{t(e.titre)}</h3>
              <p className="text-encre-2 mt-2">{t(e.texte)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="partenariats"
        aria-labelledby="titre-partenariats"
        className="border-trait bg-papier-2 scroll-mt-24 border-y"
      >
        <div className="conteneur grid gap-8 py-14 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:py-20">
          <h2 id="titre-partenariats" className="titre-section">
            {t({
              fr: "Partenariats",
              de: "Partnerschaften",
              lb: "Partenariater",
              en: "Partnerships",
              es: "Colaboraciones",
            })}
          </h2>
          <p className="presse text-encre-2 text-[1.25rem] leading-snug">
            {t({
              fr: "Collectivité, association, organisateur d'événement, média : Radio Tripoint est ouverte aux partenariats qui font vivre le territoire. Présentez-nous votre projet via le formulaire ci-dessous en choisissant « Partenariat ».",
              de: "Gemeinde, Verein, Veranstalter, Medium: Radio Tripoint ist offen für Partnerschaften, die die Region beleben. Stellen Sie uns Ihr Projekt über das Formular unten vor und wählen Sie „Partnerschaft“.",
              lb: "Gemeng, Veräin, Organisateur, Medium: Radio Tripoint ass op fir Partenariater, déi d'Regioun beliewen. Stellt eis Äre Projet iwwer de Formulaire hei ënnen vir a wielt „Partenariat“.",
              en: "Local authority, association, event organiser, media outlet: Radio Tripoint is open to partnerships that bring the territory to life. Tell us about your project using the form below and choose “Partnership”.",
              es: "Administración local, asociación, organizador de eventos, medio de comunicación: Radio Tripoint está abierta a las colaboraciones que dan vida al territorio. Preséntenos su proyecto con el formulario de abajo eligiendo «Colaboración».",
            })}
          </p>
        </div>
      </section>

      <section
        id="demande"
        aria-labelledby="titre-demande"
        className="conteneur scroll-mt-24 py-16 lg:py-24"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="surtitre text-accent-encre">
              {t({
                fr: "Demander une offre",
                de: "Angebot anfragen",
                lb: "Offer ufroen",
                en: "Request a quote",
                es: "Solicitar una oferta",
              })}
            </p>
            <h2 id="titre-demande" className="titre-section mt-2">
              {t({
                fr: "Parlons de votre projet.",
                de: "Sprechen wir über Ihr Projekt.",
                lb: "Loosst eis iwwer Äre Projet schwätzen.",
                en: "Let's talk about your project.",
                es: "Hablemos de su proyecto.",
              })}
            </h2>
            <p className="presse text-encre-2 mt-4 text-lg leading-snug">
              {t({
                fr: "Réponse personnalisée, sans engagement.",
                de: "Persönliche Antwort, unverbindlich.",
                lb: "Perséinlech Äntwert, ouni Engagement.",
                en: "A personalised reply, with no obligation.",
                es: "Respuesta personalizada, sin compromiso.",
              })}
            </p>
            <div className="mt-8 space-y-2 text-[0.95rem]">
              <p>
                <a href={`tel:${site.contact.telephoneE164}`} className="lien font-semibold">
                  {site.contact.telephone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.contact.email}`} className="lien break-all">
                  {site.contact.email}
                </a>
              </p>
            </div>
          </div>
          <FormulairePublicite />
        </div>
      </section>
    </>
  )
}
