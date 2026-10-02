import { EnLigneMini } from "@/components/direction/Direct"
import { Histogramme } from "@/components/direction/Histogramme"
import {
  Carte,
  CarteLien,
  EnTetePage,
  Etat,
  Evolution,
  Tuile,
  date,
  libellePage,
  nombre,
} from "@/components/direction/ui"
import {
  chargerAlertes,
  chargerAudience,
  chargerContenu,
  chargerDirect,
  chargerEngagement,
  chargerRadio,
  chargerTechnique,
} from "@/lib/direction/alertes"
import { libelleHeure } from "@/lib/radio/grille"

export const metadata = { title: "Vue d'ensemble — Direction Radio Tripoint" }

/** Ce qu'il faut savoir en dix secondes, avec un lien vers chaque page. */
export default async function VueEnsemble() {
  const [alertes, aud, dir, rad, cont, eng, tech] = await Promise.all([
    chargerAlertes(),
    chargerAudience(30),
    chargerDirect(),
    chargerRadio(),
    chargerContenu(),
    chargerEngagement(),
    chargerTechnique(),
  ])
  const audOk = aud && !aud.erreur ? aud : null
  const engOk = eng && !eng.erreur ? eng : null

  return (
    <div className="space-y-6">
      <EnTetePage
        titre="Vue d'ensemble"
        source="L'essentiel de toutes les pages · chaque chiffre mène à son détail"
      />

      {/* Alertes */}
      <div className="space-y-2">
        {alertes.length === 0 ? (
          <Carte>
            <Etat ok>Tout fonctionne : site, antenne, formulaires et mesures.</Etat>
          </Carte>
        ) : (
          alertes.map((a) => (
            <a
              key={a.texte}
              href={`/direction/${a.page}`}
              className="border-alerte/40 bg-carte hover:border-alerte block rounded-xl border px-4 py-3"
            >
              <Etat ok={false}>{a.texte}</Etat>
            </a>
          ))
        )}
      </div>

      {/* Les chiffres du moment */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="col-span-2 lg:col-span-1">
          {dir ? (
            <EnLigneMini initial={dir} />
          ) : (
            <Tuile
              libelle="Visiteurs cette heure-ci"
              valeur={audOk?.heureCourante?.visiteurs ?? null}
              detail="compteur en direct à activer"
            />
          )}
        </div>
        <Tuile
          accent
          libelle="Visiteurs aujourd'hui"
          valeur={audOk?.aujourdhui.visiteurs ?? null}
          detail={
            audOk ? (
              <>
                {nombre(audOk.aujourdhui.pages)} pages · hier{" "}
                {audOk.veille ? nombre(audOk.veille.visiteurs) : "—"}
              </>
            ) : undefined
          }
        />
        <Tuile
          libelle="7 derniers jours"
          valeur={audOk?.semaine?.visiteurs ?? null}
          evolution={
            audOk?.semaine && (
              <Evolution
                actuel={audOk.semaine.visiteurs}
                precedent={audOk.semainePrec?.visiteurs ?? null}
              />
            )
          }
          detail="visiteurs"
        />
        <Tuile
          libelle="30 derniers jours"
          valeur={audOk?.mois?.visiteurs ?? null}
          evolution={
            audOk?.mois && (
              <Evolution
                actuel={audOk.mois.visiteurs}
                precedent={audOk.moisPrec?.visiteurs ?? null}
              />
            )
          }
          detail="visiteurs"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <Carte titre="À l'antenne">
          <div className="flex items-center gap-2 text-sm font-bold">
            {rad.flux === "started" ? (
              <>
                <span className="point-direct" aria-hidden /> Flux en marche
              </>
            ) : (
              <Etat ok={false}>Flux à vérifier</Etat>
            )}
          </div>
          <p className="mt-3 text-xl leading-tight font-extrabold">
            {rad.enCours?.titre ?? "Titre indisponible"}
          </p>
          {rad.enCours?.artiste && <p className="text-encre-2 mt-1">{rad.enCours.artiste}</p>}
          <p className="text-encre-3 mt-4 text-xs">
            {rad.programme
              ? `Émission : ${rad.programme.emission.nom}`
              : rad.suivant
                ? `Prochaine émission : ${rad.suivant.emission.nom} à ${libelleHeure(rad.suivant.creneau.debut)}`
                : "Programmation musicale"}
          </p>
        </Carte>
        <Carte titre="Visiteurs par jour" note="30 jours · Vercel">
          {audOk ? (
            <Histogramme
              unite="visiteurs"
              pas={7}
              hauteur={130}
              enCours
              points={audOk.parJour.map((p) => ({
                cle: p.cle,
                etiquette: date(p.cle, { day: "numeric", month: "short" }),
                valeur: p.visiteurs,
                detail: date(p.cle, { weekday: "long", day: "numeric", month: "long" }),
              }))}
            />
          ) : (
            <p className="text-encre-3 text-sm">Statistiques indisponibles.</p>
          )}
        </Carte>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <CarteLien
          href="/direction/audience"
          titre="Page n°1"
          valeur={audOk?.pages[0] ? nombre(audOk.pages[0].pages) : "—"}
          detail={audOk?.pages[0] ? libellePage(audOk.pages[0].cle) : "30 jours"}
        />
        <CarteLien
          href="/direction/engagement"
          titre="Écoutes du direct"
          valeur={engOk ? nombre(engOk.totaux.direct7) : "—"}
          detail="7 derniers jours"
        />
        <CarteLien
          href="/direction/engagement"
          titre="Questions à Tripo"
          valeur={engOk ? nombre(engOk.totaux.tripo7) : "—"}
          detail="7 derniers jours"
        />
        <CarteLien
          href="/direction/contenu"
          titre="Articles"
          valeur={nombre(cont.articles.semaine)}
          detail="publiés cette semaine"
        />
        <CarteLien
          href="/direction/contenu"
          titre="Agenda"
          valeur={nombre(cont.evenements.semaine)}
          detail="événements dans 7 jours"
        />
        <CarteLien
          href="/direction/technique"
          titre="Site"
          valeur={tech.site.ok ? "En ligne" : "Problème"}
          detail={`réponse en ${nombre(tech.site.ms)} ms`}
        />
      </div>
    </div>
  )
}
