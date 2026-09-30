import { emissions as emissionsReelles } from "@/data/shows"
import { grilleDemo } from "@/data/demo"
import type { Langue } from "@/lib/i18n/langues"
import type { Emission } from "@/types/show"
import { localiserEmission } from "./localiser"
import { modeDemo } from "./demo"

function toutes(): Emission[] {
  if (!modeDemo) return emissionsReelles
  const grille = grilleDemo(emissionsReelles.map((e) => e.slug))
  return emissionsReelles.map((e) => ({
    ...e,
    creneaux: e.creneaux.length ? e.creneaux : (grille[e.slug] ?? []),
  }))
}

export async function listerEmissions(l: Langue = "fr"): Promise<Emission[]> {
  return toutes().map((e) => localiserEmission(e, l))
}

export async function emissionParSlug(slug: string, l: Langue = "fr"): Promise<Emission | null> {
  const e = toutes().find((x) => x.slug === slug)
  return e ? localiserEmission(e, l) : null
}
