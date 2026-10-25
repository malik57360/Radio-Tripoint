"use client"

import { ArrowDown, ArrowUp, Loader2, Save } from "lucide-react"
import { useState, useTransition } from "react"
import { actionReglages } from "@/app/direction/(espace)/annonces/actions"
import type { Config } from "@/lib/annonces/config"
import { cn } from "@/lib/utils/cn"

/**
 * Réglages des Petites annonces : tarifs et options, catégories ouvertes,
 * limites anti-abus. Rien n'est codé en dur : ce qui est enregistré ici
 * s'applique au prochain dépôt.
 */
const champ =
  "border-trait bg-carte-2 text-encre block w-full rounded-lg border px-2.5 py-2 text-sm outline-none focus:border-accent"

const versEuros = (c: number) => (c / 100).toFixed(2).replace(".", ",")
const versCentimes = (s: string) => Math.round(Number(s.replace(",", ".").replace(/\s/g, "")) * 100)

export function ReglagesAnnonces({ config }: { config: Config }) {
  const [offres, setOffres] = useState(
    config.offres.map((o) => ({ ...o, prix: versEuros(o.prixCentimes) })),
  )
  const [categories, setCategories] = useState(config.categories)
  const [limites, setLimites] = useState(config.limites)
  const [ouverts, setOuverts] = useState(config.depotsOuverts)
  const [enCours, demarrer] = useTransition()
  const [retour, setRetour] = useState<{ ok: boolean; texte: string } | null>(null)

  const majOffre = (code: string, k: string, v: unknown) =>
    setOffres((l) => l.map((o) => (o.code === code ? { ...o, [k]: v } : o)))
  const deplacer = (i: number, d: -1 | 1) =>
    setCategories((l) => {
      const c = [...l]
      const j = i + d
      if (j < 0 || j >= c.length) return l
      ;[c[i], c[j]] = [c[j], c[i]]
      return c.map((x, k) => ({ ...x, ordre: k }))
    })

  function enregistrer() {
    setRetour(null)
    const prixInvalide = offres.find(
      (o) => !Number.isFinite(versCentimes(o.prix)) || versCentimes(o.prix) < 0,
    )
    if (prixInvalide)
      return setRetour({ ok: false, texte: `Prix invalide pour « ${prixInvalide.nom} ».` })
    demarrer(async () => {
      const r = await actionReglages({
        offres: offres.map((o) => ({
          code: o.code,
          nom: o.nom,
          description: o.description,
          prixCentimes: versCentimes(o.prix),
          jours: Number(o.jours),
          photos: Number(o.photos),
          actif: o.actif,
        })),
        categories,
        limites: {
          activesParticulier: Number(limites.activesParticulier),
          depotsParJour: Number(limites.depotsParJour),
          seuilSignalements: Number(limites.seuilSignalements),
        },
        depotsOuverts: ouverts,
      })
      setRetour(r.ok ? { ok: true, texte: r.message } : { ok: false, texte: r.erreur })
    })
  }

  const groupes = [
    {
      titre: "Formules particuliers",
      liste: offres.filter((o) => o.genre === "formule" && o.pour === "particulier"),
    },
    {
      titre: "Formules professionnels",
      liste: offres.filter((o) => o.genre === "formule" && o.pour === "pro"),
    },
    { titre: "Options", liste: offres.filter((o) => o.genre === "option") },
  ]

  return (
    <div className="space-y-8">
      <label className="border-trait bg-carte flex items-center justify-between gap-4 rounded-2xl border p-4">
        <span>
          <span className="block font-bold">Dépôts ouverts</span>
          <span className="text-encre-3 text-xs">
            Fermé : plus personne ne peut déposer. Les annonces en ligne restent.
          </span>
        </span>
        <input
          type="checkbox"
          checked={ouverts}
          onChange={(e) => setOuverts(e.target.checked)}
          className="size-5"
        />
      </label>

      {groupes.map((g) => (
        <section key={g.titre}>
          <h3 className="surtitre mb-3">{g.titre}</h3>
          <div className="space-y-3">
            {g.liste.map((o) => (
              <div
                key={o.code}
                className={cn(
                  "border-trait bg-carte rounded-2xl border p-4",
                  !o.actif && "opacity-60",
                )}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    value={o.nom}
                    onChange={(e) => majOffre(o.code, "nom", e.target.value)}
                    className={cn(champ, "max-w-[16rem] font-bold")}
                    aria-label="Nom de l'offre"
                  />
                  <label className="ml-auto flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={o.actif}
                      onChange={(e) => majOffre(o.code, "actif", e.target.checked)}
                    />
                    Proposée
                  </label>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <label className="text-encre-3 text-xs font-bold">
                    Prix (€)
                    <input
                      value={o.prix}
                      onChange={(e) => majOffre(o.code, "prix", e.target.value)}
                      inputMode="decimal"
                      className={cn(champ, "mt-1")}
                    />
                  </label>
                  {o.effet !== "remontee" && o.effet !== "photos" && (
                    <label className="text-encre-3 text-xs font-bold">
                      Durée (jours)
                      <input
                        value={o.jours}
                        onChange={(e) => majOffre(o.code, "jours", e.target.value)}
                        inputMode="numeric"
                        className={cn(champ, "mt-1")}
                      />
                    </label>
                  )}
                  {(o.genre === "formule" || o.effet === "photos") && (
                    <label className="text-encre-3 text-xs font-bold">
                      {o.genre === "formule" ? "Photos incluses" : "Photos en plus"}
                      <input
                        value={o.photos}
                        onChange={(e) => majOffre(o.code, "photos", e.target.value)}
                        inputMode="numeric"
                        className={cn(champ, "mt-1")}
                      />
                    </label>
                  )}
                </div>
                <textarea
                  value={o.description}
                  onChange={(e) => majOffre(o.code, "description", e.target.value)}
                  rows={2}
                  className={cn(champ, "mt-2")}
                  aria-label="Description affichée"
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h3 className="surtitre mb-3">Catégories</h3>
        <ul className="space-y-2">
          {categories.map((c, i) => (
            <li
              key={c.slug}
              className={cn(
                "border-trait bg-carte flex items-center gap-2 rounded-xl border p-2.5",
                !c.actif && "opacity-60",
              )}
            >
              <span className="flex flex-col">
                <button
                  type="button"
                  onClick={() => deplacer(i, -1)}
                  aria-label={`Monter ${c.nom}`}
                  className="p-0.5"
                >
                  <ArrowUp className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => deplacer(i, 1)}
                  aria-label={`Descendre ${c.nom}`}
                  className="p-0.5"
                >
                  <ArrowDown className="size-4" aria-hidden />
                </button>
              </span>
              <input
                value={c.nom}
                onChange={(e) =>
                  setCategories((l) =>
                    l.map((x) => (x.slug === c.slug ? { ...x, nom: e.target.value } : x)),
                  )
                }
                className={cn(champ, "flex-1")}
                aria-label="Nom de la catégorie"
              />
              <label className="flex flex-none items-center gap-1.5 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={c.actif}
                  onChange={(e) =>
                    setCategories((l) =>
                      l.map((x) => (x.slug === c.slug ? { ...x, actif: e.target.checked } : x)),
                    )
                  }
                />
                Ouverte
              </label>
            </li>
          ))}
        </ul>
        <p className="text-encre-3 mt-2 text-xs">
          Immobilier et Animaux ont des règles légales en plus (étiquette énergie, identification
          des animaux) : à ouvrir une fois la modération prête.
        </p>
      </section>

      <section>
        <h3 className="surtitre mb-3">Limites anti-abus</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["activesParticulier", "Annonces actives par particulier"],
              ["depotsParJour", "Dépôts par jour et par compte"],
              ["seuilSignalements", "Signalements avant masquage"],
            ] as const
          ).map(([k, t]) => (
            <label key={k} className="text-encre-3 text-xs font-bold">
              {t}
              <input
                value={limites[k]}
                onChange={(e) =>
                  setLimites((l) => ({ ...l, [k]: e.target.value as unknown as number }))
                }
                inputMode="numeric"
                className={cn(champ, "mt-1")}
              />
            </label>
          ))}
        </div>
      </section>

      <div className="bg-fond/90 sticky bottom-20 flex flex-wrap items-center gap-3 py-3 backdrop-blur lg:bottom-0">
        <button
          type="button"
          disabled={enCours}
          onClick={enregistrer}
          className="bg-accent inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-bold text-black disabled:opacity-60"
        >
          {enCours ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4" aria-hidden />
          )}
          Enregistrer les réglages
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
    </div>
  )
}
