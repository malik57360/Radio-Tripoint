import Link from "@/components/ui/Lien"
import { EventCard } from "@/components/events/EventCard"
import { EtatVide } from "@/components/ui/EtatVide"
import { Filtres } from "@/components/ui/Filtres"
import { PageHero } from "@/components/ui/PageHero"
import { listerEvenements, villesAgenda, type Periode } from "@/lib/contenu/evenements"
import type { Trad } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"
import { dateLongue } from "@/lib/utils/dates"
import { EmplacementPub } from "@/components/pub/EmplacementPub"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Agenda des Trois Frontières — sorties et événements",
      de: "Veranstaltungen im Dreiländereck — Ausgehtipps und Events",
      lb: "Agenda vum Dräilännereck — Sortien an Evenementer",
      en: "Three Borders events — what's on",
      es: "Agenda de las Tres Fronteras — salidas y eventos",
    },
    description: {
      fr: "Concerts, fêtes, expositions, sport : l'agenda des événements à Sierck-les-Bains, Apach, Perl, Schengen et dans toute la région des Trois Frontières.",
      de: "Konzerte, Feste, Ausstellungen, Sport: die Veranstaltungen in Sierck-les-Bains, Apach, Perl, Schengen und im ganzen Dreiländereck.",
      lb: "Concerten, Fester, Ausstellungen, Sport: d'Agenda vun den Evenementer zu Sierck-les-Bains, Apach, Perl, Schengen an am ganzen Dräilännereck.",
      en: "Concerts, festivals, exhibitions, sport: what's on in Sierck-les-Bains, Apach, Perl, Schengen and across the Three Borders region.",
      es: "Conciertos, fiestas, exposiciones, deporte: la agenda de eventos en Sierck-les-Bains, Apach, Perl, Schengen y en toda la región de las Tres Fronteras.",
    },
    chemin: "/agenda",
  })

const periodes: { valeur: Periode; libelle: Trad }[] = [
  {
    valeur: "tout",
    libelle: {
      fr: "À venir",
      de: "Demnächst",
      lb: "Demnächst",
      en: "Upcoming",
      es: "Próximamente",
    },
  },
  {
    valeur: "aujourdhui",
    libelle: { fr: "Aujourd'hui", de: "Heute", lb: "Haut", en: "Today", es: "Hoy" },
  },
  {
    valeur: "semaine",
    libelle: {
      fr: "Cette semaine",
      de: "Diese Woche",
      lb: "Dës Woch",
      en: "This week",
      es: "Esta semana",
    },
  },
  {
    valeur: "mois",
    libelle: {
      fr: "Ce mois-ci",
      de: "Diesen Monat",
      lb: "Dëse Mount",
      en: "This month",
      es: "Este mes",
    },
  },
]

