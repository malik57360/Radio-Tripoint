import type { Evenement } from "@/types/event"

const affiche = (slug: string, alt: string, largeur: number, hauteur: number) => ({
  src: `/media/agenda/${slug}.jpg`,
  alt: `Affiche : ${alt}`,
  largeur,
  hauteur,
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
]
