import { LIBELLES_MENTION, type AnnoncePublique } from "./types"

/** Prix tel qu'affiché : « 180 € », « 180 € · à débattre », « À donner », ou le salaire d'une offre d'emploi. */
export function prixAffiche(a: Pick<AnnoncePublique, "prix" | "mention" | "details">) {
  if (a.mention === "don") return "À donner"
  if (a.prix !== null) {
    const p = `${(a.prix / 100).toLocaleString("fr-FR", { maximumFractionDigits: a.prix % 100 ? 2 : 0, minimumFractionDigits: a.prix % 100 ? 2 : 0 })} €`
    return a.mention ? `${p} · ${LIBELLES_MENTION[a.mention].toLowerCase()}` : p
  }
  if (a.mention) return LIBELLES_MENTION[a.mention]
  return a.details.salaire ?? null
}
