import type { Article } from "@/types/article"

/**
 * Articles de la rubrique « actualites » repris de l'ancien site Webador
 * (texte intégral, sans les photos). L'ancien site n'affichait pas de date :
 * `ordre` reprend le rang d'apparition (1 = le plus récent).
 */
export const actualites: Article[] = [
  // Articles de la rédaction, 5 octobre 2026, d'après les visuels
  // d'information publiés par Radio Tripoint ce jour-là.
  {
    slug: "thionville-lycees-mobilisation-5-6-octobre-2026",
    titre: "Thionville : la mobilisation lycéenne se poursuit, ce qu’il faut retenir cette semaine",
    chapeau:
      "Lundi 5 octobre, la mobilisation lycéenne continue à Thionville. Mardi 6 octobre, une mobilisation générale est annoncée à l’échelle nationale, avec des blocages et rassemblements attendus, également à Thionville.",
    categorie: "actualites",
    publieLe: "2026-10-05T09:00:00+02:00",
    lieux: ["Thionville", "Moselle"],
    tags: ["lycées", "mobilisation", "éducation"],
    visuel: {
      src: "/media/articles/thionville-lycees-mobilisation-5-6-octobre-2026.webp",
      alt: "Visuel « Thionville, lycées : ce qu’il faut retenir cette semaine » : des élèves devant un lycée, avec le programme du lundi 5 et du mardi 6 octobre.",
      largeur: 576,
      hauteur: 1024,
    },
    corps: [
      { type: "intertitre", texte: "Aujourd’hui, lundi 5 octobre" },
      {
        type: "liste",
        elements: [
          "La mobilisation lycéenne se poursuit.",
          "La situation est à surveiller autour des établissements de Thionville.",
          "Des mesures de sécurité sont en place dans plusieurs communes de Moselle.",
        ],
      },
      { type: "intertitre", texte: "Demain, mardi 6 octobre" },
      {
        type: "liste",
        elements: [
          "Une mobilisation générale est annoncée à l’échelle nationale.",
          "Des blocages et rassemblements sont attendus, également à Thionville.",
        ],
      },
      {
        type: "paragraphe",
        texte:
          "Lycéens et parents : vérifiez les informations de votre établissement avant de vous déplacer.",
      },
    ],
    une: true,
  },
  {
    slug: "lu-alert-test-national-luxembourg-5-octobre-2026",
    titre: "Luxembourg : test national de LU-Alert ce lundi 5 octobre à 11 h",
    chapeau:
      "Le système d’alerte national LU-Alert est testé ce lundi 5 octobre à 11 h au Luxembourg. Votre téléphone peut sonner et vibrer : c’est uniquement un test, aucune action n’est nécessaire.",
    categorie: "actualites",
    publieLe: "2026-10-05T08:30:00+02:00",
    lieux: ["Luxembourg"],
    tags: ["LU-Alert", "alerte", "sécurité"],
    visuel: {
      src: "/media/articles/lu-alert-test-national-luxembourg-5-octobre-2026.webp",
      alt: "Visuel « Luxembourg, LU-Alert, test national, lundi 5 octobre, 11 h » : un téléphone affiche la notification « Test du système d’alerte national ».",
      largeur: 576,
      hauteur: 1024,
    },
    corps: [
      {
        type: "paragraphe",
        texte:
          "Ce lundi 5 octobre à 11 h, le Luxembourg teste son système d’alerte national, LU-Alert.",
      },
      { type: "intertitre", texte: "À quoi s’attendre" },
      {
        type: "liste",
        elements: [
          "Votre téléphone peut sonner et vibrer.",
          "Une notification apparaîtra sur votre téléphone, même en mode silencieux ou verrouillé.",
          "Le signal sonore durera quelques secondes.",
        ],
      },
      {
        type: "citation",
        texte: "C’est uniquement un test. Aucune action n’est nécessaire.",
      },
    ],
  },
  {
    slug: "perl-besch-kreuzung-gesperrt-5-16-octobre-2026",
    titre: "Perl-Besch : le carrefour fermé à toute circulation du 5 au 16 octobre",
    chapeau:
      "En raison de travaux, le carrefour de Besch, à Perl, est fermé à toute circulation depuis ce lundi 5 octobre, et ce jusqu’au 16 octobre (prévisionnel).",
    categorie: "actualites",
    publieLe: "2026-10-05T08:00:00+02:00",
    lieux: ["Perl", "Besch"],
    tags: ["travaux", "circulation", "route"],
    visuel: {
      src: "/media/articles/perl-besch-kreuzung-gesperrt-5-16-octobre-2026.webp",
      alt: "Visuel « Perl, Besch, Kreuzung gesperrt » : des barrières de chantier et une pelleteuse sur une route, avec les dates et le carrefour concerné.",
      largeur: 576,
      hauteur: 1024,
    },
    corps: [
      {
        type: "paragraphe",
        texte:
          "En raison de travaux, le carrefour de Besch, sur la commune de Perl, est fermé depuis ce lundi 5 octobre.",
      },
      { type: "intertitre", texte: "Ce qu’il faut savoir" },
      {
        type: "liste",
        elements: [
          "Fermeture à partir du lundi 5 octobre.",
          "Carrefour concerné : Deichstraße / Ruhbrück / Bischof-Walo-Straße, à Besch.",
          "Durée des travaux : du 5 au 16 octobre (prévisionnel).",
          "Fermeture totale, pour toute la circulation.",
        ],
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "leon-xiv-a-metz-une-journee-historique-au-coeur-de-l-europe",
    titre: "Léon XIV à Metz : une journée historique au cœur de l’Europe.",
    chapeau:
      "Metz a vécu, lundi 28 septembre, une journée exceptionnelle avec la venue du pape Léon XIV, pour la dernière étape de son voyage apostolique en France.",
    categorie: "actualites",
    ordre: 1,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Metz a vécu, lundi 28 septembre, une journée exceptionnelle avec la venue du pape Léon XIV, pour la dernière étape de son voyage apostolique en France. Une visite placée sous le signe de la paix, du dialogue et de l’unité européenne.",
      },
      {
        type: "paragraphe",
        texte:
          "Arrivé à Metz dans la matinée, le souverain pontife s’est rendu au Centre des Congrès Robert Schuman pour une rencontre interreligieuse, avant de participer à une rencontre consacrée aux « racines de l’Europe pour la paix et l’unité ». Le choix de Metz revêtait une forte dimension symbolique, la ville étant intimement liée à l’histoire européenne et à la mémoire de Robert Schuman.",
      },
      { type: "intertitre", texte: "Une rencontre au cœur de la Grande Région" },
      {
        type: "paragraphe",
        texte:
          "Autour du pape et du président Emmanuel Macron, plusieurs personnalités européennes avaient fait le déplacement. Parmi elles figuraient le Grand-Duc Guillaume et la Grande-Duchesse Stéphanie de Luxembourg, le Premier ministre luxembourgeois Luc Frieden, le prince Albert II et la princesse Charlène de Monaco, ainsi que la ministre-présidente de la Sarre, Anke Rehlinger. L’ancien président de la Commission européenne Jean-Claude Juncker était également présent.",
      },
      {
        type: "paragraphe",
        texte:
          "Une représentation particulièrement forte pour un territoire comme le nôtre, où France, Luxembourg et Allemagne se côtoient au quotidien.",
      },
      { type: "intertitre", texte: "Une messe à la cathédrale Saint-Étienne" },
      {
        type: "paragraphe",
        texte:
          "L’après-midi, Léon XIV a rejoint la cathédrale Saint-Étienne pour célébrer la messe, devant de nombreux fidèles. Emmanuel Macron, qui ne devait initialement pas assister à la célébration, a finalement participé à la cérémonie.",
      },
      {
        type: "paragraphe",
        texte:
          "De la rencontre avec les responsables religieux au discours consacré à l’Europe, jusqu’à la célébration à la cathédrale, cette journée messine aura mêlé spiritualité, histoire et dimension européenne.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour Metz et, plus largement, pour la Grande Région, la venue de Léon XIV restera comme un moment particulièrement marquant de cette année 2026.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "le-pape-a-30-km-de-chez-nous-pourquoi-leon-xiv-a-choisi-metz-pour-parler-de",
    titre:
      "Le Pape à 30 km de chez nous : Pourquoi Léon XIV a choisi Metz pour parler de paix aux Trois Frontières.",
    chapeau: "Metz accueille le pape Léon XIV le lundi 28 septembre 2026.",
    categorie: "actualites",
    ordre: 2,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Metz accueille le pape Léon XIV le lundi 28 septembre 2026. C'est la dernière étape de son premier grand voyage apostolique en France, qui se déroule du vendredi 25 au lundi 28 septembre 2026.",
      },
      {
        type: "paragraphe",
        texte: "Après Paris et Lourdes, c'est Metz qui a été choisie. Et ce n'est pas un hasard.",
      },
      {
        type: "intertitre",
        texte: "Une région meurtrie par les guerres, devenue symbole de réconciliation",
      },
      {
        type: "paragraphe",
        texte:
          "Au 4ème jour de son voyage apostolique en France, Léon XIV a choisi Metz pour y prononcer un discours sur les racines de l’Europe, pour la paix et l’unité.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette région frontalière entre la France et l’Allemagne, meurtrie par les guerres, incarne aujourd’hui la rencontre et la réconciliation. Un message qui parle directement aux habitants de Sierck-les-Bains, Perl, Schengen et Apach, qui traversent ces frontières tous les jours.",
      },
      {
        type: "paragraphe",
        texte:
          "Selon les informations du programme officiel publié par le Saint-Siège, le pape arrivera à Paris le vendredi 25 septembre au matin et quittera la France le lundi 28 septembre au soir depuis l’aéroport de Metz-Nancy-Lorraine.",
      },
      { type: "intertitre", texte: "Un détail qui résume tout" },
      {
        type: "paragraphe",
        texte:
          "À Metz, la visite du pape se déroulera sous le sceau de l’Europe et de la paix. Un symbole fort a déjà filtré : le Pape devrait servir la messe sur un autel fait avec le bronze d’anciens canons allemands. Des armes transformées en autel de paix, à quelques kilomètres de chez nous.",
      },
      { type: "intertitre", texte: "Vous voulez y aller depuis les Trois Frontières?" },
      {
        type: "paragraphe",
        texte:
          "C'est l'événement le plus proche de nous depuis des années. Voici les infos pratiques pour lundi :",
      },
      {
        type: "liste",
        elements: [
          "Depuis Sierck-les-Bains / Perl : Comptez 35 à 45 minutes en voiture vers Metz. Privilégiez le covoiturage et les parkings relais, une énorme organisation logistique est prévue.",
          "En train : Liaison TER depuis Apach et Bouzonville.",
          "Si vous ne pouvez pas vous déplacer : L'événement sera à suivre en direct sur KTO, qui retransmet toutes les étapes.",
        ],
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "carburant-5-astuces-pour-reduire-ses-depenses-quand-on-habite-pres-de-la",
    titre: "CARBURANT : 5 ASTUCES POUR RÉDUIRE SES DÉPENSES QUAND ON HABITE PRÈS DE LA FRONTIÈRE.",
    chapeau: "Le prix du carburant pèse de plus en plus lourd dans le budget des ménages.",
    categorie: "actualites",
    ordre: 3,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Le prix du carburant pèse de plus en plus lourd dans le budget des ménages. Pour les habitants de la Grande Région, qui traversent régulièrement la frontière pour travailler, faire leurs courses ou accompagner leurs enfants, la voiture reste souvent difficile à éviter. Mais quelques habitudes peuvent permettre de réduire la facture.",
      },
      {
        type: "intertitre",
        texte: "1. Faire quelques kilomètres de plus pour faire le plein au Luxembourg",
      },
      {
        type: "paragraphe",
        texte:
          "Pour les habitants du secteur des Trois Frontières, le Luxembourg peut représenter une alternative intéressante pour le carburant. Selon les périodes et les différences de prix, faire quelques kilomètres supplémentaires peut permettre de réaliser des économies.",
      },
      {
        type: "paragraphe",
        texte:
          "Mais attention : il faut toujours calculer le coût du trajet supplémentaire. Faire 20 kilomètres de plus uniquement pour économiser quelques centimes par litre n’est pas forcément rentable.",
      },
      { type: "intertitre", texte: "2. Se mettre au vélo… lorsque la distance le permet" },
      {
        type: "paragraphe",
        texte:
          "Pour les petits trajets du quotidien, le vélo peut être une véritable alternative à la voiture.",
      },
      {
        type: "paragraphe",
        texte:
          "Aller chercher du pain, se rendre au travail lorsque celui-ci est proche, accompagner les enfants ou effectuer certains déplacements locaux à vélo permet de réduire directement sa consommation de carburant.",
      },
      {
        type: "paragraphe",
        texte:
          "Et pour les plus longues distances, le vélo à assistance électrique peut également élargir les possibilités.",
      },
      { type: "intertitre", texte: "3. Penser au covoiturage" },
      {
        type: "paragraphe",
        texte:
          "Quand plusieurs personnes effectuent chaque jour le même trajet, pourquoi ne pas partager la voiture ?",
      },
      {
        type: "paragraphe",
        texte:
          "Le covoiturage permet de répartir les frais de carburant, mais aussi de réduire le nombre de véhicules sur les routes.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans les zones transfrontalières, où de nombreux travailleurs parcourent quotidiennement les mêmes axes entre la France, l’Allemagne et le Luxembourg, cette solution peut être particulièrement intéressante.",
      },
      { type: "intertitre", texte: "4. Privilégier les transports en commun" },
      {
        type: "paragraphe",
        texte:
          "Bus, trains et réseaux transfrontaliers peuvent également permettre de laisser la voiture au garage.",
      },
      {
        type: "paragraphe",
        texte:
          "Selon le lieu de résidence et le lieu de travail, combiner plusieurs moyens de transport peut parfois être plus économique que d’effectuer quotidiennement l’intégralité du trajet en voiture.",
      },
      {
        type: "paragraphe",
        texte:
          "Une habitude simple à prendre : comparer régulièrement le coût d’un trajet en voiture avec celui d’un abonnement ou d’un billet de transport en commun.",
      },
      { type: "intertitre", texte: "5. Parler du télétravail avec son employeur" },
      {
        type: "paragraphe",
        texte:
          "Lorsque le métier le permet, le télétravail peut également avoir un impact direct sur le budget carburant.",
      },
      {
        type: "paragraphe",
        texte:
          "Une ou deux journées de télétravail par semaine peuvent représenter plusieurs trajets en moins chaque mois. Pour les travailleurs transfrontaliers qui parcourent parfois plusieurs dizaines de kilomètres quotidiennement, l’économie peut rapidement devenir significative.",
      },
      {
        type: "paragraphe",
        texte:
          "Bien évidemment, la possibilité de télétravailler dépend du métier, de l’entreprise et des règles applicables au salarié transfrontalier.",
      },
      { type: "intertitre", texte: "Au final : chaque trajet évité compte" },
      {
        type: "paragraphe",
        texte:
          "Face à l’évolution du prix du carburant, il n’existe pas forcément une solution unique. C’est souvent l’accumulation de petits changements qui permet de réduire la facture : choisir où faire le plein, partager ses trajets, utiliser davantage les transports en commun ou encore limiter certains déplacements en voiture.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans une région où les frontières sont traversées quotidiennement, repenser ses déplacements peut donc devenir un véritable enjeu économique pour les ménages.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "jeunesse-europeenne-entre-inquietude-et-espoir-pour-l-avenir",
    titre: "Jeunesse européenne : entre inquiétude et espoir pour l’avenir.",
    chapeau:
      "Coût de la vie, emploi, climat, sécurité… les jeunes Européens sont nombreux à regarder l’avenir avec une certaine inquiétude.",
    categorie: "actualites",
    ordre: 4,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Coût de la vie, emploi, climat, sécurité… les jeunes Européens sont nombreux à regarder l’avenir avec une certaine inquiétude. Mais cette génération ne renonce pas pour autant à l’espoir.",
      },
      {
        type: "paragraphe",
        texte:
          "Être jeune en Europe aujourd’hui, c’est aussi devoir se projeter dans un contexte marqué par de nombreuses incertitudes. Les enquêtes européennes montrent que le coût de la vie, l’environnement, l’emploi et les questions de sécurité occupent une place importante dans les préoccupations des 16-30 ans. Dans le dernier Eurobaromètre consacré à la jeunesse, 40 % citent notamment la hausse des prix et le coût de la vie parmi leurs principales préoccupations pour l’avenir.",
      },
      {
        type: "paragraphe",
        texte:
          "Le climat reste également un sujet majeur, tout comme l’accès à l’emploi et au logement. Les jeunes interrogés souhaitent notamment que l’Europe agisse davantage sur l’économie, la création d’emplois, l’environnement et la protection sociale.",
      },
      {
        type: "paragraphe",
        texte:
          "Mais derrière ces inquiétudes, il existe aussi une véritable volonté de croire en l’avenir. Les données européennes les plus récentes montrent que les 15-30 ans restent parmi les générations les plus favorables au projet européen. Dans l’Eurobaromètre de l’automne 2025, 65 % des jeunes se déclaraient optimistes quant à l’avenir de l’Union européenne et 80 % concernant leur propre avenir et celui de leur famille.",
      },
      { type: "intertitre", texte: "Et dans la Grande Région ?" },
      {
        type: "paragraphe",
        texte:
          "En France, en Allemagne et au Luxembourg, ces questions prennent une dimension particulière. Étudier, trouver un emploi, se loger, traverser les frontières ou construire une vie de famille sont des réalités quotidiennes pour de nombreux jeunes de notre territoire.",
      },
      {
        type: "paragraphe",
        texte:
          "Alors, de quoi les jeunes de la Grande Région ont-ils réellement peur ? Et qu’est-ce qui leur donne encore confiance dans l’avenir ?",
      },
      {
        type: "paragraphe",
        texte:
          "C’est aussi le rôle d’une radio de proximité comme Radio Tripoint : écouter cette génération, comprendre ses préoccupations et lui donner la parole.",
      },
      {
        type: "paragraphe",
        texte: "Une jeunesse inquiète, peut-être. Mais certainement pas une jeunesse sans espoir.",
      },
      {
        type: "paragraphe",
        texte: "Sources : Eurobaromètre – Commission européenne / Parlement européen.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "ce-qu-il-fallait-retenir-du-discours-sur-l-europe",
    titre: "CE QU’IL FALLAIT RETENIR DU DISCOURS SUR L’EUROPE.",
    chapeau: "Strasbourg le 16 septembre 2026.",
    categorie: "actualites",
    ordre: 5,
    corps: [
      { type: "intertitre", texte: "Les 10 points à retenir du discours d’Ursula von der Leyen" },
      {
        type: "paragraphe",
        texte:
          "Strasbourg le 16 septembre 2026.\nDevant le Parlement européen, la présidente de la Commission européenne Ursula von der Leyen a présenté son discours annuel sur l’état de l’Union. Pendant environ une heure, elle a détaillé les priorités de l’Europe pour l’année à venir : économie, sécurité, énergie, climat, Ukraine, frontières, intelligence artificielle ou encore protection des enfants en ligne.",
      },
      { type: "paragraphe", texte: "Voici les dix points essentiels à retenir." },
      { type: "intertitre", texte: "1. Une Europe qui veut davantage agir par elle-même" },
      {
        type: "paragraphe",
        texte:
          "Le fil conducteur du discours est celui d’une Europe plus indépendante et capable de défendre ses propres intérêts.",
      },
      {
        type: "paragraphe",
        texte:
          "Ursula von der Leyen a notamment insisté sur la nécessité de réduire certaines dépendances stratégiques, de renforcer l’industrie européenne et de développer les capacités européennes dans des secteurs clés.",
      },
      { type: "intertitre", texte: "2. Compétitivité et simplification pour les entreprises" },
      {
        type: "paragraphe",
        texte: "La Commission veut poursuivre la simplification du marché intérieur.",
      },
      {
        type: "paragraphe",
        texte:
          "Parmi les annonces : accélération des procédures administratives, mesures concernant les banques et création d’une structure européenne consacrée aux matières premières critiques, nécessaires notamment aux voitures électriques, aux batteries, aux semi-conducteurs, aux technologies propres et à la défense.",
      },
      {
        type: "paragraphe",
        texte:
          "L’objectif annoncé est également d’achever la réforme du marché unique sur la base de la feuille de route « Une Europe, un marché ».",
      },
      { type: "intertitre", texte: "3. Logement, emploi et protection sociale" },
      {
        type: "paragraphe",
        texte: "Le discours a également porté sur la vie quotidienne des Européens.",
      },
      {
        type: "paragraphe",
        texte:
          "Ursula von der Leyen a annoncé un futur acte sur les emplois de qualité, destiné notamment aux compétences et à la qualité des emplois, ainsi qu’un European Care Deal, consacré aux enjeux liés au vieillissement de la population.",
      },
      {
        type: "paragraphe",
        texte: "Le logement figure également parmi les priorités européennes.",
      },
      { type: "intertitre", texte: "4. L’Europe veut accélérer sur l’intelligence artificielle" },
      {
        type: "paragraphe",
        texte: "L’IA occupe une place importante dans la stratégie européenne.",
      },
      {
        type: "paragraphe",
        texte:
          "La Commission veut notamment renforcer les coopérations avec des partenaires comme le Canada et le Royaume-Uni et développer l’utilisation de l’IA dans plusieurs secteurs : santé, transports, agriculture et alimentation, industrie, défense et espace.",
      },
      {
        type: "intertitre",
        texte: "5. Climat, chaleur et eau : l’adaptation devient une priorité",
      },
      {
        type: "paragraphe",
        texte: "Le changement climatique a également été abordé sous l’angle de l’adaptation.",
      },
      {
        type: "paragraphe",
        texte:
          "La Commission prévoit notamment un plan européen contre les vagues de chaleur, une initiative européenne sur l’eau et un nouveau cadre consacré à la résilience climatique.",
      },
      {
        type: "paragraphe",
        texte:
          "Un dispositif doit notamment identifier les territoires européens les plus exposés aux risques climatiques.",
      },
      { type: "intertitre", texte: "6. Une nouvelle architecture de sécurité européenne" },
      { type: "paragraphe", texte: "C’est l’un des points majeurs du discours." },
      {
        type: "paragraphe",
        texte:
          "Ursula von der Leyen a annoncé une nouvelle stratégie européenne de sécurité, ainsi qu’un mécanisme d’urgence permettant aux États membres de coordonner leur réponse face à certaines menaces.",
      },
      {
        type: "paragraphe",
        texte:
          "Elle a également proposé la création d’un Conseil européen de sécurité, avec une coopération envisagée notamment avec le Canada, la Norvège, le Royaume-Uni et l’Ukraine.",
      },
      { type: "intertitre", texte: "7. L’Ukraine reste une priorité" },
      {
        type: "paragraphe",
        texte: "La Commission veut poursuivre son soutien à l’Ukraine, notamment pendant l’hiver.",
      },
      {
        type: "paragraphe",
        texte:
          "Ursula von der Leyen a évoqué l’aide humanitaire et énergétique, mais également le développement d’un mécanisme de défense antimissile avec l’Ukraine.",
      },
      {
        type: "paragraphe",
        texte:
          "Elle a aussi annoncé vouloir maintenir la pression sur la Russie à travers les sanctions et lutter contre leur contournement.",
      },
      { type: "intertitre", texte: "8. Des frontières européennes davantage coordonnées" },
      {
        type: "paragraphe",
        texte: "La migration et la protection des frontières ont occupé une place importante.",
      },
      {
        type: "paragraphe",
        texte:
          "La Commission souhaite poursuivre la mise en œuvre du Pacte européen sur la migration et l’asile, renforcer Frontex et améliorer les systèmes d’alerte.",
      },
      {
        type: "paragraphe",
        texte:
          "Un nouveau cadre européen d’intervention d’urgence est également prévu pour certaines situations exceptionnelles aux frontières extérieures.",
      },
      { type: "intertitre", texte: "9. Protéger davantage les enfants sur les réseaux sociaux" },
      {
        type: "paragraphe",
        texte: "C’est l’une des annonces qui pourrait avoir un impact direct sur les familles.",
      },
      {
        type: "paragraphe",
        texte:
          "La Commission prévoit de présenter le EU Kids Act, avec notamment une approche par âge concernant l’accès aux réseaux sociaux.",
      },
      {
        type: "paragraphe",
        texte:
          "Selon les propositions présentées dans le discours, pas de réseaux sociaux avant 13 ans, et pas de comptes personnels avant 15 ans, avec des dispositifs spécifiques pour les adolescents de 13 à 15 ans.",
      },
      {
        type: "paragraphe",
        texte:
          "La Commission veut également renforcer les obligations des plateformes concernant la sécurité des mineurs.",
      },
      {
        type: "intertitre",
        texte: "10. Le Canada pourrait devenir le premier « membre associé » de l’Union européenne",
      },
      {
        type: "paragraphe",
        texte: "C’est probablement l’une des annonces les plus remarquées du discours.",
      },
      {
        type: "paragraphe",
        texte:
          "En présence du Premier ministre canadien Mark Carney, Ursula von der Leyen a proposé d’ouvrir la voie à un statut de premier membre associé de l’Union européenne pour le Canada.",
      },
      {
        type: "paragraphe",
        texte:
          "L’idée serait notamment de renforcer les coopérations économiques, technologiques et industrielles ainsi que les liens dans le domaine de la défense.",
      },
      { type: "intertitre", texte: "Et après ?" },
      {
        type: "paragraphe",
        texte:
          "Au-delà des annonces, le discours de Strasbourg donne une direction pour les prochains mois : compétitivité, sécurité, indépendance stratégique, transition climatique, protection sociale et défense des valeurs européennes.",
      },
      {
        type: "paragraphe",
        texte:
          "Certaines mesures annoncées devront encore être présentées sous forme de propositions législatives et suivre le processus de décision de l’Union européenne. Elles ne constituent donc pas toutes des règles immédiatement applicables.",
      },
      { type: "intertitre", texte: "À retenir" },
      {
        type: "paragraphe",
        texte:
          "Une Europe qui cherche à être plus compétitive, plus autonome et davantage capable de répondre aux crises, tout en renforçant ses politiques sociales et la protection de ses citoyens.",
      },
      {
        type: "paragraphe",
        texte:
          "Article réalisé à partir du discours sur l’état de l’Union prononcé le 16 septembre 2026 et des documents officiels de la Commission européenne.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "la-chance-d-etre-transfrontalier-surtout-quand-on-passe-a-la-pompe",
    titre: "La chance d’être transfrontalier… surtout quand on passe à la pompe.",
    chapeau:
      "France, Luxembourg, Allemagne : quand on habite au cœur des Trois Frontières, quelques kilomètres peuvent parfois faire une vraie différence au moment de faire le plein.",
    categorie: "actualites",
    ordre: 6,
    corps: [
      {
        type: "paragraphe",
        texte:
          "France, Luxembourg, Allemagne : quand on habite au cœur des Trois Frontières, quelques kilomètres peuvent parfois faire une vraie différence au moment de faire le plein.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour les automobilistes du territoire, le passage à la pompe est devenu un véritable sujet de consommation. Et être transfrontalier offre un avantage concret : pouvoir comparer les prix et choisir de quel côté de la frontière faire son plein.",
      },
      { type: "intertitre", texte: "Le Luxembourg reste particulièrement attractif" },
      {
        type: "paragraphe",
        texte: "Au 16 septembre 2026, les prix relevés au Luxembourg affichent notamment :",
      },
      {
        type: "liste",
        elements: ["Diesel : 2,123 €/L", "Super 95 : 1,898 €/L", "Super 98 : 2,128 €/L"],
      },
      {
        type: "paragraphe",
        texte:
          "À quelques kilomètres de là, dans la région de la Sarre, les tarifs observés sont plus élevés, avec environ 2,40 €/L pour le diesel et 2,26 €/L pour l’E10.",
      },
      {
        type: "paragraphe",
        texte:
          "Sur un plein de 50 litres, la différence peut donc rapidement représenter plusieurs euros.",
      },
      {
        type: "paragraphe",
        texte:
          "En prenant ces niveaux de prix comme référence, cela représente environ 14 € d’écart sur 50 litres de diesel et autour de 18 € sur 50 litres d’essence.",
      },
      { type: "intertitre", texte: "Et côté français ?" },
      {
        type: "paragraphe",
        texte:
          "Pour les habitants du Pays des Trois Frontières, la France reste évidemment une possibilité supplémentaire. Mais les écarts de prix entre les stations, les enseignes et les pays peuvent être importants.",
      },
      {
        type: "paragraphe",
        texte:
          "C’est justement là que la situation géographique des habitants de notre territoire devient intéressante : France, Luxembourg et Allemagne sont accessibles en quelques minutes.",
      },
      {
        type: "paragraphe",
        texte:
          "Un automobiliste qui connaît les prix pratiqués de l’autre côté de la frontière peut donc adapter ses habitudes et, selon son trajet, faire le plein là où le prix lui paraît le plus intéressant.",
      },
      { type: "paragraphe", texte: "Une vraie particularité du territoire." },
      {
        type: "paragraphe",
        texte:
          "Cette situation est particulièrement visible autour de Schengen, Perl, Remich, Sierck-les-Bains et du secteur des Trois Frontières.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour un habitant qui travaille, fait ses courses ou se déplace régulièrement dans les trois pays, la frontière n’est pas seulement une ligne sur une carte : elle peut aussi devenir un élément concret dans les choix de consommation du quotidien.",
      },
      {
        type: "paragraphe",
        texte:
          "Et avec les fluctuations du prix du pétrole et les évolutions des marchés de l’énergie, les tarifs peuvent continuer à évoluer.",
      },
      { type: "intertitre", texte: "Alors, faut-il systématiquement traverser la frontière ?" },
      { type: "paragraphe", texte: "Pas forcément." },
      {
        type: "paragraphe",
        texte:
          "Le prix affiché n’est qu’un élément à prendre en compte : le détour, la distance parcourue et le temps nécessaire peuvent réduire l’intérêt économique d’un déplacement spécialement effectué pour acheter du carburant.",
      },
      {
        type: "paragraphe",
        texte:
          "Mais pour les transfrontaliers qui passent déjà quotidiennement d’un pays à l’autre, la comparaison peut avoir tout son sens.",
      },
      {
        type: "paragraphe",
        texte:
          "C’est aussi ça, être transfrontalier : avoir trois pays à portée de route… et parfois trois marchés à comparer.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "de-la-france-a-l-europe-l-histoire-des-journees-du-patrimoine",
    titre: "De la France à l’Europe : l’histoire des Journées du patrimoine.",
    chapeau:
      "Chaque année, au mois de septembre, des millions de personnes franchissent les portes de monuments, de musées, de sites historiques ou de lieux exceptionnellement ouverts au public.",
    categorie: "actualites",
    ordre: 7,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Chaque année, au mois de septembre, des millions de personnes franchissent les portes de monuments, de musées, de sites historiques ou de lieux exceptionnellement ouverts au public. Mais derrière ce rendez-vous devenu incontournable se cache une histoire qui commence… en France.",
      },
      {
        type: "paragraphe",
        texte:
          "Le 23 septembre 1984, le ministère de la Culture, alors dirigé par Jack Lang, organise la première « Journée portes ouvertes dans les monuments historiques ». Le principe est simple : permettre au public de découvrir des lieux et un patrimoine parfois difficilement accessibles le reste de l’année. Le succès est immédiat.",
      },
      {
        type: "paragraphe",
        texte:
          "Un an plus tard, en 1985, Jack Lang propose d’étendre cette initiative à l’échelle européenne lors d’une conférence des ministres européens de la Culture organisée à Grenade par le Conseil de l’Europe. Plusieurs pays suivent alors le mouvement.",
      },
      {
        type: "paragraphe",
        texte:
          "En 1991, le Conseil de l’Europe officialise les Journées européennes du patrimoine. Depuis 1999, l’initiative est devenue une action conjointe du Conseil de l’Europe et de la Commission européenne. Aujourd’hui, elle rassemble les pays signataires de la Convention culturelle européenne autour d’un même objectif : faire découvrir et vivre le patrimoine commun européen.",
      },
      { type: "intertitre", texte: "Et chez nous ?" },
      {
        type: "paragraphe",
        texte:
          "Dans le Pays des Trois Frontières, ces journées prennent une résonance particulière.",
      },
      {
        type: "paragraphe",
        texte:
          "Ici, le patrimoine ne s’arrête pas à une frontière. Il raconte des histoires françaises, luxembourgeoises et allemandes, des échanges, des traditions, des paysages et une mémoire commune.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour leur 43ᵉ édition, les Journées européennes du patrimoine auront lieu les 19 et 20 septembre 2026 en France. Deux thèmes sont mis à l’honneur cette année : « Patrimoine de la photographie » et « Patrimoine en péril : raviver, résister, réimaginer ».",
      },
      {
        type: "paragraphe",
        texte:
          "Deux jours pour découvrir ce qui nous entoure, comprendre ce qui nous a construits et transmettre ce que nous voulons préserver.",
      },
      {
        type: "paragraphe",
        texte: "Parce que connaître son patrimoine, c’est aussi comprendre son territoire.",
      },
      { type: "paragraphe", texte: "Radio Tripoint — La radio transfrontalière" },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "11-septembre-l-amerique-commemore-les-25-ans-des-attentats",
    titre: "11 SEPTEMBRE — L’AMÉRIQUE COMMÉMORE LES 25 ANS DES ATTENTATS",
    chapeau: "New York, 11 septembre 2026.",
    categorie: "actualites",
    ordre: 9,
    corps: [
      {
        type: "intertitre",
        texte: "Souvenez-vous… 25 ans après, les États-Unis rendent hommage aux victimes",
      },
      {
        type: "paragraphe",
        texte:
          "New York, 11 septembre 2026.\nVingt-cinq ans après les attentats du 11 septembre 2001, les États-Unis commémorent aujourd’hui l’une des journées les plus marquantes de leur histoire contemporaine.",
      },
      {
        type: "paragraphe",
        texte:
          "À New York, au 9/11 Memorial, les familles des victimes se sont réunies pour la cérémonie du 25e anniversaire. Les noms des personnes tuées lors des attentats du 11 septembre 2001 et de l’attentat de 1993 contre le World Trade Center sont lus à voix haute par leurs proches. Plusieurs moments de silence rythment la cérémonie, en hommage aux victimes.",
      },
      {
        type: "paragraphe",
        texte:
          "Près de 3 000 personnes ont perdu la vie le 11 septembre 2001, lorsque quatre avions détournés par des membres d’Al-Qaïda ont été utilisés dans les attaques contre le World Trade Center à New York, le Pentagone et un quatrième appareil s’est écrasé en Pennsylvanie.",
      },
      { type: "intertitre", texte: "Une journée de mémoire" },
      {
        type: "paragraphe",
        texte:
          "À New York, les cérémonies se poursuivent tout au long de la journée. Le mémorial rappelle les noms des victimes, tandis que les hommages se multiplient à travers le pays.",
      },
      {
        type: "paragraphe",
        texte:
          "À la tombée de la nuit, les deux faisceaux lumineux du « Tribute in Light » doivent à nouveau illuminer le ciel de Manhattan, symbolisant les anciennes tours jumelles et rendant hommage à celles et ceux qui ont disparu.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette année revêt une dimension particulière : 25 ans après les attentats, une nouvelle génération est désormais trop jeune pour avoir connu cette journée. Le 9/11 Memorial souligne ainsi l’importance de transmettre cette mémoire et son histoire.",
      },
      { type: "intertitre", texte: "De New York à Washington, l’Amérique se souvient" },
      {
        type: "paragraphe",
        texte:
          "Des cérémonies sont également organisées au Pentagone, où 184 personnes ont été tuées, ainsi qu’en Pennsylvanie, sur le lieu où s’est écrasé le vol United Airlines 93. Des hommages sont organisés à travers tout le pays.",
      },
      {
        type: "paragraphe",
        texte:
          "Vingt-cinq ans après, les images du 11 septembre restent profondément ancrées dans la mémoire collective.",
      },
      { type: "paragraphe", texte: "Aujourd’hui, l’Amérique commémore.\nEt le monde se souvient." },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "des-sirenes-entendues-en-allemagne-pas-de-panique",
    titre: "Des sirènes entendues en Allemagne : pas de panique !",
    chapeau:
      "Vous avez entendu des sirènes ou reçu une alerte sur votre téléphone ce jeudi matin ?",
    categorie: "actualites",
    ordre: 10,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Vous avez entendu des sirènes ou reçu une alerte sur votre téléphone ce jeudi matin ? Pas d’inquiétude.",
      },
      {
        type: "paragraphe",
        texte:
          "Ce jeudi 10 septembre 2026, l’Allemagne organisait son Bundesweiter Warntag, la journée nationale de test des systèmes d’alerte de la population.",
      },
      {
        type: "paragraphe",
        texte:
          "À partir de 11h, une alerte test a été diffusée à travers différents dispositifs : téléphones portables, applications d’alerte, médias, sirènes et autres moyens locaux. Un signal qui a également pu être entendu de l’autre côté de la frontière, notamment dans les secteurs français proches de l’Allemagne.",
      },
      {
        type: "paragraphe",
        texte:
          "L’objectif ? Vérifier que les différents systèmes fonctionnent correctement et que la chaîne d’alerte est opérationnelle en cas de véritable situation d’urgence. L’exercice permet également d’identifier d’éventuels problèmes afin d’améliorer le dispositif.",
      },
      {
        type: "paragraphe",
        texte:
          "Aucune action n’était demandée à la population : il s’agissait uniquement d’un test.",
      },
      {
        type: "paragraphe",
        texte: "Une alerte de fin d’exercice devait être diffusée vers 11h45.",
      },
      { type: "paragraphe", texte: "Radio Tripoint, votre média transfrontalier." },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "naturdenkmal-quand-un-arbre-devient-un-monument-naturel",
    titre: "« Naturdenkmal » : quand un arbre devient un monument naturel.",
    chapeau: "Vous avez peut-être déjà croisé ce panneau sans savoir ce qu’il signifie?",
    categorie: "actualites",
    ordre: 11,
    corps: [
      {
        type: "paragraphe",
        texte: "Vous avez peut-être déjà croisé ce panneau sans savoir ce qu’il signifie?",
      },
      {
        type: "paragraphe",
        texte:
          "Sur certains arbres remarquables en Allemagne, un panneau triangulaire vert et blanc portant la mention « Naturdenkmal » littéralement « monument naturel » signale que l’arbre bénéficie d’un statut particulier.",
      },
      { type: "intertitre", texte: "Mais pourquoi protéger un arbre individuellement ?" },
      {
        type: "paragraphe",
        texte:
          "Parce que certains arbres constituent de véritables éléments du patrimoine naturel local. Leur âge, leur taille, leur rareté, leur forme exceptionnelle ou encore leur importance écologique ou historique peuvent justifier leur classement comme monument naturel.",
      },
      {
        type: "paragraphe",
        texte: "Un arbre peut ainsi devenir un véritable témoin de l’histoire d’un territoire.",
      },
      {
        type: "paragraphe",
        texte:
          "La protection des arbres remarquables en Allemagne ne date pas d’hier. Dès 1906, la Prusse crée une première institution dédiée aux « monuments naturels ». Le principe est ensuite renforcé par la législation allemande, notamment en 1935.",
      },
      {
        type: "paragraphe",
        texte:
          "Aujourd’hui, les Naturdenkmäler sont protégés par le billet 28 de la loi fédérale allemande sur la protection de la nature.",
      },
      { type: "intertitre", texte: "Et chez nous ?" },
      {
        type: "paragraphe",
        texte:
          "Dans notre secteur, ces arbres protégés sont loin d’être rares. Merzig compte par exemple 5 Naturdenkmäler, principalement des arbres remarquables. À Perl, plusieurs chênes, hêtres, tilleuls et platanes bénéficient également de cette protection.",
      },
      {
        type: "paragraphe",
        texte:
          "Alors, la prochaine fois que vous croisez ce panneau « Naturdenkmal », prenez le temps de regarder l’arbre : il fait peut-être partie du patrimoine naturel de notre territoire.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "sierck-plage-clap-de-fin-pour-un-ete-place-sous-le-signe-de-la-convivialite",
    titre: "Sierck Plage : clap de fin pour un été placé sous le signe de la convivialité.",
    chapeau: "Sierck-les-Bains.",
    categorie: "actualites",
    ordre: 12,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Sierck-les-Bains. Le rendez-vous estival Sierck Plage s’est achevé dans une ambiance chaleureuse et conviviale, réunissant habitants, visiteurs et acteurs locaux autour d’un dernier moment de partage.",
      },
      {
        type: "paragraphe",
        texte:
          "Au programme de cette clôture : concerts, détente, restauration et produits du terroir, dans un cadre particulièrement agréable. Installé sur les espaces verts, le public a profité de la fin de journée entre tables, transats et musique, dans une atmosphère typiquement estivale.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette dernière journée a également été l’occasion de croiser plusieurs élus locaux, venus partager ce moment avec les organisateurs et le public. La maire de Sierck-les-Bains, accompagnée de plusieurs membres du conseil municipal, avait notamment fait le déplacement.",
      },
      {
        type: "paragraphe",
        texte:
          "Au-delà des animations, Sierck Plage aura une nouvelle fois permis de créer un véritable lieu de rencontre et de proximité, mettant à l’honneur la convivialité et le dynamisme de la commune.",
      },
      {
        type: "paragraphe",
        texte:
          "Avec ce dernier rendez-vous, Sierck Plage referme donc sa parenthèse estivale sur une belle note, entre musique, terroir et rencontres.",
      },
      {
        type: "paragraphe",
        texte: "Une façon bien sympathique de dire au revoir à l’été à Sierck-les-Bains.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "ces-lieux-spirituels-de-la-grande-region-que-vous-ne-connaissez-peut-etre-pas",
    titre: "Ces lieux spirituels de la Grande Région que vous ne connaissez peut-être pas.",
    chapeau:
      "La Grande Région est souvent racontée à travers ses paysages, ses villages, ses vignobles ou encore son histoire transfrontalière.",
    categorie: "actualites",
    ordre: 16,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La Grande Région est souvent racontée à travers ses paysages, ses villages, ses vignobles ou encore son histoire transfrontalière. Mais elle possède aussi un patrimoine spirituel particulièrement riche, parfois discret, parfois mystérieux, qui mérite d’être redécouvert.",
      },
      {
        type: "paragraphe",
        texte:
          "Des petites chapelles installées au milieu des vignes aux anciennes abbayes, en passant par des lieux de pèlerinage ou des histoires qui continuent d’interroger les habitants, ces endroits témoignent d’une tradition religieuse qui a profondément marqué notre territoire.",
      },
      {
        type: "paragraphe",
        texte:
          "À Perl-Sehndorf, en Allemagne, la petite Fatimakapelle en est un bel exemple. Construite en 1952 à l’initiative d’un habitant de Sehndorf, Josef Bladt, elle se trouve au bord de la forêt, au-dessus des vignobles. Un chemin de croix mène jusqu’à la chapelle, qui constitue encore aujourd’hui un lieu de pèlerinage et de recueillement. Chaque année, le 15 août, une procession aux flambeaux rejoint notamment la chapelle depuis le village.",
      },
      {
        type: "paragraphe",
        texte:
          "De l’autre côté de la frontière, à Sierck-les-Bains, un autre lieu intrigue depuis plusieurs décennies : le fameux Visage du Christ. Sur la façade d’une maison, une forme apparue sur le mur a rapidement été interprétée par certains comme représentant un visage humain, puis associée au visage du Christ. Hasard, phénomène naturel ou signe pour ceux qui y voient une dimension spirituelle ? Chacun peut se faire sa propre opinion. La commune a d’ailleurs intégré ce site à son parcours « Sierck-les-Bains, la spirituelle ».",
      },
      {
        type: "paragraphe",
        texte:
          "À quelques pas de là se trouve la chapelle de Marienfloss, autre grand témoin de l’histoire religieuse locale. Le site est associé depuis des siècles au pèlerinage et à la spiritualité. La commune de Sierck-les-Bains le présente notamment comme un lieu lié à la création du Rosaire. Aujourd’hui encore, Marienfloss accueille visiteurs, croyants et personnes simplement à la recherche d’un moment de calme et de recueillement.",
      },
      {
        type: "paragraphe",
        texte: "Mais l’histoire spirituelle de notre territoire ne s’arrête pas à Sierck et Perl.",
      },
      {
        type: "paragraphe",
        texte:
          "À Bouzonville, l’ancienne abbaye Sainte-Croix constitue un autre lieu exceptionnel. Selon les sources historiques conservées par la ville, l’abbaye fut fondée au début du XIᵉ siècle par Adalbert et Judith. Adalbert serait revenu d’un pèlerinage en Terre Sainte avec des reliques, dont un fragment de la Vraie Croix, qui fut placé dans l’abbaye. L’établissement fut consacré en 1033 sous le vocable de la Sainte-Croix.",
      },
      {
        type: "paragraphe",
        texte:
          "L’histoire de cette relique est elle-même mouvementée. En 1597, elle aurait été volée par des soldats venus de la citadelle de Metz avant d’être restituée en 1616. Un épisode qui ajoute encore au caractère particulier de ce patrimoine religieux bouzonvillois.",
      },
      {
        type: "paragraphe",
        texte:
          "Et Bouzonville possède d’autres témoignages de cette histoire religieuse, comme l’oratoire de Belle-Croix ou encore la chapelle Sainte-Croix d’Aidling, autrefois liée au domaine de l’abbaye.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans cette partie de la Moselle, d’autres chapelles plus modestes ponctuent également les villages et les chemins. À Belmach, près d’Apach, la chapelle Saint-Antoine rappelle cette présence religieuse ancienne dans le Pays des Trois Frontières. À Merschweiller, la chapelle Notre-Dame de la Paix possède quant à elle une dimension particulière dans un territoire marqué par les guerres, les frontières et aujourd’hui la réconciliation entre les peuples.",
      },
      {
        type: "paragraphe",
        texte:
          "Et côté luxembourgeois, le patrimoine religieux de la vallée de la Moselle participe lui aussi à cette histoire commune. Les églises et chapelles de Schengen et des villages environnants rappellent que, bien avant que les frontières européennes deviennent plus ouvertes, ces populations partageaient déjà des traditions, des croyances et des histoires communes.",
      },
      { type: "intertitre", texte: "Alors, peut-on réellement parler de lieux « énergétiques » ?" },
      {
        type: "paragraphe",
        texte:
          "Il est évidemment impossible d’affirmer scientifiquement qu’une chapelle, une statue ou un ancien lieu de pèlerinage possède une énergie particulière. Mais il existe une autre réalité, plus personnelle : celle du ressenti.",
      },
      {
        type: "paragraphe",
        texte:
          "Le silence d’une chapelle au milieu des bois. La lumière d’une bougie. Une ancienne statue. Un paysage de vignes. Une histoire transmise de génération en génération. Ou simplement quelques minutes passées loin du bruit du quotidien.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour certains, ce sera un lieu de prière. Pour d’autres, un endroit chargé d’histoire. Pour d’autres encore, simplement un espace où l’on se sent bien.",
      },
      {
        type: "paragraphe",
        texte: "C’est peut-être justement ce qui rend ces lieux si intéressants.",
      },
      {
        type: "paragraphe",
        texte:
          "Croyant ou non, pratiquant ou simplement curieux, chacun peut les découvrir avec son propre regard.",
      },
      {
        type: "paragraphe",
        texte:
          "À travers la France, l’Allemagne et le Luxembourg, ces chapelles, sanctuaires, abbayes et lieux de mémoire racontent finalement une même histoire : celle d’un territoire où les cultures se rencontrent, où les traditions traversent les frontières et où le patrimoine religieux fait encore partie du paysage.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint vous invite à regarder notre Grande Région autrement : à travers ses lieux connus, mais aussi à travers tous ces petits endroits parfois oubliés, qui continuent de raconter une histoire.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "face-au-risque-de-village-dortoir-les-communes-misent-sur-la-vie-locale",
    titre: "Face au risque de village-dortoir, les communes misent sur la vie locale.",
    chapeau:
      "À Sierck-les-Bains comme à Apach, la proximité du Luxembourg constitue un atout économique majeur, mais pose aussi un défi pour les petites communes : maintenir une véritable vie locale.",
    categorie: "actualites",
    ordre: 17,
    corps: [
      {
        type: "paragraphe",
        texte:
          "À Sierck-les-Bains comme à Apach, la proximité du Luxembourg constitue un atout économique majeur, mais pose aussi un défi pour les petites communes : maintenir une véritable vie locale. Commerces, équipements, associations, animations et nouveaux projets : les municipalités multiplient les initiatives pour préserver l’attractivité de leurs villages et éviter qu’ils ne deviennent de simples lieux de résidence.",
      },
      {
        type: "paragraphe",
        texte:
          "À quelques kilomètres du Luxembourg, Sierck-les-Bains et Apach connaissent une réalité commune à de nombreux villages transfrontaliers : une partie de leurs habitants travaille de l’autre côté de la frontière. Cette proximité constitue une véritable chance, mais elle pose aussi la question de la vie locale au quotidien.",
      },
      {
        type: "paragraphe",
        texte:
          "Comment faire en sorte que les habitants ne fassent pas que rentrer chez eux le soir, mais continuent à fréquenter leur centre-ville, leurs commerces, leurs associations et les différents lieux de vie de leur commune ?",
      },
      {
        type: "paragraphe",
        texte:
          "À Sierck-les-Bains, la municipalité souhaite poursuivre ses efforts autour du cadre de vie et des services de proximité.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour ce nouveau mandat, plusieurs projets concernent notamment le périscolaire et les écoles : mise aux normes, amélioration de l’isolation, accessibilité des bâtiments et végétalisation des cours d’école sont notamment envisagées.",
      },
      {
        type: "paragraphe",
        texte: "Mais l’un des principaux enjeux reste la redynamisation du centre-ville.",
      },
      {
        type: "paragraphe",
        texte:
          "La maire, Madame Hammond, constate une évolution importante des habitudes de consommation : « Les gens ont changé énormément leurs habitudes de consommation et d’achat. »",
      },
      {
        type: "paragraphe",
        texte:
          "La fermeture de la boulangerie Schmidt a notamment fragilisé davantage l’activité du centre. La commune travaille ainsi à la préemption de l’ancien local, situé place Jules Florange, avec le projet d’y installer un salon de thé.",
      },
      {
        type: "paragraphe",
        texte:
          "L’objectif est de créer un nouveau lieu de convivialité et de redonner aux habitants l’habitude de fréquenter le centre-ville.",
      },
      {
        type: "paragraphe",
        texte:
          "« On ne baisse pas les bras », souligne Madame Hammond, qui considère ce local comme « un point essentiel à redynamiser pour que les gens prennent l’habitude de venir au centre ».",
      },
      {
        type: "paragraphe",
        texte:
          "L’idée est également de s’appuyer sur le patrimoine et le cadre de la commune afin que les habitants, mais aussi les visiteurs des villages voisins, puissent venir à Sierck-les-Bains, y passer un moment et profiter de ses différents atouts.",
      },
      { type: "intertitre", texte: "À Apach, les associations pour faire vivre le village" },
      {
        type: "paragraphe",
        texte: "À Apach, la réponse repose notamment sur la force du tissu associatif.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour Madame Émilie Villain, maire d’Apach, la proximité du Luxembourg peut représenter un risque : celui de voir le village devenir principalement résidentiel.",
      },
      {
        type: "paragraphe",
        texte:
          "Mais elle estime que les associations constituent un véritable moteur de la vie locale :",
      },
      {
        type: "paragraphe",
        texte:
          "« Le village-dortoir, c’est peut-être le point négatif d’un village qui se trouve juste à proximité du Luxembourg. Mais grâce à nos associations, on fait vivre le village et on évite le village-dortoir. »",
      },
      {
        type: "paragraphe",
        texte:
          "Une dynamique qui se retrouve notamment dans les guinguettes organisées en juillet et en août par le comité des fêtes, à proximité de la Voie Bleue.",
      },
      {
        type: "paragraphe",
        texte:
          "Ces rendez-vous permettent aux habitants de se retrouver, mais également d’accueillir les cyclistes qui empruntent cet itinéraire. Une occasion pour ces visiteurs de faire une halte, d’échanger avec les habitants et de découvrir autrement la commune.",
      },
      { type: "intertitre", texte: "Faire vivre les communes toute l’année" },
      {
        type: "paragraphe",
        texte:
          "Les exemples de Sierck-les-Bains et d’Apach montrent finalement deux façons différentes de répondre à une même problématique.",
      },
      {
        type: "paragraphe",
        texte:
          "À Sierck-les-Bains, l’accent est notamment mis sur le commerce, les équipements et la redynamisation du centre-ville.",
      },
      {
        type: "paragraphe",
        texte:
          "À Apach, ce sont davantage les associations et les animations locales qui permettent de maintenir le lien entre les habitants.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans les deux communes, l’objectif reste pourtant similaire : faire en sorte que la vie locale ne se résume pas aux grands événements ou à la simple fonction résidentielle.",
      },
      {
        type: "paragraphe",
        texte:
          "C’est aussi dans cette logique que Radio Tripoint, média local et transfrontalier, souhaite donner la parole à celles et ceux qui font vivre le territoire : élus, commerçants, associations, habitants et acteurs locaux.",
      },
      {
        type: "paragraphe",
        texte:
          "Parce qu’un territoire vivant, ce sont aussi des commerces qui ouvrent, des associations qui se mobilisent, des événements qui rassemblent et des habitants qui ont envie de participer à la vie de leur commune.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint entend continuer à mettre en lumière ces initiatives et à contribuer, à son échelle, à créer du lien entre les trois territoires.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "fete-du-chateau-2026-retour-sur-une-edition-pas-comme-les-autres",
    titre: "Fête du Château 2026 : retour sur une édition pas comme les autres.",
    chapeau: "La Fête du Château 2026 est désormais terminée.",
    categorie: "actualites",
    ordre: 18,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La Fête du Château 2026 est désormais terminée. Pour cette édition particulière, qui marquait également les 30 ans de l’association, Radio Tripoint a rencontré Marie Triffaut, trésorière de l’association, afin de revenir sur le week-end, les choix effectués cette année, la mobilisation des bénévoles et les réactions du public.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint : Bonjour Madame Triffaut. La Fête du Château vient de s’achever. Quel premier bilan tirez-vous de cette édition ?",
      },
      {
        type: "paragraphe",
        texte:
          "Marie Triffaut : Cette édition s’est très bien passée. Nous avons notamment eu de très bons retours de la part des troupes et des exposants, qui ont été ravis de notre accueil et de notre organisation.",
      },
      {
        type: "paragraphe",
        texte:
          "Du côté des visiteurs, les retours que nous avons reçus sont, pour la plupart, très positifs. Beaucoup se sont déclarés heureux et impressionnés par ce qui leur a été proposé.",
      },
      {
        type: "paragraphe",
        texte:
          "Quelques passionnés de médiéval ont toutefois été déçus. Mais le projet de cette année était justement de casser les codes, notamment pour célébrer les 30 ans de l’association.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint : Le week-end a également été marqué par un épisode orageux. Comment avez-vous géré cette situation ?",
      },
      {
        type: "paragraphe",
        texte:
          "Marie Triffaut : L’orage ne nous a pas épargnés, mais nous avons su rebondir. Le prestataire a été incroyablement réactif.",
      },
      {
        type: "paragraphe",
        texte:
          "Nous avons également eu une très belle surprise : des personnes se sont présentées spontanément, après avoir vu nos publications, pour venir nous aider. Il y avait d’anciens bénévoles, mais également des personnes qui n’avaient jamais été bénévoles auparavant.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint : Justement, quelle place occupent les bénévoles dans la vie du château et de l’association ?",
      },
      {
        type: "paragraphe",
        texte:
          "Marie Triffaut : Sans l’association, il y a 30 ans, le château aurait peut-être connu un avenir incertain. Et sans bénévoles, il n’y a pas d’association.",
      },
      {
        type: "paragraphe",
        texte: "Les uns sans les autres, dans cet édifice, nous ne sommes rien.",
      },
      {
        type: "paragraphe",
        texte:
          "Je tiens donc une nouvelle fois à les remercier, et à féliciter tous mes collègues du bureau pour leur incroyable travail bénévole. Ils travaillent sur cette manifestation depuis une année entière.",
      },
      { type: "paragraphe", texte: "On est une équipe !" },
      {
        type: "paragraphe",
        texte: "Radio Tripoint : Un dernier mot pour le public venu durant ce week-end ?",
      },
      {
        type: "paragraphe",
        texte: "Marie Triffaut : Merci au public qui est venu nous rendre visite ce week-end !",
      },
      {
        type: "paragraphe",
        texte:
          "Nous espérons que l’immersion et le voyage dans les couloirs du temps les ont transportés, et que les fans de médiéval ne nous en veulent pas trop d’être sortis de nos habitudes.",
      },
      { type: "paragraphe", texte: "En tout cas, nous, nous nous sommes régalés !" },
      {
        type: "paragraphe",
        texte:
          "Et malgré le feu d’artifice qui n’a malheureusement pas pu avoir lieu, le public a su mettre le feu !",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint remercie Marie Triffaut pour cet échange et l’ensemble des bénévoles, troupes, exposants et participants qui ont contribué à faire vivre cette édition 2026 de la Fête du Château.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "horen-sie-auch-seit-einigen-tagen-explosionsgerausche-in-perl",
    titre: "Hören Sie auch seit einigen Tagen Explosionsgeräusche in Perl?",
    chapeau:
      "Seit einigen Tagen können Anwohner in und rund um Perl immer wieder laute Knallgeräusche aus den Weinbergen hören.",
    categorie: "actualites",
    ordre: 19,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Seit einigen Tagen können Anwohner in und rund um Perl immer wieder laute Knallgeräusche aus den Weinbergen hören. Die Geräusche können durchaus wie Schüsse wirken und für einen Moment für Verunsicherung sorgen.",
      },
      { type: "intertitre", texte: "Doch was steckt dahinter?" },
      {
        type: "paragraphe",
        texte:
          "Bei den Geräuschen handelt es sich vermutlich um sogenannte Vogelschreckkanonen. Diese Geräte werden von Winzern eingesetzt, um Vögel und andere Tiere von den Weinreben fernzuhalten und die Trauben vor Schäden zu schützen.",
      },
      {
        type: "paragraphe",
        texte:
          "Gerade in dieser Zeit, in der die Trauben reifen und die Weinlese näher rückt, versuchen die Winzer, ihre Ernte bestmöglich zu schützen.",
      },
      {
        type: "paragraphe",
        texte:
          "Für Anwohner können die regelmäßigen Knallgeräusche natürlich überraschend sein. Wer sie derzeit in den Weinbergen rund um Perl hört, muss deshalb nicht gleich von Schüssen ausgehen.",
      },
      {
        type: "paragraphe",
        texte:
          "Kurz gesagt: Was nach Schüssen klingt, könnte in den Weinbergen schlicht dem Schutz der Trauben dienen.",
      },
      { type: "paragraphe", texte: "Radio Tripoint – Ihre lokale Stimme im Dreiländereck." },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "belgique-17-ans-de-prison-pour-une-justice-rendue-soi-meme",
    titre: "Belgique : 17 ans de prison pour une justice rendue soi-même.",
    chapeau: "C'est une affaire qui fait beaucoup de bruit.",
    categorie: "actualites",
    ordre: 20,
    corps: [
      {
        type: "paragraphe",
        texte:
          "C'est une affaire qui fait beaucoup de bruit. À Namur Grégory Lenoci a été condamné à 17 ans de prison pour tentative d’assassinat après avoir violemment agressé son voisin.",
      },
      {
        type: "paragraphe",
        texte:
          "Les faits remontent au 24 juillet 2025, à Jambes. Lenoci soupçonnait son voisin d’avoir commis des abus sexuels sur son beau-fils. Après avoir signalé ses soupçons aux autorités, il avait décidé de confronter lui-même son voisin.",
      },
      {
        type: "paragraphe",
        texte:
          "La confrontation avait dégénéré en une agression d’une extrême violence, laissant la victime lourdement handicapée.",
      },
      {
        type: "paragraphe",
        texte:
          "Au tribunal, Grégory Lenoci a expliqué avoir perdu le contrôle et a contesté avoir voulu tuer son voisin. La justice a néanmoins retenu la tentative d’assassinat et prononcé une peine de 17 ans de prison.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette affaire provoque de nombreuses réactions en Belgique et relance un débat sensible : peut-on comprendre la colère d’un proche qui pense qu’un enfant est en danger tout en condamnant le fait de se faire justice soi-même ?",
      },
      {
        type: "paragraphe",
        texte:
          "Une question qui dépasse largement cette affaire : où s’arrête la protection et où commence la vengeance ?",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "verkehrsbehinderungen-wegen-bauarbeiten-an-der-l177-l178",
    titre: "Verkehrsbehinderungen wegen Bauarbeiten an der L177/L178.",
    chapeau:
      "ORSCHOLZ – Die Bauarbeiten am Knotenpunkt L177/L178 sorgen derzeit für Verkehrsbehinderungen und zusätzlichen Ausweichverkehr in Orscholz.",
    categorie: "actualites",
    ordre: 21,
    corps: [
      {
        type: "paragraphe",
        texte:
          "ORSCHOLZ – Die Bauarbeiten am Knotenpunkt L177/L178 sorgen derzeit für Verkehrsbehinderungen und zusätzlichen Ausweichverkehr in Orscholz.",
      },
      {
        type: "paragraphe",
        texte:
          "Nach Angaben der Gemeinde Mettlach sind mehrere Wohnstraßen durch das erhöhte Verkehrsaufkommen betroffen. Autofahrer werden gebeten, vorsichtig zu fahren, Geschwindigkeitsbegrenzungen einzuhalten und mehr Zeit für ihre Fahrt einzuplanen.",
      },
      {
        type: "paragraphe",
        texte:
          "Im Zuge der Arbeiten wird unter anderem die Ampelanlage erneuert. Die neue verkehrsabhängige Steuerung soll künftig den Verkehrsfluss verbessern und die Sicherheit erhöhen.",
      },
      {
        type: "paragraphe",
        texte:
          "Bis zum Abschluss der Arbeiten bittet die Gemeinde Anwohner und Verkehrsteilnehmer um Verständnis und gegenseitige Rücksichtnahme.",
      },
      { type: "paragraphe", texte: "Quelle: Gemeinde Mettlach – 17. August 2026" },
      {
        type: "paragraphe",
        texte: "Radio Tripoint – Das Medium, das Frankreich, Luxemburg und Deutschland verbindet.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "dossier-special-incendies-fumees-ce-que-l-on-sait",
    titre: "DOSSIER SPÉCIAL — INCENDIES & FUMÉES : CE QUE L’ON SAIT.",
    chapeau:
      "Depuis plusieurs jours, plusieurs incendies mobilisent fortement les secours dans la Grande Région.",
    categorie: "actualites",
    ordre: 22,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Depuis plusieurs jours, plusieurs incendies mobilisent fortement les secours dans la Grande Région. Ce lundi 17 août, la situation reste particulièrement suivie en Belgique, en Allemagne et jusque dans notre secteur transfrontalier, où les fumées ont été largement ressenties.",
      },
      { type: "intertitre", texte: "Hautes Fagnes : près de 3 000 hectares détruits" },
      {
        type: "paragraphe",
        texte:
          "Dans les Hautes Fagnes, à proximité de la frontière allemande, le feu a déjà détruit environ 3 000 hectares de végétation, ce qui en fait le plus important incendie de l’histoire récente de la Belgique.",
      },
      {
        type: "paragraphe",
        texte:
          "La pluie et l’absence de vent ont permis une légère amélioration ce lundi matin, mais la situation reste délicate. Des foyers persistent profondément dans les sols tourbeux, rendant l’extinction particulièrement complexe.",
      },
      {
        type: "paragraphe",
        texte:
          "À Monschau, côté allemand, une trentaine d’habitants avaient dû quitter leur domicile par précaution. En fin d’après-midi, les autorités signalent toujours une forte présence de fumée et recommandent localement de garder portes et fenêtres fermées.\nSarre : l’incendie de Hüttigweiler sous contrôle",
      },
      {
        type: "paragraphe",
        texte:
          "À Hüttigweiler, près d’Illingen, environ 18 hectares ont été touchés par un autre important incendie.",
      },
      {
        type: "paragraphe",
        texte:
          "Le feu est désormais sous contrôle mais pas totalement éteint. Les opérations de lutte ont cependant dû être interrompues temporairement en raison d’un possible risque lié à la présence de munitions datant de la Seconde Guerre mondiale dans le sol. Le service de déminage est intervenu sur place.",
      },
      { type: "intertitre", texte: "Des fumées ressenties bien au-delà des incendies" },
      {
        type: "paragraphe",
        texte:
          "Les conséquences sont visibles à plusieurs dizaines, voire centaines de kilomètres des principaux foyers.",
      },
      {
        type: "paragraphe",
        texte:
          "Le SWR confirme notamment le retour des fumées provenant de Belgique dans la région de Trèves, avec des odeurs perceptibles jusque dans une partie de la Rhénanie-Palatinat.",
      },
      {
        type: "paragraphe",
        texte:
          "Du côté français, plusieurs habitants et communes de Moselle ont également signalé à Radio Tripoint des odeurs de brûlé, la présence de fumée ou un ciel fortement voilé.",
      },
      {
        type: "paragraphe",
        texte:
          "Des réactions similaires nous sont parvenues du secteur du Tripoint et à proximité de la frontière allemande.",
      },
      {
        type: "paragraphe",
        texte:
          "Il est donc important de rappeler qu’une odeur de brûlé ou un ciel voilé ne signifie pas nécessairement qu’un incendie se trouve à proximité immédiate : les fumées peuvent être transportées sur de longues distances par les vents et les conditions atmosphériques.",
      },
      { type: "intertitre", texte: "Prudence dans toute la Grande Région" },
      {
        type: "paragraphe",
        texte:
          "La situation évolue encore rapidement. En cas de fumée importante, il est préférable de limiter son exposition et de suivre les consignes diffusées par les autorités locales.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette actualité intervient également au moment où Radio Tripoint clôture ce 17 août sa campagne de prévention consacrée à la protection de nos forêts et de nos espaces naturels, rappelant plus que jamais la nécessité de rester vigilants face au risque d’incendie.",
      },
      { type: "paragraphe", texte: "Radio Tripoint , la radio transfrontalière" },
      { type: "paragraphe", texte: "Article actualisé le 17 août 2026 en fin d’après-midi." },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "rauchentwicklung-im-saarland-das-wissen-wir",
    titre: "Rauchentwicklung im Saarland: Das wissen wir.",
    chapeau:
      "Seit Samstagabend wird in Teilen des Saarlandes eine deutliche Rauchentwicklung sowie Brandgeruch wahrgenommen.",
    categorie: "actualites",
    ordre: 23,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Seit Samstagabend wird in Teilen des Saarlandes eine deutliche Rauchentwicklung sowie Brandgeruch wahrgenommen. Die Integrierte Leitstelle Saarland hatte deshalb eine Warninformation für die Bevölkerung herausgegeben.",
      },
      {
        type: "paragraphe",
        texte:
          "Nach den bislang vorliegenden Informationen stammt der Rauch nicht von einem größeren Brand im Saarland, sondern wird aus Richtung Belgien in die Region getragen.",
      },
      {
        type: "paragraphe",
        texte:
          "Die Behörden haben die Warnung inzwischen aktualisiert: Nach aktuellem Stand besteht keine Gefahr für die Bevölkerung.",
      },
      {
        type: "paragraphe",
        texte:
          "Dennoch wird empfohlen, bei stärkerer Rauch- oder Geruchsbelastung vorsorglich Fenster und Türen geschlossen zu halten und die offiziellen Informationen der Behörden zu verfolgen.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint verfolgt die Entwicklung weiter und informiert bei neuen Erkenntnissen.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "reseaux-sociaux-vers-une-interdiction-pour-les-moins-de-15-ans",
    titre: "Réseaux sociaux : vers une interdiction pour les moins de 15 ans ?",
    chapeau:
      "La question de l’accès des mineurs aux réseaux sociaux revient au cœur de l’actualité en Europe.",
    categorie: "actualites",
    ordre: 24,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La question de l’accès des mineurs aux réseaux sociaux revient au cœur de l’actualité en Europe.",
      },
      {
        type: "paragraphe",
        texte:
          "En France, le Parlement avait adopté le 21 juillet un texte prévoyant notamment une interdiction d’accès aux réseaux sociaux pour les moins de 15 ans.",
      },
      {
        type: "paragraphe",
        texte:
          "Mais le Conseil constitutionnel a censuré le 14 août cette interdiction générale, relançant le débat sur les moyens de protéger les plus jeunes tout en respectant les libertés fondamentales.",
      },
      {
        type: "paragraphe",
        texte: "Le sujet dépasse cependant largement les frontières françaises.",
      },
      { type: "intertitre", texte: "Au Luxembourg, le débat avance" },
      {
        type: "paragraphe",
        texte:
          "Le Luxembourg réfléchit lui aussi à l’instauration d’un âge minimum pour accéder aux réseaux sociaux. Les discussions portent notamment sur un seuil autour de 15 ou 16 ans, avec une volonté de renforcer la protection des enfants et adolescents face aux risques du numérique.",
      },
      { type: "intertitre", texte: "L’Allemagne privilégie une approche européenne" },
      {
        type: "paragraphe",
        texte:
          "En Allemagne, aucune interdiction générale comparable n’est actuellement en vigueur. Les autorités allemandes travaillent néanmoins sur le renforcement de la protection des mineurs en ligne et défendent notamment une coordination au niveau européen. Un véritable enjeu transfrontalier",
      },
      {
        type: "paragraphe",
        texte:
          "Dans la Grande Région, la question prend une dimension particulière. France, Luxembourg et Allemagne sont séparés par quelques kilomètres seulement, alors que les jeunes utilisent exactement les mêmes plateformes : TikTok, Instagram, Snapchat, YouTube ou encore Facebook.",
      },
      {
        type: "paragraphe",
        texte:
          "Peut-on réellement réglementer l’accès aux réseaux sociaux pays par pays lorsque le numérique ne connaît aucune frontière ?",
      },
      {
        type: "paragraphe",
        texte:
          "La vérification de l’âge constitue également un défi majeur : comment s’assurer qu’un utilisateur a réellement 15 ou 16 ans sans porter atteinte à la protection de ses données personnelles ?",
      },
      {
        type: "paragraphe",
        texte:
          "Cyberharcèlement, contenus inadaptés, mécanismes addictifs et protection de l’enfance s’opposent également dans le débat aux questions de liberté d’expression, de vie privée et de responsabilité parentale.",
      },
      {
        type: "paragraphe",
        texte:
          "Une chose semble désormais certaine : la protection des mineurs sur les réseaux sociaux devient un véritable enjeu européen.",
      },
      {
        type: "paragraphe",
        texte:
          "Et vous ? Seriez-vous favorable à un âge minimum commun pour accéder aux réseaux sociaux en France, au Luxembourg et en Allemagne ?",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint — Le média transfrontalier qui relie la France, l’Allemagne et le Luxembourg.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "infos-locales-festival-roc-n-vibes-c-est-le-grand-jour",
    titre: "INFOS LOCALES | Festival Roc N’ VIBES : c’est le grand jour !",
    chapeau: "Il est enfin là !",
    categorie: "actualites",
    ordre: 25,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Il est enfin là ! Ce vendredi 14 août, le festival Roc N’ VIBES revient pour sa 3ᵉ édition au Stromberg, au cœur des Trois Frontières.",
      },
      {
        type: "paragraphe",
        texte:
          "À quelques heures du lancement, les organisateurs du Club des Jeunes des Trois Frontières et leurs partenaires sont à pied d’œuvre pour accueillir les festivaliers et leur faire vivre un moment mémorable.",
      },
      {
        type: "paragraphe",
        texte:
          "Au programme : une ambiance estivale, la mise en valeur du territoire et des produits locaux, mais surtout de la musique avec plusieurs artistes et DJ qui se succéderont : Chalee Grey dès 17h30, Siirk Musik à 19h30, Fload à 21h, Martin.iau B2B DCM à 22h, Leo Friedrich à minuit, puis DCM à 1h30.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint sera également sur place en tant que partenaire média officiel de l’événement pour vous faire vivre cette troisième édition au plus près de l’ambiance.",
      },
      { type: "paragraphe", texte: "🎶 Roc N’ VIBES, c’est aujourd’hui. Que la fête commence !" },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "radio-tripoint-geht-in-perl-mit-gutem-beispiel-fur-den-naturschutz-vor",
    titre: "Radio Tripoint geht in Perl mit gutem Beispiel für den Naturschutz vor.",
    chapeau:
      "Im Rahmen seiner Kampagne zum Schutz und Erhalt der Natur hat Radio Tripoint, das grenzüberschreitende Medium, seinen Worten Taten folgen lassen und in Perl eine Bürgeraktion zum Sammeln von Abfällen organisiert.",
    categorie: "actualites",
    ordre: 26,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Im Rahmen seiner Kampagne zum Schutz und Erhalt der Natur hat Radio Tripoint, das grenzüberschreitende Medium, seinen Worten Taten folgen lassen und in Perl eine Bürgeraktion zum Sammeln von Abfällen organisiert.",
      },
      {
        type: "paragraphe",
        texte:
          "Mehrere Mitglieder des Teams waren an besonders frequentierten Orten im Einsatz, darunter im Bereich der Fatima-Kapelle mit ihrem beeindruckenden Blick auf die Mosel und Luxemburg sowie am Dreiländereck, das täglich von zahlreichen Autofahrern, Radfahrern und Spaziergängern passiert wird.",
      },
      {
        type: "paragraphe",
        texte:
          "Über die eigentliche Müllsammelaktion hinaus möchte Radio Tripoint eine einfache Botschaft vermitteln: Bürgersinn ist kein Luxus. Wir haben Rechte, aber auch Pflichten gegenüber der Region, in der wir leben.",
      },
      {
        type: "paragraphe",
        texte:
          "Fragt nicht, was euer Land für euch tun kann – fragt, was ihr für euer Land tun könnt.“ Dieses berühmte Zitat von John F. Kennedy bringt den Geist dieser Initiative auf den Punkt.",
      },
      {
        type: "paragraphe",
        texte:
          "Wir haben das große Glück, in einer grenzüberschreitenden Region mit einem außergewöhnlichen Naturerbe zu leben. Es liegt an uns, dieses zu respektieren, zu schützen und an zukünftige Generationen weiterzugeben“, betont M. Giorgio, Geschäftsführer von Radio Tripoint.",
      },
      {
        type: "paragraphe",
        texte:
          "Mit dieser Aktion in Perl möchte Radio Tripoint daran erinnern, dass der Schutz unserer Umwelt nicht an Grenzen endet: Frankreich, Deutschland und Luxemburg",
      },
      {
        type: "paragraphe",
        texte:
          "Im Rahmen seiner Kampagne zum Schutz und Erhalt der Natur hat Radio Tripoint, das grenzüberschreitende Medium, seinen Worten Taten folgen lassen und in Perl eine Bürgeraktion zum Sammeln von Abfällen organisiert.",
      },
      {
        type: "paragraphe",
        texte:
          "Mehrere Mitglieder des Teams waren an besonders frequentierten Orten im Einsatz, darunter im Bereich der Fatima-Kapelle mit ihrem beeindruckenden Blick auf die Mosel und Luxemburg sowie am Dreiländereck, das täglich von zahlreichen Autofahrern, Radfahrern und Spaziergängern passiert wird.",
      },
      {
        type: "paragraphe",
        texte:
          "Über die eigentliche Müllsammelaktion hinaus möchte Radio Tripoint eine einfache Botschaft vermitteln: Bürgersinn ist kein Luxus. Wir haben Rechte, aber auch Pflichten gegenüber der Region, in der wir leben.",
      },
      {
        type: "paragraphe",
        texte:
          "Fragt nicht, was euer Land für euch tun kann – fragt, was ihr für euer Land tun könnt.“ Dieses berühmte Zitat von John F. Kennedy bringt den Geist dieser Initiative auf den Punkt.",
      },
      {
        type: "paragraphe",
        texte:
          "„Wir haben das große Glück, in einer grenzüberschreitenden Region mit einem außergewöhnlichen Naturerbe zu leben. Es liegt an uns, dieses zu respektieren, zu schützen und an zukünftige Generationen weiterzugeben“, betont M. Matas Giorgio, Geschäftsführer von Radio Tripoint.",
      },
      {
        type: "paragraphe",
        texte:
          "Mit dieser Aktion in Perl möchte Radio Tripoint daran erinnern, dass der Schutz unserer Umwelt nicht an Grenzen endet: Frankreich, Deutschland und Luxemburg drei Länder, aber ein gemeinsames Naturerbe, das es zu bewahren gilt.",
      },
      {
        type: "paragraphe",
        texte: "Länder, aber ein gemeinsames Naturerbe, das es zu bewahren gilt.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "eclipse-solaire-du-12-aout-un-rendez-vous-a-ne-pas-manquer-dans-la-grande-region",
    titre: "ÉCLIPSE SOLAIRE DU 12 AOÛT : UN RENDEZ-VOUS À NE PAS MANQUER DANS LA GRANDE RÉGION.",
    chapeau:
      "Ce mercredi 12 août 2026, une importante éclipse partielle de Soleil sera visible dans notre région.",
    categorie: "actualites",
    ordre: 27,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Ce mercredi 12 août 2026, une importante éclipse partielle de Soleil sera visible dans notre région.",
      },
      {
        type: "paragraphe",
        texte:
          "De Sierck-les-Bains à Apach et Bouzonville, mais également à Perl, Schengen et Remich, le phénomène débutera aux alentours de 19h20, avec un maximum attendu vers 20h15.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour profiter au mieux du spectacle, privilégiez un endroit offrant une vue dégagée vers l’ouest, le Soleil étant déjà bas à cette heure de la journée.",
      },
      {
        type: "paragraphe",
        texte:
          "Attention : ne regardez jamais directement le Soleil sans protection adaptée. Des lunettes spéciales « éclipse » conformes à la norme ISO 12312-2 sont indispensables pour une observation directe. Les lunettes de soleil classiques ne protègent pas suffisamment les yeux.",
      },
      {
        type: "paragraphe",
        texte:
          "Reste désormais une inconnue : la météo. Si le ciel est suffisamment dégagé, le spectacle devrait être particulièrement impressionnant dans toute notre Grande Région.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "les-nocturnes-du-terroir-confirment-leur-succes-a-sierck-les-bains",
    titre: "Les Nocturnes du Terroir confirment leur succès à Sierck-les-Bains.",
    chapeau:
      "Les Nocturnes du Terroir viennent de s’achever à Sierck-les-Bains sur une note particulièrement positive.",
    categorie: "actualites",
    ordre: 28,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Les Nocturnes du Terroir viennent de s’achever à Sierck-les-Bains sur une note particulièrement positive. Une nouvelle fois, le public a répondu présent, avec une belle fréquentation et une ambiance conviviale tout au long de la soirée.",
      },
      {
        type: "paragraphe",
        texte:
          "Au fil de nos échanges, plusieurs commerçants et exposants nous ont fait part de leur satisfaction. Du monde, des rencontres, des découvertes et surtout cette volonté de faire vivre la ville : cette édition confirme une nouvelle fois l’intérêt de ces rendez-vous estivaux pour la dynamique locale.",
      },
      {
        type: "paragraphe",
        texte:
          "Ce succès vient également souligner les efforts menés par la Ville de Sierck-les-Bains et l’ensemble des acteurs et responsables mobilisés pour animer et dynamiser la commune. Des initiatives qui participent également au rapprochement avec les territoires voisins.",
      },
      {
        type: "paragraphe",
        texte:
          "Car l’un des éléments marquants de cette édition était incontestablement son caractère transfrontalier. Parmi les visiteurs, nous avons pu croiser des habitants venus notamment de Perl, en Allemagne, et de Schengen, au Luxembourg. Plus surprenant encore, plusieurs véhicules immatriculés en Belgique et aux Pays-Bas étaient également visibles aux abords de l’événement, signe d’une fréquentation qui dépasse le seul territoire des Trois Frontières.",
      },
      {
        type: "paragraphe",
        texte:
          "Français, Allemands, Luxembourgeois et visiteurs venus d’un peu plus loin se sont ainsi retrouvés autour d’un même événement. La barrière de la langue ne s’est pratiquement pas fait sentir : les échanges se sont faits naturellement, dans une atmosphère familiale et conviviale.",
      },
      {
        type: "paragraphe",
        texte:
          "Une belle illustration de ce que peut offrir Sierck-les-Bains lorsqu’événements locaux, dynamisme commercial et ouverture transfrontalière se rencontrent.",
      },
      {
        type: "paragraphe",
        texte:
          "Une édition réussie qui donne déjà envie de retrouver les prochaines Nocturnes du Terroir !",
      },
      { type: "paragraphe", texte: "Radio Tripoint – Le média local de la Grande Région" },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "ce-que-l-on-sait-de-l-incendie-qui-a-touche-le-nord-de-la-moselle",
    titre: "Ce que l’on sait de l’incendie qui a touché le nord de la Moselle.",
    chapeau:
      "Un important incendie s’est déclaré dimanche 2 août sur le site de la société SAFE, implanté dans la zone industrielle de Gandrange (Moselle).",
    categorie: "actualites",
    ordre: 29,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Un important incendie s’est déclaré dimanche 2 août sur le site de la société SAFE, implanté dans la zone industrielle de Gandrange (Moselle). Le sinistre a concerné un entrepôt de déchets industriels situé sur un site classé Seveso seuil bas, provoquant un impressionnant panache de fumée noire visible à plusieurs kilomètres.",
      },
      {
        type: "paragraphe",
        texte:
          "Par mesure de précaution, les autorités ont demandé à près de 30 000 habitants de plusieurs communes, dont Gandrange, Amnéville, Rombas, Clouange et Vitry-sur-Orne, de rester confinés pendant plusieurs heures. Le dispositif FR-Alert a également été déclenché afin d’informer rapidement la population.",
      },
      {
        type: "paragraphe",
        texte:
          "Grâce à l’intervention de plus de 130 sapeurs-pompiers et de nombreux moyens de secours, le feu a été maîtrisé dans l’après-midi. Après les contrôles effectués sur la qualité de l’air, la préfecture a levé les mesures de confinement, les analyses n’ayant pas mis en évidence de danger pour la population.",
      },
      {
        type: "paragraphe",
        texte:
          "À ce stade, l’origine de l’incendie n’est pas encore connue et une enquête devra en déterminer les causes. Les autorités poursuivent également leurs investigations pour évaluer les conséquences matérielles de ce sinistre.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint continuera de suivre ce dossier et vous informera des éventuels nouveaux développements dans les prochaines heures.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "les-feux-de-foret-continuent-de-mobiliser-d-importants-moyens-en-france",
    titre: "Les feux de forêt continuent de mobiliser d’importants moyens en France.",
    chapeau: "Point sur la situation.",
    categorie: "actualites",
    ordre: 31,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Point sur la situation. Plusieurs départements français restent confrontés à d’importants feux de forêt, notamment en Gironde, dans les Landes, dans le Var et en Haute-Corse. Les fortes chaleurs, la sécheresse et le vent continuent de favoriser la propagation des incendies, mobilisant d’importants moyens terrestres et aériens.",
      },
      {
        type: "paragraphe",
        texte:
          "À ce jour, plus de 220 000 personnes ont été évacuées, principalement dans le sud-ouest de la France, où les incendies ont entraîné des évacuations préventives de grande ampleur afin de protéger les habitants, les vacanciers et les infrastructures.",
      },
      {
        type: "paragraphe",
        texte:
          "Les sapeurs-pompiers, appuyés par des renforts venus de toute la France et de plusieurs pays européens, poursuivent leurs interventions pour protéger les populations et limiter la progression des flammes. Les autorités rappellent l’importance de respecter les consignes de sécurité, d’éviter tout comportement pouvant provoquer un départ de feu et de faire preuve de la plus grande vigilance.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint adresse tout son soutien aux sapeurs-pompiers, aux forces de sécurité, aux bénévoles ainsi qu’aux habitants touchés par ces incendies.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "attaque-a-berlin-ce-que-l-on-sait",
    titre: "Attaque à Berlin : ce que l’on sait.",
    chapeau:
      "Berlin reste sous le choc après l’attaque survenue samedi soir à proximité de la Christopher Street Day (Pride).",
    categorie: "actualites",
    ordre: 32,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Berlin reste sous le choc après l’attaque survenue samedi soir à proximité de la Christopher Street Day (Pride). Un véhicule a percuté la foule avant que son conducteur ne poursuive son attaque à l’arme blanche. Le bilan provisoire fait état d’une femme décédée et de 29 blessés.",
      },
      {
        type: "paragraphe",
        texte:
          "Les autorités allemandes ont rapidement privilégié la piste d’un acte terroriste. Le principal suspect, un homme de 21 ans déjà connu des services de sécurité pour sa radicalisation, a été retrouvé le lendemain et est décédé lors d’une intervention de la police après avoir menacé les forces de l’ordre avec une arme blanche. Les enquêteurs ont depuis indiqué avoir découvert des éléments laissant penser à une allégeance à l’organisation État islamique.",
      },
      {
        type: "paragraphe",
        texte:
          "Au-delà de l’émotion, cette tragédie relance le débat sur le suivi des personnes radicalisées, la sécurité lors des grands rassemblements et les moyens de prévenir de tels actes. Elle rappelle également qu’il est essentiel de s’en tenir aux faits établis et d’éviter tout amalgame : les actes d’un individu ne sauraient être attribués à une communauté dans son ensemble.",
      },
      {
        type: "paragraphe",
        texte:
          "Nos pensées vont aux victimes, à leurs proches et à toutes les personnes touchées par ce drame.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "syndrome-pieds-mains-bouche-une-maladie-frequente-chez-les-jeunes-enfants",
    titre: "Syndrome pieds-mains-bouche : une maladie fréquente chez les jeunes enfants.",
    chapeau:
      "Le syndrome pieds-mains-bouche est une infection virale courante qui touche principalement les enfants de moins de 5 ans.",
    categorie: "actualites",
    ordre: 34,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Le syndrome pieds-mains-bouche est une infection virale courante qui touche principalement les enfants de moins de 5 ans. Très contagieuse, elle circule régulièrement dans les crèches, les écoles maternelles et les collectivités, notamment durant les périodes estivales et automnales.",
      },
      {
        type: "paragraphe",
        texte:
          "Les premiers signes sont généralement une légère fièvre, une fatigue inhabituelle, puis l’apparition de petits boutons ou de vésicules au niveau des mains, des pieds et à l’intérieur de la bouche. Ces lésions peuvent rendre l’alimentation douloureuse chez les plus jeunes.",
      },
      {
        type: "paragraphe",
        texte:
          "Si cette maladie est le plus souvent bénigne et disparaît spontanément en une semaine à dix jours, quelques gestes simples permettent de limiter sa propagation :",
      },
      {
        type: "liste",
        elements: [
          "se laver régulièrement les mains ;",
          "éviter de partager les couverts, les verres ou les jouets ;",
          "bien hydrater l’enfant ;",
          "consulter un professionnel de santé en cas de forte fièvre, de déshydratation ou si les symptômes persistent.",
        ],
      },
      {
        type: "paragraphe",
        texte:
          "À ce jour, aucune alerte sanitaire officielle n’a été émise sur le secteur Apach – Perl – Schengen. Toutefois, quelques cas isolés peuvent survenir, comme chaque année.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint invite les familles à rester vigilantes, à adopter les bons réflexes d’hygiène et à ne pas céder à l’inquiétude : dans la grande majorité des cas, le syndrome pieds-mains-bouche évolue favorablement avec du repos, une bonne hydratation et un traitement destiné à soulager les symptômes.",
      },
      { type: "paragraphe", texte: "Radio Tripoint – La radio transfrontalière." },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "france-espagne-face-au-racisme-les-bleus-veulent-repondre-sur-le-terrain",
    titre: "France – Espagne : face au racisme, les Bleus veulent répondre sur le terrain.",
    chapeau:
      "À seulement quelques heures de la demi-finale de la Coupe du monde 2026 entre la France et l’Espagne, un autre match s’est malheureusement invité dans l’actualité : celui de la lutte contre le racisme.",
    categorie: "actualites",
    ordre: 37,
    corps: [
      {
        type: "paragraphe",
        texte:
          "À seulement quelques heures de la demi-finale de la Coupe du monde 2026 entre la France et l’Espagne, un autre match s’est malheureusement invité dans l’actualité : celui de la lutte contre le racisme.",
      },
      {
        type: "paragraphe",
        texte:
          "Ces derniers jours, plusieurs déclarations et attaques visant l’équipe de France et certains de ses joueurs ont suscité une vive émotion. Les propos tenus par l’ancien Premier ministre espagnol Mariano Rajoy, affirmant notamment que l’équipe de France serait une équipe « sans Français », ont été largement dénoncés en France comme en Espagne. Plusieurs responsables politiques ainsi que des joueurs de la sélection espagnole ont eux-mêmes condamné ces déclarations.",
      },
      {
        type: "paragraphe",
        texte:
          "L’équipe de France est à l’image de la République : diverse, unie et portée par des femmes et des hommes qui défendent les couleurs de leur pays avec fierté. La nationalité, l’engagement et l’amour du maillot ne se mesurent ni à la couleur de peau, ni aux origines.",
      },
      {
        type: "paragraphe",
        texte:
          "À Radio Tripoint, nous rappelons que la France est une et indivisible. Toutes les tentatives visant à opposer les citoyens ou à diviser la société par des discours de haine ne doivent trouver aucun écho.",
      },
      {
        type: "paragraphe",
        texte:
          "Ce soir, les Bleus auront l’occasion de répondre de la plus belle des manières : sur le terrain. Par leur talent, leur esprit d’équipe et leur détermination, ils porteront les valeurs du sport, du respect et du vivre-ensemble.",
      },
      {
        type: "paragraphe",
        texte:
          "Au-delà du résultat, nous espérons que cette rencontre sera avant tout une fête du football. Que le meilleur gagne… et que le racisme perde.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "de-nombreux-feux-d-artifice-annules-ou-interdits-avant-le-14-juillet",
    titre: "De nombreux feux d’artifice annulés ou interdits avant le 14 Juillet.",
    chapeau:
      "Dans notre région, les habitants d’Apach, Sierck-les-Bains, Bouzonville et plus largement du territoire transfrontalier sont également concernés par les mesures prises par la préfecture.",
    categorie: "actualites",
    ordre: 40,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Dans notre région, les habitants d’Apach, Sierck-les-Bains, Bouzonville et plus largement du territoire transfrontalier sont également concernés par les mesures prises par la préfecture.",
      },
      {
        type: "paragraphe",
        texte:
          "Un arrêté préfectoral interdit jusqu’au 20 juillet l’achat, la vente, le transport, la détention et l’utilisation de plusieurs catégories de feux d’artifice destinés au grand public (catégories F2 et F3). Cette décision vise à prévenir les risques de troubles à l’ordre public tout en tenant compte des fortes chaleurs et du risque élevé d’incendie.",
      },
      {
        type: "paragraphe",
        texte:
          "Par ailleurs, plusieurs communes ont déjà annoncé l’annulation ou le report de leur feu d’artifice. D’autres collectivités suivent l’évolution de la situation et pourraient adapter leur programme si les conditions météorologiques ne s’améliorent pas.",
      },
      {
        type: "paragraphe",
        texte:
          "Les habitants d’Apach, Sierck-les-Bains, Bouzonville et des communes voisines sont invités à consulter les communications officielles de leur mairie avant de se déplacer pour les festivités du 13 et du 14 juillet.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "monaco-la-principale-suspecte-du-colis-piege-retrouvee-morte-l-enquete-connait",
    titre:
      "Monaco : la principale suspecte du colis piégé retrouvée morte, l’enquête connaît un nouveau rebondissement.",
    chapeau:
      "Quelques jours après l’attentat au colis piégé qui avait fait trois blessés à Monaco, l’enquête prend une nouvelle tournure.",
    categorie: "actualites",
    ordre: 41,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Quelques jours après l’attentat au colis piégé qui avait fait trois blessés à Monaco, l’enquête prend une nouvelle tournure.",
      },
      {
        type: "paragraphe",
        texte:
          "La principale suspecte, une ressortissante ukrainienne recherchée dans cette affaire, a été retrouvée morte près de Kyiv, en Ukraine. Selon les autorités locales, elle aurait été tuée par balle.",
      },
      {
        type: "paragraphe",
        texte:
          "Parallèlement, deux hommes ont été interpellés dans le cadre de l’enquête sur son décès. Les investigations se poursuivent afin de déterminer les circonstances exactes de sa mort et d’établir si ces nouveaux éléments sont liés à l’attentat commis à Monaco.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette affaire, qui a suscité une vive émotion sur le Rocher, reste au cœur des investigations des autorités, tandis que la coopération internationale se poursuit pour faire toute la lumière sur les faits.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint continuera de suivre cette affaire et vous informera de tout nouveau développement.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "succes-pour-la-premiere-edition-2026-des-nocturnes-du-terroir-a-sierck-les-bains",
    titre: "Succès pour la première édition 2026 des Nocturnes du Terroir à Sierck-les-Bains.",
    chapeau:
      "La première édition 2026 des Nocturnes du Terroir a rencontré un véritable succès ce vendredi soir à Sierck-les-Bains.",
    categorie: "actualites",
    ordre: 42,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La première édition 2026 des Nocturnes du Terroir a rencontré un véritable succès ce vendredi soir à Sierck-les-Bains. Sous un ciel estival et dans une ambiance conviviale, de nombreux habitants, visiteurs et touristes se sont retrouvés au cœur de la cité pour partager un moment de découverte autour des producteurs, artisans et commerçants locaux.",
      },
      {
        type: "paragraphe",
        texte:
          "Tout au long de la soirée, les allées du marché et les grandes tablées installées dans le centre-ville n’ont cessé d’accueillir un public venu profiter des spécialités du terroir, des animations et d’un cadre exceptionnel. L’événement a une nouvelle fois démontré toute son importance dans la valorisation des savoir-faire locaux et du patrimoine sierckois.",
      },
      {
        type: "paragraphe",
        texte:
          "Les échanges entre producteurs et visiteurs, la qualité des produits proposés et la météo particulièrement clémente ont largement contribué à la réussite de cette première soirée, confirmant l’attachement du public à ce rendez-vous estival devenu incontournable.",
      },
      {
        type: "paragraphe",
        texte:
          "Présente sur place, Radio Tripoint a réalisé un reportage photo et vidéo afin de faire vivre l’événement à ses auditeurs et à ses lecteurs. Un retour en images est à retrouver sur nos réseaux sociaux.",
      },
      {
        type: "paragraphe",
        texte:
          "Rendez-vous le vendredi 7 août 2026 pour la deuxième édition des Nocturnes du Terroir, qui promet une nouvelle fois de mettre à l’honneur les richesses de notre territoire.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "affaire-du-colis-piege-monaco-lance-une-chasse-a-l-echelle-europeenne",
    titre: "Affaire du colis piégé : Monaco lance une chasse à l’échelle européenne.",
    chapeau: "L’enquête sur l’explosion d’un colis piégé survenue à Monaco progresse.",
    categorie: "actualites",
    ordre: 43,
    auteur: "Rédaction – Radio Tripoint | Service International",
    corps: [
      {
        type: "paragraphe",
        texte:
          "L’enquête sur l’explosion d’un colis piégé survenue à Monaco progresse. Les autorités ont identifié la principale suspecte : Anastasiia Berezovska, une ressortissante ukrainienne de 39 ans, domiciliée en Allemagne.",
      },
      {
        type: "paragraphe",
        texte:
          "La suspecte fait désormais l’objet d’un mandat d’arrêt international et d’une notice rouge d’Interpol. Les enquêteurs estiment qu’elle n’aurait pas agi seule et poursuivent leurs investigations afin d’identifier d’éventuels complices ainsi que les commanditaires de cette attaque.",
      },
      {
        type: "paragraphe",
        texte:
          "Selon les premiers éléments de l’enquête, l’opération aurait été préparée avec soin. Les autorités monégasques travaillent désormais en étroite collaboration avec plusieurs services de police européens, notamment en Allemagne, afin de retrouver la suspecte et de faire toute la lumière sur cette affaire.",
      },
      {
        type: "paragraphe",
        texte:
          "L’enquête se poursuit et d’autres développements sont attendus dans les prochains jours.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "sierck-les-bains-les-nocturnes-du-terroir-c-est-ce-vendredi",
    titre: "Sierck-les-Bains : les Nocturnes du Terroir, c’est ce vendredi !",
    chapeau: "Les Nocturnes du Terroir sont de retour ce vendredi 3 juillet à Sierck-les-Bains.",
    categorie: "actualites",
    ordre: 45,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Les Nocturnes du Terroir sont de retour ce vendredi 3 juillet à Sierck-les-Bains. De 18 h à minuit, la Place du Marché et le Parc Valette accueilleront plus de 60 producteurs et artisans pour une soirée placée sous le signe de la convivialité.",
      },
      {
        type: "paragraphe",
        texte:
          "Au programme : produits locaux, dégustations, artisanat, restauration sur place et de nombreuses rencontres avec les acteurs qui font vivre notre territoire.",
      },
      {
        type: "paragraphe",
        texte:
          "Chaque année, cet événement attire un public venu de toute la Grande Région et constitue l’un des temps forts de l’été à Sierck-les-Bains.",
      },
      {
        type: "paragraphe",
        texte:
          "Que vous soyez en famille, entre amis ou simplement curieux de découvrir les saveurs locales, les Nocturnes du Terroir sont une belle idée de sortie pour bien débuter le week-end.",
      },
      {
        type: "paragraphe",
        texte:
          "📅 Vendredi 3 juillet – de 18 h à minuit\n📍 Place du Marché & Parc Valette – Sierck-les-Bains",
      },
      {
        type: "paragraphe",
        texte: "Radio Tripoint sera sur place pour vous faire vivre l’événement au plus près.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "travailleurs-frontaliers-entre-bouchons-determination-et-opportunites",
    titre: "TRAVAILLEURS FRONTALIERS Entre bouchons , determination et opportunités.",
    chapeau:
      "Chaque matin, ils sont des milliers à prendre la route depuis la France en direction du Luxembourg.",
    categorie: "actualites",
    ordre: 46,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Chaque matin, ils sont des milliers à prendre la route depuis la France en direction du Luxembourg. Depuis Sierck-les-Bains, Bouzonville, Thionville, ou encore les communes voisines, les travailleurs frontaliers font partie du paysage quotidien de la Grande Région.",
      },
      {
        type: "paragraphe",
        texte:
          "Leur journée commence souvent très tôt. Avant même l’aube pour certains. Direction les axes routiers où les embouteillages font presque partie de la routine. Pourtant, malgré les kilomètres, la fatigue et les aléas de la circulation, ils continuent d’avancer avec la même détermination.",
      },
      {
        type: "paragraphe",
        texte:
          "Être travailleur frontalier, ce n’est pas seulement traverser une frontière. C’est faire le choix d’un emploi, d’une carrière, d’une stabilité professionnelle ou de nouvelles opportunités. Le Luxembourg attire chaque jour des salariés de nombreux secteurs : santé, bâtiment, industrie, finance, commerce, restauration, transport ou encore informatique.",
      },
      {
        type: "paragraphe",
        texte:
          "Mais cette réalité a aussi son revers. Les longues heures passées sur la route, les dépenses liées aux déplacements, l’organisation familiale ou encore la fatigue représentent un véritable défi au quotidien.",
      },
      {
        type: "paragraphe",
        texte:
          "Malgré tout, ces femmes et ces hommes jouent un rôle essentiel dans la vie de notre territoire. Ils participent au dynamisme économique du Luxembourg tout en faisant vivre les commerces, les associations et les communes où ils résident, de l’autre côté de la frontière.",
      },
      {
        type: "paragraphe",
        texte:
          "À Radio Tripoint, nous avons souhaité mettre à l’honneur ces travailleurs qui, chaque jour, relient nos trois pays. Derrière chaque véhicule se cache une histoire, une famille, un métier et surtout une détermination qui force le respect.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "canicule-evenements-annules-piscines-prises-d-assaut-la-chaleur-bouleverse-le",
    titre:
      "Canicule : événements annulés, piscines prises d’assaut… la chaleur bouleverse le quotidien dans la Grande Région.",
    chapeau:
      "La vague de chaleur exceptionnelle qui touche actuellement la Grande Région ne se limite pas aux records de température.",
    categorie: "actualites",
    ordre: 47,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La vague de chaleur exceptionnelle qui touche actuellement la Grande Région ne se limite pas aux records de température. De la Moselle au Luxembourg, en passant par la Sarre, les conséquences se multiplient : événements annulés ou reportés, horaires adaptés, restrictions préfectorales et forte affluence dans les piscines et les espaces de fraîcheur.",
      },
      {
        type: "paragraphe",
        texte:
          "Face à des températures qui approchent ou dépassent localement les 40 °C, de nombreux organisateurs ont préféré faire primer la sécurité. Plusieurs manifestations culturelles, sportives et festives ont ainsi été annulées ou reportées ces derniers jours, tandis que certaines communes ont adapté leurs programmes ou supprimé les animations les plus exposées à la chaleur. Les autorités rappellent également les risques liés aux feux de végétation, entraînant des restrictions concernant certains événements en plein air.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans le même temps, les piscines, plans d’eau autorisés et espaces climatisés connaissent une fréquentation exceptionnelle. De nombreuses familles cherchent des solutions pour se rafraîchir, parfois dès l’ouverture des établissements.",
      },
      {
        type: "paragraphe",
        texte:
          "Au Luxembourg comme en France, les autorités maintiennent un haut niveau de vigilance et invitent la population à limiter les déplacements durant les heures les plus chaudes, à bien s’hydrater et à porter une attention particulière aux personnes âgées, aux jeunes enfants et aux personnes fragiles",
      },
      { type: "paragraphe", texte: "Avant de prendre la route…" },
      {
        type: "paragraphe",
        texte:
          "Si vous aviez prévu de participer à une fête de village, un concert, une brocante, une compétition sportive ou une animation en plein air ce week-end, nous vous recommandons vivement de vérifier que l’événement est bien maintenu. De nombreuses modifications interviennent parfois quelques heures seulement avant le début des manifestations.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "fortes-chaleurs-vigilance-et-bons-reflexes-dans-les-trois-frontieres",
    titre: "Fortes chaleurs : vigilance et bons réflexes dans les Trois Frontières.",
    chapeau:
      "Alors que le thermomètre dépasse régulièrement les 30°C dans la région des Trois Frontières, les autorités sanitaires appellent à la prudence face à cet épisode de fortes chaleurs qui touche l’ensemble du territoire.",
    categorie: "actualites",
    ordre: 51,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Alors que le thermomètre dépasse régulièrement les 30°C dans la région des Trois Frontières, les autorités sanitaires appellent à la prudence face à cet épisode de fortes chaleurs qui touche l’ensemble du territoire.",
      },
      {
        type: "paragraphe",
        texte:
          "À Sierck-les-Bains, Apach, Perl, Schengen et dans les communes voisines, habitants et visiteurs cherchent des solutions pour se rafraîchir tout en profitant de la saison estivale. Si le soleil est au rendez-vous, il est essentiel d’adopter les bons réflexes pour éviter les risques liés à la chaleur.",
      },
      {
        type: "paragraphe",
        texte:
          "Les personnes âgées, les jeunes enfants, les travailleurs en extérieur et les personnes souffrant de maladies chroniques sont particulièrement vulnérables. La déshydratation, les malaises ou encore les coups de chaleur peuvent survenir rapidement lorsque les températures restent élevées plusieurs jours consécutifs.",
      },
      { type: "paragraphe", texte: "Parmi les recommandations essentielles :" },
      {
        type: "liste",
        elements: [
          "Boire régulièrement de l’eau sans attendre d’avoir soif.",
          "Éviter les efforts physiques aux heures les plus chaudes de la journée, entre 11h et 18h.",
          "Maintenir son logement au frais en fermant volets et fenêtres pendant la journée.",
          "Privilégier les lieux ombragés et climatisés lorsque cela est possible.",
          "Porter des vêtements légers, amples et de couleur claire.",
          "Donner régulièrement des nouvelles aux personnes âgées ou isolées de son entourage.",
        ],
      },
      {
        type: "paragraphe",
        texte:
          "Les animaux domestiques nécessitent également une attention particulière. Ils doivent disposer en permanence d’eau fraîche et ne jamais être laissés dans un véhicule, même pour une courte durée.",
      },
      {
        type: "paragraphe",
        texte:
          "Malgré ces températures élevées, la période estivale reste propice aux activités de plein air, à condition d’adapter ses horaires et de rester attentif aux signes de fatigue ou de déshydratation.",
      },
      {
        type: "paragraphe",
        texte:
          "Les prochains événements de l’été, notamment les Nocturnes du Terroir à Sierck-les-Bains, permettront d’ailleurs de profiter d’animations conviviales dans une ambiance plus fraîche en soirée.",
      },
      {
        type: "paragraphe",
        texte:
          "Face à la chaleur, la prévention reste le meilleur réflexe. Quelques gestes simples permettent de profiter pleinement de l’été tout en protégeant sa santé et celle de ses proches.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "apres-la-saint-jean-sierck-les-bains-poursuit-son-elan-estival",
    titre: "Après la Saint-Jean, Sierck-les-Bains poursuit son élan estival.",
    chapeau:
      "Les festivités de la Saint-Jean ont une nouvelle fois rassemblé habitants et visiteurs dans une ambiance conviviale et festive à Sierck-les-Bains.",
    categorie: "actualites",
    ordre: 52,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Les festivités de la Saint-Jean ont une nouvelle fois rassemblé habitants et visiteurs dans une ambiance conviviale et festive à Sierck-les-Bains. Ce rendez-vous incontournable du début de l’été confirme le dynamisme d’une commune qui multiplie les initiatives pour faire vivre son territoire et renforcer son attractivité.",
      },
      {
        type: "paragraphe",
        texte:
          "Au cœur des Trois Frontières, Sierck-les-Bains bénéficie d’atouts uniques. Son patrimoine historique, son cadre naturel exceptionnel et sa proximité avec le Luxembourg et l’Allemagne en font une destination appréciée des touristes comme des habitants de la région.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette attractivité s’appuie également sur une véritable dynamique locale. Rénovation de bâtiments, amélioration des équipements, développement de nouveaux espaces destinés aux associations et aux événements : plusieurs projets témoignent d’une volonté de préparer l’avenir et d’accompagner le développement de la commune.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette ambition se retrouve également dans la programmation estivale. Après la Saint-Jean, place aux Nocturnes du Terroir, rendez-vous désormais bien installé dans le calendrier local. Organisées chaque été, elles mettent à l’honneur les producteurs, artisans et savoir-faire du territoire dans une atmosphère chaleureuse et familiale.",
      },
      {
        type: "paragraphe",
        texte:
          "Les prochaines éditions se dérouleront les 3 juillet et 9 août, offrant aux visiteurs une nouvelle occasion de découvrir les richesses locales tout en profitant des animations proposées dans un cadre exceptionnel.",
      },
      {
        type: "paragraphe",
        texte:
          "À travers ces événements, Sierck-les-Bains affirme son identité de ville vivante, accueillante et tournée vers l’avenir. Une commune qui mise sur la qualité de vie, le patrimoine et le dynamisme économique pour continuer à séduire de nouveaux habitants, visiteurs et porteurs de projets.",
      },
      {
        type: "paragraphe",
        texte:
          "L’été ne fait que commencer, et Sierck-les-Bains entend bien continuer à faire rayonner son territoire tout au long de la saison.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "coupe-du-monde-2026-la-france-poursuit-sa-route-l-allemagne-deja-qualifiee",
    titre: "Coupe du monde 2026 : la France poursuit sa route, l’Allemagne déjà qualifiée.",
    chapeau:
      "La Coupe du monde 2026 entre progressivement dans sa phase décisive et les supporters des trois frontières suivent avec attention les parcours de la France et de l’Allemagne.",
    categorie: "actualites",
    ordre: 55,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La Coupe du monde 2026 entre progressivement dans sa phase décisive et les supporters des trois frontières suivent avec attention les parcours de la France et de l’Allemagne.",
      },
      {
        type: "paragraphe",
        texte:
          "Après son succès convaincant face au Sénégal (3-1), l’équipe de France aborde son deuxième match avec confiance. Les hommes de Didier Deschamps affronteront l’Irak ce lundi avec l’objectif de se rapprocher d’une qualification pour le tour suivant. Portés par un Kylian Mbappé en grande forme, les Bleus figurent parmi les prétendants sérieux au titre mondial.",
      },
      {
        type: "paragraphe",
        texte:
          "Du côté allemand, la situation est déjà très favorable. Grâce à deux victoires lors de ses premières rencontres, la Mannschaft a validé sa qualification pour la phase à élimination directe. Les Allemands affronteront encore l’Équateur avant de connaître leur adversaire pour le prochain tour.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans notre région des trois frontières, cette Coupe du monde suscite un intérêt particulier. De nombreux habitants suivent aussi bien les performances de la France que celles de l’Allemagne, illustrant une nouvelle fois les liens qui unissent les populations de la Grande Région.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint continuera de suivre la compétition et de vous informer des principaux résultats et rendez-vous à ne pas manquer au cours des prochains jours.",
      },
      { type: "paragraphe", texte: "Prochains matchs :" },
      {
        type: "liste",
        elements: [
          "🇫🇷 France – 🇮🇶 Irak : lundi 22 juin à 23h00",
          "🇪🇨 Équateur – 🇩🇪 Allemagne : mercredi 25 juin à 22h00",
          "🇳🇴 Norvège – 🇫🇷 France : vendredi 26 juin à 21h00",
        ],
      },
      { type: "paragraphe", texte: "Radio Tripoint – La radio des trois frontières." },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "fete-nationale-luxembourgeoise-schengen-et-remich-au-coeur-des-celebrations",
    titre: "Fête nationale luxembourgeoise : Schengen et Remich au cœur des célébrations.",
    chapeau: "Chaque année, le 23 juin, le Luxembourg célèbre sa Fête nationale.",
    categorie: "actualites",
    ordre: 56,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Chaque année, le 23 juin, le Luxembourg célèbre sa Fête nationale. Bien plus qu’un simple jour férié, cette date est l’occasion pour les Luxembourgeois de se rassembler autour de leur histoire, de leurs traditions et de leur attachement au Grand-Duché.",
      },
      {
        type: "paragraphe",
        texte:
          "Partout dans le pays, les communes organisent concerts, animations, cérémonies officielles et feux d’artifice. Dans la région de la Moselle luxembourgeoise, Schengen et Remich figurent parmi les lieux emblématiques où habitants et visiteurs profitent d’une ambiance festive au bord de l’eau.",
      },
      {
        type: "paragraphe",
        texte:
          "Schengen occupe une place particulière dans l’histoire européenne. C’est ici qu’a été signé en 1985 l’accord qui a ouvert la voie à la libre circulation entre plusieurs pays européens. À quelques kilomètres de là, Remich, souvent surnommée la « Perle de la Moselle », attire chaque année de nombreux visiteurs grâce à sa promenade, ses terrasses et son cadre de vie unique.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette édition de la Fête nationale intervient également dans une période importante pour le Grand-Duché. Depuis l’accession au trône du Grand-Duc Guillaume, le Luxembourg poursuit sa volonté de conjuguer modernité, proximité avec les citoyens et ouverture européenne, tout en restant fidèle à ses traditions.",
      },
      {
        type: "paragraphe",
        texte:
          "Aux portes de la France et de l’Allemagne, les célébrations prennent une dimension particulière dans la région des trois frontières. De nombreux habitants traversent quotidiennement les frontières pour travailler, étudier ou partager des moments de vie, faisant de ce territoire un véritable symbole de coopération européenne.",
      },
      {
        type: "paragraphe",
        texte:
          "À l’occasion de cette Fête nationale, Radio Tripoint met à l’honneur Schengen, Remich et l’ensemble des acteurs qui font vivre cette région transfrontalière unique.",
      },
      {
        type: "paragraphe",
        texte: "Bonne fête nationale à toutes les Luxembourgeoises et à tous les Luxembourgeois !",
      },
      { type: "paragraphe", texte: "🇱🇺 🇫🇷 🇩🇪" },
      { type: "paragraphe", texte: "Radio Tripoint – La radio des trois frontières." },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "football-les-bleus-rassurent-avant-la-coupe-du-monde-la-france-domine-l-irlande",
    titre:
      "Football – Les Bleus rassurent avant la Coupe du monde : la France domine l’Irlande du Nord (3-1).",
    chapeau:
      "Lille, 8 juin 2026 – À trois jours du coup d’envoi de la Coupe du monde, l’équipe de France a envoyé un signal positif en s’imposant 3 buts à 1 face à l’Irlande du Nord lors de son dernier match de préparation.",
    categorie: "actualites",
    ordre: 63,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Lille, 8 juin 2026 – À trois jours du coup d’envoi de la Coupe du monde, l’équipe de France a envoyé un signal positif en s’imposant 3 buts à 1 face à l’Irlande du Nord lors de son dernier match de préparation.",
      },
      {
        type: "paragraphe",
        texte:
          "Les hommes de Didier Deschamps ont livré une prestation convaincante, portée par un Michael Olise étincelant, auteur d’un triplé. Malgré la réduction du score nord-irlandaise en seconde période, les Bleus ont maîtrisé la rencontre et affiché une belle efficacité offensive, un élément rassurant à l’approche de la compétition.",
      },
      {
        type: "paragraphe",
        texte:
          "Au-delà du résultat, cette victoire confirme la montée en puissance du collectif français. L’animation offensive, la qualité technique et la confiance affichée par plusieurs cadres laissent entrevoir une équipe prête à relever le défi mondial, même si quelques ajustements défensifs restent à peaufiner.",
      },
      {
        type: "paragraphe",
        texte:
          "La Coupe du monde débute le 11 juin 2026, ouvrant une nouvelle aventure pour les Bleus qui viseront un parcours à la hauteur de leurs ambitions. Après cette victoire 3-1 à Lille, les supporters français peuvent aborder les prochaines échéances avec optimisme.",
      },
      { type: "paragraphe", texte: "Score final : France 3 – 1 Irlande du Nord." },
      { type: "paragraphe", texte: "Homme du match : Michael Olise, auteur d’un triplé." },
      { type: "paragraphe", texte: "Radio Tripoint – La radio transfrontalière 🇫🇷🇩🇪🇱🇺" },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "deutschland-sendet-ein-starkes-signal-vor-der-weltmeisterschaft-2-1-sieg-gegen",
    titre:
      "Deutschland sendet ein starkes Signal vor der Weltmeisterschaft – 2:1-Sieg gegen die USA.",
    chapeau: "Chicago, 6.",
    categorie: "actualites",
    ordre: 64,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Chicago, 6. Juni 2026 – Wenige Tage vor dem Start der Fußball-Weltmeisterschaft hat die deutsche Nationalmannschaft ihre Generalprobe erfolgreich bestanden. Das Team von Julian Nagelsmann gewann sein letztes Testspiel gegen die USA mit 2:1 und tankte damit Selbstvertrauen für das bevorstehende Turnier.",
      },
      {
        type: "paragraphe",
        texte:
          "Deutschland erwischte einen Traumstart: Kai Havertz brachte die Mannschaft bereits nach 1 Minute und 42 Sekunden in Führung und setzte damit früh ein Ausrufezeichen. Die Gastgeber glichen zwar durch Antonee Robinson aus, doch die DFB-Elf ließ sich nicht aus dem Konzept bringen.",
      },
      {
        type: "paragraphe",
        texte:
          "In der zweiten Halbzeit sorgte Leroy Sané mit seinem Treffer in der 57. Minute für die Entscheidung. Mit einer konzentrierten Defensivleistung und effizientem Offensivspiel brachte Deutschland den Vorsprung souverän über die Zeit.",
      },
      {
        type: "paragraphe",
        texte:
          "Der 2:1-Erfolg unterstreicht die positive Entwicklung der Mannschaft kurz vor Beginn der Weltmeisterschaft, die am 11. Juni 2026 startet. Die Mischung aus erfahrenen Spielern und jungen Talenten macht Hoffnung auf ein erfolgreiches Turnier.",
      },
      { type: "paragraphe", texte: "Endstand: Deutschland 2:1 USA" },
      { type: "paragraphe", texte: "Torschützen:" },
      {
        type: "liste",
        elements: ["🇩🇪 Kai Havertz (1:42)", "🇩🇪 Leroy Sané (57.)", "🇺🇸 Antonee Robinson (37.)"],
      },
      { type: "paragraphe", texte: "Radio Tripoint – Das grenzüberschreitende Radio 🇫🇷" },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "radio-tripoint-lance-sa-campagne-un-ete-sans-danger-pour-sensibiliser-les",
    titre:
      "Radio Tripoint lance sa campagne « Un été sans danger » pour sensibiliser les jeunes aux addictions.",
    chapeau:
      "À l’approche des vacances d’été, Radio Tripoint lance sa campagne transfrontalière de prévention et de sensibilisation intitulée « Un été sans danger », qui se déroulera du 21 juin au 10 juillet 2026.",
    categorie: "actualites",
    ordre: 65,
    corps: [
      {
        type: "paragraphe",
        texte:
          "À l’approche des vacances d’été, Radio Tripoint lance sa campagne transfrontalière de prévention et de sensibilisation intitulée « Un été sans danger », qui se déroulera du 21 juin au 10 juillet 2026.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette campagne s’adresse aux jeunes, aux familles et à l’ensemble du territoire transfrontalier. Son objectif est simple : expliquer, informer et sensibiliser, sans jugement, sur les risques liés aux pratiques addictives et aux comportements pouvant mettre la santé en danger.",
      },
      {
        type: "paragraphe",
        texte:
          "Durant l’été, les jeunes sont souvent plus exposés aux fêtes, aux groupes, aux nouvelles expériences et parfois à certaines pressions. Radio Tripoint souhaite donc utiliser sa voix de média de proximité pour rappeler qu’un moment de plaisir ne doit jamais devenir un danger.",
      },
      { type: "paragraphe", texte: "La campagne abordera plusieurs thèmes :" },
      {
        type: "paragraphe",
        texte:
          "Le protoxyde d’azote, aussi appelé « les ballons », dont les intoxications sont en hausse. En 2023, 472 signalements liés à sa consommation ont été enregistrés par le réseau d’addictovigilance, soit 30 % de plus qu’en 2022. Ses conséquences peuvent être graves : perte de connaissance, accidents, troubles neurologiques, difficultés à marcher, voire paralysie.",
      },
      {
        type: "paragraphe",
        texte:
          "Le cannabis et le THC, notamment chez les adolescents et jeunes adultes, dont le cerveau est encore en développement. La campagne rappellera les risques sur la mémoire, la concentration, la motivation et la santé mentale.",
      },
      {
        type: "paragraphe",
        texte:
          "L’alcool et le tabac, souvent banalisés, mais responsables de dépendances, de pertes de contrôle, d’accidents et de conséquences durables sur la santé.",
      },
      {
        type: "paragraphe",
        texte:
          "Les écrans, les jeux vidéo et les réseaux sociaux, qui peuvent aussi entraîner isolement, perte de sommeil, anxiété, besoin constant de validation et rupture du lien social.",
      },
      {
        type: "paragraphe",
        texte:
          "À travers des visuels, des messages radio et des publications en ligne, Radio Tripoint veut encourager les jeunes à faire des choix éclairés, à prendre soin d’eux et à protéger leurs amis.",
      },
      { type: "paragraphe", texte: "Le message central de la campagne est clair :" },
      {
        type: "paragraphe",
        texte: "Un été sans danger et sans addictions.\nInformer aujourd’hui pour protéger demain.",
      },
      {
        type: "paragraphe",
        texte: "Parce qu’un été réussi est un été où chacun rentre chez soi en sécurité.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "perl-la-flamme-de-l-espoir-des-special-olympics-fait-etape-dans-la-commune",
    titre: "Perl : la Flamme de l’Espoir des Special Olympics fait étape dans la commune.",
    chapeau:
      "La Flamme de l’Espoir des Special Olympics a fait étape à Perl à l’occasion de son parcours à travers l’Allemagne en vue des Special Olympics Nationale Spiele Saarland 2026.",
    categorie: "actualites",
    ordre: 68,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La Flamme de l’Espoir des Special Olympics a fait étape à Perl à l’occasion de son parcours à travers l’Allemagne en vue des Special Olympics Nationale Spiele Saarland 2026.",
      },
      {
        type: "paragraphe",
        texte:
          "De nombreux élèves, bénévoles, représentants associatifs et personnalités politiques se sont réunis sur le site sportif de la commune pour célébrer les valeurs d’inclusion, de solidarité et de participation portées par le mouvement Special Olympics.",
      },
      {
        type: "paragraphe",
        texte:
          "L’un des moments forts de la cérémonie a été le passage symbolique de la Flamme de l’Espoir, transportée dans un esprit de partage entre personnes en situation de handicap et personnes valides. Un geste fort illustrant l’engagement des Special Olympics en faveur d’une société plus inclusive.",
      },
      {
        type: "paragraphe",
        texte:
          "Parmi les personnalités présentes figuraient notamment le maire de Perl, le maire de Schengen ainsi que Martina Holzner, représentante politique du Land de Sarre. Leur présence a souligné l’importance de cet événement pour la coopération régionale et pour la promotion du sport accessible à tous.",
      },
      {
        type: "paragraphe",
        texte:
          "De nombreux jeunes ont également participé à cette journée placée sous le signe du respect, du vivre-ensemble et de l’engagement citoyen. Les drapeaux des Special Olympics et les encouragements du public ont contribué à créer une atmosphère chaleureuse malgré une météo incertaine.",
      },
      {
        type: "paragraphe",
        texte:
          "La tournée de la Flamme de l’Espoir se poursuit désormais à travers le pays jusqu’à la cérémonie d’ouverture des Special Olympics Nationale Spiele Saarland 2026, qui se dérouleront du 15 au 20 juin 2026 en Sarre.",
      },
      {
        type: "paragraphe",
        texte:
          "Par sa participation à cet événement, la commune de Perl confirme son engagement en faveur des valeurs d’inclusion et de coopération qui caractérisent la région transfrontalière.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint était sur place pour suivre l’événement et recueillir les images de cette étape symbolique de la Flamme de l’Espoir.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "football-le-grand-rendez-vous-commence-maintenant",
    titre: "Football : le grand rendez-vous commence maintenant.",
    chapeau: "Le football entre dans une séquence majeure.",
    categorie: "actualites",
    ordre: 69,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Le football entre dans une séquence majeure. Avant la Coupe du monde 2026, qui se jouera du 11 juin au 19 juillet 2026 au Canada, au Mexique et aux États-Unis, les regards sont d’abord tournés vers la finale de la Ligue des champions.",
      },
      {
        type: "paragraphe",
        texte:
          "Ce samedi 30 mai 2026 à 18h, le Paris Saint-Germain affrontera Arsenal à la Puskás Aréna de Budapest. Une affiche prestigieuse, entre un PSG qui veut confirmer son statut européen et un Arsenal en quête d’un sacre historique.",
      },
      {
        type: "paragraphe",
        texte:
          "Mais cette finale dépasse le simple cadre d’un match. Elle ouvre une grande période de football mondial, où les clubs, les nations, les supporters et les médias se préparent déjà à vivre un été 2026 exceptionnel.",
      },
      {
        type: "paragraphe",
        texte:
          "La prochaine Coupe du monde sera d’ailleurs historique : pour la première fois, elle réunira 48 équipes et se jouera dans trois pays hôtes. Un format élargi, pensé pour donner encore plus de place au spectacle, aux émotions et aux grandes histoires du football.",
      },
      {
        type: "paragraphe",
        texte:
          "De Budapest à l’Amérique du Nord, le ballon rond s’apprête donc à reprendre toute la lumière. Pour les passionnés, une chose est sûre : le grand rendez-vous du football commence maintenant.",
      },
      { type: "paragraphe", texte: "Radio Trois Points suivra cette actualité de près." },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "inauguration-du-nouveau-plateau-sportif-et-de-la-piste-d-athletisme-a-perl",
    titre: "Inauguration du nouveau plateau sportif et de la piste d’athlétisme à Perl.",
    chapeau:
      "La commune de Perl a inauguré son nouveau plateau sportif et sa nouvelle piste d’athlétisme ce lundi 18 Mai 2026 lors d’un moment convivial réunissant élus locaux, habitants, familles et acteurs associatifs de la région transfrontalière.",
    categorie: "actualites",
    ordre: 70,
    corps: [
      {
        type: "paragraphe",
        texte:
          "La commune de Perl a inauguré son nouveau plateau sportif et sa nouvelle piste d’athlétisme ce lundi 18 Mai 2026 lors d’un moment convivial réunissant élus locaux, habitants, familles et acteurs associatifs de la région transfrontalière.",
      },
      {
        type: "paragraphe",
        texte:
          "Pensé comme un lieu de rencontre et de pratique sportive pour tous, cet espace moderne permettra aux jeunes, aux écoles, aux clubs sportifs et aux habitants de profiter d’infrastructures adaptées aux activités sportives et de loisirs. Des animations et démonstrations ont également été organisées sur le terrain à l’occasion de cette inauguration.",
      },
      {
        type: "paragraphe",
        texte:
          "L’événement a mis en avant l’importance de la coopération entre les territoires frontaliers, dans un esprit de proximité, de partage et de dynamisme régional. Plusieurs personnalités locales étaient présentes pour saluer ce projet tourné vers la jeunesse et le vivre-ensemble.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint, la radio transfrontalière, était également présente pour couvrir cette inauguration et mettre en lumière les initiatives locales qui renforcent les liens entre la France, l’Allemagne et le Luxembourg.",
      },
      {
        type: "paragraphe",
        texte:
          "« Ensemble, valorisons notre région » : un message qui résume parfaitement l’esprit de cette nouvelle infrastructure sportive ouverte sur l’avenir.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "remich-un-bateau-vandalise-sur-la-moselle",
    titre: "REMICH : un bateau vandalisé sur la Moselle",
    chapeau: "Des actes de vandalisme ont été signalés dans la nuit à Remich, au Luxembourg.",
    categorie: "actualites",
    ordre: 71,
    corps: [
      {
        type: "paragraphe",
        texte: "Des actes de vandalisme ont été signalés dans la nuit à Remich, au Luxembourg.",
      },
      {
        type: "paragraphe",
        texte:
          "Selon les premières informations, plusieurs individus seraient montés à bord d’un bateau amarré sur la Moselle avant de provoquer des dégradations et de jeter du mobilier dans l’eau.",
      },
      {
        type: "paragraphe",
        texte: "L’incident aurait duré plusieurs minutes avant la fuite des auteurs.",
      },
      {
        type: "paragraphe",
        texte:
          "Les autorités poursuivent leurs investigations.\nUn nouveau fait divers qui relance les questions autour de la sécurité et des dégradations dans les zones festives de la frontière.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "fete-des-peres-trois-pays-trois-traditions-un-meme-message",
    titre: "Fête des Pères : trois pays, trois traditions, un même message.",
    chapeau:
      "Entre la France, l’Allemagne et le Luxembourg, la Fête des Pères ne se célèbre pas à la même date, ni toujours de la même manière.",
    categorie: "actualites",
    ordre: 72,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Entre la France, l’Allemagne et le Luxembourg, la Fête des Pères ne se célèbre pas à la même date, ni toujours de la même manière. Pourtant, au cœur du pays des trois frontières, une chose rassemble toutes les familles : l’envie de remercier les papas.",
      },
      {
        type: "paragraphe",
        texte:
          "En Allemagne, le Vatertag est célébré aujourd’hui, le 14 mai 2024, souvent dans une ambiance conviviale entre amis ou en famille, avec des balades et des moments de partage.",
      },
      {
        type: "paragraphe",
        texte:
          "En France, la Fête des Pères aura lieu le 21 juin 2024, tandis qu’au Luxembourg elle sera célébrée le 4 octobre 2024.",
      },
      {
        type: "paragraphe",
        texte:
          "Trois pays, trois traditions… mais un même message : célébrer ceux qui accompagnent, soutiennent et inspirent chaque jour.",
      },
      {
        type: "paragraphe",
        texte:
          "Avec Radio Tripoint, la radio transfrontalière, les cultures se rencontrent et les frontières se rapprochent autour des valeurs humaines qui unissent notre région.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "clap-de-fin-pour-le-festival3",
    titre: "Clap de fin pour le Festival³ 🇪🇺",
    chapeau:
      "À l’occasion des festivités européennes organisées entre Apach, Perl et Schengen, plusieurs milliers de visiteurs se sont retrouvés au cœur des trois frontières pour célébrer l’Europe dans une ambiance conviviale et transfrontalière.",
    categorie: "actualites",
    ordre: 73,
    corps: [
      {
        type: "paragraphe",
        texte:
          "À l’occasion des festivités européennes organisées entre Apach, Perl et Schengen, plusieurs milliers de visiteurs se sont retrouvés au cœur des trois frontières pour célébrer l’Europe dans une ambiance conviviale et transfrontalière.",
      },
      {
        type: "paragraphe",
        texte:
          "Cette édition du Festival³ a notamment été marquée par l’inauguration du nouvel espace de la Place de l’Étoile, situé face au musée de Schengen, devenu l’un des points centraux des animations et des rencontres tout au long de la journée.",
      },
      {
        type: "paragraphe",
        texte:
          "Entre expositions, associations, artisanat, gastronomie, musique et initiatives locales, plus d’une centaine d’exposants étaient présents pour mettre en avant le dynamisme et la richesse culturelle de la Grande Région.",
      },
      {
        type: "paragraphe",
        texte:
          "Un important dispositif de sécurité était également déployé sur l’ensemble du site afin d’assurer le bon déroulement de l’événement dans un cadre familial et festif.",
      },
      {
        type: "paragraphe",
        texte:
          "Une journée placée sous le signe du partage, de la culture et de l’esprit européen au cœur des trois frontières.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "festival-3-le-tripoint-au-coeur-de-l-europe-entre-deja-en-effervescence",
    titre: "Festival 3 : le tripoint au cœur de l’Europe entre déjà en effervescence.",
    chapeau:
      "À quelques jours du Festival 3, le tripoint, véritable cœur de l’Europe, commence déjà à vibrer au rythme des préparatifs.",
    categorie: "actualites",
    ordre: 74,
    corps: [
      {
        type: "paragraphe",
        texte:
          "À quelques jours du Festival 3, le tripoint, véritable cœur de l’Europe, commence déjà à vibrer au rythme des préparatifs. À J-5 de l’événement, les premiers signes d’installation sont bien visibles sur le terrain.",
      },
      {
        type: "paragraphe",
        texte:
          "Le long des zones prévues pour accueillir le public, le bornage des emplacements destinés aux stands a débuté. Les équipes techniques s’activent pour structurer l’espace, tandis que les premiers éléments logistiques prennent place. Une montée en puissance progressive qui annonce un rendez-vous d’ampleur.",
      },
      {
        type: "paragraphe",
        texte:
          "Du côté des commerçants et exposants, l’heure est également à la préparation. Entre organisation des stocks, mise en place des produits et anticipation de l’affluence, chacun se prépare à faire de cet événement un moment fort de la semaine.",
      },
      {
        type: "paragraphe",
        texte:
          "Avec une programmation mêlant food, musique, animations et découvertes, le Festival 3 s’annonce comme un temps fort incontournable dans la région des trois frontières.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint sera sur place pour vous faire vivre l’événement au plus près, au cœur de l’Europe.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "liberte-de-la-presse-un-pilier-essentiel-toujours-sous-pression",
    titre: "Liberté de la presse : un pilier essentiel toujours sous pression.",
    chapeau:
      "Chaque année, le 3 mai marque la Journée mondiale de la liberté de la presse, une date clé pour rappeler l’importance d’une information libre, indépendante et accessible à tous.",
    categorie: "actualites",
    ordre: 75,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Chaque année, le 3 mai marque la Journée mondiale de la liberté de la presse, une date clé pour rappeler l’importance d’une information libre, indépendante et accessible à tous.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans un contexte international marqué par des tensions politiques, des conflits et une montée des pressions sur les médias, cette journée prend une dimension particulière. Selon plusieurs organisations, de nombreux journalistes à travers le monde continuent de faire face à des menaces, des censures, voire des violences dans l’exercice de leur métier.",
      },
      {
        type: "paragraphe",
        texte:
          "En Europe comme ailleurs, la vigilance reste de mise. Si la liberté de la presse est globalement protégée, certaines dérives, notamment liées à la désinformation ou aux pressions économiques, viennent fragiliser l’équilibre du paysage médiatique.",
      },
      {
        type: "paragraphe",
        texte:
          "À l’échelle locale, cette journée est aussi l’occasion de rappeler le rôle des médias de proximité, essentiels pour relayer une information fiable et ancrée dans le territoire.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint s’inscrit dans cette démarche : informer, donner la parole et faire vivre l’actualité des trois frontières en toute indépendance.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "incendie-de-l-eglise-de-montenach-un-symbole-local-touche",
    titre: "Incendie de l’église de Montenach : un symbole local touché.",
    chapeau:
      "L’émotion est vive dans le village après l’incendie qui a touché l’église communale Saint-Cyriaque, un lieu emblématique du patrimoine local.",
    categorie: "actualites",
    ordre: 76,
    corps: [
      {
        type: "paragraphe",
        texte:
          "L’émotion est vive dans le village après l’incendie qui a touché l’église communale Saint-Cyriaque, un lieu emblématique du patrimoine local. Le sinistre s’est déclaré récemment, mobilisant rapidement les sapeurs-pompiers du secteur.",
      },
      {
        type: "paragraphe",
        texte:
          "Selon les premiers éléments, une partie de l’édifice aurait été endommagée, notamment à l’intérieur. L’intervention rapide des secours a permis de limiter la propagation des flammes et d’éviter une destruction totale du bâtiment. Aucun blessé n’est à déplorer à ce stade, mais les dégâts matériels restent significatifs.",
      },
      {
        type: "paragraphe",
        texte:
          "Très attachés à leur église, les habitants de Montenach expriment leur inquiétude face à l’état du monument, au cœur de la vie du village. « C’est un lieu chargé d’histoire, de souvenirs, et de rassemblement », confie un riverain.",
      },
      {
        type: "paragraphe",
        texte:
          "Une enquête a été ouverte afin de déterminer les causes exactes de l’incendie. La municipalité envisage déjà les premières mesures pour sécuriser le site et réfléchir à sa restauration.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "soleil-vents-froids-pollen-et-grippe-la-region-sous-surveillance",
    titre: "Soleil, vents froids, pollen et grippe : la région sous surveillance.",
    chapeau:
      "Malgré un soleil bien présent ces derniers jours, la région des trois frontières connaît actuellement un contraste marqué avec l’arrivée de vents froids venus du nord.",
    categorie: "actualites",
    ordre: 77,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Malgré un soleil bien présent ces derniers jours, la région des trois frontières connaît actuellement un contraste marqué avec l’arrivée de vents froids venus du nord. Une situation qui peut surprendre, notamment en fin de journée où les températures chutent rapidement.",
      },
      {
        type: "paragraphe",
        texte:
          "En parallèle, les niveaux de pollen sont en forte hausse. De nombreux habitants ressentent déjà les effets des allergies saisonnières, avec des symptômes parfois proches de ceux de la grippe, ce qui peut prêter à confusion.",
      },
      {
        type: "paragraphe",
        texte:
          "Justement, les professionnels de santé observent également une recrudescence des cas de grippe dans la région. Une situation qui invite à la vigilance, en particulier pour les personnes les plus sensibles.",
      },
      {
        type: "paragraphe",
        texte:
          "Face à ce contexte, il est recommandé de s’adapter aux conditions météo en se couvrant suffisamment, même en période ensoleillée, et de rester attentif à son état de santé.",
      },
      {
        type: "paragraphe",
        texte:
          "Du côté de l’actualité locale, la région se prépare également à l’arrivée du Festival des 3 Frontières. Les équipes s’activent déjà pour faire de cet événement un moment fort du début de saison estivale. Radio Tripoint accompagnera cette dynamique avec son format spécial “Road to Festival 3”, proposant chaque jour une immersion dans les coulisses de l’événement.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "apach-au-coeur-de-l-evenement-du-9-mai-mobilisation-locale-pour-celebrer-l",
    titre: "Apach au cœur de l’événement du 9 mai : mobilisation locale pour célébrer l’Europe.",
    chapeau:
      "À l’approche du Festival de la Journée de l’Europe, organisé le 9 mai 2026 à Apach, Perl et Schengen, la mobilisation s’intensifie dans les communes concernées.",
    categorie: "actualites",
    ordre: 79,
    corps: [
      {
        type: "paragraphe",
        texte:
          "À l’approche du Festival de la Journée de l’Europe, organisé le 9 mai 2026 à Apach, Perl et Schengen, la mobilisation s’intensifie dans les communes concernées. À cette occasion, Radio Tripoint est allé à la rencontre de Anne Wolf, adjointe de la commune d’Apach.",
      },
      {
        type: "paragraphe",
        texte:
          "Pour l’élue, une chose est claire :\n« Apach est au cœur de l’événement du festival du 9 mai », affirme-t-elle.",
      },
      {
        type: "paragraphe",
        texte:
          "Afin d’informer efficacement les habitants, plusieurs outils de communication sont déjà mobilisés.\n« Nous avons nos supports habituels comme Facebook avec Le Petit Apachois, mais aussi des documents distribués pour les personnes qui ne sont pas sur les réseaux sociaux, ainsi que le relais de l’office de tourisme de la communauté de communes », précise-t-elle.",
      },
      {
        type: "paragraphe",
        texte:
          "Mais au-delà des moyens techniques, c’est surtout l’ADN du village qui joue un rôle clé dans cette dynamique.\nApach se distingue par un tissu associatif actif et une vie locale animée.",
      },
      {
        type: "paragraphe",
        texte:
          "« Apach est un village vivant, où le monde associatif est dynamique. Les habitants sont habitués à être informés et impliqués dans les événements qui se déroulent au cœur de leur territoire », souligne Anne Wolf.",
      },
      {
        type: "paragraphe",
        texte:
          "Un territoire qui, pour l’occasion, prend une dimension encore plus symbolique : celle de l’Europe.",
      },
      {
        type: "paragraphe",
        texte:
          "Situé au carrefour de trois pays, l’événement du 9 mai incarne pleinement l’esprit transfrontalier.",
      },
      { type: "paragraphe", texte: "L’adjointe lance ainsi un appel clair à la population :" },
      {
        type: "paragraphe",
        texte:
          "« Nous encourageons tous nos habitants à venir fêter l’Europe ensemble avec les Allemands et les Luxembourgeois, mais aussi à venir s’amuser et découvrir, s’ils ne les connaissent pas encore, les richesses de notre territoire. »",
      },
      {
        type: "paragraphe",
        texte:
          "Un message de convivialité, de partage et d’ouverture, à l’image de ce festival qui promet de rassembler bien au-delà des frontières.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "festival3-le-9-mai-circulation-et-animations-a-sierck-les-bains",
    titre: "Festival³ le 9 mai : circulation et animations à Sierck-les-Bains.",
    chapeau:
      "À l’occasion de la Journée de l’Europe, le 9 mai 2026, le territoire des Trois Frontières accueillera le Festival³, un événement transfrontalier réunissant plusieurs communes autour d’un moment festif et convivial.",
    categorie: "actualites",
    ordre: 80,
    corps: [
      {
        type: "paragraphe",
        texte:
          "À l’occasion de la Journée de l’Europe, le 9 mai 2026, le territoire des Trois Frontières accueillera le Festival³, un événement transfrontalier réunissant plusieurs communes autour d’un moment festif et convivial.",
      },
      {
        type: "paragraphe",
        texte:
          "De Apach à Schengen, en passant par Perl et Sierck-les-Bains, ce festival mettra à l’honneur la coopération européenne à travers une programmation accessible à tous.",
      },
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint a eu l’opportunité d’échanger avec Madame Hélène Hammond, maire de Sierck-les-Bains, qui revient sur l’organisation de cet événement.",
      },
      { type: "intertitre", texte: "Circulation : des adaptations à prévoir" },
      {
        type: "paragraphe",
        texte: "La maire appelle les habitants à anticiper leurs déplacements :",
      },
      {
        type: "paragraphe",
        texte:
          "« Effectivement, plusieurs axes seront temporairement fermés, notamment la route touristique traversant la commune ainsi que certains axes principaux aux alentours. Des déviations seront bien sûr mises en place afin de faciliter la circulation. »",
      },
      {
        type: "paragraphe",
        texte:
          "Malgré ces ajustements, l’objectif est clair : faire de cette journée un moment de partage et de découverte.",
      },
      {
        type: "paragraphe",
        texte: "« Mais cela ne doit pas vous empêcher de venir profiter de l’événement ! »",
      },
      { type: "paragraphe", texte: "Au programme du Festival³ :" },
      {
        type: "liste",
        elements: [
          "des exposants tout au long du parcours",
          "de la musique",
          "des espaces de restauration et de rafraîchissement",
          "de nombreuses animations pour petits et grands",
        ],
      },
      { type: "paragraphe", texte: "Un festival à vivre pleinement." },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "festival3-les-elus-des-trois-frontieres-renforcent-leur-cooperation-a-schengen",
    titre: "Festival³ : les élus des Trois Frontières renforcent leur coopération à Schengen",
    chapeau:
      "Plusieurs élus et représentants des communes de Perl, Mettlach, Dalheim, Remich et Schengen, ainsi que Apach et Sierck-les-Bains, se sont réunis à Schengen le 21 Avril dernier pour présenter le Festival³, événement transfrontalier organisé tous les deux ans.",
    categorie: "actualites",
    ordre: 81,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Plusieurs élus et représentants des communes de Perl, Mettlach, Dalheim, Remich et Schengen, ainsi que Apach et Sierck-les-Bains, se sont réunis à Schengen le 21 Avril dernier pour présenter le Festival³, événement transfrontalier organisé tous les deux ans.",
      },
      { type: "paragraphe", texte: "Au cœur des échanges :" },
      {
        type: "paragraphe",
        texte: "- La sécurité de l’événement.\n- La coordination entre les trois pays.",
      },
      { type: "paragraphe", texte: "Et surtout le renforcement des relations transfrontalières." },
      {
        type: "paragraphe",
        texte:
          "Les élus ont également mis en avant plusieurs projets concrets, dont l’inauguration du Tripoint et le développement d’une nouvelle piste cyclable reliant les territoires.",
      },
      {
        type: "paragraphe",
        texte:
          "Le Festival³ s’inscrit comme un moment fort pour valoriser la coopération entre les Trois Frontières, à travers culture, tourisme et initiatives communes.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "reprise-des-controles-a-la-frontiere-de-perl",
    titre: "🚨 Reprise des contrôles à la frontière de Perl.",
    chapeau:
      "Plusieurs usagers de la route et travailleurs frontaliers signalent le retour de contrôles de police du côté de Perl, à la frontière entre l’Allemagne et le Luxembourg.",
    categorie: "actualites",
    ordre: 82,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Plusieurs usagers de la route et travailleurs frontaliers signalent le retour de contrôles de police du côté de Perl, à la frontière entre l’Allemagne et le Luxembourg.",
      },
      {
        type: "paragraphe",
        texte:
          "Ces contrôles, plus visibles ces derniers jours, suscitent des réactions chez les habitants de la région des trois frontières. Certains évoquent un ralentissement de leurs trajets quotidiens, tandis que d’autres s’interrogent sur un possible durcissement des mesures.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans une zone historiquement marquée par la libre circulation, cette situation relance le débat autour de l’équilibre entre sécurité et mobilité.",
      },
      {
        type: "paragraphe",
        texte: "Un sujet que Radio Tripoint continuera de suivre dans les prochains jours.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "circulation-modifiee-a-sierck-les-bains-attention-aux-nouvelles-habitudes-pres",
    titre:
      "Circulation modifiée à Sierck-les-Bains : attention aux nouvelles habitudes près de la mairie.",
    chapeau:
      "Depuis plusieurs mois, le sens de circulation a été modifié à Sierck-les-Bains, à proximité de la mairie.",
    categorie: "actualites",
    ordre: 83,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Depuis plusieurs mois, le sens de circulation a été modifié à Sierck-les-Bains, à proximité de la mairie. Pourtant, de nombreux usagers continuent encore de se tromper, ce qui peut entraîner des incompréhensions et des situations parfois délicates sur la route.",
      },
      {
        type: "paragraphe",
        texte:
          "Désormais, lorsque vous arrivez depuis Rettel, l’accès vers la mairie se fait par la première rue à droite, et non plus par la seconde comme auparavant.",
      },
      {
        type: "paragraphe",
        texte:
          "De la même manière, une fois dans le centre de Sierck, la sortie ne s’effectue plus par cette même rue : il est désormais nécessaire d’emprunter la rue précédente pour quitter la zone.",
      },
      {
        type: "paragraphe",
        texte:
          "Ces changements, bien que mis en place depuis plusieurs mois, nécessitent encore un temps d’adaptation pour les automobilistes. Il est donc important de rester vigilant et de bien observer la signalisation en place.",
      },
      {
        type: "paragraphe",
        texte:
          "L’objectif de cette modification est de fluidifier la circulation et d’améliorer la sécurité dans ce secteur fréquenté.",
      },
      {
        type: "paragraphe",
        texte:
          "N’hésitez pas à partager cette information autour de vous afin d’éviter toute confusion.",
      },
      { type: "paragraphe", texte: "Radio Tripoint – L’info locale au cœur des trois frontières" },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "radio-tripoint-se-mobilise-contre-les-arnaques-et-fraudes-dans-la-region-des",
    titre:
      "Radio Tripoint se mobilise contre les arnaques et fraudes dans la région des trois frontières.",
    chapeau:
      "Face à la montée des arnaques et tentatives de fraude dans la région des trois frontières (France, Luxembourg, Allemagne), Radio Tripoint lance une initiative d’information et de prévention à destination du grand public.",
    categorie: "actualites",
    ordre: 85,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Face à la montée des arnaques et tentatives de fraude dans la région des trois frontières (France, Luxembourg, Allemagne), Radio Tripoint lance une initiative d’information et de prévention à destination du grand public.",
      },
      {
        type: "paragraphe",
        texte:
          "Chaque semaine, la radio mettra en lumière les nouvelles formes d’escroqueries : faux appels, phishing, arnaques bancaires ou encore fraudes en ligne. L’objectif est simple; informer, prévenir et protéger les habitants du territoire.",
      },
      {
        type: "paragraphe",
        texte:
          "« Trop de personnes sont encore victimes de ces pratiques. Explique un usager à Schengen.",
      },
      {
        type: "paragraphe",
        texte:
          "À travers des interviews, témoignages et conseils pratiques, Radio Tripoint souhaite devenir un réflexe local pour lutter contre les fraudes.",
      },
      {
        type: "paragraphe",
        texte:
          "Les auditeurs sont également invités à partager leurs expériences afin d’alerter la communauté et renforcer la vigilance collective.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "la-moselle-se-fait-belle",
    titre: "La Moselle se fait belle",
    chapeau:
      "Avec l’arrivée des beaux jours, la Moselle dévoile un visage particulièrement agréable.",
    categorie: "actualites",
    ordre: 86,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Avec l’arrivée des beaux jours, la Moselle dévoile un visage particulièrement agréable. Sous un ciel bleu et des températures douces, la nature reprend pleinement ses droits dans la région des trois frontières.",
      },
      {
        type: "paragraphe",
        texte:
          "Pelouses fraîchement entretenues, fleurs en pleine éclosion et espaces verts animés témoignent du retour du printemps. Les habitants profitent de ces conditions idéales pour sortir, se promener et redonner vie à leurs extérieurs.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans de nombreuses communes, les services techniques sont également à pied d’œuvre pour embellir les espaces publics. Une dynamique positive qui annonce le retour des beaux jours… et d’une vie locale plus active.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "apach-des-travaux-retardes-par-la-meteo-mais-un-projet-d-embellissement-maintenu",
    titre: "Apach : des travaux retardés par la météo, mais un projet d’embellissement maintenu.",
    chapeau:
      "Les travaux en cours à Apach ont pris un léger retard en raison des conditions météo récentes.",
    categorie: "actualites",
    ordre: 87,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Les travaux en cours à Apach ont pris un léger retard en raison des conditions météo récentes.",
      },
      {
        type: "paragraphe",
        texte:
          "Selon les équipes sur place, la pluie a rendu les sols boueux, compliquant l’avancée du chantier.",
      },
      {
        type: "paragraphe",
        texte: "Malgré cela, ces aménagements visent à embellir et moderniser la commune.",
      },
      {
        type: "paragraphe",
        texte:
          "Bonne nouvelle pour les usagers : les travaux n’entraînent pas de perturbations importantes de la circulation.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "aujourd-hui-18-mars-c-est-la-journee-mondiale-du-recyclage",
    titre: "Aujourd’hui, 18 mars, c’est la Journée mondiale du recyclage 🌍♻️",
    chapeau:
      "Dans la région des trois frontières, entre France, Luxembourg et Allemagne, le recyclage est déjà bien ancré dans les habitudes.",
    categorie: "actualites",
    ordre: 91,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Dans la région des trois frontières, entre France, Luxembourg et Allemagne, le recyclage est déjà bien ancré dans les habitudes.",
      },
      {
        type: "paragraphe",
        texte:
          "Au Luxembourg, le tri est particulièrement avancé avec des systèmes comme les centres de recyclage communaux et la collecte sélective très structurée.",
      },
      {
        type: "paragraphe",
        texte:
          "En Allemagne, notamment en Sarre toute proche, le système de consigne sur les bouteilles, appelé “Pfand”, permet de recycler efficacement plastique et verre, tout en incitant financièrement les habitants.",
      },
      {
        type: "paragraphe",
        texte:
          "Côté français, des efforts sont également en place avec le tri sélectif et les déchetteries locales, même si des marges de progression existent.",
      },
      {
        type: "paragraphe",
        texte:
          "Un territoire, trois pays… mais un objectif commun : réduire les déchets et préserver notre environnement.",
      },
      {
        type: "paragraphe",
        texte:
          "Alors aujourd’hui, que vous soyez à Sierck-les-Bains, Schengen ou Perl, chaque geste compte ♻️",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "dubai-l-aeroport-vise-par-un-drone",
    titre: "Dubaï : l’aéroport visé par un drone",
    chapeau:
      "L’aéroport international de Dubaï a été placé en alerte après la présence d’un drone à proximité des installations.",
    categorie: "actualites",
    ordre: 92,
    corps: [
      {
        type: "paragraphe",
        texte:
          "L’aéroport international de Dubaï a été placé en alerte après la présence d’un drone à proximité des installations.",
      },
      {
        type: "paragraphe",
        texte:
          "Les autorités ont décidé de fermer temporairement l’aéroport et de mettre en place un périmètre de sécurité. Plusieurs vols ont été annulés ou retardés, provoquant des perturbations du trafic aérien.",
      },
      {
        type: "paragraphe",
        texte:
          "Une intervention des services de sécurité est en cours afin de sécuriser la zone. Plus d’informations devraient être communiquées dans les prochaines heures.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "municipales-2026-les-electeurs-appeles-aux-urnes-dans-la-vallee-de-la-moselle",
    titre: "Municipales 2026 : les électeurs appelés aux urnes dans la vallée de la Moselle",
    chapeau:
      "À quelques jours du scrutin municipal, les habitants de la vallée de la Moselle s’apprêtent à renouveler leurs conseils municipaux.",
    categorie: "actualites",
    ordre: 93,
    corps: [
      {
        type: "paragraphe",
        texte:
          "À quelques jours du scrutin municipal, les habitants de la vallée de la Moselle s’apprêtent à renouveler leurs conseils municipaux. Les électeurs sont appelés aux urnes les 15 mars pour le premier tour et 22 mars pour le second tour éventuel. Dans le Pays des Trois Frontières, ces élections locales sont particulièrement suivies en raison des enjeux liés au développement du territoire, au logement et aux mobilités transfrontalières.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans le secteur du Pays des Trois Frontières, autour de Sierck-les-Bains, Apach, Rettel ou encore Contz-les-Bains, ces élections sont particulièrement suivies par les habitants. Les décisions prises par les futurs élus auront un impact direct sur le développement du territoire et la qualité de vie dans les communes.",
      },
      {
        type: "paragraphe",
        texte:
          "Les élections municipales sont souvent considérées comme les élections les plus proches des citoyens. Les conseillers municipaux élus auront pour mission de gérer les affaires de la commune pendant six ans. Une fois le conseil municipal installé, ses membres élisent ensuite le maire.",
      },
      {
        type: "paragraphe",
        texte:
          "Dans les communes rurales de Moselle, la campagne repose généralement sur des équipes locales composées d’habitants engagés dans la vie associative, économique ou citoyenne.",
      },
      { type: "intertitre", texte: "Des enjeux importants pour le territoire" },
      {
        type: "paragraphe",
        texte:
          "Dans la vallée de la Moselle et plus largement dans le Pays des Trois Frontières, plusieurs sujets pourraient occuper une place importante dans le débat municipal :",
      },
      {
        type: "liste",
        elements: [
          "la pression immobilière liée à la proximité du Luxembourg",
          "les déplacements des travailleurs frontaliers",
          "l’aménagement des centres-villes et des villages",
          "la valorisation du patrimoine et du tourisme",
          "la qualité de vie des habitants.",
        ],
      },
      {
        type: "paragraphe",
        texte:
          "Située à proximité immédiate du Luxembourg et de l’Allemagne, cette région frontalière connaît une évolution rapide qui pose de nouveaux défis aux collectivités locales.",
      },
      { type: "intertitre", texte: "Une participation attendue" },
      {
        type: "paragraphe",
        texte:
          "Les électeurs inscrits sur les listes électorales seront donc invités à se rendre dans les bureaux de vote de leur commune afin de choisir les équipes municipales qui porteront les projets pour les années à venir.",
      },
      {
        type: "paragraphe",
        texte:
          "🎙 Radio Tripoint suivra tout au long de la campagne municipale l’actualité locale dans la vallée de la Moselle et donnera la parole aux habitants ainsi qu’aux acteurs de la vie publique.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "iran-usa-les-enjeux-d-une-probable-guerre",
    titre: "IRAN - USA ... Les Enjeux d'une probable guerre!",
    chapeau:
      "Les tensions entre l’Iran et les États-Unis connaissent régulièrement des phases d’intensification.",
    categorie: "actualites",
    ordre: 96,
    auteur: "La rédaction",
    corps: [
      {
        type: "paragraphe",
        texte:
          "Les tensions entre l’Iran et les États-Unis connaissent régulièrement des phases d’intensification. Si une confrontation directe reste aujourd’hui hypothétique, les conséquences d’une escalade militaire seraient majeures, tant sur le plan géopolitique qu’économique.",
      },
      { type: "intertitre", texte: "Un point stratégique : le détroit d’Ormuz" },
      {
        type: "paragraphe",
        texte:
          "L’un des enjeux centraux réside dans le détroit d’Ormuz, par lequel transite une part significative du pétrole mondial. Toute perturbation de cette voie maritime stratégique pourrait provoquer une hausse rapide des cours du brut, avec des répercussions immédiates sur les marchés internationaux.",
      },
      { type: "paragraphe", texte: "Une fermeture, même temporaire, entraînerait :" },
      {
        type: "liste",
        elements: [
          "une tension sur l’approvisionnement énergétique mondial",
          "une hausse des prix du carburant",
          "une pression inflationniste accrue en Europe",
        ],
      },
      { type: "intertitre", texte: "Un risque d’embrasement régional" },
      {
        type: "paragraphe",
        texte:
          "L’Iran entretient des relations complexes avec plusieurs acteurs régionaux. Une confrontation directe pourrait entraîner l’implication indirecte d’autres pays du Moyen-Orient, transformant une crise bilatérale en conflit régional élargi.",
      },
      { type: "paragraphe", texte: "Les analystes redoutent notamment :" },
      {
        type: "liste",
        elements: [
          "une multiplication des frappes indirectes",
          "des cyberattaques",
          "une déstabilisation des équilibres diplomatiques existants",
        ],
      },
      { type: "paragraphe", texte: "L’impact pour l’Europe!" },
      { type: "paragraphe", texte: "Même éloignée géographiquement, l’Europe serait exposée :" },
      {
        type: "liste",
        elements: [
          "hausse des coûts énergétiques",
          "tension sur les marchés financiers",
          "ralentissement économique potentiel",
        ],
      },
      {
        type: "paragraphe",
        texte:
          "Pour les territoires frontaliers comme la région des Trois Frontières, une hausse prolongée du pétrole pourrait se traduire par une augmentation du prix à la pompe et une pression accrue sur le pouvoir d’achat.",
      },
      { type: "intertitre", texte: "Diplomatie ou confrontation ?" },
      {
        type: "paragraphe",
        texte:
          "À ce stade, la diplomatie demeure le canal privilégié. Les précédentes crises ont montré que des tensions fortes ne débouchent pas systématiquement sur un conflit ouvert. Toutefois, la situation reste surveillée de près par les marchés et les chancelleries internationales.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "carburant-risques-d-augmentations-a-la-pompe-causes-par-le-conflit-du-moyen",
    titre: "Carburant: Risques d'augmentations à la pompe causés par le conflit du Moyen-Orient.",
    chapeau:
      "Dans la région des Trois Frontières, le prix du carburant constitue un indicateur particulièrement sensible.",
    categorie: "actualites",
    ordre: 97,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Dans la région des Trois Frontières, le prix du carburant constitue un indicateur particulièrement sensible. De nombreux travailleurs frontaliers adaptent leurs habitudes en fonction des écarts tarifaires entre la France, le Luxembourg et l’Allemagne.",
      },
      {
        type: "paragraphe",
        texte:
          "Or, toute tension majeure au Moyen-Orient, notamment autour de l’Iran, peut influencer le cours du pétrole brut.",
      },
      { type: "intertitre", texte: "Une mécanique économique directe" },
      { type: "paragraphe", texte: "Le prix du carburant dépend en grande partie :" },
      {
        type: "liste",
        elements: ["du prix du baril de pétrole", "des coûts de raffinage", "des taxes nationales"],
      },
      {
        type: "paragraphe",
        texte:
          "Lorsque le baril augmente, la hausse se répercute progressivement sur les prix à la pompe.",
      },
      { type: "paragraphe", texte: "Un territoire particulièrement exposé." },
      {
        type: "paragraphe",
        texte:
          "Dans les Trois Frontières, les déplacements domicile-travail sont souvent quotidiens et transnationaux. Une hausse durable du carburant pourrait impacter :",
      },
      {
        type: "liste",
        elements: [
          "le budget des ménages",
          "les petites entreprises locales",
          "les professionnels du transport",
        ],
      },
      {
        type: "paragraphe",
        texte:
          "Les automobilistes suivent donc avec attention l’évolution géopolitique internationale, consciente que des décisions prises à des milliers de kilomètres peuvent influencer leur quotidien.",
      },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "municipales-2026-quels-enjeux-a-sierck-les-bains-et-dans-les-trois-frontieres",
    titre: "Municipales 2026 : quels enjeux à Sierck-les-Bains et dans les Trois Frontières ?",
    chapeau: "Les élections municipales de mars 2026 approchent.",
    categorie: "actualites",
    ordre: 98,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Les élections municipales de mars 2026 approchent. À Sierck-les-Bains comme dans l’ensemble des communes des Trois Frontières, ce scrutin local déterminera les orientations politiques et les priorités des six prochaines années.",
      },
      { type: "intertitre", texte: "Des enjeux concrets" },
      { type: "paragraphe", texte: "À l’échelle locale, les sujets structurants restent :" },
      {
        type: "liste",
        elements: [
          "dynamisation commerciale",
          "attractivité touristique",
          "mobilité transfrontalière",
          "cadre de vie et sécurité",
          "soutien à la vie associative",
        ],
      },
      {
        type: "paragraphe",
        texte:
          "Dans un territoire marqué par la proximité du Luxembourg et de l’Allemagne, la coopération transfrontalière constitue également un enjeu majeur.",
      },
      { type: "paragraphe", texte: "Une campagne attendue." },
      {
        type: "paragraphe",
        texte:
          "Les prochaines semaines devraient permettre aux différentes listes candidates de préciser leurs programmes et priorités.",
      },
      { type: "paragraphe", texte: "Affaire à suivre !" },
    ],
  },
  // Source : https://www.radio-tripoint-officiel.fr/actualites
  {
    slug: "schengen-mobilite-et-amenagement-au-coeur-des-priorites-communales",
    titre: "Schengen : mobilité et aménagement au cœur des priorités communales.",
    chapeau:
      "À Schengen, les autorités locales poursuivent les réflexions autour de la mobilité et de l’aménagement du territoire.",
    categorie: "actualites",
    ordre: 99,
    corps: [
      {
        type: "paragraphe",
        texte:
          "À Schengen, les autorités locales poursuivent les réflexions autour de la mobilité et de l’aménagement du territoire.",
      },
      {
        type: "paragraphe",
        texte:
          "Avec un flux quotidien important de frontaliers et de visiteurs, la gestion de la circulation et des accès reste un enjeu central pour la commune.",
      },
      { type: "paragraphe", texte: "Parmi les priorités régulièrement évoquées :" },
      {
        type: "liste",
        elements: [
          "Amélioration des accès routiers",
          "Sécurisation des zones piétonnes",
          "Développement touristique maîtrisé autour du site européen",
        ],
      },
      {
        type: "paragraphe",
        texte:
          "Située à un carrefour stratégique entre trois pays, Schengen doit concilier attractivité, qualité de vie et fluidité des déplacements.",
      },
      {
        type: "paragraphe",
        texte: "👉 La question de la mobilité reste un sujet clé dans les Trois Frontières.",
      },
    ],
  },
]
