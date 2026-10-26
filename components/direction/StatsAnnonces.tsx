import Link from "next/link"
import { Barres, Carte, Tuile, nombre } from "@/components/direction/ui"
import { nomCategorie, type Config } from "@/lib/annonces/config"
import { euros } from "@/lib/annonces/offres"
import type { JourStats, statsDirection } from "@/lib/annonces/stats"

/**
 * Onglet « Statistiques » des Petites annonces : 30 jours, jour par jour.
 * Chaque histogramme montre une seule chose ; le chiffre du jour s'affiche
 * au survol (et se lit dans le titre de la barre au lecteur d'écran).
 */
type Stats = Awaited<ReturnType<typeof statsDirection>>

const PAYS: Record<string, string> = { FR: "France", LU: "Luxembourg", DE: "Allemagne" }

const jourCourt = (j: string) =>
  new Date(`${j}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })

function Histogramme({
  titre,
  jours,
  cle,
  total,
}: {
  titre: string
  jours: JourStats[]
  cle: keyof Omit<JourStats, "jour">
  total: number
}) {
  const max = Math.max(1, ...jours.map((j) => j[cle]))
  return (
    <Carte>
      <div className="flex items-baseline justify-between gap-3">
        <p className="surtitre">{titre}</p>
        <p className="chiffre text-2xl leading-none">{nombre(total)}</p>
      </div>
      <ol className="mt-4 flex h-28 items-end gap-[3px]" aria-label={`${titre}, 30 derniers jours`}>
        {jours.map((j) => (
          <li
            key={j.jour}
            title={`${jourCourt(j.jour)} : ${nombre(j[cle])}`}
            className="group relative flex h-full flex-1 items-end"
          >
            <span
              className="bg-accent block w-full rounded-t-[3px] opacity-85 group-hover:opacity-100"
              style={{ height: `${j[cle] ? Math.max(4, (j[cle] / max) * 100) : 1.5}%` }}
            />
            <span className="sr-only">
              {jourCourt(j.jour)} : {j[cle]}
            </span>
          </li>
        ))}
      </ol>
      <div className="text-encre-3 mt-1.5 flex justify-between text-[0.7rem]">
        <span>{jourCourt(jours[0].jour)}</span>
        <span>Aujourd&apos;hui</span>
      </div>
    </Carte>
  )
}

export function StatsAnnonces({ s, cfg }: { s: Stats; cfg: Config }) {
  const totalRevenus = s.revenus.reduce((t, m) => t + m.centimes, 0)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile libelle="Vues des annonces (30 j)" valeur={s.totaux.vues} />
        <Tuile
          libelle="Comptes"
          valeur={s.comptes.total}
          detail={`${s.comptes.pros} pro · ${s.comptes.confirmes} confirmés · ${s.comptes.bloques} bloqués`}
        />
        <Tuile
          libelle="Discussions (30 j)"
          valeur={s.totaux.discussions}
          detail={`${nombre(s.totaux.messages)} messages`}
        />
        <Tuile
          libelle="Alertes e-mail"
          valeur={s.comptesAvecAlertes}
          detail="comptes qui suivent une recherche"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Histogramme titre="Vues des fiches" jours={s.jours} cle="vues" total={s.totaux.vues} />
        <Histogramme
          titre="Annonces déposées"
          jours={s.jours}
          cle="depots"
          total={s.totaux.depots}
        />
        <Histogramme
          titre="Inscriptions"
          jours={s.jours}
          cle="inscriptions"
          total={s.totaux.inscriptions}
        />
        <Histogramme
          titre="Messages échangés"
          jours={s.jours}
          cle="messages"
          total={s.totaux.messages}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Carte titre="Annonces les plus vues">
          <Barres
            vide="Aucune vue comptée pour l'instant."
            lignes={s.topVues.map(({ a, n, favoris }) => ({
              cle: a.id,
              libelle: (
                <Link href={`/direction/annonces/annonce/${a.id}`} className="hover:underline">
                  {a.titre}
                </Link>
              ),
              n,
              detail: favoris ? `${favoris} ♥` : undefined,
            }))}
            unite="vues"
          />
        </Carte>
        <Carte titre="En ligne, par catégorie">
          <Barres
            vide="Aucune annonce en ligne."
            lignes={s.parCategorie.map((x) => ({
              cle: x.cle,
              libelle: nomCategorie(cfg, x.cle),
              n: x.n,
            }))}
          />
          <div className="mt-5">
            <Barres
              lignes={s.parPays.map((x) => ({ cle: x.cle, libelle: PAYS[x.cle] ?? x.cle, n: x.n }))}
              vide=""
            />
          </div>
        </Carte>
        <Carte titre={`Encaissé sur 12 mois · ${euros(totalRevenus)}`}>
          <Barres
            vide="Aucun paiement pour l'instant."
            lignes={s.revenus
              .filter((m) => m.centimes > 0)
              .map((m) => ({
                cle: m.mois,
                libelle: new Date(`${m.mois}-15T12:00:00`).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                }),
                n: Math.round(m.centimes / 100),
              }))}
            unite="€"
          />
        </Carte>
      </div>
    </div>
  )
}
