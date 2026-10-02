import { Histogramme } from "@/components/direction/Histogramme"
import {
  AActiver,
  Barres,
  Carte,
  EnTetePage,
  Etat,
  Tuile,
  date,
  nombre,
} from "@/components/direction/ui"
import { chargerEngagement } from "@/lib/direction/alertes"
import { formulairesBranches } from "@/lib/direction/donnees"

export const metadata = { title: "Engagement — Direction Radio Tripoint" }

const SERIES = [
  { champ: "visites", titre: "Visites", unite: "visites" },
  { champ: "direct", titre: "Écoutes du direct lancées", unite: "écoutes" },
  { champ: "podcast", titre: "Podcasts lancés", unite: "écoutes" },
  { champ: "tripo", titre: "Questions à Tripo", unite: "questions" },
  { champ: "pic", titre: "Pic de personnes en même temps", unite: "personnes" },
] as const

export default async function PageEngagement() {
  const eng = await chargerEngagement()
  const entete = (
    <EnTetePage
      titre="Engagement"
      source="Compté par le site depuis l'activation du compteur · 30 derniers jours"
    />
  )
  if (!eng)
    return (
      <div>
        {entete}
        <AActiver titre="Compteurs d'engagement à activer">
          Ils s&apos;activent avec la base Redis du compteur en direct.
        </AActiver>
      </div>
    )
  if (eng.erreur)
    return (
      <div>
        {entete}
        <Carte>
          <Etat ok={false}>Le compteur ne répond pas pour le moment.</Etat>
        </Carte>
      </div>
    )

  const t = eng.totaux
  const formulaires = t.contact30 + t.information30 + t.publicite30 + t.newsletter30
  const valeur = (j: (typeof eng.parJour)[number], champ: string) =>
    Number((j as Record<string, unknown>)[champ]) || 0

  return (
    <div className="space-y-4">
      {entete}

      {!formulairesBranches() && (
        <div className="border-alerte/40 bg-carte rounded-xl border px-4 py-3">
          <Etat ok={false}>
            {t.formPerdu30
              ? `Les formulaires ne sont pas branchés : ${nombre(t.formPerdu30)} message${t.formPerdu30 > 1 ? "s" : ""} perdu${t.formPerdu30 > 1 ? "s" : ""} en 30 jours.`
              : "Les formulaires ne sont pas branchés : les messages envoyés ne vous parviennent pas."}{" "}
            Il manque le mot de passe de la boîte mail (SMTP_PASS) sur Vercel.
          </Etat>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile
          accent
          libelle="Écoutes du direct"
          valeur={t.direct30}
          detail={`${nombre(t.direct7)} sur 7 jours`}
        />
        <Tuile
          libelle="Podcasts lancés"
          valeur={t.podcast30}
          detail={`${nombre(t.podcast7)} sur 7 jours`}
        />
        <Tuile
          libelle="Questions à Tripo"
          valeur={t.tripo30}
          detail={`${nombre(t.tripo7)} sur 7 jours`}
        />
        <Tuile
          libelle="Formulaires reçus"
          valeur={formulaires}
          detail={t.formPerdu30 ? `dont ${nombre(t.formPerdu30)} non transmis` : "30 jours"}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {SERIES.map((s) => (
          <Carte key={s.champ} titre={s.titre} note="par jour">
            <Histogramme
              unite={s.unite}
              pas={7}
              hauteur={120}
              enCours
              points={eng.parJour.map((j) => ({
                cle: j.jour,
                etiquette: date(`${j.jour}T12:00:00Z`, { day: "numeric", month: "short" }),
                valeur: valeur(j, s.champ),
                detail: date(`${j.jour}T12:00:00Z`, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }),
              }))}
            />
          </Carte>
        ))}
        <Carte titre="Podcasts les plus lancés" note="depuis l'activation">
          <Barres
            unite="écoutes"
            vide="Aucun podcast lancé pour l'instant."
            lignes={eng.topPodcasts.map((p) => ({ cle: p.slug, libelle: p.titre, n: p.n }))}
          />
        </Carte>
      </div>

      <Carte titre="Formulaires par type" note="30 jours">
        <Barres
          vide="Aucun formulaire reçu."
          lignes={[
            { cle: "contact", libelle: "Contact", n: t.contact30 },
            { cle: "publicite", libelle: "Demandes de publicité", n: t.publicite30 },
            { cle: "information", libelle: "Infos proposées à la rédaction", n: t.information30 },
            { cle: "newsletter", libelle: "Inscriptions newsletter", n: t.newsletter30 },
          ].filter((l) => l.n > 0)}
        />
      </Carte>
    </div>
  )
}
