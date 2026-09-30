import { lang } from "next/root-params"
import { creerT, estLangue, langueParDefaut, type Langue } from "./langues"

/** Langue de la page en cours (Server Components uniquement). */
export async function langue(): Promise<Langue> {
  const l = await lang()
  return estLangue(l) ? l : langueParDefaut
}

/** Outil de traduction côté serveur : `const t = await traducteur()`. */
export async function traducteur() {
  return creerT(await langue())
}
