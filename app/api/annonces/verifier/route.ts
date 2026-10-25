import { URL_ANNONCES } from "@/lib/annonces/liens"
import { consommerJeton, enregistrerCompte } from "@/lib/annonces/comptes"
import { journal } from "@/lib/annonces/annonces"

/**
 * Lien de confirmation de l'adresse e-mail (reçu à l'inscription). Le
 * jeton ne sert qu'une fois ; l'ouvrir prouve l'accès à la boîte mail.
 */
export const dynamic = "force-dynamic"

const vers = (etat: string) => `${URL_ANNONCES}/mon-espace?verifie=${etat}`

export async function GET(request: Request) {
  const jeton = new URL(request.url).searchParams.get("j") ?? ""
  try {
    const c = await consommerJeton("verification", jeton)
    if (!c) return Response.redirect(vers("expire"), 303)
    if (!c.emailVerifie) {
      c.emailVerifie = Date.now()
      await enregistrerCompte(c)
      await journal("email-verifie", { compte: c.id })
    }
    return Response.redirect(vers("ok"), 303)
  } catch (e) {
    console.error("[annonces] vérification :", (e as Error).message)
    return Response.redirect(vers("erreur"), 303)
  }
}
