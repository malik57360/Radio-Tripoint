import type { Emission } from "@/types/show"

/**
 * Émissions publiées sur le site actuel (« Nos émissions »).
 *
 * Présentations et horaires repris tels quels de l'ancienne page « Nos
 * émissions ». Elle ne donne qu'une heure de début, jamais de fin : les
 * créneaux n'ont donc pas de `fin`, et aucune durée n'est inventée. Une
 * émission sans horaire publié garde `creneaux: []`.
 */
export const emissions: Emission[] = [
  {
    slug: "generation-z",
    nom: "Génération Z",
    accroche: "Le rendez-vous des 15-17 ans.",
    presentation:
      "Génération Z est une émission dynamique et engagée dédiée aux jeunes de 15 à 17 ans. Elle donne la parole à une génération connectée, consciente et en pleine construction, en abordant les sujets qui font leur quotidien.",
    thematique: "Jeunesse",
    creneaux: [],
    teinte: "accent",
  },
  {
    slug: "a-vous-la-parole",
    nom: "À vous la parole",
    accroche: "Aller à la rencontre des gens et leur donner la parole.",
    presentation:
      "À vous la parole est une émission de terrain tournée au cœur du pays des trois frontières (France, Luxembourg, Allemagne). Le principe est simple : aller à la rencontre des gens et leur donner la parole, librement, sur les sujets qui les concernent.",
    thematique: "Parole aux auditeurs",
    creneaux: [],
    teinte: "encre",
  },
  {
    slug: "bien-etre-therapies-alternatives",
    nom: "Bien-être & Thérapies Alternatives",
    accroche:
      "Des approches naturelles, complémentaires et préventives pour améliorer la qualité de vie.",
    presentation:
      "Chaque semaine, nous explorons des approches naturelles, complémentaires et préventives pour améliorer la qualité de vie.",
    thematique: "Bien-être",
    creneaux: [{ jour: "dimanche", debut: "14:00" }],
    teinte: "sable",
  },
  {
    slug: "histoire-memoire-regionale",
    nom: "Histoire & Mémoire Régionale",
    accroche: "Les histoires, les lieux et les personnages qui ont marqué notre région.",
    presentation:
      "Chaque semaine, redécouvrez les histoires, les lieux et les personnages qui ont marqué notre région. Un moment simple et authentique pour faire vivre la mémoire locale à l'antenne.",
    thematique: "Histoire",
    categorie: "art-culture",
    creneaux: [{ jour: "mercredi", debut: "20:00" }],
    teinte: "nuit",
  },
  {
    slug: "talents-du-coin",
    nom: "Talents du coin !",
    accroche: "À la rencontre des talents d'ici et d'ailleurs.",
    presentation:
      "Nous partons à la rencontre des talents d'ici et d'ailleurs. Musique, art, artisanat ou performance : chaque épisode est une immersion dans un univers unique.",
    thematique: "Talents locaux",
    creneaux: [{ jour: "dimanche", debut: "16:00" }],
    teinte: "accent",
  },
  {
    slug: "ole-ole",
    nom: "Olé Olé",
    accroche: "L'émission sans filtre de Radio Tripoint.",
    presentation:
      "Cash et Trash est l'émission sans filtre de Radio Tripoint. Chaque dimanche à 22h, place à des discussions crues, des sujets tabous, du divertissement adulte et une ambiance caliente assumée. Ici, on parle vrai, on rigole fort… et rien n'est interdit (sauf aux mineurs).",
    thematique: "À l'antenne",
    creneaux: [{ jour: "dimanche", debut: "22:00" }],
    teinte: "sable",
  },
]
