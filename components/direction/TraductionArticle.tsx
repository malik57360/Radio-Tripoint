"use client"

import { Languages, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import { actionTraduireArticle } from "@/app/direction/(espace)/articles/actions"
import { cn } from "@/lib/utils/cn"

type Etat = "complete" | "partielle" | "absente"

const LIBELLES: Record<Etat, string> = {
  complete: "DE · LB · EN · ES",
  partielle: "Traduction partielle",
  absente: "Pas encore traduit",
}

/** État de traduction d'un article + bouton « Traduire » (refait les langues manquantes). */
export function TraductionArticle({ slug, etat }: { slug: string; etat: Etat }) {
  const router = useRouter()
  const [enCours, demarrer] = useTransition()
  return (
    <span className="inline-flex flex-none items-center gap-2">
      <span
        className={cn(
          "rounded px-1.5 py-0.5 text-[0.7rem] font-bold",
          etat === "complete" ? "text-bon bg-carte-2" : "text-alerte bg-carte-2",
        )}
        title={
          etat === "complete"
            ? "Traduit en allemand, luxembourgeois, anglais et espagnol"
            : undefined
        }
      >
        {LIBELLES[etat]}
      </span>
      {etat !== "complete" && (
        <button
          type="button"
          disabled={enCours}
          onClick={() =>
            demarrer(async () => {
              const r = await actionTraduireArticle(slug)
              window.alert(r.ok ? r.message : r.erreur)
              router.refresh()
            })
          }
          className="border-trait text-encre-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold disabled:opacity-50"
        >
          {enCours ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Languages className="size-3.5" aria-hidden />
          )}
          Traduire
        </button>
      )}
    </span>
  )
}

/**
 * À l'ouverture de la page Articles : les articles déjà en ligne sans
 * traduction (publiés avant la traduction automatique, ou dont la traduction
 * a échoué) sont traduits un par un, sans clic.
 */
export function RattrapageTraductions({ slugs }: { slugs: string[] }) {
  const router = useRouter()
  const [reste, setReste] = useState(slugs.length)
  const lance = useRef(false)
  useEffect(() => {
    if (lance.current || !slugs.length) return
    lance.current = true
    ;(async () => {
      for (const slug of slugs) {
        await actionTraduireArticle(slug).catch(() => null)
        setReste((n) => n - 1)
      }
      router.refresh()
    })()
  }, [slugs, router])
  if (!slugs.length || reste <= 0) return null
  return (
    <p role="status" className="text-encre-3 mb-2 flex items-center gap-2 text-xs font-semibold">
      <Loader2 className="size-3.5 animate-spin" aria-hidden />
      Traduction automatique en cours : {reste} article{reste > 1 ? "s" : ""} (environ une minute
      chacun).
    </p>
  )
}
