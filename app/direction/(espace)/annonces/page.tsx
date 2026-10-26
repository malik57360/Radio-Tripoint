import { Download, ExternalLink, Search } from "lucide-react"
import Link from "next/link"
import { connection } from "next/server"
import {
  ActionsCompte,
  ActionsDiscussionSignalee,
  BoutonRembourser,
  ModerationAnnonce,
} from "@/components/direction/ModerationAnnonces"
import { PilotageAnnonces } from "@/components/direction/PilotageAnnonces"
import { ReglagesAnnonces } from "@/components/direction/ReglagesAnnonces"
import { RechercheAnnonces } from "@/components/direction/RechercheAnnonces"
import { StatsAnnonces } from "@/components/direction/StatsAnnonces"
import { AActiver, Carte, date, EnTetePage, Etat, Section, Tuile } from "@/components/direction/ui"
import { prixAffiche } from "@/components/annonces/Vitrine"
import { lireJournal, listerAnnonces } from "@/lib/annonces/annonces"
import { defCategorie } from "@/lib/annonces/categories"
import { listerCommandes, stripeActif, type Commande } from "@/lib/annonces/commandes"
import { listerComptes, type Compte } from "@/lib/annonces/comptes"
import { lireConfig, nomCategorie, type Config } from "@/lib/annonces/config"
import { mailsActifs } from "@/lib/annonces/mails"
import { euros } from "@/lib/annonces/offres"
import { URL_ANNONCES, lienAnnonces } from "@/lib/annonces/liens"
import { LIBELLES_STATUT, cheminAnnonce, type Annonce } from "@/lib/annonces/types"
import { MOTIFS_DISCUSSION, lireSignalementsDiscussions } from "@/lib/annonces/discussions"
import { statsDirection } from "@/lib/annonces/stats"
import { redis, redisActif } from "@/lib/direction/redis"
import { cn } from "@/lib/utils/cn"

export const metadata = { title: "Petites annonces — Direction Radio Tripoint" }

const VUES = [
  ["moderation", "À vérifier"],
  ["signalements", "Signalements"],
  ["en-ligne", "En ligne"],
  ["comptes", "Comptes"],
  ["commandes", "Paiements"],
  ["stats", "Statistiques"],
  ["pilotage", "Pilotage du site"],
  ["reglages", "Tarifs & réglages"],
  ["journal", "Journal"],
] as const
type Vue = (typeof VUES)[number][0]

const quand = (ms: number) =>
  date(ms, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })

const VERIF: Record<string, { ok: boolean; texte: string }> = {
  verifie: { ok: true, texte: "Trouvée et active dans l'annuaire de l'État" },
  ferme: { ok: false, texte: "Radiée ou fermée dans l'annuaire" },
  introuvable: { ok: false, texte: "SIRET introuvable dans l'annuaire" },
  manuel: { ok: false, texte: "À vérifier à la main (registre LU / DE)" },
  indisponible: { ok: false, texte: "Annuaire injoignable : à vérifier à la main" },
}

type Signalement = {
  id: string
  annonce: string
  libelle: string
  explication: string
  email?: string
  le: number
  doublon?: boolean
}

