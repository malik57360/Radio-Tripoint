import Link from "@/components/ui/Lien"
import { ACompleter, ProseLegale } from "@/components/ui/ProseLegale"
import { PageHero } from "@/components/ui/PageHero"
import { site } from "@/config/site"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Mentions légales",
      de: "Impressum",
      lb: "Impressum",
      en: "Legal notice",
      es: "Aviso legal",
    },
    description: {
      fr: "Mentions légales du site de Radio Tripoint.",
      de: "Impressum der Website von Radio Tripoint.",
      lb: "Impressum vum Site vu Radio Tripoint.",
      en: "Legal notice for the Radio Tripoint website.",
      es: "Aviso legal del sitio web de Radio Tripoint.",
    },
    chemin: "/mentions-legales",
  })

export default async function MentionsLegales() {
  const t = await traducteur()
  const a = site.contact.adresse
  const l = site.legal
  const titre = t({
    fr: "Mentions légales",
    de: "Impressum",
    lb: "Impressum",
    en: "Legal notice",
    es: "Aviso legal",
  })
  return (
    <>
      <PageHero miettes={[{ nom: titre, chemin: "/mentions-legales" }]} titre={titre} />
      <div className="conteneur py-12 lg:py-16">
        <ProseLegale>
          {t.langue !== "fr" && (
            <p className="text-sm">
              {t({
                fr: "",
                de: "Übersetzung zur Information: Rechtlich maßgeblich ist die französische Fassung.",
                lb: "Iwwersetzung zur Informatioun: Juristesch gëllt déi franséisch Versioun.",
                en: "Translation for information only: the French version is the legally binding one.",
                es: "Traducción a título informativo: la versión francesa es la única jurídicamente vinculante.",
              })}
            </p>
          )}
          <h2>
            {t({
              fr: "Éditeur du site",
              de: "Herausgeber der Website",
              lb: "Editeur vum Site",
              en: "Website publisher",
              es: "Editor del sitio",
            })}
          </h2>
          <p>
            <strong>{site.nomOfficiel}</strong>
            <br />
            {t(a.lieu)}, {a.rue}, {a.codePostal} {a.ville},{" "}
            {t({ fr: "France", de: "Frankreich", lb: "Frankräich", en: "France", es: "Francia" })}
            <br />
            {t({
              fr: "Téléphone",
              de: "Telefon",
              lb: "Telefon",
              en: "Phone",
              es: "Teléfono",
            })}{" "}
            : <a href={`tel:${site.contact.telephoneE164}`}>{site.contact.telephone}</a>
            <br />
            {t({
              fr: "E-mail",
              de: "E-Mail",
              lb: "E-Mail",
              en: "Email",
              es: "Correo electrónico",
            })}{" "}
            : <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </p>
          <ul>
            {l.raisonSociale && (
              <li>
                {t({
                  fr: "Société éditrice",
                  de: "Herausgebende Gesellschaft",
                  lb: "Editeursfirma",
                  en: "Publishing company",
                  es: "Sociedad editora",
                })}{" "}
                : {l.raisonSociale}
              </li>
            )}
            <li>
              {t({
                fr: "Forme juridique",
                de: "Rechtsform",
                lb: "Rechtsform",
                en: "Legal form",
                es: "Forma jurídica",
              })}{" "}
              :{" "}
              <ACompleter
                valeur={
                  l.formeJuridique &&
                  t({
                    fr: l.formeJuridique,
                    de: "SAS (vereinfachte Aktiengesellschaft nach französischem Recht)",
                    lb: "SAS (vereinfacht Aktiegesellschaft no franséischem Recht)",
                    en: "SAS (vereinfachte Aktiengesellschaft nach französischem Recht)",
                    es: "SAS (vereinfachte Aktiengesellschaft nach französischem Recht)",
                  })
                }
              />
            </li>
            {l.siegeSocial && (
              <li>
                {t({
                  fr: "Siège social",
                  de: "Sitz",
                  lb: "Sëtz",
                  en: "Registered office",
                  es: "Domicilio social",
                })}{" "}
                : {l.siegeSocial}
              </li>
            )}
            <li>
              SIRET : <ACompleter valeur={l.siret} />
            </li>
            <li>
              {t({
                fr: "Directeur ou directrice de la publication",
                de: "Verantwortlich für den Inhalt",
                lb: "Verantwortlech fir den Inhalt",
                en: "Publication director",
                es: "Director o directora de la publicación",
              })}{" "}
              :{" "}
              <ACompleter
                valeur={
                  l.directeurPublication &&
                  t({
                    fr: l.directeurPublication,
                    de: l.directeurPublication.replace("président", "Präsident"),
                    lb: l.directeurPublication.replace("président", "President"),
                    en: l.directeurPublication.replace("président", "Präsident"),
                    es: l.directeurPublication.replace("président", "Präsident"),
                  })
                }
              />
            </li>
          </ul>
          <h2>
            {t({
              fr: "Hébergement",
              de: "Hosting",
              lb: "Hosting",
              en: "Hosting",
              es: "Alojamiento",
            })}
          </h2>
          <p>
            {l.hebergeur.nom}, {l.hebergeur.adresse} —{" "}
            <a href={l.hebergeur.site}>{l.hebergeur.site.replace("https://", "")}</a>
          </p>
          <h2>
            {t({
              fr: "Propriété intellectuelle",
              de: "Urheberrecht",
              lb: "Intellektuell Eegentum",
              en: "Intellectual property",
              es: "Propiedad intelectual",
            })}
          </h2>
          <p>
            {t({
              fr: `L'ensemble des contenus de ce site (textes, émissions, podcasts, visuels, logo) est la propriété de ${site.nomOfficiel} ou de ses auteurs, sauf mention contraire. Toute reproduction sans autorisation est interdite.`,
              de: `Alle Inhalte dieser Website (Texte, Sendungen, Podcasts, Bilder, Logo) sind, soweit nicht anders angegeben, Eigentum von ${site.nomOfficiel} oder ihrer Urheber. Jede Vervielfältigung ohne Genehmigung ist untersagt.`,
              lb: `All Inhalter vun dësem Site (Texter, Sendungen, Podcasts, Biller, Logo) sinn, wann näischt anescht uginn ass, Eegentum vu ${site.nomOfficiel} oder vun hiren Auteuren. All Reproduktioun ouni Erlaabnis ass verbueden.`,
              en: `All content on this website (texts, programmes, podcasts, images, logo) is the property of ${site.nomOfficiel} or its authors, unless otherwise stated. Any reproduction without permission is prohibited.`,
              es: `El conjunto de los contenidos de este sitio (textos, programas, pódcasts, imágenes, logotipo) es propiedad de ${site.nomOfficiel} o de sus autores, salvo mención contraria. Queda prohibida cualquier reproducción sin autorización.`,
            })}
          </p>
          <h2>
            {t({
              fr: "Liens externes",
              de: "Externe Links",
              lb: "Extern Linken",
              en: "External links",
              es: "Enlaces externos",
            })}
          </h2>
          <p>
            {t({
              fr: `Les liens vers des sites tiers sont fournis à titre d'information ; ${site.nom} n'est pas responsable de leur contenu.`,
              de: `Links zu Websites Dritter dienen nur der Information; ${site.nom} ist für deren Inhalt nicht verantwortlich.`,
              lb: `Linken op Siten vun Drëtte sinn nëmmen zur Informatioun do; ${site.nom} ass net verantwortlech fir hiren Inhalt.`,
              en: `Links to third-party websites are provided for information only; ${site.nom} is not responsible for their content.`,
              es: `Los enlaces a sitios de terceros se facilitan a título informativo; ${site.nom} no se hace responsable de su contenido.`,
            })}
          </p>
          <h2>
            {t({
              fr: "Données personnelles",
              de: "Datenschutz",
              lb: "Dateschutz",
              en: "Privacy",
              es: "Privacidad",
            })}
          </h2>
          <p>
            {t({ fr: "Voir la", de: "Siehe", lb: "Kuckt d'", en: "See the", es: "Consulte la" })}{" "}
            <Link href="/politique-confidentialite">
              {t({
                fr: "politique de confidentialité",
                de: "Datenschutzerklärung",
                lb: "Dateschutzerklärung",
                en: "privacy policy",
                es: "política de privacidad",
              })}
            </Link>
            .
          </p>
        </ProseLegale>
      </div>
    </>
  )
}
