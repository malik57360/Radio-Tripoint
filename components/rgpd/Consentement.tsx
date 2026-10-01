"use client"

import { useT } from "@/components/i18n/Langue"
import Link from "@/components/ui/Lien"
import Script from "next/script"
import { useSyncExternalStore } from "react"
import { analytics } from "@/config/analytics"

type Choix = "accepte" | "refuse" | null
const CLE = "rt:consentement"
const abonnes = new Set<() => void>()

function lire(): Choix {
  try {
    const v = localStorage.getItem(CLE)
    return v === "accepte" || v === "refuse" ? v : null
  } catch {
    return null
  }
}
function ecrire(c: Exclude<Choix, null>) {
  try {
    localStorage.setItem(CLE, c)
  } catch {
    /* stockage indisponible : le bandeau reviendra, sans conséquence */
  }
  abonnes.forEach((f) => f())
}
/** Rouvre le bandeau (lien « Gérer les cookies »). */
export function reinitialiserConsentement() {
  try {
    localStorage.removeItem(CLE)
  } catch {}
  abonnes.forEach((f) => f())
}

/**
 * Bandeau de consentement + chargement conditionnel de la mesure d'audience.
 * Ne rend rien tant qu'aucun outil n'est configuré dans config/analytics.ts.
 */
export function Consentement() {
  const t = useT()
  const choix = useSyncExternalStore(
    (f) => {
      abonnes.add(f)
      return () => abonnes.delete(f)
    },
    lire,
    () => "refuse" as Choix, // serveur : rien d'affiché, rien de chargé
  )
  if (!analytics.script) return null
  const charger = !analytics.exigeConsentement || choix === "accepte"
  return (
    <>
      {charger && <Script src={analytics.script} strategy="afterInteractive" />}
      {analytics.exigeConsentement && choix === null && (
        <div
          role="dialog"
          aria-label={t({
            fr: "Cookies",
            de: "Cookies",
            lb: "Cookien",
            en: "Cookies",
            es: "Cookies",
          })}
          className="border-trait bg-surface shadow-2 fixed inset-x-3 bottom-[calc(var(--barre-lecteur)+0.75rem)] z-50 mx-auto max-w-xl border p-5"
        >
          <p className="text-encre-2 text-sm">
            {t({
              fr: `Nous aimerions mesurer l'audience du site (${analytics.nom}) pour l'améliorer. Rien n'est déposé sans votre accord.`,
              de: `Wir möchten die Nutzung der Website messen (${analytics.nom}), um sie zu verbessern. Ohne Ihre Zustimmung wird nichts gespeichert.`,
              lb: `Mir géifen d'Notzung vum Site gär moossen (${analytics.nom}), fir en ze verbesseren. Ouni Är Zoustëmmung gëtt näischt gespäichert.`,
              en: `We'd like to measure the website's audience (${analytics.nom}) to improve it. Nothing is stored without your consent.`,
              es: `Nos gustaría medir la audiencia del sitio (${analytics.nom}) para mejorarlo. No se instala nada sin su consentimiento.`,
            })}{" "}
            <Link href="/politique-confidentialite#cookies" className="lien">
              {t({
                fr: "En savoir plus",
                de: "Mehr erfahren",
                lb: "Méi gewuer ginn",
                en: "Learn more",
                es: "Saber más",
              })}
            </Link>
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => ecrire("accepte")}
              className="btn btn-plein !min-h-10"
            >
              {t({
                fr: "Accepter",
                de: "Akzeptieren",
                lb: "Akzeptéieren",
                en: "Accept",
                es: "Aceptar",
              })}
            </button>
            <button
              type="button"
              onClick={() => ecrire("refuse")}
              className="btn btn-trait !min-h-10"
            >
              {t({
                fr: "Refuser",
                de: "Ablehnen",
                lb: "Refuséieren",
                en: "Decline",
                es: "Rechazar",
              })}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export function BoutonGererCookies() {
  const t = useT()
  if (!analytics.script) return null
  return (
    <button type="button" onClick={reinitialiserConsentement} className="btn btn-trait mt-4">
      {t({
        fr: "Modifier mes choix",
        de: "Auswahl ändern",
        lb: "Auswiel änneren",
        en: "Change my choices",
        es: "Modificar mis opciones",
      })}
    </button>
  )
}
