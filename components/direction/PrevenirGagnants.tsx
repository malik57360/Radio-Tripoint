"use client"

import { Loader2, Mail } from "lucide-react"
import { useState, useTransition } from "react"
import { actionPrevenirGagnants } from "@/app/direction/(espace)/engagement/actions"
import { cn } from "@/lib/utils/cn"

/**
 * Prévenir les gagnants du jeu concours : un e-mail par personne, depuis
 * info@. On coche, on relit l'aperçu (avec le vrai pseudo), on envoie.
 * Ceux déjà prévenus restent décochés.
 */
const OBJET = "🎃 Vous avez gagné au jeu-concours Le Village Hanté !"
const MESSAGE = `🎃 Bonjour {pseudo} ! Félicitations, vous faites partie des gagnants du jeu-concours Le Village Hanté de Radio Tripoint ! 👻🏆

Nous vous contactons pour convenir d’un moment cette semaine afin que vous puissiez venir récupérer votre lot dans nos bureaux, situés du côté de la mairie de Sierck-les-Bains.

Quelles sont vos disponibilités cette semaine ? 😊

À bientôt !
L’équipe Radio Tripoint 🎙️`

const champ =
  "border-trait bg-carte-2 text-encre block w-full rounded-lg border px-2.5 py-2 text-sm outline-none focus:border-accent"

export function PrevenirGagnants({
  gagnants,
}: {
  gagnants: { jour: string; joueur: string; pseudo: string; libelle: string; prevenuLe: number }[]
}) {
  const [objet, setObjet] = useState(OBJET)
  const [message, setMessage] = useState(MESSAGE)
  const [coches, setCoches] = useState(
    () => new Set(gagnants.filter((g) => !g.prevenuLe).map((g) => `${g.jour}:${g.joueur}`)),
  )
  const [enCours, demarrer] = useTransition()
  const [retour, setRetour] = useState<{ ok: boolean; texte: string } | null>(null)
  const choisis = gagnants.filter((g) => coches.has(`${g.jour}:${g.joueur}`))
  const apercu = choisis[0] ?? gagnants[0]

  function envoyer() {
    if (!choisis.length) return
    const noms = choisis.map((g) => g.pseudo).join(", ")
    if (!window.confirm(`Envoyer ${choisis.length} e-mail(s) depuis info@ à : ${noms} ?`)) return
    demarrer(async () => {
      setRetour(null)
      const r = await actionPrevenirGagnants({
        objet,
        message,
        cibles: choisis.map((g) => ({ jour: g.jour, joueur: g.joueur })),
      })
      setRetour({
        ok: r.ok,
        texte: [
          r.envoyes.length ? `Envoyé à : ${r.envoyes.join(", ")}.` : "",
          r.erreurs.length ? `Pas envoyé : ${r.erreurs.join(" ; ")}` : "",
        ]
          .filter(Boolean)
          .join(" "),
      })
      if (r.envoyes.length) setCoches(new Set())
    })
  }

  return (
    <details className="border-trait mb-5 rounded-xl border p-3">
      <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold">
        <Mail className="size-4" aria-hidden />
        Prévenir les gagnants par e-mail
      </summary>
      <div className="mt-3 space-y-3">
        <ul className="space-y-1.5 text-sm">
          {gagnants.map((g) => {
            const cle = `${g.jour}:${g.joueur}`
            return (
              <li key={cle}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={coches.has(cle)}
                    onChange={(e) =>
                      setCoches((s) => {
                        const n = new Set(s)
                        if (e.target.checked) n.add(cle)
                        else n.delete(cle)
                        return n
                      })
                    }
                  />
                  <strong>{g.pseudo}</strong>
                  <span className="text-encre-3 text-xs">
                    {g.libelle}
                    {g.prevenuLe
                      ? ` · déjà prévenu le ${new Date(g.prevenuLe).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" })}`
                      : ""}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
        <label className="block text-sm font-semibold">
          Objet
          <input
            className={cn(champ, "mt-1")}
            value={objet}
            onChange={(e) => setObjet(e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold">
          Message ({"{pseudo}"} est remplacé par le pseudo de chacun)
          <textarea
            className={cn(champ, "mt-1")}
            rows={10}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        {apercu && (
          <div className="bg-carte-2 rounded-lg p-3 text-sm">
            <p className="text-encre-3 text-xs font-bold">Aperçu pour {apercu.pseudo}</p>
            <p className="mt-1 font-bold">{objet}</p>
            <p className="mt-1 whitespace-pre-line">
              {message.replaceAll("{pseudo}", apercu.pseudo)}
            </p>
            <p className="text-encre-3 mt-2 text-xs">
              + la signature de la radio, comme pour tout mail envoyé depuis info@.
            </p>
          </div>
        )}
        <button
          type="button"
          disabled={enCours || !choisis.length}
          onClick={envoyer}
          className="bg-accent inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-extrabold text-black disabled:opacity-50"
        >
          {enCours ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Mail className="size-4" aria-hidden />
          )}
          Envoyer à {choisis.length} gagnant{choisis.length > 1 ? "s" : ""}
        </button>
        {retour && (
          <p
            role="status"
            className={cn("text-sm font-semibold", retour.ok ? "text-bon" : "text-alerte")}
          >
            {retour.texte}
          </p>
        )}
      </div>
    </details>
  )
}
