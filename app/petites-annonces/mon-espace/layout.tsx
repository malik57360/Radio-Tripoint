import { BadgeCheck, Building2 } from "lucide-react"
import { redirect } from "next/navigation"
import { FilAnnonces } from "@/components/annonces/Chrome"
import { NavEspace } from "@/components/annonces/espace/NavEspace"
import { compteEspace, compteurs } from "@/lib/annonces/espace-donnees"
import { nomPublic } from "@/lib/annonces/comptes"

/**
 * Cadre de « Mon espace » : la carte du compte et le menu, puis la page.
 * Au téléphone, le menu devient une bande d'onglets qui défile.
 */
const mois = (ms: number) =>
  new Date(ms).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  })

export default async function CadreEspace({ children }: { children: React.ReactNode }) {
  const c = await compteEspace()
  if (!c) redirect("/connexion?suite=/mon-espace")
  const n = await compteurs(c.id)
  const nom = nomPublic(c)
  const initiales =
    nom
      .split(/\s+/)
      .slice(0, 2)
      .map((m) => m[0])
      .join("")
      .toUpperCase() || "?"

  return (
    <div className="espace conteneur pt-5 pb-14 sm:pt-7">
      <FilAnnonces elements={[{ nom: "Mon espace", chemin: "/mon-espace" }]} />
      <div className="mt-5 grid gap-5 lg:mt-7 lg:grid-cols-[16rem_1fr] lg:gap-10">
        <aside className="espace-menu min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-3 lg:block">
            <span
              aria-hidden
              className="bg-nuit-3 text-nuit-encre grid size-12 flex-none place-items-center rounded-full text-lg font-extrabold ring-2 ring-[#f9b800] ring-offset-2 ring-offset-[var(--papier)] lg:size-16 lg:text-2xl"
            >
              {initiales}
            </span>
            <div className="min-w-0 lg:mt-3">
              <p className="truncate text-[1.05rem] font-extrabold lg:text-lg">{nom}</p>
              <p className="text-encre-3 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.8rem]">
                <span className="inline-flex items-center gap-1 font-semibold">
                  {c.type === "pro" ? (
                    <>
                      <Building2 className="size-3.5" aria-hidden /> Professionnel
                    </>
                  ) : (
                    "Particulier"
                  )}
                </span>
                <span aria-hidden>·</span>
                <span>Membre depuis {mois(c.creeLe)}</span>
              </p>
              {c.emailVerifie ? (
                <p className="text-succes mt-0.5 inline-flex items-center gap-1 text-[0.78rem] font-bold">
                  <BadgeCheck className="size-3.5" aria-hidden /> E-mail confirmé
                </p>
              ) : (
                <p className="text-alerte mt-0.5 text-[0.78rem] font-bold">E-mail à confirmer</p>
              )}
            </div>
          </div>
          <div className="sticky top-16 z-20 -mx-4 mt-4 bg-[var(--papier)] px-4 py-2 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:mt-6 lg:bg-transparent lg:p-0">
            <NavEspace compteurs={n} />
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
