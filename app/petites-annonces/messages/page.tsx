import { MessagesSquare } from "lucide-react"
import { metaAnnonces } from "@/lib/annonces/seo"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Messages",
    description: "Vos discussions avec les acheteurs et les annonceurs.",
    chemin: "/messages",
    noindex: true,
  })

/** Sur ordinateur, à droite de la liste tant qu'aucune discussion n'est ouverte. */
export default function Messages() {
  return (
    <div className="hidden h-full place-items-center p-8 text-center lg:grid">
      <div>
        <span className="bg-papier-2 mx-auto grid size-16 place-items-center rounded-full">
          <MessagesSquare className="text-encre-2 size-7" aria-hidden />
        </span>
        <p className="mt-4 text-lg font-extrabold">Choisissez une discussion</p>
        <p className="text-encre-2 mt-1 text-[0.92rem]">Elle s&apos;ouvrira ici.</p>
      </div>
    </div>
  )
}
