import {
  BadgeCheck,
  CircleSlash,
  Clock,
  CreditCard,
  EyeOff,
  Megaphone,
  MessageCircle,
  PartyPopper,
  PencilLine,
  Rocket,
  Send,
  Undo2,
  type LucideIcon,
} from "lucide-react"
import type { Activite, TypeActivite } from "@/lib/annonces/espace"

/** Fil d'activité : ce qui est arrivé aux annonces du compte, du plus récent au plus ancien. */
const RENDU: Record<
  TypeActivite,
  { icone: LucideIcon; texte: (t: string) => string; teinte: string }
> = {
  depot: {
    icone: Send,
    texte: (t) => `Annonce déposée : « ${t} »`,
    teinte: "bg-papier-2 text-encre-2",
  },
  paiement: {
    icone: CreditCard,
    texte: (t) => `Paiement reçu pour « ${t} »`,
    teinte: "bg-[#dff3e4] text-[#14532d]",
  },
  publiee: {
    icone: BadgeCheck,
    texte: (t) => `« ${t} » est en ligne`,
    teinte: "bg-[#dff3e4] text-[#14532d]",
  },
  refusee: {
    icone: CircleSlash,
    texte: (t) => `« ${t} » n'a pas été acceptée`,
    teinte: "bg-papier-3 text-encre",
  },
  retiree: {
    icone: Undo2,
    texte: (t) => `« ${t} » est retirée du site`,
    teinte: "bg-papier-2 text-encre-2",
  },
  vendue: {
    icone: PartyPopper,
    texte: (t) => `« ${t} » est vendue. Bravo !`,
    teinte: "bg-[#fdefc0] text-black",
  },
  expiree: {
    icone: Clock,
    texte: (t) => `« ${t} » est arrivée au bout de sa durée`,
    teinte: "bg-papier-2 text-encre-2",
  },
  signalee: {
    icone: EyeOff,
    texte: (t) => `« ${t} » est masquée le temps d'une vérification`,
    teinte: "bg-papier-3 text-encre",
  },
  modifiee: {
    icone: PencilLine,
    texte: (t) => `« ${t} » modifiée`,
    teinte: "bg-papier-2 text-encre-2",
  },
  options: {
    icone: Rocket,
    texte: (t) => `Option activée sur « ${t} »`,
    teinte: "bg-[#fdefc0] text-black",
  },
  message: {
    icone: MessageCircle,
    texte: (t) => `Nouveau message pour « ${t} »`,
    teinte: "bg-[#d6e8e9] text-[#0a3640]",
  },
}

export const ilYA = (ms: number) => {
  const s = Math.max(0, (Date.now() - ms) / 1000)
  if (s < 60) return "à l'instant"
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`
  if (s < 2 * 86400) return "hier"
  if (s < 7 * 86400) return `il y a ${Math.floor(s / 86400)} jours`
  return new Date(ms).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Paris",
  })
}

export function FilActivite({ liste }: { liste: Activite[] }) {
  if (!liste.length)
    return (
      <p className="text-encre-2 flex items-center gap-2 text-sm">
        <Megaphone className="size-4" aria-hidden />
        Rien pour l&apos;instant : tout ce qui arrivera à vos annonces s&apos;affichera ici.
      </p>
    )
  return (
    <ol className="space-y-3.5">
      {liste.map((a, i) => {
        const r = RENDU[a.type]
        const Icone = r.icone
        return (
          <li key={`${a.le}-${i}`} className="flex gap-3">
            <span className={`grid size-8 flex-none place-items-center rounded-full ${r.teinte}`}>
              <Icone className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[0.9rem] leading-snug font-semibold">
                {r.texte(a.annonce?.titre ?? "votre annonce")}
              </p>
              <p className="text-encre-3 text-[0.76rem]">
                {ilYA(a.le)}
                {a.detail && <> · {a.detail}</>}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
