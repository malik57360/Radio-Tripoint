import { BandeauMaquette, EncadreArnaques } from "@/components/annonces/Annonces"
import { FormulaireAnnonce } from "@/components/annonces/FormulaireAnnonce"
import { PageHero } from "@/components/ui/PageHero"
import { metadataPage } from "@/lib/seo/metadata"

/** MAQUETTE — déposer une annonce. */
export const generateMetadata = () =>
  metadataPage({
    titre: "Déposer une annonce (maquette)",
    description: "Maquette du formulaire de dépôt d'annonce de Radio Tripoint.",
    chemin: "/annonces/deposer",
    noindex: true,
  })

const ETAPES = [
  ["Vous déposez", "Rubrique, texte, photos : deux minutes."],
  ["Nous vérifions", "L'équipe relit chaque annonce avant de la publier."],
  ["C'est en ligne", "30 jours sur le site, et les meilleures à l'antenne."],
]

export default async function PageDeposer(props: PageProps<"/[lang]/annonces/deposer">) {
  const sp = await props.searchParams
  return (
    <>
      <BandeauMaquette />
      <PageHero
        miettes={[
          { nom: "Annonces", chemin: "/annonces" },
          { nom: "Déposer une annonce", chemin: "/annonces/deposer" },
        ]}
        surtitre="Petites annonces"
        titre="Déposer une annonce"
        intro="Gratuit pour les particuliers. Votre annonce est vue en France, au Luxembourg et en Allemagne."
      />
      <div className="conteneur grid gap-12 py-12 lg:grid-cols-[1fr_1.8fr] lg:gap-16 lg:py-16">
        <aside className="space-y-7 lg:sticky lg:top-24 lg:self-start">
          <ol className="space-y-5">
            {ETAPES.map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="bg-accent grid size-9 flex-none place-items-center rounded-full text-sm font-extrabold text-black">
                  {i + 1}
                </span>
                <span>
                  <span className="titre-carte block text-lg">{t}</span>
                  <span className="text-encre-2 mt-1 block">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <EncadreArnaques />
        </aside>
        <FormulaireAnnonce proParDefaut={sp.pro === "1"} />
      </div>
    </>
  )
}
