"use client"

import { Download, Share, X } from "lucide-react"
import { useEffect, useState, useSyncExternalStore } from "react"

/** Inscrit le service worker de l'app « Direction » (page hors connexion, aucune donnée gardée). */
export function EnregistrerApp() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return
    navigator.serviceWorker.register("/direction/sw.js", { scope: "/direction" }).catch(() => {})
  }, [])
  return null
}

interface InvitationInstall extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const sansAbonnement = () => () => {}
/** Déjà ouverte comme app (écran d'accueil) : rien à proposer. */
const dejaInstallee = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true
/** iPhone / iPad dans Safari : pas d'invitation automatique, on explique le geste. */
const iosNavigateur = () =>
  !dejaInstallee() &&
  (/iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))

/**
 * « Installer l'app » : invitation du navigateur sur Android et ordinateur,
 * mode d'emploi sur iPhone. Invisible une fois l'app installée.
 * `icone` : bouton rond de l'en-tête (ordinateur) ; `ligne` : rangée pleine
 * largeur de la feuille « Plus » (téléphone).
 */
export function BoutonInstaller({ variante = "icone" }: { variante?: "icone" | "ligne" }) {
  const [invitation, setInvitation] = useState<InvitationInstall | null>(null)
  const [aide, setAide] = useState(false)
  const ios = useSyncExternalStore(sansAbonnement, iosNavigateur, () => false)

  useEffect(() => {
    const garder = (e: Event) => {
      e.preventDefault()
      setInvitation(e as InvitationInstall)
    }
    const installee = () => setInvitation(null)
    window.addEventListener("beforeinstallprompt", garder)
    window.addEventListener("appinstalled", installee)
    return () => {
      window.removeEventListener("beforeinstallprompt", garder)
      window.removeEventListener("appinstalled", installee)
    }
  }, [])

  if (!invitation && !ios) return null

  const installer = async () => {
    if (!invitation) return setAide((a) => !a)
    await invitation.prompt()
    await invitation.userChoice.catch(() => null)
    setInvitation(null)
  }

  const modeEmploi = (
    <ol className="text-encre-2 mt-2 list-decimal space-y-1.5 pl-5 text-sm">
      <li>
        Dans Safari, touchez <Share className="inline size-4 align-[-3px]" aria-label="Partager" />{" "}
        (Partager).
      </li>
      <li>Choisissez « Sur l&apos;écran d&apos;accueil ».</li>
      <li>Touchez « Ajouter » : l&apos;app « Direction » apparaît avec son icône.</li>
    </ol>
  )

  if (variante === "ligne")
    return (
      <div className="bg-accent-doux border-accent/30 rounded-2xl border">
        <button
          type="button"
          onClick={installer}
          aria-expanded={ios ? aide : undefined}
          className="text-accent flex min-h-12 w-full items-center gap-3 px-4 text-sm font-bold"
        >
          <Download className="size-4.5" aria-hidden />
          Installer l&apos;app sur l&apos;écran d&apos;accueil
        </button>
        {aide && <div className="px-4 pb-4">{modeEmploi}</div>}
      </div>
    )

  return (
    <div className="relative">
      <button
        type="button"
        onClick={installer}
        aria-label="Installer l'app Direction"
        aria-expanded={ios ? aide : undefined}
        title="Installer l'app Direction"
        className="border-trait hover:bg-carte-2 text-accent grid size-10 place-items-center rounded-full border"
      >
        <Download className="size-4" aria-hidden />
      </button>
      {aide && (
        <div
          role="dialog"
          aria-label="Installer l'app sur iPhone"
          className="border-trait bg-carte absolute top-12 right-0 z-40 w-72 rounded-xl border p-4 text-sm shadow-xl"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold">Installer l&apos;app sur l&apos;iPhone</p>
            <button
              type="button"
              onClick={() => setAide(false)}
              aria-label="Fermer"
              className="text-encre-3 hover:text-encre -m-1 rounded-full p-1"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          {modeEmploi}
        </div>
      )}
    </div>
  )
}
