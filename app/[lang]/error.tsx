"use client"

import { useT } from "@/components/i18n/Langue"
import Link from "@/components/ui/Lien"
import { useEffect } from "react"

/** Erreur 500 d'une page : le reste du site (en-tête, lecteur) continue de fonctionner. */
export default function Erreur({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  const t = useT()
  useEffect(() => {
    // Seul l'identifiant technique est journalisé, jamais de donnée personnelle.
    console.error("Erreur de rendu", error.digest ?? "")
  }, [error])
  return (
    <section className="conteneur py-20 lg:py-28">
      <p className="surtitre text-accent-encre">
        {t({
          fr: "Erreur · Friture sur la ligne",
          de: "Fehler · Störung in der Leitung",
          lb: "Feeler · Stéierung op der Linn",
        })}
      </p>
      <h1 className="titre-page mt-4 max-w-3xl">
        {t({
          fr: "Cette page n'a pas pu s'afficher.",
          de: "Diese Seite konnte nicht angezeigt werden.",
          lb: "Dës Säit konnt net ugewise ginn.",
        })}
      </h1>
      <p className="presse text-encre-2 mt-5 max-w-xl text-[1.25rem] leading-snug">
        {t({
          fr: "Un problème technique de notre côté. Réessayez dans un instant — le lecteur en bas de page continue de fonctionner.",
          de: "Ein technisches Problem bei uns. Versuchen Sie es gleich noch einmal – der Player unten funktioniert weiter.",
          lb: "En techneschen Problem bei eis. Probéiert et gläich nach eng Kéier – de Player ënnen funktionéiert weider.",
        })}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={() => retry()} className="btn btn-plein min-h-12 !px-6">
          {t({ fr: "Réessayer", de: "Erneut versuchen", lb: "Nach eng Kéier probéieren" })}
        </button>
        <Link href="/" className="btn btn-trait min-h-12 !px-6">
          {t({ fr: "Accueil", de: "Startseite", lb: "Startsäit" })}
        </Link>
      </div>
      {error.digest && (
        <p className="text-encre-3 mt-10 text-xs">
          {t({ fr: "Référence", de: "Referenz", lb: "Referenz" })} : {error.digest}
        </p>
      )}
    </section>
  )
}
