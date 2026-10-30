import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Etiquette } from "@/components/zaza/Gabarit"
import { AjouterAuPanier } from "@/components/zaza/Panier"
import { StatutOuverture } from "@/components/zaza/Vivants"
import { BOUTIQUE, PRODUITS, prix, produit, univers } from "@/lib/zaza/boutique"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return PRODUITS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = produit((await params).slug)
  return { title: p?.nom ?? "Produit" }
}

export default async function FicheProduit({ params }: Props) {
  const p = produit((await params).slug)
  if (!p) notFound()
  const u = univers(p.univers)

  return (
    <div className="mx-auto max-w-6xl px-5 pt-8 pb-24">
      <nav className="text-encre-2 text-sm" aria-label="Fil d'Ariane">
        <Link href="/boutique" className="hover:text-nuit">
          La sélection
        </Link>
        <span className="mx-2">/</span>
        {u && (
          <Link href={`/boutique?univers=${u.slug}`} className="hover:text-nuit">
            {u.nom}
          </Link>
        )}
      </nav>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="mx-auto w-full max-w-md">
          <Etiquette produit={p} grande />
          {!p.photo && (
            <p className="mt-4 text-center">
              <span className="a-completer">Photos à envoyer</span>
            </p>
          )}
        </div>

        <div className="md:pt-6">
          <p className="text-encre-2 text-[0.68rem] font-bold tracking-[0.3em] uppercase">
            {u?.nom}
          </p>
          <h1 className="font-display text-nuit mt-2 text-5xl leading-tight">{p.nom}</h1>
          {p.detail && <p className="text-encre-2 mt-3 text-lg">{p.detail}</p>}
          <p className="font-display text-encre mt-6 text-4xl tabular-nums">
            {p.prix === null ? <span className="a-completer">Prix à compléter</span> : prix(p.prix)}
          </p>

          <div className="mt-8">
            <AjouterAuPanier slug={p.slug} disponible={p.disponible} grand />
          </div>

          <div className="border-filet mt-10 border-t pt-6">
            <h2 className="font-display text-nuit text-2xl">Description</h2>
            <p className="mt-3">
              <span className="a-completer">
                Composition, taux de CBD, conseils d&apos;utilisation : à compléter
              </span>
            </p>
          </div>

          <div className="bg-papier ring-filet mt-8 rounded-2xl p-6 ring-1">
            <p className="font-display text-nuit text-xl">
              Envie d&apos;un conseil avant d&apos;acheter&nbsp;?
            </p>
            <p className="text-encre-2 mt-2 text-sm leading-relaxed">
              Passez en boutique, {BOUTIQUE.rue} à {BOUTIQUE.ville}, {BOUTIQUE.repere}.
            </p>
            <div className="mt-4">
              <StatutOuverture />
            </div>
          </div>

          <p className="text-encre-2/80 mt-8 text-xs leading-relaxed">
            Vente réservée aux personnes majeures. Les produits au CBD ne sont pas des médicaments
            et ne remplacent pas un avis médical.
          </p>
        </div>
      </div>
    </div>
  )
}
