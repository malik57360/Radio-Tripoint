import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { ActionsFicheAnnonce } from "@/components/direction/FicheActions"
import { BoutonRembourser, ModerationAnnonce } from "@/components/direction/ModerationAnnonces"
import { Carte, EnTetePage, Tuile, date } from "@/components/direction/ui"
import { prixAffiche } from "@/components/annonces/Vitrine"
import { lireAnnonce, lireJournal } from "@/lib/annonces/annonces"
import { defCategorie } from "@/lib/annonces/categories"
import { commandesDeLAnnonce } from "@/lib/annonces/commandes"
import { lireCompte } from "@/lib/annonces/comptes"
import { lireConfig, nomCategorie } from "@/lib/annonces/config"
import { statsAnnonces } from "@/lib/annonces/espace"
import { lienAnnonces } from "@/lib/annonces/liens"
import { euros } from "@/lib/annonces/offres"
import { LIBELLES_STATUT, cheminAnnonce } from "@/lib/annonces/types"
import { redis } from "@/lib/direction/redis"

export const metadata = { title: "Fiche annonce — Direction Radio Tripoint" }

const quand = (ms?: number) =>
  ms
    ? date(ms, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"
const futur = (ms?: number) => (ms && ms > Date.now() ? quand(ms) : null)

/** Tout sur une annonce, et tout ce qu'on peut y faire. */
export default async function FicheAnnonce(props: PageProps<"/direction/annonces/annonce/[id]">) {
  await connection()
  const { id } = await props.params
  const a = await lireAnnonce(id)
  if (!a) notFound()
  const [compte, cfg, stats, journal, sig, commandes] = await Promise.all([
    lireCompte(a.compte),
    lireConfig(),
    statsAnnonces([a.id]),
    lireJournal(1000),
    redis([["LRANGE", "rt:annonces:signalements", 0, 499]]),
    commandesDeLAnnonce(a.id),
  ])
  const s = stats.parAnnonce.get(a.id)
  const historique = journal.filter((j) => j.annonce === a.id)
  const signalements = ((sig?.[0] as string[] | null) ?? []).flatMap((x) => {
    try {
      const o = JSON.parse(x) as {
        annonce: string
        libelle: string
        explication: string
        le: number
      }
      return o.annonce === a.id ? [o] : []
    } catch {
      return []
    }
  })
  const def = defCategorie(a.categorie)
  const prix = prixAffiche({ prix: a.prix, mention: a.mention, details: a.details })
  const avantages = [
    ["À la une de l'accueil", futur(a.accueilJusqu)],
    ["Mise en avant catégorie", futur(a.categorieJusqu)],
    ["Visibilité renforcée", futur(a.renforceeJusqu)],
  ].filter(([, v]) => v) as [string, string][]

  return (
    <>
      <Link
        href="/direction/annonces?vue=en-ligne"
        className="text-encre-2 mb-3 inline-flex items-center gap-1.5 text-sm font-bold"
      >
        <ArrowLeft className="size-4" aria-hidden /> Petites annonces
      </Link>
      <EnTetePage titre={a.titre} source={`${LIBELLES_STATUT[a.statut]} · n° ${a.id}`}>
        {a.statut === "publiee" && (
          <a
            href={lienAnnonces(cheminAnnonce(a))}
            target="_blank"
            className="border-trait inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
          >
            Voir sur le site
            <ExternalLink className="size-4" aria-hidden />
          </a>
        )}
      </EnTetePage>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile libelle="Vues" valeur={s?.vues ?? 0} detail={`${s?.vues7 ?? 0} cette semaine`} />
        <Tuile libelle="Favoris" valeur={s?.favoris ?? 0} />
        <Tuile libelle="Discussions" valeur={s?.messages ?? 0} detail="personnes qui ont écrit" />
        <Tuile
          libelle="En ligne jusqu'au"
          valeur={a.expireLe ? date(a.expireLe, { day: "numeric", month: "short" }) : null}
          detail={a.vendueLe ? "Vendue" : undefined}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="space-y-5">
          <Carte>
            <p className="text-encre-3 text-xs">
              {nomCategorie(cfg, a.categorie)} · {a.ville} ({a.codePostal}, {a.pays})
              {prix ? ` · ${prix}` : ""}
            </p>
            {a.photos.length > 0 && (
              <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {a.photos.map((p) => (
                  <li key={p.url}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element -- contrôle de modération */}
                      <img
                        src={p.vignette}
                        alt=""
                        className="aspect-square w-full rounded-lg object-cover"
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
          </Carte>
          <Carte titre="Dates">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-encre-3">Déposée</dt>
              <dd>{quand(a.creeLe)}</dd>
              <dt className="text-encre-3">Publiée</dt>
              <dd>{quand(a.publieeLe)}</dd>
              <dt className="text-encre-3">Remontée</dt>
              <dd>{quand(a.remonteeLe)}</dd>
              <dt className="text-encre-3">Fin</dt>
              <dd>{quand(a.expireLe)}</dd>
              <dt className="text-encre-3">Modifiée</dt>
              <dd>{quand(a.majLe)}</dd>
              {avantages.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-encre-3">{k}</dt>
                  <dd>jusqu&apos;au {v}</dd>
                </div>
              ))}
            </dl>
          </Carte>
          <Carte titre={`Historique (${historique.length})`}>
            {historique.length ? (
              <ul className="divide-trait divide-y text-sm">
                {historique.map((j, i) => (
                  <li key={i} className="py-2 first:pt-0">
                    <span className="text-encre-3 mr-2 text-xs">{quand(j.le)}</span>
                    <strong>{j.action}</strong>
                    {typeof j.motif === "string" && (
                      <span className="text-encre-2"> · {j.motif}</span>
                    )}
                    {typeof j.par === "string" && (
                      <span className="text-encre-3"> · par {j.par}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-encre-3 text-sm">Rien au journal pour cette annonce.</p>
            )}
          </Carte>
        </div>

        <div className="space-y-5">
          <Carte titre="Annonceur">
            {compte ? (
              <div className="text-sm">
                <Link
                  href={`/direction/annonces/compte/${compte.id}`}
                  className="font-bold hover:underline"
                >
                  {compte.type === "pro" && compte.pro ? compte.pro.raisonSociale : compte.nom}
                </Link>
                <p className="text-encre-2 break-all">{compte.email}</p>
                <p className="text-encre-3 text-xs">
                  {compte.type === "pro" ? "Professionnel" : "Particulier"}
                  {compte.bloque ? " · SUSPENDU" : ""}
                  {compte.emailVerifie ? "" : " · e-mail non confirmé"}
                </p>
              </div>
            ) : (
              <p className="text-encre-3 text-sm">Compte supprimé.</p>
            )}
          </Carte>
          <Carte titre="Modération">
            <ModerationAnnonce
              id={a.id}
              statut={a.statut}
              payee={commandes.some((c) => c.statut === "payee")}
            />
          </Carte>
          <ActionsFicheAnnonce
            id={a.id}
            statut={a.statut}
            valeurs={{
              titre: a.titre,
              description: a.description,
              prix: a.prix === null ? "" : String(a.prix / 100).replace(".", ","),
              ville: a.ville,
              categorie: a.categorie,
            }}
            categories={cfg.categories.map((c) => ({ slug: c.slug, nom: c.nom }))}
          />
          {commandes.length > 0 && (
            <Carte titre="Paiements">
              <ul className="divide-trait divide-y text-sm">
                {commandes.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0"
                  >
                    <span>
                      <strong>{euros(c.total)}</strong> ·{" "}
                      {c.lignes.map((l) => l.libelle).join(", ")}
                      <span className="text-encre-3 block text-xs">
                        {quand(c.creeLe)} · {c.statut}
                      </span>
                    </span>
                    {c.statut === "payee" && (
                      <BoutonRembourser commande={c.id} montant={euros(c.total)} />
                    )}
                  </li>
                ))}
              </ul>
            </Carte>
          )}
          {signalements.length > 0 && (
            <Carte titre={`Signalements (${signalements.length})`}>
              <ul className="space-y-2 text-sm">
                {signalements.map((x, i) => (
                  <li key={i}>
                    <strong>{x.libelle}</strong> — {x.explication}
                    <span className="text-encre-3 block text-xs">{quand(x.le)}</span>
                  </li>
                ))}
              </ul>
            </Carte>
          )}
        </div>
      </div>
    </>
  )
}
