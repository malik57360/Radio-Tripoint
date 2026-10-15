import { Droplets, Wind } from "lucide-react"
import { IconeCiel } from "@/components/meteo/IconeCiel"
import { EtatVide } from "@/components/ui/EtatVide"
import { PageHero } from "@/components/ui/PageHero"
import { jourParis } from "@/lib/direction/redis"
import { choisir, type Trad } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"
import { ciel, LIBELLES_CIEL, LIEUX, previsions } from "@/lib/meteo"
import { metadataPage } from "@/lib/seo/metadata"
import { dateLongue, nomJour } from "@/lib/utils/dates"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Météo des Trois Frontières : Sierck, Thionville, Metz, Luxembourg, Sarre",
      de: "Wetter im Dreiländereck: Sierck, Thionville, Metz, Luxemburg, Saarland",
      lb: "Wieder am Dräilännereck: Sierck, Diddenuewen, Metz, Lëtzebuerg, Saarland",
      en: "Three Borders weather: Sierck, Thionville, Metz, Luxembourg, Saarland",
      es: "El tiempo en las Tres Fronteras: Sierck, Thionville, Metz, Luxemburgo, Sarre",
    },
    description: {
      fr: "La météo du jour et les prévisions à 7 jours entre Moselle, Luxembourg et Sarre, mises à jour toutes les 30 minutes.",
      de: "Das Wetter von heute und die 7-Tage-Vorhersage zwischen Mosel, Luxemburg und Saarland, alle 30 Minuten aktualisiert.",
      lb: "D'Wieder vun haut an d'Previsioune fir 7 Deeg tëscht Musel, Lëtzebuerg a Saarland, all 30 Minutten aktualiséiert.",
      en: "Today's weather and the 7-day forecast between the Moselle, Luxembourg and Saarland, updated every 30 minutes.",
      es: "El tiempo de hoy y la previsión a 7 días entre el Mosela, Luxemburgo y el Sarre, actualizada cada 30 minutos.",
    },
    chemin: "/meteo",
  })

// Les prévisions sont relues toutes les 30 minutes (cache d'Open-Meteo dans lib/meteo).
export const revalidate = 1800

const PAYS: Record<(typeof LIEUX)[number]["pays"], Trad> = {
  FR: { fr: "France", de: "Frankreich", lb: "Frankräich", en: "France", es: "Francia" },
  LU: { fr: "Luxembourg", de: "Luxemburg", lb: "Lëtzebuerg", en: "Luxembourg", es: "Luxemburgo" },
  DE: { fr: "Allemagne", de: "Deutschland", lb: "Däitschland", en: "Germany", es: "Alemania" },
}

const r = (n: number) => Math.round(n)

