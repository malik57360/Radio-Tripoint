import Link from "next/link"
import { Histogramme } from "@/components/direction/Histogramme"
import {
  AActiver,
  Barres,
  Carte,
  EnTetePage,
  Etat,
  Evolution,
  Tuile,
  date,
  libellePage,
  nombre,
  nomPays,
} from "@/components/direction/ui"
import { chargerAudience } from "@/lib/direction/alertes"
import { PERIODES, type Periode } from "@/lib/direction/donnees"
import { cn } from "@/lib/utils/cn"

export const metadata = { title: "Audience — Direction Radio Tripoint" }

const APPAREILS: Record<string, string> = {
  mobile: "Téléphone",
  desktop: "Ordinateur",
  tablet: "Tablette",
}

/** Sites d'origine regroupés comme on en parle : Facebook, Google… */
function origine(hote: string) {
  const h = hote.toLowerCase()
  if (!h) return "Accès direct / application"
  if (h.includes("facebook") || h === "fb.me") return "Facebook"
  if (h.includes("instagram")) return "Instagram"
  if (h.includes("tiktok")) return "TikTok"
  if (h === "t.co" || h.includes("twitter") || h === "x.com") return "X (Twitter)"
  if (h.includes("google")) return "Google"
  if (h.includes("bing")) return "Bing"
  if (h.includes("whatsapp")) return "WhatsApp"
  if (h.includes("radio-tripoint")) return "Radio Tripoint (interne)"
  return h.replace(/^www\./, "")
}

