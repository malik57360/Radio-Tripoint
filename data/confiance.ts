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
      en: "President of the CCB3F, mayor of Bouzonville",
      es: "Presidente de la CCB3F, alcalde de Bouzonville",
    },
    note: {
      fr: "A répondu à nos questions sur Radio Tripoint. Un échange riche et inspirant !",
      de: "Hat unsere Fragen auf Radio Tripoint beantwortet. Ein reicher und inspirierender Austausch!",
      lb: "Huet eis Froen op Radio Tripoint beäntwert. En räichen an inspiréierenden Austausch!",
      en: "Answered our questions on Radio Tripoint. A rich and inspiring conversation!",
      es: "Respondió a nuestras preguntas en Radio Tripoint. ¡Un intercambio rico e inspirador!",
    },
    photo: {
      src: "/media/confiance/armel-chabane.webp",
      alt: {
        fr: "Armel Chabane, souriant, pouce levé, devant une bâche Radio Tripoint, avec le message « Merci à Monsieur Armel Chabane d'avoir répondu à nos questions sur Radio Tripoint ».",
        de: "Armel Chabane lächelt mit erhobenem Daumen vor einem Radio-Tripoint-Banner, mit der Botschaft „Merci à Monsieur Armel Chabane“.",
        lb: "Den Armel Chabane laacht mam Daum erop virun enger Radio-Tripoint-Bâche, mam Message „Merci à Monsieur Armel Chabane“.",
        en: "Armel Chabane, smiling with a thumbs-up, in front of a Radio Tripoint banner with the message “Merci à Monsieur Armel Chabane d'avoir répondu à nos questions sur Radio Tripoint”.",
        es: "Armel Chabane, sonriente y con el pulgar hacia arriba, delante de una lona de Radio Tripoint con el mensaje «Merci à Monsieur Armel Chabane d'avoir répondu à nos questions sur Radio Tripoint».",
      },
      largeur: 1000,
      hauteur: 1333,
    },
  },
  {
    nom: "Martin Beziaud",
    role: {
      fr: "Conseiller municipal de Sierck-les-Bains",
      de: "Gemeinderat von Sierck-les-Bains",
      lb: "Gemengerot vu Sierck-les-Bains",
      en: "Municipal councillor of Sierck-les-Bains",
      es: "Concejal de Sierck-les-Bains",
    },
    note: {
      fr: "A répondu à nos questions sur Radio Tripoint.",
      de: "Hat unsere Fragen auf Radio Tripoint beantwortet.",
      lb: "Huet eis Froen op Radio Tripoint beäntwert.",
      en: "Answered our questions on Radio Tripoint.",
      es: "Respondió a nuestras preguntas en Radio Tripoint.",
    },
    photo: {
      src: "/media/confiance/martin-beziaud.webp",
      alt: {
        fr: "Martin Beziaud, en chemise blanche, devant le mur aux logos de Radio Tripoint.",
        de: "Martin Beziaud im weißen Hemd vor der Wand mit den Radio-Tripoint-Logos.",
        lb: "De Martin Beziaud am wäissen Hiem virun der Mauer mat de Radio-Tripoint-Logoen.",
        en: "Martin Beziaud, in a white shirt, in front of the wall of Radio Tripoint logos.",
        es: "Martin Beziaud, con camisa blanca, delante del muro con los logotipos de Radio Tripoint.",
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
      en: "President of the Parish Council (Conseil de Fabrique)",
      es: "Presidenta del Consejo de Fábrica parroquial (Conseil de Fabrique)",
    },
    photo: {
      src: "/media/confiance/anne-marie-garandeau.webp",
      alt: {
        fr: "Anne-Marie Garandeau, souriante, dans une église aux vitraux colorés, à côté d'un grand tableau aux couleurs vives représentant le Christ, entouré de médaillons peints.",
        de: "Anne-Marie Garandeau lächelt in einer Kirche mit bunten Fenstern neben einem großen, farbenfrohen Christusbild, umgeben von gemalten Medaillons.",
        lb: "D'Anne-Marie Garandeau laacht an enger Kierch mat faarwege Fënsteren nieft engem grousse, faarwegen Christusbild mat gemoolte Medaillonen ronderëm.",
        en: "Anne-Marie Garandeau, smiling, in a church with colourful stained-glass windows, next to a large brightly coloured painting of Christ surrounded by painted medallions.",
        es: "Anne-Marie Garandeau, sonriente, en una iglesia con vidrieras de colores, junto a un gran cuadro de colores vivos que representa a Cristo, rodeado de medallones pintados.",
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
      en: "Second Vice-President of the Communauté de Communes Bouzonvillois Trois Frontières",
      es: "Segunda vicepresidenta de la Communauté de Communes Bouzonvillois Trois Frontières",
    },
    note: {
      fr: "Invitée de notre émission « À vous la parole », épisode diffusé à partir du vendredi 19 juin 2026.",
      de: "Gast unserer Sendung „À vous la parole“, Folge verfügbar ab Freitag, 19. Juni 2026.",
      lb: "Invitée vun eiser Sendung „À vous la parole“, Episod disponibel vum Freideg, 19. Juni 2026 un.",
      en: "Guest on our programme “À vous la parole”, episode broadcast from Friday 19 June 2026.",
      es: "Invitada de nuestro programa «À vous la parole», episodio emitido a partir del viernes 19 de junio de 2026.",
    },
    photo: {
      src: "/media/confiance/frederique-wehr.webp",
      alt: {
        fr: "Frédérique Wehr, souriante, en chemisier blanc, adossée à un mur de pierres anciennes.",
        de: "Frédérique Wehr lächelt in weißer Bluse, an eine alte Steinmauer gelehnt.",
        lb: "D'Frédérique Wehr laacht an enger wäisser Blus, un eng al Steemauer ugeluecht.",
        en: "Frédérique Wehr, smiling, in a white blouse, leaning against an old stone wall.",
        es: "Frédérique Wehr, sonriente, con blusa blanca, apoyada en un muro de piedras antiguas.",
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
      en: "Mayor of Sierck-les-Bains and First Vice-President of the CCB3F",
      es: "Alcaldesa de Sierck-les-Bains y primera vicepresidenta de la CCB3F",
    },
    note: {
      fr: "Invitée de notre émission « À vous la parole ».",
      de: "Gast unserer Sendung „À vous la parole“.",
      lb: "Invitée vun eiser Sendung „À vous la parole“.",
      en: "Guest on our programme “À vous la parole”.",
      es: "Invitada de nuestro programa «À vous la parole».",
    },
    photo: {
      src: "/media/confiance/helen-hammond.webp",
      alt: {
        fr: "Helen Hammond à son bureau de la mairie, devant les drapeaux européen et français, avec au premier plan un vitrail aux armoiries de Sierck-les-Bains.",
        de: "Helen Hammond an ihrem Schreibtisch im Rathaus vor der Europa- und der Frankreichflagge, im Vordergrund ein Glasbild mit dem Wappen von Sierck-les-Bains.",
        lb: "D'Helen Hammond un hirem Büro an der Mairie virun der europäescher an der franséischer Fändel, am Virdergrond e Glasbild mam Wope vu Sierck-les-Bains.",
        en: "Helen Hammond at her desk in the town hall, in front of the European and French flags, with a stained-glass panel bearing the coat of arms of Sierck-les-Bains in the foreground.",
        es: "Helen Hammond en su despacho del ayuntamiento, delante de las banderas europea y francesa, con una vidriera con el escudo de Sierck-les-Bains en primer plano.",
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
      en: "Mayor (Bürgermeister) of the municipality of Perl",
      es: "Alcalde (Bürgermeister) del municipio de Perl",
    },
    photo: {
      src: "/media/confiance/ralf-uhlenbruch.webp",
      alt: {
        fr: "Portrait de Ralf Uhlenbruch, souriant, en veste grise et chemise à petits motifs, sur fond gris.",
        de: "Porträt von Ralf Uhlenbruch, lächelnd, in grauem Sakko und gemustertem Hemd vor grauem Hintergrund.",
        lb: "Portrait vum Ralf Uhlenbruch, laachend, a groer Jackett a gemusterten Hiem virun engem groen Hannergrond.",
        en: "Portrait of Ralf Uhlenbruch, smiling, in a grey jacket and a small-patterned shirt, against a grey background.",
        es: "Retrato de Ralf Uhlenbruch, sonriente, con chaqueta gris y camisa de pequeños motivos, sobre fondo gris.",
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
      en: "Mayor of Schengen",
      es: "Alcalde de Schengen",
    },
    photo: {
      src: "/media/confiance/michel-gloden.webp",
      alt: {
        fr: "Portrait de Michel Gloden, souriant, en costume sombre, chemise blanche et cravate bleu clair à pois.",
        de: "Porträt von Michel Gloden, lächelnd, in dunklem Anzug, weißem Hemd und hellblauer gepunkteter Krawatte.",
        lb: "Portrait vum Michel Gloden, laachend, an engem donkelen Kostüm, wäissem Hiem an enger hellbloer gepunkter Krawatt.",
        en: "Portrait of Michel Gloden, smiling, in a dark suit, white shirt and light blue polka-dot tie.",
        es: "Retrato de Michel Gloden, sonriente, con traje oscuro, camisa blanca y corbata azul claro de lunares.",
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
      en: "Deputy Mayor of Thionville, youth and digital affairs",
      es: "Teniente de alcalde de Thionville, juventud y asuntos digitales",
    },
    photo: {
      src: "/media/confiance/lucas-grandjean.webp",
      alt: {
        fr: "Lucas Grandjean, en chemise blanche, debout devant le stand de Radio Tripoint en plein air, à côté du kakémono de la radio.",
        de: "Lucas Grandjean im weißen Hemd vor dem Radio-Tripoint-Stand im Freien, neben dem Roll-up des Senders.",
        lb: "De Lucas Grandjean an engem wäissen Hiem virum Radio-Tripoint-Stand dobaussen, nieft dem Roll-up vum Radio.",
        en: "Lucas Grandjean, in a white shirt, standing in front of the Radio Tripoint outdoor stand, next to the radio's roll-up banner.",
        es: "Lucas Grandjean, con camisa blanca, de pie delante del estand de Radio Tripoint al aire libre, junto al roll-up de la radio.",
      },
      largeur: 1000,
      hauteur: 1333,
    },
  },
  {
    nom: "Association Une Rose Un Espoir",
    role: {
      fr: "Sierck-les-Bains",
      de: "Sierck-les-Bains",
      lb: "Sierck-les-Bains",
      en: "Sierck-les-Bains",
      es: "Sierck-les-Bains",
    },
    photo: {
      src: "/media/confiance/une-rose-un-espoir-sierck.webp",
      alt: {
        fr: "Deux représentants de l'association Une Rose Un Espoir de Sierck-les-Bains, souriants, devant le mur aux logos de Radio Tripoint.",
        de: "Zwei Vertreter des Vereins Une Rose Un Espoir aus Sierck-les-Bains, lächelnd vor der Logowand von Radio Tripoint.",
        lb: "Zwee Vertrieder vum Veräin Une Rose Un Espoir vu Sierck-les-Bains, laachend virun der Logowand vu Radio Tripoint.",
        en: "Two representatives of the Une Rose Un Espoir association from Sierck-les-Bains, smiling, in front of the Radio Tripoint logo wall.",
        es: "Dos representantes de la asociación Une Rose Un Espoir de Sierck-les-Bains, sonrientes, delante del muro con los logotipos de Radio Tripoint.",
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
