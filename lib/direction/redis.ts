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

/** URL et jeton REST, pour les lectures mises en cache par Next (GET + tags). */
export const accesRedis = acces

/**
 * Raison du dernier refus de Redis (statut HTTP et texte d'Upstash, jamais
 * le jeton), pour que le tableau de bord dise pourquoi au lieu de « réessayez ».
 */
let dernierRefus: string | null = null

function refus(raison: string) {
  dernierRefus = raison.slice(0, 200)
  console.error("[redis]", dernierRefus)
}

/** Message d'échec d'écriture pour le tableau de bord, avec la cause quand elle est connue. */
export function erreurRedis() {
  const r = dernierRefus ?? ""
  if (/limit/i.test(r))
    return "Base de données saturée : le quota mensuel de requêtes Upstash est atteint."
  if (/variables/.test(r)) return "Base de données non branchée : variables Redis absentes."
  return r
    ? `Base de données injoignable (${r}) : réessayez.`
    : "Base de données injoignable : réessayez."
}

/** Exécute un lot de commandes ; null si Redis n'est pas branché ou ne répond pas. */
export async function redis(commandes: Commande[]): Promise<unknown[] | null> {
  const a = acces()
  if (commandes.length === 0) return null
  if (!a) {
    refus("variables Redis absentes")
    return null
  }
  try {
    const r = await fetch(`${a.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${a.jeton}`, "Content-Type": "application/json" },
      body: JSON.stringify(commandes),
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    })
    if (!r.ok) {
      refus(`HTTP ${r.status} ${(await r.text().catch(() => "")).trim()}`)
      return null
    }
    const lignes = (await r.json()) as { result?: unknown; error?: string }[]
    const erreur = lignes.find((l) => l.error)?.error
    if (erreur) refus(erreur)
    return lignes.map((l) => (l.error ? null : (l.result ?? null)))
  } catch (e) {
    refus((e as Error).name === "TimeoutError" ? "délai de 3 s dépassé" : (e as Error).message)
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
