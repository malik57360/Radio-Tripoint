import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "@/components/ui/Lien"
import { traducteur } from "@/lib/i18n/serveur"

export async function Pagination({
  page,
  pages,
  base,
  params = {},
}: {
  page: number
  pages: number
  base: string
  params?: Record<string, string | undefined>
}) {
  if (pages <= 1) return null
  const t = await traducteur()
  const href = (p: number) => {
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v)
    if (p > 1) sp.set("page", String(p))
    const s = sp.toString()
    return s ? `${base}?${s}` : base
  }
  const numeros = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1,
  )
  return (
    <nav
      aria-label={t({ fr: "Pagination", de: "Seitennavigation", lb: "Säitennavigatioun" })}
      className="border-trait mt-14 flex items-center justify-between gap-4 border-t pt-6"
    >
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className="lien-fleche">
          <ArrowLeft className="size-4" aria-hidden />{" "}
          {t({ fr: "Précédent", de: "Zurück", lb: "Zréck" })}
        </Link>
      ) : (
        <span />
      )}
      <ol className="flex items-center gap-1">
        {numeros.map((n, i) => (
          <li key={n} className="flex items-center gap-1">
            {i > 0 && numeros[i - 1] !== n - 1 && <span className="text-encre-3 px-1">…</span>}
            <Link
              href={href(n)}
              aria-current={n === page ? "page" : undefined}
              aria-label={`${t({ fr: "Page", de: "Seite", lb: "Säit" })} ${n}`}
              className="hover:bg-papier-2 aria-[current=page]:bg-encre aria-[current=page]:text-papier grid size-10 place-items-center rounded-full text-sm font-semibold"
            >
              {n}
            </Link>
          </li>
        ))}
      </ol>
      {page < pages ? (
        <Link href={href(page + 1)} rel="next" className="lien-fleche">
          {t({ fr: "Suivant", de: "Weiter", lb: "Weider" })}{" "}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
