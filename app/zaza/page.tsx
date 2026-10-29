import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { Dessin } from "@/components/zaza/Dessins"
import { CarteProduit } from "@/components/zaza/Gabarit"
import logo from "@/components/zaza/logo-zaza.webp"
import { StatutOuverture, TableHoraires } from "@/components/zaza/Vivants"
import { BOUTIQUE, PHOTO_ACCUEIL, PRODUITS, SELECTION, UNIVERS } from "@/lib/zaza/boutique"

/** Le soleil couché sur l'eau, aux couleurs des palmes du logo, coupé de bandes comme sur les affiches de la Riviera. */
function SoleilRiviera({ className }: { className?: string }) {
  const bandes = [
    [118, 3],
    [128, 4],
    [139, 5],
    [151, 6],
    [164, 8],
    [178, 10],
  ]
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sol" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-turquoise)" />
          <stop offset="0.5" stopColor="var(--color-menthe)" />
          <stop offset="1" stopColor="var(--color-or-clair)" />
        </linearGradient>
        <mask id="horizon">
          <rect width="200" height="200" fill="#fff" />
          {bandes.map(([y, h]) => (
            <rect key={y} x="0" y={y} width="200" height={h} fill="#000" />
          ))}
        </mask>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#sol)" mask="url(#horizon)" />
    </svg>
  )
}

const QUESTIONS: { q: string; r: string | null }[] = [
  {
    q: "Faut-il être majeur pour acheter ?",
    r: "Oui. La vente de produits au CBD est réservée aux personnes majeures, en boutique comme en ligne.",
  },
  {
    q: "Le CBD est-il un médicament ?",
    r: "Non. Les produits au CBD ne sont pas des médicaments et ne remplacent pas un avis médical.",
  },
  {
    q: "Peut-on se faire conseiller avant d'acheter ?",
    r: "Oui : passez en boutique, du lundi au samedi, 14 Grand Rue à Sierck-les-Bains.",
  },
  { q: "Livrez-vous à domicile ?", r: null },
]

