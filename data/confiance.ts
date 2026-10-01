import type { Trad } from "@/lib/i18n/langues"

/**
 * Page « Ils nous font confiance ». Uniquement les personnes et structures
 * que la rédaction a nommées, avec les titres qu'elle a donnés : rien
 * n'est ajouté ni déduit.
 */
export interface Personne {
  nom: string
  role: Trad
  /** Ce que la personne a fait avec la radio, quand la rédaction l'a précisé. */
  note?: Trad
  photo: { src: string; alt: Trad; largeur: number; hauteur: number }
}

export interface Structure {
  nom: string
  logo: { src: string; largeur: number; hauteur: number }
  site?: string
}

export const personnes: Personne[] = [
  {
    nom: "Armel Chabane",
    role: {
      fr: "Président de la CCB3F, maire de Bouzonville",
      de: "Präsident der CCB3F, Bürgermeister von Bouzonville",
      lb: "President vun der CCB3F, Buergermeeschter vu Bouzonville",
    },
    note: {
      fr: "A répondu à nos questions sur Radio Tripoint. Un échange riche et inspirant !",
      de: "Hat unsere Fragen auf Radio Tripoint beantwortet. Ein reicher und inspirierender Austausch!",
      lb: "Huet eis Froen op Radio Tripoint beäntwert. En räichen an inspiréierenden Austausch!",
    },
    photo: {
      src: "/media/confiance/armel-chabane.webp",
      alt: {
        fr: "Armel Chabane, souriant, pouce levé, devant une bâche Radio Tripoint, avec le message « Merci à Monsieur Armel Chabane d'avoir répondu à nos questions sur Radio Tripoint ».",
        de: "Armel Chabane lächelt mit erhobenem Daumen vor einem Radio-Tripoint-Banner, mit der Botschaft „Merci à Monsieur Armel Chabane“.",
        lb: "Den Armel Chabane laacht mam Daum erop virun enger Radio-Tripoint-Bâche, mam Message „Merci à Monsieur Armel Chabane“.",
      },
      largeur: 1000,
      hauteur: 1333,
    },
  },
  {
    nom: "Anne-Marie Garandeau",
    role: {
      fr: "Présidente du Conseil de Fabrique",
      de: "Vorsitzende des Kirchenfabrikrats (Conseil de Fabrique)",
      lb: "Presidentin vun der Kierchefabréck (Conseil de Fabrique)",
    },
    photo: {
      src: "/media/confiance/anne-marie-garandeau.webp",
      alt: {
        fr: "Anne-Marie Garandeau, souriante, dans une église aux vitraux colorés, à côté d'un grand tableau aux couleurs vives représentant le Christ, entouré de médaillons peints.",
        de: "Anne-Marie Garandeau lächelt in einer Kirche mit bunten Fenstern neben einem großen, farbenfrohen Christusbild, umgeben von gemalten Medaillons.",
        lb: "D'Anne-Marie Garandeau laacht an enger Kierch mat faarwege Fënsteren nieft engem grousse, faarwegen Christusbild mat gemoolte Medaillonen ronderëm.",
      },
      largeur: 1000,
      hauteur: 1333,
    },
  },
]

export const structures: Structure[] = [
  {
    nom: "Château de Sierck",
    logo: { src: "/media/confiance/chateau-de-sierck.webp", largeur: 1179, hauteur: 303 },
    site: "https://www.chateau-sierck.com/",
  },
  {
    nom: "Communauté de Communes Bouzonvillois Trois Frontières (CCB3F)",
    logo: { src: "/media/confiance/ccb3f.webp", largeur: 225, hauteur: 225 },
  },
]
