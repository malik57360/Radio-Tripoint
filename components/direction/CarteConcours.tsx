import { retirerDuConcours } from "@/app/direction/(espace)/engagement/actions"
import { PrevenirGagnants } from "@/components/direction/PrevenirGagnants"
import { Carte, date, nombre } from "@/components/direction/ui"
import { site } from "@/config/site"
import { REPONSE_MIN_MS } from "@/lib/concours/jeu"
import { classementDirection } from "@/lib/concours/serveur"

type Classement = NonNullable<Awaited<ReturnType<typeof classementDirection>>>
type Ligne = Classement["lignes"][number]

/**
 * Jeu concours d'Halloween : le gagnant de chaque jour (tirage à 18 h) avec
 * son e-mail pour le prévenir, puis le classement de la manche en cours.
 * Un temps de réponse moyen très bas (proche de REPONSE_MIN_MS) trahit un
 * robot : à vérifier avant de remettre le lot. Retirer un gagnant fait
 * gagner le suivant de sa manche.
 */
export async function CarteConcours() {
  const c = await classementDirection(30)
  if (!c || (c.total === 0 && c.gagnants.length === 0 && !site.campagne.halloween)) return null
  const jourCourt = (jour: string) =>
    date(`${jour}T12:00:00Z`, { weekday: "short", day: "numeric", month: "short" })
  return (
    <Carte
      titre="Jeu concours d'Halloween"
      note={`manche du ${jourCourt(c.jour)} · tirage à 18 h · définitif à 18 h 10`}
    >
      {c.gagnants.length > 0 && (
        <>
          <PrevenirGagnants personnes={parPersonne(c.gagnants, jourCourt)} />
          <h4 className="text-encre-3 text-[0.7rem] font-bold tracking-[0.12em] uppercase">
            Gagnants du lot du jour
          </h4>
          <ol className="divide-trait mb-4 divide-y text-sm">
            {[...c.gagnants].reverse().map((g) => (
              <Rang key={g.jour} ligne={g} jour={g.jour} libelle={jourCourt(g.jour)} />
            ))}
          </ol>
        </>
      )}
      <h4 className="text-encre-3 text-[0.7rem] font-bold tracking-[0.12em] uppercase">
        Manche en cours · {c.total} joueur{c.total > 1 ? "s" : ""}
      </h4>
      {c.lignes.length === 0 ? (
        <p className="text-encre-3 py-2 text-sm">Personne n&apos;a encore enregistré de score.</p>
      ) : (
        <ol className="divide-trait divide-y text-sm">
          {c.lignes.map((l, i) => (
            <Rang key={l.joueur} ligne={l} jour={c.jour} libelle={String(i + 1)} />
          ))}
        </ol>
      )}
    </Carte>
  )
}

/**
 * Un même joueur peut gagner plusieurs manches : on le prévient une seule fois
 * (par adresse e-mail), la plus récente d'abord. Il reste « à prévenir » tant
 * qu'une de ses manches ne l'a pas été.
 */
function parPersonne(gagnants: Classement["gagnants"], jourCourt: (jour: string) => string) {
  const personnes = new Map<
    string,
    { cle: string; pseudo: string; manches: { jour: string; joueur: string }[]; prevenuLe: number }
  >()
  for (const g of [...gagnants].reverse()) {
    const cle = (g.email || g.joueur).trim().toLowerCase()
    const p = personnes.get(cle)
    if (p) {
      p.manches.push({ jour: g.jour, joueur: g.joueur })
      p.prevenuLe = Math.min(p.prevenuLe, g.prevenuLe)
    } else
      personnes.set(cle, {
        cle,
        pseudo: g.pseudo,
        manches: [{ jour: g.jour, joueur: g.joueur }],
        prevenuLe: g.prevenuLe,
      })
  }
  return [...personnes.values()].map((p) => ({
    ...p,
    libelle: `${p.manches.length > 1 ? `${p.manches.length} manches gagnées : ` : "manche du "}${p.manches.map((m) => jourCourt(m.jour)).join(", ")}`,
  }))
}

function Rang({ ligne: l, jour, libelle }: { ligne: Ligne; jour: string; libelle: string }) {
  const suspect = l.msMoyen !== null && l.msMoyen < REPONSE_MIN_MS * 2
  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
      <span className="min-w-6 font-bold tabular-nums">{libelle}</span>
      <span className="min-w-0 flex-1">
        <span className="font-bold">{l.pseudo}</span>{" "}
        <a href={`mailto:${l.email}`} className="text-encre-3 break-all underline">
          {l.email}
        </a>
        <span className="text-encre-3 block text-[0.75rem]">
          {l.bonnes !== null && `${l.bonnes} bonnes réponses · `}
          {l.msMoyen !== null && `${nombre(l.msMoyen)} ms en moyenne · `}
          {l.quand
            ? date(l.quand, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
            : ""}
          {suspect && " · ⚠ rythme de robot, à vérifier"}
        </span>
      </span>
      <span className="font-bold tabular-nums">{nombre(l.points)} pts</span>
      <form action={retirerDuConcours}>
        <input type="hidden" name="joueur" value={l.joueur} />
        <input type="hidden" name="jour" value={jour} />
        <button type="submit" className="text-encre-3 hover:text-encre text-[0.75rem] underline">
          Retirer
        </button>
      </form>
    </li>
  )
}
