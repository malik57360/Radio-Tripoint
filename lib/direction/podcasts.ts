/**
 * Règles communes aux podcasts du tableau de bord : le formulaire (navigateur),
 * la route qui autorise l'envoi du son et les actions serveur s'y tiennent.
 */

/** Formats acceptés : MP3 et M4A/AAC, lus par tous les navigateurs. */
export const EXTENSIONS_AUDIO = {
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  aac: "audio/aac",
} as const
export type ExtensionAudio = keyof typeof EXTENSIONS_AUDIO
export const TYPES_AUDIO = Object.values(EXTENSIONS_AUDIO)

/** Une émission de deux heures en MP3 320 kbit/s tient dedans. */
export const MAX_OCTETS_AUDIO = 300 * 1024 * 1024

/** podcasts/tableau/<dossier de 12 caractères>/<nom>.<mp3|m4a|aac> */
export const CHEMIN_AUDIO = /^podcasts\/tableau\/[a-z0-9]{12}\/[a-z0-9-]{1,60}\.(?:mp3|m4a|aac)$/

/** Adresse publique d'un son envoyé (le Blob ajoute un suffixe aléatoire au nom). */
export const URL_AUDIO =
  /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/podcasts\/tableau\/[a-z0-9]{12}\/[\w.-]+\.(?:mp3|m4a|aac)$/

export function extensionAudio(nom: string): ExtensionAudio | null {
  const e = nom.toLowerCase().split(".").pop() ?? ""
  return e in EXTENSIONS_AUDIO ? (e as ExtensionAudio) : null
}

const FUSEAU = "Europe/Paris"

/** Date et heure à Paris, au format d'un champ datetime-local (2026-10-21T20:00). */
export function localParis(d = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: FUSEAU,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  )
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`
}

/**
 * « 2026-10-21T20:00 » (heure de Paris) → « 2026-10-21T20:00:00+02:00 »,
 * le format des dates du site. null si la date n'existe pas.
 */
export function isoParis(local: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return null
  // Paris est à +1 h l'hiver, +2 h l'été : on garde le décalage qui retombe sur la même heure.
  for (const decalage of ["+02:00", "+01:00"]) {
    const d = new Date(`${local}:00${decalage}`)
    if (!Number.isNaN(d.getTime()) && localParis(d) === local) return `${local}:00${decalage}`
  }
  return null
}
