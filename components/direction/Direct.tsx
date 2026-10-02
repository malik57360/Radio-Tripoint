"use client"

import { Headphones, Radio } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { direct } from "@/lib/direction/donnees"
import { Histogramme } from "./Histogramme"
import { Barres, Carte, Tuile, libellePage, nomPays, nombre } from "./ui"

type DonneesDirect = NonNullable<Awaited<ReturnType<typeof direct>>>
type DirectOk = Extract<DonneesDirect, { erreur: false }>

const PERIODE_MS = 8000

export const APPAREILS: Record<string, string> = {
  mobile: "Téléphone",
  ordinateur: "Ordinateur",
  tablette: "Tablette",
}
const LANGUES: Record<string, string> = {
  fr: "Français",
  de: "Allemand",
  lb: "Luxembourgeois",
  en: "Anglais",
  es: "Espagnol",
}

/** Relit « en ce moment » toutes les 8 s, et dès qu'on revient sur l'onglet. */
function useDirect(initial: DonneesDirect) {
  const [d, setD] = useState(initial)
  const [horsLigne, setHorsLigne] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let actif = true
    const lire = async () => {
      if (document.visibilityState !== "visible") return
      try {
        const r = await fetch("/api/direction/direct", { cache: "no-store" })
        if (r.status === 401) return router.push("/direction/connexion")
        const j = (await r.json()) as DonneesDirect
        if (actif) {
          setD(j)
          setHorsLigne(false)
        }
      } catch {
        if (actif) setHorsLigne(true)
      }
    }
    const minuterie = setInterval(lire, PERIODE_MS)
    document.addEventListener("visibilitychange", lire)
    return () => {
      actif = false
      clearInterval(minuterie)
      document.removeEventListener("visibilitychange", lire)
    }
  }, [router])

  return { d, horsLigne }
}

function Indisponible() {
  return (
    <Carte>
      <p className="text-alerte text-sm font-semibold">
        Le compteur en direct ne répond pas pour le moment.
      </p>
    </Carte>
  )
}

function TuileEnLigne({ d, horsLigne }: { d: DirectOk; horsLigne: boolean }) {
  return (
    <div className="border-direct/50 bg-carte flex flex-col rounded-xl border p-4">
      <p className="surtitre flex items-center gap-2">
        <span className="point-direct" aria-hidden /> En ligne maintenant
      </p>
      <p className="mt-2 text-[3.2rem] leading-none font-extrabold tracking-tight">
        {nombre(d.enLigne)}
      </p>
      <p className="text-encre-3 mt-2 text-xs">
        {horsLigne
          ? "Connexion perdue, nouvel essai…"
          : `${d.enLigne > 1 ? "personnes" : "personne"} sur le site · relu toutes les 8 s`}
      </p>
    </div>
  )
}

/** Version courte pour la vue d'ensemble. */
export function EnLigneMini({ initial }: { initial: DonneesDirect }) {
  const { d, horsLigne } = useDirect(initial)
  if (d.erreur) return <Indisponible />
  return <TuileEnLigne d={d} horsLigne={horsLigne} />
}

