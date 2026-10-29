/**
 * robots.txt du site de Zaza (servi à zaza.…/robots.txt par le proxy).
 * Maquette : rien n'est indexé tant que Giorgio n'a pas validé le site.
 */
export const dynamic = "force-static"

export function GET() {
  return new Response(["User-Agent: *", "Disallow: /", ""].join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
