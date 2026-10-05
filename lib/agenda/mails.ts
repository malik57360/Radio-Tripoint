import "server-only"
import { choisir } from "@/lib/i18n/langues"
import { dateLongue } from "@/lib/utils/dates"
import { lienPaiement, PRIX_EUROS, type Proposition } from "./propositions"

/**
 * E-mails à l'organisateur, dans la langue où il a rempli le formulaire.
 * Textes fixes (pas d'IA), envoyés seulement quand une personne clique
 * « Accepter » ou « Refuser » dans le tableau de bord.
 */
const SIGNATURE = "L'équipe Radio Tripoint"

export function mailAcceptation(p: Proposition) {
  const l = p.langue
  const quand = `${dateLongue(`${p.champs.date_debut}T12:00:00+02:00`, l)}, ${p.champs.ville}`
  const lien = lienPaiement(p)
  const objet = choisir(
    {
      fr: `Votre événement « ${p.champs.titre} » est accepté`,
      de: `Ihre Veranstaltung „${p.champs.titre}“ ist angenommen`,
      lb: `Ären Evenement „${p.champs.titre}“ ass ugeholl`,
      en: `Your event "${p.champs.titre}" has been accepted`,
      es: `Su evento «${p.champs.titre}» ha sido aceptado`,
    },
    l,
  )
  const corps = choisir(
    {
      fr: `Bonjour ${p.contact.nom},

Bonne nouvelle : votre événement « ${p.champs.titre} » (${quand}) est accepté pour l'agenda de Radio Tripoint.

Pour le publier, il reste à régler ${PRIX_EUROS} € par carte bancaire, via ce lien sécurisé (Stripe) :
${lien}

Dès le paiement reçu, l'événement apparaît dans l'agenda du site.

Cordialement,`,
      de: `Guten Tag ${p.contact.nom},

gute Nachricht: Ihre Veranstaltung „${p.champs.titre}“ (${quand}) ist für den Kalender von Radio Tripoint angenommen.

Zur Veröffentlichung fehlt nur noch die Zahlung von ${PRIX_EUROS} € per Karte über diesen sicheren Link (Stripe):
${lien}

Sobald die Zahlung eingegangen ist, erscheint die Veranstaltung im Kalender der Website.

Mit freundlichen Grüßen`,
      lb: `Moien ${p.contact.nom},

gutt Noriicht: Ären Evenement „${p.champs.titre}“ (${quand}) ass fir d'Agenda vu Radio Tripoint ugeholl.

Fir e ze publizéieren, feelt just nach d'Bezuelung vun ${PRIX_EUROS} € mat der Kaart, iwwer dëse séchere Link (Stripe):
${lien}

Soubal d'Bezuelung ukomm ass, erschéngt den Evenement an der Agenda vum Site.

Mat beschte Gréiss`,
      en: `Hello ${p.contact.nom},

Good news: your event "${p.champs.titre}" (${quand}) has been accepted for the Radio Tripoint listings.

To publish it, the only step left is to pay €${PRIX_EUROS} by card through this secure link (Stripe):
${lien}

As soon as payment is received, the event appears in the site's listings.

Kind regards,`,
      es: `Hola, ${p.contact.nom}:

Buenas noticias: su evento «${p.champs.titre}» (${quand}) ha sido aceptado para la agenda de Radio Tripoint.

Para publicarlo, solo falta pagar ${PRIX_EUROS} € con tarjeta mediante este enlace seguro (Stripe):
${lien}

En cuanto recibamos el pago, el evento aparecerá en la agenda del sitio.

Un saludo,`,
    },
    l,
  )
  return { objet, texte: `${corps}\n${SIGNATURE}` }
}

export function mailRefus(p: Proposition, motif: string) {
  const l = p.langue
  const m = motif.trim()
  const objet = choisir(
    {
      fr: `Votre événement « ${p.champs.titre} »`,
      de: `Ihre Veranstaltung „${p.champs.titre}“`,
      lb: `Ären Evenement „${p.champs.titre}“`,
      en: `Your event "${p.champs.titre}"`,
      es: `Su evento «${p.champs.titre}»`,
    },
    l,
  )
  const corps = choisir(
    {
      fr: `Bonjour ${p.contact.nom},

Merci d'avoir proposé « ${p.champs.titre} » pour l'agenda de Radio Tripoint. Nous ne pouvons pas le publier.${m ? `\n\nMotif : ${m}` : ""}

Rien ne vous a été facturé.

Cordialement,`,
      de: `Guten Tag ${p.contact.nom},

danke, dass Sie „${p.champs.titre}“ für den Kalender von Radio Tripoint vorgeschlagen haben. Wir können die Veranstaltung leider nicht veröffentlichen.${m ? `\n\nGrund: ${m}` : ""}

Ihnen wurde nichts berechnet.

Mit freundlichen Grüßen`,
      lb: `Moien ${p.contact.nom},

merci, datt Dir „${p.champs.titre}“ fir d'Agenda vu Radio Tripoint proposéiert hutt. Mir kënnen den Evenement leider net publizéieren.${m ? `\n\nGrond: ${m}` : ""}

Iech gouf näischt verrechent.

Mat beschte Gréiss`,
      en: `Hello ${p.contact.nom},

Thank you for submitting "${p.champs.titre}" to the Radio Tripoint listings. Unfortunately we cannot publish it.${m ? `\n\nReason: ${m}` : ""}

You have not been charged anything.

Kind regards,`,
      es: `Hola, ${p.contact.nom}:

Gracias por proponer «${p.champs.titre}» para la agenda de Radio Tripoint. Lamentablemente no podemos publicarlo.${m ? `\n\nMotivo: ${m}` : ""}

No se le ha cobrado nada.

Un saludo,`,
    },
    l,
  )
  return { objet, texte: `${corps}\n${SIGNATURE}` }
}
