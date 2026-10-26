"use client"

import { MessagesSquare, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import type { LigneDiscussion } from "@/lib/annonces/discussions"
import { cn } from "@/lib/utils/cn"
import { initiales, quand } from "./temps"

/**
 * La liste des discussions, comme dans une appli de vente : la photo de
 * l'annonce, la personne, le dernier message, ce qui n'est pas lu en gras.
 * Au téléphone, elle laisse toute la place au fil dès qu'une discussion est
 * ouverte ; sur ordinateur, elle reste à gauche.
 */
export const EVENEMENT_MAJ = "messagerie:maj"

export function ListeDiscussions({ initiale }: { initiale: LigneDiscussion[] }) {
  const chemin = usePathname().replace(/^\/petites-annonces/, "")
  const ouverte = chemin.match(/^\/messages\/([0-9a-f]{20})/)?.[1] ?? null
  const [liste, setListe] = useState(initiale)
  const [filtre, setFiltre] = useState<"toutes" | "non-lues">("toutes")

  useEffect(() => {
    let vivant = true
    const relire = () =>
      fetch("/api/annonces/discussions", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { liste?: LigneDiscussion[] } | null) => {
          if (vivant && d?.liste) setListe(d.liste)
        })
        .catch(() => {})
    const minuterie = setInterval(() => document.visibilityState === "visible" && relire(), 15_000)
    window.addEventListener(EVENEMENT_MAJ, relire)
    document.addEventListener("visibilitychange", relire)
    return () => {
      vivant = false
      clearInterval(minuterie)
      window.removeEventListener(EVENEMENT_MAJ, relire)
      document.removeEventListener("visibilitychange", relire)
    }
  }, [])

  // La discussion ouverte est lue : son chiffre s'efface tout de suite.
  const affichee = liste
    .map((d) => (d.id === ouverte ? { ...d, nonLus: 0 } : d))
    .filter((d) => filtre === "toutes" || d.nonLus > 0)
  const nbNonLues = liste.filter((d) => d.nonLus > 0 && d.id !== ouverte).length

  return (
    <section
      aria-label="Discussions"
      className={cn(
        "border-trait min-h-0 flex-col lg:flex lg:border-r",
        ouverte ? "hidden" : "flex",
      )}
    >
      <div className="px-4 pt-4 pb-3 lg:px-5">
        <h1 className="titre-page text-[2rem] leading-none">Messages</h1>
        <div className="mt-3 flex gap-1.5" role="group" aria-label="Filtrer les discussions">
          {(
            [
              ["toutes", "Toutes"],
              ["non-lues", nbNonLues ? `Non lues · ${nbNonLues}` : "Non lues"],
            ] as const
          ).map(([cle, nom]) => (
            <button
              key={cle}
              type="button"
              aria-pressed={filtre === cle}
              onClick={() => setFiltre(cle)}
              className={cn(
                "min-h-9 rounded-full px-3.5 text-[0.85rem] font-bold transition-colors",
                filtre === cle
                  ? "bg-nuit text-nuit-encre"
                  : "bg-papier-2 text-encre-2 hover:bg-papier-3",
              )}
            >
              {nom}
            </button>
          ))}
        </div>
      </div>

      {affichee.length ? (
        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
          {affichee.map((d) => {
            const active = d.id === ouverte
            const neuf = d.nonLus > 0
            return (
              <li key={d.id}>
                <Link
                  href={`/messages/${d.id}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex gap-3 px-4 py-3 transition-colors lg:px-5",
                    active ? "bg-papier-2" : "hover:bg-papier-2/60",
                  )}
                >
                  <span className="relative flex-none">
                    {d.annonce.vignette ? (
                      // eslint-disable-next-line @next/next/no-img-element -- vignette déjà réduite
                      <img
                        src={d.annonce.vignette}
                        alt=""
                        width={56}
                        height={56}
                        loading="lazy"
                        className="bg-papier-2 size-14 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="bg-papier-3 text-encre-2 grid size-14 place-items-center rounded-xl text-sm font-extrabold">
                        {initiales(d.annonce.titre)}
                      </span>
                    )}
                    <span
                      aria-hidden
                      className="bg-nuit-3 text-nuit-encre ring-surface absolute -right-1.5 -bottom-1.5 grid size-7 place-items-center rounded-full text-[0.68rem] font-extrabold ring-2"
                    >
                      {initiales(d.avec.nom)}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-[0.98rem]",
                          neuf ? "font-extrabold" : "font-bold",
                        )}
                      >
                        {d.avec.nom}
                        {d.avec.pro && (
                          <span className="bg-papier-2 text-encre-2 ml-1.5 rounded px-1 py-px align-[0.1em] text-[0.62rem] font-extrabold tracking-wide uppercase">
                            Pro
                          </span>
                        )}
                      </span>
                      {d.dernier && (
                        <time
                          dateTime={new Date(d.dernier.le).toISOString()}
                          className={cn(
                            "flex-none text-[0.75rem] tabular-nums",
                            neuf ? "font-bold text-[#8a6100]" : "text-encre-3",
                          )}
                        >
                          {quand(d.dernier.le)}
                        </time>
                      )}
                    </span>
                    <span className="text-encre-3 block truncate text-[0.8rem]">
                      {d.annonce.titre}
                      {d.annonce.prix && <> · {d.annonce.prix}</>}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-[0.88rem]",
                          neuf ? "text-encre font-semibold" : "text-encre-2",
                        )}
                      >
                        {d.dernier
                          ? d.dernier.moi
                            ? `Vous : ${d.dernier.texte}`
                            : d.dernier.texte
                          : ""}
                      </span>
                      {neuf && (
                        <span className="bg-accent text-sur-accent grid h-5 min-w-5 flex-none place-items-center rounded-full px-1.5 text-[0.7rem] font-extrabold tabular-nums">
                          {d.nonLus > 9 ? "9+" : d.nonLus}
                          <span className="sr-only"> non lus</span>
                        </span>
                      )}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="grid flex-1 place-items-center px-6 pb-16 text-center">
          <div>
            <span className="bg-papier-2 mx-auto grid size-14 place-items-center rounded-full">
              <MessagesSquare className="text-encre-2 size-6" aria-hidden />
            </span>
            <p className="mt-3 text-lg font-extrabold">
              {filtre === "non-lues" ? "Tout est lu" : "Aucune discussion pour l'instant"}
            </p>
            {filtre === "toutes" && (
              <>
                <p className="text-encre-2 mx-auto mt-1 max-w-xs text-[0.92rem] leading-snug">
                  Écrivez à un annonceur depuis son annonce, ou attendez qu&apos;un acheteur vous
                  écrive : la discussion s&apos;ouvre ici.
                </p>
                <Link href="/" className="btn btn-plein mt-5">
                  <Search className="size-4" aria-hidden />
                  Parcourir les annonces
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
