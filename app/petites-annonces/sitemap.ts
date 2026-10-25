import type { MetadataRoute } from "next"
import { annoncesPubliques } from "@/lib/annonces/annonces"
import { categoriesOuvertes, configPublique } from "@/lib/annonces/config"
import { lienAnnonces } from "@/lib/annonces/liens"
import { cheminAnnonce } from "@/lib/annonces/types"

/** Plan du site des annonces (servi à annonces.…/sitemap.xml par le proxy). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [annonces, cfg] = await Promise.all([annoncesPubliques(), configPublique()])
  return [
    { url: lienAnnonces("/"), changeFrequency: "daily", priority: 1 },
    ...categoriesOuvertes(cfg).map((c) => ({
      url: lienAnnonces(`/${c.slug}`),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    { url: lienAnnonces("/regles"), changeFrequency: "monthly", priority: 0.3 },
    ...annonces.map((a) => ({
      url: lienAnnonces(cheminAnnonce(a)),
      lastModified: new Date(a.remonteeLe).toISOString(),
      priority: 0.6,
    })),
  ]
}
