import Link from "@/components/ui/Lien"
import { CaseConsentement, ChampChoix, ChampTexte, ChampZone } from "@/components/forms/Champs"
import { ChampsOrganisation } from "@/components/forms/ChampsAgenda"
import { Formulaire } from "@/components/forms/Formulaire"
import { PageHero } from "@/components/ui/PageHero"
import { PRIX_EUROS } from "@/lib/agenda/propositions"
import { libellesPaysAgenda, paysAgenda } from "@/lib/formulaires/schemas"
import type { Trad } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Publier votre événement dans l'agenda",
      de: "Ihre Veranstaltung im Kalender veröffentlichen",
      lb: "Ären Evenement an der Agenda publizéieren",
      en: "Publish your event in the listings",
      es: "Publicar su evento en la agenda",
    },
    description: {
      fr: `Entreprises, associations et particuliers : publiez votre événement dans l'agenda de Radio Tripoint, la radio des Trois Frontières. ${PRIX_EUROS} € par événement, payés seulement après acceptation.`,
      de: `Unternehmen, Vereine und Privatpersonen: Veröffentlichen Sie Ihre Veranstaltung im Kalender von Radio Tripoint, dem Radio des Dreiländerecks. ${PRIX_EUROS} € pro Veranstaltung, erst nach Annahme zu zahlen.`,
      lb: `Betriber, Associatiounen a Privatpersounen: Publizéiert Ären Evenement an der Agenda vu Radio Tripoint, dem Radio vum Dräilännereck. ${PRIX_EUROS} € pro Evenement, eréischt no der Unhuelung ze bezuelen.`,
      en: `Companies, associations and individuals: publish your event in the Radio Tripoint listings, the radio of the Three Borders. €${PRIX_EUROS} per event, paid only once accepted.`,
      es: `Empresas, asociaciones y particulares: publiquen su evento en la agenda de Radio Tripoint, la radio de las Tres Fronteras. ${PRIX_EUROS} € por evento, que se pagan solo tras la aceptación.`,
    },
    chemin: "/agenda/proposer",
  })

const etapes: { titre: Trad; texte: Trad }[] = [
  {
    titre: {
      fr: "Vous proposez",
      de: "Sie schlagen vor",
      lb: "Dir proposéiert",
      en: "You submit",
      es: "Usted propone",
    },
    texte: {
      fr: "Votre événement et le numéro officiel de votre structure (SIRET, RNA, RCS…), sauf pour les particuliers.",
      de: "Ihre Veranstaltung und die amtliche Nummer Ihrer Organisation (SIRET, RNA, RCS…), außer bei Privatpersonen.",
      lb: "Ären Evenement an déi offiziell Nummer vun Ärer Organisatioun (SIRET, RNA, RCS…), ausser bei Privatpersounen.",
      en: "Your event and your organisation's official number (SIRET, RNA, RCS…), except for individuals.",
      es: "Su evento y el número oficial de su organización (SIRET, RNA, RCS…), salvo para particulares.",
    },
  },
  {
    titre: {
      fr: "Nous vérifions",
      de: "Wir prüfen",
      lb: "Mir kontrolléieren",
      en: "We check",
      es: "Lo comprobamos",
    },
    texte: {
      fr: "Le numéro des entreprises et associations est contrôlé dans le registre officiel ; l'équipe relit chaque événement, et vérifie elle-même ceux des particuliers.",
      de: "Die Nummer von Unternehmen und Vereinen wird im amtlichen Register geprüft; das Team liest jede Veranstaltung und prüft die von Privatpersonen selbst.",
      lb: "D'Nummer vu Betriber an Associatioune gëtt am offiziellen Register kontrolléiert; d'Team liest all Evenement a kontrolléiert déi vu Privatpersounen selwer.",
      en: "Company and association numbers are checked in the official register; the team reviews every event and checks those from individuals itself.",
      es: "El número de empresas y asociaciones se comprueba en el registro oficial; el equipo revisa cada evento y comprueba él mismo los de particulares.",
    },
  },
  {
    titre: {
      fr: `Vous payez ${PRIX_EUROS} €`,
      de: `Sie zahlen ${PRIX_EUROS} €`,
      lb: `Dir bezuelt ${PRIX_EUROS} €`,
      en: `You pay €${PRIX_EUROS}`,
      es: `Usted paga ${PRIX_EUROS} €`,
    },
    texte: {
      fr: "Seulement si l'événement est accepté : vous recevez un lien de paiement sécurisé par e-mail. Refusé, il ne vous coûte rien.",
      de: "Nur wenn die Veranstaltung angenommen wird: Sie erhalten per E-Mail einen sicheren Zahlungslink. Bei Ablehnung kostet es nichts.",
      lb: "Just wann den Evenement ugeholl gëtt: Dir kritt per E-Mail e séchere Bezuelungslink. Bei enger Oflehnung kascht et näischt.",
      en: "Only if the event is accepted: you get a secure payment link by email. If it is declined, it costs you nothing.",
      es: "Solo si el evento se acepta: recibe por correo un enlace de pago seguro. Si se rechaza, no le cuesta nada.",
    },
  },
  {
    titre: {
      fr: "C'est publié",
      de: "Es ist online",
      lb: "Et ass online",
      en: "It goes live",
      es: "Se publica",
    },
    texte: {
      fr: "Dès le paiement, votre événement apparaît dans l'agenda du site.",
      de: "Sobald bezahlt ist, erscheint Ihre Veranstaltung im Kalender der Website.",
      lb: "Soubal bezuelt ass, erschéngt Ären Evenement an der Agenda vum Site.",
      en: "As soon as payment is made, your event appears in the site's listings.",
      es: "En cuanto se paga, su evento aparece en la agenda del sitio.",
    },
  },
]

