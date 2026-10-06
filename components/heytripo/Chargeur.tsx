"use client"

import dynamic from "next/dynamic"

/**
 * L'appli dépend du navigateur (voix, micro, session) : rendue côté client
 * seulement. Pendant le chargement, le fond nuit est déjà là.
 */
export const Chargeur = dynamic(() => import("./AppTripo").then((m) => m.AppTripo), {
  ssr: false,
  loading: () => <main className="h-dvh" style={{ background: "#07060a" }} />,
})
