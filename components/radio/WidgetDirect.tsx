"use client"

import { X } from "lucide-react"
import { radioConfig } from "@/config/radioConfig"
import { fermerWidget } from "@/lib/radio/moteur"
import { useLecteur } from "@/lib/radio/useLecteur"

/**
 * Lecteur officiel Radioking, affiché tant que le flux brut n'est pas
 * renseigné. Monté dans le layout : il survit à la navigation, donc le son
 * continue d'une page à l'autre. Le fermer démonte l'iframe et coupe le son.
 */
export function WidgetDirect() {
  const { widgetOuvert } = useLecteur()
  if (!widgetOuvert) return null
  return (
    <div
      role="dialog"
      aria-label="Lecteur du direct Radio Tripoint"
      className="fondu border-nuit-trait bg-nuit shadow-2 fixed right-3 bottom-[calc(var(--barre-lecteur)+0.75rem+env(safe-area-inset-bottom))] z-50 w-[min(300px,calc(100vw-1.5rem))] overflow-hidden border"
    >
      <div className="text-nuit-encre flex items-center justify-between gap-2 px-3 py-2">
        <p className="surtitre flex items-center gap-2">
          <span className="point-direct" data-actif="true" />
          En direct
        </p>
        <button
          type="button"
          onClick={fermerWidget}
          aria-label="Fermer le lecteur et couper le direct"
          data-controle-lecteur
          className="hover:bg-nuit-3 grid size-8 place-items-center rounded-full"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      <iframe
        src={radioConfig.widgetUrl}
        title="Lecteur Radioking — Radio Tripoint en direct"
        allow="autoplay"
        className="block h-[365px] w-full border-0 bg-white"
      />
    </div>
  )
}
