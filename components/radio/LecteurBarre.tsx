"use client"

import {
  AlertCircle,
  ExternalLink,
  Loader2,
  Pause,
  Play,
  Radio,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import { useT } from "@/components/i18n/Langue"
import Link from "@/components/ui/Lien"
import type { Trad } from "@/lib/i18n/langues"
import { radioConfig } from "@/config/radioConfig"
import { programmeEnCours } from "@/lib/radio/grille"
import { useMaintenant } from "@/lib/radio/horloge"
import {
  basculer,
  basculerMuet,
  chercher,
  effacerErreur,
  reglerVolume,
  retourDirect,
  type RaisonErreur,
} from "@/lib/radio/moteur"
import type { GrilleClient } from "@/lib/radio/types"
import { useLecteur, useSuiviTitre } from "@/lib/radio/useLecteur"
import { chrono } from "@/lib/utils/dates"
import { cn } from "@/lib/utils/cn"

const MESSAGES: Record<RaisonErreur, Trad> = {
  "non-configure": {
    fr: "Le flux du direct n'est pas encore branché sur ce site.",
    de: "Der Livestream ist auf dieser Website noch nicht eingebunden.",
    lb: "De Live-Stream ass op dësem Site nach net ugeschloss.",
  },
  reseau: {
    fr: "Connexion perdue. Vérifiez votre réseau puis réessayez.",
    de: "Verbindung verloren. Prüfen Sie Ihr Netzwerk und versuchen Sie es erneut.",
    lb: "Verbindung verluer. Kontrolléiert Äert Netz a probéiert nach eng Kéier.",
  },
  lecture: {
    fr: "Le direct est momentanément indisponible. Réessayez dans un instant.",
    de: "Der Livestream ist vorübergehend nicht verfügbar. Versuchen Sie es gleich noch einmal.",
    lb: "De Live-Stream ass de Moment net disponibel. Probéiert et gläich nach eng Kéier.",
  },
  bloque: {
    fr: "Votre navigateur a bloqué la lecture. Touchez ▶ pour lancer le son.",
    de: "Ihr Browser hat die Wiedergabe blockiert. Tippen Sie auf ▶, um den Ton zu starten.",
    lb: "Äre Browser huet d'Ofspillen blockéiert. Dréckt op ▶, fir den Toun ze starten.",
  },
}

/**
 * Barre de lecture persistante, en bas de chaque page. C'est là que la
 * radio vit : elle ne disparaît jamais, et suit la navigation.
 */
export function LecteurBarre({ grille }: { grille: GrilleClient }) {
  const l = useLecteur()
  const t = useT()
  useSuiviTitre()
  const maintenant = useMaintenant()
  const programme = maintenant
    ? programmeEnCours(grille, new Date(maintenant), radioConfig.timeZone)
    : null

  const joue = l.statut === "playing"
  const charge = l.statut === "loading"
  const direct = l.source === "direct"
  const ligne1 = direct
    ? (programme?.emission.nom ?? radioConfig.radioName)
    : (l.episode?.titre ?? "")
  const ligne2 = direct
    ? l.attenteGeste && !joue && !charge
      ? t({
          fr: "Touchez la page pour lancer le direct",
          de: "Tippen Sie auf die Seite, um den Livestream zu starten",
          lb: "Dréckt op d'Säit, fir de Live-Stream ze starten",
        })
      : l.titreEnCours
        ? [l.titreEnCours.artiste, l.titreEnCours.titre].filter(Boolean).join(" — ")
        : programme
          ? radioConfig.radioName
          : t({
              fr: "France · Luxembourg · Allemagne",
              de: "Frankreich · Luxemburg · Deutschland",
              lb: "Frankräich · Lëtzebuerg · Däitschland",
            })
    : (l.episode?.sousTitre ?? "Podcast")

  const IconeVolume = l.muet || l.volume === 0 ? VolumeX : l.volume < 0.5 ? Volume1 : Volume2

  return (
    <div
      role="region"
      aria-label={t({ fr: "Lecteur radio", de: "Radioplayer", lb: "Radioplayer" })}
      className="border-nuit-trait bg-nuit/95 text-nuit-encre supports-[backdrop-filter]:bg-nuit/88 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      {!direct && l.dureeMedia > 0 && (
        <input
          type="range"
          min={0}
          max={l.dureeMedia}
          step={1}
          value={l.position}
          onChange={(e) => chercher(Number(e.target.value))}
          aria-label={t({
            fr: "Position dans l'épisode",
            de: "Position in der Folge",
            lb: "Positioun an der Episod",
          })}
          aria-valuetext={`${chrono(l.position)} ${t({ fr: "sur", de: "von", lb: "vun" })} ${chrono(l.dureeMedia)}`}
          className="barre-progression absolute inset-x-0 -top-[3px] h-[5px] w-full cursor-pointer"
          style={{ ["--p" as string]: `${(l.position / l.dureeMedia) * 100}%` }}
        />
      )}
      <div className="conteneur flex h-[var(--barre-lecteur)] items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={basculer}
          data-controle-lecteur
          aria-label={
            joue || charge
              ? t({ fr: "Pause", de: "Pause", lb: "Paus" })
              : direct
                ? t({ fr: "Écouter le direct", de: "Live hören", lb: "Live lauschteren" })
                : t({ fr: "Lire l'épisode", de: "Folge abspielen", lb: "Episod ofspillen" })
          }
          className={cn(
            "grid size-11 flex-none place-items-center rounded-full transition-colors",
            direct
              ? "bg-direct text-sur-direct hover:brightness-110"
              : "bg-accent text-sur-accent hover:brightness-105",
          )}
        >
          {charge ? (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          ) : joue ? (
            <Pause className="size-5 fill-current" aria-hidden />
          ) : (
            <Play className="size-5 translate-x-px fill-current" aria-hidden />
          )}
        </button>

        <div className="min-w-0 flex-1" aria-live="polite">
          {l.erreur ? (
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="text-nuit-encre-2 size-4 flex-none" aria-hidden />
              <span className="text-nuit-encre-2 line-clamp-2 leading-snug">
                {t(MESSAGES[l.erreur])}
              </span>
              {l.erreur === "non-configure" && radioConfig.radiokingUrl && (
                <a
                  href={radioConfig.radiokingUrl}
                  target="_blank"
                  rel="noopener"
                  className="lien text-nuit-encre flex-none font-semibold"
                >
                  {t({ fr: "Player externe", de: "Externer Player", lb: "Externe Player" })}
                </a>
              )}
              <button
                type="button"
                onClick={effacerErreur}
                aria-label={t({
                  fr: "Fermer le message",
                  de: "Meldung schließen",
                  lb: "Message zoumaachen",
                })}
                className="hover:bg-nuit-3 ml-auto flex-none rounded p-1"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          ) : (
            <>
              <p className="text-nuit-encre-2 flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.14em] uppercase">
                {direct ? (
                  <>
                    <span className="point-direct" data-actif={joue} />
                    <span className={cn(joue && "text-nuit-encre")}>
                      {t({ fr: "En direct", de: "Live", lb: "Live" })}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="egaliseur" data-actif={joue} aria-hidden>
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>
                      Replay
                      {l.dureeMedia > 0 && ` · ${chrono(l.position)} / ${chrono(l.dureeMedia)}`}
                    </span>
                  </>
                )}
              </p>
              <p className="truncate text-[0.95rem] leading-tight font-bold">{ligne1}</p>
              <p className="text-nuit-encre-2 truncate text-xs">{ligne2}</p>
            </>
          )}
        </div>

        {!direct && (
          <button
            type="button"
            onClick={retourDirect}
            className="border-nuit-trait hover:border-nuit-encre hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wider uppercase sm:inline-flex"
          >
            <Radio className="size-3.5" aria-hidden />
            {t({ fr: "Revenir au direct", de: "Zurück zum Live", lb: "Zréck op Live" })}
          </button>
        )}

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={basculerMuet}
            aria-label={
              l.muet
                ? t({ fr: "Rétablir le son", de: "Ton einschalten", lb: "Toun aschalten" })
                : t({ fr: "Couper le son", de: "Stummschalten", lb: "Toun ausschalten" })
            }
            className="hover:bg-nuit-3 rounded p-1.5"
          >
            <IconeVolume className="size-5" aria-hidden />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={l.muet ? 0 : l.volume}
            onChange={(e) => reglerVolume(Number(e.target.value))}
            aria-label={t({ fr: "Volume", de: "Lautstärke", lb: "Lautstäerkt" })}
            aria-valuetext={`${Math.round((l.muet ? 0 : l.volume) * 100)} %`}
            className="barre-volume w-24"
            style={{ ["--p" as string]: `${(l.muet ? 0 : l.volume) * 100}%` }}
          />
        </div>

        {!direct ? (
          <button
            type="button"
            onClick={retourDirect}
            aria-label={t({
              fr: "Fermer l'épisode et revenir au direct",
              de: "Folge schließen und zurück zum Live",
              lb: "Episod zoumaachen an zréck op Live",
            })}
            className="hover:bg-nuit-3 rounded p-2 sm:hidden"
          >
            <X className="size-5" aria-hidden />
          </button>
        ) : radioConfig.radiokingUrl ? (
          <a
            href={radioConfig.radiokingUrl}
            target="_blank"
            rel="noopener"
            className="text-nuit-encre-2 hover:text-nuit-encre hidden items-center gap-1.5 text-xs font-bold tracking-wider uppercase lg:inline-flex"
          >
            {t({ fr: "Ouvrir le player", de: "Player öffnen", lb: "Player opmaachen" })}{" "}
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        ) : (
          <Link
            href="/emissions"
            className="text-nuit-encre-2 hover:text-nuit-encre hidden text-xs font-bold tracking-wider uppercase lg:inline"
          >
            {t({ fr: "Programmes", de: "Programm", lb: "Programm" })}
          </Link>
        )}
      </div>
    </div>
  )
}
