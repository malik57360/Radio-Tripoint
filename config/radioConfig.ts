/**
 * Configuration du direct.
 *
 * Aucune URL n'est inventée : le flux et le player Radioking se renseignent
 * dans les variables d'environnement (voir `.env.example`). Tant qu'elles
 * sont vides, le player affiche un état « flux non configuré » propre au
 * lieu de planter ou de pointer vers une adresse fausse.
 */
import { socialLinks } from "./socialLinks"

export const radioConfig = {
  radioName: "Radio Tripoint",
  /** Flux audio direct (MP3/AAC). Vide = pas de lecture intégrée. */
  streamUrl:
    process.env.NEXT_PUBLIC_STREAM_URL ||
    "https://listen.radioking.com/radio/radio-tripoint-la-radio-transfrontaliere",
  /** Page publique du player Radioking (bouton « Ouvrir le player »), fournie par la radio. */
  radiokingUrl:
    process.env.NEXT_PUBLIC_RADIOKING_URL ||
    "https://play.radioking.io/radio-tripoint-la-radio-transfrontaliere",
  /**
   * Widget officiel Radioking (lien fourni par la radio), utilisé tant que le
   * flux brut n'est pas renseigné : le bouton « Écouter » ouvre ce lecteur.
   * Couleurs passées au jaune et noir du logo (paramètres c et c2).
   */
  widgetUrl:
    process.env.NEXT_PUBLIC_RADIOKING_WIDGET_URL ||
    "https://player.radioking.io/radio-tripoint-la-radio-transfrontaliere/?c=%23f9b800&c2=%230a0a0a&f=v&i=1&p=1&s=0&alb=1&li=1&popup=1&plc=0&h=365&l=275&v=2",
  /** Route interne qui relaie le « titre en cours » (voir app/api/en-direct). */
  nowPlayingEndpoint: "/api/en-direct",
  /** Rafraîchissement du titre en cours, en millisecondes. */
  nowPlayingRefreshMs: 30_000,
  /** Fuseau de la grille des programmes. */
  timeZone: "Europe/Paris",
  socialLinks,
} as const

export const fluxConfigure = radioConfig.streamUrl.length > 0
