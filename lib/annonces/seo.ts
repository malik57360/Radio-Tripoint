import type { Metadata } from "next"

/**
 * Métadonnées d'une page du site des annonces. Les adresses sont relatives :
 * le layout fixe la base (annonces.radio-tripoint-officiel.fr).
 */
export function metaAnnonces(o: {
  titre: string
  description: string
  /** Chemin sur le site des annonces (« /emploi »). */
  chemin: string
  image?: { src: string; alt: string; largeur?: number; hauteur?: number }
  noindex?: boolean
}): Metadata {
  const images = o.image
    ? [{ url: o.image.src, alt: o.image.alt, width: o.image.largeur, height: o.image.hauteur }]
    : undefined
  return {
    title: o.titre,
    description: o.description,
    alternates: { canonical: o.chemin },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: "Les Petites Annonces du Tripoint",
      url: o.chemin,
      title: o.titre,
      description: o.description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: o.titre,
      description: o.description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    ...(o.noindex ? { robots: { index: false, follow: true } } : {}),
  }
}
