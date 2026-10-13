import { CircleCheck, Info } from "lucide-react"
import { FormulaireCagnotte } from "@/components/cagnotte/FormulaireCagnotte"
import { Tripoint } from "@/components/marque/Tripoint"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { site } from "@/config/site"
import {
  etatCagnotte,
  MAX_EUROS,
  MIN_EUROS,
  MONTANTS_PROPOSES,
  OBJECTIF_EUROS,
} from "@/lib/cagnotte"
import { codesLangues, type Langue, type Trad } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Cagnotte : aidez Radio Tripoint à s'équiper",
      de: "Spendenaktion: Helfen Sie Radio Tripoint bei der Ausrüstung",
      lb: "Cagnotte: Hëlleft Radio Tripoint, sech auszerüsten",
      en: "Fundraiser: help Radio Tripoint get equipped",
      es: "Colecta: ayude a Radio Tripoint a equiparse",
    },
    description: {
      fr: `Participez à la cagnotte matériel de Radio Tripoint, la radio des Trois Frontières. Objectif : ${OBJECTIF_EUROS.toLocaleString("fr-FR")} €, montant libre, paiement sécurisé.`,
      de: `Beteiligen Sie sich an der Spendenaktion für die Ausrüstung von Radio Tripoint, dem Radio des Dreiländerecks. Ziel: ${OBJECTIF_EUROS.toLocaleString("de-DE")} €, freier Betrag, sichere Zahlung.`,
      lb: `Maacht mat bei der Cagnotte fir d'Material vu Radio Tripoint, dem Radio vum Dräilännereck. Zil: ${OBJECTIF_EUROS.toLocaleString("de-DE")} €, fräie Betrag, sécher Bezuelung.`,
      en: `Contribute to the Radio Tripoint equipment fund, the radio of the Three Borders. Goal: €${OBJECTIF_EUROS.toLocaleString("en-GB")}, any amount, secure payment.`,
      es: `Participe en la colecta para el material de Radio Tripoint, la radio de las Tres Fronteras. Objetivo: ${OBJECTIF_EUROS.toLocaleString("es-ES")} €, importe libre, pago seguro.`,
    },
    chemin: "/soutenir",
  })

