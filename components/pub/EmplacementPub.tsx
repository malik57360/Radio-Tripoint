import { ArrowRight, Megaphone } from "lucide-react"
import Image from "next/image"
import Link from "@/components/ui/Lien"
import { traducteur } from "@/lib/i18n/serveur"
import { type Emplacement, emplacements, type IdEmplacement } from "@/lib/pub/emplacements"
import { cn } from "@/lib/utils/cn"

// Paillettes dorées du fond, en pur CSS (aucune image à charger).
const paillettes = {
  backgroundImage: [
    "radial-gradient(circle at 12% 30%, rgb(249 184 0 / 0.55) 0 1px, transparent 2px)",
    "radial-gradient(circle at 78% 18%, rgb(249 184 0 / 0.45) 0 1px, transparent 2px)",
    "radial-gradient(circle at 64% 82%, rgb(255 255 255 / 0.35) 0 1px, transparent 2px)",
    "radial-gradient(circle at 30% 76%, rgb(249 184 0 / 0.35) 0 1.5px, transparent 2.5px)",
    "radial-gradient(circle at 92% 64%, rgb(249 184 0 / 0.5) 0 1px, transparent 2px)",
    "radial-gradient(ellipse at 85% 110%, rgb(249 184 0 / 0.22), transparent 55%)",
    "radial-gradient(ellipse at 0% -10%, rgb(249 184 0 / 0.14), transparent 50%)",
  ].join(","),
  backgroundSize:
    "140px 120px, 180px 150px, 110px 130px, 210px 170px, 160px 140px, 100% 100%, 100% 100%",
}

/**
 * Encart publicitaire. Sans annonceur : « Louez cet emplacement pour votre
 * pub ! » vers la demande d'offre. Avec annonceur : son visuel, signalé
 * comme publicité.
 */
export async function EmplacementPub({
  id,
  format = "banniere",
  className,
}: {
  id: IdEmplacement
  format?: "banniere" | "pave"
  className?: string
}) {
  const t = await traducteur()
  const { annonceur }: Emplacement = emplacements[id]
  const mention = t({
    fr: "Espace publicitaire",
    de: "Werbefläche",
    lb: "Reklammsfläch",
    en: "Advertising space",
    es: "Espacio publicitario",
  })

  if (annonceur) {
    return (
      <aside aria-label={mention} className={className}>
        <p className="text-encre-3 mb-1.5 text-[0.7rem] font-semibold tracking-wider uppercase">
          {t({
            fr: "Publicité",
            de: "Werbung",
            lb: "Reklamm",
            en: "Advertisement",
            es: "Publicidad",
          })}{" "}
          · {annonceur.nom}
        </p>
        <a
          href={annonceur.lien}
          target="_blank"
          rel="sponsored noopener"
          className={cn(
            "bg-nuit relative block overflow-hidden",
            format === "banniere" ? "aspect-[4/1] max-sm:aspect-[2/1]" : "aspect-square",
          )}
        >
          <Image
            src={annonceur.image}
            alt={annonceur.nom}
            fill
            sizes={format === "banniere" ? "(min-width: 1024px) 1100px, 100vw" : "320px"}
            className="object-cover"
          />
        </a>
      </aside>
    )
  }

  const pave = format === "pave"
  return (
    <aside aria-label={mention} className={className}>
      <Link
        href="/publicite#demande"
        className="bg-nuit text-nuit-encre group relative block overflow-hidden"
        style={paillettes}
      >
        <span className="text-nuit-encre-2 absolute top-2.5 right-3 text-[0.65rem] font-semibold tracking-wider uppercase">
          {mention}
        </span>
        <div
          className={cn(
            "relative flex items-center gap-5 sm:gap-8",
            pave ? "flex-col px-6 pt-10 pb-7 text-center" : "px-5 py-8 sm:px-10 sm:py-10",
          )}
        >
          <Megaphone
            className={cn(
              "text-accent flex-none -rotate-12 transition-transform duration-300 group-hover:rotate-0",
              pave ? "size-14" : "size-14 sm:size-24",
            )}
            strokeWidth={1.6}
            aria-hidden
          />
          <div className="min-w-0">
            <p
              className={cn(
                "titre-affiche text-accent leading-none",
                pave ? "text-[1.35rem]" : "text-[clamp(1.2rem,0.9rem+1.6vw,2.2rem)]",
              )}
            >
              {t({
                fr: "Louez cet emplacement",
                de: "Mieten Sie diese Fläche",
                lb: "Lount dës Fläch",
                en: "Rent this space",
                es: "Alquile este espacio",
              })}
            </p>
            <p
              className={cn(
                "titre-affiche mt-1 leading-[0.95]",
                pave ? "text-[2.2rem]" : "text-[clamp(2rem,1.2rem+3.6vw,4.4rem)]",
              )}
            >
              {t({
                fr: "pour votre pub !",
                de: "für Ihre Werbung!",
                lb: "fir Är Reklamm!",
                en: "for your ad!",
                es: "¡para su publicidad!",
              })}
            </p>
            <span
              className={cn(
                "bg-accent text-sur-accent mt-5 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold",
                "transition-transform group-hover:translate-x-1",
              )}
            >
              {t({
                fr: "Réserver cet emplacement",
                de: "Diese Fläche buchen",
                lb: "Dës Fläch reservéieren",
                en: "Book this space",
                es: "Reservar este espacio",
              })}
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </aside>
  )
}
