import Link from "@/components/ui/Lien"
import { EtatVide } from "@/components/ui/EtatVide"
import { site } from "@/config/site"
import type { Trad } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Paiement de votre événement",
      de: "Zahlung Ihrer Veranstaltung",
      lb: "Bezuelung vun Ärem Evenement",
      en: "Payment for your event",
      es: "Pago de su evento",
    },
    description: {
      fr: "Publication d'un événement dans l'agenda de Radio Tripoint.",
      de: "Veröffentlichung einer Veranstaltung im Kalender von Radio Tripoint.",
      lb: "Verëffentlechung vun engem Evenement an der Agenda vu Radio Tripoint.",
      en: "Publishing an event in the Radio Tripoint listings.",
      es: "Publicación de un evento en la agenda de Radio Tripoint.",
    },
    chemin: "/agenda/paiement",
    noindex: true,
  })

const ETATS: Record<string, { titre: Trad; texte: Trad }> = {
  merci: {
    titre: {
      fr: "Merci, votre événement est en ligne !",
      de: "Danke, Ihre Veranstaltung ist online!",
      lb: "Merci, Ären Evenement ass online!",
      en: "Thank you, your event is live!",
      es: "¡Gracias, su evento ya está publicado!",
    },
    texte: {
      fr: "Le paiement est bien reçu : votre événement apparaît dans l'agenda.",
      de: "Die Zahlung ist eingegangen: Ihre Veranstaltung steht im Kalender.",
      lb: "D'Bezuelung ass ukomm: Ären Evenement steet an der Agenda.",
      en: "Payment received: your event now appears in the listings.",
      es: "Hemos recibido el pago: su evento ya aparece en la agenda.",
    },
  },
  deja: {
    titre: {
      fr: "Cet événement est déjà publié",
      de: "Diese Veranstaltung ist bereits online",
      lb: "Dësen Evenement ass schonn online",
      en: "This event is already live",
      es: "Este evento ya está publicado",
    },
    texte: {
      fr: "Le paiement a déjà été reçu : il n'y a rien d'autre à régler.",
      de: "Die Zahlung ist bereits eingegangen: Es ist nichts weiter zu zahlen.",
      lb: "D'Bezuelung ass schonn ukomm: Et ass näischt méi ze bezuelen.",
      en: "Payment has already been received: there is nothing more to pay.",
      es: "El pago ya se ha recibido: no hay nada más que pagar.",
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
      fr: "Votre banque n'a pas encore confirmé le paiement. L'événement sera publié automatiquement dès la confirmation.",
      de: "Ihre Bank hat die Zahlung noch nicht bestätigt. Die Veranstaltung wird nach der Bestätigung automatisch veröffentlicht.",
      lb: "Är Bank huet d'Bezuelung nach net bestätegt. Den Evenement gëtt no der Bestätegung automatesch publizéiert.",
      en: "Your bank has not confirmed the payment yet. The event will go live automatically once it does.",
      es: "Su banco aún no ha confirmado el pago. El evento se publicará automáticamente en cuanto lo haga.",
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
      fr: "Rien n'a été débité. Le lien reçu par e-mail reste valable : vous pouvez reprendre quand vous voulez.",
      de: "Es wurde nichts abgebucht. Der Link aus der E-Mail bleibt gültig: Sie können jederzeit fortfahren.",
      lb: "Et gouf näischt ofgebucht. De Link aus der E-Mail bleift gëlteg: Dir kënnt ëmmer erëm ufänken.",
      en: "Nothing was charged. The link in your email is still valid: you can resume whenever you like.",
      es: "No se ha cobrado nada. El enlace del correo sigue siendo válido: puede retomarlo cuando quiera.",
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
      fr: "Le paiement par carte n'est pas encore ouvert. Contactez-nous : nous vous indiquons comment régler.",
      de: "Die Kartenzahlung ist noch nicht freigeschaltet. Kontaktieren Sie uns: Wir sagen Ihnen, wie Sie zahlen können.",
      lb: "D'Kaartebezuelung ass nach net op. Kontaktéiert eis: Mir soen Iech, wéi Dir bezuele kënnt.",
      en: "Card payment is not open yet. Contact us and we will tell you how to pay.",
      es: "El pago con tarjeta aún no está disponible. Contáctenos y le indicaremos cómo pagar.",
    },
  },
  indisponible: {
    titre: {
      fr: "Ce lien n'est pas actif",
      de: "Dieser Link ist nicht aktiv",
      lb: "Dëse Link ass net aktiv",
      en: "This link is not active",
      es: "Este enlace no está activo",
    },
    texte: {
      fr: "L'événement n'est pas (ou plus) en attente de paiement. Contactez-nous si vous pensez qu'il s'agit d'une erreur.",
      de: "Die Veranstaltung wartet nicht (mehr) auf eine Zahlung. Kontaktieren Sie uns, wenn Sie einen Fehler vermuten.",
      lb: "Den Evenement waart net (méi) op eng Bezuelung. Kontaktéiert eis, wann Dir mengt, et wier e Feeler.",
      en: "The event is not (or no longer) awaiting payment. Contact us if you think this is a mistake.",
      es: "El evento no está (o ya no está) pendiente de pago. Contáctenos si cree que se trata de un error.",
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
      fr: "Réessayez dans un instant avec le lien reçu par e-mail. Rien n'a été débité.",
      de: "Versuchen Sie es gleich noch einmal mit dem Link aus der E-Mail. Es wurde nichts abgebucht.",
      lb: "Probéiert et gläich nach eng Kéier mam Link aus der E-Mail. Et gouf näischt ofgebucht.",
      en: "Try again in a moment with the link from your email. Nothing was charged.",
      es: "Vuelva a intentarlo en un momento con el enlace del correo. No se ha cobrado nada.",
    },
  },
  invalide: {
    titre: {
      fr: "Lien invalide",
      de: "Ungültiger Link",
      lb: "Ongëltege Link",
      en: "Invalid link",
      es: "Enlace no válido",
    },
    texte: {
      fr: "Ce lien de paiement est incomplet. Utilisez le lien exact reçu par e-mail.",
      de: "Dieser Zahlungslink ist unvollständig. Verwenden Sie genau den Link aus der E-Mail.",
      lb: "Dëse Bezuelungslink ass net komplett. Benotzt genee de Link aus der E-Mail.",
      en: "This payment link is incomplete. Use the exact link from your email.",
      es: "Este enlace de pago está incompleto. Use exactamente el enlace del correo.",
    },
  },
}

export default async function PagePaiement(props: PageProps<"/[lang]/agenda/paiement">) {
  const sp = await props.searchParams
  const t = await traducteur()
  const etat = typeof sp.etat === "string" && ETATS[sp.etat] ? sp.etat : "invalide"
  const slug = typeof sp.slug === "string" && /^[a-z0-9-]{3,90}$/.test(sp.slug) ? sp.slug : null
  const e = ETATS[etat]
  const enLigne = (etat === "merci" || etat === "deja") && slug
  return (
    <div className="conteneur py-16 lg:py-24">
      <EtatVide
        titre={t(e.titre)}
        actions={
          enLigne ? (
            <Link href={`/agenda/${slug}`} className="btn btn-plein">
              {t({
                fr: "Voir mon événement",
                de: "Meine Veranstaltung ansehen",
                lb: "Mäin Evenement kucken",
                en: "See my event",
                es: "Ver mi evento",
              })}
            </Link>
          ) : (
            <a href={`mailto:${site.contact.email}`} className="btn btn-trait">
              {site.contact.email}
            </a>
          )
        }
      >
        {t(e.texte)}
      </EtatVide>
    </div>
  )
}