const ETATS: Record<string, { ok?: boolean; titre: Trad; texte: Trad }> = {
  merci: {
    ok: true,
    titre: {
      fr: "Merci pour votre participation !",
      de: "Danke für Ihren Beitrag!",
      lb: "Merci fir Äre Bäitrag!",
      en: "Thank you for your contribution!",
      es: "¡Gracias por su aportación!",
    },
    texte: {
      fr: "Votre paiement est bien reçu : le compteur avance. Toute l'équipe de Radio Tripoint vous remercie.",
      de: "Ihre Zahlung ist eingegangen: Der Zähler steigt. Das ganze Team von Radio Tripoint dankt Ihnen.",
      lb: "Är Bezuelung ass ukomm: De Compteur geet erop. Dat ganzt Team vu Radio Tripoint seet Iech Merci.",
      en: "Your payment has been received: the counter is moving up. The whole Radio Tripoint team thanks you.",
      es: "Hemos recibido su pago: el contador avanza. Todo el equipo de Radio Tripoint se lo agradece.",
    },
  },
  annule: {
    titre: {
      fr: "Paiement interrompu",
      de: "Zahlung abgebrochen",
      lb: "Bezuelung ofgebrach",
      en: "Payment cancelled",
      es: "Pago interrumpido",
    },
    texte: {
      fr: "Rien n'a été débité. Vous pouvez recommencer quand vous voulez.",
      de: "Es wurde nichts abgebucht. Sie können jederzeit neu beginnen.",
      lb: "Et gouf näischt ofgebucht. Dir kënnt ëmmer erëm ufänken.",
      en: "Nothing was charged. You can start again whenever you like.",
      es: "No se ha cobrado nada. Puede volver a empezar cuando quiera.",
    },
  },
  attente: {
    titre: {
      fr: "Paiement en cours de confirmation",
      de: "Zahlung wird bestätigt",
      lb: "Bezuelung gëtt bestätegt",
      en: "Payment being confirmed",
      es: "Pago en proceso de confirmación",
    },
    texte: {
      fr: "Votre banque n'a pas encore confirmé le paiement. Votre participation sera ajoutée au compteur dès la confirmation.",
      de: "Ihre Bank hat die Zahlung noch nicht bestätigt. Ihr Beitrag wird nach der Bestätigung zum Zähler hinzugefügt.",
      lb: "Är Bank huet d'Bezuelung nach net bestätegt. Äre Bäitrag kënnt no der Bestätegung op de Compteur.",
      en: "Your bank has not confirmed the payment yet. Your contribution will be added to the counter once it does.",
      es: "Su banco aún no ha confirmado el pago. Su aportación se sumará al contador en cuanto lo haga.",
    },
  },
  erreur: {
    titre: {
      fr: "Le paiement n'a pas pu démarrer",
      de: "Die Zahlung konnte nicht starten",
      lb: "D'Bezuelung konnt net ufänken",
      en: "Payment could not start",
      es: "No se ha podido iniciar el pago",
    },
    texte: {
      fr: "Réessayez dans un instant. Rien n'a été débité.",
      de: "Versuchen Sie es gleich noch einmal. Es wurde nichts abgebucht.",
      lb: "Probéiert et gläich nach eng Kéier. Et gouf näischt ofgebucht.",
      en: "Try again in a moment. Nothing was charged.",
      es: "Vuelva a intentarlo en un momento. No se ha cobrado nada.",
    },
  },
  bientot: {
    titre: {
      fr: "Paiement en ligne bientôt disponible",
      de: "Online-Zahlung bald verfügbar",
      lb: "Online-Bezuelung geschwënn disponibel",
      en: "Online payment coming soon",
      es: "Pago en línea disponible pronto",
    },
    texte: {
      fr: "Le paiement par carte n'est pas encore ouvert. Contactez-nous : nous vous indiquons comment participer.",
      de: "Die Kartenzahlung ist noch nicht freigeschaltet. Kontaktieren Sie uns: Wir sagen Ihnen, wie Sie beitragen können.",
      lb: "D'Kaartebezuelung ass nach net op. Kontaktéiert eis: Mir soen Iech, wéi Dir bäidroe kënnt.",
      en: "Card payment is not open yet. Contact us and we will tell you how to contribute.",
      es: "El pago con tarjeta aún no está disponible. Contáctenos y le indicaremos cómo participar.",
    },
  },
  montant: {
    titre: {
      fr: "Montant non valide",
      de: "Ungültiger Betrag",
      lb: "Ongëltege Betrag",
      en: "Invalid amount",
      es: "Importe no válido",
    },
    texte: {
      fr: `Choisissez un montant entre ${MIN_EUROS} € et ${MAX_EUROS.toLocaleString("fr-FR")} €.`,
      de: `Wählen Sie einen Betrag zwischen ${MIN_EUROS} € und ${MAX_EUROS.toLocaleString("de-DE")} €.`,
      lb: `Wielt e Betrag tëscht ${MIN_EUROS} € an ${MAX_EUROS.toLocaleString("de-DE")} €.`,
      en: `Choose an amount between €${MIN_EUROS} and €${MAX_EUROS.toLocaleString("en-GB")}.`,
      es: `Elija un importe entre ${MIN_EUROS} € y ${MAX_EUROS.toLocaleString("es-ES")} €.`,
    },
  },
  trop: {
    titre: {
      fr: "Trop de tentatives",
      de: "Zu viele Versuche",
      lb: "Ze vill Versich",
      en: "Too many attempts",
      es: "Demasiados intentos",
    },
    texte: {
      fr: "Patientez quelques minutes avant de réessayer.",
      de: "Warten Sie ein paar Minuten, bevor Sie es erneut versuchen.",
      lb: "Waart e puer Minutten, ier Dir et nach eng Kéier probéiert.",
      en: "Please wait a few minutes before trying again.",
      es: "Espere unos minutos antes de volver a intentarlo.",
    },
  },
  invalide: {
    titre: {
      fr: "Lien de retour incomplet",
      de: "Unvollständiger Rücklink",
      lb: "Onvollstännege Retour-Link",
      en: "Incomplete return link",
      es: "Enlace de retorno incompleto",
    },
    texte: {
      fr: "Si vous avez payé, votre participation est tout de même comptée : Stripe nous la confirme de son côté.",
      de: "Wenn Sie bezahlt haben, wird Ihr Beitrag trotzdem gezählt: Stripe bestätigt ihn uns direkt.",
      lb: "Wann Dir bezuelt hutt, gëtt Äre Bäitrag trotzdeem gezielt: Stripe bestätegt en eis direkt.",
      en: "If you paid, your contribution still counts: Stripe confirms it to us directly.",
      es: "Si ha pagado, su aportación cuenta igualmente: Stripe nos la confirma directamente.",
    },
  },
}