function Dossier({
  a,
  compte,
  commande,
  cfg,
  autres,
  signalements,
}: {
  a: Annonce
  compte?: Compte
  commande?: Commande
  cfg: Config
  autres: number
  signalements: Signalement[]
}) {
  const def = defCategorie(a.categorie)
  const prix = prixAffiche({ prix: a.prix, mention: a.mention, details: a.details })
  const v = compte?.pro?.verification
  const verif = compte?.pro?.valideParModeration
    ? { ok: true, texte: "Vérifié par la modération" }
    : v
      ? VERIF[v.statut]
      : null
  return (
    <Carte>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="min-w-0">
          <p className="text-encre-3 text-xs">
            Déposée le {quand(a.creeLe)} · {nomCategorie(cfg, a.categorie)} ·{" "}
            {LIBELLES_STATUT[a.statut]}
            {a.publieeLe ? " · déjà publiée une fois (modifiée)" : ""}
          </p>
          <h3 className="mt-1 text-lg leading-snug font-extrabold">
            <Link href={`/direction/annonces/annonce/${a.id}`} className="hover:underline">
              {a.titre}
            </Link>
          </h3>
          <p className="text-encre-2 text-sm font-semibold">
            {prix ? `${prix} · ` : ""}
            {a.ville} ({a.codePostal}, {a.pays})
          </p>
          {a.photos.length > 0 && (
            <ul className="mt-3 flex gap-2 overflow-x-auto">
              {a.photos.map((p) => (
                <li key={p.url} className="flex-none">
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element -- vignette de contrôle */}
                    <img
                      src={p.vignette}
                      alt=""
                      className="size-24 rounded-lg object-cover"
                      loading="lazy"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="text-encre-2 mt-3 text-sm leading-relaxed whitespace-pre-line">
            {a.description}
          </p>
          {def && Object.keys(a.details).length > 0 && (
            <dl className="text-encre-2 mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm">
              {def.champs
                .filter((c) => a.details[c.cle])
                .map((c) => (
                  <div key={c.cle} className="contents">
                    <dt className="text-encre-3">{c.libelle}</dt>
                    <dd className="font-semibold">{a.details[c.cle]}</dd>
                  </div>
                ))}
            </dl>
          )}
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <p className="surtitre">Annonceur</p>
            {compte ? (
              <>
                <p className="mt-1 font-bold">
                  <Link
                    href={`/direction/annonces/compte/${compte.id}`}
                    className="hover:underline"
                  >
                    {compte.type === "pro" && compte.pro ? compte.pro.raisonSociale : compte.nom}
                  </Link>{" "}
                  <span className="text-encre-3 font-normal">
                    ({compte.type === "pro" ? "pro" : "particulier"})
                  </span>
                </p>
                <p>
                  <a
                    href={`mailto:${compte.email}`}
                    className="text-accent font-semibold break-all"
                  >
                    {compte.email}
                  </a>
                </p>
                <p className="text-encre-3 text-xs">
                  Compte créé le{" "}
                  {date(compte.creeLe, { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                  {autres} autre(s) annonce(s)
                  {compte.emailVerifie ? " · e-mail confirmé" : " · e-mail NON confirmé"}
                </p>
                {compte.pro && (
                  <div className="mt-1.5">
                    <p className="text-encre-2">
                      {compte.pro.pays} · n° {compte.pro.identifiant} · {compte.pro.adresse},{" "}
                      {compte.pro.codePostal} {compte.pro.ville} · {compte.pro.telephone}
                    </p>
                    {verif && <Etat ok={verif.ok}>{verif.texte}</Etat>}
                    {v?.nomOfficiel && (
                      <p className="text-encre-2">Nom officiel : {v.nomOfficiel}</p>
                    )}
                    {v?.lien && (
                      <a
                        href={v.lien}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent inline-flex items-center gap-1 font-semibold"
                      >
                        Registre officiel
                        <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-encre-3 mt-1">Compte supprimé</p>
            )}
          </div>
          {a.doublonDe && (
            <p className="text-alerte font-semibold">
              Même texte qu&apos;une annonce d&apos;un autre compte ({a.doublonDe}) : possible copie
              d&apos;arnaque.
            </p>
          )}
          <div>
            <p className="surtitre">Formule</p>
            <p className="mt-1">
              {cfg.offres.find((o) => o.code === a.formule)?.nom ?? a.formule}
              {a.optionsDepot.length > 0 &&
                ` + ${a.optionsDepot.map((c) => cfg.offres.find((o) => o.code === c)?.nom ?? c).join(", ")}`}
            </p>
            {commande && (
              <p
                className={cn(
                  "text-xs font-semibold",
                  commande.statut === "payee" ? "text-bon" : "text-encre-2",
                )}
              >
                {euros(commande.total)} ·{" "}
                {commande.statut === "payee"
                  ? `payé le ${quand(commande.payeeLe ?? commande.creeLe)}`
                  : commande.statut === "remboursee"
                    ? "remboursé"
                    : commande.statut === "annulee"
                      ? "annulé"
                      : "paiement en attente"}
              </p>
            )}
          </div>
          {signalements.length > 0 && (
            <div>
              <p className="surtitre">Signalements ({a.signalements ?? signalements.length})</p>
              <ul className="mt-1 space-y-1.5">
                {signalements.slice(0, 5).map((s) => (
                  <li key={s.id} className="text-encre-2">
                    <strong>{s.libelle}</strong> — {s.explication}
                    <span className="text-encre-3 block text-xs">
                      {quand(s.le)}
                      {s.email && ` · ${s.email}`}
                      {s.doublon && " · même personne qu'un signalement précédent"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {a.statut === "publiee" && (
            <a
              href={lienAnnonces(cheminAnnonce(a))}
              target="_blank"
              className="text-accent inline-flex items-center gap-1 font-semibold"
            >
              Voir sur le site
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
          <ModerationAnnonce id={a.id} statut={a.statut} payee={commande?.statut === "payee"} />
        </div>
      </div>
    </Carte>
  )
}

export default async function PageAnnoncesDirection(props: PageProps<"/direction/annonces">) {
  await connection()
  if (!redisActif())
    return (
      <>
        <EnTetePage
          titre="Petites annonces"
          source="Annonces déposées sur annonces.radio-tripoint-officiel.fr"
        />
        <AActiver titre="Redis n'est pas branché">
          Les annonces, comptes et paiements sont rangés dans Redis.
        </AActiver>
      </>
    )
  const sp = await props.searchParams
  const vue: Vue = VUES.some(([v]) => v === sp.vue) ? (sp.vue as Vue) : "moderation"
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : ""
  const [annonces, comptes, commandes, cfg, sigBrut, discussionsSignalees] = await Promise.all([
    listerAnnonces(2000),
    listerComptes(2000),
    listerCommandes(2000),
    lireConfig(),
    redis([["LRANGE", "rt:annonces:signalements", 0, 499]]),
    lireSignalementsDiscussions(),
  ])
  const signalements = ((sigBrut?.[0] as string[] | null) ?? []).flatMap((s) => {
    try {
      return [JSON.parse(s) as Signalement]
    } catch {
      return []
    }
  })
  const compte = (id: string) => comptes.find((c) => c.id === id)
  const commandeDe = (a: Annonce) =>
    a.commande ? commandes.find((c) => c.id === a.commande) : undefined
  const par = (s: Annonce["statut"]) => annonces.filter((a) => a.statut === s)
  const aVerifier = par("en_attente").sort((a, b) => a.majLe - b.majLe)
  const signalees = par("signalee")
  const enLigne = par("publiee")
  const payees = commandes.filter((c) => c.statut === "payee")
  const debutMois = new Date(
    new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" }).slice(0, 8) +
      "01T00:00:00",
  ).getTime()
  const revenus = payees.reduce((n, c) => n + c.total, 0)
  const revenusMois = payees
    .filter((c) => (c.payeeLe ?? 0) >= debutMois)
    .reduce((n, c) => n + c.total, 0)
  const parOffre = new Map<string, number>()
  for (const c of payees)
    for (const l of c.lignes) parOffre.set(l.libelle, (parOffre.get(l.libelle) ?? 0) + l.centimes)
  const abouties = commandes.filter((c) => c.statut === "payee" || c.statut === "remboursee")
  const remboursees = commandes.filter((c) => c.statut === "remboursee").length
  const conversion = commandes.length
    ? Math.round((abouties.length / commandes.length) * 100)
    : null
  const nb = (v: Vue) =>
    v === "moderation"
      ? aVerifier.length
      : v === "signalements"
        ? signalees.length + discussionsSignalees.length
        : v === "en-ligne"
          ? enLigne.length
          : v === "comptes"
            ? comptes.length
            : null

  return (
    <>
      <EnTetePage
        titre="Petites annonces"
        source="annonces.radio-tripoint-officiel.fr · modération avant publication"
      >
        <a
          href={URL_ANNONCES}
          target="_blank"
          className="border-trait inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
        >
          Voir le site
          <ExternalLink className="size-4" aria-hidden />
        </a>
      </EnTetePage>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <form
          action="/direction/annonces"
          className="relative min-w-0 flex-1 basis-72"
          role="search"
        >
          <Search
            className="text-encre-3 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
            aria-hidden
          />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Chercher une annonce, un compte, un e-mail, un paiement…"
            aria-label="Chercher dans les annonces, les comptes et les paiements"
            className="border-trait bg-carte focus:border-accent min-h-11 w-full rounded-full border pr-4 pl-10 text-sm outline-none"
          />
        </form>
        <details className="relative">
          <summary className="border-trait inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border px-4 text-sm font-bold">
            <Download className="size-4" aria-hidden />
            Exporter
          </summary>
          <div className="bg-carte border-trait absolute right-0 z-20 mt-2 w-60 rounded-xl border p-1.5 shadow-lg">
            {(
              [
                ["annonces", "Annonces (CSV)"],
                ["comptes", "Comptes (CSV)"],
                ["paiements", "Paiements (CSV)"],
              ] as const
            ).map(([k, t]) => (
              <a
                key={k}
                href={`/direction/annonces/export?quoi=${k}`}
                className="hover:bg-carte-2 block rounded-lg px-3 py-2 text-sm font-semibold"
              >
                {t}
              </a>
            ))}
          </div>
        </details>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile
          libelle="À vérifier"
          valeur={aVerifier.length}
          accent={aVerifier.length > 0}
          detail={`${par("attente_paiement").length} en attente de paiement`}
        />
        <Tuile
          libelle="En ligne"
          valeur={enLigne.length}
          detail={`${par("expiree").length} expirée(s) au total`}
        />
        <Tuile
          libelle="Encaissé ce mois"
          valeur={euros(revenusMois)}
          detail={`${euros(revenus)} depuis l'ouverture`}
        />
        <Tuile
          libelle="Paiements aboutis"
          valeur={conversion === null ? null : `${conversion} %`}
          detail={`${abouties.length} payé(s) sur ${commandes.length} commencé(s)${remboursees ? `, dont ${remboursees} remboursé(s)` : ""}`}
        />
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm">
        <Etat ok={stripeActif()}>
          {stripeActif()
            ? "Stripe branché"
            : "Stripe pas branché : seules les annonces gratuites passent"}
        </Etat>
        <Etat ok={mailsActifs()}>
          {mailsActifs() ? "E-mails envoyés depuis info@" : "Boîte mail non branchée"}
        </Etat>
        <Etat ok={cfg.depotsOuverts}>{cfg.depotsOuverts ? "Dépôts ouverts" : "Dépôts fermés"}</Etat>
        <Etat ok={cfg.site.ouvert}>{cfg.site.ouvert ? "Site ouvert" : "Site en pause"}</Etat>
        {!cfg.site.messagerieOuverte && <Etat ok={false}>Messagerie en pause</Etat>}
        {!cfg.site.inscriptionsOuvertes && <Etat ok={false}>Inscriptions fermées</Etat>}
        <Etat ok={cfg.site.lienRadio}>
          {cfg.site.lienRadio ? "Lien sur le site radio" : "Lien radio masqué"}
        </Etat>
      </div>

      <nav aria-label="Vues" className="mb-6 flex gap-1.5 overflow-x-auto pb-1">
        {VUES.map(([v, t]) => (
          <Link
            key={v}
            href={`/direction/annonces?vue=${v}`}
            aria-current={vue === v ? "page" : undefined}
            className={cn(
              "flex-none rounded-full border px-3.5 py-1.5 text-sm font-bold",
              vue === v ? "border-accent bg-accent text-black" : "border-trait text-encre-2",
            )}
          >
            {t}
            {nb(v) ? ` (${nb(v)})` : ""}
          </Link>
        ))}
      </nav>

      {q ? (
        <RechercheAnnonces q={q} annonces={annonces} comptes={comptes} commandes={commandes} />
      ) : null}

      {!q && vue === "stats" && (
        <Section id="stats" titre="Statistiques" sousTitre="30 derniers jours, heure de Paris">
          <StatsAnnonces s={await statsDirection({ annonces, comptes, commandes })} cfg={cfg} />
        </Section>
      )}

      {!q && vue === "pilotage" && (
        <Section
          id="pilotage"
          titre="Pilotage du site"
          sousTitre="Appliqué tout de suite, sans redéployer"
        >
          <PilotageAnnonces initial={cfg.site} />
        </Section>
      )}

      {!q && vue === "moderation" && (
        <Section
          id="a-verifier"
          titre={`À vérifier (${aVerifier.length})`}
          sousTitre="Les plus anciennes d'abord"
        >
          {aVerifier.length ? (
            <div className="space-y-4">
              {aVerifier.map((a) => (
                <Dossier
                  key={a.id}
                  a={a}
                  compte={compte(a.compte)}
                  commande={commandeDe(a)}
                  cfg={cfg}
                  autres={annonces.filter((x) => x.compte === a.compte && x.id !== a.id).length}
                  signalements={signalements.filter((s) => s.annonce === a.id)}
                />
              ))}
            </div>
          ) : (
            <Carte>
              <p className="text-encre-2 text-sm">Rien à vérifier. 🎉</p>
            </Carte>
          )}
        </Section>
      )}

      {!q && vue === "signalements" && (
        <div className="space-y-10">
          <Section
            id="discussions"
            titre={`Discussions signalées (${discussionsSignalees.length})`}
            sousTitre="Lues seulement parce qu'un participant les a signalées"
          >
            {discussionsSignalees.length ? (
              <div className="space-y-4">
                {discussionsSignalees.map((x) => {
                  const [p1, p2] = x.participants
                  return (
                    <Carte key={x.id}>
                      <p className="text-encre-3 text-xs">
                        {quand(x.le)} · « {x.annonce} » · signalée par{" "}
                        <strong>{x.noms[x.par] ?? "?"}</strong>
                      </p>
                      <p className="mt-1 font-bold">{MOTIFS_DISCUSSION[x.motif]}</p>
                      {x.explication && (
                        <p className="text-encre-2 mt-1 text-sm">« {x.explication} »</p>
                      )}
                      <ol className="border-trait mt-3 max-h-80 space-y-1.5 overflow-y-auto rounded-xl border p-3 text-sm">
                        {x.extrait.map((m, i) => (
                          <li key={i}>
                            <span className="text-encre-3 text-xs">{quand(m.le)} · </span>
                            <strong>{x.noms[m.de] ?? "?"}</strong> : {m.texte}
                          </li>
                        ))}
                        {!x.extrait.length && <li className="text-encre-3">Aucun message.</li>}
                      </ol>
                      <p className="mt-3 text-sm">
                        Comptes :{" "}
                        {[p1, p2].map((id, i) => (
                          <span key={id}>
                            {i > 0 && " · "}
                            <Link
                              href={`/direction/annonces/compte/${id}`}
                              className="text-accent font-bold"
                            >
                              {x.noms[id] ?? id}
                            </Link>
                          </span>
                        ))}{" "}
                        <span className="text-encre-3">(pour le suspendre au besoin)</span>
                      </p>
                      <div className="mt-3">
                        <ActionsDiscussionSignalee signalement={x.id} discussion={x.discussion} />
                      </div>
                    </Carte>
                  )
                })}
              </div>
            ) : (
              <Carte>
                <p className="text-encre-2 text-sm">Aucune discussion signalée.</p>
              </Carte>
            )}
          </Section>
          <Section id="masquees" titre={`Masquées après signalements (${signalees.length})`}>
            {signalees.length ? (
              <div className="space-y-4">
                {signalees.map((a) => (
                  <Dossier
                    key={a.id}
                    a={a}
                    compte={compte(a.compte)}
                    commande={commandeDe(a)}
                    cfg={cfg}
                    autres={annonces.filter((x) => x.compte === a.compte && x.id !== a.id).length}
                    signalements={signalements.filter((s) => s.annonce === a.id)}
                  />
                ))}
              </div>
            ) : (
              <Carte>
                <p className="text-encre-2 text-sm">Aucune annonce masquée.</p>
              </Carte>
            )}
          </Section>
          <Section id="derniers" titre="Derniers signalements">
            <Carte>
              {signalements.length ? (
                <ul className="divide-trait space-y-3 divide-y text-sm">
                  {signalements.slice(0, 60).map((s) => {
                    const a = annonces.find((x) => x.id === s.annonce)
                    return (
                      <li key={s.id} className="pt-3 first:pt-0">
                        <p className="font-bold">
                          {s.libelle} ·{" "}
                          <span className="text-encre-2 font-semibold">
                            {a?.titre ?? s.annonce}
                          </span>
                          {a && (
                            <span className="text-encre-3 font-normal">
                              {" "}
                              ({LIBELLES_STATUT[a.statut]})
                            </span>
                          )}
                        </p>
                        <p className="text-encre-2">{s.explication}</p>
                        <p className="text-encre-3 text-xs">
                          {quand(s.le)}
                          {s.email && ` · ${s.email}`}
                        </p>
                        {a && a.statut === "publiee" && (
                          <div className="mt-2">
                            <ModerationAnnonce id={a.id} statut={a.statut} payee={false} />
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-encre-2 text-sm">Aucun signalement.</p>
              )}
            </Carte>
          </Section>
        </div>
      )}

      {!q && vue === "en-ligne" && (
        <Section id="en-ligne" titre={`En ligne (${enLigne.length})`}>
          <Carte>
            {enLigne.length ? (
              <ul className="divide-trait divide-y text-sm">
                {enLigne
                  .sort((a, b) => (b.remonteeLe ?? 0) - (a.remonteeLe ?? 0))
                  .map((a) => (
                    <li key={a.id} className="space-y-2 py-3 first:pt-0">
                      <p>
                        <Link
                          href={`/direction/annonces/annonce/${a.id}`}
                          className="font-bold hover:underline"
                        >
                          {a.titre}
                        </Link>{" "}
                        <span className="text-encre-3">
                          · {a.ville} · {compte(a.compte)?.email ?? "?"} · jusqu&apos;au{" "}
                          {date(a.expireLe ?? 0, { day: "numeric", month: "short" })}
                          {(a.signalements ?? 0) > 0 && ` · ${a.signalements} signalement(s)`}
                        </span>
                      </p>
                      <ModerationAnnonce id={a.id} statut={a.statut} payee={false} />
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-encre-2 text-sm">Aucune annonce en ligne.</p>
            )}
          </Carte>
        </Section>
      )}

      {!q && vue === "comptes" && (
        <Section id="comptes" titre={`Comptes (${comptes.length})`}>
          <Carte>
            <ul className="divide-trait divide-y text-sm">
              {comptes.map((c) => {
                const siennes = annonces.filter((a) => a.compte === c.id)
                return (
                  <li key={c.id} className="space-y-2 py-3 first:pt-0">
                    <p>
                      <Link
                        href={`/direction/annonces/compte/${c.id}`}
                        className="font-bold hover:underline"
                      >
                        {c.type === "pro" && c.pro ? c.pro.raisonSociale : c.nom}
                      </Link>{" "}
                      <span className="text-encre-3">
                        · {c.email} · {c.type} · {siennes.length} annonce(s) · créé le{" "}
                        {date(c.creeLe, { day: "numeric", month: "short", year: "numeric" })}
                        {!c.emailVerifie && " · e-mail non confirmé"}
                      </span>
                    </p>
                    {c.pro && (
                      <p className="text-encre-2 text-xs">
                        {c.pro.pays} · n° {c.pro.identifiant} ·{" "}
                        {c.pro.valideParModeration
                          ? "vérifié par la modération"
                          : (VERIF[c.pro.verification?.statut ?? ""]?.texte ?? "non vérifié")}
                      </p>
                    )}
                    {c.bloque && (
                      <p className="text-alerte text-xs font-semibold">
                        Suspendu le {date(c.bloque.le, { day: "numeric", month: "short" })} :{" "}
                        {c.bloque.motif}
                      </p>
                    )}
                    <ActionsCompte
                      id={c.id}
                      bloque={Boolean(c.bloque)}
                      pro={Boolean(c.pro)}
                      proValide={Boolean(
                        c.pro?.valideParModeration || c.pro?.verification?.statut === "verifie",
                      )}
                    />
                  </li>
                )
              })}
              {!comptes.length && (
                <li className="text-encre-2">Aucun compte pour l&apos;instant.</li>
              )}
            </ul>
          </Carte>
        </Section>
      )}

      {!q && vue === "commandes" && (
        <div className="space-y-8">
          <Section id="revenus" titre="Revenus par offre">
            <Carte>
              {parOffre.size ? (
                <ul className="space-y-1 text-sm">
                  {[...parOffre.entries()]
                    .sort((a, b) => b[1] - a[1])
                    .map(([k, v]) => (
                      <li key={k} className="flex justify-between gap-3">
                        <span>{k}</span>
                        <strong>{euros(v)}</strong>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-encre-2 text-sm">Aucun paiement pour l&apos;instant.</p>
              )}
            </Carte>
          </Section>
          <Section id="paiements" titre={`Paiements (${commandes.length})`}>
            <Carte>
              <ul className="divide-trait divide-y text-sm">
                {commandes.map((c) => {
                  const a = annonces.find((x) => x.id === c.annonce)
                  return (
                    <li
                      key={c.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0"
                    >
                      <span className="min-w-0">
                        <strong>{euros(c.total)}</strong> ·{" "}
                        {c.lignes.map((l) => l.libelle).join(", ")}
                        <span className="text-encre-3 block text-xs">
                          {quand(c.creeLe)} · {c.email} · {a?.titre ?? "annonce supprimée"} ·{" "}
                          {c.statut === "payee"
                            ? "payé"
                            : c.statut === "remboursee"
                              ? `remboursé (${c.remboursement?.motif ?? ""})`
                              : c.statut === "annulee"
                                ? "annulé"
                                : "en attente"}
                        </span>
                      </span>
                      {c.statut === "payee" && (
                        <BoutonRembourser commande={c.id} montant={euros(c.total)} />
                      )}
                    </li>
                  )
                })}
                {!commandes.length && <li className="text-encre-2">Aucune commande.</li>}
              </ul>
            </Carte>
          </Section>
        </div>
      )}

      {!q && vue === "reglages" && (
        <Section
          id="reglages"
          titre="Tarifs & réglages"
          sousTitre="Valeurs de départ : la grille du cahier de cadrage"
        >
          <ReglagesAnnonces config={cfg} />
        </Section>
      )}

      {!q && vue === "journal" && (
        <Section id="journal" titre="Journal des actions">
          <Carte>
            <ul className="divide-trait divide-y text-sm">
              {(await lireJournal(300)).map((j, i) => (
                <li key={i} className="py-2 first:pt-0">
                  <span className="text-encre-3 mr-2 text-xs">{quand(j.le)}</span>
                  <strong>{j.action}</strong>
                  <span className="text-encre-2">
                    {" "}
                    {Object.entries(j)
                      .filter(([k]) => k !== "le" && k !== "action")
                      .map(([k, v]) => `${k} : ${Array.isArray(v) ? v.join(", ") : String(v)}`)
                      .join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </Carte>
        </Section>
      )}
    </>
  )
}
