import { ExternalLink } from "lucide-react"

/**
 * Vraie carte (OpenStreetMap) des Trois Frontières, repère sur le tripoint
 * de Schengen (49,4697 N · 6,3672 E). Chargée dans le navigateur du
 * visiteur, en différé : elle ne pèse pas sur l'affichage de la page.
 * OpenStreetMap ne dépose pas de cookie publicitaire.
 */
const TRIPOINT = { lat: 49.4697, lon: 6.3672 }
// Cadre : de Thionville (sud-ouest) à Luxembourg-Ville (nord) et Merzig (est).
const CADRE = { ouest: 6.1, sud: 49.33, est: 6.66, nord: 49.63 }

const src = `https://www.openstreetmap.org/export/embed.html?bbox=${CADRE.ouest}%2C${CADRE.sud}%2C${CADRE.est}%2C${CADRE.nord}&layer=mapnik&marker=${TRIPOINT.lat}%2C${TRIPOINT.lon}`
const lien = `https://www.openstreetmap.org/?mlat=${TRIPOINT.lat}&mlon=${TRIPOINT.lon}#map=11/${TRIPOINT.lat}/${TRIPOINT.lon}`

export function CarteTerritoire() {
  return (
    <figure>
      <div className="border-accent bg-nuit-2 relative aspect-square w-full overflow-hidden border-4">
        <iframe
          src={src}
          title="Carte des Trois Frontières : France, Luxembourg et Allemagne autour du tripoint de Schengen"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <figcaption className="text-nuit-encre-2 mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span>
          Le tripoint de Schengen, où se rejoignent la France, le Luxembourg et l&apos;Allemagne.
        </span>
        <a
          href={lien}
          target="_blank"
          rel="noopener"
          className="text-nuit-accent inline-flex items-center gap-1 font-semibold hover:underline"
        >
          Agrandir la carte <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </figcaption>
    </figure>
  )
}
