/**
 * Tout ce que le site affiche sur la boutique, au même endroit.
 *
 * Source : l'ancien site zaza-riviera-herbs.com (titre de la page d'accueil,
 * menu, fiches produit, données structurées : adresse, téléphone, horaires),
 * relevé le 27 octobre 2026. Rien n'est inventé : ce qui manque est `null`
 * et s'affiche « à compléter ». Les prix et les stocks sont à confirmer par
 * Giorgio avant toute mise en ligne.
 *
 * Photos : celles de l'ancienne boutique WiziShop (fermée), encore servies
 * par son CDN et retrouvées via Bing Images. Elles sont liées, pas copiées :
 * à remplacer par des fichiers du projet avant la vraie mise en ligne. Les
 * noms des bougies et des protéines sont tirés des noms de fichiers.
 */

export const BOUTIQUE = {
  nom: "Zaza Riviera Herbs",
  accroche: "CBD shop premium, beauté naturelle & bien-être sensoriel",
  rue: "14 Grand Rue",
  codePostal: "57480",
  ville: "Sierck-les-Bains",
  repere: "derrière la mairie",
  telephone: "+33 6 58 22 17 48",
  email: "zazarivieraherb@gmail.com",
  instagram: "https://www.instagram.com/zaza_riviera_herbs",
  youtube: "https://www.youtube.com/@ZazaRivieraHERBS",
  itineraire: "https://www.google.com/maps/search/?api=1&query=14+Grand+Rue+57480+Sierck-les-Bains",
} as const

export const LIENS = [
  { href: "/boutique", nom: "La sélection" },
  { href: "/apercu#univers", nom: "Les univers" },
  { href: "/apercu#boutique", nom: "Nous trouver" },
  { href: "/apercu#questions", nom: "Questions" },
]

/** Lundi = 1 … dimanche = 7 (ISO). Minutes depuis minuit ; `null` = fermé. */
export const HORAIRES: { jour: number; nom: string; ouvre: number | null; ferme: number | null }[] =
  [
    { jour: 1, nom: "Lundi", ouvre: 11 * 60, ferme: 19 * 60 },
    { jour: 2, nom: "Mardi", ouvre: 11 * 60, ferme: 19 * 60 },
    { jour: 3, nom: "Mercredi", ouvre: 11 * 60, ferme: 19 * 60 },
    { jour: 4, nom: "Jeudi", ouvre: 11 * 60, ferme: 19 * 60 },
    { jour: 5, nom: "Vendredi", ouvre: 11 * 60, ferme: 19 * 60 },
    { jour: 6, nom: "Samedi", ouvre: 11 * 60, ferme: 18 * 60 },
    { jour: 7, nom: "Dimanche", ouvre: null, ferme: null },
  ]