export default async function PageMeteo() {
  const t = await traducteur()
  const l = t.langue
  const liste = await previsions().catch((e) => {
    console.error("[meteo] prévisions indisponibles :", (e as Error).message)
    return null
  })
  const midi = `${jourParis()}T12:00:00Z`

  return (
    <>
      <PageHero
        miettes={[
          {
            nom: t({ fr: "Météo", de: "Wetter", lb: "Wieder", en: "Weather", es: "El tiempo" }),
            chemin: "/meteo",
          },
        ]}
        surtitre={t({
          fr: "Météo des Trois Frontières",
          de: "Wetter im Dreiländereck",
          lb: "Wieder am Dräilännereck",
          en: "Three Borders weather",
          es: "El tiempo en las Tres Fronteras",
        })}
        titre={t({ fr: "Météo", de: "Wetter", lb: "Wieder", en: "Weather", es: "El tiempo" })}
        intro={
          <>
            <span className="inline-block first-letter:uppercase">
              {nomJour(midi, l)} {dateLongue(midi, l)}
            </span>
            {". "}
            {t({
              fr: "Le temps qu'il fait et les prévisions à 7 jours, de la Moselle au Luxembourg et à la Sarre.",
              de: "Das aktuelle Wetter und die 7-Tage-Vorhersage, von der Mosel bis nach Luxemburg und ins Saarland.",
              lb: "D'Wieder elo an d'Previsioune fir 7 Deeg, vun der Musel bis op Lëtzebuerg an d'Saarland.",
              en: "The weather now and the 7-day forecast, from the Moselle to Luxembourg and Saarland.",
              es: "El tiempo actual y la previsión a 7 días, del Mosela a Luxemburgo y el Sarre.",
            })}
          </>
        }
      />

      <section className="conteneur py-12 lg:py-16">
        {!liste ? (
          <EtatVide
            titre={t({
              fr: "Prévisions indisponibles pour le moment.",
              de: "Vorhersage derzeit nicht verfügbar.",
              lb: "Previsiounen de Moment net disponibel.",
              en: "Forecast unavailable at the moment.",
              es: "Previsión no disponible por el momento.",
            })}
          >
            {t({
              fr: "Le service météo ne répond pas. Revenez dans quelques minutes.",
              de: "Der Wetterdienst antwortet nicht. Schauen Sie in ein paar Minuten wieder vorbei.",
              lb: "De Wiederdéngscht äntwert net. Kuckt an e puer Minutten nach eng Kéier eran.",
              en: "The weather service is not responding. Please check back in a few minutes.",
              es: "El servicio meteorológico no responde. Vuelva dentro de unos minutos.",
            })}
          </EtatVide>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {LIEUX.map((lieu, i) => {
              const p = liste[i]
              const c = p?.current
              const d = p?.daily
              const nom = "noms" in lieu ? choisir(lieu.noms, l) : lieu.nom
              return (
                <li
                  key={lieu.nom}
                  className="bg-surface border-trait flex flex-col border p-5 sm:p-6"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="titre-carte text-[1.35rem]">{nom}</h2>
                    <span className="surtitre text-encre-3 shrink-0">{t(PAYS[lieu.pays])}</span>
                  </div>
                  {c ? (
                    <div className="mt-4 flex items-center gap-4">
                      <IconeCiel
                        ciel={ciel(c.weather_code)}
                        nuit={c.is_day === 0}
                        className="size-14 shrink-0"
                      />
                      <div>
                        <p className="titre-affiche text-[3rem] leading-none tabular-nums">
                          {r(c.temperature_2m)}°
                        </p>
                        <p className="text-encre-2 mt-1 font-semibold">
                          {t(LIBELLES_CIEL[ciel(c.weather_code)])}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-encre-3 mt-4 text-sm">
                      {t({
                        fr: "Relevé indisponible.",
                        de: "Messwert nicht verfügbar.",
                        lb: "Moosswäert net disponibel.",
                        en: "Reading unavailable.",
                        es: "Dato no disponible.",
                      })}
                    </p>
                  )}
                  {d && d.time.length > 0 && (
                    <>
                      <p className="text-encre-2 mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span>
                          {t({
                            fr: "Aujourd'hui",
                            de: "Heute",
                            lb: "Haut",
                            en: "Today",
                            es: "Hoy",
                          })}{" "}
                          <strong className="text-encre tabular-nums">
                            {r(d.temperature_2m_min[0])}° / {r(d.temperature_2m_max[0])}°
                          </strong>
                        </span>
                        {d.precipitation_probability_max[0] != null && (
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Droplets className="size-4" aria-hidden />
                            <span className="sr-only">
                              {t({
                                fr: "Risque de pluie",
                                de: "Regenrisiko",
                                lb: "Reerisiko",
                                en: "Chance of rain",
                                es: "Probabilidad de lluvia",
                              })}
                            </span>
                            {d.precipitation_probability_max[0]} %
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Wind className="size-4" aria-hidden />
                          <span className="sr-only">
                            {t({ fr: "Vent", de: "Wind", lb: "Wand", en: "Wind", es: "Viento" })}
                          </span>
                          {r(d.wind_speed_10m_max[0])} km/h
                        </span>
                      </p>
                      <ul className="divide-trait border-trait mt-4 divide-y border-t">
                        {d.time.slice(1).map((jour, k) => {
                          const j = k + 1
                          const ce = ciel(d.weather_code[j])
                          const pluie = d.precipitation_probability_max[j]
                          return (
                            <li key={jour} className="flex items-center gap-3 py-2 text-sm">
                              <span className="w-28 shrink-0 font-semibold">
                                <span className="inline-block first-letter:uppercase">
                                  {j === 1
                                    ? t({
                                        fr: "demain",
                                        de: "Morgen",
                                        lb: "Muer",
                                        en: "Tomorrow",
                                        es: "mañana",
                                      })
                                    : nomJour(`${jour}T12:00:00Z`, l)}
                                </span>
                              </span>
                              <IconeCiel ciel={ce} className="size-5 shrink-0" />
                              <span className="sr-only">{t(LIBELLES_CIEL[ce])}</span>
                              <span className="text-encre-3 ml-auto tabular-nums">
                                {pluie != null && pluie >= 20 ? `${pluie} %` : ""}
                              </span>
                              <span className="w-20 shrink-0 text-right tabular-nums">
                                <strong>{r(d.temperature_2m_max[j])}°</strong>{" "}
                                <span className="text-encre-3">{r(d.temperature_2m_min[j])}°</span>
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        )}
        <p className="text-encre-3 mt-8 max-w-2xl text-sm">
          {t({
            fr: "Prévisions",
            de: "Vorhersage:",
            lb: "Previsiounen:",
            en: "Forecast by",
            es: "Previsión de",
          })}{" "}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener" className="underline">
            Open-Meteo
          </a>{" "}
          (
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener"
            className="underline"
          >
            CC BY 4.0
          </a>
          ).{" "}
          {t({
            fr: "Mises à jour toutes les 30 minutes ; elles peuvent évoluer, vérifiez avant une sortie.",
            de: "Alle 30 Minuten aktualisiert; sie können sich ändern, prüfen Sie vor einem Ausflug.",
            lb: "All 30 Minutten aktualiséiert; si kënne sech änneren, kuckt nach eng Kéier virun engem Ausfluch.",
            en: "Updated every 30 minutes; forecasts can change, so check again before heading out.",
            es: "Actualizada cada 30 minutos; puede cambiar, compruébela antes de salir.",
          })}
        </p>
      </section>
    </>
  )
}
