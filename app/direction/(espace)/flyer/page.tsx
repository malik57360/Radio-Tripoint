import { Download } from "lucide-react"
import Link from "next/link"
import { connection } from "next/server"
import { Carte, EnTetePage } from "@/components/direction/ui"
import { weekend } from "@/lib/flyer/weekend"
import { cn } from "@/lib/utils/cn"

export const metadata = { title: "Flyer du week-end — Direction Radio Tripoint" }

const plus7 = (cle: string, n: number) =>
  new Date(new Date(`${cle}T12:00:00Z`).getTime() + n * 7 * 86_400_000).toISOString().slice(0, 10)

/** Texte prêt à coller sous le flyer sur les réseaux. */
function legende(w: Awaited<ReturnType<typeof weekend>>) {
  const lignes = w.lignes.map((l) => `• ${l.quand.join(" ")} — ${l.titre} (${l.detail})`)
  return [
    `Ce week-end dans les Trois Frontières · ${w.titreDates}`,
    "",
    ...(lignes.length ? lignes : ["Rien dans l’agenda pour l’instant."]),
    "",
    "Tout l’agenda : https://www.radio-tripoint-officiel.fr/agenda",
    "Un événement à annoncer ? Écrivez-nous : info@radio-tripoint-officiel.fr",
    "",
    "#RadioTripoint #TroisFrontières #Moselle #Luxembourg #Saarland #SortirCeWeekend",
  ].join("\n")
}

export default async function PageFlyer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  await connection()
  const demande = (await searchParams).debut
  const prochain = await weekend()
  const vendredis = Array.from({ length: 6 }, (_, i) => plus7(prochain.vendredi, i))
  const choisi =
    typeof demande === "string" && vendredis.includes(demande) ? demande : prochain.vendredi
  const w = choisi === prochain.vendredi ? prochain : await weekend(new Date(), choisi)
  const image = `/api/flyer-weekend?debut=${choisi}`
  const titres = await Promise.all(vendredis.map((v) => weekend(new Date(), v)))

  return (
    <>
      <EnTetePage
        titre="Flyer du week-end"
        source="Composé automatiquement à partir de l'agenda publié · format Instagram 1080 × 1350"
      >
        <a
          href={image}
          download={`radio-tripoint-week-end-${choisi}.png`}
          className="bg-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-black"
        >
          <Download className="size-4" aria-hidden />
          Télécharger le flyer
        </a>
      </EnTetePage>

      <nav aria-label="Choisir le week-end" className="mb-5 flex flex-wrap gap-2">
        {titres.map((t, i) => (
          <Link
            key={t.vendredi}
            href={`/direction/flyer?debut=${t.vendredi}`}
            aria-current={t.vendredi === choisi ? "page" : undefined}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-bold",
              t.vendredi === choisi
                ? "border-accent bg-accent text-black"
                : "border-trait text-encre-2 hover:text-encre",
            )}
          >
            {i === 0 ? "Ce week-end" : t.titreDates.replace(/ \d{4}$/, "")}
            <span className="ml-1 opacity-70">({t.lignes.length})</span>
          </Link>
        ))}
      </nav>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,26rem)_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element -- image générée, déjà au bon format */}
        <img
          src={image}
          alt={`Flyer du week-end du ${w.titreDates}`}
          width={1080}
          height={1350}
          className="border-trait h-auto w-full rounded-xl border"
        />
        <div className="space-y-5">
          <Carte titre="Texte à coller sous le post" note="Sélectionnez tout, puis copiez">
            <textarea
              readOnly
              rows={14}
              defaultValue={legende(w)}
              className="border-trait bg-carte-2 text-encre block w-full rounded-lg border p-3 text-sm leading-relaxed outline-none"
            />
          </Carte>
          <Carte titre="Bon à savoir">
            <ul className="text-encre-2 list-disc space-y-1.5 pl-5 text-sm">
              <li>
                Le flyer reprend l&apos;agenda du site : un événement ajouté à l&apos;agenda y
                apparaît tout seul.
              </li>
              <li>Jusqu&apos;à 7 événements ; au-delà, le flyer renvoie vers l&apos;agenda.</li>
              <li>
                Chaque jeudi, le flyer du week-end vous est aussi envoyé dans la conversation.
              </li>
            </ul>
          </Carte>
        </div>
      </div>
    </>
  )
}
