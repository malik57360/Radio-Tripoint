import type { Article } from "@/types/article"

/**
 * Articles de la rubrique « art-culture » repris de l'ancien site Webador
 * (texte intégral, sans les photos). L'ancien site n'affichait pas de date :
 * `ordre` reprend le rang d'apparition (1 = le plus récent).
 */
export const artCulture: Article[] = [
  // Article de la rédaction, 1er octobre 2026 (interview de Pierre Bonnet).
  {
    slug: "exposition-cartes-postales-faiences-sierck-les-bains",
    titre:
      "À la découverte des trésors oubliés de Sierck-les-Bains : cartes postales et faïences anciennes",
    chapeau:
      "Les 10 et 11 octobre 2026, Sierck-les-Bains invite habitants et visiteurs à remonter le temps à travers une exposition consacrée aux anciennes cartes postales et aux faïences de la ville.",
    categorie: "art-culture",
    publieLe: "2026-10-01T09:00:00+02:00",
    lieux: ["Sierck-les-Bains"],
    tags: ["patrimoine", "faïence", "cartes postales", "exposition"],
    visuel: {
      src: "/media/articles/exposition-cartes-postales-faiences-sierck-les-bains.webp",
      alt: "Affiche de l'exposition de cartes postales et de faïences anciennes de Sierck-les-Bains : un vase à angelots, des assiettes, une tasse et d'anciennes cartes postales de la ville. 10 octobre 2026 de 14 h à 18 h, 11 octobre de 10 h à 18 h, entrée gratuite, salle Espace Valette.",
      largeur: 1003,
      hauteur: 1400,
    },
    corps: [
      {
        type: "paragraphe",
        texte:
          "Les 10 et 11 octobre 2026, Sierck-les-Bains invite habitants et visiteurs à remonter le temps à travers une exposition consacrée aux anciennes cartes postales et aux faïences de la ville. À l’origine de ce rendez-vous, Pierre Bonnet, passionné par l’histoire locale, a souhaité partager une partie de ce patrimoine parfois méconnu. Pour Radio Tripoint, il revient sur la naissance de cette exposition et sur les trésors que le public pourra découvrir.",
      },
      { type: "intertitre", texte: "Comment est née l’idée de cette exposition ?" },
      {
        type: "paragraphe",
        texte:
          "Pierre Bonnet : J’ai toujours eu envie de partager les cartes postales et les anciennes photos de Sierck-les-Bains. En parlant autour de moi du passé très riche de Sierck, notamment de ses commerces, cafés, hôtels, des thermes et des sources, je me suis rendu compte que beaucoup de personnes étaient intéressées par cette histoire.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette exposition est donc née de cette envie de faire découvrir et de partager ces témoignages du passé.",
      },
      { type: "intertitre", texte: "Que pourront découvrir les visiteurs ?" },
      {
        type: "paragraphe",
        texte:
          "Les visiteurs pourront découvrir de nombreuses anciennes vues de Sierck-les-Bains ainsi que différents commerces qui existaient autrefois. Les cartes postales permettent également de voir les traces laissées par les guerres et les inondations qui ont marqué la ville.",
      },
      {
        type: "paragraphe",
        texte:
          "L’exposition présentera aussi de magnifiques pièces de faïence, notamment des assiettes et des tasses. Parmi les pièces les plus remarquables figurent deux superbes vases de Sierck, extrêmement rares.",
      },
      {
        type: "image",
        visuel: {
          src: "/media/articles/exposition-cartes-postales-faiences-sierck-les-bains-vase.webp",
          alt: "Vase bleu clair à décor doré, orné de deux angelots assis sur les anses et d'un médaillon de fleurs peintes.",
          largeur: 1050,
          hauteur: 1400,
        },
      },
      {
        type: "intertitre",
        texte: "Pourquoi était-il important de mettre ce patrimoine en valeur ?",
      },
      {
        type: "paragraphe",
        texte:
          "Pierre Bonnet : Je trouve qu’il est important de faire connaître tout notre patrimoine passé : les carrières, les tanneries, mais aussi les faïenceries.",
      },
      {
        type: "paragraphe",
        texte:
          "Et ce patrimoine est parfois encore méconnu. Encore récemment, je discutais avec une personne de la région qui ne connaissait même pas l’existence des faïenceries de Sierck.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette exposition est donc aussi une manière de rappeler que derrière les rues et les bâtiments que nous connaissons aujourd’hui se cache une histoire particulièrement riche.",
      },
      {
        type: "image",
        visuel: {
          src: "/media/articles/exposition-cartes-postales-faiences-sierck-les-bains-tasse.webp",
          alt: "Tasse en faïence à décor imprimé noir : un bélier et une brebis devant une barrière, dans un cadre d'arabesques.",
          largeur: 1400,
          hauteur: 1050,
        },
      },
      {
        type: "image",
        visuel: {
          src: "/media/articles/exposition-cartes-postales-faiences-sierck-les-bains-marque.webp",
          alt: "Marque imprimée au revers de la tasse : « Opaque », un blason couronné, les lettres « C » et « L », et « Sierck ».",
          largeur: 1050,
          hauteur: 1400,
        },
      },
      {
        type: "intertitre",
        texte:
          "À qui s’adresse cette exposition et qu’aimeriez-vous que les visiteurs en retiennent ?",
      },
      {
        type: "paragraphe",
        texte:
          "Pierre Bonnet : Cette exposition s’adresse à tout le canton de Sierck, car à l’époque, Sierck faisait vivre beaucoup de monde.",
      },
      {
        type: "paragraphe",
        texte:
          "J’aimerais surtout que les visiteurs puissent découvrir ou redécouvrir cette histoire et prendre conscience de la richesse du patrimoine local.",
      },
      {
        type: "image",
        visuel: {
          src: "/media/articles/exposition-cartes-postales-faiences-sierck-les-bains-assiette-fleurs.webp",
          alt: "Assiette en faïence peinte à la main : un panier de fleurs roses et de feuillage vert au centre, une frise de feuilles roses et de fleurs bleues sur le bord.",
          largeur: 1050,
          hauteur: 1400,
        },
      },
      {
        type: "image",
        visuel: {
          src: "/media/articles/exposition-cartes-postales-faiences-sierck-les-bains-assiette-esperance.webp",
          alt: "Assiette à décor imprimé brun intitulée « L'Espérance » : une scène de crucifixion entourée d'une bordure de fleurs et d'angelots.",
          largeur: 1400,
          hauteur: 1050,
        },
      },
      {
        type: "intertitre",
        texte: "La question bonus : y a-t-il une pièce avec une histoire particulière ?",
      },
      {
        type: "paragraphe",
        texte:
          "Pour les cartes postales, Pierre Bonnet explique ne pas avoir une anecdote particulière à raconter, mais sa collection est le résultat de nombreuses recherches, de marchés aux puces et de nombreux kilomètres parcourus à la recherche de véritables perles rares.",
      },
      {
        type: "paragraphe",
        texte:
          "Du côté des faïences, une jolie anecdote est toutefois racontée par son ami Jacquy.",
      },
      {
        type: "paragraphe",
        texte:
          "Un de ses amis collectionne les émaux de Longwy et possédait dans sa collection deux assiettes de Sierck. Jacquy lui aurait alors fait remarquer, non sans humour, que ces deux assiettes n’avaient finalement pas vraiment leur place dans sa collection.",
      },
      {
        type: "paragraphe",
        texte:
          "À l’approche de Noël, le collectionneur a finalement offert… les deux belles assiettes de Sierck à Jacquy.",
      },
      {
        type: "paragraphe",
        texte:
          "Une petite histoire qui illustre finalement bien l’esprit de cette exposition : derrière chaque objet ancien peut se cacher une histoire, une rencontre ou un souvenir.",
      },
      {
        type: "image",
        visuel: {
          src: "/media/articles/exposition-cartes-postales-faiences-sierck-les-bains-assiette-ajouree.webp",
          alt: "Assiette au bord ajouré, peinte d'une scène galante dans un parc : des personnages en costumes d'époque, un cheval et des chiens.",
          largeur: 1400,
          hauteur: 1050,
        },
      },
      {
        type: "image",
        visuel: {
          src: "/media/articles/exposition-cartes-postales-faiences-sierck-les-bains-assiette-enfant.webp",
          alt: "Assiette à décor imprimé noir : au centre, un enfant fuit un sanglier caché derrière un arbre ; large bordure de fleurs et d'arabesques.",
          largeur: 1400,
          hauteur: 1050,
        },
      },
      { type: "intertitre", texte: "Un voyage dans la mémoire de Sierck-les-Bains" },
      {
        type: "paragraphe",
        texte:
          "À travers cette exposition, ce sont donc plusieurs facettes de l’histoire de Sierck-les-Bains qui seront à découvrir : ses commerces, ses paysages, les traces des événements qui ont marqué la ville, mais aussi son savoir-faire faïencier.",
      },
      {
        type: "paragraphe",
        texte:
          "Une invitation à regarder autrement le patrimoine local et à découvrir des objets qui, parfois après avoir parcouru de nombreux kilomètres ou attendu des années dans des collections privées, reviennent raconter une partie de l’histoire de Sierck.",
      },
      {
        type: "intertitre",
        texte: "Exposition de cartes postales et de faïences anciennes de Sierck-les-Bains",
      },
      {
        type: "liste",
        elements: [
          "Samedi 10 octobre 2026 : 14h à 18h",
          "Dimanche 11 octobre 2026 : 10h à 18h",
          "Entrée gratuite",
          "Salle Espace Valette, rue Porte de Trèves, Sierck-les-Bains",
        ],
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint vous donne rendez-vous pour découvrir cette plongée dans la mémoire et le patrimoine de Sierck-les-Bains.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/art-culture
  {
    slug: "arnold-vi-de-sierck-quand-sierck-ecrivait-une-page-de-l-histoire-europeenne",
    titre: "Arnold VI de Sierck : Quand Sierck écrivait une page de l’histoire européenne.",
    chapeau:
      "Aujourd’hui, Sierck-les-Bains est une petite cité de Moselle, installée au bord du fleuve et à quelques kilomètres seulement du Luxembourg et de l’Allemagne.",
    categorie: "art-culture",
    ordre: 58,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Aujourd’hui, Sierck-les-Bains est une petite cité de Moselle, installée au bord du fleuve et à quelques kilomètres seulement du Luxembourg et de l’Allemagne.",
      },
      {
        type: "paragraphe",
        texte: "Mais derrière ses remparts et son château se cache une histoire bien plus grande.",
      },
      {
        type: "paragraphe",
        texte:
          "Au XVe siècle, le nom de Sierck résonne jusque dans les hautes sphères du Saint-Empire romain germanique.",
      },
      {
        type: "paragraphe",
        texte: "Et au cœur de cette histoire se trouve un homme : Arnold VI de Sierck.",
      },
      { type: "intertitre", texte: "Un puissant seigneur du Pays de Sierck" },
      {
        type: "paragraphe",
        texte:
          "Issu de l’importante famille des seigneurs de Sierck, Arnold VI évolue dans une région qui occupe déjà une position stratégique entre Lorraine, Luxembourg et terres germaniques.",
      },
      { type: "paragraphe", texte: "Son influence dépasse largement les limites de Sierck." },
      {
        type: "paragraphe",
        texte:
          "En 1419, il obtient l’autorisation du duc de Lorraine de construire une nouvelle forteresse à Meinsberg, sur les hauteurs de Manderen.",
      },
      { type: "paragraphe", texte: "Cette forteresse existe toujours." },
      {
        type: "paragraphe",
        texte: "Nous la connaissons aujourd’hui sous un autre nom : le château de Malbrouck.",
      },
      {
        type: "paragraphe",
        texte:
          "Ainsi, l’un des monuments les plus célèbres de Moselle trouve directement son origine dans l’histoire de la famille de Sierck.",
      },
      { type: "intertitre", texte: "De Sierck jusqu’au sommet du Saint-Empire" },
      {
        type: "paragraphe",
        texte:
          "Mais l’histoire prend une dimension encore plus spectaculaire avec son fils, Jacques de Sierck.",
      },
      {
        type: "paragraphe",
        texte:
          "Destiné à une carrière ecclésiastique, Jacques devient archevêque de Trèves au XVe siècle.",
      },
      {
        type: "paragraphe",
        texte:
          "Or, à cette époque, être archevêque de Trèves ne signifie pas seulement diriger un important territoire religieux.",
      },
      {
        type: "paragraphe",
        texte: "Il devient également prince-électeur du Saint-Empire romain germanique.",
      },
      {
        type: "paragraphe",
        texte:
          "Un titre réservé à un cercle extrêmement restreint de personnages disposant notamment du pouvoir de participer à l’élection du souverain du Saint-Empire.",
      },
      {
        type: "paragraphe",
        texte:
          "Le fils d’un seigneur de Sierck accède ainsi à l’un des postes les plus puissants de l’Europe médiévale.",
      },
      { type: "intertitre", texte: "Une histoire européenne… née ici" },
      { type: "paragraphe", texte: "C’est probablement ce qui rend cette histoire si fascinante." },
      {
        type: "paragraphe",
        texte:
          "Lorsque nous traversons aujourd’hui Sierck-les-Bains, Manderen, Perl, Schengen ou les villages voisins, nous circulons dans un territoire qui, plusieurs siècles auparavant, se trouvait déjà au croisement des grandes influences européennes.",
      },
      { type: "paragraphe", texte: "Les frontières ont changé." },
      { type: "paragraphe", texte: "Les États ont changé." },
      { type: "paragraphe", texte: "Mais la position stratégique de notre région, elle, demeure." },
      {
        type: "paragraphe",
        texte: "Et l’histoire d’Arnold VI et de la famille de Sierck nous rappelle une chose :",
      },
      {
        type: "paragraphe",
        texte:
          "bien avant que l’on parle de “Grande Région” ou de territoire transfrontalier, notre histoire dépassait déjà les frontières.",
      },
      { type: "intertitre", texte: "Une histoire à redécouvrir cette semaine" },
      {
        type: "paragraphe",
        texte:
          "À quelques jours de la Fête du Château de Sierck des 22 et 23 août, c’est aussi l’occasion de regarder autrement ce patrimoine que nous côtoyons parfois quotidiennement sans mesurer toute son importance.",
      },
      {
        type: "paragraphe",
        texte:
          "Car derrière les pierres du château de Sierck se cache une histoire qui nous relie directement à plusieurs siècles d’histoire européenne.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/art-culture
  {
    slug: "melamine-une-nouvelle-emission-pour-donner-la-parole-aux-diasporas-de-la-grande",
    titre:
      "Mélamine : une nouvelle émission pour donner la parole aux diasporas de la Grande Région.",
    chapeau: "La Grande Région est une terre de rencontres.",
    categorie: "art-culture",
    ordre: 59,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La Grande Région est une terre de rencontres. Chaque jour, des milliers de femmes et d’hommes venus d’Afrique, du Portugal, du Cap-Vert, d’Italie, d’Inde et de bien d’autres horizons vivent, travaillent et entreprennent entre la France, le Luxembourg et l’Allemagne.",
      },
      {
        type: "paragraphe",
        texte:
          "Au Luxembourg, la communauté portugaise représente à elle seule plus de 13 % de la population, tandis que les communautés italienne, française, indienne et africaine participent elles aussi à la richesse culturelle et économique du pays.",
      },
      {
        type: "paragraphe",
        texte:
          "En Moselle, les habitants issus de l’immigration sont également nombreux, avec notamment des personnes originaires d’Italie, du Portugal, d’Afrique du Nord et d’Afrique subsaharienne qui contribuent depuis des décennies à la vie du territoire.",
      },
      {
        type: "paragraphe",
        texte:
          "Pourtant, leurs parcours, leurs réussites et leurs initiatives restent encore trop peu visibles.",
      },
      {
        type: "paragraphe",
        texte:
          "C’est précisément pour cela que Radio Tripoint lance Mélamine – Les voix de la diaspora.",
      },
      {
        type: "paragraphe",
        texte:
          "Une émission qui donne la parole à celles et ceux qui entreprennent, s’engagent, créent et participent chaque jour au dynamisme de notre territoire transfrontalier.",
      },
      { type: "paragraphe", texte: "Parce que chaque histoire mérite d’être entendue." },
      { type: "paragraphe", texte: "Parce que chaque parcours peut inspirer." },
      { type: "paragraphe", texte: "Et parce que la visibilité crée des opportunités." },
      {
        type: "paragraphe",
        texte:
          "🎙️ Vous souhaitez raconter votre histoire, présenter votre activité ou mettre en avant votre association ?",
      },
      { type: "paragraphe", texte: "Contactez-nous à : info@radio-tripoint-officiel.com" },
      {
        type: "paragraphe",
        texte: "Radio Tripoint – Le média transfrontalier qui vous donne de la visibilité.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/art-culture
  {
    slug: "au-dela-de-la-frontiere-une-exposition-entre-memoire-et-europe-au-schengen",
    titre: "Au-delà de la frontière » : une exposition entre mémoire et Europe au Schengen Museum.",
    chapeau:
      "À partir du 15 juin et jusqu’au 13 septembre 2026, le Schengen Museum accueille l’exposition « Au-delà de la frontière », réalisée par les artistes allemands Silke Markefka et Nikolai Vogel.",
    categorie: "art-culture",
    ordre: 60,
    corps: [
      {
        type: "paragraphe",
        texte:
          "À partir du 15 juin et jusqu’au 13 septembre 2026, le Schengen Museum accueille l’exposition « Au-delà de la frontière », réalisée par les artistes allemands Silke Markefka et Nikolai Vogel. L’exposition est présentée dans un lieu chargé d’histoire : le Prinzessin Marie-Astrid Europa, navire où furent signés les Accords de Schengen en 1985.",
      },
      {
        type: "paragraphe",
        texte:
          "À travers une vingtaine d’installations mêlant peinture, texte et créations sonores, les deux artistes proposent une réflexion sur l’évolution des frontières en Europe. Leur projet est né après un voyage effectué en 2008 et 2009 le long des anciennes frontières allemandes, à une époque où les postes-frontières disparaissaient progressivement.",
      },
      {
        type: "paragraphe",
        texte:
          "Les œuvres de Silke Markefka revisitent ces paysages à travers une peinture qui joue sur la mémoire et les différentes strates du temps. De son côté, Nikolai Vogel complète cette approche par des enregistrements sonores et un travail littéraire qui replongent le visiteur dans l’atmosphère de ces lieux aujourd’hui transformés.",
      },
      {
        type: "paragraphe",
        texte:
          "Présentée sur le site même où est née l’idée d’une Europe sans frontières, cette exposition invite chacun à s’interroger sur notre histoire commune et sur la place que les frontières occupent encore dans notre société.",
      },
      { type: "paragraphe", texte: "Informations pratiques :" },
      {
        type: "liste",
        elements: [
          "Lieu : Schengen Museum (Luxembourg)",
          "Exposition : du 15 juin au 13 septembre 2026",
          "Horaires : tous les jours de 10 h à 18 h",
        ],
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/art-culture
  {
    slug: "i-am-from-there-un-film-qui-fait-de-la-poesie-un-espace-de-reconstruction",
    titre: "« I Am From There… » : un film qui fait de la poésie un espace de reconstruction.",
    chapeau:
      "La réalisatrice Lila Ben Saâla finalise actuellement son long métrage « I Am From There… », un documentaire humaniste qui met en lumière des adolescents cherchant à se reconstruire grâce à l’art et à la poésie, notamment à travers l’œuvre du poète palestinien Mahmoud Darwich.",
    categorie: "art-culture",
    ordre: 61,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La réalisatrice Lila Ben Saâla finalise actuellement son long métrage « I Am From There… », un documentaire humaniste qui met en lumière des adolescents cherchant à se reconstruire grâce à l’art et à la poésie, notamment à travers l’œuvre du poète palestinien Mahmoud Darwich.",
      },
      {
        type: "paragraphe",
        texte:
          "Le tournage est désormais achevé et le projet entre dans sa dernière phase : le montage et la finalisation, avec l’ambition d’une diffusion en France et à l’international. Pour y parvenir, une campagne de financement participatif a été lancée afin de réunir les moyens nécessaires à son aboutissement.",
      },
      {
        type: "paragraphe",
        texte:
          "À travers ce film, la réalisatrice souhaite montrer que la culture peut devenir un véritable outil de résilience, d’espoir et d’appartenance. Loin d’un simple témoignage, « I Am From There… » met en avant la force des mots et de la création artistique pour reconstruire des parcours de vie.",
      },
      {
        type: "paragraphe",
        texte:
          "Le projet s’inscrit dans une démarche profondément humaniste et transfrontalière, faisant écho à la circulation des récits, des langues et des sensibilités au-delà des frontières. Une invitation à découvrir un cinéma engagé où la poésie devient un langage universel.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour aller plus loin, nous joignons le lien permettant de visionner les vidéos de présentation du projet. Et pour les lecteurs qui souhaitent soutenir la finalisation du film, un lien vers la campagne de financement participatif est également mis à leur disposition.",
      },
      { type: "paragraphe", texte: "https://youtube.com/@thereingaza?si=TfBILJ4ZyEqV0M4-" },
      { type: "paragraphe", texte: "https://www.gofundme.com/f/this-film-needs-you" },
    ],
  },
]
