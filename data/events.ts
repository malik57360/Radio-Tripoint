import type { Evenement } from "@/types/event"

const affiche = (slug: string, alt: string, largeur: number, hauteur: number) => ({
  src: `/media/agenda/${slug}.jpg`,
  alt: `Affiche : ${alt}`,
  largeur,
  hauteur,
})

/** Visuel publié par l'organisateur ou l'office de tourisme, servi depuis sa source. */
const distant = (src: string, alt: string, largeur: number, hauteur: number) => ({
  src,
  alt,
  largeur,
  hauteur,
})

/** Affiche réalisée par Radio Tripoint quand l'organisateur n'en publie pas de libre. */
const afficheRadio = (slug: string, alt: string) => ({
  src: `/media/agenda/${slug}.jpg`,
  alt: `Affiche Radio Tripoint : ${alt}`,
  largeur: 800,
  hauteur: 1000,
})

/**
 * Événements de l'agenda, repris des affiches publiées sur l'ancienne page
 * « Agenda ». Tout vient de l'affiche : date, heure, lieu, tarifs, contacts.
 * Les événements passés disparaissent seuls de la liste.
 */
export const evenements: Evenement[] = [
  {
    slug: "lowlife-summer-jam-nennig-2026",
    titre: "Lowlife Summer Jam",
    description:
      "Rassemblement de véhicules tunés, US-cars, oldtimers, tracteurs anciens, motos, scooters et mobylettes transformés. Bière, softs, cocktails, pizza, burgers et snack sur place. Parking.",
    debut: "2026-09-26T14:00:00+02:00",
    lieu: "Sportanlagen",
    adresse: "66706 Nennig",
    ville: "Nennig",
    pays: "DE",
    organisateur: "Tuningfreunde Obermosel e.V.",
    visuel: affiche("lowlife-summer-jam-nennig-2026", "Lowlife Summer Jam, 26.09.26", 799, 387),
  },
  {
    slug: "foire-internationale-metz-2026",
    titre: "91e Foire internationale de Metz",
    description:
      "La Foire internationale de Metz, depuis 1928, revient du vendredi 25 septembre au lundi 5 octobre 2026. Thème de l'édition : « Cap sur le Pacifique ».",
    debut: "2026-09-25T00:00:00+02:00",
    fin: "2026-10-05T23:59:00+02:00",
    journee: true,
    horaires: "Du vendredi 25 septembre au lundi 5 octobre 2026",
    lieu: "Parc des Expositions",
    ville: "Metz",
    pays: "FR",
    organisateur: "Metz Événements",
    lienExterne: "https://www.foiredemetz.com",
    visuel: affiche(
      "foire-internationale-metz-2026",
      "91e Foire internationale de Metz, du 25 septembre au 5 octobre 2026",
      800,
      1000,
    ),
  },
  {
    slug: "brocante-solidaire-sierck-2026",
    titre: "Brocante et marché solidaire",
    description:
      "En soutien aux victimes des incendies en Gironde et dans le Var. Restauration sur place. Réservez rapidement votre emplacement auprès de Fée KDO au 07 70 50 36 64. En partenariat avec Alan Colin Optimhome.",
    debut: "2026-09-27T10:00:00+02:00",
    fin: "2026-09-27T18:00:00+02:00",
    lieu: "Parc Valette",
    ville: "Sierck-les-Bains",
    pays: "FR",
    organisateur: "Association Fée KDO",
    visuel: affiche(
      "brocante-solidaire-sierck-2026",
      "Brocante et marché solidaire, dimanche 27 septembre, Parc Valette à Sierck-les-Bains",
      800,
      1066,
    ),
  },
  {
    slug: "atelier-plantes-sauvages-montenach-2026",
    titre: "Atelier cueillette et popote des plantes sauvages",
    description:
      "Plantes sauvages comestibles : reconnaissance des plantes sauvages, infos sur leurs vertus et leurs bienfaits naturels, réalisation de recettes savoureuses, partage et convivialité autour d'un menu élaboré à partir des cueillettes du jour. Inscription 49 € : 03 82 88 77 49 ou maisondelanature@ccb3f.fr.",
    debut: "2026-09-27T09:00:00+02:00",
    fin: "2026-09-27T15:00:00+02:00",
    lieu: "Maison de la Nature des 3 Frontières",
    ville: "Montenach",
    pays: "FR",
    organisateur: "Maison de la Nature des 3 Frontières",
    lienExterne: "https://www.maisondelanature.eu",
    visuel: affiche(
      "atelier-plantes-sauvages-montenach-2026",
      "Atelier cueillette et popote des plantes sauvages à Montenach, dimanche 27 septembre 2026",
      800,
      1066,
    ),
  },
  {
    slug: "luxautos-coffee-remerschen-2026",
    titre: "Luxauto's Coffee",
    description:
      "Rassemblement automobile Luxauto's Coffee aux Domaines Vinsmoselle, à Remerschen.",
    debut: "2026-09-27T10:00:00+02:00",
    fin: "2026-09-27T12:00:00+02:00",
    lieu: "Domaines Vinsmoselle",
    adresse: "32, Waistrooss",
    ville: "Remerschen",
    pays: "LU",
    visuel: affiche(
      "luxautos-coffee-remerschen-2026",
      "Luxauto's Coffee, 27 septembre, 10:00–12:00, Remerschen",
      800,
      998,
    ),
  },
  {
    slug: "la-bouzonvilloise-2026",
    titre: "La Bouzonvilloise — course et marche contre le cancer",
    description:
      "Solo, en duo ou en famille : bougez-vous contre le cancer ! Course et marche de 3 km ou 10 km, édition colorée, accessible PMR et ouverte à toute la famille. Adulte 10 €, enfant 1 €. Échauffement collectif à 9 h, restauration sur place.",
    debut: "2026-09-27T09:00:00+02:00",
    lieu: "Complexe sportif",
    ville: "Bouzonville",
    pays: "FR",
    organisateur: "CCAS de Bouzonville",
    visuel: affiche(
      "la-bouzonvilloise-2026",
      "La Bouzonvilloise, course et marche, dimanche 27 septembre 2026 dès 9 h",
      800,
      1123,
    ),
  },
  {
    slug: "fete-de-la-flamm-metrich-2026",
    titre: "Fête de la Flamm",
    description:
      "Animation musicale avec Cony & Marcel Delvo. Flamm et pizzas faites maison à 7,50 €. Buvette et restauration sur place. Entrée et parking gratuits.",
    debut: "2026-10-03T18:00:00+02:00",
    lieu: "Metrich",
    ville: "Metrich",
    pays: "FR",
    gratuit: true,
    organisateur: "Koenig's en fête",
    visuel: affiche(
      "fete-de-la-flamm-metrich-2026",
      "Fête de la Flamm à Metrich, samedi 3 octobre à partir de 18 h",
      800,
      1190,
    ),
  },
  {
    slug: "musek-greechen-rustroff-2026",
    titre: "24e Musek & Greechen — double concert",
    description:
      "Double concert avec Canti di Corsica et Manfred Pohlmann & Yannick Monot. Vin de Contz, Greechen, boissons sans alcool, petite restauration de terroir. Entrée 10 €, assiette 8 €. Réservation : 06 07 31 11 89 ou dany.bellot@gmail.com.",
    debut: "2026-10-03T20:30:00+02:00",
    lieu: "Foyer socioculturel",
    ville: "Rustroff",
    pays: "FR",
    organisateur: "ACVS",
    visuel: affiche(
      "musek-greechen-rustroff-2026",
      "24e Musek & Greechen, double concert, samedi 3 octobre 2026 à Rustroff",
      799,
      525,
    ),
  },
  {
    slug: "salon-du-livre-rettel-2026",
    titre: "Salon du Livre de Rettel",
    description:
      "60 auteurs, dont près de 30 % de nouveaux, venus principalement du Grand Est et 3 de Belgique, avec une priorité aux ouvrages publiés en 2025 et 2026 : bandes dessinées, mangas, littérature jeunesse, romans d'amour, polars, thrillers, témoignages, bien-être, géopolitique… Parrain : Régis Hector, dessinateur de presse depuis 1986 et membre de Cartooning for Peace, qui anime un atelier BD pour les 10-14 ans (inscription obligatoire). Atelier de fabrication de marque-pages pour enfants et adultes avec Christelle Baratto Deutscher. À 15 h, Pascal Wuttke présente la légende du chemin du Druide. Quiz littéraire toute la journée, tirage au sort d'un panier de produits locaux en fin d'après-midi, remise des prix du concours de marque-pages des écoles à l'inauguration. Buvette, café et gâteaux toute la journée.",
    debut: "2026-10-04T10:00:00+02:00",
    fin: "2026-10-04T18:00:00+02:00",
    lieu: "Salle polyvalente",
    adresse: "15 rue de la Chartreuse",
    ville: "Rettel",
    pays: "FR",
    gratuit: true,
    organisateur: "Association Lire en fête",
    visuel: affiche(
      "salon-du-livre-rettel-2026",
      "Salon du Livre de Rettel, dimanche 4 octobre de 10 h à 18 h, parrainé par Régis Hector",
      800,
      1128,
    ),
  },
  {
    slug: "exposition-cartes-postales-faiences-sierck-2026",
    titre: "Exposition de cartes postales et de faïences anciennes de Sierck-les-Bains",
    description:
      "Exposition de cartes postales et de faïences anciennes de Sierck-les-Bains. Entrée gratuite.",
    debut: "2026-10-10T14:00:00+02:00",
    fin: "2026-10-11T18:00:00+02:00",
    horaires: "10 octobre de 14 h à 18 h · 11 octobre de 10 h à 18 h",
    lieu: "Salle Espace Valette",
    adresse: "rue Porte de Trèves",
    ville: "Sierck-les-Bains",
    pays: "FR",
    gratuit: true,
    visuel: affiche(
      "exposition-cartes-postales-faiences-sierck-2026",
      "Exposition de cartes postales et de faïences anciennes, 10 et 11 octobre 2026",
      800,
      1200,
    ),
  },
  {
    slug: "marche-rose-sierck-2026",
    titre: "Marche Rose",
    description:
      "Parcours de 4 km, 8 km et 12 km. Petite restauration : casse-croûtes, boissons, desserts, café. Frais d'inscription libres : l'ensemble des dons est reversé à l'Institut de cancérologie de Lorraine, avec possibilité de recevoir un reçu fiscal. Renseignements : slps.manifestations@gmail.com.",
    debut: "2026-10-11T08:30:00+02:00",
    horaires: "Départ entre 8 h 30 et 10 h 30",
    lieu: "Parc Valette",
    ville: "Sierck-les-Bains",
    pays: "FR",
    organisateur: "Sports & Loisirs du Pays Sierckois",
    visuel: affiche(
      "marche-rose-sierck-2026",
      "Marche Rose à Sierck-les-Bains, dimanche 11 octobre 2026",
      800,
      1066,
    ),
  },
  {
    slug: "marche-de-la-pomme-apach-2026",
    titre: "Marché de la pomme",
    description:
      "Restauration sur place, marché producteurs avec de nombreux producteurs et artisans locaux, jus de pomme artisanal. Contact : comite.fetes.apach@gmail.com.",
    debut: "2026-10-11T10:00:00+02:00",
    fin: "2026-10-11T19:00:00+02:00",
    lieu: "Belmach",
    ville: "Apach",
    pays: "FR",
    organisateur: "Comité des fêtes d'Apach",
    visuel: affiche(
      "marche-de-la-pomme-apach-2026",
      "Marché de la pomme à Apach-Belmach, dimanche 11 octobre, 10 h – 19 h",
      800,
      1131,
    ),
  },
  // ─── Ajouts du 2 octobre 2026, vérifiés sur les sites des organisateurs
  // et des communes (sources dans lienExterne). Sans affiche reçue.
  {
    slug: "bauhaus-perlcross-perl-2026",
    titre: "BAUHAUS PERLCROSS",
    description:
      "Le cyclo-cross international revient à Perl. Samedi, course internationale de catégorie UCI C2 ; dimanche, manche de la Cyclo-Cross Bundesliga. Parcours de 3 km (75 m de dénivelé) avec planches, escaliers et section de sable, en terrain ouvert à côté du Schengen-Lyzeum. Des courses pour toutes les catégories, des moins de 11 ans aux élites et aux masters : élites femmes à 14 h les deux jours, élites hommes à 15 h 10 le samedi.",
    debut: "2026-10-03T09:30:00+02:00",
    fin: "2026-10-04T23:59:00+02:00",
    horaires: "Samedi 3 octobre dès 9 h 30, dimanche 4 octobre dès 9 h 20",
    lieu: "Parcours à côté du Schengen-Lyzeum",
    ville: "Perl",
    pays: "DE",
    lienExterne: "https://www.perlcross.de/bienvenue.html",
    visuel: afficheRadio(
      "bauhaus-perlcross-perl-2026",
      "BAUHAUS PERLCROSS, 3 et 4 octobre 2026 à Perl",
    ),
  },
  {
    slug: "hierschtmoart-remich-2026",
    titre: "Hierschtmoart, le marché d'automne",
    description:
      "Le marché d'automne de Remich met en lumière la région et ses produits traditionnels et de saison : stands de vente, animation pour enfants, restauration et boissons, concerts.",
    debut: "2026-10-11T11:00:00+02:00",
    fin: "2026-10-11T18:00:00+02:00",
    lieu: "Place Dr F. Kons",
    ville: "Remich",
    pays: "LU",
    organisateur: "Ville de Remich",
    lienExterne: "https://visitremich.lu/fr/events-new/",
    visuel: afficheRadio("hierschtmoart-remich-2026", "Hierschtmoart, 11 octobre 2026 à Remich"),
  },
  {
    slug: "wein-und-kellerfest-perl-2026",
    titre: "Perler Wein- und Kellerfest",
    description:
      "Le dernier week-end d'octobre, les vignerons de Perl, Oberperl et Sehndorf ouvrent leurs caves et leurs domaines : Elbling, Auxerrois, Riesling et Burgunder des coteaux de la Moselle, spécialités régionales et musique. Les sources ne s'accordent pas sur le dernier jour : vérifiez auprès de la commune de Perl avant de venir.",
    debut: "2026-10-23T00:00:00+02:00",
    fin: "2026-10-25T23:59:00+01:00",
    journee: true,
    horaires: "Dernier week-end d'octobre, à partir du vendredi 23 octobre 2026",
    lieu: "Caves et domaines de Perl, Oberperl et Sehndorf",
    ville: "Perl",
    pays: "DE",
    lienExterne: "https://www.festivalsindeutschland.de/festival/perler-wein-und-kellerfest",
    visuel: afficheRadio(
      "wein-und-kellerfest-perl-2026",
      "Perler Wein- und Kellerfest, fin octobre 2026",
    ),
  },
  {
    slug: "betes-et-sorcieres-chateau-sierck-2026",
    titre: "Bêtes & Sorcières : le Château de Sierck s'enchante",
    description:
      "Un week-end d'Halloween au château, dans le cadre du festival Bêtes & Sorcières du Département de la Moselle : contes, ateliers créatifs, maquillage, saynète, rencontres avec les sorcières et décoration fantastique. Venez déguisés ! Buvette sur place. Entrée 8 €.",
    debut: "2026-10-24T00:00:00+02:00",
    fin: "2026-10-25T23:59:00+01:00",
    journee: true,
    horaires: "Samedi 24 et dimanche 25 octobre 2026",
    lieu: "Château de Sierck",
    adresse: "5 rue du château, 57480 Sierck-les-Bains",
    ville: "Sierck-les-Bains",
    pays: "FR",
    lienExterne:
      "https://www.info-lux.com/sierck-les-bains-patrimoine-festival-betes-sorcieres-le-chateau-de-sierck-senchante/themes/evenements-traditions/fete/",
    visuel: distant(
      "https://www.info-lux.com/wp-content/uploads/2026/09/festival-betes-sorcieres-le-chateau-de-si-sierck-les-bains-halloween-2.png",
      "Visuel du festival Bêtes & Sorcières au Château de Sierck (photo : Sybil Becker)",
      540,
      540,
    ),
  },
  {
    slug: "insomnie-pepito-mateo-sierck-2026",
    titre: "Insomnie, de Pépito Matéo",
    description:
      "Une nuit sans clés devient une échappée dans l'envers du décor. Avec humour, poésie et une énergie explosive, le conteur Pépito Matéo transforme nos peurs en récits et réveille nos rêves. Tout public. Réservation en ligne.",
    debut: "2026-10-24T20:30:00+02:00",
    lieu: "Espace Valette",
    adresse: "8 bis rue Porte de Trèves, 57480 Sierck-les-Bains",
    ville: "Sierck-les-Bains",
    pays: "FR",
    organisateur: "Espace Valette",
    lienExterne: "https://nittachowa.sumupstore.com",
    visuel: distant(
      "https://www.info-lux.com/wp-content/uploads/2026/09/insomnie-pepito-mateo-sierck-les-bains-2026.jpg",
      "Visuel du spectacle Insomnie de Pépito Matéo",
      1200,
      800,
    ),
  },
  {
    slug: "marche-medieval-remich-2026",
    titre: "Marché médiéval de Remich",
    description:
      "Un voyage au Moyen Âge sur les bords de Moselle : artistes de scène, saltimbanques, commerçants et artisans qui font revivre des métiers disparus. Restauration sur place. Accessible en transports en commun, tout près de la gare routière de Remich.",
    debut: "2026-10-24T12:00:00+02:00",
    fin: "2026-10-25T18:00:00+01:00",
    horaires: "Samedi 24 octobre de 12 h à 21 h, dimanche 25 octobre de 11 h à 18 h",
    lieu: "Place Dr F. Kons",
    ville: "Remich",
    pays: "LU",
    organisateur: "Ville de Remich et Lorraine Médiévale",
    lienExterne: "https://visitremich.lu/fr/agenda/2_mettelaltermoart2022-2-2-2-2/",
    visuel: distant(
      "https://visitremich.lu/wp-content/uploads/sites/4/2018/07/knight-1421358_1920.jpg",
      "Chevalier en armure, visuel du marché médiéval de Remich (Visit Remich)",
      1920,
      1275,
    ),
  },
  {
    slug: "loup-garou-halloween-chateau-sierck-2026",
    titre: "Soirées Loup-Garou spécial Halloween au château",
    description:
      "Le Château de Sierck ouvre ses portes à la nuit tombée pour deux soirées de Loup-Garou grandeur nature, avec l'association La Tablée Onirique et de nouveaux personnages pour Halloween. Secrets, alliances et accusations, orchestrés par des maîtres du jeu. À partir de 16 ans, sessions de 3 heures, boissons en vente sur place (pas de restauration). Venez costumés ! 16 €.",
    debut: "2026-10-30T00:00:00+01:00",
    fin: "2026-10-31T23:59:00+01:00",
    journee: true,
    horaires: "Vendredi 30 et samedi 31 octobre 2026, à la nuit tombée",
    lieu: "Château de Sierck",
    adresse: "5 rue du château, 57480 Sierck-les-Bains",
    ville: "Sierck-les-Bains",
    pays: "FR",
    lienExterne:
      "https://www.info-lux.com/sierck-les-bains-patrimoine-soiree-loup-garou-special-halloween/pays/france/grand-est/moselle-grand-est/sierck-les-bains/",
    visuel: distant(
      "https://www.info-lux.com/wp-content/uploads/2026/09/soiree-loup-garou-special-halloween-sierck-les-bains-halloween-2026.png",
      "Visuel des soirées Loup-Garou spécial Halloween au Château de Sierck (CCB3F)",
      540,
      540,
    ),
  },
  {
    slug: "marche-de-noel-thionville-2026",
    titre: "Marché de Noël de Thionville",
    description:
      "Le marché de Noël de Thionville s'installe sur cinq sites du centre-ville pendant six semaines : chalets, mapping tous les soirs sur la façade de l'hôtel de ville, patinoire, manèges et petit train, avec le défilé de Saint-Nicolas et la Grande parade de Noël. Les horaires 2026 ne sont pas encore publiés.",
    debut: "2026-11-27T00:00:00+01:00",
    fin: "2027-01-03T23:59:00+01:00",
    journee: true,
    horaires: "Du vendredi 27 novembre 2026 au dimanche 3 janvier 2027",
    lieu: "Centre-ville (5 sites)",
    ville: "Thionville",
    pays: "FR",
    organisateur: "Ville de Thionville",
    lienExterne:
      "https://moselle-nord.info/thionville-appel-candidatures-marche-noel-2026-843618-2026-70815",
    visuel: distant(
      "https://www.jds.fr/medias/image/marche-de-noel-a-thionville-et-animations-268151-1200-630.webp",
      "Marché de Noël de Thionville (photo : Ville de Thionville)",
      1200,
      630,
    ),
  },
  {
    slug: "wanterfestival-remich-2026",
    titre: "Wanterfestival : marché de Noël de Remich",
    description:
      "Les trois premiers week-ends de l'Avent, Remich vit Noël : marché de Noël, patinoire synthétique (jusqu'au 15 janvier), lecture pour enfants et arrivée de saint Nicolas en bateau le 29 novembre, Big Christmas Wind Orchestra & Choir le 5 décembre, karaoké de Noël le 12 décembre.",
    debut: "2026-11-28T14:00:00+01:00",
    fin: "2026-12-13T20:00:00+01:00",
    horaires:
      "Marché les 28-29 novembre, 5-6 et 12-13 décembre : samedi 14 h-21 h, dimanche 14 h-20 h",
    lieu: "Centre de Remich",
    ville: "Remich",
    pays: "LU",
    organisateur: "Ville de Remich",
    lienExterne: "https://visitremich.lu/fr/agenda/2_wanterfestival-handwierkschreschtmoart-3-3/",
    visuel: distant(
      "https://visitremich.lu/wp-content/uploads/sites/4/2023/12/Remich-Chreschtmoart-2023-byMS-0017-Enhanced-NR.jpg",
      "Marché de Noël de Remich (photo : Visit Remich)",
      1600,
      1067,
    ),
  },
]
