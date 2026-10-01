import type { Trad } from "@/lib/i18n/langues"

/**
 * Identité et coordonnées. Seules les informations publiées par Radio
 * Tripoint figurent ici ; un champ `null` est une information que
 * l'éditeur doit fournir — il s'affiche « à compléter », jamais inventé.
 */
export const site = {
  nom: "Radio Tripoint",
  nomOfficiel: "Radio Tripoint Officiel",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.radio-tripoint-officiel.fr").replace(
    /\/$/,
    "",
  ),
  signature: {
    fr: "Le Média des trois frontières",
    de: "Das Medium des Dreiländerecks",
    lb: "D'Medium vum Dräilännereck",
    en: "The media of the Three Borders",
    es: "El medio de las Tres Fronteras",
  } as Trad,
  /** Mentions portées par le logo officiel. */
  baseline: {
    fr: "La radio transfrontalière",
    de: "Das grenzüberschreitende Radio",
    lb: "De grenziwwerschreidende Radio",
    en: "The cross-border radio",
    es: "La radio transfronteriza",
  } as Trad,
  promessePro: {
    fr: "Nous vous donnons une visibilité transfrontalière",
    de: "Wir verschaffen Ihnen grenzüberschreitende Sichtbarkeit",
    lb: "Mir ginn Iech eng grenziwwerschreidend Visibilitéit",
    en: "We give you cross-border visibility",
    es: "Le damos visibilidad transfronteriza",
  } as Trad,
  description: {
    fr: "Radio et média transfrontalier entre la France, le Luxembourg et l'Allemagne : actualités locales, émissions, podcasts, sport, culture et agenda des Trois Frontières, depuis Sierck-les-Bains.",
    de: "Grenzüberschreitendes Radio und Medium zwischen Frankreich, Luxemburg und Deutschland: lokale Nachrichten, Sendungen, Podcasts, Sport, Kultur und Veranstaltungen im Dreiländereck, aus Sierck-les-Bains.",
    lb: "Grenziwwerschreidende Radio a Medium tëscht Frankräich, Lëtzebuerg an Däitschland: lokal Neiegkeeten, Sendungen, Podcasts, Sport, Kultur an Agenda vum Dräilännereck, vu Sierck-les-Bains aus.",
    en: "Cross-border radio and media outlet between France, Luxembourg and Germany: local news, programmes, podcasts, sport, culture and events in the Three Borders, from Sierck-les-Bains.",
    es: "Radio y medio transfronterizo entre Francia, Luxemburgo y Alemania: noticias locales, programas, pódcasts, deporte, cultura y agenda de las Tres Fronteras, desde Sierck-les-Bains.",
  } as Trad,
  pays: {
    fr: ["France", "Luxembourg", "Allemagne"],
    de: ["Frankreich", "Luxemburg", "Deutschland"],
    lb: ["Frankräich", "Lëtzebuerg", "Däitschland"],
    en: ["France", "Luxembourg", "Germany"],
    es: ["Francia", "Luxemburgo", "Alemania"],
  } as Trad<string[]>,

  contact: {
    telephone: "06 58 22 17 48",
    telephoneE164: "+33658221748",
    email: "info@radio-tripoint-officiel.fr",
    adresse: {
      lieu: {
        fr: "Hôtel de ville",
        de: "Rathaus",
        lb: "Gemengenhaus",
        en: "Town hall",
        es: "Ayuntamiento",
      } as Trad,
      rue: "12 Quai des Ducs de Lorraine",
      codePostal: "57480",
      ville: "Sierck-les-Bains",
      pays: "FR",
    },
    itineraire:
      "https://www.google.com/maps/search/?api=1&query=H%C3%B4tel+de+ville%2C+12+Quai+des+Ducs+de+Lorraine%2C+57480+Sierck-les-Bains",
  },

  /**
   * Visuels réels. Déposer les fichiers dans `public/brand/` puis renseigner
   * le chemin. Tant que `logo` est null, l'en-tête affiche le nom en
   * toutes lettres (ce n'est pas une refonte du logo, c'est son absence).
   */
  visuels: {
    /** Logo officiel (rond, fond transparent), extrait du fichier fourni. */
    logo: "/brand/logo-radio-tripoint.png" as string | null,
    logoSombre: null as string | null, // variante pour fond sombre, si elle existe
    hero: null as string | null, // ex. "/media/hero-moselle.jpg"
  },

  /** Mentions légales : à compléter par l'éditeur. */
  legal: {
    // Registre national des entreprises (recherche-entreprises.api.gouv.fr),
    // SIRET fourni et confirmé par Radio Tripoint.
    raisonSociale: "Riviera Lifestyle Group" as string | null,
    formeJuridique: "SAS (société par actions simplifiée)" as string | null,
    siegeSocial: "50 avenue des Champs-Élysées, 75008 Paris" as string | null,
    siret: "102 029 873 00019" as string | null,
    // Pour une société, la loi (art. 93-2, loi du 29 juillet 1982) désigne
    // son représentant légal : ici le président de la SAS au registre.
    directeurPublication: "Georges Emmanuel Mathas, président" as string | null,
    hebergeur: {
      nom: "Vercel Inc.",
      adresse: "440 N Barranca Ave #4133, Covina, CA 91723, USA",
      site: "https://vercel.com",
    },
  },
} as const

/** Adresse pour les cartes et itinéraires : toujours en français, comme sur place. */
export const adresseLigne = `${site.contact.adresse.lieu.fr}, ${site.contact.adresse.rue}, ${site.contact.adresse.codePostal} ${site.contact.adresse.ville}`
