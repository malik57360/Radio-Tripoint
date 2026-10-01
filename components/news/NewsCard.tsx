import Link from "@/components/ui/Lien"
import { categoriesLangue } from "@/lib/contenu/localiser"
import { teinteCategorie } from "@/lib/contenu/teintes"
import { traducteur } from "@/lib/i18n/serveur"
import { dateRelative } from "@/lib/utils/dates"
import { tempsLecture } from "@/lib/utils/texte"
import { cn } from "@/lib/utils/cn"
import type { Article } from "@/types/article"
import { Visuel } from "@/components/ui/Visuel"

export async function MetaArticle({
  article,
  className,
}: {
  article: Article
  className?: string
}) {
  const t = await traducteur()
  return (
    <p className={cn("text-encre-3 flex flex-wrap items-center gap-x-2 text-[0.8rem]", className)}>
      {article.publieLe && (
        <>
          <time dateTime={article.publieLe}>{dateRelative(article.publieLe, t.langue)}</time>
          <span aria-hidden>·</span>
        </>
      )}
      <span>
        {tempsLecture(article.corps)}{" "}
        {t({
          fr: "min de lecture",
          de: "Min. Lesezeit",
          lb: "Min. Liesen",
          en: "min read",
          es: "min de lectura",
        })}
      </span>
    </p>
  )
}

export async function BadgeArticle({ article }: { article: Article }) {
  const t = await traducteur()
  return (
    <p className="flex flex-wrap items-center gap-2">
      <span className="badge">{categoriesLangue(t.langue)[article.categorie].court}</span>
      {article.lieux?.[0] && (
        <span className="text-encre-3 text-[0.75rem] font-medium">{article.lieux[0]}</span>
      )}
      {article.demo && (
        <span className="badge-exemple">
          {t({ fr: "Exemple", de: "Beispiel", lb: "Beispill", en: "Example", es: "Ejemplo" })}
        </span>
      )}
    </p>
  )
}

/** Carte standard : visuel, rubrique, titre, méta. */
export async function NewsCard({
  article,
  titreNiveau: Titre = "h3",
  avecChapeau = false,
  ligneMobile = false,
  sizes = ligneMobile
    ? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 112px"
    : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw",
}: {
  article: Article
  titreNiveau?: "h2" | "h3"
  avecChapeau?: boolean
  /** Sur téléphone, vignette à droite du titre plutôt qu'une grande image. */
  ligneMobile?: boolean
  sizes?: string
}) {
  const cat = categoriesLangue((await traducteur()).langue)[article.categorie]
  return (
    <article
      className={cn(
        "carte group",
        ligneMobile
          ? "grid grid-cols-[1fr_7rem] gap-4 sm:flex sm:flex-col sm:gap-0"
          : "flex flex-col",
      )}
    >
      <Visuel
        visuel={article.visuel}
        repli={{
          mot: cat.court,
          surmot: "Radio Tripoint",
          teinte: teinteCategorie[article.categorie],
        }}
        ratio={ligneMobile ? "aspect-square sm:aspect-[16/10]" : undefined}
        className={cn(ligneMobile && "order-last sm:order-none")}
        sizes={sizes}
      />
      <div className={cn("flex min-w-0 flex-1 flex-col", ligneMobile ? "sm:mt-4" : "mt-4")}>
        <BadgeArticle article={article} />
        <Titre
          className={cn(
            "carte-titre titre-carte sm:text-[1.28rem]",
            ligneMobile
              ? "mt-1.5 line-clamp-3 text-[1.05rem] sm:mt-2 sm:line-clamp-none"
              : "mt-2 text-[1.2rem]",
          )}
        >
          <Link href={`/actualites/${article.slug}`} className="carte-lien">
            {article.titre}
          </Link>
        </Titre>
        {avecChapeau && (
          <p className="presse text-encre-2 mt-2 line-clamp-3 text-[1.05rem] leading-snug">
            {article.chapeau}
          </p>
        )}
        <MetaArticle article={article} className="mt-3" />
      </div>
    </article>
  )
}

/** Carte horizontale compacte : vignette à gauche. Pour les colonnes secondaires. */
export async function NewsCardLigne({ article }: { article: Article }) {
  const cat = categoriesLangue((await traducteur()).langue)[article.categorie]
  return (
    <article className="carte group grid grid-cols-[1fr_7rem] gap-4 sm:grid-cols-[1fr_8.5rem]">
      <div className="min-w-0">
        <BadgeArticle article={article} />
        <h3 className="carte-titre titre-carte mt-1.5 line-clamp-3 text-[1.05rem]">
          <Link href={`/actualites/${article.slug}`} className="carte-lien">
            {article.titre}
          </Link>
        </h3>
        <MetaArticle article={article} className="mt-2" />
      </div>
      <Visuel
        visuel={article.visuel}
        repli={{ mot: cat.court, teinte: teinteCategorie[article.categorie], taille: "petit" }}
        ratio="aspect-square"
        sizes="140px"
      />
    </article>
  )
}
