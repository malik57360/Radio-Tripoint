"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { direct } from "@/lib/direction/donnees"
import { Barres, Carte, Tuile, libellePage, nomPays, nombre } from "./ui"

type DonneesDirect = NonNullable<Awaited<ReturnType<typeof direct>>>

const PERIODE_MS = 8000

const APPAREILS: Record<string, string> = {
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

/** « En ce moment » : relu toutes les 8 s, sans recharger la page. */
export function Direct({ initial }: { initial: DonneesDirect }) {
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

  if (d.erreur)
    return (
      <Carte>
        <p className="text-alerte text-sm font-semibold">
          Le compteur en direct ne répond pas pour le moment.
        </p>
      </Carte>
    )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <div className="border-direct/50 bg-carte col-span-2 flex flex-col rounded-xl border p-4 lg:col-span-1">
          <p className="surtitre flex items-center gap-2">
            <span className="point-direct" aria-hidden /> En ligne maintenant
          </p>
          <p className="mt-2 text-[3.2rem] leading-none font-extrabold tracking-tight">
            {nombre(d.enLigne)}
          </p>
          <p className="text-encre-3 mt-2 text-xs" aria-live="polite">
            {horsLigne
              ? "Connexion perdue, nouvel essai…"
              : `${d.enLigne > 1 ? "personnes" : "personne"} sur le site · actualisé toutes les 8 s`}
          </p>
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

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Carte titre="Pages ouvertes en ce moment">
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
