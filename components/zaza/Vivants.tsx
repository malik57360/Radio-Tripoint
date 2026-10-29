"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useSyncExternalStore } from "react"
import { HORAIRES, LIENS, heure } from "@/lib/zaza/boutique"
import logo from "./logo-zaza.webp"

/* ── Ouvert maintenant ? ─────────────────────────────────────────────────
 * Calculé à l'heure de Sierck-les-Bains (Europe/Paris), quel que soit le
 * fuseau du visiteur. Rien côté serveur : l'heure n'y a pas de sens.
 */

const JOURS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function maintenantAParis() {
  const parties = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date())
  const val = (t: string) => parties.find((p) => p.type === t)?.value ?? ""
  return {
    jour: JOURS_EN.indexOf(val("weekday")) + 1,
    minutes: Number(val("hour")) * 60 + Number(val("minute")),
  }
}

function statut(): string {
  const { jour, minutes } = maintenantAParis()
  const ajd = HORAIRES.find((h) => h.jour === jour)
  if (ajd?.ouvre != null && ajd.ferme != null) {
    if (minutes >= ajd.ouvre && minutes < ajd.ferme)
      return `ouvert|Ouvert · jusqu'à ${heure(ajd.ferme)}`
    if (minutes < ajd.ouvre) return `ferme|Fermé · ouvre à ${heure(ajd.ouvre)}`
  }
  for (let k = 1; k <= 7; k++) {
    const h = HORAIRES.find((x) => x.jour === ((jour - 1 + k) % 7) + 1)
    if (h?.ouvre != null)
      return `ferme|Fermé · ouvre ${k === 1 ? "demain" : h.nom.toLowerCase()} à ${heure(h.ouvre)}`
  }
  return "ferme|Fermé"
}

const abonnerMinute = (f: () => void) => {
  const t = setInterval(f, 30_000)
  return () => clearInterval(t)
}

export function StatutOuverture({ clair = false }: { clair?: boolean }) {
  const s = useSyncExternalStore(abonnerMinute, statut, () => "")
  if (!s) return <span className="inline-block h-8" aria-hidden="true" />
  const [etat, texte] = s.split("|")
  const ouvert = etat === "ouvert"
  return (
    <span
      className={`inline-flex h-8 items-center gap-2 rounded-full px-3.5 text-sm font-semibold ${
        clair
          ? "bg-papier/10 text-papier ring-papier/25 ring-1"
          : "bg-papier text-nuit ring-filet ring-1"
      }`}
    >
      <span className="relative flex size-2.5">
        {ouvert && (
          <span className="bg-chanvre absolute inset-0 animate-ping rounded-full opacity-70 motion-reduce:hidden" />
        )}
        <span
          className={`relative size-2.5 rounded-full ${ouvert ? "bg-chanvre ring-nuit/15 ring-1" : "bg-encre-2/50"}`}
        />
      </span>
      {texte}
    </span>
  )
}

/** Jour de la semaine à Paris, pour surligner la ligne d'aujourd'hui. */
export function useJourParis() {
  return useSyncExternalStore(
    abonnerMinute,
    () => maintenantAParis().jour,
    () => 0,
  )
}

export function TableHoraires() {
  const jour = useJourParis()
  return (
    <dl className="divide-papier/15 divide-y">
      {HORAIRES.map((h) => {
        const ajd = h.jour === jour
        return (
          <div
            key={h.jour}
            className={`flex items-center justify-between py-2.5 ${ajd ? "text-or-clair font-semibold" : "text-papier/85"}`}
          >
            <dt className="flex items-center gap-2">
              {h.nom}
              {ajd && (
                <span className="bg-or-clair/15 rounded-full px-2 py-0.5 text-[0.68rem] tracking-wider uppercase">
                  Aujourd&apos;hui
                </span>
              )}
            </dt>
            <dd className="tabular-nums">
              {h.ouvre != null && h.ferme != null
                ? `${heure(h.ouvre)} – ${heure(h.ferme)}`
                : "Fermé"}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

/* ── Contrôle de l'âge ───────────────────────────────────────────────────
 * Obligatoire pour un commerce de CBD : la vente est interdite aux mineurs.
 * Le choix est gardé dans le navigateur ; rien n'est rendu côté serveur pour
 * ne pas faire clignoter l'écran chez ceux qui ont déjà répondu.
 */

const CLE_AGE = "zaza-majeur"
const abonnesAge = new Set<() => void>()
const lireAge = () => {
  try {
    return localStorage.getItem(CLE_AGE) ?? "inconnu"
  } catch {
    return "inconnu"
  }
}
const repondre = (r: "oui" | "non") => {
  try {
    if (r === "oui") localStorage.setItem(CLE_AGE, "oui")
  } catch {
    // navigation privée : on redemandera
  }
  memoire = r
  abonnesAge.forEach((f) => f())
}
let memoire: string | null = null

export function PorteAge() {
  const age = useSyncExternalStore(
    (f) => {
      abonnesAge.add(f)
      return () => abonnesAge.delete(f)
    },
    () => memoire ?? lireAge(),
    () => "oui",
  )
  if (age === "oui") return null

  return (
    <div
      className="bg-nuit/95 fixed inset-0 z-[60] grid place-items-center p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-titre"
    >
      <div className="bg-creme w-full max-w-sm overflow-hidden rounded-2xl text-center shadow-2xl">
        <div className="store" />
        <div className="px-7 pt-10 pb-8">
          <Image
            src={logo}
            alt=""
            width={88}
            height={88}
            className="mx-auto size-22 rounded-full"
          />
          {age === "non" ? (
            <>
              <h2 id="age-titre" className="font-display text-nuit mt-4 text-3xl">
                À bientôt.
              </h2>
              <p className="text-encre-2 mt-3">
                La vente de produits au CBD est réservée aux personnes majeures.
              </p>
            </>
          ) : (
            <>
              <p className="text-encre-2 mt-4 text-xs font-bold tracking-[0.25em] uppercase">
                Zaza Riviera Herbs
              </p>
              <h2 id="age-titre" className="font-display text-nuit mt-2 text-3xl leading-tight">
                Avez-vous 18 ans ou plus&nbsp;?
              </h2>
              <p className="text-encre-2 mt-3 text-sm">
                Ce site présente des produits au CBD, réservés aux personnes majeures.
              </p>
              <div className="mt-7 grid gap-3">
                <button
                  type="button"
                  onClick={() => repondre("oui")}
                  className="bg-nuit text-papier hover:bg-nuit-2 h-13 rounded-full font-semibold transition"
                >
                  Oui, j&apos;ai 18 ans ou plus
                </button>
                <button
                  type="button"
                  onClick={() => repondre("non")}
                  className="border-filet text-nuit h-12 rounded-full border font-semibold"
                >
                  Non
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Menu sur téléphone ─────────────────────────────────────────────────── */

export function MenuMobile() {
  const [ouvert, setOuvert] = useState(false)
  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        className="text-nuit hover:bg-creme-2 grid size-11 place-items-center rounded-full"
        aria-expanded={ouvert}
        aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          aria-hidden="true"
        >
          {ouvert ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
        </svg>
      </button>
      {ouvert && (
        <nav className="border-filet bg-creme absolute inset-x-0 top-full z-40 border-b px-5 pt-2 pb-6 shadow-lg">
          {LIENS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOuvert(false)}
              className="border-filet font-display text-nuit block border-b py-4 text-2xl"
            >
              {l.nom}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
