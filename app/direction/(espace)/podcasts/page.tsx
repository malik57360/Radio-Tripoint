import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { revalidateTag } from "next/cache"
import { after, connection } from "next/server"
import {
  ModifierPodcast,
  PublicationPodcast,
  RetirerPodcast,
  type BrouillonPodcast,
} from "@/components/direction/PublicationPodcast"
import { AActiver, Carte, date, duree, EnTetePage } from "@/components/direction/ui"
import { listerEmissions } from "@/lib/contenu/emissions"
import { themesPodcast } from "@/lib/contenu/podcasts"
import { CLE_PODCASTS, TAG_PODCASTS, type EpisodeDashboard } from "@/lib/contenu/podcasts-dashboard"
import { localParis } from "@/lib/direction/podcasts"
import { redis, redisActif } from "@/lib/direction/redis"
import { estTraduit, traduireEpisode } from "@/lib/direction/traduction-podcasts"
import type { ThemePodcast } from "@/types/podcast"

export const metadata = { title: "Podcasts — Direction Radio Tripoint" }
// Rattrapage des traductions après l'affichage : une minute au plus.
export const maxDuration = 120

/** Podcasts publiés depuis le tableau de bord, lus sans cache (état exact). */
async function publies(): Promise<EpisodeDashboard[]> {
  const r = await redis([["HGETALL", CLE_PODCASTS]])
  const brut = r?.[0]
  if (!Array.isArray(brut)) return []
  const liste: EpisodeDashboard[] = []
  for (let i = 1; i < brut.length; i += 2) {
    try {
      liste.push(JSON.parse(String(brut[i])) as EpisodeDashboard)
    } catch {
      /* entrée illisible */
    }
  }
  return liste.sort((a, b) => (b.publieLe ?? "").localeCompare(a.publieLe ?? ""))
}

const versBrouillon = (e: EpisodeDashboard): BrouillonPodcast => ({
  slug: e.slug,
  titre: e.titre,
  description: e.description,
  emission: e.emission ?? "",
  theme: e.theme,
  diffuseLe: localParis(new Date(e.publieLe ?? Date.now())),
  audioUrl: e.audioUrl,
  duree: e.duree,
})

export default async function PagePodcasts({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  await connection()
  const pret = redisActif() && Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  const liste = pret ? await publies() : []
  const emissions = (await listerEmissions()).map((e) => ({ slug: e.slug, nom: e.nom }))
  const nomEmission = new Map(emissions.map((e) => [e.slug, e.nom]))
  const themes = themesPodcast
    .filter(
      (t): t is { valeur: ThemePodcast; libelle: (typeof t)["libelle"] } => t.valeur !== "toutes",
    )
    .map((t) => ({ valeur: t.valeur, libelle: t.libelle.fr }))
  const maintenant = localParis()
  // Une traduction ratée (IA indisponible un moment) est relancée à l'ouverture de la page.
  const ia = Boolean(process.env.ANTHROPIC_API_KEY)
  const aTraduire = ia ? liste.filter((e) => !estTraduit(e)).map((e) => e.slug) : []
  if (aTraduire.length)
    after(async () => {
      for (const slug of aTraduire)
        try {
          if ((await traduireEpisode(slug)) === "fait") revalidateTag(TAG_PODCASTS, { expire: 0 })
        } catch (e) {
          console.error("[podcasts] traduction", (e as Error).message)
        }
    })
  // « Modifier » : ?modifier=<slug> rouvre le formulaire avec ce podcast.
  const { modifier } = await searchParams
  const cible = typeof modifier === "string" ? liste.find((e) => e.slug === modifier) : undefined

  return (
    <div className="space-y-4">
      <EnTetePage
        titre="Podcasts"
        source="Publier un replay ou un podcast : il est en ligne dès la publication"
      />

      {!pret ? (
        <AActiver titre="Stockage non branché">
          La base Redis et le stockage Blob de Vercel doivent être reliés au projet.
        </AActiver>
      ) : (
        <>
          {modifier && !cible ? (
            <Carte titre="Modifier le podcast">
              <p className="text-sm">
                Ce podcast est introuvable : il a peut-être été retiré.{" "}
                <Link href="/direction/podcasts" className="text-accent underline">
                  Publier un nouveau podcast
                </Link>
              </p>
            </Carte>
          ) : cible ? (
            <Carte titre="Modifier le podcast" note="le lien du podcast ne change pas">
              <PublicationPodcast
                key={cible.slug}
                emissions={emissions}
                themes={themes}
                maintenant={maintenant}
                brouillon={versBrouillon(cible)}
              />
            </Carte>
          ) : (
            <Carte titre="Nouveau podcast">
              <PublicationPodcast emissions={emissions} themes={themes} maintenant={maintenant} />
            </Carte>
          )}

          <Carte titre="Publiés depuis le tableau de bord" note={`${liste.length} podcast(s)`}>
            {liste.length === 0 ? (
              <p className="text-encre-3 text-sm">Aucun pour l&apos;instant.</p>
            ) : (
              <ul className="divide-trait divide-y text-sm">
                {liste.map((e) => {
                  const traduit = estTraduit(e)
                  return (
                    <li key={e.slug} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
                      <span className="text-encre-3 w-16 flex-none text-xs">
                        {e.publieLe ? date(e.publieLe, { day: "numeric", month: "short" }) : "—"}
                      </span>
                      <a
                        href={`/podcasts/${e.slug}`}
                        target="_blank"
                        rel="noopener"
                        className="hover:text-accent inline-flex min-w-0 flex-1 items-center gap-1.5 font-semibold"
                      >
                        <span className="line-clamp-2 sm:truncate">{e.titre}</span>
                        <ExternalLink className="size-3.5 flex-none" aria-hidden />
                      </a>
                      <span className="text-encre-3 flex-none text-xs">
                        {[e.emission && nomEmission.get(e.emission), duree(e.duree)]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                      {/* Sur téléphone, les boutons passent sous le titre pour lui laisser la place. */}
                      <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
                        <span
                          className={
                            traduit ? "text-bon text-xs font-bold" : "text-encre-3 text-xs"
                          }
                        >
                          {traduit
                            ? "5 langues"
                            : ia
                              ? "Traduction en cours"
                              : "Français seulement"}
                        </span>
                        <ModifierPodcast slug={e.slug} actif={e.slug === cible?.slug} />
                        <RetirerPodcast slug={e.slug} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Carte>
        </>
      )}
    </div>
  )
}
