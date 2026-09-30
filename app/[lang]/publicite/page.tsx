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
    },
    description: {
      fr: "Faites connaître votre entreprise sur Radio Tripoint : publicité radio, campagnes locales, promotion web et événementielle entre Moselle, Luxembourg et Sarre.",
      de: "Machen Sie Ihr Unternehmen auf Radio Tripoint bekannt: Radiowerbung, lokale Kampagnen, Web- und Event-Promotion zwischen Mosel, Luxemburg und Saarland.",
      lb: "Maacht Är Firma op Radio Tripoint bekannt: Radiosreklamm, lokal Campagnen, Web- an Evenementspromotioun tëscht Musel, Lëtzebuerg a Saarland.",
    },
    chemin: "/publicite",
  })

const solutions: { icone: typeof Radio; titre: Trad; texte: Trad }[] = [
  {
    icone: Radio,
    titre: { fr: "Publicité radio", de: "Radiowerbung", lb: "Radiosreklamm" },
    texte: {
      fr: "Des spots diffusés sur l'antenne de Radio Tripoint, pour une présence régulière auprès des auditeurs du territoire.",
      de: "Spots auf Radio Tripoint für eine regelmäßige Präsenz bei den Hörerinnen und Hörern der Region.",
      lb: "Spotten op Radio Tripoint, fir reegelméisseg bei den Auditeuren aus der Regioun präsent ze sinn.",
    },
  },
  {
    icone: Megaphone,
    titre: { fr: "Campagnes locales", de: "Lokale Kampagnen", lb: "Lokal Campagnen" },
    texte: {
      fr: "Un message pensé pour votre zone de chalandise, de Sierck-les-Bains à la Grande Région, construit et suivi avec notre équipe.",
      de: "Eine Botschaft für Ihr Einzugsgebiet, von Sierck-les-Bains bis zur Großregion, gemeinsam mit unserem Team entwickelt und begleitet.",
      lb: "E Message fir Ären Aklagebitt, vu Sierck-les-Bains bis an d'Groussregioun, zesumme mat eiser Equipe ausgeschafft a begleet.",
    },
  },
  {
    icone: Globe,
    titre: { fr: "Promotion web", de: "Web-Promotion", lb: "Web-Promotioun" },
    texte: {
      fr: "La mise en avant de votre activité et de votre site internet sur les supports numériques de Radio Tripoint.",
      de: "Die Präsentation Ihres Unternehmens und Ihrer Website auf den digitalen Kanälen von Radio Tripoint.",
      lb: "D'Presentatioun vun Ärer Aktivitéit an Ärem Internetsite op den digitale Kanäl vu Radio Tripoint.",
    },
  },
  {
    icone: Ticket,
    titre: {
      fr: "Campagnes événementielles",
      de: "Veranstaltungskampagnen",
      lb: "Evenementscampagnen",
    },
    texte: {
      fr: "Un lancement, une ouverture, une fête, un salon : un dispositif radio et web autour de votre date.",
      de: "Ein Launch, eine Eröffnung, ein Fest, eine Messe: ein Radio- und Web-Paket rund um Ihren Termin.",
      lb: "E Lancement, eng Ouverture, eng Fest, e Salon: e Radio- a Web-Pak ronderëm Ären Datum.",
    },
  },
  {
    icone: Sparkles,
    titre: { fr: "Visibilité digitale", de: "Digitale Sichtbarkeit", lb: "Digital Visibilitéit" },
    texte: {
      fr: "Présence sur le site et les réseaux de la radio, en complément de l'antenne, pour prolonger votre message.",
      de: "Präsenz auf der Website und in den Netzwerken des Senders, ergänzend zum Radio, damit Ihre Botschaft weiterwirkt.",
      lb: "Präsenz um Site an an de Netzwierker vum Radio, als Ergänzung zur Antenn, fir Äre Message ze verlängeren.",
    },
  },
]

