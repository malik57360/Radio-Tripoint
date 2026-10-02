import "server-only"

/**
 * Accès minimal à Redis (Upstash, API REST) : pas de dépendance, un fetch
 * par lot de commandes. Les variables sont posées par l'intégration Upstash
 * de Vercel (KV_* ou UPSTASH_REDIS_REST_*). Sans elles, tout renvoie null
 * et le tableau de bord affiche « à activer » au lieu d'un faux chiffre.
 */
type Commande = (string | number)[]

function acces() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const jeton = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && jeton ? { url: url.replace(/\/$/, ""), jeton } : null
}

export const redisActif = () => acces() !== null

/** Exécute un lot de commandes ; null si Redis n'est pas branché ou ne répond pas. */
export async function redis(commandes: Commande[]): Promise<unknown[] | null> {
  const a = acces()
  if (!a || commandes.length === 0) return null
  try {
    const r = await fetch(`${a.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${a.jeton}`, "Content-Type": "application/json" },
      body: JSON.stringify(commandes),
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    })
    if (!r.ok) return null
    const lignes = (await r.json()) as { result?: unknown; error?: string }[]
    return lignes.map((l) => (l.error ? null : (l.result ?? null)))
  } catch {
    return null
  }
}

/** Date du jour à Paris, AAAA-MM-JJ : la journée d'une radio lorraine. */
export function jourParis(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d)
}

/** Tranche de 5 minutes à l'heure de Paris, « HH:MM ». */
export function trancheParis(ms = Date.now()) {
  const [h, m] = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(new Date(ms))
    .split(":")
  return `${h}:${String(Math.floor(Number(m) / 5) * 5).padStart(2, "0")}`
}

const DUREE_COMPTEURS = 400 * 24 * 3600

/** Incrémente un compteur du jour (rt:j:AAAA-MM-JJ → champ). Silencieux si Redis est absent. */
export async function compter(champ: string, de = 1) {
  const cle = `rt:j:${jourParis()}`
  await redis([
    ["HINCRBY", cle, champ, de],
    ["EXPIRE", cle, DUREE_COMPTEURS],
  ])
}
