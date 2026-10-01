import { LogOut, Radio } from "lucide-react"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { seDeconnecter } from "./actions"
import { Direct } from "@/components/direction/Direct"
import { Histogramme } from "@/components/direction/Histogramme"
import { Horloge } from "@/components/direction/Horloge"
import {
  AActiver,
  Barres,
  Carte,
  Etat,
  Evolution,
  Section,
  Tuile,
  libellePage,
  nombre,
  nomPays,
} from "@/components/direction/ui"
import { estConnecte } from "@/lib/direction/acces"
import {
  audience,
  contenu,
  direct,
  engagement,
  horodatage,
  radio,
  technique,
} from "@/lib/direction/donnees"
import { libelleHeure, nomJour } from "@/lib/radio/grille"

const FUSEAU = "Europe/Paris"
const date = (iso: string | number, options: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString("fr-FR", { timeZone: FUSEAU, ...options })
const duree = (s: number) => {
  const m = Math.round(s / 60)
  return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m} min`
}

const SECTIONS = [
  ["direct", "En direct"],
  ["antenne", "Antenne"],
  ["audience", "Audience"],
  ["engagement", "Engagement"],
  ["contenu", "Contenu"],
  ["technique", "Technique"],
] as const

const APPAREILS: Record<string, string> = {
  mobile: "Téléphone",
  desktop: "Ordinateur",
  tablet: "Tablette",
}

export default async function TableauDeBord() {
  await connection()
  if (!(await estConnecte())) redirect("/direction/connexion")

  const [aud, dir, eng, rad, cont, tech] = await Promise.all([
    audience(),
    direct(),
    engagement(),
    radio(),
    contenu(),
    technique(),
  ])
  const genereLe = horodatage()

  const formulairesBranches = Boolean(process.env.RESEND_API_KEY || process.env.FORM_WEBHOOK_URL)
  const alertes: string[] = []
  if (!tech.site.ok) alertes.push("Le site ne répond pas correctement.")
  if (!tech.flux.ok || (rad.flux && rad.flux !== "started"))
    alertes.push("Le flux radio ne répond pas : l'antenne est peut-être coupée.")
  if (!formulairesBranches)
    alertes.push(
      `Les formulaires du site (contact, publicité, newsletter, infos) ne sont pas branchés : les messages envoyés ne vous parviennent pas${
        eng && !eng.erreur && eng.totaux.formPerdu30
          ? ` (${eng.totaux.formPerdu30} perdu${eng.totaux.formPerdu30 > 1 ? "s" : ""} en 30 jours)`
          : ""
      }.`,
    )
  if (!tech.redis) alertes.push("Le compteur « en ce moment » n'est pas encore activé.")
  if (!tech.analytics) alertes.push("Les statistiques d'audience ne sont pas encore reliées.")

  const audOk = aud && !aud.erreur ? aud : null
  const engOk = eng && !eng.erreur ? eng : null

  return (
    <div className="min-h-dvh">
      {/* ─── En-tête ─── */}
      <header className="border-trait bg-fond/90 sticky top-0 z-30 border-b backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="surtitre text-accent">Radio Tripoint · Direction</p>
            <h1 className="truncate text-lg font-extrabold tracking-tight sm:text-xl">
              Tableau de bord de Giorgio
            </h1>
          </div>
          <Horloge genereLe={genereLe} />
          <form action={seDeconnecter}>
            <button
              type="submit"
              aria-label="Se déconnecter"
              className="border-trait hover:bg-carte-2 grid size-10 place-items-center rounded-full border"
            >
              <LogOut className="size-4" aria-hidden />
            </button>
          </form>
        </div>
        <nav aria-label="Sections" className="mx-auto max-w-[1400px] overflow-x-auto px-4 sm:px-6">
          <ul className="flex gap-1 pb-2 text-sm font-semibold whitespace-nowrap">
            {SECTIONS.map(([id, libelle]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-encre-2 hover:bg-carte-2 hover:text-encre block rounded-full px-3 py-1.5"
                >
                  {libelle}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-12 px-4 py-6 sm:px-6 sm:py-8">
        {/* ─── Alertes ─── */}
        <div className="space-y-2">
          {alertes.length === 0 ? (
            <Carte>
              <Etat ok>Tout fonctionne : site, antenne, formulaires et mesures.</Etat>
            </Carte>
          ) : (
            alertes.map((a) => (
              <div key={a} className="border-alerte/40 bg-carte rounded-xl border px-4 py-3">
                <Etat ok={false}>{a}</Etat>
              </div>
            ))
          )}
        </div>

        {/* ─── En direct ─── */}
        <Section
          id="direct"
          titre="En direct"
          sousTitre="Visiteurs actifs dans les 70 dernières secondes"
        >
          {dir ? (
            <Direct initial={dir} />
          ) : (
            <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
              <Tuile
                libelle="Visiteurs cette heure-ci"
                valeur={audOk?.heureCourante?.visiteurs ?? null}
                detail="Statistiques Vercel, à l'heure près"
              />
              <AActiver titre="Compteur « en ligne maintenant » à activer">
                Il compte en temps réel les personnes sur le site, ce qu&apos;elles regardent et qui
                écoute la radio. Il faut ajouter une base Redis (gratuite) au projet sur Vercel :
                Storage → Create Database → Upstash Redis → relier à « radio-tripoint ». Le compteur
                démarre tout seul ensuite.
              </AActiver>
            </div>
          )}
        </Section>

        {/* ─── Antenne ─── */}
        <Section id="antenne" titre="Antenne" sousTitre="Source : RadioKing et la grille du site">
          <div className="grid gap-3 lg:grid-cols-3">
            <Carte titre="Sur les ondes">
              <div className="flex items-center gap-2">
                {rad.flux === "started" ? (
                  <span className="text-encre inline-flex items-center gap-2 text-sm font-bold">
                    <span className="point-direct" aria-hidden /> Flux en marche
                  </span>
                ) : (
                  <Etat ok={false}>{rad.flux ? `Flux : ${rad.flux}` : "État du flux inconnu"}</Etat>
                )}
                {rad.enCours?.live && (
                  <span className="bg-direct rounded px-1.5 py-0.5 text-[0.65rem] font-bold text-white uppercase">
                    Live
                  </span>
                )}
              </div>
              {rad.enCours ? (
                <>
                  <p className="mt-4 text-xl leading-tight font-extrabold">{rad.enCours.titre}</p>
                  {rad.enCours.artiste && (
                    <p className="text-encre-2 mt-1">{rad.enCours.artiste}</p>
                  )}
                  {rad.enCours.debut && rad.enCours.fin && (
                    <ProgressionTitre debut={rad.enCours.debut} fin={rad.enCours.fin} />
                  )}
                </>
              ) : (
                <p className="text-encre-3 mt-4 text-sm">Titre en cours indisponible.</p>
              )}
            </Carte>
            <Carte titre="Grille des programmes">
              <dl className="space-y-4">
                <div>
                  <dt className="text-encre-3 text-xs">En ce moment</dt>
                  <dd className="mt-1 font-bold">
                    {rad.programme
                      ? `${rad.programme.emission.nom} · jusqu'à ${libelleHeure(rad.programme.creneau.fin ?? "")}`
                      : "Programmation musicale (aucune émission à la grille)"}
                  </dd>
                </div>
                <div>
                  <dt className="text-encre-3 text-xs">Prochaine émission</dt>
                  <dd className="mt-1 font-bold">
                    {rad.suivant
                      ? `${rad.suivant.emission.nom} · ${nomJour(rad.suivant.creneau.jour)} à ${libelleHeure(rad.suivant.creneau.debut)}`
                      : "Aucun horaire publié"}
                  </dd>
                </div>
                <div>
                  <dt className="text-encre-3 text-xs">Émissions au catalogue</dt>
                  <dd className="mt-1 font-bold">{cont.emissions}</dd>
                </div>
              </dl>
            </Carte>
            <Carte titre="Derniers titres diffusés">
              {rad.historique.length ? (
                <ol className="divide-trait max-h-72 divide-y overflow-y-auto pr-1 text-sm">
                  {rad.historique.map((h, i) => (
                    <li key={`${h.debut}-${i}`} className="flex gap-3 py-2">
                      <span className="text-encre-3 w-11 flex-none">
                        {h.debut ? date(h.debut, { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{h.titre}</span>
                        {h.artiste && (
                          <span className="text-encre-3 block truncate">{h.artiste}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-encre-3 text-sm">Historique indisponible.</p>
              )}
            </Carte>
          </div>
        </Section>

        {/* ─── Audience ─── */}
        <Section
          id="audience"
          titre="Audience du site"
          sousTitre="Source : Vercel Web Analytics, sans cookie · mesure active depuis la mise en ligne du nouveau site"
        >
          {!aud ? (
            <AActiver titre="Statistiques d'audience à relier">
              Les visites sont déjà mesurées par Vercel ; il manque une clé de lecture. Sur
              vercel.com : Account Settings → Tokens → Create (portée : équipe « tripoint3 »), puis
              dans le projet radio-tripoint → Settings → Environment Variables, ajouter
              VERCEL_STATS_TOKEN avec cette clé, et redéployer.
            </AActiver>
          ) : aud.erreur ? (
            <Carte>
              <Etat ok={false}>
                Vercel ne répond pas pour l&apos;instant (ou la clé est refusée).
              </Etat>
            </Carte>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Tuile
                  accent
                  libelle="Visiteurs aujourd'hui"
                  valeur={aud.aujourdhui.visiteurs}
                  detail={`${nombre(aud.aujourdhui.pages)} pages vues`}
                  evolution={
                    <span className="text-encre-3">
                      hier : {aud.veille ? nombre(aud.veille.visiteurs) : "—"}
                    </span>
                  }
                />
                <Tuile
                  libelle="7 derniers jours"
                  valeur={aud.semaine?.visiteurs ?? null}
                  detail={aud.semaine ? `${nombre(aud.semaine.pages)} pages vues` : undefined}
                  evolution={
                    aud.semaine && (
                      <Evolution
                        actuel={aud.semaine.visiteurs}
                        precedent={aud.semainePrec?.visiteurs ?? null}
                      />
                    )
                  }
                />
                <Tuile
                  libelle="30 derniers jours"
                  valeur={aud.mois?.visiteurs ?? null}
                  detail={aud.mois ? `${nombre(aud.mois.pages)} pages vues` : undefined}
                  evolution={
                    aud.mois && (
                      <Evolution
                        actuel={aud.mois.visiteurs}
                        precedent={aud.moisPrec?.visiteurs ?? null}
                      />
                    )
                  }
                />
                <Tuile
                  libelle="Pages par visiteur"
                  valeur={
                    aud.mois && aud.mois.visiteurs
                      ? (aud.mois.pages / aud.mois.visiteurs).toLocaleString("fr-FR", {
                          maximumFractionDigits: 1,
                        })
                      : null
                  }
                  detail="sur 30 jours"
                />
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <Carte titre="Visiteurs par jour" note="30 jours">
                  <Histogramme
                    unite="visiteurs"
                    pas={7}
                    enCours
                    points={aud.parJour.map((p) => ({
                      cle: p.cle,
                      etiquette: date(p.cle, { day: "numeric", month: "short" }),
                      valeur: p.visiteurs,
                      detail: `${date(p.cle, { weekday: "long", day: "numeric", month: "long" })} · ${nombre(p.pages)} pages`,
                    }))}
                  />
                </Carte>
                <Carte titre="Visiteurs par heure" note="aujourd'hui">
                  <Histogramme
                    unite="visiteurs"
                    pas={3}
                    enCours
                    points={aud.parHeure.map((p) => ({
                      cle: p.cle,
                      etiquette: date(p.cle, { hour: "2-digit" }).replace(" h", "h"),
                      valeur: p.visiteurs,
                      detail: `${date(p.cle, { hour: "2-digit", minute: "2-digit" })} · ${nombre(p.pages)} pages`,
                    }))}
                  />
                </Carte>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <Carte titre="Pages les plus vues" note="30 jours" className="xl:row-span-2">
                  <Barres
                    unite="vues"
                    lignes={aud.pages.map((p) => ({
                      cle: p.cle,
                      libelle: libellePage(p.cle),
                      n: p.pages,
                    }))}
                  />
                </Carte>
                <Carte titre="Pays" note="visiteurs, 30 jours">
                  <Barres
                    lignes={aud.pays.map((p) => ({
                      cle: p.cle,
                      libelle: nomPays(p.cle),
                      n: p.visiteurs,
                    }))}
                  />
                </Carte>
                <Carte titre="D'où viennent-ils" note="sites d'origine, 30 jours">
                  <Barres
                    lignes={aud.sources.map((s) => ({
                      cle: s.cle || "direct",
                      libelle: s.cle || "Accès direct / application",
                      n: s.visiteurs,
                    }))}
                  />
                </Carte>
                <Carte titre="Appareils" note="visiteurs, 30 jours">
                  <Barres
                    lignes={aud.appareils.map((a) => ({
                      cle: a.cle,
                      libelle: APPAREILS[a.cle] ?? a.cle,
                      n: a.visiteurs,
                    }))}
                  />
                </Carte>
                <Carte titre="Systèmes et navigateurs" note="visiteurs, 30 jours">
                  <div className="grid grid-cols-2 gap-4">
                    <Barres lignes={aud.systemes.map((s) => ({ cle: s.cle, n: s.visiteurs }))} />
                    <Barres lignes={aud.navigateurs.map((s) => ({ cle: s.cle, n: s.visiteurs }))} />
                  </div>
                </Carte>
              </div>
              {aud.campagnes.length > 0 && (
                <Carte titre="Campagnes (liens utm_source)" note="30 jours">
                  <Barres lignes={aud.campagnes.map((c) => ({ cle: c.cle, n: c.visiteurs }))} />
                </Carte>
              )}
            </div>
          )}
        </Section>

        {/* ─── Engagement ─── */}
        <Section
          id="engagement"
          titre="Engagement"
          sousTitre="Écoutes, Tripo et formulaires · compté par le site depuis l'activation"
        >
          {!engOk ? (
            <AActiver titre="Compteurs d'engagement à activer">
              Ils s&apos;activent en même temps que le compteur « en ligne maintenant » (base Redis
              gratuite à ajouter sur Vercel).
            </AActiver>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Tuile
                  accent
                  libelle="Écoutes du direct"
                  valeur={engOk.totaux.direct30}
                  detail={`${nombre(engOk.totaux.direct7)} sur 7 jours`}
                />
                <Tuile
                  libelle="Podcasts lancés"
                  valeur={engOk.totaux.podcast30}
                  detail={`${nombre(engOk.totaux.podcast7)} sur 7 jours`}
                />
                <Tuile
                  libelle="Questions à Tripo"
                  valeur={engOk.totaux.tripo30}
                  detail={`${nombre(engOk.totaux.tripo7)} sur 7 jours`}
                />
                <Tuile
                  libelle="Formulaires reçus"
                  valeur={
                    engOk.totaux.contact30 +
                    engOk.totaux.information30 +
                    engOk.totaux.publicite30 +
                    engOk.totaux.newsletter30
                  }
                  detail={
                    engOk.totaux.formPerdu30
                      ? `dont ${nombre(engOk.totaux.formPerdu30)} non transmis`
                      : "30 jours"
                  }
                />
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                <Carte titre="Visites par jour" note="30 jours, compteur du site">
                  <Histogramme
                    unite="visites"
                    pas={7}
                    enCours
                    points={engOk.parJour.map((j) => ({
                      cle: j.jour,
                      etiquette: date(`${j.jour}T12:00:00Z`, { day: "numeric", month: "short" }),
                      valeur: Number((j as Record<string, unknown>).visites) || 0,
                      detail: `${date(`${j.jour}T12:00:00Z`, { weekday: "long", day: "numeric", month: "long" })} · pic ${j.pic} en même temps`,
                    }))}
                  />
                </Carte>
                <Carte titre="Podcasts les plus lancés" note="depuis l'activation">
                  <Barres
                    unite="écoutes"
                    vide="Aucun podcast lancé pour l'instant."
                    lignes={engOk.topPodcasts.map((p) => ({
                      cle: p.slug,
                      libelle: p.titre,
                      n: p.n,
                    }))}
                  />
                </Carte>
                <Carte titre="Formulaires par type" note="30 jours">
                  <Barres
                    vide="Aucun formulaire reçu."
                    lignes={[
                      { cle: "contact", libelle: "Contact", n: engOk.totaux.contact30 },
                      {
                        cle: "publicite",
                        libelle: "Demandes de publicité",
                        n: engOk.totaux.publicite30,
                      },
                      {
                        cle: "information",
                        libelle: "Infos proposées",
                        n: engOk.totaux.information30,
                      },
                      {
                        cle: "newsletter",
                        libelle: "Inscriptions newsletter",
                        n: engOk.totaux.newsletter30,
                      },
                    ].filter((l) => l.n > 0)}
                  />
                </Carte>
              </div>
            </div>
          )}
        </Section>

        {/* ─── Contenu ─── */}
        <Section id="contenu" titre="Contenu publié" sousTitre="Ce qui est en ligne sur le site">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <Tuile
                accent
                libelle="Articles"
                valeur={cont.articles.total}
                detail={`${cont.articles.semaine} cette semaine · ${cont.articles.mois} en 30 j`}
              />
              <Tuile
                libelle="Podcasts"
                valeur={cont.podcasts.total}
                detail={`${cont.podcasts.heures.toLocaleString("fr-FR")} h d'écoute`}
              />
              <Tuile libelle="Émissions" valeur={cont.emissions} />
              <Tuile
                libelle="Événements à venir"
                valeur={cont.evenements.aVenir}
                detail={`${cont.evenements.semaine} dans les 7 jours`}
              />
              <Tuile
                libelle="Partenaires affichés"
                valeur={cont.partenaires}
                detail="« Ils nous font confiance »"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Carte titre="Derniers articles" className="xl:col-span-2">
                <ul className="divide-trait divide-y text-sm">
                  {cont.articles.derniers.map((a) => (
                    <li key={a.slug} className="flex items-baseline gap-3 py-2">
                      <span className="text-encre-3 w-20 flex-none text-xs">
                        {a.date ? date(a.date, { day: "numeric", month: "short" }) : "—"}
                      </span>
                      <a
                        href={`/actualites/${a.slug}`}
                        target="_blank"
                        rel="noopener"
                        className="min-w-0 flex-1 truncate font-semibold hover:underline"
                      >
                        {a.titre}
                      </a>
                      <span className="text-encre-3 flex-none text-xs">{a.categorie}</span>
                    </li>
                  ))}
                </ul>
              </Carte>
              <Carte titre="Articles par rubrique">
                <Barres lignes={cont.articles.parCategorie} />
              </Carte>
              <Carte titre="Podcasts par émission">
                <Barres lignes={cont.podcasts.parEmission} unite="ép." />
              </Carte>
            </div>
            <Carte titre="Prochains événements à l'agenda">
              {cont.evenements.prochains.length ? (
                <ul className="grid gap-x-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  {cont.evenements.prochains.map((e) => (
                    <li
                      key={`${e.titre}-${e.debut}`}
                      className="border-trait flex gap-3 border-b py-2"
                    >
                      <span className="text-accent w-16 flex-none font-bold">
                        {date(e.debut, { day: "numeric", month: "short" })}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{e.titre}</span>
                        <span className="text-encre-3 block">
                          {e.ville} · {nomPays(e.pays)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-encre-3 text-sm">Aucun événement à venir à l&apos;agenda.</p>
              )}
            </Carte>
          </div>
        </Section>

        {/* ─── Technique ─── */}
        <Section id="technique" titre="Technique" sousTitre="Vérifié à chaque actualisation">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Carte titre="Site public">
              <Etat ok={tech.site.ok}>
                {tech.site.ok ? "En ligne" : `Problème (${tech.site.statut || "aucune réponse"})`}
              </Etat>
              <p className="text-encre-3 mt-2 text-xs">Réponse en {nombre(tech.site.ms)} ms</p>
            </Carte>
            <Carte titre="Flux radio">
              <Etat ok={tech.flux.ok}>
                {tech.flux.ok ? "Diffuse" : `Coupé (${tech.flux.statut || "aucune réponse"})`}
              </Etat>
              <p className="text-encre-3 mt-2 flex items-center gap-1.5 text-xs">
                <Radio className="size-3.5" aria-hidden /> RadioKing · réponse en{" "}
                {nombre(tech.flux.ms)} ms
              </p>
            </Carte>
            <Carte titre="Mesures">
              <div className="space-y-1.5">
                <Etat ok={tech.analytics}>Statistiques Vercel</Etat>
                <Etat ok={tech.redis}>Compteur en direct</Etat>
                <Etat ok={formulairesBranches}>Envoi des formulaires</Etat>
              </div>
            </Carte>
            <Carte titre="Mises en ligne récentes">
              {tech.deploiements ? (
                <ul className="space-y-2 text-xs">
                  {tech.deploiements.map((d) => (
                    <li key={d.date} className="flex gap-2">
                      <span className="text-encre-3 w-20 flex-none">
                        {date(d.date, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate">{d.message || "—"}</span>
                        <span className={d.etat === "READY" ? "text-bon" : "text-alerte"}>
                          {d.etat === "READY" ? "en ligne" : d.etat.toLowerCase()}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-encre-3 text-sm">Disponible une fois la clé Vercel ajoutée.</p>
              )}
            </Carte>
          </div>
        </Section>

        <p className="text-encre-3 pb-6 text-center text-xs">
          Aucune donnée n&apos;est estimée : un tiret signifie que la source ne l&apos;a pas
          fournie. Mesures anonymes, sans cookie de suivi. Généré le{" "}
          {date(genereLe, { dateStyle: "long", timeStyle: "short" })}.
        </p>
      </main>
    </div>
  )
}

function ProgressionTitre({ debut, fin }: { debut: string; fin: string }) {
  const d = Date.parse(debut)
  const f = Date.parse(fin)
  const maintenant = horodatage()
  const pct = Math.min(100, Math.max(0, ((maintenant - d) / (f - d)) * 100))
  return (
    <div className="mt-4">
      <div className="bg-grille h-1.5 overflow-hidden rounded-full">
        <div className="bg-accent h-full rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-encre-3 mt-1.5 flex justify-between text-xs">
        <span>{date(debut, { hour: "2-digit", minute: "2-digit" })}</span>
        <span>{duree((f - d) / 1000)}</span>
        <span>fin {date(fin, { hour: "2-digit", minute: "2-digit" })}</span>
      </p>
    </div>
  )
}
