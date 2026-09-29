"use client"

import { MapPin, Navigation } from "lucide-react"
import { useState } from "react"
import { adresseLigne, site } from "@/config/site"

/**
 * Plan Google Maps de l'adresse de la radio. Google dépose des cookies :
 * la carte ne se charge qu'après un clic du visiteur (consentement par
 * l'action), jamais d'office.
 */
export function CarteContact() {
  const [afficher, setAfficher] = useState(false)
  const requete = encodeURIComponent(adresseLigne)
  return (
    <div className="border-trait relative aspect-[4/3] w-full overflow-hidden border sm:aspect-[16/9]">
      {afficher ? (
        <iframe
          src={`https://maps.google.com/maps?q=${requete}&z=16&output=embed`}
          title={`Plan : ${adresseLigne}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="bg-nuit text-nuit-encre absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <MapPin size={32} className="text-nuit-accent" aria-hidden />
          <p className="titre-carte text-lg">
            {site.contact.adresse.lieu}, {site.contact.adresse.rue}
            <br />
            {site.contact.adresse.codePostal} {site.contact.adresse.ville}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setAfficher(true)} className="btn btn-accent">
              Afficher le plan
            </button>
            <a
              href={site.contact.itineraire}
              target="_blank"
              rel="noopener"
              className="btn btn-nuit"
            >
              <Navigation className="size-4" aria-hidden /> Itinéraire
            </a>
          </div>
          <p className="text-nuit-encre-2 max-w-sm text-xs">
            Le plan est fourni par Google Maps, qui peut déposer des cookies. Il ne se charge que si
            vous cliquez.
          </p>
        </div>
      )}
    </div>
  )
}