const etapes: { titre: Trad; texte: Trad }[] = [
  {
    titre: {
      fr: "Vous choisissez un montant",
      de: "Sie wählen einen Betrag",
      lb: "Dir wielt e Betrag",
      en: "You choose an amount",
      es: "Usted elige un importe",
    },
    texte: {
      fr: "Un des montants proposés, ou celui de votre choix : chaque euro compte.",
      de: "Einen der vorgeschlagenen Beträge oder einen Betrag Ihrer Wahl: Jeder Euro zählt.",
      lb: "Ee vun de proposéierte Beträg oder ee vun Ärer Wiel: All Euro zielt.",
      en: "One of the suggested amounts, or one of your choice: every euro counts.",
      es: "Uno de los importes propuestos o el que usted elija: cada euro cuenta.",
    },
  },
  {
    titre: {
      fr: "Vous payez en ligne",
      de: "Sie zahlen online",
      lb: "Dir bezuelt online",
      en: "You pay online",
      es: "Usted paga en línea",
    },
    texte: {
      fr: "Sur la page sécurisée de Stripe, en quelques secondes.",
      de: "Auf der sicheren Seite von Stripe, in wenigen Sekunden.",
      lb: "Op der sécherer Säit vu Stripe, an e puer Sekonnen.",
      en: "On Stripe's secure page, in a few seconds.",
      es: "En la página segura de Stripe, en pocos segundos.",
    },
  },
  {
    titre: {
      fr: "Le compteur avance",
      de: "Der Zähler steigt",
      lb: "De Compteur geet erop",
      en: "The counter moves up",
      es: "El contador avanza",
    },
    texte: {
      fr: "Votre participation s'ajoute au total affiché sur cette page.",
      de: "Ihr Beitrag wird zur Summe auf dieser Seite addiert.",
      lb: "Äre Bäitrag kënnt op d'Zomm op dëser Säit.",
      en: "Your contribution is added to the total shown on this page.",
      es: "Su aportación se suma al total que aparece en esta página.",
    },
  },
]

const formatEuros = (n: number, l: Langue) =>
  new Intl.NumberFormat(l === "lb" ? "de-LU" : codesLangues[l].html, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  })
    .format(n)
    // Espace fine insécable (fr) trop étroite dans Archivo : « 3450 € » se lisait collé.
    .replace(/\u202f/g, "\u00a0")

