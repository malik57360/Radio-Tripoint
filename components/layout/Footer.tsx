import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"
import Link from "@/components/ui/Lien"
import { site } from "@/config/site"
import { reseauxActifs } from "@/config/socialLinks"
import { IconeReseau } from "@/components/marque/IconesReseaux"
import { Logo } from "@/components/marque/Logo"
import { Tripoint } from "@/components/marque/Tripoint"
import type { Trad } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"
import { ThemeToggle } from "./ThemeToggle"

const colonnes: { titre: Trad; liens: { libelle: Trad; href: string }[] }[] = [
  {
    titre: { fr: "Écouter & lire", de: "Hören & lesen", lb: "Lauschteren & liesen" },
    liens: [
      { libelle: { fr: "Actualités", de: "Aktuelles", lb: "Aktualitéiten" }, href: "/actualites" },
      { libelle: { fr: "Émissions", de: "Sendungen", lb: "Sendungen" }, href: "/emissions" },
      {
        libelle: {
          fr: "Podcasts & replays",
          de: "Podcasts & Wiederholungen",
          lb: "Podcasts & Replays",
        },
        href: "/podcasts",
      },
      { libelle: { fr: "Agenda", de: "Agenda", lb: "Agenda" }, href: "/agenda" },
    ],
  },
  {
    titre: { fr: "Explorer", de: "Entdecken", lb: "Entdecken" },
    liens: [
      {
        libelle: { fr: "Art & Culture", de: "Kunst & Kultur", lb: "Konscht & Kultur" },
        href: "/art-culture",
      },
      { libelle: { fr: "Actu Music", de: "Musik", lb: "Musek" }, href: "/actu-music" },
      { libelle: { fr: "Actu People", de: "People", lb: "People" }, href: "/actu-people" },
      {
        libelle: { fr: "Mode & Style", de: "Mode & Stil", lb: "Mode & Stil" },
        href: "/mode-style",
      },
      { libelle: { fr: "Sport", de: "Sport", lb: "Sport" }, href: "/sport" },
      { libelle: { fr: "Prévention", de: "Prävention", lb: "Preventioun" }, href: "/prevention" },
    ],
  },
  {
    titre: { fr: "Professionnels", de: "Für Unternehmen", lb: "Fir Professionneller" },
    liens: [
      { libelle: { fr: "Publicité", de: "Werbung", lb: "Reklamm" }, href: "/publicite" },
      {
        libelle: { fr: "Partenariats", de: "Partnerschaften", lb: "Partenariater" },
        href: "/publicite#partenariats",
      },
      {
        libelle: {
          fr: "Soumettre une information",
          de: "Eine Information einsenden",
          lb: "Eng Informatioun aschécken",
        },
        href: "/soumettre-une-information",
      },
      { libelle: { fr: "À propos", de: "Über uns", lb: "Iwwer eis" }, href: "/a-propos" },
    ],
  },
]

export async function Footer() {
  const t = await traducteur()
  const reseaux = reseauxActifs()
  const a = site.contact.adresse
  return (
    <footer className="bg-nuit text-nuit-encre relative overflow-hidden">
      <Tripoint
        className="text-nuit-trait/70 pointer-events-none absolute top-10 -right-40 size-[36rem]"
        epaisseur={1}
        point={false}
      />
      <div className="conteneur relative pt-16 pb-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo sombre taille={128} className="size-28 lg:size-32" />
            <p className="presse text-nuit-encre-2 mt-5 max-w-sm text-[1.15rem] leading-snug">
              {t({
                fr: "La radio et le média des Trois Frontières. France, Luxembourg, Allemagne\u00a0: une seule antenne.",
                de: "Das Radio und Medium des Dreiländerecks. Frankreich, Luxemburg, Deutschland: ein einziger Sender.",
                lb: "De Radio an d'Medium vum Dräilännereck. Frankräich, Lëtzebuerg, Däitschland: eng eenzeg Antenn.",
              })}
            </p>
            {reseaux.length > 0 && (
              <ul
                className="mt-6 flex flex-wrap gap-2"
                aria-label={t({
                  fr: "Réseaux sociaux",
                  de: "Soziale Netzwerke",
                  lb: "Sozial Netzwierker",
                })}
              >
                {reseaux.map((r) => (
                  <li key={r.reseau}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener"
                      aria-label={`Radio Tripoint ${t({ fr: "sur", de: "auf", lb: "op" })} ${r.libelle}`}
                      className="border-nuit-trait hover:border-nuit-encre hover:bg-nuit-2 grid size-11 place-items-center rounded-full border transition-colors"
                    >
                      <IconeReseau reseau={r.reseau} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {colonnes.map((c) => (
              <nav key={c.titre.fr} aria-label={t(c.titre)}>
                <p className="surtitre text-nuit-encre-2">{t(c.titre)}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.liens.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-nuit-encre/90 hover:text-nuit-accent text-[0.95rem] transition-colors"
                      >
                        {t(l.libelle)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div className="col-span-2 sm:col-span-1">
              <p className="surtitre text-nuit-encre-2">
                {t({ fr: "Contact", de: "Kontakt", lb: "Kontakt" })}
              </p>
              <ul className="mt-4 space-y-3 text-[0.95rem]">
                <li>
                  <a
                    href={`tel:${site.contact.telephoneE164}`}
                    className="hover:text-nuit-accent inline-flex items-center gap-2"
                  >
                    <Phone className="text-nuit-encre-2 size-4 flex-none" aria-hidden />
                    {site.contact.telephone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="hover:text-nuit-accent inline-flex items-start gap-2 break-all"
                  >
                    <Mail className="text-nuit-encre-2 mt-1 size-4 flex-none" aria-hidden />
                    {site.contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={site.contact.itineraire}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-nuit-accent inline-flex items-start gap-2"
                  >
                    <MapPin className="text-nuit-encre-2 mt-1 size-4 flex-none" aria-hidden />
                    <address className="not-italic">
                      {t(a.lieu)}
                      <br />
                      {a.rue}
                      <br />
                      {a.codePostal} {a.ville}
                    </address>
                  </a>
                </li>
              </ul>
              <Link href="/contact" className="lien-fleche text-nuit-accent mt-5">
                {t({ fr: "Nous écrire", de: "Schreiben Sie uns", lb: "Schreift eis" })}{" "}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        {/* Texte décoratif en pseudo-élément : hors de l'arbre d'accessibilité. */}
        <p
          aria-hidden
          data-texte={t(site.pays).join(" · ")}
          className="titre-affiche border-nuit-trait text-nuit-encre/10 mt-16 border-t pt-8 text-[clamp(2.2rem,1rem+6vw,6.5rem)] select-none before:content-[attr(data-texte)]"
        />

        <div className="text-nuit-encre-2 mt-8 flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.nomOfficiel}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link href="/mentions-legales" className="hover:text-nuit-encre">
                {t({ fr: "Mentions légales", de: "Impressum", lb: "Impressum" })}
              </Link>
            </li>
            <li>
              <Link href="/politique-confidentialite" className="hover:text-nuit-encre">
                {t({ fr: "Politique de confidentialité", de: "Datenschutz", lb: "Dateschutz" })}
              </Link>
            </li>
            <li>
              <Link href="/politique-confidentialite#cookies" className="hover:text-nuit-encre">
                Cookies
              </Link>
            </li>
            <li>
              <ThemeToggle className="hover:text-nuit-encre inline-flex items-center gap-2" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