export default async function PageAgenda(props: PageProps<"/[lang]/agenda">) {
  const sp = await props.searchParams
  const t = await traducteur()
  const l = t.langue
  const periode = (periodes.find((p) => p.valeur === sp.quand)?.valeur ?? "tout") as Periode
  const villes = await villesAgenda()
  const ville = typeof sp.ville === "string" && villes.includes(sp.ville) ? sp.ville : undefined
  const [evenements, tous] = await Promise.all([
    listerEvenements({ periode, ville, langue: l }),
    listerEvenements({ langue: l }),
  ])

  const href = (quand: string, v?: string) => {
    const p = new URLSearchParams()
    if (quand !== "tout") p.set("quand", quand)
    if (v) p.set("ville", v)
    const s = p.toString()
    return s ? `/agenda?${s}` : "/agenda"
  }

  // Regroupement par mois pour le rythme de lecture.
  const parMois = new Map<string, typeof evenements>()
  for (const e of evenements) {
    // « 25 septembre 2026 » → « septembre 2026 » : mois dans la langue de la page.
    const k = dateLongue(e.debut, l).replace(/^\S+\s/, "")
    parMois.set(k, [...(parMois.get(k) ?? []), e])
  }

  return (
    <>
      <PageHero
        miettes={[
          {
            nom: t({ fr: "Agenda", de: "Agenda", lb: "Agenda", en: "Events", es: "Agenda" }),
            chemin: "/agenda",
          },
        ]}
        surtitre={t({
          fr: "Sortir",
          de: "Ausgehen",
          lb: "Erausgoen",
          en: "Going out",
          es: "Salir",
        })}
        titre={t({
          fr: "L'agenda des Trois Frontières",
          de: "Veranstaltungen im Dreiländereck",
          lb: "D'Agenda vum Dräilännereck",
          en: "What's on in the Three Borders",
          es: "La agenda de las Tres Fronteras",
        })}
        intro={t({
          fr: "Concerts, fêtes, expositions, rencontres sportives : les rendez-vous du territoire, d'un côté comme de l'autre de la frontière.",
          de: "Konzerte, Feste, Ausstellungen, Sportbegegnungen: die Termine der Region, diesseits und jenseits der Grenze.",
          lb: "Concerten, Fester, Ausstellungen, Sportsmatcher: d'Rendez-vousen aus der Regioun, op béide Säite vun der Grenz.",
          en: "Concerts, festivals, exhibitions, sporting events: the area's events, on both sides of the border.",
          es: "Conciertos, fiestas, exposiciones, encuentros deportivos: las citas del territorio, a un lado y otro de la frontera.",
        })}
        enfants={
          <>
            <p className="mt-6">
              <Link href="/agenda/proposer" className="btn btn-plein">
                {t({
                  fr: "Publier votre événement",
                  de: "Ihre Veranstaltung veröffentlichen",
                  lb: "Ären Evenement publizéieren",
                  en: "Publish your event",
                  es: "Publicar su evento",
                })}
              </Link>
            </p>
            {tous.length > 0 && (
              <div className="mt-8 space-y-3">
                <Filtres
                  label={t({
                    fr: "Période",
                    de: "Zeitraum",
                    lb: "Zäitraum",
                    en: "Period",
                    es: "Periodo",
                  })}
                  options={periodes.map((p) => ({ valeur: p.valeur, libelle: t(p.libelle) }))}
                  actif={periode}
                  href={(v) => href(v, ville)}
                />
                {villes.length > 1 && (
                  <Filtres
                    label={t({
                      fr: "Ville",
                      de: "Ort",
                      lb: "Uertschaft",
                      en: "Town",
                      es: "Localidad",
                    })}
                    options={[
                      {
                        valeur: "",
                        libelle: t({
                          fr: "Toutes les villes",
                          de: "Alle Orte",
                          lb: "All Uertschaften",
                          en: "All towns",
                          es: "Todas las localidades",
                        }),
                      },
                      ...villes.map((v) => ({ valeur: v, libelle: v })),
                    ]}
                    actif={ville ?? ""}
                    href={(v) => href(periode, v || undefined)}
                  />
                )}
              </div>
            )}
          </>
        }
      />
      <EmplacementPub id="agenda" className="conteneur pt-10 lg:pt-12" />
      <section
        aria-label={t({
          fr: "Événements",
          de: "Veranstaltungen",
          lb: "Evenementer",
          en: "Events",
          es: "Eventos",
        })}
        className="conteneur py-12 lg:py-16"
      >
        {tous.length === 0 ? (
          <EtatVide
            titre={t({
              fr: "Aucun événement annoncé pour le moment.",
              de: "Derzeit sind keine Veranstaltungen angekündigt.",
              lb: "Am Moment sinn keng Evenementer ugekënnegt.",
              en: "No events announced yet.",
              es: "Todavía no hay eventos anunciados.",
            })}
            actions={
              <Link href="/agenda/proposer" className="btn btn-plein">
                {t({
                  fr: "Annoncer un événement",
                  de: "Veranstaltung melden",
                  lb: "Evenement mellen",
                  en: "Announce an event",
                  es: "Anunciar un evento",
                })}
              </Link>
            }
          >
            {t({
              fr: "Associations, communes, organisateurs : envoyez-nous vos rendez-vous, Radio Tripoint les relaie à l'antenne et sur cette page.",
              de: "Vereine, Gemeinden, Veranstalter: Schicken Sie uns Ihre Termine, Radio Tripoint macht sie im Radio und auf dieser Seite bekannt.",
              lb: "Veräiner, Gemengen, Organisateuren: Schéckt eis Är Rendez-vousen, Radio Tripoint mécht se um Radio an op dëser Säit bekannt.",
              en: "Associations, towns, organisers: send us your events and Radio Tripoint will share them on air and on this page.",
              es: "Asociaciones, municipios, organizadores: envíennos sus citas y Radio Tripoint las difundirá en antena y en esta página.",
            })}
          </EtatVide>
        ) : evenements.length === 0 ? (
          <EtatVide
            titre={t({
              fr: "Rien de prévu sur cette période.",
              de: "In diesem Zeitraum ist nichts geplant.",
              lb: "An dësem Zäitraum ass näischt geplangt.",
              en: "Nothing planned for this period.",
              es: "No hay nada previsto en este periodo.",
            })}
            actions={
              <Link href="/agenda" className="btn btn-trait">
                {t({
                  fr: "Voir tout l'agenda",
                  de: "Alle Termine ansehen",
                  lb: "D'ganz Agenda kucken",
                  en: "See all events",
                  es: "Ver toda la agenda",
                })}
              </Link>
            }
          >
            {t({
              fr: "Élargissez la période ou changez de ville.",
              de: "Erweitern Sie den Zeitraum oder wählen Sie einen anderen Ort.",
              lb: "Vergréissert den Zäitraum oder wielt eng aner Uertschaft.",
              en: "Widen the period or choose another town.",
              es: "Amplíe el periodo o cambie de localidad.",
            })}
          </EtatVide>
        ) : (
          <div className="space-y-14">
            {[...parMois.entries()].map(([mois, liste]) => (
              <section key={mois} aria-labelledby={`mois-${mois}`}>
                <h2 id={`mois-${mois}`} className="titre-section capitalize">
                  {mois}
                </h2>
                <ul className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2">
                  {liste.map((e) => (
                    <li key={e.slug}>
                      <EventCard evenement={e} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