export default function Accueil() {
  return (
    <>
      {/* ── Ouverture ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-4 px-5 pt-4 pb-16 md:grid-cols-[1.1fr_1fr] md:pt-16 md:pb-24">
          <div className="relative order-1 mx-auto w-full max-w-[18rem] md:order-2 md:max-w-none">
            <SoleilRiviera className="soleil w-full" />
            <Image
              src={logo}
              alt="Logo Zaza Riviera Herbs : une feuille de chanvre coiffée de palmes"
              className="medaillon absolute top-[7%] left-[16%] w-[68%] rounded-full"
              sizes="(min-width: 768px) 360px, 180px"
              priority
            />
          </div>

          <div className="relative order-2 md:order-1">
            <StatutOuverture />
            <h1 className="text-nuit mt-5 leading-[0.82]">
              <span className="font-display block text-[7rem] font-semibold tracking-tight italic md:text-[10rem]">
                Zaza
              </span>
              <span className="mt-3 block text-sm font-bold tracking-[0.55em] uppercase md:text-base">
                Riviera Herbs
              </span>
            </h1>
            <p className="text-encre-2 mt-6 max-w-md text-lg leading-relaxed">
              CBD shop premium, beauté naturelle &amp; bien-être sensoriel. Au {BOUTIQUE.rue},{" "}
              {BOUTIQUE.repere}, à {BOUTIQUE.ville}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/boutique"
                className="bg-nuit text-papier hover:bg-nuit-2 inline-flex h-13 items-center rounded-full px-7 font-semibold transition"
              >
                Découvrir la sélection
              </Link>
              <Link
                href="/#boutique"
                className="border-nuit/30 text-nuit hover:bg-creme-2 inline-flex h-13 items-center rounded-full border px-7 font-semibold transition"
              >
                Venir en boutique
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Les univers ───────────────────────────────────────────────── */}
      <section id="univers" className="scroll-mt-24 pb-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-encre-2 text-[0.68rem] font-bold tracking-[0.3em] uppercase">
            Les univers
          </p>
          <h2 className="font-display text-nuit mt-2 text-4xl md:text-5xl">
            Du flacon <em>au pré-roulé.</em>
          </h2>
        </div>
        <ul className="sans-barre mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-auto md:grid md:max-w-6xl md:grid-cols-6 md:overflow-visible">
          {UNIVERS.map((u) => (
            <li key={u.slug} className="w-36 shrink-0 snap-start md:w-auto">
              <Link href={`/boutique?univers=${u.slug}`} className="lien-etiquette block">
                <div
                  className="etiquette grid aspect-[3/4] place-items-center p-3"
                  style={{ "--teinte": u.teinte, color: u.teinte } as CSSProperties}
                >
                  {u.photo ? (
                    <div className="relative size-full overflow-hidden rounded-md bg-white">
                      <Image
                        src={u.photo}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 180px, 144px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <Dessin nom={u.dessin} className="size-16" />
                  )}
                </div>
                <p className="text-nuit mt-3 text-center text-sm font-semibold">{u.nom}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── La sélection ──────────────────────────────────────────────── */}
      <section className="bg-papier py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-encre-2 text-[0.68rem] font-bold tracking-[0.3em] uppercase">
                La sélection
              </p>
              <h2 className="font-display text-nuit mt-2 text-4xl md:text-5xl">
                Sur le comptoir <em>en ce moment.</em>
              </h2>
            </div>
            <Link
              href="/boutique"
              className="text-nuit decoration-or font-semibold underline decoration-2 underline-offset-4"
            >
              Tout voir
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
            {PRODUITS.filter((p) => SELECTION.includes(p.slug)).map((p) => (
              <div key={p.slug}>
                <CarteProduit produit={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── La boutique ───────────────────────────────────────────────── */}
      <section id="boutique" className="bg-nuit text-papier scroll-mt-20">
        <div className="store store-or" />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-20 pb-20 md:grid-cols-2">
          <div>
            <p className="text-or-clair text-[0.68rem] font-bold tracking-[0.3em] uppercase">
              La boutique
            </p>
            <h2 className="font-display mt-2 text-4xl leading-tight md:text-5xl">
              Venez sentir, <em>comparer, demander.</em>
            </h2>
            <address className="text-papier/90 mt-8 text-lg leading-relaxed not-italic">
              {BOUTIQUE.rue}
              <br />
              {BOUTIQUE.codePostal} {BOUTIQUE.ville}
              <br />
              <span className="text-papier/60">
                {BOUTIQUE.repere[0].toUpperCase() + BOUTIQUE.repere.slice(1)}
              </span>
            </address>
            <div className="mt-6">
              <StatutOuverture clair />
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <a
                href={`tel:${BOUTIQUE.telephone.replace(/\s/g, "")}`}
                className="bg-or-clair text-nuit hover:bg-or flex h-12 items-center justify-center rounded-full font-semibold transition"
              >
                Appeler
              </a>
              <a
                href={BOUTIQUE.itineraire}
                target="_blank"
                rel="noopener noreferrer"
                className="border-papier/30 hover:bg-papier/10 flex h-12 items-center justify-center rounded-full border font-semibold transition"
              >
                Itinéraire
              </a>
              <a
                href={`mailto:${BOUTIQUE.email}`}
                className="border-papier/30 hover:bg-papier/10 flex h-12 items-center justify-center rounded-full border font-semibold transition"
              >
                Écrire
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <figure className="bg-nuit-2 ring-papier/10 relative aspect-[4/3] overflow-hidden rounded-2xl ring-1">
              <Image
                src={PHOTO_ACCUEIL}
                alt="Photo de la page d'accueil de l'ancien site Zaza Riviera Herbs"
                fill
                sizes="(min-width: 768px) 560px, 92vw"
                className="object-cover"
              />
            </figure>
            <div className="bg-nuit-2/60 ring-papier/10 rounded-2xl p-6 ring-1 md:p-8">
              <p className="text-or-clair mb-2 text-[0.68rem] font-bold tracking-[0.3em] uppercase">
                Horaires
              </p>
              <TableHoraires />
            </div>
          </div>
        </div>
      </section>

      {/* ── Questions ─────────────────────────────────────────────────── */}
      <section id="questions" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-3xl px-5">
          <p className="text-encre-2 text-[0.68rem] font-bold tracking-[0.3em] uppercase">
            Questions
          </p>
          <h2 className="font-display text-nuit mt-2 text-4xl md:text-5xl">
            Avant de <em>passer.</em>
          </h2>
          <div className="divide-filet border-filet mt-8 divide-y border-y">
            {QUESTIONS.map(({ q, r }) => (
              <details key={q} className="group py-5">
                <summary className="font-display text-nuit flex cursor-pointer list-none items-center justify-between gap-4 text-xl [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="border-filet grid size-8 shrink-0 place-items-center rounded-full border text-lg transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="text-encre-2 pt-3 leading-relaxed">
                  {r ?? <span className="a-completer">Réponse à compléter par Giorgio</span>}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
