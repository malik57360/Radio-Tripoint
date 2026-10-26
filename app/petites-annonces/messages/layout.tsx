import { redirect } from "next/navigation"
import { ListeDiscussions } from "@/components/annonces/messagerie/ListeDiscussions"
import { compteConnecte } from "@/lib/annonces/comptes"
import { mesDiscussions, pourListe } from "@/lib/annonces/discussions"

/**
 * La messagerie, à part de « Mon espace » : la liste des discussions et le
 * fil ouvert. Au téléphone, l'un ou l'autre en plein écran ; sur
 * ordinateur, les deux côte à côte.
 */
export default async function Messagerie({ children }: { children: React.ReactNode }) {
  const c = await compteConnecte()
  if (!c) redirect("/connexion?suite=/messages")
  const liste = (await mesDiscussions(c.id)).map((d) => pourListe(d, c.id))
  return (
    <div className="messagerie lg:mx-auto lg:max-w-[84rem] lg:px-6 lg:py-6 xl:px-10">
      <div className="bg-surface lg:border-trait grid h-[calc(100dvh-4rem)] grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] lg:h-[calc(100dvh-7rem)] lg:min-h-[34rem] lg:grid-cols-[23rem_minmax(0,1fr)] lg:overflow-hidden lg:rounded-2xl lg:border">
        <ListeDiscussions initiale={liste} />
        {children}
      </div>
    </div>
  )
}