const depuis = (ms: number) => {
  const min = Math.max(0, Math.floor(ms / 60_000))
  if (min < 1) return "à l'instant"
  if (min < 60) return `${min} min`
  return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`
}

/** Page « En direct » complète. */
export function Direct({ initial }: { initial: DonneesDirect }) {
  const { d, horsLigne } = useDirect(initial)
  if (d.erreur) return <Indisponible />

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <TuileEnLigne d={d} horsLigne={horsLigne} />
        </div>
        <Tuile libelle="Écoutent le direct" valeur={d.auditeursDirect} detail="depuis le site" />
        <Tuile libelle="Écoutent un podcast" valeur={d.auditeursPodcast} />
        <Tuile libelle="Pic du jour" valeur={d.picJour} detail="personnes en même temps" />
        <Tuile
          libelle="Record"
          valeur={d.record?.n ?? null}
          detail={
            d.record
              ? `le ${new Date(`${d.record.jour}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`
              : undefined
          }
        />
      </div>

      <Carte titre="Personnes en ligne aujourd'hui" note="maximum par tranche de 5 minutes">
        <Histogramme
          serre
          pas={36}
          hauteur={140}
          unite="en ligne"
          points={d.courbe.map((c) => ({
            cle: c.tranche,
            etiquette: c.tranche.endsWith(":00") ? c.tranche.slice(0, 2) + "h" : "",
            valeur: c.n,
            detail: c.tranche,
          }))}
        />
      </Carte>

      <Carte titre="Qui est là" note="anonyme : aucune donnée personnelle">
        {d.actifs.length === 0 ? (
          <p className="text-encre-3 text-sm">Personne sur le site en ce moment.</p>
        ) : (
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="text-encre-3 text-xs">
                <tr>
                  <th className="px-1 pb-2 font-semibold">Page</th>
                  <th className="px-1 pb-2 font-semibold">Écoute</th>
                  <th className="px-1 pb-2 font-semibold">Lieu</th>
                  <th className="px-1 pb-2 font-semibold">Appareil</th>
                  <th className="px-1 pb-2 text-right font-semibold">Depuis</th>
                </tr>
              </thead>
              <tbody className="divide-trait divide-y">
                {d.actifs.map((a, i) => (
                  <tr key={i}>
                    <td className="max-w-[16rem] truncate px-1 py-2">{libellePage(a.page)}</td>
                    <td className="px-1 py-2">
                      {a.etat === "direct" ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          <Radio className="text-direct size-3.5" aria-hidden /> Direct
                        </span>
                      ) : a.etat === "podcast" ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          <Headphones className="text-accent size-3.5" aria-hidden /> Podcast
                        </span>
                      ) : (
                        <span className="text-encre-3">—</span>
                      )}
                    </td>
                    <td className="px-1 py-2">{a.lieu ?? "—"}</td>
                    <td className="px-1 py-2">
                      {APPAREILS[a.appareil] ?? a.appareil}
                      <span className="text-encre-3"> · {LANGUES[a.langue] ?? a.langue}</span>
                    </td>
                    <td className="text-encre-2 px-1 py-2 text-right">{depuis(d.a - a.depuis)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Carte>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Carte titre="Pages ouvertes">
          <Barres
            lignes={d.pages.map((p) => ({ cle: p.cle, libelle: libellePage(p.cle), n: p.n }))}
            vide="Personne sur le site."
          />
        </Carte>
        <Carte titre="D'où ils sont">
          <Barres
            lignes={d.villes.length ? d.villes : d.pays.map((p) => ({ ...p, cle: nomPays(p.cle) }))}
            vide="—"
          />
        </Carte>
        <Carte titre="Appareils">
          <Barres
            lignes={d.appareils.map((a) => ({
              cle: a.cle,
              libelle: APPAREILS[a.cle] ?? a.cle,
              n: a.n,
            }))}
            vide="—"
          />
        </Carte>
        <Carte titre="Langue du site">
          <Barres
            lignes={d.langues.map((a) => ({
              cle: a.cle,
              libelle: LANGUES[a.cle] ?? a.cle,
              n: a.n,
            }))}
            vide="—"
          />
        </Carte>
      </div>

      <Carte titre="Aujourd'hui, depuis minuit">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Visites", d.compteurs.visites],
            ["Écoutes du direct lancées", d.compteurs.direct],
            ["Podcasts lancés", d.compteurs.podcast],
            ["Questions à Tripo", d.compteurs.tripo],
          ].map(([l, v]) => (
            <div key={l as string}>
              <dt className="text-encre-3 text-xs">{l}</dt>
              <dd className="mt-1 text-2xl font-extrabold">{nombre(Number(v) || 0)}</dd>
            </div>
          ))}
        </dl>
      </Carte>
    </div>
  )
}
