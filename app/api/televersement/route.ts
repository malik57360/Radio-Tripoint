import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"

/**
 * Route temporaire : rapatriement des podcasts depuis l'ancien hébergement.
 * Délivre des jetons d'envoi vers le Blob, uniquement sur présentation du
 * secret TELEVERSEMENT_SECRET. À retirer une fois les fichiers envoyés.
 */
export async function POST(request: Request) {
  const secret = process.env.TELEVERSEMENT_SECRET
  if (!secret) return new Response("Indisponible", { status: 404 })
  const body = (await request.json()) as HandleUploadBody
  try {
    const reponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (clientPayload !== secret || !/^podcasts\/[a-f0-9]{32}\.mp3$/.test(pathname)) {
          throw new Error("Refusé")
        }
        return {
          allowedContentTypes: ["audio/mpeg"],
          maximumSizeInBytes: 60 * 1024 * 1024,
          addRandomSuffix: false,
          allowOverwrite: true,
        }
      },
      onUploadCompleted: async () => {},
    })
    return Response.json(reponse)
  } catch {
    return Response.json({ erreur: "Refusé" }, { status: 403 })
  }
}
