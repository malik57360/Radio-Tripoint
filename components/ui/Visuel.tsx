import Image from "next/image"
import type { Visuel as TVisuel } from "@/types/media"
import { cn } from "@/lib/utils/cn"
import { Couverture, type Teinte } from "./Couverture"

/** Photo réelle si fournie, sinon couverture typographique. Ratio fixe (ou celui de l'image) : zéro décalage de mise en page. */
export function Visuel({
  visuel,
  repli,
  ratio = "aspect-[16/10]",
  sizes,
  preload,
  ratioNaturel,
  className,
}: {
  visuel?: TVisuel
  repli: { mot: string; surmot?: string; teinte?: Teinte; taille?: "petit" | "normal" | "grand" }
  ratio?: string
  sizes: string
  preload?: boolean
  /** Garde les proportions de l'image (affiche) au lieu de la recadrer. */
  ratioNaturel?: boolean
  className?: string
}) {
  const naturel = ratioNaturel && visuel
  return (
    <div
      className={cn(
        "carte-visuel bg-papier-3 relative overflow-hidden",
        !naturel && ratio,
        className,
      )}
      style={naturel ? { aspectRatio: `${visuel.largeur} / ${visuel.hauteur}` } : undefined}
    >
      {visuel ? (
        <Image
          src={visuel.src}
          alt={visuel.alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
        />
      ) : (
        <Couverture {...repli} />
      )}
    </div>
  )
}
