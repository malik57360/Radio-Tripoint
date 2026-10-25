import type { MetadataRoute } from "next"
import { site } from "@/config/site"
import { categories, ordreCategories } from "@/data/categories"
import { tousArticles } from "@/lib/contenu/articles"
import { listerEmissions } from "@/lib/contenu/emissions"
import { tousEvenements } from "@/lib/contenu/evenements"
import { listerEpisodes } from "@/lib/contenu/podcasts"
import { codesLangues, langues, lienLangue } from "@/lib/i18n/langues"
import { annoncesPubliques } from "@/lib/annonces/annonces"
import { categoriesOuvertes, configPublique } from "@/lib/annonces/config"
import { cheminAnnonce } from "@/lib/annonces/types"

/**
 * Sitemap dynamique, dans toutes les langues du site : chaque page y figure en
 * français, allemand, luxembourgeois, anglais et espagnol, avec ses
 * équivalents (hreflang).
 * Les contenus de démonstration en sont exclus.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = (p: string) => `${site.url}${p}`
  const [articles, emissions, episodes, evenements, annonces, cfgAnnonces] = await Promise.all([
    tousArticles(),
    listerEmissions(),
    listerEpisodes(),
    tousEvenements(),
    annoncesPubliques(),
    configPublique(),
  ])
  const statiques: MetadataRoute.Sitemap = [
    { url: u("/"), changeFrequency: "daily", priority: 1 },
    ...ordreCategories.map((c) => ({
      url: u(categories[c].chemin),
      changeFrequency: "daily" as const,
      priority: c === "actualites" ? 0.9 : 0.7,
    })),
    { url: u("/emissions"), changeFrequency: "weekly", priority: 0.8 },
    { url: u("/podcasts"), changeFrequency: "daily", priority: 0.8 },
    { url: u("/agenda"), changeFrequency: "daily", priority: 0.8 },
    { url: u("/meteo"), changeFrequency: "hourly", priority: 0.6 },
    { url: u("/horoscope"), changeFrequency: "daily", priority: 0.6 },
    { url: u("/publicite"), changeFrequency: "monthly", priority: 0.6 },
    { url: u("/a-propos"), changeFrequency: "monthly", priority: 0.5 },
    { url: u("/ils-nous-font-confiance"), changeFrequency: "monthly", priority: 0.5 },
    { url: u("/tripo"), changeFrequency: "monthly", priority: 0.5 },
    { url: u("/soutenir"), changeFrequency: "weekly", priority: 0.5 },
    { url: u("/contact"), changeFrequency: "yearly", priority: 0.5 },
    { url: u("/soumettre-une-information"), changeFrequency: "yearly", priority: 0.4 },
    { url: u("/mentions-legales"), changeFrequency: "yearly", priority: 0.1 },
    { url: u("/politique-confidentialite"), changeFrequency: "yearly", priority: 0.1 },
  ]
  const pages: MetadataRoute.Sitemap = [
    ...statiques,
    ...articles
      .filter((a) => !a.demo)
      .map((a) => ({
        url: u(`/actualites/${a.slug}`),
        ...((a.modifieLe ?? a.publieLe) ? { lastModified: a.modifieLe ?? a.publieLe } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...emissions.map((e) => ({
      url: u(`/emissions/${e.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...episodes
      .filter((e) => !e.demo)
      .map((e) => ({
        url: u(`/podcasts/${e.slug}`),
        ...(e.publieLe ? { lastModified: e.publieLe } : {}),
        priority: 0.6,
      })),
    ...evenements
      .filter((e) => !e.demo)
      .map((e) => ({ url: u(`/agenda/${e.slug}`), lastModified: e.debut, priority: 0.6 })),
  ]
  // Petites annonces : en français seulement pour l'instant, donc sans équivalents.
  const petitesAnnonces: MetadataRoute.Sitemap = [
    { url: u("/annonces"), changeFrequency: "daily", priority: 0.8 },
    ...categoriesOuvertes(cfgAnnonces).map((c) => ({
      url: u(`/annonces/${c.slug}`),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    { url: u("/annonces/regles"), changeFrequency: "monthly", priority: 0.3 },
    ...annonces.map((a) => ({
      url: u(cheminAnnonce(a)),
      lastModified: new Date(a.remonteeLe).toISOString(),
      priority: 0.5,
    })),
  ]
  return [
    ...pages.flatMap((p) => {
      const chemin = p.url.slice(site.url.length) || "/"
      const languages = Object.fromEntries(
        langues.map((l) => [codesLangues[l].html, u(lienLangue(chemin, l))]),
      )
      return langues.map((l) => ({
        ...p,
        url: u(lienLangue(chemin, l)),
        alternates: { languages },
      }))
    }),
    ...petitesAnnonces,
  ]
}
