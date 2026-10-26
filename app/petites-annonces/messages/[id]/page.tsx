import { notFound, redirect } from "next/navigation"
import { Fil } from "@/components/annonces/messagerie/Fil"
import { lireAnnonce } from "@/lib/annonces/annonces"
import { compteConnecte } from "@/lib/annonces/comptes"
import {
  autreParticipant,
  lireDiscussion,
  lireFil,
  participe,
  pourFil,
} from "@/lib/annonces/discussions"
import { metaAnnonces } from "@/lib/annonces/seo"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Discussion",
    description: "Une discussion de la messagerie des Petites annonces.",
    chemin: "/messages",
    noindex: true,
  })

/** Une discussion : seulement pour ses deux participants. */
export default async function PageDiscussion(props: PageProps<"/petites-annonces/messages/[id]">) {
  const { id } = await props.params
  const c = await compteConnecte()
  if (!c) redirect(`/connexion?suite=/messages/${id}`)
  const d = await lireDiscussion(id)
  if (!d || !participe(d, c.id)) notFound()
  const [fil, a] = await Promise.all([lireFil(d.id), lireAnnonce(d.annonce.id)])
  const autre = autreParticipant(d, c.id)
  // L'annonce n'est plus en ligne : on le dit, sans lien qui mènerait à une page vide.
  const etat = !a
    ? "Supprimée"
    : a.vendueLe
      ? "Vendue"
      : a.statut === "publiee"
        ? null
        : "Plus en ligne"
  return (
    <Fil
      key={d.id}
      id={d.id}
      avec={{ nom: d.noms[autre] ?? "Utilisateur", pro: d.pros.includes(autre) }}
      annonce={{ ...d.annonce, etat }}
      initiaux={fil.map((m) => pourFil(m, c.id))}
      luAutreInitial={d.lu[autre] ?? 0}
    />
  )
}
