/**
 * Service worker de l'app « Direction ».
 * Il ne garde AUCUNE donnée du tableau de bord (mails, chiffres, prospects) :
 * les pages passent toujours par le réseau. Sans réseau, il montre une page
 * « Pas de connexion » écrite ici, avec l'icône de l'app (seul fichier gardé).
 * Portée : /direction (en-tête Service-Worker-Allowed), pour couvrir aussi la
 * page d'accueil du tableau de bord.
 */
export const dynamic = "force-static"

const CODE = String.raw`
const CACHE = "direction-v1"
const ICONE = "/direction/icon-192.png"
const HORS_LIGNE = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#09090a"><title>Pas de connexion · Direction</title><style>html,body{margin:0;min-height:100%;background:#09090a;color:#f4f4f1;font-family:system-ui,-apple-system,sans-serif}main{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;box-sizing:border-box}img{width:96px;height:96px;border-radius:22px}h1{margin:10px 0 0;font-size:22px}p{margin:0;color:#a9a8a2;max-width:30ch;line-height:1.45}button{margin-top:12px;background:#f9b800;color:#09090a;border:0;border-radius:999px;padding:12px 22px;font-weight:800;font-size:15px}</style></head><body><main><img src="' + ICONE + '" alt=""><h1>Pas de connexion</h1><p>Le tableau de bord a besoin d’internet. Il revient tout seul dès que le réseau est là.</p><button onclick="location.reload()">Réessayer</button></main><script>addEventListener("online",function(){location.reload()})</script></body></html>'

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.add(ICONE)).then(() => self.skipWaiting()))
})

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(noms.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (e) => {
  const r = e.request
  if (r.method !== "GET") return
  const u = new URL(r.url)
  if (u.origin !== self.location.origin) return
  if (r.mode === "navigate") {
    e.respondWith(
      fetch(r).catch(
        () => new Response(HORS_LIGNE, { headers: { "Content-Type": "text/html; charset=utf-8" } }),
      ),
    )
    return
  }
  if (u.pathname === ICONE) e.respondWith(caches.match(ICONE).then((m) => m || fetch(r)))
})
`

export function GET() {
  return new Response(CODE, {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      "Cache-Control": "no-cache",
      "Service-Worker-Allowed": "/direction",
    },
  })
}
