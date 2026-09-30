import { BoutonGererCookies } from "@/components/rgpd/Consentement"
import { ProseLegale } from "@/components/ui/ProseLegale"
import { PageHero } from "@/components/ui/PageHero"
import { analytics } from "@/config/analytics"
import { site } from "@/config/site"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Politique de confidentialité et cookies",
      de: "Datenschutz und Cookies",
      lb: "Dateschutz a Cookien",
    },
    description: {
      fr: "Comment Radio Tripoint traite vos données personnelles et utilise (ou non) les cookies.",
      de: "Wie Radio Tripoint Ihre personenbezogenen Daten verarbeitet und Cookies (nicht) verwendet.",
      lb: "Wéi Radio Tripoint Är perséinlech Donnéeën verschafft a Cookien (net) benotzt.",
    },
    chemin: "/politique-confidentialite",
  })

export default async function Confidentialite() {
  const t = await traducteur()
  const a = site.contact.adresse
  const courriel = <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
  return (
    <>
      <PageHero
        miettes={[
          {
            nom: t({
              fr: "Politique de confidentialité",
              de: "Datenschutzerklärung",
              lb: "Dateschutzerklärung",
            }),
            chemin: "/politique-confidentialite",
          },
        ]}
        titre={t({
          fr: "Confidentialité & cookies",
          de: "Datenschutz & Cookies",
          lb: "Dateschutz & Cookien",
        })}
        intro={t({
          fr: "Ce que nous collectons, pourquoi, et comment exercer vos droits.",
          de: "Was wir erheben, warum, und wie Sie Ihre Rechte ausüben.",
          lb: "Wat mir sammelen, firwat, a wéi Dir Är Rechter ausübt.",
        })}
      />
      <div className="conteneur py-12 lg:py-16">
        <ProseLegale>
          {t.langue !== "fr" && (
            <p className="text-sm">
              {t({
                fr: "",
                de: "Übersetzung zur Information: Rechtlich maßgeblich ist die französische Fassung.",
                lb: "Iwwersetzung zur Informatioun: Juristesch gëllt déi franséisch Versioun.",
              })}
            </p>
          )}
          <h2>
            {t({
              fr: "Responsable du traitement",
              de: "Verantwortlicher",
              lb: "Verantwortlechen",
            })}
          </h2>
          <p>
            {site.nomOfficiel}, {t(a.lieu)}, {a.rue}, {a.codePostal} {a.ville}.{" "}
            {t({ fr: "Contact", de: "Kontakt", lb: "Kontakt" })} : {courriel}.
          </p>
          <h2>{t({ fr: "Données collectées", de: "Erhobene Daten", lb: "Gesammelt Donnéeën" })}</h2>
          <p>
            {t({
              fr: "Le site ne collecte des données personnelles que lorsque vous les transmettez volontairement :",
              de: "Die Website erhebt personenbezogene Daten nur, wenn Sie sie freiwillig übermitteln:",
              lb: "De Site sammelt perséinlech Donnéeën nëmmen, wann Dir se fräiwëlleg iwwermëttelt:",
            })}
          </p>
          <ul>
            <li>
              {t({
                fr: "formulaire de contact : nom, e-mail, téléphone (facultatif), message ;",
                de: "Kontaktformular: Name, E-Mail, Telefon (optional), Nachricht;",
                lb: "Kontaktformulaire: Numm, E-Mail, Telefon (fakultativ), Message;",
              })}
            </li>
            <li>
              {t({
                fr: "soumission d'information : nom, e-mail, téléphone (facultatif), ville, message et pièce jointe éventuelle ;",
                de: "Einsenden einer Information: Name, E-Mail, Telefon (optional), Ort, Nachricht und ggf. Anhang;",
                lb: "Informatioun aschécken: Numm, E-Mail, Telefon (fakultativ), Uertschaft, Message an eventuell Unhang;",
              })}
            </li>
            <li>
              {t({
                fr: "demande d'offre publicitaire : nom, entreprise, e-mail, téléphone (facultatif), besoin ;",
                de: "Anfrage eines Werbeangebots: Name, Unternehmen, E-Mail, Telefon (optional), Bedarf;",
                lb: "Ufro fir eng Reklammsoffer: Numm, Firma, E-Mail, Telefon (fakultativ), Besoin;",
              })}
            </li>
            <li>
              {t({
                fr: "newsletter : adresse e-mail.",
                de: "Newsletter: E-Mail-Adresse.",
                lb: "Newsletter: E-Mail-Adress.",
              })}
            </li>
          </ul>
          <h2>
            {t({
              fr: "Finalités et base légale",
              de: "Zwecke und Rechtsgrundlage",
              lb: "Zwecker a Rechtsgrondlag",
            })}
          </h2>
          <p>
            {t({
              fr: "Ces données servent uniquement à répondre à votre demande, à traiter l'information transmise ou à vous envoyer la newsletter. Le traitement repose sur votre consentement, recueilli par la case à cocher de chaque formulaire. Elles ne sont ni vendues, ni cédées, et ne sont jamais publiées sans votre accord.",
              de: "Diese Daten dienen ausschließlich dazu, Ihre Anfrage zu beantworten, die übermittelte Information zu bearbeiten oder Ihnen den Newsletter zu senden. Die Verarbeitung beruht auf Ihrer Einwilligung, die über das Kontrollkästchen jedes Formulars eingeholt wird. Die Daten werden weder verkauft noch weitergegeben und nie ohne Ihre Zustimmung veröffentlicht.",
              lb: "Dës Donnéeë déngen nëmmen dozou, op Är Ufro z'äntweren, déi iwwermëttelt Informatioun ze verschaffen oder Iech den Newsletter ze schécken. D'Veraarbechtung baséiert op Ärer Zoustëmmung, déi iwwer d'Kästchen vun all Formulaire agefaange gëtt. Si ginn net verkaf, net weiderginn an ni ouni Är Zoustëmmung publizéiert.",
            })}
          </p>
          <p>
            {t({
              fr: "Le contenu des formulaires, pièce jointe comprise, est acheminé jusqu'à notre boîte e-mail par le service d'envoi Resend (Resend, Inc., États-Unis), qui agit comme simple transporteur et n'en fait aucun autre usage.",
              de: "Der Inhalt der Formulare, einschließlich Anhang, wird über den Versanddienst Resend (Resend, Inc., USA) in unser E-Mail-Postfach übermittelt. Resend handelt dabei nur als Übermittler und nutzt die Daten zu keinem anderen Zweck.",
              lb: "Den Inhalt vun de Formulairen, mat Unhank, gëtt iwwer de Versanddéngscht Resend (Resend, Inc., USA) an eis E-Mail-Këscht geschéckt. Resend ass dobäi just Transporteur a benotzt d'Donnéeë fir näischt anescht.",
            })}
          </p>
          <h2>
            {t({
              fr: "Durée de conservation",
              de: "Speicherdauer",
              lb: "Späicherdauer",
            })}
          </h2>
          <p>
            {t({
              fr: "Les données sont conservées le temps nécessaire au traitement de votre demande, puis supprimées. Les inscriptions à la newsletter sont conservées jusqu'à votre désinscription.",
              de: "Die Daten werden so lange gespeichert, wie es für die Bearbeitung Ihrer Anfrage nötig ist, und dann gelöscht. Newsletter-Anmeldungen werden bis zu Ihrer Abmeldung gespeichert.",
              lb: "D'Donnéeë ginn esou laang gespäichert, wéi et fir d'Veraarbechtung vun Ärer Ufro néideg ass, an duerno geläscht. D'Umeldunge fir den Newsletter ginn bis zu Ärer Ofmeldung gespäichert.",
            })}
          </p>
          <h2 id="guide">
            {t({
              fr: "Le guide « Tripo »",
              de: "Der Guide „Tripo“",
              lb: "De Guide „Tripo“",
            })}
          </h2>
          <p>
            {t({
              fr: "Les questions posées au guide sont transmises, sans votre nom ni votre adresse IP, au service d'intelligence artificielle Claude (Anthropic, États-Unis) via Vercel AI Gateway, uniquement pour produire la réponse ; le guide peut aussi lancer des recherches sur le web. Radio Tripoint ne conserve pas ces conversations : elles restent dans l'onglet de votre navigateur et disparaissent à sa fermeture. N'y indiquez pas de données personnelles.",
              de: "Die Fragen an den Guide werden ohne Ihren Namen und ohne Ihre IP-Adresse an den KI-Dienst Claude (Anthropic, USA) über Vercel AI Gateway übermittelt, ausschließlich um die Antwort zu erstellen; der Guide kann dazu auch im Web suchen. Radio Tripoint speichert diese Gespräche nicht: Sie bleiben im Tab Ihres Browsers und verschwinden, wenn Sie ihn schließen. Geben Sie dort keine persönlichen Daten ein.",
              lb: "D'Froen un de Guide ginn, ouni Ären Numm an ouni Är IP-Adress, un de KI-Déngscht Claude (Anthropic, USA) iwwer Vercel AI Gateway geschéckt, just fir d'Äntwert ze maachen; de Guide kann dofir och um Web sichen. Radio Tripoint späichert dës Gespréicher net: si bleiwen am Tab vun Ärem Browser a verschwannen, wann Dir en zoumaacht. Gitt do keng perséinlech Donnéeën un.",
            })}
          </p>
          <h2>{t({ fr: "Vos droits", de: "Ihre Rechte", lb: "Är Rechter" })}</h2>
          <p>
            {t({
              fr: "Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition et de retrait de votre consentement. Écrivez à",
              de: "Sie haben ein Recht auf Auskunft, Berichtigung, Löschung, Widerspruch und Widerruf Ihrer Einwilligung. Schreiben Sie an",
              lb: "Dir hutt e Recht op Auskunft, Korrektur, Läschung, Oppositioun an op den Zeréckzéie vun Ärer Zoustëmmung. Schreift un",
            })}{" "}
            {courriel}.{" "}
            {t({
              fr: "En cas de difficulté, vous pouvez saisir la CNIL",
              de: "Bei Problemen können Sie sich an die französische Datenschutzbehörde CNIL wenden",
              lb: "Bei Problemer kënnt Dir Iech un déi franséisch Dateschutzautoritéit CNIL wenden",
            })}{" "}
            (<a href="https://www.cnil.fr">cnil.fr</a>).
          </p>
          <h2 id="cookies">{t({ fr: "Cookies", de: "Cookies", lb: "Cookien" })}</h2>
          {analytics.script ? (
            <p>
              {t({
                fr: `Avec votre accord, le site utilise ${analytics.nom} pour mesurer son audience. Sans accord, aucun traceur n'est chargé.`,
                de: `Mit Ihrer Zustimmung nutzt die Website ${analytics.nom}, um ihre Reichweite zu messen. Ohne Zustimmung wird kein Tracker geladen.`,
                lb: `Mat Ärer Zoustëmmung benotzt de Site ${analytics.nom}, fir seng Reechwäit ze moossen. Ouni Zoustëmmung gëtt keen Tracker gelueden.`,
              })}
            </p>
          ) : (
            <p>
              <strong>
                {t({
                  fr: "Ce site ne dépose aucun cookie publicitaire ni de mesure d'audience.",
                  de: "Diese Website setzt keine Werbe- oder Analyse-Cookies.",
                  lb: "Dëse Site setzt keng Reklamms- oder Analyse-Cookien.",
                })}
              </strong>{" "}
              {t({
                fr: "Il n'utilise que le stockage local de votre navigateur pour deux préférences de confort, qui ne quittent pas votre appareil : le thème clair ou sombre, et le volume du lecteur.",
                de: "Sie nutzt nur den lokalen Speicher Ihres Browsers für zwei Komfort-Einstellungen, die Ihr Gerät nicht verlassen: helles oder dunkles Design und die Lautstärke des Players.",
                lb: "Hie benotzt just de lokale Späicher vun Ärem Browser fir zwou Komfort-Astellungen, déi Ären Apparat net verloossen: hellen oder donkelen Design an d'Lautstäerkt vum Player.",
              })}
            </p>
          )}
          <p>
            {t({
              fr: "L'écoute du direct et des podcasts fait appel au serveur de diffusion audio de la radio, qui reçoit, comme tout serveur web, votre adresse IP le temps de la lecture. Les liens de partage (Facebook, X, WhatsApp) ne chargent rien tant que vous ne cliquez pas.",
              de: "Für den Livestream und die Podcasts wird der Audioserver des Senders genutzt, der – wie jeder Webserver – während der Wiedergabe Ihre IP-Adresse erhält. Die Teilen-Links (Facebook, X, WhatsApp) laden nichts, solange Sie nicht klicken.",
              lb: "Fir de Live-Stream an d'Podcasts gëtt den Audioserver vum Radio benotzt, deen – wéi all Webserver – während dem Ofspillen Är IP-Adress kritt. D'Linke fir ze deelen (Facebook, X, WhatsApp) lueden näischt, soulaang Dir net klickt.",
            })}
          </p>
          <p>
            {t({
              fr: "Cartes : la carte du territoire est fournie par OpenStreetMap, qui ne dépose pas de cookie publicitaire. Le plan de la page Contact est fourni par Google Maps, qui peut en déposer : il ne se charge que si vous cliquez sur « Afficher le plan ».",
              de: "Karten: Die Karte der Region stammt von OpenStreetMap, das keine Werbe-Cookies setzt. Der Lageplan auf der Kontaktseite stammt von Google Maps, das Cookies setzen kann: Er wird nur geladen, wenn Sie auf „Karte anzeigen“ klicken.",
              lb: "Kaarten: D'Kaart vun der Regioun kënnt vun OpenStreetMap, dat keng Reklamms-Cookie setzt. De Plang op der Kontaktsäit kënnt vu Google Maps, dat Cookie setze kann: E gëtt eréischt gelueden, wann Dir op „Kaart weisen“ klickt.",
            })}
          </p>
          <BoutonGererCookies />
        </ProseLegale>
      </div>
    </>
  )
}
