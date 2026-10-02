import { Radio } from "lucide-react"
import { Carte, EnTetePage, Etat, date, nombre } from "@/components/direction/ui"
import { chargerTechnique } from "@/lib/direction/alertes"
import { formulairesBranches } from "@/lib/direction/donnees"

export const metadata = { title: "Technique — Direction Radio Tripoint" }

export default async function PageTechnique() {
  const tech = await chargerTechnique()
  const reglages: [string, boolean, string][] = [
    ["Statistiques Vercel", tech.analytics, "clé VERCEL_STATS_TOKEN"],
    ["Compteur en direct", tech.redis, "base Upstash Redis"],
    ["Envoi des formulaires", formulairesBranches(), "clé RESEND_API_KEY"],
    [
      "Guide Tripo",
      process.env.GUIDE_ACTIF === "1" && Boolean(process.env.ANTHROPIC_API_KEY),
      "GUIDE_ACTIF et clé Anthropic",
    ],
    ["Mot de passe du tableau de bord", true, "DIRECTION_MOT_DE_PASSE"],
  ]
  return (
    <div className="space-y-4">
      <EnTetePage titre="Technique" source="Vérifié à chaque actualisation de la page" />

      <div className="grid gap-3 md:grid-cols-2">
        <Carte titre="Site public">
          <Etat ok={tech.site.ok}>
            {tech.site.ok ? "En ligne" : `Problème (${tech.site.statut || "aucune réponse"})`}
          </Etat>
          <p className="text-encre-3 mt-2 text-xs">
            Page d&apos;accueil servie en {nombre(tech.site.ms)} ms
          </p>
        </Carte>
        <Carte titre="Flux radio">
          <Etat ok={tech.flux.ok}>
            {tech.flux.ok ? "Diffuse" : `Coupé (${tech.flux.statut || "aucune réponse"})`}
          </Etat>
          <p className="text-encre-3 mt-2 flex items-center gap-1.5 text-xs">
            <Radio className="size-3.5" aria-hidden /> RadioKing · réponse en {nombre(tech.flux.ms)}{" "}
            ms
          </p>
        </Carte>
      </div>

      <Carte titre="Réglages">
        <ul className="divide-trait divide-y">
          {reglages.map(([nom, ok, detail]) => (
            <li key={nom} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <Etat ok={ok}>{nom}</Etat>
              <span className="text-encre-3 text-xs">
                {ok ? "configuré" : `à faire : ${detail}`}
              </span>
            </li>
          ))}
        </ul>
      </Carte>

      <Carte titre="Mises en ligne récentes" note="production">
        {tech.deploiements ? (
          <ul className="divide-trait divide-y text-sm">
            {tech.deploiements.map((d) => (
              <li key={d.date} className="flex items-baseline gap-3 py-2">
                <span className="text-encre-3 w-28 flex-none text-xs">
                  {date(d.date, {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="min-w-0 flex-1 truncate">{d.message || "Redéploiement"}</span>
                <span
                  className={
                    d.etat === "READY"
                      ? "text-bon text-xs font-bold"
                      : "text-alerte text-xs font-bold"
                  }
                >
                  {d.etat === "READY" ? "en ligne" : d.etat.toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-encre-3 text-sm">Disponible une fois la clé Vercel ajoutée.</p>
        )}
      </Carte>
    </div>
  )
}
