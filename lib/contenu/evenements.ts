import { evenements as evenementsReels } from "@/data/events"
import { evenementsPublies } from "@/lib/agenda/publies"
import { evenementsDemo } from "@/data/demo"
import type { Evenement } from "@/types/event"
import type { Langue } from "@/lib/i18n/langues"
import { cleJour } from "@/lib/utils/dates"
import { localiserEvenement } from "./localiser"
import { modeDemo } from "./demo"

export type Periode = "tout" | "aujourdhui" | "semaine" | "mois"

/** Agenda éditorial (data/events.ts) + événements payés et publiés depuis le tableau de bord. */
async function tous(l: Langue = "fr"): Promise<Evenement[]> {
  const base = modeDemo ? [...evenementsReels, ...evenementsDemo] : evenementsReels
  const slugs = new Set(base.map((e) => e.slug))
  const payes = (await evenementsPublies()).filter((e) => !slugs.has(e.slug))
  return [...base, ...payes]
    .sort((a, b) => a.debut.localeCompare(b.debut))
    .map((e) => localiserEvenement(e, l))
}

/** Un événement reste « à venir » jusqu'à sa fin (ou la fin de son jour). */
function nonTermine(e: Evenement, maintenant: Date): boolean {
  if (e.fin) return new Date(e.fin) >= maintenant
  return cleJour(new Date(e.debut)) >= cleJour(maintenant)
}

export async function listerEvenements(
  options: { periode?: Periode; ville?: string; langue?: Langue } = {},
  maintenant = new Date(),
) {
  const { periode = "tout", ville, langue = "fr" } = options
  let liste = (await tous(langue)).filter((e) => nonTermine(e, maintenant))
  if (ville) liste = liste.filter((e) => e.ville === ville)
  const jour = cleJour(maintenant)
  const limite = (jours: number) => cleJour(new Date(maintenant.getTime() + jours * 86_400_000))
  if (periode === "aujourdhui") liste = liste.filter((e) => cleJour(new Date(e.debut)) <= jour)
  if (periode === "semaine") liste = liste.filter((e) => cleJour(new Date(e.debut)) <= limite(7))
  if (periode === "mois") liste = liste.filter((e) => cleJour(new Date(e.debut)) <= limite(31))
  return liste
}

/** Villes présentes dans l'agenda (les filtres n'affichent que du réel). */
export async function villesAgenda(): Promise<string[]> {
  return [...new Set((await tous()).map((e) => e.ville))].sort((a, b) => a.localeCompare(b, "fr"))
}

export async function evenementParSlug(slug: string, l: Langue = "fr"): Promise<Evenement | null> {
  return (await tous(l)).find((e) => e.slug === slug) ?? null
}

export async function tousEvenements(l: Langue = "fr"): Promise<Evenement[]> {
  return tous(l)
}
