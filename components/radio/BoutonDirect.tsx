"use client"

import { useT } from "@/components/i18n/Langue"
import { Loader2, Pause, Play } from "lucide-react"
import { basculerDirect } from "@/lib/radio/moteur"
import { useLecteur } from "@/lib/radio/useLecteur"
import { cn } from "@/lib/utils/cn"

/** Le CTA principal du site. Rouge : c'est le direct. */
export function BoutonDirect({
  taille = "normal",
  className,
}: {
  taille?: "compact" | "normal" | "grand"
  className?: string
}) {
  const { source, statut } = useLecteur()
  const t = useT()
  const actif = source === "direct" && statut === "playing"
  const charge = source === "direct" && statut === "loading"
  const enEcoute = t({
    fr: "En écoute",
    de: "Läuft",
    lb: "Leeft",
    en: "Now playing",
    es: "Escuchando",
  })
  const libelle = actif
    ? enEcoute
    : charge
      ? t({
          fr: "Connexion…",
          de: "Verbinden…",
          lb: "Verbannen…",
          en: "Connecting…",
          es: "Conectando…",
        })
      : t({
          fr: "Écouter en direct",
          de: "Live hören",
          lb: "Live lauschteren",
          en: "Listen live",
          es: "Escuchar en directo",
        })

  return (
    <button
      type="button"
      onClick={basculerDirect}
      data-controle-lecteur
      aria-pressed={actif}
      aria-label={
        actif
          ? t({
              fr: "Mettre le direct en pause",
              de: "Livestream pausieren",
              lb: "Live-Stream pauséieren",
              en: "Pause the live stream",
              es: "Pausar el directo",
            })
          : t({
              fr: "Écouter Radio Tripoint en direct",
              de: "Radio Tripoint live hören",
              lb: "Radio Tripoint live lauschteren",
              en: "Listen to Radio Tripoint live",
              es: "Escuchar Radio Tripoint en directo",
            })
      }
      className={cn(
        "btn btn-direct",
        taille === "compact" && "min-h-10 !px-3.5 !text-[0.72rem]",
        taille === "grand" && "min-h-14 !px-6 !text-[0.9rem]",
        className,
      )}
    >
      {charge ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : actif ? (
        <Pause className="size-4 fill-current" aria-hidden />
      ) : (
        <Play className="size-4 fill-current" aria-hidden />
      )}
      {taille === "compact" ? (
        <>
          <span className="sm:hidden lg:inline xl:hidden">
            {actif
              ? enEcoute
              : t({ fr: "Direct", de: "Live", lb: "Live", en: "Live", es: "Directo" })}
          </span>
          <span className="hidden sm:inline lg:hidden xl:inline">{libelle}</span>
        </>
      ) : (
        <span>{libelle}</span>
      )}
    </button>
  )
}
