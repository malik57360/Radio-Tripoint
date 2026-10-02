import { Histogramme } from "@/components/direction/Histogramme"
import { Barres, Carte, EnTetePage, Tuile, date, nombre, nomPays } from "@/components/direction/ui"
import { chargerContenu } from "@/lib/direction/alertes"

export const metadata = { title: "Contenu — Direction Radio Tripoint" }

export default async function PageContenu() {
  const c = await chargerContenu()
  return (
    <div className="space-y-4">
      <EnTetePage titre="Contenu publié" source="Ce qui est en ligne sur le site en ce moment" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Tuile
          accent
          libelle="Articles"
          valeur={c.articles.total}
          detail={`${c.articles.semaine} cette semaine · ${c.articles.mois} en 30 j`}
        />
        <Tuile
          libelle="Podcasts"
          valeur={c.podcasts.total}
          detail={`${c.podcasts.heures.toLocaleString("fr-FR")} h d'écoute`}
        />
        <Tuile libelle="Émissions" valeur={c.emissions} />
        <Tuile
          libelle="Événements à venir"
          valeur={c.evenements.aVenir}
          detail={`${c.evenements.semaine} dans les 7 jours`}
        />
        <Tuile
          libelle="Partenaires affichés"
          valeur={c.partenaires}
          detail="« Ils nous font confiance »"
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        <Carte
          titre="Articles publiés par semaine"
          note={`12 semaines · ${c.articles.dates} articles datés sur ${c.articles.total}`}
        >
          <Histogramme
            unite="articles"
            pas={2}
            hauteur={150}
            enCours
            points={c.articles.parSemaine.map((s) => ({
              cle: String(s.debut),
              etiquette: date(s.debut, { day: "numeric", month: "short" }),
              valeur: s.n,
              detail: `semaine du ${date(s.debut, { day: "numeric", month: "long" })}`,
            }))}
          />
        </Carte>
        <Carte titre="Articles par rubrique">
          <Barres lignes={c.articles.parCategorie} />
        </Carte>
      </div>

      <Carte titre="Derniers articles" note="les 15 plus récents">
        <ul className="divide-trait divide-y text-sm">
          {c.articles.derniers.map((a) => (
            <li key={a.slug} className="flex items-baseline gap-3 py-2">
              <span className="text-encre-3 w-16 flex-none text-xs">
                {a.date ? date(a.date, { day: "numeric", month: "short" }) : "—"}
              </span>
              <a
                href={`/actualites/${a.slug}`}
                target="_blank"
                rel="noopener"
                className="hover:text-accent min-w-0 flex-1 truncate font-semibold"
              >
                {a.titre}
              </a>
              <span className="bg-accent-doux text-accent flex-none rounded px-1.5 py-0.5 text-[0.7rem] font-bold">
                {a.categorie}
              </span>
            </li>
          ))}
        </ul>
      </Carte>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        <Carte titre="Agenda à venir" note={`${c.evenements.aVenir} événements`}>
          {c.evenements.prochains.length ? (
            <ul className="divide-trait divide-y text-sm">
              {c.evenements.prochains.map((e) => (
                <li key={`${e.titre}-${e.debut}`} className="flex items-baseline gap-3 py-2">
                  <span className="text-accent w-16 flex-none font-bold">
                    {date(e.debut, { day: "numeric", month: "short" })}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{e.titre}</span>
                    <span className="text-encre-3 block text-xs">
                      {e.ville} · {nomPays(e.pays)}
                      {!e.journee && ` · ${date(e.debut, { hour: "2-digit", minute: "2-digit" })}`}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-encre-3 text-sm">Aucun événement à venir à l&apos;agenda.</p>
          )}
        </Carte>
        <Carte titre="Podcasts par émission">
          <Barres lignes={c.podcasts.parEmission} unite="ép." />
          <p className="text-encre-3 mt-4 text-xs">
            {nombre(c.podcasts.total)} épisodes, {c.podcasts.heures.toLocaleString("fr-FR")} heures
            au total.
          </p>
        </Carte>
      </div>
    </div>
  )
}
