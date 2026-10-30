import type { Metadata } from "next"
import Link from "next/link"
import type { CSSProperties } from "react"
import { Dessin } from "@/components/zaza/Dessins"
import { CarteProduit } from "@/components/zaza/Gabarit"
import { PRODUITS, UNIVERS, univers } from "@/lib/zaza/boutique"

export const metadata: Metadata = { title: "La sélection" }

export default async function Selection({
  searchParams,
}: {
  searchParams: Promise<{ univers?: string | string[] }>
}) {
  const brut = (await searchParams).univers
  const choisi = typeof brut === "string" ? univers(brut) : undefined
  const listes = choisi ? [choisi] : UNIVERS

  return (
    <div className="mx-auto max-w-6xl px-5 pt-10 pb-24">
      <p className="text-encre-2 text-[0.68rem] font-bold tracking-[0.3em] uppercase">
        La sélection
      </p>
      <h1 className="font-display text-nuit mt-2 text-5xl md:text-6xl">
        {choisi ? (
          choisi.nom
        ) : (
          <>
            Tout le <em>comptoir.</em>
          </>
        )}
      </h1>

      <nav
        className="sans-barre -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1"
        aria-label="Univers"
      >
        <Puce href="/boutique" actif={!choisi}>
          Tout
        </Puce>
        {UNIVERS.map((u) => (
          <Puce key={u.slug} href={`/boutique?univers=${u.slug}`} actif={choisi?.slug === u.slug}>
            {u.nom}
          </Puce>
        ))}
      </nav>

      <div className="mt-12 space-y-16">
        {listes.map((u) => {
          const produits = PRODUITS.filter((p) => p.univers === u.slug)
          return (
            <section key={u.slug} aria-labelledby={`u-${u.slug}`}>
              {!choisi && (
                <h2
                  id={`u-${u.slug}`}
                  className="font-display text-nuit mb-6 flex items-center gap-3 text-2xl"
                >
                  <span className="h-px w-8" style={{ background: u.teinte }} />
                  {u.nom}
                </h2>
              )}
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
                {produits.map((p) => (
                  <div key={p.slug}>
                    <CarteProduit produit={p} />
                  </div>
                ))}
                {/* Ce que Giorgio doit encore envoyer, visible tel quel dans la maquette. */}
                <div>
                  <div
                    className="border-filet grid aspect-[4/5] place-items-center rounded-[10px] border border-dashed p-6 text-center"
                    style={{ color: u.teinte } as CSSProperties}
                  >
                    <div>
                      <Dessin nom={u.dessin} className="mx-auto size-14 opacity-40" />
                      <p className="text-encre-2 mt-4 text-sm font-semibold">
                        {produits.length ? "Autres produits" : "Produits"} en boutique
                      </p>
                      <p className="mt-2">
                        <span className="a-completer">Fiches à compléter</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {choisi && (
        <Link
          href="/boutique"
          className="text-nuit decoration-or mt-14 inline-block font-semibold underline decoration-2 underline-offset-4"
        >
          Voir tous les univers
        </Link>
      )}
    </div>
  )
}

function Puce({
  href,
  actif,
  children,
}: {
  href: string
  actif: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={actif ? "page" : undefined}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
        actif ? "bg-nuit text-papier" : "bg-papier text-nuit ring-filet hover:bg-creme-2 ring-1"
      }`}
    >
      {children}
    </Link>
  )
}
