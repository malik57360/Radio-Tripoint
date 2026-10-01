import { Mail, MapPin, Navigation, Phone } from "lucide-react"
import Link from "@/components/ui/Lien"
import { CaseConsentement, ChampTexte, ChampZone } from "@/components/forms/Champs"
import { Formulaire } from "@/components/forms/Formulaire"
import { IconeReseau } from "@/components/marque/IconesReseaux"
import { CarteContact } from "@/components/territoire/CarteContact"
import { PageHero } from "@/components/ui/PageHero"
import { adresseLigne, site } from "@/config/site"
import { reseauxActifs } from "@/config/socialLinks"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Contact — Radio Tripoint, Sierck-les-Bains",
      de: "Kontakt — Radio Tripoint, Sierck-les-Bains",
      lb: "Kontakt — Radio Tripoint, Sierck-les-Bains",
      en: "Contact — Radio Tripoint, Sierck-les-Bains",
      es: "Contacto — Radio Tripoint, Sierck-les-Bains",
    },
    description: {
      fr: `Contactez Radio Tripoint : ${site.contact.telephone}, ${site.contact.email}. ${adresseLigne}.`,
      de: `Kontaktieren Sie Radio Tripoint: ${site.contact.telephone}, ${site.contact.email}. ${adresseLigne}.`,
      lb: `Kontaktéiert Radio Tripoint: ${site.contact.telephone}, ${site.contact.email}. ${adresseLigne}.`,
      en: `Contact Radio Tripoint: ${site.contact.telephone}, ${site.contact.email}. ${adresseLigne}.`,
      es: `Contacte con Radio Tripoint: ${site.contact.telephone}, ${site.contact.email}. ${adresseLigne}.`,
    },
    chemin: "/contact",
  })

