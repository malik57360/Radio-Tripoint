import { DemandeHoroscope } from "@/components/horoscope/DemandeHoroscope"
import { EtatVide } from "@/components/ui/EtatVide"
import { PageHero } from "@/components/ui/PageHero"
import { jourParis } from "@/lib/direction/redis"
import { horoscopeAffiche, SIGNES } from "@/lib/horoscope"
import { choisir } from "@/lib/i18n/langues"
import { traducteur } from "@/lib/i18n/serveur"
import { metadataPage } from "@/lib/seo/metadata"
import { dateLongue, jourMois, nomJour } from "@/lib/utils/dates"

export const generateMetadata = () =>
  metadataPage({
    titre: {
      fr: "Horoscope du jour : les douze signes",
      de: "Tageshoroskop: die zwölf Sternzeichen",
      lb: "Horoskop vum Dag: déi zwielef Stärzeechen",
      en: "Daily horoscope: all twelve signs",
      es: "Horóscopo del día: los doce signos",
    },
    description: {
      fr: "L'horoscope du jour de Radio Tripoint pour les douze signes, à lire pour le plaisir.",
      de: "Das Tageshoroskop von Radio Tripoint für alle zwölf Sternzeichen, zum Vergnügen.",
      lb: "D'Horoskop vum Dag vu Radio Tripoint fir déi zwielef Stärzeechen, fir de Spaass.",
      en: "Radio Tripoint's daily horoscope for all twelve signs, just for fun.",
      es: "El horóscopo del día de Radio Tripoint para los doce signos, para leer por diversión.",
    },
    chemin: "/horoscope",
  })

// Relu toutes les 10 minutes ; rafraîchi tout de suite quand un nouvel horoscope est écrit.
export const revalidate = 600

export default async function PageHoroscope() {
  const t = await traducteur()
  const l = t.langue
  const aujourdhui = jourParis()
  const affiche = await horoscopeAffiche()
  const textes = affiche ? (affiche.h.langues[l] ?? affiche.h.langues.fr) : null
  const midi = `${affiche?.h.jour ?? aujourdhui}T12:00:00Z`
  // Pas encore l'horoscope du jour (ou pas encore dans cette langue) : on le demande.
  const aDemander = !affiche?.duJour || !affiche.h.langues[l]

  return (
    <>
      <PageHero
        miettes={[
          {
            nom: t({
              fr: "Horoscope",
              de: "Horoskop",
              lb: "Horoskop",
              en: "Horoscope",
              es: "Horóscopo",
            }),
            chemin: "/horoscope",
          },
        ]}
        surtitre={t({
          fr: "Pour le plaisir",
          de: "Zum Vergnügen",
          lb: "Fir de Spaass",
          en: "Just for fun",
          es: "Por diversión",
        })}
        titre={t({
          fr: "Horoscope du jour",
          de: "Tageshoroskop",
          lb: "Horoskop vum Dag",
          en: "Daily horoscope",
          es: "Horóscopo del día",
        })}
        intro={
          affiche ? (
            <span className="inline-block first-letter:uppercase">
              {nomJour(midi, l)} {dateLongue(midi, l)}
            </span>
          ) : undefined
        }
      />
      {aDemander && <DemandeHoroscope jour={aujourdhui} />}

      <section className="conteneur py-12 lg:py-16">
        {affiche && !affiche.duJour && (
          <p role="status" className="bg-accent-doux mb-6 px-4 py-3 text-sm font-semibold">
            {t({
              fr: "L'horoscope du jour arrive dans quelques minutes : voici celui d'hier.",
              de: "Das heutige Horoskop kommt in wenigen Minuten: Hier ist das von gestern.",
              lb: "D'Horoskop vun haut kënnt an e puer Minutten: Hei ass dat vu gëschter.",
              en: "Today's horoscope is on its way: here is yesterday's.",
              es: "El horóscopo de hoy llega en unos minutos: aquí está el de ayer.",
            })}
          </p>
        )}
        {!textes ? (
          <EtatVide
            titre={t({
              fr: "L'horoscope du jour est en préparation.",
              de: "Das Tageshoroskop wird vorbereitet.",
              lb: "D'Horoskop vum Dag gëtt preparéiert.",
              en: "Today's horoscope is being prepared.",
              es: "El horóscopo del día se está preparando.",
            })}
          >
            {t({
              fr: "Revenez dans quelques minutes : les astres s'alignent.",
              de: "Schauen Sie in ein paar Minuten wieder vorbei: Die Sterne richten sich aus.",
              lb: "Kuckt an e puer Minutten nach eng Kéier eran: d'Stären riichte sech aus.",
              en: "Check back in a few minutes: the stars are aligning.",
              es: "Vuelva dentro de unos minutos: los astros se están alineando.",
            })}
          </EtatVide>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SIGNES.map((s) => (
              <li key={s.id} className="bg-surface border-trait flex flex-col border p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="bg-accent text-sur-accent grid size-12 shrink-0 place-items-center rounded-full text-[1.6rem] leading-none"
                  >
                    {s.symbole}
                    {"︎"}
                  </span>
                  <div>
                    <h2 className="titre-carte text-[1.35rem]">{choisir(s.noms, l)}</h2>
                    <p className="text-encre-3 text-sm">
                      {jourMois(s.du[0], s.du[1], l)} – {jourMois(s.au[0], s.au[1], l)}
                    </p>
                  </div>
                </div>
                <p className="text-encre-2 mt-4 leading-relaxed">{textes[s.id]}</p>
              </li>
            ))}
          </ul>
        )}
        <p className="text-encre-3 mt-8 max-w-2xl text-sm">
          {t({
            fr: "L'horoscope est un divertissement. Il est rédigé chaque jour avec l'aide de l'intelligence artificielle.",
            de: "Das Horoskop dient der Unterhaltung. Es wird jeden Tag mit Hilfe künstlicher Intelligenz verfasst.",
            lb: "D'Horoskop ass fir d'Ënnerhalung. Et gëtt all Dag mat der Hëllef vu kënschtlecher Intelligenz geschriwwen.",
            en: "The horoscope is for entertainment. It is written every day with the help of artificial intelligence.",
            es: "El horóscopo es un entretenimiento. Se redacta cada día con ayuda de la inteligencia artificial.",
          })}
        </p>
      </section>
    </>
  )
}
