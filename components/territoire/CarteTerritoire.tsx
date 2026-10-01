import { ExternalLink } from "lucide-react"
import { traducteur } from "@/lib/i18n/serveur"

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

export async function CarteTerritoire() {
  const t = await traducteur()
  return (
    <figure>
      <div className="border-accent bg-nuit-2 relative aspect-[4/3] w-full overflow-hidden border-4 sm:aspect-square">
        <iframe
          src={src}
          title={t({
            fr: "Carte des Trois Frontières : France, Luxembourg et Allemagne autour du tripoint de Schengen",
            de: "Karte des Dreiländerecks: Frankreich, Luxemburg und Deutschland rund um das Dreiländereck bei Schengen",
            lb: "Kaart vum Dräilännereck: Frankräich, Lëtzebuerg an Däitschland ronderëm den Dräilännerpunkt vu Schengen",
            en: "Map of the Three Borders: France, Luxembourg and Germany around the Schengen tripoint",
            es: "Mapa de las Tres Fronteras: Francia, Luxemburgo y Alemania alrededor del trifinio de Schengen",
          })}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <figcaption className="text-nuit-encre-2 mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span>
          {t({
            fr: "Le tripoint de Schengen, où se rejoignent la France, le Luxembourg et l'Allemagne.",
            de: "Das Dreiländereck bei Schengen, wo Frankreich, Luxemburg und Deutschland aufeinandertreffen.",
            lb: "Den Dräilännerpunkt vu Schengen, wou Frankräich, Lëtzebuerg an Däitschland openeentreffen.",
            en: "The Schengen tripoint, where France, Luxembourg and Germany meet.",
            es: "El trifinio de Schengen, donde se unen Francia, Luxemburgo y Alemania.",
          })}
        </span>
        <a
          href={lien}
          target="_blank"
          rel="noopener"
          className="text-nuit-accent inline-flex items-center gap-1 font-semibold hover:underline"
        >
          {t({
            fr: "Agrandir la carte",
            de: "Karte vergrößern",
            lb: "Kaart vergréisseren",
            en: "Enlarge the map",
            es: "Ampliar el mapa",
          })}{" "}
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </figcaption>
    </figure>
  )
}