const etapes: { titre: Trad; texte: Trad }[] = [
  {
    titre: {
      fr: "Vous nous parlez de votre projet",
      de: "Sie erzählen uns von Ihrem Projekt",
      lb: "Dir erzielt eis vun Ärem Projet",
    },
    texte: {
      fr: "Votre activité, votre objectif, votre calendrier, votre zone.",
      de: "Ihr Unternehmen, Ihr Ziel, Ihr Zeitplan, Ihr Gebiet.",
      lb: "Är Aktivitéit, Äert Zil, Äre Kalenner, Äert Gebitt.",
    },
  },
  {
    titre: {
      fr: "Nous construisons une proposition",
      de: "Wir erstellen ein Angebot",
      lb: "Mir schaffen eng Propose aus",
    },
    texte: {
      fr: "Un dispositif sur mesure : antenne, web, ou les deux.",
      de: "Ein Paket nach Maß: Radio, Web oder beides.",
      lb: "E Pak op Mooss: Radio, Web oder allebéid.",
    },
  },
  {
    titre: {
      fr: "Votre message est diffusé",
      de: "Ihre Botschaft wird ausgestrahlt",
      lb: "Äre Message gëtt iwwerdroen",
    },
    texte: {
      fr: "Conception, diffusion et suivi, avec un interlocuteur unique.",
      de: "Konzeption, Ausstrahlung und Begleitung, mit einem einzigen Ansprechpartner.",
      lb: "Konzeptioun, Iwwerdroung a Suivi, mat engem eenzege Kontakt.",
    },
  },
]

