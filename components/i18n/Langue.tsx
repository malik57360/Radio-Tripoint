"use client"

import { createContext, useContext, useMemo } from "react"
import { creerT, langueParDefaut, type Langue } from "@/lib/i18n/langues"

const Contexte = createContext<Langue>(langueParDefaut)

/** Transmet la langue de la page aux composants client. */
export function FournisseurLangue({
  langue,
  children,
}: {
  langue: Langue
  children: React.ReactNode
}) {
  return <Contexte.Provider value={langue}>{children}</Contexte.Provider>
}

export const useLangue = () => useContext(Contexte)

/** Outil de traduction côté client : `const t = useT()`. */
export function useT() {
  const langue = useLangue()
  return useMemo(() => creerT(langue), [langue])
}
