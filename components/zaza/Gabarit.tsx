import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { BOUTIQUE, LIENS, type Produit, numero, prix, univers } from "@/lib/zaza/boutique"
import { Dessin } from "./Dessins"
import { BoutonPanier } from "./Panier"
import logo from "./logo-zaza.webp"
import { MenuMobile } from "./Vivants"

export function Logo({ clair = false }: { clair?: boolean }) {
  return (
    <Link
      href="/apercu"
      className={`group flex items-center gap-2.5 leading-none ${clair ? "text-papier" : "text-nuit"}`}
      aria-label="Zaza Riviera Herbs, accueil"
    >
      <Image
        src={logo}
        alt=""
        width={40}
        height={40}
        className={`size-10 rounded-full ${clair ? "ring-papier/20 ring-1" : ""}`}
        priority
      />
      <span className="font-display text-[1.75rem] font-semibold tracking-tight italic">Zaza</span>
      <span className="text-[0.62rem] font-bold tracking-[0.32em] uppercase opacity-80">
        Riviera Herbs
      </span>
    </Link>
  )
}

export function BandeauMaquette() {
  return (
    <p className="bg-nuit text-or-clair px-4 py-1.5 text-center text-xs font-semibold">
      Maquette · rien n&apos;est en ligne · prix relevés sur l&apos;ancien site, à confirmer
    </p>
  )
}

export function Entete() {
  return (
    <header className="bg-creme/92 sticky top-0 z-40 backdrop-blur-md">
      <div className="store h-2.5 [--raie:22px]" />
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 pt-2">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {LIENS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-nuit/80 hover:text-nuit text-sm font-semibold transition"
            >
              {l.nom}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <BoutonPanier />
          <MenuMobile />
        </div>
      </div>
    </header>
  )
}

/** Une étiquette de flacon : la photo du produit dans sa fenêtre, ou son dessin au trait quand il n'y en a pas. */
export function Etiquette({ produit: p, grande = false }: { produit: Produit; grande?: boolean }) {
  const u = univers(p.univers)
  return (
    <div
      className={`etiquette flex aspect-[4/5] flex-col ${grande ? "p-9" : "p-4 md:p-6"}`}
      style={{ "--teinte": u?.teinte } as CSSProperties}
    >
      <div className="text-encre-2 flex items-start justify-between gap-2 px-1 pt-1 text-[0.6rem] font-bold tracking-[0.18em] uppercase">
        <span className="min-w-0 truncate">{u?.nom}</span>
        <span className="font-display shrink-0 text-sm tracking-normal whitespace-nowrap normal-case italic">
          N° {numero(p.slug)}
        </span>
      </div>

      <div className="relative grid flex-1 place-items-center" style={{ color: u?.teinte }}>
        {p.photo ? (
          <div
            className={`ring-filet absolute inset-x-0 overflow-hidden rounded-md bg-white ring-1 ${grande ? "inset-y-3" : "inset-y-2"}`}
          >
            <Image
              src={p.photo}
              alt={p.nom}
              fill
              sizes={grande ? "(min-width: 768px) 420px, 90vw" : "(min-width: 768px) 260px, 45vw"}
              className="object-contain"
            />
          </div>
        ) : (
          <>
            <span
              className="absolute size-[62%] rounded-full opacity-[0.09]"
              style={{ background: u?.teinte }}
            />
            {u && (
              <Dessin
                nom={u.dessin}
                className={`relative ${grande ? "size-[58%]" : "size-[64%]"}`}
              />
            )}
          </>
        )}
        {!p.disponible && (
          <span className="border-encre-2/70 text-encre-2/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-md border-2 px-3 py-1 text-xs font-extrabold tracking-[0.25em] uppercase">
            Épuisé
          </span>
        )}
      </div>

      <div className="text-center">
        <p
          className={`font-display text-nuit leading-tight ${grande ? "text-3xl" : "text-[1.05rem] md:text-xl"}`}
        >
          {p.nom}
        </p>
        <div
          className={`mx-auto h-px w-10 ${grande ? "my-3" : "my-2"}`}
          style={{ background: u?.teinte }}
        />
        <p className="font-display text-encre text-lg tabular-nums">
          {p.prix === null ? <span className="a-completer">Prix à compléter</span> : prix(p.prix)}
        </p>
        <p
          className={`text-encre-2/70 mt-3 text-[0.55rem] font-bold tracking-[0.28em] uppercase ${grande ? "" : "hidden md:block"}`}
        >
          Zaza Riviera Herbs · {BOUTIQUE.ville}
        </p>
      </div>
    </div>
  )
}

export function CarteProduit({ produit }: { produit: Produit }) {
  return (
    <Link
      href={`/produit/${produit.slug}`}
      className="lien-etiquette block focus-visible:outline-none"
    >
      <Etiquette produit={produit} />
      {produit.detail && <p className="text-encre-2 mt-3 text-center text-sm">{produit.detail}</p>}
    </Link>
  )
}

export function PiedDePage() {
  return (
    <footer className="bg-nuit text-papier">
      <div className="store store-or h-2.5 [--raie:22px]" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-16 pb-10 md:grid-cols-3">
        <div>
          <Logo clair />
          <p className="text-papier/70 mt-4 max-w-xs text-sm leading-relaxed">
            {BOUTIQUE.accroche}.
          </p>
        </div>
        <div className="text-papier/80 text-sm leading-relaxed">
          <p className="text-or-clair mb-2 text-[0.68rem] font-bold tracking-[0.25em] uppercase">
            La boutique
          </p>
          <p>{BOUTIQUE.rue}</p>
          <p>
            {BOUTIQUE.codePostal} {BOUTIQUE.ville}
          </p>
          <p className="text-papier/60">{BOUTIQUE.repere}</p>
        </div>
        <div className="text-papier/80 text-sm">
          <p className="text-or-clair mb-2 text-[0.68rem] font-bold tracking-[0.25em] uppercase">
            Suivre
          </p>
          <div className="flex gap-3">
            <a
              href={BOUTIQUE.instagram}
              className="border-papier/25 hover:bg-papier/10 rounded-full border px-4 py-2 font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href={BOUTIQUE.youtube}
              className="border-papier/25 hover:bg-papier/10 rounded-full border px-4 py-2 font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
      <div className="border-papier/10 border-t">
        <p className="text-papier/55 mx-auto max-w-6xl px-5 py-6 text-xs leading-relaxed">
          Vente interdite aux mineurs. Les produits au CBD ne sont pas des médicaments et ne
          remplacent pas un avis médical.
          <span className="a-completer !text-or-clair ml-2">
            Mentions légales et CGV à reprendre
          </span>
        </p>
      </div>
    </footer>
  )
}
