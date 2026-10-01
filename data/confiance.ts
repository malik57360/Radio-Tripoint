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
  {
    nom: "Frédérique Wehr",
    role: {
      fr: "Deuxième vice-présidente de la Communauté de Communes Bouzonvillois Trois Frontières",
      de: "Zweite Vizepräsidentin der Communauté de Communes Bouzonvillois Trois Frontières",
      lb: "Zweet Vizepresidentin vun der Communauté de Communes Bouzonvillois Trois Frontières",
    },
    note: {
      fr: "Invitée de notre émission « À vous la parole », épisode diffusé à partir du vendredi 19 juin 2026.",
      de: "Gast unserer Sendung „À vous la parole“, Folge verfügbar ab Freitag, 19. Juni 2026.",
      lb: "Invitée vun eiser Sendung „À vous la parole“, Episod disponibel vum Freideg, 19. Juni 2026 un.",
    },
    photo: {
      src: "/media/confiance/frederique-wehr.webp",
      alt: {
        fr: "Frédérique Wehr, souriante, en chemisier blanc, adossée à un mur de pierres anciennes.",
        de: "Frédérique Wehr lächelt in weißer Bluse, an eine alte Steinmauer gelehnt.",
        lb: "D'Frédérique Wehr laacht an enger wäisser Blus, un eng al Steemauer ugeluecht.",
      },
      largeur: 1000,
      hauteur: 1333,
    },
  },
  {
    nom: "Helen Hammond",
    role: {
      fr: "Maire de Sierck-les-Bains et première vice-présidente de la CCB3F",
      de: "Bürgermeisterin von Sierck-les-Bains und erste Vizepräsidentin der CCB3F",
      lb: "Buergermeeschtesch vu Sierck-les-Bains an éischt Vizepresidentin vun der CCB3F",
    },
    note: {
      fr: "Invitée de notre émission « À vous la parole ».",
      de: "Gast unserer Sendung „À vous la parole“.",
      lb: "Invitée vun eiser Sendung „À vous la parole“.",
    },
    photo: {
      src: "/media/confiance/helen-hammond.webp",
      alt: {
        fr: "Helen Hammond à son bureau de la mairie, devant les drapeaux européen et français, avec au premier plan un vitrail aux armoiries de Sierck-les-Bains.",
        de: "Helen Hammond an ihrem Schreibtisch im Rathaus vor der Europa- und der Frankreichflagge, im Vordergrund ein Glasbild mit dem Wappen von Sierck-les-Bains.",
        lb: "D'Helen Hammond un hirem Büro an der Mairie virun der europäescher an der franséischer Fändel, am Virdergrond e Glasbild mam Wope vu Sierck-les-Bains.",
      },
      largeur: 1000,
      hauteur: 1333,
    },
  },
  {
    nom: "Ralf Uhlenbruch",
    role: {
      fr: "Maire (Bürgermeister) de la commune de Perl",
      de: "Bürgermeister der Gemeinde Perl",
      lb: "Buergermeeschter vun der Gemeng Perl",
    },
    photo: {
      src: "/media/confiance/ralf-uhlenbruch.webp",
      alt: {
        fr: "Portrait de Ralf Uhlenbruch, souriant, en veste grise et chemise à petits motifs, sur fond gris.",
        de: "Porträt von Ralf Uhlenbruch, lächelnd, in grauem Sakko und gemustertem Hemd vor grauem Hintergrund.",
        lb: "Portrait vum Ralf Uhlenbruch, laachend, a groer Jackett a gemusterten Hiem virun engem groen Hannergrond.",
      },
      largeur: 600,
      hauteur: 800,
    },
  },
  {
    nom: "Michel Gloden",
    role: {
      fr: "Maire de Schengen",
      de: "Bürgermeister von Schengen",
      lb: "Buergermeeschter vu Schengen",
    },
    photo: {
      src: "/media/confiance/michel-gloden.webp",
      alt: {
        fr: "Portrait de Michel Gloden, souriant, en costume sombre, chemise blanche et cravate bleu clair à pois.",
        de: "Porträt von Michel Gloden, lächelnd, in dunklem Anzug, weißem Hemd und hellblauer gepunkteter Krawatte.",
        lb: "Portrait vum Michel Gloden, laachend, an engem donkelen Kostüm, wäissem Hiem an enger hellbloer gepunkter Krawatt.",
      },
      largeur: 600,
      hauteur: 800,
    },
  },
  {
    nom: "Lucas Grandjean",
    role: {
      fr: "Adjoint au maire de Thionville, jeunesse et numérique",
      de: "Beigeordneter des Bürgermeisters von Thionville, Jugend und Digitales",
      lb: "Schäffen vun Thionville, Jugend an Digitales",
    },
    photo: {
      src: "/media/confiance/lucas-grandjean.webp",
      alt: {
        fr: "Lucas Grandjean, en chemise blanche, debout devant le stand de Radio Tripoint en plein air, à côté du kakémono de la radio.",
        de: "Lucas Grandjean im weißen Hemd vor dem Radio-Tripoint-Stand im Freien, neben dem Roll-up des Senders.",
        lb: "De Lucas Grandjean an engem wäissen Hiem virum Radio-Tripoint-Stand dobaussen, nieft dem Roll-up vum Radio.",
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
    site: "https://www.ccb3f.fr/",
  },
]
