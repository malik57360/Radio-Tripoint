import type { Article } from "@/types/article"

/**
 * Articles de la rubrique « actu-people » repris de l'ancien site Webador
 * (texte intégral, sans les photos). L'ancien site n'affichait pas de date :
 * `ordre` reprend le rang d'apparition (1 = le plus récent).
 */
export const actuPeople: Article[] = [
  // Source : https://www.radio-tripoint-officiel.fr/actu-people
  {
    slug: "le-dj-francais-kavinsky-est-decede-a-l-age-de-50-ans",
    titre: "Le DJ français Kavinsky est décédé à l’âge de 50 ans.",
    chapeau: "Le monde de la musique électronique est en deuil.",
    categorie: "actu-people",
    ordre: 30,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Le monde de la musique électronique est en deuil. Kavinsky, de son vrai nom Vincent Belorgey, est décédé à l’âge de 50 ans. L’artiste a été retrouvé sans vie à son domicile parisien. Une enquête a été ouverte pour déterminer les circonstances exactes de son décès, mais les premiers éléments ne révèlent aucun signe d’intervention extérieure.",
      },
      {
        type: "paragraphe",
        texte:
          "Figure emblématique de la scène électro française, Kavinsky avait conquis un public international grâce à son titre « Nightcall », rendu célèbre par le film Drive en 2011. Plus récemment, il avait marqué les esprits lors de sa prestation à la cérémonie de clôture des Jeux olympiques de Paris 2024.",
      },
      {
        type: "paragraphe",
        texte:
          "Depuis l’annonce de son décès, de nombreux artistes et personnalités, dont David Guetta, The Weeknd et le président Emmanuel Macron, lui ont rendu hommage, saluant l’héritage musical d’un artiste qui a profondément marqué la scène électro française et internationale.",
      },
      {
        type: "paragraphe",
        texte:
          "🎧 Radio Tripoint adresse ses pensées à sa famille, à ses proches et à ses nombreux fans.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actu-people
  {
    slug: "sean-diddy-combs-place-a-l-isolement-apres-une-bagarre-en-prison",
    titre: "Sean “Diddy” Combs placé à l’isolement après une bagarre en prison.",
    chapeau: "Nouveau rebondissement dans l’affaire Sean “Diddy” Combs.",
    categorie: "actu-people",
    ordre: 33,
    corps: [
      { type: "paragraphe", texte: "Nouveau rebondissement dans l’affaire Sean “Diddy” Combs." },
      {
        type: "paragraphe",
        texte:
          "Selon plusieurs médias américains, le célèbre rappeur et producteur aurait été impliqué cette semaine dans une altercation avec un autre détenu au sein de la prison fédérale de Fort Dix, dans le New Jersey.",
      },
      {
        type: "paragraphe",
        texte:
          "D’après les premiers éléments, un autre prisonnier aurait provoqué verbalement Diddy avant que la situation ne dégénère en bagarre. Les surveillants seraient intervenus rapidement pour mettre fin à l’incident. À la suite de cette altercation, Sean Combs aurait été placé à l’isolement disciplinaire, une mesure classique utilisée par l’administration pénitentiaire après ce type d’événement.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour le moment, les autorités n’ont pas confirmé officiellement les circonstances précises de cette bagarre et n’ont pas indiqué combien de temps le rappeur restera à l’isolement. Elles rappellent qu’elles ne communiquent pas d’informations détaillées concernant les détenus.",
      },
      {
        type: "paragraphe",
        texte:
          "Aucune information ne fait état de blessures graves et l’on ignore encore si cet incident pourrait avoir des conséquences sur sa date de libération, actuellement prévue pour février 2028.",
      },
      {
        type: "paragraphe",
        texte:
          "Une nouvelle affaire qui continue d’alimenter l’actualité autour de l’ancien patron de Bad Boy Records, dont le parcours judiciaire reste suivi de près par les médias du monde entier.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actu-people
  {
    slug: "patrick-bruel-une-legende-de-la-chanson-francaise-face-a-une-periode-difficile",
    titre: "Patrick Bruel : une légende de la chanson française face à une période difficile.",
    chapeau:
      "Figure incontournable de la chanson française depuis les années 1980, Patrick Bruel a marqué plusieurs générations avec des titres devenus cultes comme Alors regarde, Casser la voix ou encore Place des grands hommes.",
    categorie: "actu-people",
    ordre: 62,
    auteur: "La rédaction People – Radio Tripoint",
    corps: [
      {
        type: "paragraphe",
        texte:
          "Figure incontournable de la chanson française depuis les années 1980, Patrick Bruel a marqué plusieurs générations avec des titres devenus cultes comme Alors regarde, Casser la voix ou encore Place des grands hommes. Chanteur, acteur et personnalité populaire, il demeure l’un des artistes francophones les plus connus.",
      },
      {
        type: "paragraphe",
        texte:
          "Aujourd’hui, sa carrière traverse toutefois une période délicate. Ces dernières semaines, plusieurs accusations de violences sexuelles ont conduit à l’ouverture d’une enquête judiciaire. Selon les informations rendues publiques, Patrick Bruel conteste fermement l’ensemble de ces accusations et affirme vouloir coopérer avec la justice afin de faire valoir sa version des faits.",
      },
      {
        type: "liste",
        elements: [
          "Cette affaire a suscité de nombreuses réactions dans le monde culturel et médiatique, certains événements ayant été remis en question ou annulés.",
        ],
      },
      {
        type: "paragraphe",
        texte:
          "Au-delà de cette actualité, Patrick Bruel reste une personnalité qui a profondément marqué la scène musicale française par une carrière de plusieurs décennies et des millions d’albums vendus. Comme dans toute procédure judiciaire, il convient de rappeler que la présomption d’innocence s’applique tant qu’aucune condamnation définitive n’a été prononcée.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actu-people
  {
    slug: "le-rappeur-gims-aurait-ete-place-en-garde-a-vue-dans-une-affaire-de-blanchiment",
    titre:
      "Le rappeur Gims aurait été placé en garde à vue dans une affaire de blanchiment, selon plusieurs sources.",
    chapeau:
      "Le rappeur Gims aurait été placé en garde à vue dans une affaire présumée de blanchiment en bande organisée, selon plusieurs médias.",
    categorie: "actu-people",
    ordre: 88,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Le rappeur Gims aurait été placé en garde à vue dans une affaire présumée de blanchiment en bande organisée, selon plusieurs médias.",
      },
      {
        type: "paragraphe",
        texte: "À ce stade, les informations restent à confirmer et l’enquête est en cours.",
      },
      { type: "paragraphe", texte: "La présomption d’innocence s’applique." },
      { type: "paragraphe", texte: "Radio Tripoint suivra l’évolution de cette affaire." },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actu-people
  {
    slug: "loana-une-disparition-qui-relance-le-debat-sur-la-sante-mentale",
    titre: "Loana : une disparition qui relance le débat sur la santé mentale",
    chapeau:
      "La disparition de Loana, figure emblématique de Loft Story, suscite une vive émotion.",
    categorie: "actu-people",
    ordre: 89,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La disparition de Loana, figure emblématique de Loft Story, suscite une vive émotion.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette actualité relance le débat sur la santé mentale, notamment chez les personnalités exposées médiatiquement.",
      },
      {
        type: "paragraphe",
        texte: "Pression, notoriété, isolement : des réalités souvent difficiles à gérer.",
      },
      { type: "paragraphe", texte: "Un sujet qui concerne aujourd’hui l’ensemble de la société." },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actu-people
  {
    slug: "patrick-bruel-vise-par-une-nouvelle-plainte-ce-que-l-on-sait",
    titre: "Patrick Bruel visé par une nouvelle plainte : ce que l’on sait!",
    chapeau: "Une nouvelle actualité secoue le monde des célébrités.",
    categorie: "actu-people",
    ordre: 90,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Une nouvelle actualité secoue le monde des célébrités. Le chanteur et acteur Patrick Bruel serait visé par une nouvelle plainte, selon plusieurs informations relayées ces dernières heures.",
      },
      {
        type: "paragraphe",
        texte:
          "À ce stade, peu de détails officiels ont été confirmés concernant les faits reprochés. L’affaire en est encore à ses débuts et pourrait faire l’objet d’investigations plus approfondies dans les jours à venir. Comme dans toute procédure judiciaire, la présomption d’innocence reste un principe fondamental.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette information suscite déjà de nombreuses réactions sur les réseaux sociaux et dans les médias, relançant l’attention autour de l’artiste.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint Officiel vous offre un accès privilégié à des entretiens inédits. Découvrez les coulisses, les confidences et les projets de vos personnalités préférées. Nous mettons tout en œuvre pour vous apporter des contenus uniques qui vous rapprochent de l'univers des célébrités.",
      },
    ],
  },
]
