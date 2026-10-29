"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, type CSSProperties } from "react"
import { BOUTIQUE, PRODUITS, prix, univers } from "@/lib/zaza/boutique"
import { panier, usePanier } from "@/lib/zaza/panier"
import { Dessin } from "./Dessins"

export function BoutonPanier() {
  const { lignes } = usePanier()
  const nombre = lignes.reduce((s, l) => s + l.quantite, 0)
  return (
    <button
      type="button"
      onClick={panier.ouvrir}
      className="text-nuit hover:bg-creme-2 relative grid size-11 place-items-center rounded-full transition"
      aria-label={nombre ? `Panier, ${nombre} article${nombre > 1 ? "s" : ""}` : "Panier vide"}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
        <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
      </svg>
      {nombre > 0 && (
        <span className="bg-or text-nuit absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full px-1 text-[0.7rem] leading-5 font-bold">
          {nombre}
        </span>
      )}
    </button>
  )
}

export function AjouterAuPanier({
  slug,
  disponible,
  grand = false,
}: {
  slug: string
  disponible: boolean
  grand?: boolean
}) {
  const taille = grand ? "h-14 px-7 text-base" : "h-11 px-5 text-sm"
  if (!disponible) {
    return (
      <button
        type="button"
        disabled
        className={`${taille} border-filet text-encre-2 cursor-not-allowed rounded-full border font-semibold`}
      >
        Indisponible pour le moment
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={() => panier.ajouter(slug)}
      className={`${taille} bg-nuit text-papier hover:bg-nuit-2 rounded-full font-semibold transition active:scale-[0.98]`}
    >
      Ajouter au panier
    </button>
  )
}

export function TiroirPanier() {
  const { lignes, ouvert } = usePanier()

  useEffect(() => {
    if (!ouvert) return
    const echap = (e: KeyboardEvent) => e.key === "Escape" && panier.fermer()
    const avant = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", echap)
    return () => {
      document.body.style.overflow = avant
      window.removeEventListener("keydown", echap)
    }
  }, [ouvert])

  const details = lignes.flatMap((l) => {
    const p = PRODUITS.find((x) => x.slug === l.slug)
    return p ? [{ ...l, produit: p }] : []
  })
  const prixInconnu = details.some((d) => d.produit.prix === null)
  const total = details.reduce((s, d) => s + (d.produit.prix ?? 0) * d.quantite, 0)

  return (
    <div
      className={`fixed inset-0 z-50 ${ouvert ? "" : "pointer-events-none"}`}
      aria-hidden={!ouvert}
    >
      <div
        onClick={panier.fermer}
        className={`voile bg-encre/40 absolute inset-0 ${ouvert ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className={`tiroir bg-creme absolute top-0 right-0 flex h-full w-full max-w-md flex-col ${ouvert ? "translate-x-0 shadow-2xl" : "translate-x-full"}`}
      >
        <div className="store store-or shrink-0" />
        <div className="flex items-center justify-between px-6 pt-8 pb-4">
          <h2 className="font-display text-nuit text-3xl italic">Votre panier</h2>
          <button
            type="button"
            onClick={panier.fermer}
            className="text-nuit hover:bg-creme-2 grid size-11 place-items-center rounded-full"
            aria-label="Fermer le panier"
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
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {details.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-nuit text-2xl">Rien pour l&apos;instant.</p>
              <Link
                href="/boutique"
                onClick={panier.fermer}
                className="text-nuit decoration-or mt-4 inline-block font-semibold underline decoration-2 underline-offset-4"
              >
                Voir la sélection
              </Link>
            </div>
          ) : (
            <ul className="divide-filet divide-y">
              {details.map(({ slug, quantite, produit: p }) => {
                const u = univers(p.univers)
                return (
                  <li key={slug} className="flex gap-4 py-4">
                    <div
                      className="etiquette relative grid size-20 shrink-0 place-items-center overflow-hidden"
                      style={{ "--teinte": u?.teinte, color: u?.teinte } as CSSProperties}
                    >
                      {p.photo ? (
                        <Image
                          src={p.photo}
                          alt=""
                          fill
                          sizes="80px"
                          className="rounded-[10px] bg-white object-contain p-1.5"
                        />
                      ) : (
                        u && <Dessin nom={u.dessin} className="size-12" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-nuit text-lg leading-tight">{p.nom}</p>
                      <p className="text-encre-2 mt-0.5 text-sm">
                        {p.prix === null ? "Prix à confirmer" : prix(p.prix)}
                      </p>
                      <div className="border-filet mt-2 inline-flex items-center rounded-full border">
                        <button
                          type="button"
                          onClick={() => panier.modifier(slug, -1)}
                          className="text-nuit grid size-9 place-items-center text-lg"
                          aria-label={`Retirer un ${p.nom}`}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">
                          {quantite}
                        </span>
                        <button
                          type="button"
                          onClick={() => panier.modifier(slug, 1)}
                          className="text-nuit grid size-9 place-items-center text-lg"
                          aria-label={`Ajouter un ${p.nom}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {details.length > 0 && (
          <div className="border-filet bg-papier border-t px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-baseline justify-between">
              <span className="text-encre-2 text-sm font-semibold tracking-wide uppercase">
                Total
              </span>
              <span className="font-display text-nuit text-3xl tabular-nums">
                {prixInconnu ? "À confirmer" : prix(total)}
              </span>
            </div>
            <button
              type="button"
              disabled
              className="bg-nuit/40 text-papier mt-4 h-14 w-full cursor-not-allowed rounded-full font-semibold"
            >
              Payer en ligne
            </button>
            <p className="text-encre-2 mt-3 text-center text-xs leading-relaxed">
              Maquette : le paiement en ligne sera branché à la mise en ligne. En attendant,
              réservez par téléphone.
            </p>
            <a
              href={`tel:${BOUTIQUE.telephone.replace(/\s/g, "")}`}
              className="border-nuit text-nuit mt-3 flex h-12 w-full items-center justify-center rounded-full border font-semibold"
            >
              Réserver par téléphone
            </a>
          </div>
        )}
      </aside>
    </div>
  )
}
