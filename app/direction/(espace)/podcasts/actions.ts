"use server"

import { del } from "@vercel/blob"
import { revalidatePath, revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { episodes as episodesDepot } from "@/data/podcasts"
import { listerEmissions } from "@/lib/contenu/emissions"
import { CLE_PODCASTS, TAG_PODCASTS, type EpisodeDashboard } from "@/lib/contenu/podcasts-dashboard"
import { estConnecte } from "@/lib/direction/acces"
import { isoParis, URL_AUDIO } from "@/lib/direction/podcasts"
import { redis } from "@/lib/direction/redis"
import { traduireEpisode } from "@/lib/direction/traduction-podcasts"
import { versSlug } from "@/lib/utils/texte"
import type { ThemePodcast } from "@/types/podcast"

type Resultat = { ok: true; message: string; lien?: string } | { ok: false; erreur: string }

const THEMES = [
  "actualites",
  "culture",
  "musique",
  "sport",
  "emissions",
] as const satisfies readonly ThemePodcast[]

const schema = z.object({
  titre: z.string().trim().min(4, "Titre trop court.").max(160, "Titre trop long."),
  description: z
    .string()
    .trim()
    .min(20, "Description trop courte (une à deux phrases).")
    .max(2000, "Description trop longue (2 000 caractères max)."),
  emission: z.string().trim().max(80).optional(),
  theme: z.enum(THEMES),
  diffuseLe: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Date de diffusion invalide."),
  /** Absent à la modification : le son déjà en ligne est gardé. */
  audio: z
    .object({
      url: z.string().regex(URL_AUDIO, "Fichier audio non reconnu."),
      duree: z
        .number()
        .int()
        .min(5, "Son trop court.")
        .max(6 * 3600, "Son trop long (6 h max)."),
    })
    .optional(),
})
export type DonneesPodcast = z.infer<typeof schema>

const slugValide = (slug: unknown): slug is string =>
  typeof slug === "string" && /^[a-z0-9-]{4,100}$/.test(slug)

/** Contrôles communs : session, formulaire, émission, date. */
async function verifier(
  donnees: DonneesPodcast,
): Promise<{ d: DonneesPodcast; publieLe: string } | { erreur: string }> {
  if (!(await estConnecte())) return { erreur: "Session expirée : reconnectez-vous." }
  const v = schema.safeParse(donnees)
  if (!v.success) return { erreur: v.error.issues[0]?.message ?? "Formulaire invalide." }
  const d = v.data
  if (d.emission && !(await listerEmissions()).some((e) => e.slug === d.emission))
    return { erreur: "Émission inconnue." }
  const publieLe = isoParis(d.diffuseLe)
  if (!publieLe) return { erreur: "Date de diffusion invalide." }
  if (Date.parse(publieLe) > Date.now() + 10 * 60_000)
    return { erreur: "La date de diffusion ne peut pas être dans le futur." }
  return { d, publieLe }
}

async function lire(slug: string): Promise<EpisodeDashboard | null | "injoignable"> {
  const r = await redis([["HGET", CLE_PODCASTS, slug]])
  if (!r) return "injoignable"
  if (typeof r[0] !== "string") return null
  try {
    return JSON.parse(r[0]) as EpisodeDashboard
  } catch {
    return null
  }
}

/** Supprime un son du stockage une fois la réponse partie. */
function supprimerPlusTard(url: string | undefined) {
  if (!url || !URL_AUDIO.test(url)) return
  after(async () => {
    try {
      await del(url, { abortSignal: AbortSignal.timeout(15_000) })
    } catch (e) {
      console.error("[podcasts] suppression son", (e as Error).message)
    }
  })
}

/** Traductions (DE, LB, EN, ES) une fois la réponse partie : le français est en ligne tout de suite. */
function traduirePlusTard(slug: string) {
  after(async () => {
    try {
      if ((await traduireEpisode(slug)) === "fait") revalidateTag(TAG_PODCASTS, { expire: 0 })
    } catch (e) {
      console.error("[podcasts] traduction", (e as Error).message)
    }
  })
}

function rafraichir() {
  revalidateTag(TAG_PODCASTS, { expire: 0 })
  revalidatePath("/direction/podcasts")
}

export async function actionPublierPodcast(donnees: DonneesPodcast): Promise<Resultat> {
  const v = await verifier(donnees)
  if ("erreur" in v) return { ok: false, erreur: v.erreur }
  const { d, publieLe } = v
  if (!d.audio) return { ok: false, erreur: "Ajoutez le fichier audio." }

  // Lien : l'émission puis le titre, comme les replays déjà en ligne.
  const base = versSlug(`${d.emission ?? ""} ${d.titre}`)
    .slice(0, 90)
    .replace(/-+$/, "")
  if (base.length < 4) return { ok: false, erreur: "Titre invalide." }
  const cles = await redis([["HKEYS", CLE_PODCASTS]])
  if (!cles) return { ok: false, erreur: "Base de données injoignable : réessayez." }
  const pris = new Set([...episodesDepot.map((e) => e.slug), ...((cles[0] as string[]) ?? [])])
  let slug = base
  for (let i = 2; pris.has(slug); i++) slug = `${base}-${i}`

  const episode: EpisodeDashboard = {
    slug,
    titre: d.titre,
    description: d.description,
    ...(d.emission ? { emission: d.emission } : {}),
    theme: d.theme,
    publieLe,
    duree: d.audio.duree,
    audioUrl: d.audio.url,
  }
  const r = await redis([["HSET", CLE_PODCASTS, slug, JSON.stringify(episode)]])
  if (!r || r[0] === null) return { ok: false, erreur: "Base de données injoignable : réessayez." }
  rafraichir()
  traduirePlusTard(slug)
  return {
    ok: true,
    message: "Podcast en ligne. Les traductions (DE, LB, EN, ES) arrivent dans une minute environ.",
    lien: `/podcasts/${slug}`,
  }
}

/** Modifie un podcast sans changer son lien ; un nouveau son remplace l'ancien. */
export async function actionModifierPodcast(
  slug: unknown,
  donnees: DonneesPodcast,
): Promise<Resultat> {
  if (!slugValide(slug)) return { ok: false, erreur: "Podcast invalide." }
  const v = await verifier(donnees)
  if ("erreur" in v) return { ok: false, erreur: v.erreur }
  const { d, publieLe } = v
  const ancien = await lire(slug)
  if (ancien === "injoignable")
    return { ok: false, erreur: "Base de données injoignable : réessayez." }
  if (!ancien) return { ok: false, erreur: "Podcast introuvable : il a peut-être été retiré." }

  const episode: EpisodeDashboard = {
    slug,
    titre: d.titre,
    description: d.description,
    ...(d.emission ? { emission: d.emission } : {}),
    theme: d.theme,
    publieLe,
    duree: d.audio?.duree ?? ancien.duree,
    audioUrl: d.audio?.url ?? ancien.audioUrl,
    // Gardées : elles ne s'affichent que si le titre et la description n'ont pas changé.
    ...(ancien.traductions ? { traductions: ancien.traductions } : {}),
  }
  const r = await redis([["HSET", CLE_PODCASTS, slug, JSON.stringify(episode)]])
  if (!r || r[0] === null) return { ok: false, erreur: "Base de données injoignable : réessayez." }
  rafraichir()
  if (episode.audioUrl !== ancien.audioUrl) supprimerPlusTard(ancien.audioUrl)
  traduirePlusTard(slug)
  return { ok: true, message: "Modifications enregistrées.", lien: `/podcasts/${slug}` }
}

export async function actionRetirerPodcast(slug: unknown): Promise<Resultat> {
  if (!(await estConnecte())) return { ok: false, erreur: "Session expirée : reconnectez-vous." }
  if (!slugValide(slug)) return { ok: false, erreur: "Podcast invalide." }
  const ancien = await lire(slug)
  if (ancien === "injoignable")
    return { ok: false, erreur: "Base de données injoignable : réessayez." }
  if (!ancien) return { ok: false, erreur: "Podcast introuvable." }
  const r = await redis([["HDEL", CLE_PODCASTS, slug]])
  if (!r) return { ok: false, erreur: "Base de données injoignable : réessayez." }
  rafraichir()
  supprimerPlusTard(ancien.audioUrl)
  return { ok: true, message: "Podcast retiré du site." }
}

/** Son envoyé mais publication abandonnée (erreur du formulaire) : on ne le laisse pas traîner. */
export async function actionOublierSon(url: unknown): Promise<void> {
  if (!(await estConnecte()) || typeof url !== "string" || !URL_AUDIO.test(url)) return
  const r = await redis([["HVALS", CLE_PODCASTS]])
  const utilise = ((r?.[0] as string[] | undefined) ?? []).some((x) => x.includes(url))
  if (!utilise) supprimerPlusTard(url)
}