export default async function PageAudience({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const brut = Number((await searchParams).periode)
  const jours: Periode = (PERIODES as readonly number[]).includes(brut) ? (brut as Periode) : 30
  const aud = await chargerAudience(jours)

  const selecteur = (
    <nav aria-label="Période" className="bg-carte border-trait flex rounded-full border p-1">
      {PERIODES.map((p) => (
        <Link
          key={p}
          href={`/direction/audience?periode=${p}`}
          aria-current={p === jours ? "page" : undefined}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-bold",
            p === jours ? "bg-accent text-black" : "text-encre-2 hover:text-encre",
          )}
        >
          {p} j
        </Link>
      ))}
    </nav>
  )

  if (!aud)
    return (
      <div>
        <EnTetePage titre="Audience du site" source="Vercel Web Analytics" />
        <AActiver titre="Statistiques d'audience à relier">
          Ajoutez la clé VERCEL_STATS_TOKEN dans le projet sur Vercel, puis redéployez.
        </AActiver>
      </div>
    )
  if (aud.erreur)
    return (
      <div>
        <EnTetePage titre="Audience du site" source="Vercel Web Analytics" />
        <Carte>
          <Etat ok={false}>Vercel ne répond pas pour l&apos;instant (ou la clé est refusée).</Etat>
        </Carte>
      </div>
    )

  const sources = new Map<string, number>()
  for (const s of aud.sources)
    sources.set(origine(s.cle), (sources.get(origine(s.cle)) ?? 0) + s.visiteurs)
  const pas = jours === 7 ? 1 : jours === 14 ? 2 : 7

  return (
    <div className="space-y-4">
      <EnTetePage
        titre="Audience du site"
        source="Vercel Web Analytics, sans cookie · journées comptées de minuit à minuit UTC (2 h à 2 h, heure de Paris)"
      >
        {selecteur}
      </EnTetePage>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile
          accent
          libelle={`Visiteurs · ${jours} jours`}
          valeur={aud.mois?.visiteurs ?? null}
          evolution={
            aud.mois && (
              <Evolution actuel={aud.mois.visiteurs} precedent={aud.moisPrec?.visiteurs ?? null} />
            )
          }
          detail={
            jours * 2 > 31
              ? "pas de comparaison : Vercel garde 31 jours"
              : `vs les ${jours} jours d'avant`
          }
        />
        <Tuile
          libelle={`Pages vues · ${jours} jours`}
          valeur={aud.mois?.pages ?? null}
          evolution={
            aud.mois && (
              <Evolution actuel={aud.mois.pages} precedent={aud.moisPrec?.pages ?? null} />
            )
          }
        />
        <Tuile
          libelle="Pages par visiteur"
          valeur={
            aud.mois && aud.mois.visiteurs
              ? (aud.mois.pages / aud.mois.visiteurs).toLocaleString("fr-FR", {
                  maximumFractionDigits: 1,
                })
              : null
          }
          detail="plus c'est haut, plus on lit"
        />
        <Tuile
          libelle="Aujourd'hui"
          valeur={aud.aujourdhui.visiteurs}
          detail={`${nombre(aud.aujourdhui.pages)} pages · hier ${aud.veille ? nombre(aud.veille.visiteurs) : "—"}`}
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.6fr_1fr]">
        <Carte titre="Visiteurs par jour" note={`${jours} jours`}>
          <Histogramme
            unite="visiteurs"
            pas={pas}
            hauteur={180}
            enCours
            points={aud.parJour.map((p) => ({
              cle: p.cle,
              etiquette: date(p.cle, { day: "numeric", month: "short" }),
              valeur: p.visiteurs,
              detail: `${date(p.cle, { weekday: "long", day: "numeric", month: "long" })} · ${nombre(p.pages)} pages`,
            }))}
          />
        </Carte>
        <Carte titre="Visiteurs par heure" note="aujourd'hui, heure de Paris">
          <Histogramme
            unite="visiteurs"
            pas={3}
            hauteur={180}
            enCours
            points={aud.parHeure.map((p) => ({
              cle: p.cle,
              etiquette: date(p.cle, { hour: "2-digit" }).replace(" h", "h"),
              valeur: p.visiteurs,
              detail: `${date(p.cle, { hour: "2-digit", minute: "2-digit" })} · ${nombre(p.pages)} pages`,
            }))}
          />
        </Carte>
      </div>

      <Carte titre="Pages les plus vues" note={`${jours} jours`}>
        {aud.pages.length ? (
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[30rem] text-left text-sm">
              <thead className="text-encre-3 text-xs">
                <tr>
                  <th className="w-8 px-1 pb-2 font-semibold">#</th>
                  <th className="px-1 pb-2 font-semibold">Page</th>
                  <th className="px-1 pb-2 text-right font-semibold">Vues</th>
                  <th className="px-1 pb-2 text-right font-semibold">Visiteurs</th>
                </tr>
              </thead>
              <tbody className="divide-trait divide-y">
                {aud.pages.map((p, i) => (
                  <tr key={p.cle}>
                    <td className="text-encre-3 px-1 py-2">{i + 1}</td>
                    <td className="max-w-[28rem] truncate px-1 py-2">
                      {p.cle === "Autres" ? (
                        <span className="text-encre-3">Autres pages (regroupées)</span>
                      ) : (
                        <a
                          href={p.cle}
                          target="_blank"
                          rel="noopener"
                          className="hover:text-accent font-semibold"
                        >
                          {libellePage(p.cle)}
                        </a>
                      )}
                    </td>
                    <td className="px-1 py-2 text-right font-semibold">{nombre(p.pages)}</td>
                    <td className="text-encre-2 px-1 py-2 text-right">{nombre(p.visiteurs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-encre-3 text-sm">Aucune donnée sur la période.</p>
        )}
      </Carte>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Carte titre="Pays" note="visiteurs">
          <Barres
            lignes={aud.pays.map((p) => ({ cle: p.cle, libelle: nomPays(p.cle), n: p.visiteurs }))}
          />
        </Carte>
        <Carte titre="D'où viennent-ils" note="visiteurs">
          <Barres
            lignes={[...sources.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([cle, n]) => ({ cle, n }))}
          />
        </Carte>
        <Carte titre="Appareils" note="visiteurs">
          <Barres
            lignes={aud.appareils.map((a) => ({
              cle: a.cle,
              libelle: APPAREILS[a.cle] ?? a.cle,
              n: a.visiteurs,
            }))}
          />
        </Carte>
        <Carte titre="Systèmes" note="visiteurs">
          <Barres lignes={aud.systemes.map((s) => ({ cle: s.cle, n: s.visiteurs }))} />
        </Carte>
        <Carte titre="Navigateurs" note="visiteurs">
          <Barres lignes={aud.navigateurs.map((s) => ({ cle: s.cle, n: s.visiteurs }))} />
        </Carte>
        <Carte titre="Campagnes (liens utm_source)" note="visiteurs">
          <Barres
            lignes={aud.campagnes.map((c) => ({ cle: c.cle, n: c.visiteurs }))}
            vide="Aucune campagne suivie. Ajoutez ?utm_source=facebook à vos liens pour les voir ici."
          />
        </Carte>
      </div>
    </div>
  )
}
