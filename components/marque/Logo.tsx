import Image from "next/image"
import { site } from "@/config/site"
import { cn } from "@/lib/utils/cn"
import { RubanRose } from "./RubanRose"

/**
 * Logo officiel (config/site.ts → visuels.logo). Rond : il se pose comme un
 * autocollant. Sans fichier, le nom est composé en toutes lettres — ce
 * n'est pas un autre logo, c'est son absence traitée proprement.
 */
export function Logo({
  className,
  sombre = false,
  taille = 56,
  preload = false,
}: {
  className?: string
  sombre?: boolean
  /** Diamètre de référence (px) pour le choix de la résolution. */
  taille?: number
  preload?: boolean
}) {
  const src = sombre ? (site.visuels.logoSombre ?? site.visuels.logo) : site.visuels.logo
  if (src) {
    const image = (
      <Image
        src={src}
        alt={`${site.nomOfficiel} — ${site.baseline.fr}`}
        width={taille}
        height={taille}
        sizes={`${taille}px`}
        preload={preload}
        className={cn(
          "aspect-square rounded-full",
          site.campagne.octobreRose ? "size-full" : className,
        )}
      />
    )
    if (!site.campagne.octobreRose) return image
    // Octobre rose : le ruban s'épingle en bas à droite du logo.
    return (
      <span className={cn("relative inline-block aspect-square rounded-full", className)}>
        {image}
        <RubanRose className="absolute -right-[6%] -bottom-[4%] h-[46%] w-auto rotate-[12deg] drop-shadow-sm" />
      </span>
    )
  }
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className="surtitre !text-[0.62rem] !tracking-[0.32em] opacity-70">Radio</span>
      <span
        className="font-titre text-[1.35rem] font-extrabold tracking-[-0.03em] sm:text-[1.5rem]"
        style={{ fontVariationSettings: '"wdth" 118' }}
      >
        TRIPOINT
      </span>
    </span>
  )
}
