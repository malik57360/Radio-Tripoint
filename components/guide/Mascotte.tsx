import Image from "next/image"
import { cn } from "@/lib/utils/cn"

/**
 * Tripo, la mascotte du guide : un grain de raisin violet en tenue
 * traditionnelle, chapeau aux couleurs de Radio Tripoint et des trois pays,
 * verre de vin de Moselle et grappe à la main. Image détourée, avec un
 * liseré blanc façon autocollant pour se lire sur fond clair comme sur
 * fond noir. « tete » est un gros plan dans un rond jaune pour les petites tailles (pastille,
 * en-tête du panneau), « entier » le personnage en pied.
 */
const IMAGES = {
  entier: { src: "/media/tripo/tripo.webp", largeur: 760, hauteur: 873 },
  tete: { src: "/media/tripo/tripo-avatar.webp", largeur: 256, hauteur: 256 },
} as const

export function Mascotte({
  className,
  anime = false,
  titre,
  cadrage = "tete",
  prioritaire = false,
  tailles = "48px",
}: {
  className?: string
  /** Légère respiration (coupée par prefers-reduced-motion). */
  anime?: boolean
  /** Texte alternatif ; sans lui, l'image est décorative. */
  titre?: string
  cadrage?: keyof typeof IMAGES
  prioritaire?: boolean
  /** Attribut sizes de l'image. */
  tailles?: string
}) {
  const img = IMAGES[cadrage]
  return (
    <Image
      src={img.src}
      alt={titre ?? ""}
      aria-hidden={titre ? undefined : true}
      width={img.largeur}
      height={img.hauteur}
      sizes={tailles}
      priority={prioritaire}
      className={cn("mascotte object-contain", anime && "mascotte-respire", className)}
    />
  )
}
