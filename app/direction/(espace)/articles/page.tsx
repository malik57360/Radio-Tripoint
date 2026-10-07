import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { connection } from "next/server"
import {
  ModifierArticle,
  RedactionArticle,
  RetirerArticle,
} from "@/components/direction/RedactionArticle"
import { AActiver, Carte, date, EnTetePage } from "@/components/direction/ui"
import { categories } from "@/data/categories"
import { CLE_ARTICLES } from "@/lib/contenu/articles-dashboard"
import { versBrouillon } from "@/lib/contenu/brouillon-article"
import { redis, redisActif } from "@/lib/direction/redis"
import type { Article } from "@/types/article"

export const metadata = { title: "Articles — Direction Radio Tripoint" }

/** Articles publiés depuis le tableau de bord, lus sans cache (état exact). */
async function publies(): Promise<Article[]> {
  const r = await redis([["HGETALL", CLE_ARTICLES]])
  const brut = r?.[0]
  if (!Array.isArray(brut)) return []
  const liste: Article[] = []
  for (let i = 1; i < brut.length; i += 2) {
    try {
      liste.push(JSON.parse(String(brut[i])) as Article)
    } catch {
      /* entrée illisible */
    }
  }
  return liste.sort((a, b) => (b.publieLe ?? "").localeCompare(a.publieLe ?? ""))
}

export default async function PageArticles({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  await connection()
  const pret = redisActif() && Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  const liste = pret ? await publies() : []
  const rubriques = Object.values(categories).map((c) => ({ slug: c.slug, nom: c.nom }))
  // « Modifier » : ?modifier=<slug> rouvre le formulaire avec cet article.
  const { modifier } = await searchParams
  const cible = typeof modifier === "string" ? liste.find((a) => a.slug === modifier) : undefined

  return (
    <div className="space-y-4">
      <EnTetePage
        titre="Articles"
        source="Écrire un article avec ses photos de presse : il est en ligne dès la publication"
      />

      {!pret ? (
        <AActiver titre="Stockage non branché">
          La base Redis et le stockage Blob de Vercel doivent être reliés au projet.
        </AActiver>
      ) : (
        <>
          {modifier && !cible ? (
            <Carte titre="Modifier l'article">
              <p className="text-sm">
                Cet article est introuvable : il a peut-être été retiré.{" "}
                <Link href="/direction/articles" className="text-accent underline">
                  Écrire un nouvel article
                </Link>
              </p>
            </Carte>
          ) : cible ? (
            <Carte titre="Modifier l'article" note="le lien de l'article ne change pas">
              <RedactionArticle
                key={cible.slug}
                rubriques={rubriques}
                brouillon={versBrouillon(cible)}
              />
            </Carte>
          ) : (
            <Carte titre="Nouvel article">
              <RedactionArticle rubriques={rubriques} />
            </Carte>
          )}

          <Carte titre="Publiés depuis le tableau de bord" note={`${liste.length} article(s)`}>
            {liste.length === 0 ? (
              <p className="text-encre-3 text-sm">Aucun pour l&apos;instant.</p>
            ) : (
              <ul className="divide-trait divide-y text-sm">
                {liste.map((a) => (
                  <li key={a.slug} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
                    <span className="text-encre-3 w-16 flex-none text-xs">
                      {a.publieLe ? date(a.publieLe, { day: "numeric", month: "short" }) : "—"}
                    </span>
                    <a
                      href={`/actualites/${a.slug}`}
                      target="_blank"
                      rel="noopener"
                      className="hover:text-accent inline-flex min-w-0 flex-1 items-center gap-1.5 font-semibold"
                    >
                      <span className="line-clamp-2 sm:truncate">{a.titre}</span>
                      <ExternalLink className="size-3.5 flex-none" aria-hidden />
                    </a>
                    <span className="bg-accent-doux text-accent hidden flex-none rounded px-1.5 py-0.5 text-[0.7rem] font-bold sm:inline">
                      {categories[a.categorie]?.court ?? a.categorie}
                    </span>
                    {/* Sur téléphone, les boutons passent sous le titre pour lui laisser la place. */}
                    <div className="flex w-full justify-end gap-2 sm:w-auto">
                      <ModifierArticle slug={a.slug} actif={a.slug === cible?.slug} />
                      <RetirerArticle slug={a.slug} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Carte>
        </>
      )}
    </div>
  )
}
