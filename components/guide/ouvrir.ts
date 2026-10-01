/** Événement qui ouvre le panneau de Tripo, avec ou sans question à poser. */
export const EVENEMENT_TRIPO = "tripo:ouvrir"

export function ouvrirTripo(question?: string) {
  window.dispatchEvent(new CustomEvent(EVENEMENT_TRIPO, { detail: { question } }))
}
