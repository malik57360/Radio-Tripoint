import Link from "@/components/ui/Lien"
import { besoinsPub, libellesBesoinsPub } from "@/lib/formulaires/schemas"
import { traducteur } from "@/lib/i18n/serveur"
import { CaseConsentement, ChampChoix, ChampTexte, ChampZone } from "./Champs"
import { Formulaire } from "./Formulaire"

export async function FormulairePublicite() {
  const t = await traducteur()
  return (
    <Formulaire
      type="publicite"
      libelleEnvoi={t({
        fr: "Demander une offre",
        de: "Angebot anfragen",
        lb: "Offer ufroen",
        en: "Request a quote",
        es: "Solicitar una oferta",
      })}
      succes={{
        titre: t({
          fr: "Demande reçue.",
          de: "Anfrage erhalten.",
          lb: "Ufro kritt.",
          en: "Request received.",
          es: "Solicitud recibida.",
        }),
        texte: t({
          fr: "Notre équipe revient vers vous rapidement pour construire une proposition adaptée.",
          de: "Unser Team meldet sich schnell bei Ihnen, um ein passendes Angebot zu erstellen.",
          lb: "Eis Equipe mellt sech séier bei Iech, fir eng passend Propose auszeschaffen.",
          en: "Our team will get back to you quickly to build a suitable proposal.",
          es: "Nuestro equipo volverá a contactarle rápidamente para elaborar una propuesta adaptada.",
        }),
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <ChampTexte
          name="nom"
          libelle={t({
            fr: "Nom et prénom",
            de: "Vor- und Nachname",
            lb: "Virnumm an Numm",
            en: "Full name",
            es: "Nombre y apellidos",
          })}
          autoComplete="name"
        />
        <ChampTexte
          name="entreprise"
          libelle={t({
            fr: "Entreprise ou structure",
            de: "Unternehmen oder Organisation",
            lb: "Firma oder Organisatioun",
            en: "Company or organisation",
            es: "Empresa u organización",
          })}
          autoComplete="organization"
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
        <ChampChoix
          name="besoin"
          libelle={t({
            fr: "Votre besoin",
            de: "Ihr Bedarf",
            lb: "Äre Besoin",
            en: "Your requirement",
            es: "Su necesidad",
          })}
          options={besoinsPub}
          libelles={libellesBesoinsPub}
          className="sm:col-span-2"
        />
        <ChampZone
          name="message"
          libelle={t({
            fr: "Votre projet",
            de: "Ihr Projekt",
            lb: "Äre Projet",
            en: "Your project",
            es: "Su proyecto",
          })}
          facultatif
          placeholder={t({
            fr: "Objectif, période, zone visée, budget indicatif…",
            de: "Ziel, Zeitraum, Zielgebiet, ungefähres Budget…",
            lb: "Zil, Zäitraum, Zilgebitt, ongeféier Budget…",
            en: "Goal, period, target area, indicative budget…",
            es: "Objetivo, periodo, zona objetivo, presupuesto orientativo…",
          })}
          className="sm:col-span-2"
        />
      </div>
      <CaseConsentement>
        {t({
          fr: "J'accepte que Radio Tripoint utilise ces informations pour me recontacter au sujet de ma demande.",
          de: "Ich bin damit einverstanden, dass Radio Tripoint diese Angaben nutzt, um mich zu meiner Anfrage zu kontaktieren.",
          lb: "Ech sinn domat averstanen, datt Radio Tripoint dës Informatiounen notzt, fir mech wéinst menger Ufro ze kontaktéieren.",
          en: "I agree that Radio Tripoint may use this information to contact me about my request.",
          es: "Acepto que Radio Tripoint utilice estos datos para volver a contactarme sobre mi solicitud.",
        })}{" "}
        <Link href="/politique-confidentialite" className="lien">
          {t({
            fr: "En savoir plus",
            de: "Mehr erfahren",
            lb: "Méi gewuer ginn",
            en: "Learn more",
            es: "Saber más",
          })}
        </Link>
      </CaseConsentement>
    </Formulaire>
  )
}
