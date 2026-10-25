import "server-only"
import { metadataPage } from "@/lib/seo/metadata"

/**
 * Métadonnées des pages d'annonces : en français seulement pour l'instant,
 * donc sans versions dans les autres langues (hreflang) — elles
 * renvoieraient vers la page française.
 */
export async function metaAnnonces(o: Parameters<typeof metadataPage>[0]) {
  const m = await metadataPage(o)
  return { ...m, alternates: { canonical: m.alternates?.canonical } }
}
