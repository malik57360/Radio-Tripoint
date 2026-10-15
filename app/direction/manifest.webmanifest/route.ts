import type { MetadataRoute } from "next"

/**
 * Manifeste de l'app « Direction » : le tableau de bord s'installe sur
 * l'écran d'accueil comme une application à part, distincte de celle du site
 * (autre id, autre portée, autres icônes). Public : le navigateur le lit sans
 * cookie, il ne contient rien de privé.
 */
export const dynamic = "force-static"

export function GET() {
  const manifeste: MetadataRoute.Manifest = {
    id: "/direction",
    name: "Direction — Radio Tripoint",
    short_name: "Direction",
    description:
      "Le tableau de bord de Radio Tripoint : direct, mails, prospection, articles, agenda.",
    lang: "fr",
    start_url: "/direction?source=app",
    scope: "/direction",
    display: "standalone",
    background_color: "#09090a",
    theme_color: "#09090a",
    icons: [
      { src: "/direction/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/direction/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/direction/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Mails", url: "/direction/mails" },
      { name: "Prospection", url: "/direction/prospection" },
      { name: "Articles", url: "/direction/articles" },
      { name: "En direct", url: "/direction/direct" },
    ],
  }
  return new Response(JSON.stringify(manifeste), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  })
}
