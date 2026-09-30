import type { Metadata } from "next"
import { site } from "@/config/site"
import {
  choisir,
  codesLangues,
  langues,
  lienLangue,
  type Langue,
  type Trad,
} from "@/lib/i18n/langues"
import { langue as langueCourante } from "@/lib/i18n/serveur"

type Texte = string | Trad

interface Options {
  titre: Texte
  description: Texte
  /** Chemin sans préfixe de langue ("/agenda"). */
  chemin: string
  /** Titre sans le suffixe « | Radio Tripoint ». */
  absolu?: boolean
  image?: { src: string; alt: string; largeur?: number; hauteur?: number }
  type?: "website" | "article"
  publieLe?: string
  modifieLe?: string
  section?: string
  motsCles?: string[]
  noindex?: boolean
}

export const urlAbsolue = (chemin: string) =>
  `${site.url}${chemin.startsWith("/") ? chemin : `/${chemin}`}`

const texte = (x: Texte, l: Langue) => (typeof x === "string" ? x : choisir(x, l))

/** Les trois versions d'une page, pour hreflang. */
export function alternatesLangues(chemin: string) {
  return {
    ...Object.fromEntries(langues.map((l) => [codesLangues[l].html, lienLangue(chemin, l)])),
    "x-default": chemin,
  }
}

/**
 * Metadata complète d'une page, dans la langue en cours : canonical,
 * hreflang, Open Graph, carte X.
 */
export async function metadataPage(o: Options): Promise<Metadata> {
  const l = await langueCourante()
  const titre = texte(o.titre, l)
  const description = texte(o.description, l)
  const url = lienLangue(o.chemin, l)
  const images = o.image
    ? [{ url: o.image.src, alt: o.image.alt, width: o.image.largeur, height: o.image.hauteur }]
    : undefined
  return {
    title: o.absolu ? { absolute: titre } : titre,
    description,
    keywords: o.motsCles,
    alternates: { canonical: url, languages: alternatesLangues(o.chemin) },
    openGraph: {
      type: o.type ?? "website",
      locale: codesLangues[l].og,
      siteName: site.nomOfficiel,
      url,
      title: titre,
      description,
      ...(images ? { images } : {}),
      ...(o.type === "article"
        ? {
            ...(o.publieLe ? { publishedTime: o.publieLe } : {}),
            ...((o.modifieLe ?? o.publieLe) ? { modifiedTime: o.modifieLe ?? o.publieLe } : {}),
            section: o.section,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titre,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    ...(o.noindex ? { robots: { index: false, follow: true } } : {}),
  }
}
