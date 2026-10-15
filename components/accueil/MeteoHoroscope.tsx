import { ArrowRight, Sparkles } from "lucide-react"
import { IconeCiel } from "@/components/meteo/IconeCiel"
import Link from "@/components/ui/Lien"
import { SIGNES } from "@/lib/horoscope"
import { traducteur } from "@/lib/i18n/serveur"
import { ciel, LIBELLES_CIEL, LIEUX, previsions } from "@/lib/meteo"

/**
 * Accueil : la météo du jour à Sierck-les-Bains (minimum, maximum, ciel : ce
 * qui ne vieillit pas dans la journée) et l'entrée vers l'horoscope.
 */
export async function MeteoHoroscope() {
  const t = await traducteur()
  const d = await previsions()
    .then((l) => l[0]?.daily)
    .catch(() => undefined)
  const ce = d ? ciel(d.weather_code[0]) : null

  return (
    <section
      aria-label={t({
        fr: "Météo et horoscope",
        de: "Wetter und Horoskop",
        lb: "Wieder an Horoskop",
        en: "Weather and horoscope",
        es: "El tiempo y el horóscopo",
      })}
      className="conteneur pt-14 lg:pt-20"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/meteo"
          className="group bg-surface border-trait hover:border-trait-fort flex items-center gap-5 border p-5 sm:p-6"
        >
          <IconeCiel ciel={ce ?? "nuageux"} className="size-14 shrink-0" />
          <div className="min-w-0">
            <p className="surtitre text-accent-encre">
              {t({ fr: "Météo", de: "Wetter", lb: "Wieder", en: "Weather", es: "El tiempo" })} ·{" "}
              {LIEUX[0].nom}
            </p>
            {d && ce ? (
              <p className="titre-carte mt-1 text-[1.35rem]">
                <span className="tabular-nums">
                  {Math.round(d.temperature_2m_min[0])}° / {Math.round(d.temperature_2m_max[0])}°
                </span>{" "}
                <span className="text-encre-2 text-[1rem] font-semibold">
                  {t(LIBELLES_CIEL[ce])}
                </span>
              </p>
            ) : (
              <p className="titre-carte mt-1 text-[1.2rem]">
                {t({
                  fr: "Les prévisions des Trois Frontières",
                  de: "Die Vorhersage für das Dreiländereck",
                  lb: "D'Previsioune fir d'Dräilännereck",
                  en: "The Three Borders forecast",
                  es: "La previsión de las Tres Fronteras",
                })}
              </p>
            )}
            <p className="lien-fleche mt-2 text-sm">
              {t({
                fr: "Prévisions à 7 jours",
                de: "7-Tage-Vorhersage",
                lb: "Previsioune fir 7 Deeg",
                en: "7-day forecast",
                es: "Previsión a 7 días",
              })}
              <ArrowRight className="size-4" aria-hidden />
            </p>
          </div>
        </Link>
        <Link
          href="/horoscope"
          className="group bg-surface border-trait hover:border-trait-fort flex items-center gap-5 border p-5 sm:p-6"
        >
          <span className="bg-accent text-sur-accent grid size-14 shrink-0 place-items-center rounded-full">
            <Sparkles className="size-7" aria-hidden strokeWidth={1.7} />
          </span>
          <div className="min-w-0">
            <p className="surtitre text-accent-encre">
              {t({
                fr: "Horoscope du jour",
                de: "Tageshoroskop",
                lb: "Horoskop vum Dag",
                en: "Daily horoscope",
                es: "Horóscopo del día",
              })}
            </p>
            <p className="titre-carte mt-1 text-[1.2rem]">
              {t({
                fr: "Que vous réservent les astres ?",
                de: "Was sagen die Sterne?",
                lb: "Wat soen d'Stären?",
                en: "What do the stars have in store?",
                es: "¿Qué le deparan los astros?",
              })}
            </p>
            <p aria-hidden className="text-encre-3 mt-2 truncate text-sm tracking-[0.2em]">
              {SIGNES.map((s) => `${s.symbole}︎`).join("")}
            </p>
          </div>
        </Link>
      </div>
    </section>
  )
}