export default async function PageSoutenir(props: PageProps<"/[lang]/soutenir">) {
  const sp = await props.searchParams
  const t = await traducteur()
  const etat = typeof sp.etat === "string" ? ETATS[sp.etat] : undefined
  const total = await etatCagnotte()
  const pourcent = total ? Math.min(100, Math.round((total.euros / OBJECTIF_EUROS) * 100)) : 0

  return (
    <>
      <header className="bg-accent text-sur-accent relative isolate overflow-hidden">
        <Tripoint
          className="pointer-events-none absolute top-[16%] left-[85%] -z-10 h-[150%] w-auto -translate-x-1/2 -translate-y-1/2 text-black/15 lg:top-1/2"
          epaisseur={1}
        />
        <div className="conteneur pt-6 pb-14 sm:pt-8 lg:pb-24">
          <Breadcrumbs
            sombre
            elements={[
              {
                nom: t({
                  fr: "Soutenir la radio",
                  de: "Das Radio unterstützen",
                  lb: "De Radio ënnerstëtzen",
                  en: "Support the radio",
                  es: "Apoyar la radio",
                }),
                chemin: "/soutenir",
              },
            ]}
            className="[&_*]:!text-black/70"
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">
            <div>
              <p className="surtitre opacity-80">
                {t({
                  fr: "Cagnotte matériel",
                  de: "Spendenaktion Ausrüstung",
                  lb: "Cagnotte Material",
                  en: "Equipment fund",
                  es: "Colecta para el material",
                })}
              </p>
              <h1 className="titre-affiche mt-4 text-[clamp(2.6rem,1.4rem+5.4vw,6rem)]">
                {t({
                  fr: "Aidez la radio à s'équiper.",
                  de: "Helfen Sie dem Radio, sich auszurüsten.",
                  lb: "Hëlleft dem Radio, sech auszerüsten.",
                  en: "Help the radio get equipped.",
                  es: "Ayude a la radio a equiparse.",
                })}
              </h1>
              <p className="presse mt-6 max-w-xl text-[1.25rem] leading-snug opacity-90 sm:text-[1.4rem]">
                {t({
                  fr: "Radio Tripoint lance une cagnotte pour son matériel. Chaque participation, petite ou grande, sert à équiper la radio des Trois Frontières.",
                  de: "Radio Tripoint startet eine Spendenaktion für seine Ausrüstung. Jeder Beitrag, ob klein oder groß, hilft, das Radio des Dreiländerecks auszurüsten.",
                  lb: "Radio Tripoint start eng Cagnotte fir säi Material. All Bäitrag, kleng oder grouss, hëlleft, de Radio vum Dräilännereck auszerüsten.",
                  en: "Radio Tripoint is launching a fundraiser for its equipment. Every contribution, large or small, helps equip the radio of the Three Borders.",
                  es: "Radio Tripoint lanza una colecta para su material. Cada aportación, grande o pequeña, sirve para equipar la radio de las Tres Fronteras.",
                })}
              </p>

              <div className="mt-10 max-w-xl">
                {total ? (
                  <>
                    <p className="flex flex-wrap items-baseline gap-x-3">
                      <span className="titre-affiche text-[clamp(2.6rem,1.8rem+3vw,4rem)] tabular-nums">
                        {formatEuros(total.euros, t.langue)}
                      </span>
                      <span className="font-bold opacity-80">
                        {t({
                          fr: `collectés sur ${formatEuros(OBJECTIF_EUROS, t.langue)}`,
                          de: `gesammelt von ${formatEuros(OBJECTIF_EUROS, t.langue)}`,
                          lb: `gesammelt vun ${formatEuros(OBJECTIF_EUROS, t.langue)}`,
                          en: `raised of ${formatEuros(OBJECTIF_EUROS, t.langue)}`,
                          es: `recaudados de ${formatEuros(OBJECTIF_EUROS, t.langue)}`,
                        })}
                      </span>
                    </p>
                    <div
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={OBJECTIF_EUROS}
                      aria-valuenow={Math.min(total.euros, OBJECTIF_EUROS)}
                      aria-valuetext={`${formatEuros(total.euros, t.langue)} / ${formatEuros(OBJECTIF_EUROS, t.langue)}`}
                      className="mt-4 h-4 overflow-hidden rounded-full bg-black/15"
                    >
                      <div
                        className="h-full rounded-full bg-black transition-[width] duration-700"
                        style={{ width: `${Math.max(pourcent, total.euros > 0 ? 2 : 0)}%` }}
                      />
                    </div>
                    <p className="mt-3 flex justify-between text-sm font-bold tabular-nums opacity-80">
                      <span>
                        {t({
                          fr: `${total.participations} participation${total.participations > 1 ? "s" : ""}`,
                          de: `${total.participations} ${total.participations === 1 ? "Beitrag" : "Beiträge"}`,
                          lb: `${total.participations} ${total.participations === 1 ? "Bäitrag" : "Bäiträg"}`,
                          en: `${total.participations} contribution${total.participations === 1 ? "" : "s"}`,
                          es: `${total.participations} ${total.participations === 1 ? "aportación" : "aportaciones"}`,
                        })}
                      </span>
                      <span>{pourcent} %</span>
                    </p>
                  </>
                ) : (
                  <p className="titre-carte text-2xl">
                    {t({
                      fr: `Objectif : ${formatEuros(OBJECTIF_EUROS, t.langue)}`,
                      de: `Ziel: ${formatEuros(OBJECTIF_EUROS, t.langue)}`,
                      lb: `Zil: ${formatEuros(OBJECTIF_EUROS, t.langue)}`,
                      en: `Goal: ${formatEuros(OBJECTIF_EUROS, t.langue)}`,
                      es: `Objetivo: ${formatEuros(OBJECTIF_EUROS, t.langue)}`,
                    })}
                  </p>
                )}
              </div>
            </div>

            <div
              id="participer"
              className="bg-papier text-encre scroll-mt-24 border-2 border-black p-6 shadow-[8px_8px_0_0_#000] sm:p-8"
            >
              {etat && (
                <div
                  role="status"
                  className={`mb-7 flex gap-3 border-l-4 p-4 ${etat.ok ? "border-succes bg-papier-2" : "border-alerte bg-papier-2"}`}
                >
                  {etat.ok ? (
                    <CircleCheck className="text-succes mt-0.5 size-5 shrink-0" aria-hidden />
                  ) : (
                    <Info className="text-alerte mt-0.5 size-5 shrink-0" aria-hidden />
                  )}
                  <div>
                    <p className="font-bold">{t(etat.titre)}</p>
                    <p className="text-encre-2 mt-1 text-sm">{t(etat.texte)}</p>
                  </div>
                </div>
              )}
              <FormulaireCagnotte montants={MONTANTS_PROPOSES} min={MIN_EUROS} max={MAX_EUROS} />
            </div>
          </div>
        </div>
      </header>

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
            fr: "Trois étapes, une minute.",
            de: "Drei Schritte, eine Minute.",
            lb: "Dräi Schrëtt, eng Minutt.",
            en: "Three steps, one minute.",
            es: "Tres pasos, un minuto.",
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

        <div className="bg-papier-2 mt-14 max-w-3xl p-6 sm:p-8">
          <h3 className="titre-carte text-lg">
            {t({
              fr: "Bon à savoir",
              de: "Gut zu wissen",
              lb: "Gutt ze wëssen",
              en: "Good to know",
              es: "Conviene saber",
            })}
          </h3>
          <p className="text-encre-2 mt-2">
            {t({
              fr: "Radio Tripoint est une société (SAS), pas une association : votre participation ne donne pas droit à une réduction d'impôt ni à un reçu fiscal.",
              de: "Radio Tripoint ist ein Unternehmen (SAS), kein Verein: Ihr Beitrag ist nicht steuerlich absetzbar, und es wird keine Spendenquittung ausgestellt.",
              lb: "Radio Tripoint ass eng Firma (SAS), keng Associatioun: Äre Bäitrag ass net steierlech ofsetzbar, an et gëtt keng Spendequittung.",
              en: "Radio Tripoint is a company (SAS), not a charity: your contribution is not tax-deductible and no tax receipt is issued.",
              es: "Radio Tripoint es una sociedad (SAS), no una asociación: su aportación no da derecho a deducción fiscal ni a recibo fiscal.",
            })}
          </p>
          <p className="text-encre-2 mt-3">
            {t({
              fr: "Une question, ou envie de participer autrement ? Écrivez-nous : ",
              de: "Eine Frage, oder möchten Sie anders beitragen? Schreiben Sie uns: ",
              lb: "Eng Fro, oder wëllt Dir anescht bäidroen? Schreift eis: ",
              en: "A question, or want to contribute another way? Write to us: ",
              es: "¿Alguna pregunta, o quiere participar de otra forma? Escríbanos: ",
            })}
            <a
              href={`mailto:${site.contact.email}`}
              className="text-encre font-bold underline underline-offset-4"
            >
              {site.contact.email}
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
