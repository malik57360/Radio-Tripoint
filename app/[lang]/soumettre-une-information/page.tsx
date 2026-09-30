import { Lightbulb, Lock, Mic } from "lucide-react"
import Link from "@/components/ui/Lien"
import {
  CaseConsentement,
  ChampChoix,
  ChampFichier,
  ChampTexte,
  ChampZone,
} from "@/components/forms/Champs"
import { Formulaire } from "@/components/forms/Formulaire"
import { PageHero } from "@/components/ui/PageHero"
import { categoriesInfo, libellesCategoriesInfo, PIECE_JOINTE } from "@/lib/formulaires/schemas"
import type { Trad } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Soumettre une information à la rédaction",
      de: "Eine Information an die Redaktion senden",
      lb: "Eng Informatioun un d'Redaktioun schécken",
    },
    description: {
      fr: "Un événement, une initiative, une info locale ? Transmettez-la à la rédaction de Radio Tripoint, la radio des Trois Frontières.",
      de: "Eine Veranstaltung, eine Initiative, eine lokale Info? Schicken Sie sie an die Redaktion von Radio Tripoint, dem Radio des Dreiländerecks.",
      lb: "En Evenement, eng Initiativ, eng lokal Info? Schéckt se un d'Redaktioun vu Radio Tripoint, dem Radio vum Dräilännereck.",
    },
    chemin: "/soumettre-une-information",
  })

const conseils: { icone: typeof Lightbulb; titre: Trad; texte: Trad }[] = [
  {
    icone: Lightbulb,
    titre: { fr: "Soyez précis", de: "Seien Sie genau", lb: "Sidd präzis" },
    texte: {
      fr: "Qui, quoi, où, quand : les faits d'abord. Une date et un lieu nous font gagner du temps.",
      de: "Wer, was, wo, wann: zuerst die Fakten. Datum und Ort sparen uns Zeit.",
      lb: "Wien, wat, wou, wéini: d'Fakten als éischt. En Datum an en Uert spueren eis Zäit.",
    },
  },
  {
    icone: Mic,
    titre: { fr: "Tout le territoire", de: "Die ganze Region", lb: "Déi ganz Regioun" },
    texte: {
      fr: "France, Luxembourg, Allemagne : toutes les infos des Trois Frontières nous intéressent.",
      de: "Frankreich, Luxemburg, Deutschland: Uns interessieren alle Infos aus dem Dreiländereck.",
      lb: "Frankräich, Lëtzebuerg, Däitschland: All Infoen aus dem Dräilännereck interesséieren eis.",
    },
  },
  {
    icone: Lock,
    titre: { fr: "Vos données protégées", de: "Ihre Daten geschützt", lb: "Är Donnéeë geschützt" },
    texte: {
      fr: "Vos coordonnées servent uniquement à vous recontacter. Elles ne sont jamais publiées.",
      de: "Ihre Kontaktdaten dienen nur dazu, Sie zu kontaktieren. Sie werden nie veröffentlicht.",
      lb: "Är Kontaktdaten déngen nëmmen dozou, Iech ze kontaktéieren. Si ginn ni publizéiert.",
    },
  },
]

