import Link from "@/components/ui/Lien"
import { ordreCategories } from "@/data/categories"
import { categoriesLangue } from "@/lib/contenu/localiser"
import { traducteur } from "@/lib/i18n/serveur"
import type { CategorieSlug } from "@/types/category"

/** Navigation entre rubriques, en rail défilant sur mobile. */
export async function CategoryNav({ active }: { active: CategorieSlug }) {
  const t = await traducteur()
  const categories = categoriesLangue(t.langue)
  return (
    <nav
      aria-label={t({ fr: "Rubriques", de: "Rubriken", lb: "Rubriken" })}
      className="-mx-4 px-4 sm:mx-0 sm:px-0"
    >
      <ul className="rail py-1">
        {ordreCategories.map((slug) => {
          const c = categories[slug]
          return (
            <li key={slug} className="flex-none">
              <Link
                href={c.chemin}
                aria-current={slug === active ? "page" : undefined}
                className="puce-filtre"
              >
                {slug === "actualites" ? t({ fr: "Tout", de: "Alle", lb: "All" }) : c.nom}
              </Link>
            </li>
          )
        })}
        <li className="flex-none">
          <Link href="/agenda" className="puce-filtre">
            {t({ fr: "Agenda", de: "Agenda", lb: "Agenda" })}
          </Link>
        </li>
      </ul>
    </nav>
  )
}
