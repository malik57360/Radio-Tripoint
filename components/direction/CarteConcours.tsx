import { retirerDuConcours } from "@/app/direction/(espace)/engagement/actions"
import { Carte, date, nombre } from "@/components/direction/ui"
import { site } from "@/config/site"
import { FIN_TEXTE, REPONSE_MIN_MS } from "@/lib/concours/jeu"
import { classementDirection } from "@/lib/concours/serveur"

/**
 * Jeu concours d'Halloween : le classement complet, avec l'e-mail pour
 * prévenir le gagnant. Un temps de réponse moyen très bas (proche de
 * REPONSE_MIN_MS) trahit un robot : à vérifier avant de remettre les lots.
 */
export async function CarteConcours() {
  const c = await classementDirection(30)
  if (!c || (c.total === 0 && !site.campagne.halloween)) return null
  return (
    <Carte titre="Jeu concours d'Halloween" note={`clôture ${FIN_TEXTE.fr} · ${c.total} joueurs`}>
      {c.lignes.length === 0 ? (
        <p className="text-encre-3 text-sm">Personne n&apos;a encore enregistré de score.</p>
      ) : (
        <ol className="divide-trait divide-y text-sm">
          {c.lignes.map((l, i) => {
            const suspect = l.msMoyen !== null && l.msMoyen < REPONSE_MIN_MS * 2
            return (
              <li key={l.joueur} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
                <span className="w-6 font-bold tabular-nums">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="font-bold">{l.pseudo}</span>{" "}
                  <a href={`mailto:${l.email}`} className="text-encre-3 break-all underline">
                    {l.email}
                  </a>
                  <span className="text-encre-3 block text-[0.75rem]">
                    {l.bonnes !== null && `${l.bonnes} bonnes réponses · `}
                    {l.msMoyen !== null && `${nombre(l.msMoyen)} ms en moyenne · `}
                    {l.quand
                      ? date(l.quand, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                    {suspect && " · ⚠ rythme de robot, à vérifier"}
                  </span>
                </span>
                <span className="font-bold tabular-nums">{nombre(l.points)} pts</span>
                <form action={retirerDuConcours}>
                  <input type="hidden" name="joueur" value={l.joueur} />
                  <button
                    type="submit"
                    className="text-encre-3 hover:text-encre text-[0.75rem] underline"
                  >
                    Retirer
                  </button>
                </form>
              </li>
            )
          })}
        </ol>
      )}
    </Carte>
  )
}
