import { CategoryPage } from "@/components/news/CategoryPage"
import { categoriesLangue } from "@/lib/contenu/localiser"
import { langue } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"

export async function generateMetadata() {
  const cat = categoriesLangue(await langue())["mode-style"]
  return metadataPage({ titre: cat.titreSeo, description: cat.description, chemin: cat.chemin })
}

export default function Page(props: PageProps<"/[lang]/mode-style">) {
  return <CategoryPage slug="mode-style" searchParams={props.searchParams} />
}
