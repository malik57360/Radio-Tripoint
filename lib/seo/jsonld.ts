import { site } from "@/config/site"
import { radioConfig } from "@/config/radioConfig"
import { reseauxActifs } from "@/config/socialLinks"
import type { Article } from "@/types/article"
import type { Evenement } from "@/types/event"
import type { Episode } from "@/types/podcast"
import type { Emission } from "@/types/show"
import { categoriesLangue } from "@/lib/contenu/localiser"
import { choisir, codesLangues, lienLangue, type Langue } from "@/lib/i18n/langues"
import { dureeIso } from "@/lib/utils/dates"
import { urlAbsolue } from "./metadata"

const ORG_ID = `${site.url}/#organisation`
const WEB_ID = `${site.url}/#site`

const adresse = {
  "@type": "PostalAddress",
  streetAddress: site.contact.adresse.rue,
  postalCode: site.contact.adresse.codePostal,
  addressLocality: site.contact.adresse.ville,
  addressRegion: "Moselle, Grand Est",
  addressCountry: site.contact.adresse.pays,
}

/** URL absolue d'une page dans une langue. */
const url = (chemin: string, l: Langue) => urlAbsolue(lienLangue(chemin, l))

export function jsonLdOrganisation(l: Langue = "fr") {
  const sameAs = reseauxActifs().map((r) => r.url)
  if (radioConfig.radiokingUrl) sameAs.push(radioConfig.radiokingUrl)
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["RadioStation", "NewsMediaOrganization"],
        "@id": ORG_ID,
        name: site.nomOfficiel,
        alternateName: site.nom,
        url: site.url,
        description: choisir(site.description, l),
        telephone: site.contact.telephoneE164,
        email: site.contact.email,
        address: adresse,
        areaServed: [
          { "@type": "AdministrativeArea", name: "Moselle" },
          { "@type": "Country", name: "France" },
          { "@type": "Country", name: "Luxembourg" },
          { "@type": "AdministrativeArea", name: "Sarre" },
          { "@type": "Place", name: "Grande Région" },
        ],
        ...(site.visuels.logo ? { logo: urlAbsolue(site.visuels.logo) } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": WEB_ID,
        url: site.url,
        name: site.nomOfficiel,
        inLanguage: ["fr", "de", "lb"],
        publisher: { "@id": ORG_ID },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${url("/recherche", l)}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  }
}

export function jsonLdFilAriane(elements: { nom: string; chemin: string }[], l: Langue = "fr") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: elements.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.nom,
      item: url(e.chemin, l),
    })),
  }
}

export function jsonLdArticle(a: Article, l: Langue = "fr") {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.titre,
    description: a.chapeau,
    ...(a.publieLe ? { datePublished: a.publieLe } : {}),
    ...((a.modifieLe ?? a.publieLe) ? { dateModified: a.modifieLe ?? a.publieLe } : {}),
    inLanguage: codesLangues[l].html,
    articleSection: categoriesLangue(l)[a.categorie].nom,
    mainEntityOfPage: url(`/actualites/${a.slug}`, l),
    image: a.visuel
      ? [urlAbsolue(a.visuel.src)]
      : [urlAbsolue(`/actualites/${a.slug}/opengraph-image`)],
    author: a.auteur ? { "@type": "Person", name: a.auteur } : { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(a.lieux?.length
      ? { contentLocation: a.lieux.map((lieu) => ({ "@type": "Place", name: lieu })) }
      : {}),
  }
}

export function jsonLdEvenement(e: Evenement, l: Langue = "fr") {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.titre,
    description: e.description,
    startDate: e.debut,
    ...(e.fin ? { endDate: e.fin } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: e.lieu,
      address: {
        "@type": "PostalAddress",
        streetAddress: e.adresse,
        addressLocality: e.ville,
        addressCountry: e.pays,
      },
    },
    ...(e.organisateur ? { organizer: { "@type": "Organization", name: e.organisateur } } : {}),
    ...(e.visuel ? { image: [urlAbsolue(e.visuel.src)] } : {}),
    ...(e.gratuit ? { isAccessibleForFree: true } : {}),
    url: url(`/agenda/${e.slug}`, l),
  }
}

export function jsonLdEpisode(ep: Episode, emission?: Emission | null, l: Langue = "fr") {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: ep.titre,
    description: ep.description,
    ...(ep.publieLe ? { datePublished: ep.publieLe } : {}),
    timeRequired: dureeIso(ep.duree),
    url: url(`/podcasts/${ep.slug}`, l),
    associatedMedia: {
      "@type": "MediaObject",
      contentUrl: ep.audioUrl.startsWith("http") ? ep.audioUrl : urlAbsolue(ep.audioUrl),
    },
    ...(emission
      ? {
          partOfSeries: {
            "@type": "RadioSeries",
            name: emission.nom,
            url: url(`/emissions/${emission.slug}`, l),
          },
        }
      : {}),
    publisher: { "@id": ORG_ID },
  }
}

export function jsonLdEmission(e: Emission, l: Langue = "fr") {
  return {
    "@context": "https://schema.org",
    "@type": "RadioSeries",
    name: e.nom,
    ...(e.accroche || e.presentation ? { description: e.presentation ?? e.accroche } : {}),
    genre: e.thematique,
    url: url(`/emissions/${e.slug}`, l),
    productionCompany: { "@id": ORG_ID },
    ...(e.animateurs?.length
      ? { actor: e.animateurs.map((n) => ({ "@type": "Person", name: n })) }
      : {}),
  }
}
