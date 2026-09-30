import Link from "@/components/ui/Lien"
import { CaseConsentement, ChampTexte } from "@/components/forms/Champs"
import { Formulaire } from "@/components/forms/Formulaire"
import { traducteur } from "@/lib/i18n/serveur"

/** Interface prête ; les inscriptions partent vers le webhook des formulaires, sans fournisseur imposé. */
export async function Newsletter() {
  const t = await traducteur()
  return (
    <section aria-labelledby="titre-newsletter" className="border-trait bg-papier-2 border-y">
      <div className="conteneur grid gap-8 py-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-20">
        <div>
          <p className="surtitre text-accent-encre">Newsletter</p>
          <h2 id="titre-newsletter" className="titre-section mt-2 max-w-xl">
            {t({
              fr: "Restez connecté à l'actualité des Trois Frontières.",
              de: "Bleiben Sie mit dem Dreiländereck verbunden.",
              lb: "Bleift mat den Neiegkeeten aus dem Dräilännereck verbonnen.",
            })}
          </h2>
          <p className="presse text-encre-2 mt-4 max-w-lg text-lg leading-snug">
            {t({
              fr: "Les infos du territoire, les émissions à ne pas manquer et les rendez-vous de l'agenda, directement dans votre boîte mail.",
              de: "Nachrichten aus der Region, Sendungen, die Sie nicht verpassen sollten, und Termine aus der Agenda – direkt in Ihr Postfach.",
              lb: "D'Neiegkeeten aus der Regioun, d'Sendungen, déi Dir net verpasse sollt, an d'Rendez-vousen aus der Agenda – direkt an Är Mailbox.",
            })}
          </p>
        </div>
        <Formulaire
          type="newsletter"
          compact
          libelleEnvoi={t({ fr: "Je m'inscris", de: "Anmelden", lb: "Umellen" })}
          succes={{
            titre: t({ fr: "C'est noté !", de: "Notiert!", lb: "Notéiert!" }),
            texte: t({
              fr: "Votre inscription est bien enregistrée. À très vite sur Radio Tripoint.",
              de: "Ihre Anmeldung ist eingegangen. Bis bald auf Radio Tripoint.",
              lb: "Är Umeldung ass ukomm. Bis geschwënn op Radio Tripoint.",
            }),
          }}
        >
          <ChampTexte
            name="email"
            type="email"
            libelle={t({
              fr: "Votre adresse e-mail",
              de: "Ihre E-Mail-Adresse",
              lb: "Är E-Mail-Adress",
            })}
            autoComplete="email"
            inputMode="email"
            placeholder={t({
              fr: "prenom@exemple.fr",
              de: "vorname@beispiel.de",
              lb: "virnumm@beispill.lu",
            })}
          />
          <CaseConsentement className="mt-4">
            {t({
              fr: "J'accepte de recevoir la newsletter de Radio Tripoint. Désinscription possible à tout moment.",
              de: "Ich möchte den Newsletter von Radio Tripoint erhalten. Abmeldung jederzeit möglich.",
              lb: "Ech wëll den Newsletter vu Radio Tripoint kréien. Ofmellen ass all Moment méiglech.",
            })}{" "}
            <Link href="/politique-confidentialite" className="lien">
              {t({ fr: "Données personnelles", de: "Datenschutz", lb: "Dateschutz" })}
            </Link>
          </CaseConsentement>
        </Formulaire>
      </div>
    </section>
  )
}
