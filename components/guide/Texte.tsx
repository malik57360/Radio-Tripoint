import Link from "@/components/ui/Lien"
import type { ReactNode } from "react"

/**
 * Rendu d'un Markdown réduit (gras, liens, listes « - », paragraphes),
 * sans jamais injecter de HTML. Les liens internes (« /… ») passent par
 * le routeur ; les liens externes n'acceptent que https.
 */
function enLigne(texte: string, cle: string): ReactNode[] {
  const morceaux: ReactNode[] = []
  const motif = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g
  let dernier = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = motif.exec(texte))) {
    if (m.index > dernier) morceaux.push(texte.slice(dernier, m.index))
    const k = `${cle}-${i++}`
    if (m[1]) {
      morceaux.push(<strong key={k}>{m[1]}</strong>)
    } else {
      const [, , libelle, url] = m
      if (url.startsWith("/") && !url.startsWith("//")) {
        morceaux.push(
          <Link key={k} href={url} className="font-semibold underline underline-offset-2">
            {libelle}
          </Link>,
        )
      } else if (url.startsWith("https://")) {
        morceaux.push(
          <a
            key={k}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2"
          >
            {libelle}
          </a>,
        )
      } else {
        morceaux.push(libelle)
      }
    }
    dernier = motif.lastIndex
  }
  if (dernier < texte.length) morceaux.push(texte.slice(dernier))
  return morceaux
}

export function TexteGuide({ texte }: { texte: string }) {
  const blocs: ReactNode[] = []
  let liste: string[] = []
  let para: string[] = []
  const vider = () => {
    if (para.length) {
      const k = `p${blocs.length}`
      blocs.push(<p key={k}>{enLigne(para.join(" "), k)}</p>)
      para = []
    }
    if (liste.length) {
      const k = `l${blocs.length}`
      blocs.push(
        <ul key={k} className="list-disc space-y-1 pl-5">
          {liste.map((x, i) => (
            <li key={i}>{enLigne(x, `${k}-${i}`)}</li>
          ))}
        </ul>,
      )
      liste = []
    }
  }
  for (const brute of texte.split("\n")) {
    const ligne = brute.trim()
    const puce = /^[-*•]\s+(.*)$/.exec(ligne) ?? /^\d+[.)]\s+(.*)$/.exec(ligne)
    if (!ligne) vider()
    else if (puce) {
      if (para.length) {
        const p = para
        para = []
        blocs.push(<p key={`p${blocs.length}`}>{enLigne(p.join(" "), `p${blocs.length}`)}</p>)
      }
      liste.push(puce[1])
    } else {
      if (liste.length) vider()
      para.push(ligne.replace(/^#+\s*/, ""))
    }
  }
  vider()
  return <div className="space-y-2.5">{blocs}</div>
}
