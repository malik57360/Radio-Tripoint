import { ExternalLink, PenLine, Search } from "lucide-react"
import Link from "next/link"
import { SuiviProspect, type SuiviInitial } from "@/components/direction/SuiviProspect"
import { AActiver, Carte, EnTetePage, Etat, Tuile, nombre } from "@/components/direction/ui"
import { redisActif } from "@/lib/direction/redis"
import {
  PAR_PAGE,
  SECTEURS,
  STATUTS,
  ZONES,
  lireSuivis,
  rechercherProspects,
  type Statut,
  type ZoneId,
} from "@/lib/direction/prospection"
import { cn } from "@/lib/utils/cn"

export const metadata = { title: "Prospection — Direction Radio Tripoint" }

const ecrire = (p: {
  siren: string
  nom: string
  activite: string
  commune: string
  dirigeant?: string | null
  email?: string
}) => {
  const q = new URLSearchParams({
    nouveau: "1",
    siren: p.siren,
    nom: p.nom,
    activite: p.activite,
    commune: p.commune,
  })
  if (p.dirigeant) q.set("dirigeant", p.dirigeant)
  if (p.email) q.set("a", p.email)
  return `/direction/mails?${q}`
}

const google = (nom: string, commune: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(`${nom} ${commune}`)}`

const champ =
  "border-trait bg-carte-2 text-encre focus:border-accent rounded-lg border px-3 py-2 text-sm outline-none"

export default async function PageProspection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const p = (k: string) => (typeof params[k] === "string" ? (params[k] as string) : "")
  const vue = p("vue") === "suivi" ? "suivi" : "recherche"
  const zone = (ZONES.find((z) => z.id === p("zone"))?.id ?? "sierck") as ZoneId
  const secteur = SECTEURS.find((s) => s.id === p("secteur"))?.id ?? "I"
  const salaries = p("salaries") === "1"
  const q = p("q").slice(0, 80)
  const page = Math.max(1, Number(p("page")) || 1)

  const suivis = await lireSuivis().catch(() => ({}) as Awaited<ReturnType<typeof lireSuivis>>)
  const parStatut = Object.values(suivis).reduce<Record<string, number>>((acc, s) => {
    acc[s.statut] = (acc[s.statut] ?? 0) + 1
    return acc
  }, {})

  const lien = (changes: Record<string, string>) => {
    const u = new URLSearchParams({
      zone,
      secteur,
      ...(salaries ? { salaries: "1" } : {}),
      ...(q ? { q } : {}),
      ...changes,
    })
    return `/direction/prospection?${u}`
  }

  const onglets = (
    <nav aria-label="Vue" className="bg-carte border-trait flex rounded-full border p-1">
      {[
        ["recherche", "Trouver des entreprises", lien({ vue: "recherche" })],
        ["suivi", `Mon suivi (${Object.keys(suivis).length})`, lien({ vue: "suivi" })],
      ].map(([id, libelle, href]) => (
        <Link
          key={id}
          href={href}
          aria-current={vue === id ? "page" : undefined}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-bold",
            vue === id ? "bg-accent text-black" : "text-encre-2 hover:text-encre",
          )}
        >
          {libelle}
        </Link>
      ))}
    </nav>
  )

  return (
    <div className="space-y-4">
      <EnTetePage
        titre="Prospection"
        source="Annuaire officiel des entreprises (INSEE, RNE) · données publiques, entreprises actives uniquement"
      >
        {onglets}
      </EnTetePage>

      {!redisActif() && (
        <AActiver titre="Suivi indisponible">
          Le suivi des prospects utilise la base Redis.
        </AActiver>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile
          libelle="Suivies"
          valeur={Object.keys(suivis).length}
          detail="entreprises avec un statut"
        />
        <Tuile
          libelle="Contactées"
          valeur={(parStatut.contacte ?? 0) + (parStatut.interesse ?? 0) + (parStatut.rdv ?? 0)}
        />
        <Tuile accent libelle="Rendez-vous" valeur={parStatut.rdv ?? 0} />
        <Tuile libelle="Clients" valeur={parStatut.client ?? 0} />
      </div>

      {vue === "suivi" ? (
        <VueSuivi suivis={suivis} />
      ) : (
        <>
          <Carte>
            <form method="get" className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
              <input type="hidden" name="vue" value="recherche" />
              <label className="grid gap-1.5">
                <span className="surtitre">Zone</span>
                <select name="zone" defaultValue={zone} className={champ}>
                  {ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nom}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="surtitre">Secteur</span>
                <select name="secteur" defaultValue={secteur} className={champ}>
                  {SECTEURS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nom}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="surtitre">Mot-clé (facultatif)</span>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="pizzeria, garage, coiffure…"
                  className={champ}
                />
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="salaries"
                    value="1"
                    defaultChecked={salaries}
                    className="accent-[var(--d-accent)]"
                  />
                  Avec salariés
                </label>
                <button
                  type="submit"
                  className="bg-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-black"
                >
                  <Search className="size-4" aria-hidden /> Chercher
                </button>
              </div>
            </form>
            <p className="text-encre-3 mt-3 text-xs">
              {ZONES.find((z) => z.id === zone)?.detail} · Côté Luxembourg et Allemagne, il
              n&apos;existe pas d&apos;annuaire public équivalent en accès libre : ces entreprises
              ne peuvent pas être listées ici.
            </p>
          </Carte>
          <Resultats
            zone={zone}
            secteur={secteur}
            salaries={salaries}
            q={q}
            page={page}
            suivis={suivis}
            lien={lien}
          />
        </>
      )}
    </div>
  )
}

async function Resultats({
  zone,
  secteur,
  salaries,
  q,
  page,
  suivis,
  lien,
}: {
  zone: ZoneId
  secteur: string
  salaries: boolean
  q: string
  page: number
  suivis: Awaited<ReturnType<typeof lireSuivis>>
  lien: (c: Record<string, string>) => string
}) {
  let res: Awaited<ReturnType<typeof rechercherProspects>>
  try {
    res = await rechercherProspects({ zone, secteur, page, salaries, q })
  } catch (e) {
    return (
      <Carte>
        <Etat ok={false}>{(e as Error).message}</Etat>
      </Carte>
    )
  }
  const pages = Math.min(res.pages, 400)
  return (
    <Carte
      titre={`${nombre(res.total)} entreprise${res.total > 1 ? "s" : ""} actives`}
      note={`page ${page} sur ${nombre(pages || 1)} · ${PAR_PAGE} par page`}
    >
      {res.prospects.length === 0 ? (
        <p className="text-encre-3 text-sm">Aucune entreprise sur cette page.</p>
      ) : (
        <ul className="divide-trait divide-y">
          {res.prospects.map((e) => {
            const s = suivis[e.siren]
            const nomAffiche = e.enseigne ?? e.nom
            return (
              <li key={e.siren} className="grid gap-3 py-4 lg:grid-cols-[1.3fr_1fr]">
                <div className="min-w-0">
                  <p className="font-bold">
                    {nomAffiche}
                    {e.enseigne && <span className="text-encre-3 font-normal"> · {e.nom}</span>}
                  </p>
                  <p className="text-encre-2 text-sm">
                    {e.activite} · <span className="font-semibold">{e.commune}</span> · {e.effectif}
                  </p>
                  <p className="text-encre-3 text-xs">
                    {e.adresse}
                    {e.dirigeant && ` · Dirigeant : ${e.dirigeant}`}
                    {e.siegeAilleurs && ` · Siège à ${e.siegeAilleurs}`}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold">
                    <Link
                      href={ecrire({ ...e, nom: nomAffiche, email: s?.email })}
                      className="text-accent inline-flex items-center gap-1 hover:underline"
                    >
                      <PenLine className="size-3.5" aria-hidden /> Écrire
                    </Link>
                    <a
                      href={google(nomAffiche, e.commune)}
                      target="_blank"
                      rel="noopener"
                      className="text-encre-2 hover:text-encre inline-flex items-center gap-1"
                    >
                      <Search className="size-3.5" aria-hidden /> Trouver site et téléphone
                    </a>
                    <a
                      href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${e.siren}`}
                      target="_blank"
                      rel="noopener"
                      className="text-encre-2 hover:text-encre inline-flex items-center gap-1"
                    >
                      <ExternalLink className="size-3.5" aria-hidden /> Fiche officielle
                    </a>
                  </div>
                </div>
                <SuiviProspect
                  siren={e.siren}
                  fiche={{ nom: nomAffiche, commune: e.commune, activite: e.activite }}
                  initial={s ? (s as SuiviInitial) : null}
                />
              </li>
            )
          })}
        </ul>
      )}
      {pages > 1 && (
        <nav
          aria-label="Pages"
          className="mt-4 flex items-center justify-between gap-2 text-sm font-bold"
        >
          {page > 1 ? (
            <Link
              href={lien({ page: String(page - 1) })}
              className="border-trait hover:border-accent rounded-full border px-4 py-2"
            >
              ← Précédente
            </Link>
          ) : (
            <span />
          )}
          <span className="text-encre-3 font-normal">
            {page} / {nombre(pages)}
          </span>
          {page < pages ? (
            <Link
              href={lien({ page: String(page + 1) })}
              className="border-trait hover:border-accent rounded-full border px-4 py-2"
            >
              Suivante →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </Carte>
  )
}

function VueSuivi({ suivis }: { suivis: Awaited<ReturnType<typeof lireSuivis>> }) {
  const liste = Object.entries(suivis).sort((a, b) => b[1].maj - a[1].maj)
  if (!liste.length)
    return (
      <Carte>
        <p className="text-encre-3 text-sm">
          Aucune entreprise suivie pour l&apos;instant. Dans « Trouver des entreprises », changez le
          statut d&apos;une fiche ou écrivez-lui : elle apparaîtra ici.
        </p>
      </Carte>
    )
  const ordre = Object.keys(STATUTS) as Statut[]
  return (
    <div className="space-y-4">
      {ordre
        .filter((st) => liste.some(([, s]) => s.statut === st))
        .map((st) => (
          <Carte
            key={st}
            titre={STATUTS[st]}
            note={`${liste.filter(([, s]) => s.statut === st).length}`}
          >
            <ul className="divide-trait divide-y">
              {liste
                .filter(([, s]) => s.statut === st)
                .map(([siren, s]) => (
                  <li key={siren} className="grid gap-3 py-3 lg:grid-cols-[1.3fr_1fr]">
                    <div className="min-w-0">
                      <p className="font-bold">{s.nom}</p>
                      <p className="text-encre-2 text-sm">
                        {s.activite} · {s.commune}
                      </p>
                      <p className="text-encre-3 text-xs">
                        {[s.email, s.telephone].filter(Boolean).join(" · ") ||
                          "Pas encore de coordonnées"}
                        {s.note && ` · ${s.note}`}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold">
                        <Link
                          href={ecrire({
                            siren,
                            nom: s.nom,
                            activite: s.activite,
                            commune: s.commune,
                            email: s.email,
                          })}
                          className="text-accent inline-flex items-center gap-1 hover:underline"
                        >
                          <PenLine className="size-3.5" aria-hidden /> Écrire
                        </Link>
                        <a
                          href={google(s.nom, s.commune)}
                          target="_blank"
                          rel="noopener"
                          className="text-encre-2 hover:text-encre inline-flex items-center gap-1"
                        >
                          <Search className="size-3.5" aria-hidden /> Trouver site et téléphone
                        </a>
                      </div>
                    </div>
                    <SuiviProspect
                      siren={siren}
                      fiche={{ nom: s.nom, commune: s.commune, activite: s.activite }}
                      initial={s as SuiviInitial}
                    />
                  </li>
                ))}
            </ul>
          </Carte>
        ))}
    </div>
  )
}
