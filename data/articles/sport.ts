import type { Article } from "@/types/article"

/**
 * Articles de la rubrique « sport » repris de l'ancien site Webador
 * (texte intégral, sans les photos). L'ancien site n'affichait pas de date :
 * `ordre` reprend le rang d'apparition (1 = le plus récent).
 */
export const sport: Article[] = [
  // Sources : FC Metz, ICI Lorraine, L'essentiel, France 3 Grand Est, Le JDD
  // (jubilé du 6 octobre 2026). Photo : Radio Tripoint, en tribune.
  {
    slug: "jubile-robert-pires-saint-symphorien-metz-octobre-2026",
    titre: "Jubilé de Robert Pirès : Saint-Symphorien rend hommage à l’enfant du FC Metz",
    chapeau:
      "Plus de 27 000 spectateurs ont fêté Robert Pirès, mardi 6 octobre, au stade Saint-Symphorien. Henry, Vieira, Drogba, Ribéry, Eto’o et les champions du monde 1998 étaient de la fête, sous les yeux d’Aimé Jacquet, Arsène Wenger et Joël Muller.",
    categorie: "sport",
    publieLe: "2026-10-07T11:00:00+02:00",
    auteur: "La rédaction de Radio Tripoint",
    lieux: ["Metz", "Moselle"],
    tags: ["football", "FC Metz", "Robert Pirès", "jubilé", "Arsenal", "France 98"],
    visuel: {
      src: "/media/articles/jubile-pires-saint-symphorien.webp",
      alt: "Le stade Saint-Symphorien de nuit, tribunes pleines, pendant le jubilé de Robert Pirès : joueurs en maillot grenat et en maillot jaune sur la pelouse.",
      largeur: 1170,
      hauteur: 740,
      credit: "Radio Tripoint",
    },
    corps: [
      {
        type: "paragraphe",
        texte:
          "Metz, mardi 6 octobre 2026. Sous les projecteurs de Saint-Symphorien, plus de 27 000 spectateurs sont venus célébrer le jubilé de Robert Pirès, vingt-huit ans après son départ du FC Metz. Une soirée de football et d’émotion, où se sont croisées trois générations : les légendes du club grenat, les champions du monde 1998 et les anciens d’Arsenal.",
      },
      { type: "intertitre", texte: "Retour là où tout a commencé" },
      {
        type: "paragraphe",
        texte:
          "Né à Reims le 29 octobre 1973, Robert Pirès a lancé sa carrière professionnelle au FC Metz en 1993. Il y est resté jusqu’en 1998, avec à la clé une Coupe de la Ligue remportée en 1996, avant de rejoindre l’Olympique de Marseille. La suite est connue : Arsenal, où il est devenu l’un des « Invincibles » de la saison 2003-2004, et l’équipe de France, championne du monde en 1998 et championne d’Europe en 2000.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour fêter sa carrière, c’est pourtant Metz qu’il a choisi : le club qui l’a révélé, et le public qui l’a vu éclore.",
      },
      { type: "intertitre", texte: "Trois équipes, trois périodes" },
      {
        type: "paragraphe",
        texte:
          "Le format était inédit : trois équipes et trois périodes de trente minutes. Les légendes du FC Metz étaient dirigées par Joël Muller, les Pirès All Stars par Aimé Jacquet, et les légendes d’Arsenal par Arsène Wenger. Robert Pirès a joué successivement avec chacune des trois formations, en commençant par le maillot grenat de ses débuts.",
      },
      {
        type: "image",
        visuel: {
          src: "/media/articles/jubile-pires-tribune.webp",
          alt: "Vue depuis la tribune de Saint-Symphorien pendant le jubilé : la pelouse éclairée, les joueurs et le public au premier plan.",
          largeur: 1000,
          hauteur: 1778,
          credit: "Radio Tripoint",
        },
        legende: "Saint-Symphorien vu des tribunes, mardi soir, pendant le jubilé de Robert Pirès.",
      },
      {
        type: "paragraphe",
        texte:
          "Le casting avait de quoi faire rêver : Thierry Henry, Franck Ribéry et Samuel Eto’o en invités vedettes, mais aussi Didier Drogba, Marcel Desailly, Lilian Thuram, Bixente Lizarazu, Laurent Blanc, Youri Djorkaeff, Patrick Vieira, Samir Nasri, Lukas Podolski, Emmanuel Adebayor, Djibril Cissé, El Hadji Diouf ou encore Olivier Dacourt.",
      },
      {
        type: "paragraphe",
        texte:
          "Avant le coup d’envoi, Robert Pirès a reçu une longue ovation du public, aux côtés de ses anciens entraîneurs Aimé Jacquet, Arsène Wenger et Joël Muller.",
      },
      { type: "intertitre", texte: "Henry, Vieira… et Pirès" },
      {
        type: "paragraphe",
        texte:
          "Sur la pelouse, les anciens Gunners n’ont pas tardé à se rappeler au bon souvenir du public. Lors de l’opposition entre les légendes messines et celles d’Arsenal, Thierry Henry a ouvert le score dès la deuxième minute, sur un service de Samir Nasri. Patrick Vieira a doublé la mise peu après, sur une passe de Thierry Henry. Robert Pirès a ensuite réduit l’écart d’une frappe croisée, pour un score de 1-2.",
      },
      { type: "intertitre", texte: "Une soirée solidaire" },
      {
        type: "paragraphe",
        texte:
          "Le jubilé avait aussi une dimension solidaire : les recettes de la soirée sont destinées à soutenir l’Institut de Myologie et l’association mosellane « L’Exceptionnelle Mia », engagée auprès d’une jeune fille atteinte d’une maladie rare. Les billets étaient proposés à partir de 15 euros.",
      },
      {
        type: "paragraphe",
        texte:
          "Une belle soirée pour Saint-Symphorien, qui a offert à l’un des plus grands talents formés au club l’hommage qu’il méritait.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/sport
  {
    slug: "l-espagne-est-championne-du-monde-2026",
    titre: "L’Espagne est championne du monde 2026 !",
    chapeau: "L’Espagne est de retour sur le toit du football mondial.",
    categorie: "sport",
    ordre: 35,
    auteur: "La rédaction de Radio Tripoint",
    corps: [
      {
        type: "paragraphe",
        texte:
          "L’Espagne est de retour sur le toit du football mondial. Dimanche soir, la Roja a remporté la finale de la Coupe du monde 2026 en s’imposant 1-0 face à l’Argentine, décrochant ainsi son deuxième sacre mondial, seize ans après son premier titre remporté en Afrique du Sud en 2010.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans une finale disputée et riche en intensité, les Espagnols ont fait preuve de maîtrise, de solidarité et d’une grande efficacité pour venir à bout des champions du monde en titre. Cette victoire vient récompenser une génération talentueuse qui aura marqué l’ensemble de la compétition par la qualité de son jeu.",
      },
      {
        type: "paragraphe",
        texte:
          "Parmi les grands artisans de ce succès, Lamine Yamal s’est une nouvelle fois illustré. Véritable révélation du football mondial, le jeune prodige espagnol confirme son immense potentiel et s’impose désormais comme l’un des visages de cette nouvelle génération dorée.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette Coupe du monde 2026 restera également marquée par un parcours remarquable de plusieurs sélections, notamment la France, demi-finaliste, avant de terminer à la quatrième place après sa défaite face à l’Angleterre lors du match pour la troisième place.",
      },
      {
        type: "paragraphe",
        texte:
          "Avec ce nouveau titre, l’Espagne inscrit une nouvelle page de son histoire et confirme son retour parmi les plus grandes nations du football mondial.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/sport
  {
    slug: "coupe-du-monde-2026-la-france-jouera-pour-la-troisieme-place-espagne-argentine",
    titre:
      "Coupe du monde 2026 : la France jouera pour la troisième place, Espagne–Argentine en finale.",
    chapeau:
      "La Coupe du monde 2026 touche à sa fin et les dernières affiches sont désormais connues.",
    categorie: "sport",
    ordre: 36,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La Coupe du monde 2026 touche à sa fin et les dernières affiches sont désormais connues. Battue par l’Espagne en demi-finale sur le score de 2-0, l’équipe de France disputera une dernière rencontre face à l’Angleterre, elle-même éliminée par l’Argentine après une défaite 2-1.",
      },
      {
        type: "paragraphe",
        texte:
          "Les Bleus tenteront ainsi de décrocher la troisième place de la compétition et de conclure leur parcours sur une victoire. Cette « petite finale » se jouera samedi 18 juillet à 23h, heure française, au Miami Stadium, également connu sous le nom de Hard Rock Stadium.",
      },
      {
        type: "paragraphe",
        texte:
          "Malgré la déception de ne pas participer à la grande finale, la France peut encore monter sur le podium. Face à une sélection anglaise particulièrement solide, Kylian Mbappé et ses partenaires devront retrouver de l’efficacité et de l’énergie pour terminer cette Coupe du monde sur une note positive.",
      },
      {
        type: "paragraphe",
        texte:
          "Le lendemain, dimanche 19 juillet à 21h, heure française, l’Espagne et l’Argentine se retrouveront en finale au New York New Jersey Stadium. Une affiche prestigieuse entre la Roja, tombeuse de la France, et l’Argentine, championne du monde en titre, qui tentera de conserver sa couronne.",
      },
      {
        type: "paragraphe",
        texte:
          "La France ne soulèvera pas le trophée cette année, mais elle peut encore quitter la compétition avec une médaille et une victoire de prestige face à son grand rival anglais.",
      },
      { type: "paragraphe", texte: "Tous derrière les Bleus jusqu’au dernier coup de sifflet !" },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/sport
  {
    slug: "conor-mcgregor-un-retour-tres-attendu-qui-tourne-au-flop-les-fans-decus",
    titre: "Conor McGregor : un retour très attendu… qui tourne au flop, les fans déçus.",
    chapeau: "C’était l’un des retours les plus attendus de l’histoire récente de l’UFC.",
    categorie: "sport",
    ordre: 39,
    corps: [
      {
        type: "paragraphe",
        texte:
          "C’était l’un des retours les plus attendus de l’histoire récente de l’UFC. Après plus de cinq ans d’absence, Conor McGregor faisait enfin son retour dans l’Octogone ce week-end à l’UFC 329 face à Max Holloway. Mais la soirée a viré à la désillusion pour des millions de supporters à travers le monde.",
      },
      {
        type: "paragraphe",
        texte:
          "Dès les premières secondes du combat, l’ancien champion irlandais a tenté d’imposer son style explosif avec un spectaculaire coup de pied sauté. À la retombée, sa jambe s’est dérobée. Incapable de poursuivre, McGregor a vu l’arbitre mettre fin au combat après seulement 69 secondes, offrant la victoire par arrêt à Max Holloway. Les premiers examens évoquent une grave blessure au genou, possiblement une rupture des ligaments croisés.",
      },
      {
        type: "paragraphe",
        texte:
          "Sur les réseaux sociaux, la déception a rapidement remplacé l’excitation. Beaucoup de fans, qui attendaient ce retour depuis des années, regrettent de ne pas avoir pu assister à un véritable affrontement. Plusieurs internautes parlent d’un « retour gâché », tandis que d’autres s’interrogent sur l’avenir de celui qui fut longtemps la plus grande star de l’UFC.",
      },
      {
        type: "paragraphe",
        texte:
          "Pourtant, ni Dana White ni l’entourage du combattant ne parlent d’une blessure préexistante. Selon son entraîneur John Kavanagh, McGregor était en pleine forme avant le combat et rien ne laissait présager un tel scénario.",
      },
      {
        type: "paragraphe",
        texte:
          "Très affecté après la rencontre, l’Irlandais a assuré qu’il n’avait pas l’intention de mettre un terme à sa carrière. Malgré cette nouvelle épreuve, il affirme vouloir revenir une nouvelle fois dans l’Octogone lorsque son état de santé le permettra.",
      },
      {
        type: "paragraphe",
        texte:
          "Une chose est certaine : ce retour, annoncé comme l’un des plus grands événements de l’année en MMA, laisse un goût amer aux amateurs de sports de combat. L’attente était immense, mais le spectacle n’aura duré qu’un peu plus d’une minute. Un véritable flop pour les fans, qui espéraient revoir le “Notorious” au sommet de son art.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/sport
  {
    slug: "coupe-du-monde-2026-les-bleus-deroulent-face-a-la-suede-et-filent-en-huitiemes",
    titre: "Coupe du monde 2026 : les Bleus déroulent face à la Suède et filent en huitièmes.",
    chapeau:
      "L’équipe de France a confirmé son statut de favorite en dominant nettement la Suède (3-0), mardi soir, lors des seizièmes de finale de la Coupe du monde 2026.",
    categorie: "sport",
    ordre: 44,
    corps: [
      {
        type: "paragraphe",
        texte:
          "L’équipe de France a confirmé son statut de favorite en dominant nettement la Suède (3-0), mardi soir, lors des seizièmes de finale de la Coupe du monde 2026. Solides dans tous les secteurs du jeu, les hommes de Didier Deschamps ont progressivement pris le contrôle de la rencontre avant de faire parler leur réalisme.",
      },
      {
        type: "paragraphe",
        texte:
          "Après plusieurs occasions franches, Kylian Mbappé a ouvert le score juste avant la pause (45’). Au retour des vestiaires, Bradley Barcola a rapidement doublé la mise (53’), profitant d’un excellent travail collectif. Intenable tout au long de la rencontre, Mbappé a ensuite signé un doublé à la 74e minute, scellant définitivement le sort du match.",
      },
      {
        type: "paragraphe",
        texte:
          "Avec cette quatrième victoire consécutive dans le tournoi, les Bleus affichent une confiance impressionnante et confirment leurs ambitions de conquérir un troisième titre mondial. La prochaine étape s’annonce toutefois plus relevée avec un huitième de finale face au Paraguay.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/sport
  {
    slug: "l-allemagne-quitte-la-coupe-du-monde-apres-une-seance-de-tirs-au-but-cruelle",
    titre:
      "L’Allemagne quitte la Coupe du monde après une séance de tirs au but cruelle face au Paraguay.",
    chapeau:
      "Après un match disputé et terminé sur le score de 1-1, la Mannschaft s’est inclinée 4 tirs au but à 3.",
    categorie: "sport",
    ordre: 49,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Après un match disputé et terminé sur le score de 1-1, la Mannschaft s’est inclinée 4 tirs au but à 3. Malgré plusieurs occasions et une domination par moments, les Allemands n’ont pas réussi à faire la différence.",
      },
      {
        type: "paragraphe",
        texte:
          "Le Paraguay crée ainsi l’un des grands exploits de cette compétition et poursuit son aventure. Pour l’Allemagne, cette élimination sonne comme une grosse déception et laisse beaucoup de regrets.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette élimination historique, la première de l’Allemagne lors d’une séance de tirs au but en Coupe du monde, relance les interrogations autour du sélectionneur Julian Nagelsmann. S’il a exclu toute démission, son avenir à la tête de la Nationalmannschaft pourrait désormais dépendre des décisions de la Fédération allemande. (The Guardian⁠)",
      },
      {
        type: "paragraphe",
        texte:
          "Dans la région des Trois Frontières, cette élimination laisse désormais la France comme la seule nation encore en lice dans cette Coupe du monde. Les Bleus tenteront de poursuivre leur parcours en décrochant leur qualification face à la Suède et porteront les espoirs des supporters français de la région.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/sport
  {
    slug: "l-allemagne-freinee-les-bleus-visent-la-premiere-place",
    titre: "L’Allemagne freinée, les Bleus visent la première place.",
    chapeau:
      "La phase de groupes de la Coupe du Monde 2026 continue de réserver son lot de surprises.",
    categorie: "sport",
    ordre: 50,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La phase de groupes de la Coupe du Monde 2026 continue de réserver son lot de surprises. Jeudi, l’Allemagne s’est inclinée 2-1 face à l’Équateur, une défaite qui a mis fin à son sans-faute. Malgré ce revers, la Mannschaft conserve provisoirement la tête du groupe E grâce à une meilleure différence de buts, devant la Côte d’Ivoire, également à six points.",
      },
      {
        type: "paragraphe",
        texte:
          "Du côté des Bleus, l’heure est au rendez-vous décisif. Ce vendredi soir, la France affronte la Norvège dans un choc entre les deux leaders du groupe I. Les deux sélections comptent six points après deux victoires et sont déjà qualifiées pour les seizièmes de finale. L’enjeu est désormais de taille : terminer premier du groupe afin d’aborder la phase à élimination directe avec un tableau potentiellement plus favorable.",
      },
      {
        type: "paragraphe",
        texte:
          "Les hommes de Didier Deschamps devront toutefois se méfier d’une équipe norvégienne séduisante depuis le début du tournoi. Solides offensivement et emmenés par leurs cadres, les Scandinaves représentent le premier véritable test des Bleus dans cette Coupe du Monde.",
      },
      { type: "intertitre", texte: "Classement actuel" },
      { type: "intertitre", texte: "Groupe E" },
      {
        type: "liste",
        elements: [
          "Allemagne – 6 pts (+6)",
          "Côte d’Ivoire – 6 pts (+2)",
          "Équateur – 4 pts",
          "Curaçao – 1 pt",
        ],
      },
      { type: "intertitre", texte: "Groupe I" },
      {
        type: "liste",
        elements: ["France – 6 pts (+5)", "Norvège – 6 pts (+4)", "Sénégal – 0 pt", "Irak – 0 pt"],
      },
      {
        type: "paragraphe",
        texte:
          "Le coup d’envoi de France – Norvège sera donné ce vendredi à 21h00. Une affiche qui pourrait déjà donner un aperçu des ambitions françaises pour la suite de la compétition.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/sport
  {
    slug: "victoire-pluvieuse-victoire-heureuse",
    titre: "Victoire pluvieuse, victoire heureuse.",
    chapeau:
      "Les Bleus ont signé une nouvelle victoire convaincante hier face à l’Irak, sur le score de 3-0.",
    categorie: "sport",
    ordre: 53,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Les Bleus ont signé une nouvelle victoire convaincante hier face à l’Irak, sur le score de 3-0. Dans une rencontre marquée par la pluie et des conditions de jeu parfois difficiles, l’équipe de France a su rester sérieuse, appliquée et efficace.",
      },
      {
        type: "paragraphe",
        texte:
          "Rapidement devant au score, les Français ont maîtrisé leur sujet sans véritablement trembler. Malgré une météo capricieuse, ils ont imposé leur rythme, faisant parler leur solidité collective et leur qualité offensive.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette victoire confirme la bonne dynamique des Bleus dans la compétition. Face à une équipe irakienne courageuse mais dépassée, la France a fait le travail avec autorité.",
      },
      {
        type: "paragraphe",
        texte:
          "Sous la pluie, les Bleus ont donc gardé le sourire. Une victoire pluvieuse, mais surtout une victoire heureuse, qui permet à l’équipe de France de poursuivre son chemin avec confiance.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/sport
  {
    slug: "clap-de-fin-pour-les-jeux-nationaux-special-olympics-2026-en-sarre",
    titre: "Clap de fin pour les Jeux nationaux Special Olympics 2026 en Sarre.",
    chapeau:
      "Après six jours de compétition, les Jeux nationaux Special Olympics 2026 se sont achevés ce samedi 20 juin.",
    categorie: "sport",
    ordre: 54,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Après six jours de compétition, les Jeux nationaux Special Olympics 2026 se sont achevés ce samedi 20 juin. Organisé pour la première fois en Sarre, cet événement d’envergure a marqué les esprits par sa dimension sportive, humaine et transfrontalière.",
      },
      {
        type: "paragraphe",
        texte:
          "Du 15 au 20 juin, plus de 4 300 athlètes se sont retrouvés pour participer à 27 disciplines sportives, accompagnés par 3 100 bénévoles et soutenus par près de 100 000 visiteurs venus encourager les compétiteurs. Douze délégations internationales étaient également représentées lors de cette édition exceptionnelle.",
      },
      {
        type: "paragraphe",
        texte:
          "Parmi les temps forts de la semaine figuraient les compétitions de natation organisées à la piscine olympique Jean-Éric Gouche de Forbach. Les infrastructures sarroises ne disposant pas de tribunes suffisamment importantes pour accueillir les spectateurs, l’organisation a choisi de s’appuyer sur ce site mosellan, illustrant parfaitement l’esprit de coopération qui caractérise la région des trois frontières.",
      },
      {
        type: "paragraphe",
        texte:
          "Tout au long de la semaine, les athlètes se sont affrontés dans une ambiance exemplaire de respect, de fair-play et de dépassement de soi. Dans les bassins comme sur les terrains, les encouragements étaient adressés à tous les participants, qu’ils terminent premiers ou derniers.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint avait également suivi l’événement lors de son passage à Perl, où plusieurs cérémonies et animations avaient permis de mettre en avant les valeurs portées par le mouvement Special Olympics : inclusion, respect, engagement et partage.",
      },
      {
        type: "paragraphe",
        texte:
          "Au total, près de 6 000 médailles ont été remises au cours de cette semaine exceptionnelle. Mais au-delà des récompenses, c’est surtout l’expérience vécue par les sportifs, les familles, les bénévoles et les organisateurs qui restera dans les mémoires.",
      },
      {
        type: "paragraphe",
        texte:
          "À travers cette édition 2026, la Sarre et l’ensemble de la région transfrontalière ont démontré leur capacité à accueillir un événement sportif majeur tout en plaçant l’humain au centre de la compétition.",
      },
      { type: "paragraphe", texte: "Radio Tripoint – La radio des trois frontières." },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/sport
  {
    slug: "deutschland-sendet-ein-starkes-signal-vor-der-fifa-weltmeisterschaft-2026",
    titre: "Deutschland sendet ein starkes Signal vor der FIFA-Weltmeisterschaft 2026",
    chapeau:
      "Kurz vor dem Beginn der FIFA-Weltmeisterschaft 2026 hat die deutsche Nationalmannschaft ihre gute Form eindrucksvoll bestätigt.",
    categorie: "sport",
    ordre: 66,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Kurz vor dem Beginn der FIFA-Weltmeisterschaft 2026 hat die deutsche Nationalmannschaft ihre gute Form eindrucksvoll bestätigt. Mit einer überzeugenden und disziplinierten Leistung zeigte die Mannschaft, dass sie bereit ist, auf höchstem internationalen Niveau mitzuspielen.",
      },
      {
        type: "paragraphe",
        texte:
          "Unter der Leitung von Julian Nagelsmann verbindet Deutschland erfahrene Führungsspieler mit einer talentierten jungen Generation. Diese Mischung verleiht dem Team Stabilität, Dynamik und große Ambitionen für das kommende Turnier.",
      },
      {
        type: "paragraphe",
        texte:
          "Nach schwierigen Jahren möchte die Mannschaft wieder an ihre erfolgreiche Geschichte anknüpfen. Die jüngsten Leistungen lassen erkennen, dass Deutschland zu den ernstzunehmenden Kandidaten für eine starke Weltmeisterschaft zählt.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/sport
  {
    slug: "les-bleus-bouscules-par-la-cote-d-ivoire-un-avertissement-avant-la-coupe-du",
    titre: "Les Bleus bousculés par la Côte d’Ivoire : un avertissement avant la Coupe du monde.",
    chapeau:
      "À quelques jours de la Coupe du monde 2026, l’équipe de France s’est inclinée 2-1 face à la Côte d’Ivoire lors d’un match de préparation.",
    categorie: "sport",
    ordre: 67,
    corps: [
      {
        type: "paragraphe",
        texte:
          "À quelques jours de la Coupe du monde 2026, l’équipe de France s’est inclinée 2-1 face à la Côte d’Ivoire lors d’un match de préparation. Après l’ouverture du score de Rayan Cherki, les Éléphants ont renversé la rencontre grâce à Guéla Doué et Amad Diallo, décrochant une victoire historique face aux Bleus.",
      },
      {
        type: "paragraphe",
        texte:
          "Malgré une première période encourageante, les nombreux changements opérés en seconde mi-temps ont fragilisé le collectif français. Ce revers rappelle qu’aucune nation ne peut être sous-estimée dans une compétition mondiale.",
      },
      {
        type: "paragraphe",
        texte:
          "De son côté, la Côte d’Ivoire confirme sa montée en puissance avec une génération talentueuse et ambitieuse, capable de rivaliser avec les meilleures sélections.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour autant, les Bleus restent parmi les grands favoris du Mondial grâce à un effectif riche en talents, emmené notamment par Kylian Mbappé, Ousmane Dembélé et Rayan Cherki. Comme l’ont souligné plusieurs analyses de la presse internationale, cette défaite pourrait finalement constituer un avertissement bénéfique avant le début de la compétition.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/sport
  {
    slug: "ligue-des-champions-le-psg-prend-l-avantage-face-au-bayern-5-4",
    titre: "Ligue des champions : le PSG prend l’avantage face au Bayern (5-4).",
    chapeau:
      "Le Paris Saint-Germain a remporté une victoire précieuse face au Bayern Munich (5-4) lors du match aller des demi-finales de la Ligue des champions.",
    categorie: "sport",
    ordre: 78,
    auteur: "Rédaction Tripoint",
    corps: [
      {
        type: "paragraphe",
        texte:
          "Le Paris Saint-Germain a remporté une victoire précieuse face au Bayern Munich (5-4) lors du match aller des demi-finales de la Ligue des champions. Dans une rencontre spectaculaire et riche en rebondissements, les Parisiens ont su faire la différence offensivement.",
      },
      {
        type: "paragraphe",
        texte:
          "Rapidement en tête, le PSG a pris le contrôle du match jusqu’à mener avec plusieurs buts d’avance. Mais le Bayern, fidèle à son ADN, est revenu en fin de rencontre, réduisant l’écart et maintenant un suspense total avant le match retour.",
      },
      {
        type: "paragraphe",
        texte:
          "Avec neuf buts inscrits, cette confrontation s’impose déjà comme l’un des grands matchs de la saison. Malgré la victoire, Paris devra confirmer en Allemagne pour espérer décrocher son billet pour la finale.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/sport
  {
    slug: "immersion-avant-match-dans-les-coulisses-de-la-sg-moseltal-a-perl",
    titre: "Immersion avant match : dans les coulisses de la SG Moseltal à Perl.",
    chapeau:
      "À heures d’un rendez-vous important en championnat, Radio Tripoint est allée à la rencontre de la SG Moseltal, en pleine séance d’entraînement à Perl.",
    categorie: "sport",
    ordre: 84,
    corps: [
      {
        type: "paragraphe",
        texte:
          "À heures d’un rendez-vous important en championnat, Radio Tripoint est allée à la rencontre de la SG Moseltal, en pleine séance d’entraînement à Perl.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans une ambiance studieuse mais engagée, les joueurs ont enchaîné les exercices sous l’œil attentif du staff. Travail technique, intensité physique, communication… tous les ingrédients étaient réunis pour préparer au mieux le match de ce week-end.",
      },
      { type: "paragraphe", texte: "Une équipe concentrée sur son objectif." },
      {
        type: "paragraphe",
        texte:
          "Sur le terrain, l’état d’esprit est clair : sérieux, implication et envie de bien faire.",
      },
      {
        type: "paragraphe",
        texte:
          "La SG Moseltal aborde cette rencontre avec ambition, dans un championnat relevé où chaque point compte.",
      },
      {
        type: "paragraphe",
        texte:
          "Face à eux, une équipe mieux classée, ce qui donne encore plus d’enjeu à cette confrontation.",
      },
      {
        type: "paragraphe",
        texte:
          "En cas de victoire, les joueurs pourraient se rapprocher de la troisième place, un objectif important à ce stade de la saison.",
      },
      { type: "paragraphe", texte: "Une immersion au cœur du football local." },
      {
        type: "paragraphe",
        texte:
          "Cette immersion permet aussi de mettre en lumière le travail quotidien des clubs amateurs, véritables piliers du sport local dans la région des trois frontières.",
      },
      {
        type: "paragraphe",
        texte:
          "À Perl, le football est bien plus qu’un sport : c’est un moment de partage, de passion et de rassemblement.",
      },
      {
        type: "paragraphe",
        texte: "Le match se jouera ce samedi à 15h30 à Perl, près du lycée international.",
      },
      {
        type: "paragraphe",
        texte: "Un rendez-vous important pour la SG Moseltal… mais aussi pour tous les supporters.",
      },
      {
        type: "paragraphe",
        texte:
          "Si vous êtes passionnés de football ou simplement curieux de découvrir l’ambiance locale, n’hésitez pas à venir encourager cette équipe prometteuse.",
      },
    ],
  },
]
