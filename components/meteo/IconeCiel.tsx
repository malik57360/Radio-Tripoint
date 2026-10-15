import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react"
import type { Ciel } from "@/lib/meteo"
import { cn } from "@/lib/utils/cn"

const JOUR: Record<Ciel, LucideIcon> = {
  clair: Sun,
  voile: CloudSun,
  nuageux: CloudSun,
  couvert: Cloud,
  brouillard: CloudFog,
  bruine: CloudDrizzle,
  pluie: CloudRain,
  averses: CloudRain,
  neige: CloudSnow,
  orage: CloudLightning,
}

/** Pictogramme du ciel ; la nuit, lune à la place du soleil. Le soleil est jaune (accent). */
export function IconeCiel({
  ciel,
  nuit = false,
  className,
}: {
  ciel: Ciel
  nuit?: boolean
  className?: string
}) {
  const Icone =
    nuit && ciel === "clair"
      ? Moon
      : nuit && (ciel === "voile" || ciel === "nuageux")
        ? CloudMoon
        : JOUR[ciel]
  const soleil = !nuit && (ciel === "clair" || ciel === "voile" || ciel === "nuageux")
  return (
    <Icone
      aria-hidden
      strokeWidth={1.6}
      className={cn(soleil ? "text-accent-encre" : "text-encre-2", className)}
    />
  )
}
