/**
 * Relais « titre en cours ». Lit RADIO_NOW_PLAYING_URL côté serveur (pas de
 * CORS, pas d'URL exposée), met le résultat en cache 20 s, et renvoie
 * toujours une réponse propre : { titre: null } si rien n'est configuré ou
 * si la source ne répond pas.
 *
 * Formats reconnus : Radioking ({ title, artist, cover }), et les variantes
 * courantes ({ now_playing: { song: { title, artist, art } } } d'AzuraCast,
 * { data: [{ song, artist }] }). Ajouter un adaptateur ici si besoin.
 */
import { connection } from "next/server"
import type { TitreEnCours } from "@/lib/radio/moteur"

type Brut = Record<string, unknown>
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 200) : undefined)

function adapter(d: Brut): TitreEnCours | null {
  const np = (d.now_playing as Brut | undefined)?.song as Brut | undefined
  if (np) {
    const titre = str(np.title)
    return titre ? { titre, artiste: str(np.artist), pochette: str(np.art) } : null
  }
  const liste = Array.isArray(d.data) ? (d.data[0] as Brut) : null
  const source = liste ?? d
  const brut = str(source.title) ?? str(source.song)
  if (!brut) return null
  let titre = brut
  let artiste = str(source.artist)
  // Radioking envoie souvent « Artiste - Titre » dans title, sans artist.
  if (!artiste) {
    const i = brut.indexOf(" - ")
    if (i > 0) {
      artiste = brut.slice(0, i).trim()
      titre = brut.slice(i + 3).trim() || brut
    }
  }
  return { titre, artiste, pochette: str(source.cover) ?? str(source.cover_url) }
}

export async function GET() {
  // Lue à chaque requête (la source est configurée à l'exécution) ; le fetch, lui, est mis en cache 20 s.
  await connection()
  // API publique Radioking de la radio (vérifiée) ; la variable d'environnement reste prioritaire.
  const url =
    process.env.RADIO_NOW_PLAYING_URL ||
    "https://api.radioking.io/widget/radio/radio-tripoint-la-radio-transfrontaliere/track/current"
  if (!url) return Response.json({ titre: null })
  try {
    const r = await fetch(url, { next: { revalidate: 20 }, signal: AbortSignal.timeout(4000) })
    if (!r.ok) return Response.json({ titre: null })
    return Response.json({ titre: adapter((await r.json()) as Brut) })
  } catch {
    return Response.json({ titre: null })
  }
}
