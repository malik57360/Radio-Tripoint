import { MapPin } from "lucide-react"
import Image from "next/image"
import Link from "@/components/ui/Lien"
import { traducteur } from "@/lib/i18n/serveur"
import { heure, jourNumero, jourSemaine, moisCourt } from "@/lib/utils/dates"
import type { Evenement } from "@/types/event"
import { cn } from "@/lib/utils/cn"

export const nomsPays = {
  FR: { fr: "France", de: "Frankreich", lb: "Frankräich", en: "France", es: "Francia" },
  LU: { fr: "Luxembourg", de: "Luxemburg", lb: "Lëtzebuerg", en: "Luxembourg", es: "Luxemburgo" },
  DE: { fr: "Allemagne", de: "Deutschland", lb: "Däitschland", en: "Germany", es: "Alemania" },
} as const

/** Carte agenda : le calendrier d'abord, comme sur une affiche de programme. */
export async function EventCard({
  evenement: e,
  titreNiveau: Titre = "h3",
}: {
  evenement: Evenement
  titreNiveau?: "h2" | "h3"
}) {
  const t = await traducteur()
  const l = t.langue
  const quand = e.horaires ?? (e.journee ? null : heure(e.debut, l))
  return (
    <article
      className={cn(
        "carte group border-trait grid gap-4 border-t pt-5 sm:gap-5",
        e.visuel
          ? "grid-cols-[4.5rem_1fr_5.5rem] sm:grid-cols-[4.5rem_1fr_8rem]"
          : "grid-cols-[4.5rem_1fr]",
      )}
    >
      <p className="flex flex-col items-start leading-none">
        <span className="surtitre text-encre-3">{jourSemaine(e.debut, l).slice(0, 3)}.</span>
        <span className="titre-affiche mt-1 text-[2.6rem] tabular-nums">{jourNumero(e.debut)}</span>
        <span className="surtitre text-accent-encre mt-1">{moisCourt(e.debut, l)}</span>
      </p>
      <div className="min-w-0">
        <p className="text-encre-3 flex flex-wrap items-center gap-2 text-[0.8rem]">
          <MapPin className="size-3.5" aria-hidden />
          <span className="text-encre-2 font-semibold">{e.ville}</span>
          <span aria-hidden>·</span>
          <span>{t(nomsPays[e.pays])}</span>
          {e.demo && (
            <span className="badge-exemple">
              {t({ fr: "Exemple", de: "Beispiel", lb: "Beispill", en: "Example", es: "Ejemplo" })}
            </span>
          )}
        </p>
        <Titre className="carte-titre titre-carte mt-1.5 text-[1.2rem]">
          <Link href={`/agenda/${e.slug}`} className="carte-lien">
            {e.titre}
          </Link>
        </Titre>
        <p className="text-encre-2 mt-1.5 line-clamp-2 text-[0.95rem]">{e.description}</p>
        <p className="text-encre-3 mt-2 text-[0.8rem] font-semibold">
          {quand && (
            <>
              <time dateTime={e.debut}>{quand}</time> ·{" "}
            </>
          )}
          {e.lieu}
        </p>
      </div>
      {e.visuel && (
        <div className="carte-visuel bg-papier-3 relative aspect-[4/5] self-start overflow-hidden">
          <Image
            src={e.visuel.src}
            alt=""
            fill
            sizes="(min-width: 640px) 8rem, 5.5rem"
            className="object-cover"
          />
        </div>
      )}
    </article>
  )
}
