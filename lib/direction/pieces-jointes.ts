/**
 * Pièces jointes des mails du tableau de bord : bornes communes au
 * formulaire (navigateur) et aux actions (serveur).
 */

/** Vercel refuse une requête de plus de 4,5 Mo : on garde de la marge pour le texte. */
export const PJ_MAX_OCTETS = 4 * 1024 * 1024
export const PJ_MAX_NOMBRE = 6

/** Programmes et scripts : refusés par la plupart des messageries, et dangereux. */
const INTERDITS = /\.(exe|bat|cmd|com|msi|scr|vbs|js|jar|ps1|sh|app|dmg)$/i

export const tailleLisible = (octets: number) =>
  octets < 1024 * 1024
    ? `${Math.max(1, Math.round(octets / 1024))} Ko`
    : `${(octets / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`

/** Message d'erreur si la sélection ne peut pas partir, sinon null. */
export function problemePieces(fichiers: { name: string; size: number }[]): string | null {
  if (fichiers.length > PJ_MAX_NOMBRE) return `${PJ_MAX_NOMBRE} pièces jointes au plus.`
  const interdit = fichiers.find((f) => INTERDITS.test(f.name))
  if (interdit) return `« ${interdit.name} » : les programmes ne peuvent pas être joints.`
  const total = fichiers.reduce((s, f) => s + f.size, 0)
  if (total > PJ_MAX_OCTETS)
    return `Pièces jointes trop lourdes (${tailleLisible(total)}) : ${tailleLisible(PJ_MAX_OCTETS)} au total au plus.`
  return null
}
