import type { ReactNode } from "react"
import { traducteur } from "@/lib/i18n/serveur"

export function ProseLegale({ children }: { children: ReactNode }) {
  return (
    <div className="text-encre-2 [&_a]:text-encre [&_h2]:titre-carte [&_h2]:text-encre [&_strong]:text-encre max-w-3xl space-y-4 text-[1.02rem] leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_h2]:scroll-mt-24 [&_h2]:pt-8 [&_h2]:text-[1.45rem] [&_li]:ml-5 [&_li]:list-disc">
      {children}
    </div>
  )
}

/** Information à fournir par l'éditeur : visible, jamais inventée. */
export async function ACompleter({ valeur }: { valeur: string | null }) {
  if (valeur) return <>{valeur}</>
  const t = await traducteur()
  return (
    <span className="border-alerte text-alerte border border-dashed px-1.5 text-sm font-semibold">
      {t({
        fr: "à compléter par l'éditeur",
        de: "vom Herausgeber zu ergänzen",
        lb: "vum Editeur auszefëllen",
      })}
    </span>
  )
}
