import type { Article } from "@/types/article"

/**
 * Articles de la rubrique « prevention » repris de l'ancien site Webador
 * (texte intégral, sans les photos). L'ancien site n'affichait pas de date :
 * `ordre` reprend le rang d'apparition (1 = le plus récent).
 */
export const prevention: Article[] = [
  // Source : https://www.radio-tripoint-officiel.fr/preventions-sensibilisation
  {
    slug: "prevention-et-sensibilisation-un-ete-sans-danger-et-sans-addictions",
    titre: "Prévention et sensibilisation : Un été sans danger et sans addictions",
    chapeau:
      "Radio Tripoint s'engage activement dans des campagnes de prévention et de sensibilisation.",
    categorie: "prevention",
    ordre: 48,
    corps: [
      {
        type: "paragraphe",
        texte:
          "Radio Tripoint s'engage activement dans des campagnes de prévention et de sensibilisation. Découvrez nos actions, les retours d'expérience et des outils concrets pour lutter contre les addictions et améliorer le bien-être de chacun.",
      },
      {
        type: "paragraphe",
        texte:
          "Chaque été est synonyme de liberté, de rencontres et de découvertes. Mais cette période est aussi marquée par une augmentation de certaines conduites à risque : consommation d’alcool, protoxyde d’azote, cannabis, exposition excessive aux écrans, réseaux sociaux, jeux vidéo ou encore comportements dangereux entre amis.",
      },
      {
        type: "paragraphe",
        texte:
          "Face à ces constats, Radio Tripoint, avec le soutien de la Communauté de Communes Bouzonvillois Trois Frontières (CCB3F), de la Ville de Sierck-les-Bains et de la Commune d’Apach, lance une campagne transfrontalière de prévention destinée aux jeunes, aux familles et à tous les acteurs éducatifs.",
      },
      {
        type: "paragraphe",
        texte:
          "Notre objectif n’est pas de culpabiliser mais d’informer, d’expliquer et de donner des outils pour faire les bons choix.",
      },
      { type: "intertitre", texte: "Pourquoi cette campagne ?" },
      {
        type: "paragraphe",
        texte: "Les conduites à risque touchent aujourd’hui des jeunes de plus en plus tôt.",
      },
      {
        type: "paragraphe",
        texte:
          "Certaines pratiques, parfois présentées comme anodines sur les réseaux sociaux, peuvent avoir des conséquences importantes sur la santé physique, mentale ou sociale.",
      },
      { type: "paragraphe", texte: "La prévention reste le meilleur moyen de protéger." },
      { type: "intertitre", texte: "Les grandes thématiques" },
      {
        type: "liste",
        elements: [
          "Protoxyde d’azote",
          "Cannabis",
          "Alcool",
          "Tabac",
          "Réseaux sociaux",
          "Jeux vidéo",
          "Santé mentale",
          "Pression du groupe",
          "Sécurité routière",
          "Fêtes et festivals",
          "Retour de soirée en sécurité",
        ],
      },
      { type: "intertitre", texte: "Comprendre avant de juger" },
      { type: "paragraphe", texte: "Chaque thème est expliqué avec :" },
      {
        type: "liste",
        elements: [
          "des informations fiables ;",
          "des chiffres clés ;",
          "les risques réels ;",
          "des conseils pratiques ;",
          "les idées reçues ;",
          "les ressources utiles.",
        ],
      },
      {
        type: "paragraphe",
        texte:
          "Notre volonté est de permettre aux jeunes, aux parents et aux éducateurs de mieux comprendre ces phénomènes afin de dialoguer sereinement.",
      },
    ],
  },
]