const atouts: { titre: Trad; texte: Trad }[] = [
  {
    titre: {
      fr: "Transfrontalier par nature",
      de: "Grenzüberschreitend von Natur aus",
      lb: "Grenziwwerschreidend vun Natur aus",
    },
    texte: {
      fr: "Basée à Sierck-les-Bains, à quelques kilomètres du tripoint de Schengen, la radio s'adresse à un bassin de vie partagé entre la France, le Luxembourg et l'Allemagne.",
      de: "Mit Sitz in Sierck-les-Bains, wenige Kilometer vom Dreiländereck bei Schengen, richtet sich der Sender an einen gemeinsamen Lebensraum zwischen Frankreich, Luxemburg und Deutschland.",
      lb: "Vu Sierck-les-Bains aus, e puer Kilometer vum Dräilännerpunkt vu Schengen, riicht de Radio sech un e gemeinsame Liewensraum tëscht Frankräich, Lëtzebuerg an Däitschland.",
    },
  },
  {
    titre: { fr: "Radio et web", de: "Radio und Web", lb: "Radio a Web" },
    texte: {
      fr: "L'antenne, le site et les réseaux : votre message peut vivre sur plusieurs supports, dans une même campagne.",
      de: "Radio, Website und Netzwerke: Ihre Botschaft kann in einer einzigen Kampagne auf mehreren Kanälen leben.",
      lb: "Antenn, Site an Netzwierker: Äre Message kann an enger eenzeger Campagne op méi Kanäl liewen.",
    },
  },
  {
    titre: {
      fr: "Un accompagnement de proximité",
      de: "Betreuung aus der Nähe",
      lb: "Eng Begleedung vu no",
    },
    texte: {
      fr: "Un interlocuteur qui connaît le territoire, attentif aux détails de votre projet.",
      de: "Ein Ansprechpartner, der die Region kennt und auf die Details Ihres Projekts achtet.",
      lb: "E Kontakt, deen d'Regioun kennt an op d'Detailer vun Ärem Projet oppasst.",
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
              { nom: t({ fr: "Publicité", de: "Werbung", lb: "Reklamm" }), chemin: "/publicite" },
            ]}
            className="[&_*]:!text-black/70"
          />
          <p className="surtitre mt-10 opacity-80">{t(site.promessePro)}</p>
          <h1 className="titre-affiche mt-4 text-[clamp(2.8rem,1.4rem+6.4vw,7rem)]">
            {t({ fr: "Votre entreprise.", de: "Ihr Unternehmen.", lb: "Är Firma." })}
            <br />
            {t({ fr: "Notre audience.", de: "Unser Publikum.", lb: "Eise Public." })}
          </h1>
          <p className="presse mt-6 max-w-2xl text-[1.3rem] leading-snug opacity-90 sm:text-[1.45rem]">
            {t({
              fr: "Radio Tripoint diffuse ses programmes, vend des espaces publicitaires et conçoit des campagnes marketing pour les entreprises des Trois Frontières — avec l'exigence d'un service soigné, du premier échange à la diffusion.",
              de: "Radio Tripoint sendet sein Programm, verkauft Werbeflächen und entwickelt Marketingkampagnen für Unternehmen im Dreiländereck – mit dem Anspruch eines sorgfältigen Service, vom ersten Gespräch bis zur Ausstrahlung.",
              lb: "Radio Tripoint iwwerdréit säi Programm, verkeeft Reklammsplaz a schafft Marketingcampagne fir d'Firmen aus dem Dräilännereck aus – mam Usproch vun engem suergfältege Service, vum éischte Gespréich bis zur Iwwerdroung.",
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
              })}
            </a>
            <a
              href="#demande"
              className="btn min-h-14 border-[1.5px] border-current !px-6 hover:bg-black/10"
            >
              {t({ fr: "Demander une offre", de: "Angebot anfragen", lb: "Offer ufroen" })}{" "}
              <ArrowDown className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </header>

      <section aria-labelledby="titre-solutions" className="conteneur py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="surtitre text-accent-encre">
              {t({ fr: "Nos solutions", de: "Unsere Angebote", lb: "Eis Léisungen" })}
            </p>
            <h2 id="titre-solutions" className="titre-section mt-2">
              {t({
                fr: "Se faire entendre, des deux côtés de la frontière.",
                de: "Gehört werden – auf beiden Seiten der Grenze.",
                lb: "Sech héiere loossen – op béide Säite vun der Grenz.",
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
              })}
            </p>
            <h2 id="titre-pourquoi" className="titre-section mt-2">
              {t({
                fr: "Un média ancré dans un territoire unique.",
                de: "Ein Medium, verwurzelt in einer einzigartigen Region.",
                lb: "E Medium, verankert an enger eenzegaarteger Regioun.",
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
          {t({ fr: "Comment ça marche", de: "So funktioniert's", lb: "Sou funktionéiert et" })}
        </p>
        <h2 id="titre-etapes" className="titre-section mt-2">
          {t({
            fr: "Trois étapes, un interlocuteur.",
            de: "Drei Schritte, ein Ansprechpartner.",
            lb: "Dräi Schrëtt, ee Kontakt.",
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
            {t({ fr: "Partenariats", de: "Partnerschaften", lb: "Partenariater" })}
          </h2>
          <p className="presse text-encre-2 text-[1.25rem] leading-snug">
            {t({
              fr: "Collectivité, association, organisateur d'événement, média : Radio Tripoint est ouverte aux partenariats qui font vivre le territoire. Présentez-nous votre projet via le formulaire ci-dessous en choisissant « Partenariat ».",
              de: "Gemeinde, Verein, Veranstalter, Medium: Radio Tripoint ist offen für Partnerschaften, die die Region beleben. Stellen Sie uns Ihr Projekt über das Formular unten vor und wählen Sie „Partnerschaft“.",
              lb: "Gemeng, Veräin, Organisateur, Medium: Radio Tripoint ass op fir Partenariater, déi d'Regioun beliewen. Stellt eis Äre Projet iwwer de Formulaire hei ënnen vir a wielt „Partenariat“.",
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
              {t({ fr: "Demander une offre", de: "Angebot anfragen", lb: "Offer ufroen" })}
            </p>
            <h2 id="titre-demande" className="titre-section mt-2">
              {t({
                fr: "Parlons de votre projet.",
                de: "Sprechen wir über Ihr Projekt.",
                lb: "Loosst eis iwwer Äre Projet schwätzen.",
              })}
            </h2>
            <p className="presse text-encre-2 mt-4 text-lg leading-snug">
              {t({
                fr: "Réponse personnalisée, sans engagement.",
                de: "Persönliche Antwort, unverbindlich.",
                lb: "Perséinlech Äntwert, ouni Engagement.",
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
