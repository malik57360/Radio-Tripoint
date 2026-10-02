import { ExternalLink } from "lucide-react"
import { Progression } from "@/components/direction/Progression"
import { Carte, EnTetePage, Etat, Tuile, date, duree, nombre } from "@/components/direction/ui"
import { chargerRadio, chargerTechnique } from "@/lib/direction/alertes"
import { horodatage } from "@/lib/direction/donnees"
import { libelleHeure, nomJour } from "@/lib/radio/grille"
import type { Jour } from "@/types/show"

export const metadata = { title: "Antenne — Direction Radio Tripoint" }

const JOURS: Jour[] = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]

export default async function PageAntenne() {
  const [rad, tech] = await Promise.all([chargerRadio(), chargerTechnique()])
  const maintenant = horodatage()
  const derniereHeure = rad.historique.filter(
    (h) => h.debut && maintenant - Date.parse(h.debut) < 3600_000,
  ).length
  const jourCourant = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
  })
    .format(maintenant)
    .toLowerCase() as Jour

  return (
    <div className="space-y-4">
      <EnTetePage
        titre="Antenne"
        source="Source : RadioKing (flux et titres diffusés) et la grille publiée sur le site"
      >
        <a
          href="https://play.radioking.io/radio-tripoint-la-radio-transfrontaliere"
          target="_blank"
          rel="noopener"
          className="border-trait hover:border-accent inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
        >
          Écouter <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </EnTetePage>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile
          libelle="Flux"
          valeur={rad.flux === "started" ? "En marche" : (rad.flux ?? "Inconnu")}
          detail={`répond en ${nombre(tech.flux.ms)} ms`}
        />
        <Tuile
          libelle="Titres · dernière heure"
          valeur={derniereHeure}
          detail="d'après RadioKing"
        />
        <Tuile
          libelle="Émission en cours"
          valeur={rad.programme ? rad.programme.emission.nom : "Musique"}
          detail={
            rad.programme
              ? `jusqu'à ${libelleHeure(rad.programme.creneau.fin ?? "")}`
              : "aucune émission à la grille"
          }
        />
        <Tuile
          libelle="Prochaine émission"
          valeur={rad.suivant ? rad.suivant.emission.nom : null}
          detail={
            rad.suivant
              ? `${nomJour(rad.suivant.creneau.jour)} à ${libelleHeure(rad.suivant.creneau.debut)}`
              : "aucun horaire publié"
          }
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-[1fr_1.3fr]">
        <Carte titre="Sur les ondes">
          <div className="flex items-center gap-2">
            {rad.flux === "started" ? (
              <span className="inline-flex items-center gap-2 text-sm font-bold">
                <span className="point-direct" aria-hidden /> En direct
              </span>
            ) : (
              <Etat ok={false}>Flux à vérifier</Etat>
            )}
            {rad.enCours?.live && (
              <span className="bg-direct rounded px-1.5 py-0.5 text-[0.65rem] font-bold text-white uppercase">
                Live
              </span>
            )}
          </div>
          {rad.enCours ? (
            <>
              <p className="mt-4 text-2xl leading-tight font-extrabold">{rad.enCours.titre}</p>
              {rad.enCours.artiste && (
                <p className="text-encre-2 mt-1 text-lg">{rad.enCours.artiste}</p>
              )}
              {rad.enCours.debut && rad.enCours.fin && (
                <Progression
                  debut={rad.enCours.debut}
                  fin={rad.enCours.fin}
                  genereLe={maintenant}
                />
              )}
            </>
          ) : (
            <p className="text-encre-3 mt-4 text-sm">Titre en cours indisponible.</p>
          )}
        </Carte>

        <Carte titre="Derniers titres diffusés" note={`${rad.historique.length} titres`}>
          {rad.historique.length ? (
            <ol className="divide-trait max-h-[26rem] divide-y overflow-y-auto pr-1 text-sm">
              {rad.historique.map((h, i) => (
                <li key={`${h.debut}-${i}`} className="flex items-baseline gap-3 py-2">
                  <span className="text-encre-3 w-11 flex-none tabular-nums">
                    {h.debut ? date(h.debut, { hour: "2-digit", minute: "2-digit" }) : "—"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{h.titre}</span>
                    {h.artiste && <span className="text-encre-3 block truncate">{h.artiste}</span>}
                  </span>
                  {h.duree ? (
                    <span className="text-encre-3 flex-none text-xs">{duree(h.duree)}</span>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-encre-3 text-sm">Historique indisponible.</p>
          )}
        </Carte>
      </div>

      <Carte titre="Grille de la semaine" note="telle que publiée sur le site">
        <div className="grid gap-px overflow-hidden rounded-lg sm:grid-cols-7">
          {JOURS.map((j) => {
            const creneaux = rad.grille
              .flatMap((e) => e.creneaux.filter((c) => c.jour === j).map((c) => ({ e, c })))
              .sort((a, b) => a.c.debut.localeCompare(b.c.debut))
            return (
              <div key={j} className={j === jourCourant ? "bg-accent-doux p-3" : "bg-carte-2 p-3"}>
                <p className={j === jourCourant ? "surtitre text-accent" : "surtitre"}>
                  {nomJour(j)}
                  {j === jourCourant && " · aujourd'hui"}
                </p>
                {creneaux.length ? (
                  <ul className="mt-2 space-y-2 text-sm">
                    {creneaux.map(({ e, c }) => (
                      <li key={`${e.slug}-${c.debut}`}>
                        <span className="text-encre-2 tabular-nums">
                          {libelleHeure(c.debut)}
                          {c.fin && `–${libelleHeure(c.fin)}`}
                        </span>
                        <span className="block font-semibold">{e.nom}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-encre-3 mt-2 text-sm">Musique</p>
                )}
              </div>
            )
          })}
        </div>
        <p className="text-encre-3 mt-3 text-xs">
          Émissions sans horaire publié :{" "}
          {rad.grille
            .filter((e) => e.creneaux.length === 0)
            .map((e) => e.nom)
            .join(", ") || "aucune"}
          .
        </p>
      </Carte>
    </div>
  )
}