export default async function PageProposerEvenement() {
  const t = await traducteur()
  return (
    <>
      <PageHero
        miettes={[
          {
            nom: t({ fr: "Agenda", de: "Agenda", lb: "Agenda", en: "Events", es: "Agenda" }),
            chemin: "/agenda",
          },
          {
            nom: t({
              fr: "Publier un événement",
              de: "Veranstaltung veröffentlichen",
              lb: "Evenement publizéieren",
              en: "Publish an event",
              es: "Publicar un evento",
            }),
            chemin: "/agenda/proposer",
          },
        ]}
        surtitre={t({
          fr: "Organisateurs",
          de: "Veranstalter",
          lb: "Organisateuren",
          en: "Organisers",
          es: "Organizadores",
        })}
        titre={t({
          fr: "Publiez votre événement",
          de: "Veröffentlichen Sie Ihre Veranstaltung",
          lb: "Publizéiert Ären Evenement",
          en: "Publish your event",
          es: "Publique su evento",
        })}
        intro={t({
          fr: `Entreprises, associations et particuliers des Trois Frontières : votre événement dans l'agenda de Radio Tripoint pour ${PRIX_EUROS} €. Vous ne payez qu'une fois l'événement accepté.`,
          de: `Unternehmen, Vereine und Privatpersonen aus dem Dreiländereck: Ihre Veranstaltung im Kalender von Radio Tripoint für ${PRIX_EUROS} €. Sie zahlen erst, wenn die Veranstaltung angenommen ist.`,
          lb: `Betriber, Associatiounen a Privatpersounen aus dem Dräilännereck: Ären Evenement an der Agenda vu Radio Tripoint fir ${PRIX_EUROS} €. Dir bezuelt eréischt, wann den Evenement ugeholl ass.`,
          en: `Companies, associations and individuals of the Three Borders: your event in the Radio Tripoint listings for €${PRIX_EUROS}. You only pay once the event is accepted.`,
          es: `Empresas, asociaciones y particulares de las Tres Fronteras: su evento en la agenda de Radio Tripoint por ${PRIX_EUROS} €. Solo paga cuando el evento se acepta.`,
        })}
      />
      <div className="conteneur grid gap-12 py-12 lg:grid-cols-[1fr_1.8fr] lg:gap-16 lg:py-16">
        <aside>
          <ol className="space-y-7 lg:sticky lg:top-24">
            {etapes.map((e, i) => (
              <li key={e.titre.fr} className="flex gap-4">
                <span
                  aria-hidden
                  className="bg-accent grid size-9 flex-none place-items-center rounded-full text-sm font-extrabold text-black"
                >
                  {i + 1}
                </span>
                <div>
                  <h2 className="titre-carte text-lg">{t(e.titre)}</h2>
                  <p className="text-encre-2 mt-1">{t(e.texte)}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
        <Formulaire
          type="agenda"
          libelleEnvoi={t({
            fr: "Envoyer pour vérification",
            de: "Zur Prüfung senden",
            lb: "Fir d'Kontroll schécken",
            en: "Send for review",
            es: "Enviar para revisión",
          })}
          succes={{
            titre: t({
              fr: "Merci, votre demande est enregistrée !",
              de: "Danke, Ihre Anfrage ist eingegangen!",
              lb: "Merci, Är Ufro ass ukomm!",
              en: "Thank you, your request has been received!",
              es: "¡Gracias, su solicitud se ha registrado!",
            }),
            texte: t({
              fr: `Nous vérifions votre structure et votre événement. S'il est accepté, vous recevez par e-mail le lien pour régler ${PRIX_EUROS} € ; il est publié dès le paiement.`,
              de: `Wir prüfen Ihre Organisation und Ihre Veranstaltung. Wird sie angenommen, erhalten Sie per E-Mail den Link, um ${PRIX_EUROS} € zu zahlen; nach der Zahlung wird sie veröffentlicht.`,
              lb: `Mir kontrolléieren Är Organisatioun an Ären Evenement. Gëtt e ugeholl, kritt Dir per E-Mail de Link fir ${PRIX_EUROS} € ze bezuelen; no der Bezuelung gëtt e publizéiert.`,
              en: `We are checking your organisation and your event. If it is accepted, you will receive a link by email to pay €${PRIX_EUROS}; it goes live as soon as payment is made.`,
              es: `Estamos comprobando su organización y su evento. Si se acepta, recibirá por correo el enlace para pagar ${PRIX_EUROS} €; se publica en cuanto se paga.`,
            }),
          }}
        >
          <fieldset>
            <legend className="surtitre text-encre-3 mb-5">
              {t({
                fr: "Vous",
                de: "Sie",
                lb: "Dir",
                en: "You",
                es: "Usted",
              })}
            </legend>
            <ChampsOrganisation />
          </fieldset>

          <fieldset className="mt-10">
            <legend className="surtitre text-encre-3 mb-5">
              {t({
                fr: "Votre contact",
                de: "Ihr Kontakt",
                lb: "Äre Kontakt",
                en: "Your contact details",
                es: "Su contacto",
              })}
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <ChampTexte
                name="nom"
                libelle={t({ fr: "Nom", de: "Name", lb: "Numm", en: "Name", es: "Nombre" })}
                autoComplete="name"
              />
              <ChampTexte
                name="email"
                type="email"
                libelle={t({
                  fr: "E-mail",
                  de: "E-Mail",
                  lb: "E-Mail",
                  en: "Email",
                  es: "Correo electrónico",
                })}
                aide={t({
                  fr: "Le lien de paiement arrive à cette adresse.",
                  de: "Der Zahlungslink wird an diese Adresse geschickt.",
                  lb: "De Bezuelungslink kënnt op dës Adress.",
                  en: "The payment link will be sent to this address.",
                  es: "El enlace de pago llegará a esta dirección.",
                })}
                autoComplete="email"
                inputMode="email"
              />
              <ChampTexte
                name="telephone"
                type="tel"
                libelle={t({
                  fr: "Téléphone",
                  de: "Telefon",
                  lb: "Telefon",
                  en: "Phone",
                  es: "Teléfono",
                })}
                autoComplete="tel"
                inputMode="tel"
                facultatif
              />
            </div>
          </fieldset>

          <fieldset className="mt-10">
            <legend className="surtitre text-encre-3 mb-5">
              {t({
                fr: "Votre événement",
                de: "Ihre Veranstaltung",
                lb: "Ären Evenement",
                en: "Your event",
                es: "Su evento",
              })}
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <ChampTexte
                name="titre"
                className="sm:col-span-2"
                libelle={t({
                  fr: "Nom de l'événement",
                  de: "Name der Veranstaltung",
                  lb: "Numm vum Evenement",
                  en: "Event name",
                  es: "Nombre del evento",
                })}
                maxLength={120}
              />
              <ChampZone
                name="description"
                className="sm:col-span-2"
                libelle={t({
                  fr: "Description",
                  de: "Beschreibung",
                  lb: "Beschreiwung",
                  en: "Description",
                  es: "Descripción",
                })}
                rows={5}
                maxLength={1500}
                placeholder={t({
                  fr: "Programme, public, ce qu'on y trouve… Tel que vous voulez le voir publié.",
                  de: "Programm, Publikum, Angebot… So, wie Sie es veröffentlicht sehen möchten.",
                  lb: "Programm, Public, wat et do gëtt… Esou wéi Dir et publizéiert gesi wëllt.",
                  en: "Programme, audience, what's on offer… As you want it published.",
                  es: "Programa, público, qué se ofrece… Tal como quiere verlo publicado.",
                })}
              />
              <ChampTexte
                name="date_debut"
                type="date"
                libelle={t({
                  fr: "Date",
                  de: "Datum",
                  lb: "Datum",
                  en: "Date",
                  es: "Fecha",
                })}
              />
              <ChampTexte
                name="heure_debut"
                type="time"
                libelle={t({
                  fr: "Heure de début",
                  de: "Beginn",
                  lb: "Ufank",
                  en: "Start time",
                  es: "Hora de inicio",
                })}
                facultatif
              />
              <ChampTexte
                name="date_fin"
                type="date"
                libelle={t({
                  fr: "Date de fin",
                  de: "Enddatum",
                  lb: "Schlussdatum",
                  en: "End date",
                  es: "Fecha de fin",
                })}
                aide={t({
                  fr: "Seulement sur plusieurs jours.",
                  de: "Nur bei mehreren Tagen.",
                  lb: "Just bei e puer Deeg.",
                  en: "Only if it runs over several days.",
                  es: "Solo si dura varios días.",
                })}
                facultatif
              />
              <ChampTexte
                name="heure_fin"
                type="time"
                libelle={t({
                  fr: "Heure de fin",
                  de: "Ende",
                  lb: "Enn",
                  en: "End time",
                  es: "Hora de fin",
                })}
                facultatif
              />
              <ChampTexte
                name="lieu"
                libelle={t({
                  fr: "Lieu",
                  de: "Ort",
                  lb: "Plaz",
                  en: "Venue",
                  es: "Lugar",
                })}
                placeholder={t({
                  fr: "Salle des fêtes, parc, place…",
                  de: "Festsaal, Park, Platz…",
                  lb: "Festsall, Park, Plaz…",
                  en: "Village hall, park, square…",
                  es: "Salón de fiestas, parque, plaza…",
                })}
              />
              <ChampTexte
                name="adresse"
                libelle={t({
                  fr: "Adresse",
                  de: "Adresse",
                  lb: "Adress",
                  en: "Address",
                  es: "Dirección",
                })}
                autoComplete="street-address"
                facultatif
              />
              <ChampTexte
                name="ville"
                libelle={t({
                  fr: "Ville",
                  de: "Ort",
                  lb: "Uertschaft",
                  en: "Town",
                  es: "Localidad",
                })}
                autoComplete="address-level2"
                placeholder="Sierck-les-Bains, Perl, Schengen…"
              />
              <ChampChoix
                name="pays"
                libelle={t({ fr: "Pays", de: "Land", lb: "Land", en: "Country", es: "País" })}
                options={paysAgenda}
                libelles={libellesPaysAgenda}
              />
              <ChampTexte
                name="tarif"
                libelle={t({
                  fr: "Tarif",
                  de: "Eintritt",
                  lb: "Entrée",
                  en: "Price",
                  es: "Precio",
                })}
                placeholder={t({
                  fr: "Entrée gratuite, 10 €…",
                  de: "Eintritt frei, 10 €…",
                  lb: "Entrée gratis, 10 €…",
                  en: "Free entry, €10…",
                  es: "Entrada libre, 10 €…",
                })}
                facultatif
              />
              <ChampTexte
                name="lien"
                type="url"
                inputMode="url"
                libelle={t({
                  fr: "Site ou billetterie",
                  de: "Website oder Tickets",
                  lb: "Websäit oder Billetter",
                  en: "Website or tickets",
                  es: "Web o venta de entradas",
                })}
                placeholder="https://"
                facultatif
              />
            </div>
          </fieldset>

          <CaseConsentement name="conditions">
            {t({
              fr: `J'ai compris : la publication coûte ${PRIX_EUROS} €, payés seulement si l'événement est accepté. Radio Tripoint peut refuser un événement ou en corriger la présentation (orthographe, longueur) sans en changer le sens.`,
              de: `Ich habe verstanden: Die Veröffentlichung kostet ${PRIX_EUROS} €, die nur bei Annahme der Veranstaltung zu zahlen sind. Radio Tripoint kann eine Veranstaltung ablehnen oder die Darstellung korrigieren (Rechtschreibung, Länge), ohne den Sinn zu ändern.`,
              lb: `Ech hu verstanen: D'Verëffentlechung kascht ${PRIX_EUROS} €, déi just bezuelt ginn, wann den Evenement ugeholl gëtt. Radio Tripoint kann en Evenement ofleenen oder d'Presentatioun verbesseren (Schreifweis, Längt), ouni de Sënn z'änneren.`,
              en: `I understand: publication costs €${PRIX_EUROS}, paid only if the event is accepted. Radio Tripoint may decline an event or correct its presentation (spelling, length) without changing its meaning.`,
              es: `Lo he entendido: la publicación cuesta ${PRIX_EUROS} €, que solo se pagan si el evento se acepta. Radio Tripoint puede rechazar un evento o corregir su presentación (ortografía, extensión) sin cambiar su sentido.`,
            })}
          </CaseConsentement>
          <CaseConsentement className="mt-4">
            {t({
              fr: "J'accepte que Radio Tripoint me contacte au sujet de cet événement.",
              de: "Ich bin damit einverstanden, dass Radio Tripoint mich zu dieser Veranstaltung kontaktiert.",
              lb: "Ech sinn domat averstanen, datt Radio Tripoint mech wéinst dësem Evenement kontaktéiert.",
              en: "I agree that Radio Tripoint may contact me about this event.",
              es: "Acepto que Radio Tripoint me contacte sobre este evento.",
            })}{" "}
            <Link href="/politique-confidentialite" className="lien">
              {t({
                fr: "Données personnelles",
                de: "Datenschutz",
                lb: "Dateschutz",
                en: "Privacy",
                es: "Privacidad",
              })}
            </Link>
          </CaseConsentement>
        </Formulaire>
      </div>
    </>
  )
}
