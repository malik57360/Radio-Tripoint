import { Search } from "lucide-react"
import Link from "next/link"
import { ListeProspects, type FicheProspect } from "@/components/direction/ListeProspects"
import type { SuiviInitial } from "@/components/direction/SuiviProspect"
import { AActiver, Carte, EnTetePage, Etat, nombre } from "@/components/direction/ui"
import { coordonneesConnues } from "@/lib/direction/coordonnees"
import { redisActif } from "@/lib/direction/redis"
import {
  PAR_PAGE,
  SECTEURS,
  STATUTS,
  ZONES,
  lireSuivis,
  rechercherProspects,
  type Statut,
  type Suivi,
  type ZoneId,
} from "@/lib/direction/prospection"
import { cn } from "@/lib/utils/cn"

export const metadata = { title: "Prospection — Direction Radio Tripoint" }
// La recherche des coordonnées (IA + web) et la rédaction des mails prennent du temps.
export const maxDuration = 60

const champ =
  "border-trait bg-carte-2 text-encre focus:border-accent rounded-lg border px-3 py-2 text-sm outline-none"

const versSuiviInitial = (s: Suivi): SuiviInitial => ({
  statut: s.statut,
  note: s.note,
  email: s.email,
  telephone: s.telephone,
  dernierEnvoi: s.dernierEnvoi,
})

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

  const suivis = await lireSuivis().catch(() => ({}) as Record<string, Suivi>)
  const parStatut = Object.values(suivis).reduce<Record<string, number>>((acc, s) => {
    acc[s.statut] = (acc[s.statut] ?? 0) + 1
    return acc
  }, {})
  const contactees = (parStatut.contacte ?? 0) + (parStatut.interesse ?? 0) + (parStatut.rdv ?? 0)

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
        source="Entreprises actives de l'annuaire officiel (INSEE, RNE) · mails et téléphones trouvés sur le web par l'IA"
      >
        {onglets}
      </EnTetePage>

      {!redisActif() && (
        <AActiver titre="Suivi indisponible">
          Le suivi des prospects utilise la base Redis.
        </AActiver>
      )}

      <p className="text-encre-2 text-sm">
        <span className="text-encre font-bold">{contactees}</span> contactée
        {contactees > 1 ? "s" : ""} ·{" "}
        <span className="text-encre font-bold">{parStatut.rdv ?? 0}</span> rendez-vous ·{" "}
        <span className="text-encre font-bold">{parStatut.client ?? 0}</span> client
        {(parStatut.client ?? 0) > 1 ? "s" : ""}
      </p>

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
  suivis: Record<string, Suivi>
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
  const fiches: FicheProspect[] = res.prospects.map((e) => ({
    siren: e.siren,
    nom: e.nom,
    enseigne: e.enseigne,
    activite: e.activite,
    commune: e.commune,
    effectif: e.effectif,
    adresse: e.adresse,
    dirigeant: e.dirigeant,
  }))
  const coordonnees = await coordonneesConnues(fiches.map((f) => f.siren)).catch(() => ({}))
  const suivisPage = Object.fromEntries(
    fiches.filter((f) => suivis[f.siren]).map((f) => [f.siren, versSuiviInitial(suivis[f.siren])]),
  )
  return (
    <Carte
      titre={`${nombre(res.total)} entreprise${res.total > 1 ? "s" : ""}`}
      note={`page ${page} sur ${nombre(pages || 1)} · ${PAR_PAGE} par page`}
    >
      {fiches.length === 0 ? (
        <p className="text-encre-3 text-sm">Aucune entreprise sur cette page.</p>
      ) : (
        <ListeProspects
          key={`${zone}-${secteur}-${q}-${salaries}-${page}`}
          fiches={fiches}
          suivis={suivisPage}
          coordonnees={coordonnees}
          toutChercher
        />
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

async function VueSuivi({ suivis }: { suivis: Record<string, Suivi> }) {
  const liste = Object.entries(suivis).sort((a, b) => b[1].maj - a[1].maj)
  if (!liste.length)
    return (
      <Carte>
        <p className="text-encre-3 text-sm">
          Aucune entreprise suivie pour l&apos;instant. Dans « Trouver des entreprises », changez le
          statut d&apos;une fiche ou envoyez-lui un mail : elle apparaîtra ici.
        </p>
      </Carte>
    )
  const coordonnees = await coordonneesConnues(liste.map(([siren]) => siren)).catch(() => ({}))
  const ordre = Object.keys(STATUTS) as Statut[]
  return (
    <div className="space-y-4">
      {ordre
        .filter((st) => liste.some(([, s]) => s.statut === st))
        .map((st) => {
          const groupe = liste.filter(([, s]) => s.statut === st)
          return (
            <Carte key={st} titre={STATUTS[st]} note={`${groupe.length}`}>
              <ListeProspects
                fiches={groupe.map(([siren, s]) => ({
                  siren,
                  nom: s.nom,
                  activite: s.activite,
                  commune: s.commune,
                }))}
                suivis={Object.fromEntries(
                  groupe.map(([siren, s]) => [siren, versSuiviInitial(s)]),
                )}
                coordonnees={coordonnees}
              />
            </Carte>
          )
        })}
    </div>
  )
}