export default async function PageContact() {
  const t = await traducteur()
  const a = site.contact.adresse
  const reseaux = reseauxActifs()
  const cartes = [
    {
      cle: "telephone",
      icone: Phone,
      titre: t({ fr: "Téléphone", de: "Telefon", lb: "Telefon", en: "Phone", es: "Teléfono" }),
      valeur: site.contact.telephone,
      href: `tel:${site.contact.telephoneE164}`,
      cta: t({ fr: "Appeler", de: "Anrufen", lb: "Uruffen", en: "Call", es: "Llamar" }),
    },
    {
      cle: "email",
      icone: Mail,
      titre: t({ fr: "E-mail", de: "E-Mail", lb: "E-Mail", en: "Email", es: "Correo electrónico" }),
      valeur: site.contact.email,
      href: `mailto:${site.contact.email}`,
      cta: t({
        fr: "Envoyer un e-mail",
        de: "E-Mail senden",
        lb: "E-Mail schécken",
        en: "Send an email",
        es: "Enviar un correo",
      }),
    },
    {
      cle: "adresse",
      icone: MapPin,
      titre: t({ fr: "Adresse", de: "Adresse", lb: "Adress", en: "Address", es: "Dirección" }),
      valeur: `${t(a.lieu)}, ${a.rue}, ${a.codePostal} ${a.ville}`,
      href: site.contact.itineraire,
      cta: t({ fr: "Itinéraire", de: "Route", lb: "Wee", en: "Directions", es: "Cómo llegar" }),
      externe: true,
    },
  ]
  return (
    <>
      <PageHero
        miettes={[
          {
            nom: t({ fr: "Contact", de: "Kontakt", lb: "Kontakt", en: "Contact", es: "Contacto" }),
            chemin: "/contact",
          },
        ]}
        surtitre={t({
          fr: "Nous joindre",
          de: "So erreichen Sie uns",
          lb: "Sou erreecht Dir eis",
          en: "Get in touch",
          es: "Contáctenos",
        })}
        titre={t({ fr: "Contact", de: "Kontakt", lb: "Kontakt", en: "Contact", es: "Contacto" })}
        intro={t({
          fr: "Une question, une idée d'émission, une demande de partenariat ? L'équipe de Radio Tripoint vous répond.",
          de: "Eine Frage, eine Idee für eine Sendung, eine Partnerschaftsanfrage? Das Team von Radio Tripoint antwortet Ihnen.",
          lb: "Eng Fro, eng Iddi fir eng Sendung, eng Ufro fir e Partenariat? D'Equipe vu Radio Tripoint äntwert Iech.",
          en: "A question, an idea for a programme, a partnership request? The Radio Tripoint team will get back to you.",
          es: "¿Una pregunta, una idea de programa, una propuesta de colaboración? El equipo de Radio Tripoint le responde.",
        })}
      />
      <section
        aria-label={t({
          fr: "Coordonnées",
          de: "Kontaktdaten",
          lb: "Kontaktdaten",
          en: "Contact details",
          es: "Datos de contacto",
        })}
        className="conteneur py-12 lg:py-16"
      >
        <h2 className="sr-only">{site.nomOfficiel}</h2>
        <ul className="border-trait bg-trait grid gap-px border md:grid-cols-3">
          {cartes.map(({ cle, icone: Icone, titre, valeur, href, cta, externe }) => (
            <li key={cle} className="bg-surface flex flex-col p-6 sm:p-8">
              <Icone className="text-accent-encre size-6" aria-hidden strokeWidth={1.7} />
              <p className="surtitre text-encre-3 mt-5">{titre}</p>
              {cle === "adresse" ? (
                <address className="titre-carte mt-2 text-[1.15rem] not-italic">
                  {site.nomOfficiel}
                  <br />
                  {t(a.lieu)}
                  <br />
                  {a.rue}
                  <br />
                  {a.codePostal} {a.ville}
                </address>
              ) : (
                <p className="titre-carte mt-2 text-[1.2rem] break-all">{valeur}</p>
              )}
              <a
                href={href}
                {...(externe ? { target: "_blank", rel: "noopener" } : {})}
                className="btn btn-plein mt-6 self-start"
              >
                {cle === "adresse" && <Navigation className="size-4" aria-hidden />}
                {cta}
              </a>
            </li>
          ))}
        </ul>
        {reseaux.length > 0 && (
          <ul
            className="mt-6 flex flex-wrap gap-2"
            aria-label={t({
              fr: "Réseaux sociaux",
              de: "Soziale Netzwerke",
              lb: "Sozial Netzwierker",
              en: "Social media",
              es: "Redes sociales",
            })}
          >
            {reseaux.map((r) => (
              <li key={r.reseau}>
                <a href={r.url} target="_blank" rel="noopener" className="btn btn-trait">
                  <IconeReseau reseau={r.reseau} className="size-4" /> {r.libelle}
                </a>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8">
          <CarteContact />
        </div>
      </section>

      <section aria-labelledby="titre-ecrire" className="conteneur pb-20">
        <div className="filet-section grid gap-12 pt-8 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="titre-ecrire" className="titre-section">
              {t({
                fr: "Nous écrire",
                de: "Schreiben Sie uns",
                lb: "Schreift eis",
                en: "Write to us",
                es: "Escríbanos",
              })}
            </h2>
            <p className="presse text-encre-2 mt-4 text-lg leading-snug">
              {t({
                fr: "Vous avez une information à nous transmettre ? Utilisez plutôt",
                de: "Sie haben eine Information für uns? Nutzen Sie dafür",
                lb: "Dir hutt eng Informatioun fir eis? Benotzt dofir",
                en: "Do you have news to share with us? Please use",
                es: "¿Tiene una información que transmitirnos? Utilice mejor",
              })}{" "}
              <Link href="/soumettre-une-information" className="lien text-encre">
                {t({
                  fr: "le formulaire dédié",
                  de: "das passende Formular",
                  lb: "de passende Formulaire",
                  en: "the dedicated form",
                  es: "el formulario específico",
                })}
              </Link>
              .{" "}
              {t({
                fr: "Annonceur ?",
                de: "Werbekunde?",
                lb: "Annonceur?",
                en: "Advertiser?",
                es: "¿Anunciante?",
              })}{" "}
              <Link href="/publicite#demande" className="lien text-encre">
                {t({
                  fr: "Demandez une offre",
                  de: "Fragen Sie ein Angebot an",
                  lb: "Frot eng Offer un",
                  en: "Request a quote",
                  es: "Solicite una oferta",
                })}
              </Link>
              .
            </p>
          </div>
          <Formulaire
            type="contact"
            libelleEnvoi={t({
              fr: "Envoyer le message",
              de: "Nachricht senden",
              lb: "Message schécken",
              en: "Send message",
              es: "Enviar el mensaje",
            })}
            succes={{
              titre: t({
                fr: "Message envoyé.",
                de: "Nachricht gesendet.",
                lb: "Message geschéckt.",
                en: "Message sent.",
                es: "Mensaje enviado.",
              }),
              texte: t({
                fr: "Merci ! L'équipe de Radio Tripoint vous répond dès que possible.",
                de: "Danke! Das Team von Radio Tripoint antwortet Ihnen so bald wie möglich.",
                lb: "Merci! D'Equipe vu Radio Tripoint äntwert Iech sou séier wéi méiglech.",
                en: "Thank you! The Radio Tripoint team will reply as soon as possible.",
                es: "¡Gracias! El equipo de Radio Tripoint le responderá lo antes posible.",
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
              <ChampTexte
                name="sujet"
                libelle={t({
                  fr: "Sujet",
                  de: "Betreff",
                  lb: "Sujet",
                  en: "Subject",
                  es: "Asunto",
                })}
                facultatif
              />
              <ChampZone
                name="message"
                libelle={t({
                  fr: "Message",
                  de: "Nachricht",
                  lb: "Message",
                  en: "Message",
                  es: "Mensaje",
                })}
                className="sm:col-span-2"
              />
            </div>
            <CaseConsentement>
              {t({
                fr: "J'accepte que Radio Tripoint utilise ces informations pour répondre à mon message.",
                de: "Ich bin damit einverstanden, dass Radio Tripoint diese Angaben nutzt, um auf meine Nachricht zu antworten.",
                lb: "Ech sinn domat averstanen, datt Radio Tripoint dës Informatiounen notzt, fir op mäi Message z'äntweren.",
                en: "I agree that Radio Tripoint may use this information to reply to my message.",
                es: "Acepto que Radio Tripoint utilice estos datos para responder a mi mensaje.",
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
        </div>
      </section>
    </>
  )
}
