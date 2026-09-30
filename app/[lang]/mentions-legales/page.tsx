import Link from "@/components/ui/Lien"
import { ACompleter, ProseLegale } from "@/components/ui/ProseLegale"
import { PageHero } from "@/components/ui/PageHero"
import { site } from "@/config/site"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export const generateMetadata = () =>
  metadataPage({
    titre: { fr: "Mentions légales", de: "Impressum", lb: "Impressum" },
    description: {
      fr: "Mentions légales du site de Radio Tripoint.",
      de: "Impressum der Website von Radio Tripoint.",
      lb: "Impressum vum Site vu Radio Tripoint.",
    },
    chemin: "/mentions-legales",
  })

export default async function MentionsLegales() {
  const t = await traducteur()
  const a = site.contact.adresse
  const l = site.legal
  const titre = t({ fr: "Mentions légales", de: "Impressum", lb: "Impressum" })
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
              })}
            </p>
          )}
          <h2>
            {t({ fr: "Éditeur du site", de: "Herausgeber der Website", lb: "Editeur vum Site" })}
          </h2>
          <p>
            <strong>{site.nomOfficiel}</strong>
            <br />
            {t(a.lieu)}, {a.rue}, {a.codePostal} {a.ville},{" "}
            {t({ fr: "France", de: "Frankreich", lb: "Frankräich" })}
            <br />
            {t({ fr: "Téléphone", de: "Telefon", lb: "Telefon" })} :{" "}
            <a href={`tel:${site.contact.telephoneE164}`}>{site.contact.telephone}</a>
            <br />
            {t({ fr: "E-mail", de: "E-Mail", lb: "E-Mail" })} :{" "}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </p>
          <ul>
            {l.raisonSociale && (
              <li>
                {t({
                  fr: "Société éditrice",
                  de: "Herausgebende Gesellschaft",
                  lb: "Editeursfirma",
                })}{" "}
                : {l.raisonSociale}
              </li>
            )}
            <li>
              {t({ fr: "Forme juridique", de: "Rechtsform", lb: "Rechtsform" })} :{" "}
              <ACompleter
                valeur={
                  l.formeJuridique &&
                  t({
                    fr: l.formeJuridique,
                    de: "SAS (vereinfachte Aktiengesellschaft nach französischem Recht)",
                    lb: "SAS (vereinfacht Aktiegesellschaft no franséischem Recht)",
                  })
                }
              />
            </li>
            {l.siegeSocial && (
              <li>
                {t({ fr: "Siège social", de: "Sitz", lb: "Sëtz" })} : {l.siegeSocial}
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
              })}{" "}
              :{" "}
              <ACompleter
                valeur={
                  l.directeurPublication &&
                  t({
                    fr: l.directeurPublication,
                    de: l.directeurPublication.replace("président", "Präsident"),
                    lb: l.directeurPublication.replace("président", "President"),
                  })
                }
              />
            </li>
          </ul>
          <h2>{t({ fr: "Hébergement", de: "Hosting", lb: "Hosting" })}</h2>
          <p>
            {l.hebergeur.nom}, {l.hebergeur.adresse} —{" "}
            <a href={l.hebergeur.site}>{l.hebergeur.site.replace("https://", "")}</a>
          </p>
          <h2>
            {t({
              fr: "Propriété intellectuelle",
              de: "Urheberrecht",
              lb: "Intellektuell Eegentum",
            })}
          </h2>
          <p>
            {t({
              fr: `L'ensemble des contenus de ce site (textes, émissions, podcasts, visuels, logo) est la propriété de ${site.nomOfficiel} ou de ses auteurs, sauf mention contraire. Toute reproduction sans autorisation est interdite.`,
              de: `Alle Inhalte dieser Website (Texte, Sendungen, Podcasts, Bilder, Logo) sind, soweit nicht anders angegeben, Eigentum von ${site.nomOfficiel} oder ihrer Urheber. Jede Vervielfältigung ohne Genehmigung ist untersagt.`,
              lb: `All Inhalter vun dësem Site (Texter, Sendungen, Podcasts, Biller, Logo) sinn, wann näischt anescht uginn ass, Eegentum vu ${site.nomOfficiel} oder vun hiren Auteuren. All Reproduktioun ouni Erlaabnis ass verbueden.`,
            })}
          </p>
          <h2>{t({ fr: "Liens externes", de: "Externe Links", lb: "Extern Linken" })}</h2>
          <p>
            {t({
              fr: `Les liens vers des sites tiers sont fournis à titre d'information ; ${site.nom} n'est pas responsable de leur contenu.`,
              de: `Links zu Websites Dritter dienen nur der Information; ${site.nom} ist für deren Inhalt nicht verantwortlich.`,
              lb: `Linken op Siten vun Drëtte sinn nëmmen zur Informatioun do; ${site.nom} ass net verantwortlech fir hiren Inhalt.`,
            })}
          </p>
          <h2>{t({ fr: "Données personnelles", de: "Datenschutz", lb: "Dateschutz" })}</h2>
          <p>
            {t({ fr: "Voir la", de: "Siehe", lb: "Kuckt d'" })}{" "}
            <Link href="/politique-confidentialite">
              {t({
                fr: "politique de confidentialité",
                de: "Datenschutzerklärung",
                lb: "Dateschutzerklärung",
              })}
            </Link>
            .
          </p>
        </ProseLegale>
      </div>
    </>
  )
}