export const heure = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`
}

const CDN = "https://media.cdnws.com/_i/330385/"
/** Version 1440 px de la photo, servie par le CDN de l'ancienne boutique. */
const photo = (chemin: string) => `${CDN}m1440-${chemin}`

/** Photo de la page d'accueil de l'ancien site (pas de version réduite). */
export const PHOTO_ACCUEIL = `${CDN}RAW-191/586/92/img-9228.jpeg`

export type Univers = {
  slug: string
  nom: string
  /** Teinte de l'étiquette : un jeton de globals.css. */
  teinte: string
  /** Dessin au trait, quand il n'y a pas de photo (components/Dessins.tsx). */
  dessin: "feuille" | "flacon" | "cone" | "vape" | "gomme" | "pot" | "parfum"
  photo?: string
}

export const UNIVERS: Univers[] = [
  { slug: "fleurs-resines", nom: "Fleurs & résines", teinte: "var(--t-fleurs)", dessin: "feuille" },
  { slug: "huiles", nom: "Huiles de CBD", teinte: "var(--t-huiles)", dessin: "flacon" },
  {
    slug: "pre-roules",
    nom: "Pré-roulés",
    teinte: "var(--t-preroules)",
    dessin: "cone",
    photo: photo("133/1240/34/kush.jpeg"),
  },
  { slug: "vapes", nom: "Vapes", teinte: "var(--t-vapes)", dessin: "vape" },
  { slug: "gummies", nom: "Gummies & comestibles", teinte: "var(--t-gummies)", dessin: "gomme" },
  {
    slug: "soins",
    nom: "Soins & cosmétiques",
    teinte: "var(--t-soins)",
    dessin: "pot",
    photo: photo("152/3219/53/shampoing-gel-douche.jpeg"),
  },
  { slug: "parfum", nom: "Parfum", teinte: "var(--t-parfum)", dessin: "parfum" },
  {
    slug: "maison",
    nom: "Bougies & ambiance",
    teinte: "var(--t-maison)",
    dessin: "pot",
    photo: photo("233/2711/35/bougie-st-tropez.jpeg"),
  },
  {
    slug: "packs",
    nom: "Packs & box",
    teinte: "var(--t-packs)",
    dessin: "pot",
    photo: photo("122/724/23/pack-1.jpeg"),
  },
  {
    slug: "boissons",
    nom: "Boissons",
    teinte: "var(--t-boissons)",
    dessin: "flacon",
    photo: photo("159/670/60/boisson-energisante.jpeg"),
  },
  {
    slug: "sport",
    nom: "Sport & récupération",
    teinte: "var(--t-sport)",
    dessin: "pot",
    photo: photo("147/2360/48/proteine-vanille.jpeg"),
  },
  {
    slug: "animaux",
    nom: "Animaux",
    teinte: "var(--t-animaux)",
    dessin: "flacon",
    photo: photo("104/3096/5/cbd-animaux-5.jpeg"),
  },
]

export const univers = (slug: string) => UNIVERS.find((u) => u.slug === slug)

export type Produit = {
  slug: string
  nom: string
  univers: string
  /** En centimes. `null` = prix à confirmer. */
  prix: number | null
  detail: string | null
  disponible: boolean
  photo: string | null
}

type Fiche = Omit<Produit, "detail" | "disponible" | "prix" | "photo"> &
  Partial<Pick<Produit, "detail" | "disponible" | "prix" | "photo">>

const FICHES: Fiche[] = [
  {
    slug: "zaza-pre-roule",
    nom: "ZAZA pré-roulé",
    univers: "pre-roules",
    prix: 700,
    detail: "À l'unité ou en pack de 3",
  },
  {
    slug: "gummies-fruits-rouges",
    nom: "Gummies CBD fruits rouges",
    univers: "gummies",
    prix: 3000,
    detail: "Bonbons au CBD Cangum",
  },
  { slug: "parfum", nom: "Parfum", univers: "parfum", prix: 8000 },
  {
    slug: "huile-cbd-20",
    nom: "Huile de CBD 20\u00a0%",
    univers: "huiles",
    prix: 4990,
    disponible: false,
  },
  {
    slug: "kush",
    nom: "Kush",
    univers: "pre-roules",
    detail: "Pré-roulé",
    photo: photo("133/1240/34/kush.jpeg"),
  },
  {
    slug: "amnesia",
    nom: "Amnesia",
    univers: "pre-roules",
    detail: "Pré-roulé",
    photo: photo("129/1333/30/amnesia.jpeg"),
  },
  {
    slug: "shampoing-gel-douche",
    nom: "Shampoing & gel douche",
    univers: "soins",
    photo: photo("152/3219/53/shampoing-gel-douche.jpeg"),
  },
  {
    slug: "gel-de-massage",
    nom: "Gel de massage CBD",
    univers: "soins",
    photo: photo("163/2066/64/gel-massage-froid.jpeg"),
  },
  {
    slug: "bougie-st-tropez",
    nom: "Bougie St-Tropez",
    univers: "maison",
    detail: "Bougie au chanvre",
    photo: photo("233/2711/35/bougie-st-tropez.jpeg"),
  },
  {
    slug: "bougie-croisette",
    nom: "Bougie Croisette",
    univers: "maison",
    detail: "Bougie au chanvre",
    photo: photo("169/1777/70/bougie-croisette-pour-site.jpeg"),
  },
  {
    slug: "bougie-place-du-casino",
    nom: "Bougie Place du Casino",
    univers: "maison",
    detail: "Bougie au chanvre",
    photo: photo("237/3585/39/bougie-place-du-casino.jpeg"),
  },
  {
    slug: "bougie-mareterra",
    nom: "Bougie Mareterra",
    univers: "maison",
    detail: "Bougie au chanvre",
    photo: photo("236/833/38/bougie-mareterra.jpeg"),
  },
  {
    slug: "bougie-nougat",
    nom: "Bougie Nougat",
    univers: "maison",
    detail: "Bougie au chanvre",
    photo: photo("110/1479/11/bougie-nougat-petitejpg.jpeg"),
  },
  {
    slug: "bougie-orange-epicee",
    nom: "Bougie Orange épicée",
    univers: "maison",
    detail: "Bougie au chanvre",
    photo: photo("109/376/10/bougie-orange-epiceejpg.jpeg"),
  },
  {
    slug: "bougie-cuir-bois",
    nom: "Bougie Cuir-Bois",
    univers: "maison",
    detail: "Bougie au chanvre",
    photo: photo("108/1634/9/bougie-cuir-bois.jpeg"),
  },
  {
    slug: "box-chill-and-party",
    nom: "Box Chill and Party",
    univers: "packs",
    photo: photo("122/724/23/pack-1.jpeg"),
  },
  {
    slug: "pack-tisane-infusion",
    nom: "Pack Tisane & Infusion",
    univers: "packs",
    photo: photo("121/2315/22/pack-5.jpeg"),
  },
  {
    slug: "boisson-energisante",
    nom: "Boisson énergisante",
    univers: "boissons",
    photo: photo("159/670/60/boisson-energisante.jpeg"),
  },
  {
    slug: "proteine-vanille",
    nom: "Protéine vanille",
    univers: "sport",
    detail: "Récupération",
    photo: photo("147/2360/48/proteine-vanille.jpeg"),
  },
  {
    slug: "proteine-fraise",
    nom: "Protéine fraise",
    univers: "sport",
    detail: "Récupération",
    photo: photo("148/1805/49/proteine-fraise.jpeg"),
  },
  {
    slug: "proteine-chocolat",
    nom: "Protéine chocolat",
    univers: "sport",
    detail: "Récupération",
    photo: photo("146/991/47/proteine-chocolat.jpeg"),
  },
  {
    slug: "huile-cbd-animaux",
    nom: "Huile de CBD pour animaux",
    univers: "animaux",
    photo: photo("104/3096/5/cbd-animaux-5.jpeg"),
  },
]

export const PRODUITS: Produit[] = FICHES.map((f) => ({
  prix: null,
  detail: null,
  disponible: true,
  photo: null,
  ...f,
}))

/** Numéro d'étiquette : la place du produit dans le catalogue. */
export const numero = (slug: string) =>
  String(PRODUITS.findIndex((p) => p.slug === slug) + 1).padStart(2, "0")

/** Les produits du comptoir de l'accueil. */
export const SELECTION = [
  "zaza-pre-roule",
  "bougie-st-tropez",
  "box-chill-and-party",
  "gummies-fruits-rouges",
  "shampoing-gel-douche",
  "proteine-vanille",
  "parfum",
  "huile-cbd-animaux",
]

export const produit = (slug: string) => PRODUITS.find((p) => p.slug === slug)

export const prix = (centimes: number) =>
  (centimes / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: centimes % 100 ? 2 : 0,
  })
