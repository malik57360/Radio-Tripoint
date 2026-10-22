import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { estConnecte } from "@/lib/direction/acces"
import { CHEMIN_AUDIO, MAX_OCTETS_AUDIO, TYPES_AUDIO } from "@/lib/direction/podcasts"

/**
 * Fichier audio d'un podcast du tableau de bord. Trop lourd pour passer par
 * le serveur (Vercel plafonne une requête à 4,5 Mo) : le navigateur l'envoie
 * directement au Blob Vercel. Cette route ne fait que délivrer l'autorisation
 * d'envoi, à une session du tableau de bord, pour un fichier audio rangé sous
 * podcasts/tableau/<dossier>/.
 */
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return Response.json({ error: "Stockage non branché." }, { status: 503 })
  let body: HandleUploadBody
  try {
    body = (await request.json()) as HandleUploadBody
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 })
  }
  try {
    const r = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (chemin) => {
        if (!(await estConnecte())) throw new Error("Session expirée.")
        if (!CHEMIN_AUDIO.test(chemin)) throw new Error("Chemin invalide.")
        return {
          allowedContentTypes: [...TYPES_AUDIO],
          maximumSizeInBytes: MAX_OCTETS_AUDIO,
          addRandomSuffix: true,
          cacheControlMaxAge: 31_536_000,
        }
      },
    })
    return Response.json(r)
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 })
  }
}
