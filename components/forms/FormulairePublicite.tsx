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
      libelleEnvoi={t({ fr: "Demander une offre", de: "Angebot anfragen", lb: "Offer ufroen" })}
      succes={{
        titre: t({ fr: "Demande reçue.", de: "Anfrage erhalten.", lb: "Ufro kritt." }),
        texte: t({
          fr: "Notre équipe revient vers vous rapidement pour construire une proposition adaptée.",
          de: "Unser Team meldet sich schnell bei Ihnen, um ein passendes Angebot zu erstellen.",
          lb: "Eis Equipe mellt sech séier bei Iech, fir eng passend Propose auszeschaffen.",
        }),
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <ChampTexte
          name="nom"
          libelle={t({ fr: "Nom et prénom", de: "Vor- und Nachname", lb: "Virnumm an Numm" })}
          autoComplete="name"
        />
        <ChampTexte
          name="entreprise"
          libelle={t({
            fr: "Entreprise ou structure",
            de: "Unternehmen oder Organisation",
            lb: "Firma oder Organisatioun",
          })}
          autoComplete="organization"
        />
        <ChampTexte
          name="email"
          type="email"
          libelle={t({ fr: "E-mail", de: "E-Mail", lb: "E-Mail" })}
          autoComplete="email"
          inputMode="email"
        />
        <ChampTexte
          name="telephone"
          type="tel"
          libelle={t({ fr: "Téléphone", de: "Telefon", lb: "Telefon" })}
          autoComplete="tel"
          inputMode="tel"
          facultatif
        />
        <ChampChoix
          name="besoin"
          libelle={t({ fr: "Votre besoin", de: "Ihr Bedarf", lb: "Äre Besoin" })}
          options={besoinsPub}
          libelles={libellesBesoinsPub}
          className="sm:col-span-2"
        />
        <ChampZone
          name="message"
          libelle={t({ fr: "Votre projet", de: "Ihr Projekt", lb: "Äre Projet" })}
          facultatif
          placeholder={t({
            fr: "Objectif, période, zone visée, budget indicatif…",
            de: "Ziel, Zeitraum, Zielgebiet, ungefähres Budget…",
            lb: "Zil, Zäitraum, Zilgebitt, ongeféier Budget…",
          })}
          className="sm:col-span-2"
        />
      </div>
      <CaseConsentement>
        {t({
          fr: "J'accepte que Radio Tripoint utilise ces informations pour me recontacter au sujet de ma demande.",
          de: "Ich bin damit einverstanden, dass Radio Tripoint diese Angaben nutzt, um mich zu meiner Anfrage zu kontaktieren.",
          lb: "Ech sinn domat averstanen, datt Radio Tripoint dës Informatiounen notzt, fir mech wéinst menger Ufro ze kontaktéieren.",
        })}{" "}
        <Link href="/politique-confidentialite" className="lien">
          {t({ fr: "En savoir plus", de: "Mehr erfahren", lb: "Méi gewuer ginn" })}
        </Link>
      </CaseConsentement>
    </Formulaire>
  )
}
