import { jourParis, redis, trancheParis } from "@/lib/direction/redis"

/**
 * Présence en direct, pour le tableau de bord de la direction.
 *
 * Chaque onglet ouvert envoie un signe de vie toutes les 20 s avec un
 * identifiant tiré au hasard à l'ouverture de la page (gardé en mémoire,
 * jamais stocké sur l'appareil : ni cookie, ni stockage local). Le serveur
 * ne garde ni IP ni navigateur détaillé : la page vue, l'état du lecteur,
 * le pays et la ville déduits par Vercel, le type d'appareil. Chaque fiche
 * s'efface d'elle-même 70 s après le dernier signe de vie.
 */
const FENETRE_MS = 70_000
const ID = /^[a-z0-9]{12,32}$/
const ETATS = new Set(["direct", "podcast"])
const ROBOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor/i

const vide = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } })

function appareil(ua: string) {
  if (/iPad|Tablet/i.test(ua)) return "tablette"
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile"
  return "ordinateur"
}

function ville(brut: string | null) {
  if (!brut) return null
  try {
    return decodeURIComponent(brut).slice(0, 60)
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") ?? ""
  if (ROBOT.test(ua)) return vide()

  let corps: Record<string, unknown>
  try {
    corps = JSON.parse(await request.text())
  } catch {
    return vide()
  }
  const id = typeof corps.id === "string" && ID.test(corps.id) ? corps.id : null
  if (!id) return vide()

  const maintenant = Date.now()

  if (corps.quitter === true) {
    await redis([
      ["ZREM", "rt:presence", id],
      ["DEL", `rt:p:${id}`],
    ])
    return vide()
  }

  const page =
    typeof corps.page === "string" && corps.page.startsWith("/") ? corps.page.slice(0, 200) : "/"
  const etat = typeof corps.etat === "string" && ETATS.has(corps.etat) ? corps.etat : null
  const episode =
    etat === "podcast" && typeof corps.episode === "string"
      ? corps.episode.replace(/[^\w-]/g, "").slice(0, 120)
      : null
  const jour = jourParis()
  // Première apparition de cet onglet depuis 30 min : une visite, et son heure d'arrivée.
  const arrivee = await redis([
    ["SET", `rt:s:${id}`, maintenant, "NX", "EX", 1800],
    ["GET", `rt:s:${id}`],
  ])
  if (!arrivee) return vide()
  const nouvelle = arrivee[0] === "OK"

  const fiche = {
    page,
    etat,
    episode,
    pays: request.headers.get("x-vercel-ip-country")?.slice(0, 2) ?? null,
    ville: ville(request.headers.get("x-vercel-ip-city")),
    appareil: appareil(ua),
    langue: /^\/(de|lb|en|es)(\/|$)/.exec(page)?.[1] ?? "fr",
    vu: maintenant,
    // Les anciennes fiches valaient « 1 » : on ne garde qu'un horodatage plausible.
    debut: Number(arrivee[1]) > 1e12 ? Number(arrivee[1]) : maintenant,
  }

  const res = await redis([
    ["ZREMRANGEBYSCORE", "rt:presence", 0, maintenant - FENETRE_MS],
    ["ZADD", "rt:presence", maintenant, id],
    ["SET", `rt:p:${id}`, JSON.stringify(fiche), "EX", 70],
    ["ZCARD", "rt:presence"],
  ])
  if (!res) return vide()

  const suite: (string | number)[][] = []
  const enLigne = Number(res[3]) || 0
  suite.push(["ZADD", "rt:pics", "GT", enLigne, jour])
  // Courbe du jour : le maximum de personnes en ligne par tranche de 5 minutes.
  suite.push(["ZADD", `rt:c:${jour}`, "GT", enLigne, trancheParis(maintenant)])
  suite.push(["EXPIRE", `rt:c:${jour}`, 8 * 24 * 3600])
  if (nouvelle) suite.push(["HINCRBY", `rt:j:${jour}`, "visites", 1])

  // Événements de lecture, envoyés une fois au démarrage.
  if (corps.evenement === "direct") suite.push(["HINCRBY", `rt:j:${jour}`, "direct", 1])
  if (corps.evenement === "podcast" && episode) {
    suite.push(["HINCRBY", `rt:j:${jour}`, "podcast", 1])
    suite.push(["ZINCRBY", "rt:podcasts", 1, episode])
  }
  suite.push(["EXPIRE", `rt:j:${jour}`, 400 * 24 * 3600])
  await redis(suite)
  return vide()
}
