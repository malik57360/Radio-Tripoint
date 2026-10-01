"use client"

import { MapPin, Navigation } from "lucide-react"
import { useState } from "react"
import { useT } from "@/components/i18n/Langue"
import { adresseLigne, site } from "@/config/site"

/**
 * Plan Google Maps de l'adresse de la radio. Google dépose des cookies :
 * la carte ne se charge qu'après un clic du visiteur (consentement par
 * l'action), jamais d'office.
 */
export function CarteContact() {
  const [afficher, setAfficher] = useState(false)
  const t = useT()
  const requete = encodeURIComponent(adresseLigne)
  return (
    <div className="border-trait relative aspect-[4/3] w-full overflow-hidden border sm:aspect-[16/9]">
      {afficher ? (
        <iframe
          src={`https://maps.google.com/maps?q=${requete}&z=16&output=embed&hl=${t.langue === "lb" ? "de" : t.langue}`}
          title={`${t({ fr: "Plan", de: "Karte", lb: "Kaart", en: "Map", es: "Plano" })} : ${adresseLigne}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="bg-nuit text-nuit-encre absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <MapPin size={32} className="text-nuit-accent" aria-hidden />
          <p className="titre-carte text-lg">
            {t(site.contact.adresse.lieu)}, {site.contact.adresse.rue}
            <br />
            {site.contact.adresse.codePostal} {site.contact.adresse.ville}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setAfficher(true)} className="btn btn-accent">
              {t({
                fr: "Afficher le plan",
                de: "Karte anzeigen",
                lb: "Kaart weisen",
                en: "Show map",
                es: "Mostrar el plano",
              })}
            </button>
            <a
              href={site.contact.itineraire}
              target="_blank"
              rel="noopener"
              className="btn btn-nuit"
            >
              <Navigation className="size-4" aria-hidden />{" "}
              {t({ fr: "Itinéraire", de: "Route", lb: "Wee", en: "Directions", es: "Cómo llegar" })}
            </a>
          </div>
          <p className="text-nuit-encre-2 max-w-sm text-xs">
            {t({
              fr: "Le plan est fourni par Google Maps, qui peut déposer des cookies. Il ne se charge que si vous cliquez.",
              de: "Die Karte stammt von Google Maps, das Cookies setzen kann. Sie wird nur geladen, wenn Sie klicken.",
              lb: "D'Kaart kënnt vu Google Maps, dat Cookie setze kann. Si gëtt eréischt gelueden, wann Dir klickt.",
              en: "The map is provided by Google Maps, which may set cookies. It only loads if you click.",
              es: "El plano lo proporciona Google Maps, que puede instalar cookies. Solo se carga si hace clic.",
            })}
          </p>
        </div>
      )}
    </div>
  )
}
