import { URL_ANNONCES } from "@/lib/annonces/liens"

/** robots.txt du site des annonces (servi à annonces.…/robots.txt par le proxy). */
export const dynamic = "force-static"

export function GET() {
  return new Response(
    [
      "User-Agent: *",
      "Allow: /",
      "Disallow: /api/",
      "Disallow: /mon-espace",
      "Disallow: /deposer",
      "",
      `Sitemap: ${URL_ANNONCES}/sitemap.xml`,
      "",
    ].join("\n"),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  )
}
