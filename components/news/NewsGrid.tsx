import type { Article } from "@/types/article"
import { NewsCard } from "./NewsCard"

export function NewsGrid({
  articles,
  titreNiveau = "h3",
}: {
  articles: Article[]
  titreNiveau?: "h2" | "h3"
}) {
  return (
    <ul className="divide-trait grid divide-y sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:divide-y-0 lg:grid-cols-3">
      {articles.map((a) => (
        <li key={a.slug} className="py-5 first:pt-0 last:pb-0 sm:py-0">
          <NewsCard article={a} titreNiveau={titreNiveau} ligneMobile />
        </li>
      ))}
    </ul>
  )
}
