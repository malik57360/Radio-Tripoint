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
  signature: "La radio qui fait vibrer les Trois Frontières.",
  /** Mentions portées par le logo officiel. */
  baseline: "La radio transfrontalière",
  promessePro: "Nous vous donnons une visibilité transfrontalière",
  description:
    "Radio et média transfrontalier entre la France, le Luxembourg et l'Allemagne : actualités locales, émissions, podcasts, sport, culture et agenda des Trois Frontières, depuis Sierck-les-Bains.",
  langue: "fr-FR",
  pays: ["France", "Luxembourg", "Allemagne"] as const,

  contact: {
    telephone: "06 58 22 17 48",
    telephoneE164: "+33658221748",
    email: "info@radio-tripoint-officiel.fr",
    adresse: {
      lieu: "Hôtel de ville",
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
      adresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
      site: "https://vercel.com",
    },
  },
} as const

export const adresseLigne = `${site.contact.adresse.lieu}, ${site.contact.adresse.rue}, ${site.contact.adresse.codePostal} ${site.contact.adresse.ville}`
