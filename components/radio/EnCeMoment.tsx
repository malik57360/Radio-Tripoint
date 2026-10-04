"use client"

import { ArrowRight } from "lucide-react"
import { useT } from "@/components/i18n/Langue"
import Link from "@/components/ui/Lien"
import { radioConfig } from "@/config/radioConfig"
import { libelleHeure, nomJour, programmeEnCours, programmeSuivant } from "@/lib/radio/grille"
import { useMaintenant } from "@/lib/radio/horloge"
import type { GrilleClient } from "@/lib/radio/types"
import { useLecteur, useSuiviTitre } from "@/lib/radio/useLecteur"

/**
 * « En ce moment sur Radio Tripoint ». Branché sur la grille des émissions :
 * dès que des créneaux sont renseignés dans data/shows.ts, l'émission à
 * l'antenne et la suivante s'affichent. Sinon, le module reste juste —
 * il ne prétend pas savoir ce qui passe.
 */
export function EnCeMoment({ grille }: { grille: GrilleClient }) {
  const maintenant = useMaintenant()
  const l = useLecteur()
  const t = useT()
  useSuiviTitre()
  const date = maintenant ? new Date(maintenant) : null
  const actuel = date ? programmeEnCours(grille, date, radioConfig.timeZone) : null
  const suivant = date ? programmeSuivant(grille, date, radioConfig.timeZone) : null
  const joue = l.source === "direct" && l.statut === "playing"

  return (
    <section
      aria-labelledby="en-ce-moment"
      className="relative"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="en-ce-moment" className="surtitre text-nuit-encre-2 flex items-center gap-2.5">
          <span className="point-direct" data-actif={joue} />
          {t({
            fr: "En ce moment sur Radio Tripoint",
            de: "Gerade auf Radio Tripoint",
            lb: "Elo op Radio Tripoint",
            en: "Now on Radio Tripoint",
            es: "Ahora en Radio Tripoint",
          })}
        </h2>
        {actuel && (
          <span className="surtitre text-nuit-encre-2 tabular-nums">
            {libelleHeure(actuel.creneau.debut, t.langue)}
            {actuel.creneau.fin && <> — {libelleHeure(actuel.creneau.fin, t.langue)}</>}
          </span>
        )}
      </div>

      <div className="mt-5 min-h-[4.5rem]">
        {actuel ? (
          <>
            <p className="surtitre text-nuit-accent">{actuel.emission.thematique}</p>
            <p className="titre-affiche text-nuit-encre mt-1.5 text-[clamp(1.7rem,1.2rem+2vw,2.4rem)]">
              <Link
                href={`/emissions/${actuel.emission.slug}`}
                className="hover:underline hover:decoration-2 hover:underline-offset-4"
              >
                {actuel.emission.nom}
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="surtitre text-nuit-accent">
              {t({
                fr: "À l'antenne",
                de: "Auf Sendung",
                lb: "Um Sender",
                en: "On air",
                es: "En antena",
              })}
            </p>
            <p className="titre-affiche text-nuit-encre mt-1.5 text-[clamp(1.7rem,1.2rem+2vw,2.4rem)]">
              {radioConfig.radioName}
            </p>
          </>
        )}
        {l.titreEnCours && (
          <p className="text-nuit-encre-2 mt-2 truncate text-sm">
            <span className="sr-only">
              {t({
                fr: "Titre en cours : ",
                de: "Aktueller Titel: ",
                lb: "Aktuellen Titel: ",
                en: "Now playing: ",
                es: "Sonando ahora: ",
              })}
            </span>
            {[l.titreEnCours.artiste, l.titreEnCours.titre].filter(Boolean).join(" — ")}
          </p>
        )}
      </div>

      <div className="border-nuit-trait mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
        {suivant && suivant.emission.slug !== actuel?.emission.slug ? (
          <p className="text-nuit-encre-2 text-sm">
            {t({ fr: "Ensuite", de: "Danach", lb: "Duerno", en: "Up next", es: "A continuación" })}{" "}
            · <span className="text-nuit-encre font-semibold">{suivant.emission.nom}</span>{" "}
            <span className="tabular-nums">
              {nomJour(suivant.creneau.jour, t.langue)}{" "}
              {t({ fr: "à", de: "um", lb: "um", en: "at", es: "a las" })}{" "}
              {libelleHeure(suivant.creneau.debut, t.langue)}
            </span>
          </p>
        ) : (
          <Link href="/emissions" className="lien-fleche text-nuit-encre-2 hover:text-nuit-encre">
            {t({
              fr: "Toutes les émissions",
              de: "Alle Sendungen",
              lb: "All Sendungen",
              en: "All programmes",
              es: "Todos los programas",
            })}{" "}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>
    </section>
  )
}