export default async function PageSoumettre() {
  const t = await traducteur()
  return (
    <>
      <PageHero
        miettes={[
          {
            nom: t({
              fr: "Soumettre une information",
              de: "Information einsenden",
              lb: "Informatioun aschécken",
            }),
            chemin: "/soumettre-une-information",
          },
        ]}
        surtitre={t({ fr: "Participer", de: "Mitmachen", lb: "Matmaachen" })}
        titre={t({
          fr: "Vous avez une information ?",
          de: "Sie haben eine Information?",
          lb: "Dir hutt eng Informatioun?",
        })}
        intro={t({
          fr: "Un événement, une initiative, un talent, un problème à signaler : Radio Tripoint relaie ce qui se passe près de chez vous. Écrivez à la rédaction.",
          de: "Eine Veranstaltung, eine Initiative, ein Talent, ein Problem: Radio Tripoint berichtet, was in Ihrer Nähe passiert. Schreiben Sie der Redaktion.",
          lb: "En Evenement, eng Initiativ, en Talent, e Problem: Radio Tripoint bericht, wat bei Iech an der Géigend geschitt. Schreift der Redaktioun.",
        })}
      />
      <div className="conteneur grid gap-12 py-12 lg:grid-cols-[1fr_1.8fr] lg:gap-16 lg:py-16">
        <aside>
          <ul className="space-y-7 lg:sticky lg:top-24">
            {conseils.map(({ icone: Icone, titre, texte }) => (
              <li key={titre.fr} className="flex gap-4">
                <Icone
                  className="text-accent-encre mt-0.5 size-6 flex-none"
                  aria-hidden
                  strokeWidth={1.7}
                />
                <div>
                  <h2 className="titre-carte text-lg">{t(titre)}</h2>
                  <p className="text-encre-2 mt-1">{t(texte)}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <Formulaire
          type="information"
          libelleEnvoi={t({
            fr: "Envoyer à la rédaction",
            de: "An die Redaktion senden",
            lb: "Un d'Redaktioun schécken",
          })}
          succes={{
            titre: t({
              fr: "Merci, c'est transmis !",
              de: "Danke, ist angekommen!",
              lb: "Merci, et ass ukomm!",
            }),
            texte: t({
              fr: "La rédaction étudie votre information et vous recontacte si besoin.",
              de: "Die Redaktion prüft Ihre Information und meldet sich bei Bedarf.",
              lb: "D'Redaktioun kuckt Är Informatioun duerch a mellt sech wann néideg.",
            }),
          }}
        >
          <fieldset>
            <legend className="surtitre text-encre-3 mb-5">
              {t({ fr: "Vous", de: "Sie", lb: "Dir" })}
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <ChampTexte
                name="nom"
                libelle={t({ fr: "Nom", de: "Name", lb: "Numm" })}
                autoComplete="name"
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
              <ChampTexte
                name="ville"
                libelle={t({
                  fr: "Ville concernée",
                  de: "Betroffener Ort",
                  lb: "Betraff Uertschaft",
                })}
                autoComplete="address-level2"
                placeholder="Sierck-les-Bains, Perl, Schengen…"
              />
            </div>
          </fieldset>
          <fieldset className="mt-10">
            <legend className="surtitre text-encre-3 mb-5">
              {t({ fr: "Votre information", de: "Ihre Information", lb: "Är Informatioun" })}
            </legend>
            <div className="grid gap-5">
              <ChampChoix
                name="categorie"
                libelle={t({ fr: "Catégorie", de: "Kategorie", lb: "Kategorie" })}
                options={categoriesInfo}
                libelles={libellesCategoriesInfo}
              />
              <ChampTexte
                name="titre"
                libelle={t({ fr: "Titre", de: "Titel", lb: "Titel" })}
                placeholder={t({
                  fr: "En une phrase, de quoi s'agit-il ?",
                  de: "Worum geht es, in einem Satz?",
                  lb: "Ëm wat geet et, an engem Saz?",
                })}
              />
              <ChampZone
                name="message"
                libelle={t({ fr: "Message", de: "Nachricht", lb: "Message" })}
                rows={8}
                placeholder={t({
                  fr: "Les faits, la date, le lieu, les personnes à contacter…",
                  de: "Die Fakten, das Datum, der Ort, Ansprechpersonen…",
                  lb: "D'Fakten, den Datum, den Uert, d'Kontaktpersounen…",
                })}
              />
              <ChampFichier
                name="piece_jointe"
                libelle={t({ fr: "Pièce jointe", de: "Anhang", lb: "Unhang" })}
                aide={t(PIECE_JOINTE.libelle)}
                accept={PIECE_JOINTE.types.join(",")}
              />
            </div>
          </fieldset>
          <CaseConsentement>
            {t({
              fr: "J'accepte que Radio Tripoint puisse me recontacter concernant cette information.",
              de: "Ich bin damit einverstanden, dass Radio Tripoint mich zu dieser Information kontaktieren darf.",
              lb: "Ech sinn domat averstanen, datt Radio Tripoint mech wéinst dëser Informatioun kontaktéiere kann.",
            })}{" "}
            <Link href="/politique-confidentialite" className="lien">
              {t({ fr: "Données personnelles", de: "Datenschutz", lb: "Dateschutz" })}
            </Link>
          </CaseConsentement>
        </Formulaire>
      </div>
    </>
  )
}
