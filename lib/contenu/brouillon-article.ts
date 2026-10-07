import type { Article } from "@/types/article"

/** Photo déjà en ligne, telle que le formulaire du tableau de bord la manipule. */
export interface PhotoBrouillon {
  url: string
  largeur: number
  hauteur: number
  legende: string
  credit: string
}

/** Un article du tableau de bord remis sous forme de formulaire (bouton « Modifier »). */
export interface Brouillon {
  slug: string
  titre: string
  chapeau: string
  categorie: string
  auteur: string
  lieux: string
  texte: string
  une: boolean
  photos: PhotoBrouillon[]
}

/**
 * Article → formulaire : l'inverse de la mise en forme faite à la publication
 * (versCorps dans app/direction/(espace)/articles/actions.ts). Chaque photo du
 * texte redevient un repère « [photo n] » à sa place exacte : enregistrer sans
 * rien toucher redonne le même article.
 */
export function versBrouillon(a: Article): Brouillon {
  const photos: PhotoBrouillon[] = []
  if (a.visuel)
    photos.push({
      url: a.visuel.src,
      largeur: a.visuel.largeur,
      hauteur: a.visuel.hauteur,
      // Sans légende, le texte alternatif de la photo principale est le titre.
      legende: a.visuel.alt !== a.titre ? a.visuel.alt : "",
      credit: a.visuel.credit ?? "",
    })
  const morceaux: string[] = []
  for (const b of a.corps) {
    if (b.type === "paragraphe") morceaux.push(b.texte)
    else if (b.type === "intertitre") morceaux.push(`## ${b.texte}`)
    else if (b.type === "citation")
      morceaux.push(`> ${b.texte}${b.auteur ? `\n— ${b.auteur}` : ""}`)
    else if (b.type === "liste") morceaux.push(b.elements.map((e) => `- ${e}`).join("\n"))
    else {
      photos.push({
        url: b.visuel.src,
        largeur: b.visuel.largeur,
        hauteur: b.visuel.hauteur,
        legende: b.legende ?? "",
        credit: b.visuel.credit ?? "",
      })
      morceaux.push(`[photo ${photos.length}]`)
    }
  }
  return {
    slug: a.slug,
    titre: a.titre,
    chapeau: a.chapeau,
    categorie: a.categorie,
    auteur: a.auteur ?? "",
    lieux: (a.lieux ?? []).join(", "),
    texte: morceaux.join("\n\n"),
    une: Boolean(a.une),
    photos,
  }
}
