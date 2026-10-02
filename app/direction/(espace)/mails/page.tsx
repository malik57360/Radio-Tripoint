import { CornerUpLeft, Mail as IconeMail, PenLine } from "lucide-react"
import Link from "next/link"
import { Composer, type ProspectCible } from "@/components/direction/Composer"
import { Redacteur } from "@/components/direction/Redacteur"
import { lireSuivi } from "@/lib/direction/prospection"
import { AActiver, Carte, EnTetePage, Etat, date } from "@/components/direction/ui"
import { boiteConfiguree, lireMail, listerMails } from "@/lib/direction/mails"
import { cn } from "@/lib/utils/cn"

export const metadata = { title: "Mails — Direction Radio Tripoint" }
// L'IA peut mettre plusieurs secondes à rédiger.
export const maxDuration = 60

export default async function PageMails({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const entete = (
    <EnTetePage
      titre="Mails"
      source="Boîte info@radio-tripoint-officiel.fr (Webador) · l'IA propose, vous relisez et envoyez"
    >
      <Link
        href="/direction/mails?nouveau=1"
        className="bg-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-black"
      >
        <PenLine className="size-4" aria-hidden /> Nouveau message
      </Link>
    </EnTetePage>
  )
  if (!boiteConfiguree())
    return (
      <div>
        {entete}
        <AActiver titre="Boîte mail à brancher">
          Collez le mot de passe de la boîte info@ dans la variable SMTP_PASS sur Vercel, puis
          redéployez. La même clé sert à envoyer les formulaires du site.
        </AActiver>
      </div>
    )

  const params = await searchParams
  const p = (k: string) => (typeof params[k] === "string" ? (params[k] as string) : "")
  const uid = Number(p("uid")) || null
  const nouveau = p("nouveau") === "1"
  const siren = /^\d{9}$/.test(p("siren")) ? p("siren") : ""
  const suivi = siren ? await lireSuivi(siren).catch(() => null) : null
  const prospect: ProspectCible | undefined = siren
    ? {
        siren,
        nom: p("nom").slice(0, 200),
        activite: p("activite").slice(0, 100),
        commune: p("commune").slice(0, 100),
        dirigeant: p("dirigeant").slice(0, 100) || undefined,
      }
    : undefined
  let mails: Awaited<ReturnType<typeof listerMails>>
  let choisi: Awaited<ReturnType<typeof lireMail>> = null
  try {
    ;[mails, choisi] = await Promise.all([listerMails(40), uid ? lireMail(uid) : null])
  } catch (e) {
    return (
      <div>
        {entete}
        <Carte>
          <Etat ok={false}>
            Connexion à la boîte impossible : {(e as Error).message}. Vérifiez le mot de passe
            (SMTP_PASS).
          </Etat>
        </Carte>
      </div>
    )
  }
  const aTraiter = mails.filter((m) => !m.repondu).length

  return (
    <div>
      {entete}
      <div className="grid gap-4 xl:grid-cols-[minmax(18rem,26rem)_1fr]">
        <Carte titre="Boîte de réception" note={`${aTraiter} sans réponse sur ${mails.length}`}>
          {mails.length === 0 ? (
            <p className="text-encre-3 text-sm">Aucun message.</p>
          ) : (
            <ul className="divide-trait -mx-2 max-h-[70vh] divide-y overflow-y-auto">
              {mails.map((m) => (
                <li key={m.uid}>
                  <Link
                    href={`/direction/mails?uid=${m.uid}`}
                    aria-current={m.uid === uid ? "true" : undefined}
                    className={cn(
                      "block rounded-lg px-2 py-2.5",
                      m.uid === uid ? "bg-accent-doux" : "hover:bg-carte-2",
                    )}
                  >
                    <span className="flex items-center gap-2 text-sm">
                      {!m.lu && (
                        <span
                          className="bg-accent size-2 flex-none rounded-full"
                          aria-label="non lu"
                        />
                      )}
                      <span className={cn("min-w-0 flex-1 truncate", !m.lu && "font-bold")}>
                        {m.de}
                      </span>
                      {m.repondu && (
                        <CornerUpLeft
                          className="text-bon size-3.5 flex-none"
                          aria-label="répondu"
                        />
                      )}
                      <span className="text-encre-3 flex-none text-xs">
                        {m.date ? date(m.date, { day: "numeric", month: "short" }) : ""}
                      </span>
                    </span>
                    <span className="text-encre-2 mt-0.5 block truncate text-sm">{m.sujet}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Carte>

        {nouveau ? (
          <Composer
            key={siren || "libre"}
            prospect={prospect}
            initial={{
              a: p("a") || suivi?.email || "",
              objet: prospect ? `Radio Tripoint × ${prospect.nom}` : "",
            }}
          />
        ) : choisi ? (
          <div className="min-w-0 space-y-4">
            <Carte>
              <p className="text-xl leading-tight font-extrabold">{choisi.sujet}</p>
              <p className="text-encre-2 mt-2 text-sm">
                <span className="font-semibold">{choisi.de}</span> &lt;{choisi.adresse}&gt;
                {choisi.date &&
                  ` · ${date(choisi.date, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}`}
              </p>
              {choisi.repondu && (
                <p className="text-bon mt-2 inline-flex items-center gap-1.5 text-xs font-bold">
                  <CornerUpLeft className="size-3.5" aria-hidden /> Déjà répondu
                </p>
              )}
              <div className="border-trait text-encre mt-4 max-h-[50vh] overflow-y-auto border-t pt-4 text-[0.95rem] leading-relaxed whitespace-pre-wrap">
                {choisi.texte || "(message sans texte)"}
              </div>
            </Carte>
            <Redacteur key={choisi.uid} uid={choisi.uid} destinataire={choisi.repondreA} />
          </div>
        ) : (
          <Carte>
            <p className="text-encre-3 flex items-center gap-2 text-sm">
              <IconeMail className="size-4" aria-hidden /> Choisissez un message pour le lire et y
              répondre.
            </p>
          </Carte>
        )}
      </div>
    </div>
  )
}
