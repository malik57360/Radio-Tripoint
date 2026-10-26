import { Inbox, Reply, Send, Trash2 } from "lucide-react"
import { after } from "next/server"
import { redirect } from "next/navigation"
import { actionSupprimerMessage } from "@/app/petites-annonces/actions"
import { ilYA } from "@/components/annonces/espace/Activite"
import { EnTete, Vide } from "@/components/annonces/espace/Blocs"
import Link from "@/components/ui/Lien"
import { DUREE_MESSAGES_JOURS, marquerLus } from "@/lib/annonces/espace"
import { compteEspace, maBoite } from "@/lib/annonces/espace-donnees"
import { metaAnnonces } from "@/lib/annonces/seo"
import { cn } from "@/lib/utils/cn"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Messages",
    description: "Vos messages.",
    chemin: "/mon-espace/messages",
    noindex: true,
  })

/**
 * Boîte de messages : ce que les acheteurs vous ont écrit, et ce que vous
 * avez écrit aux annonceurs. On répond par e-mail (le message est arrivé
 * dans votre boîte avec l'adresse de l'acheteur en « Répondre à ») ; les
 * adresses des annonceurs ne sont jamais montrées.
 */
export default async function Messages(props: PageProps<"/petites-annonces/mon-espace/messages">) {
  const c = await compteEspace()
  if (!c) redirect("/connexion?suite=/mon-espace/messages")
  const sp = await props.searchParams
  const envoyes = sp.boite === "envoyes"
  const boite = await maBoite(c.id)
  const recus = boite.filter((m) => m.sens === "recu")
  const liste = envoyes ? boite.filter((m) => m.sens === "envoye") : recus
  // Lus une fois affichés : ils perdent leur pastille à la prochaine visite.
  if (!envoyes) after(() => marquerLus(c.id, recus))
  const nonLus = recus.filter((m) => !m.lu).length

  return (
    <div className="space-y-5">
      <EnTete
        titre="Messages"
        sousTitre={`Gardés ${DUREE_MESSAGES_JOURS} jours. Vous répondez par e-mail : votre adresse n'est montrée qu'aux personnes à qui vous écrivez.`}
      />
      <div className="flex gap-1.5">
        {[
          { cle: "recus", nom: "Reçus", n: recus.length, href: "/mon-espace/messages" },
          {
            cle: "envoyes",
            nom: "Envoyés",
            n: boite.length - recus.length,
            href: "/mon-espace/messages?boite=envoyes",
          },
        ].map((o) => {
          const on = (o.cle === "envoyes") === envoyes
          return (
            <Link
              key={o.cle}
              href={o.href}
              aria-current={on ? "page" : undefined}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-[0.85rem] font-bold",
                on ? "bg-encre border-encre text-papier" : "border-trait bg-surface text-encre-2",
              )}
            >
              {o.nom}
              <span className="tabular-nums opacity-70">{o.n}</span>
              {o.cle === "recus" && nonLus > 0 && (
                <span className="bg-accent rounded-full px-1.5 text-[0.7rem] text-black">
                  {nonLus} nouveau{nonLus > 1 ? "x" : ""}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {liste.length === 0 ? (
        <Vide
          icone={envoyes ? Send : Inbox}
          titre={envoyes ? "Aucun message envoyé" : "Aucun message reçu"}
          action={
            <Link href={envoyes ? "/" : "/mon-espace/annonces"} className="btn btn-trait min-h-11">
              {envoyes ? "Parcourir les annonces" : "Voir mes annonces"}
            </Link>
          }
        >
          {envoyes
            ? "Quand vous écrivez à un annonceur depuis une annonce, une copie de votre message s'affiche ici."
            : "Quand un acheteur vous écrit depuis une de vos annonces, son message s'affiche ici et arrive aussi dans votre boîte e-mail."}
        </Vide>
      ) : (
        <ul className="space-y-3">
          {liste.map((m) => {
            const neuf = m.sens === "recu" && !m.lu
            const sujet = `Re : ${m.annonce.titre}`
            return (
              <li
                key={m.id}
                className={cn(
                  "bg-surface rounded-2xl border p-4",
                  neuf ? "border-[#f9b800] shadow-[0_0_0_3px_rgb(249_184_0/0.18)]" : "border-trait",
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="bg-nuit-3 text-nuit-encre grid size-10 flex-none place-items-center rounded-full font-extrabold">
                    {m.avec.nom.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-extrabold">
                        {m.sens === "recu" ? m.avec.nom : `À ${m.avec.nom}`}
                      </span>
                      <span className="text-encre-3 text-[0.78rem]">{ilYA(m.le)}</span>
                      {neuf && (
                        <span className="bg-accent rounded-full px-2 text-[0.68rem] font-extrabold text-black">
                          Nouveau
                        </span>
                      )}
                    </p>
                    <Link
                      href={m.annonce.chemin}
                      className="text-encre-2 mt-0.5 flex items-center gap-2 text-[0.82rem] hover:underline"
                    >
                      {m.annonce.vignette && (
                        // eslint-disable-next-line @next/next/no-img-element -- vignette déjà réduite
                        <img
                          src={m.annonce.vignette}
                          alt=""
                          className="size-6 rounded object-cover"
                        />
                      )}
                      <span className="truncate">{m.annonce.titre}</span>
                    </Link>
                    <p className="mt-2.5 text-[0.93rem] leading-relaxed whitespace-pre-line">
                      {m.texte}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.sens === "recu" && m.avec.email && (
                        <a
                          href={`mailto:${m.avec.email}?subject=${encodeURIComponent(sujet)}`}
                          className="btn btn-plein min-h-9 px-3.5 text-[0.82rem]"
                        >
                          <Reply className="size-4" aria-hidden />
                          Répondre par e-mail
                        </a>
                      )}
                      <form action={actionSupprimerMessage.bind(null, m.id)}>
                        <button type="submit" className="btn btn-trait min-h-9 px-3 text-[0.82rem]">
                          <Trash2 className="size-4" aria-hidden />
                          Supprimer
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
