import {
  AlertCircle,
  Bell,
  CreditCard,
  Eye,
  Heart,
  MailWarning,
  MessageCircle,
  Plus,
  Sparkles,
  Tag,
  TimerReset,
} from "lucide-react"
import { redirect } from "next/navigation"
import { FilActivite } from "@/components/annonces/espace/Activite"
import { Carte, Courbe, EnTete, Tuile, qualite } from "@/components/annonces/espace/Blocs"
import { RenvoyerVerification } from "@/components/annonces/FormulairesCompte"
import { Vignette } from "@/components/annonces/Vitrine"
import Link from "@/components/ui/Lien"
import { mesDiscussions } from "@/lib/annonces/discussions"
import { lireActivite, statsAnnonces } from "@/lib/annonces/espace"
import { compteEspace, mesAlertes, mesAnnonces, mesFavoris } from "@/lib/annonces/espace-donnees"
import { metaAnnonces } from "@/lib/annonces/seo"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Mon espace",
    description: "Vos annonces, vos messages, vos favoris et vos alertes.",
    chemin: "/mon-espace",
    noindex: true,
  })

const MESSAGES: Record<string, Record<string, string>> = {
  bienvenue: {
    "1": "Bienvenue ! Confirmez votre adresse e-mail grâce au lien que nous venons de vous envoyer.",
  },
  verifie: {
    ok: "Adresse e-mail confirmée : vous pouvez déposer vos annonces.",
    expire: "Ce lien a expiré ou a déjà servi. Renvoyez-en un ci-dessous.",
    erreur: "La confirmation n'a pas abouti. Réessayez dans un instant.",
  },
  depot: {
    ok: "Annonce reçue ! L'équipe la vérifie avant de la publier, en général dans la journée.",
  },
  paiement: {
    ok: "Paiement reçu, merci ! Votre annonce est en cours de vérification (ou votre option est active).",
    attente: "Paiement en cours de confirmation : actualisez la page dans un instant.",
    annule:
      "Paiement annulé : rien n'a été débité. Vous pouvez régler plus tard depuis « Mes annonces ».",
    erreur: "Le paiement n'a pas pu démarrer. Réessayez avec le bouton « Régler maintenant ».",
  },
  modifiee: {
    ok: "Modifications enregistrées.",
    verif: "Modifications enregistrées : l'annonce est revérifiée avant de réapparaître.",
  },
  retiree: { "1": "Annonce retirée." },
  options: { ok: "Option activée." },
  mdp: { "1": "Mot de passe changé : vous êtes connecté." },
}

const JOUR = 864e5
const dateCourte = (ms: number) =>
  new Date(ms).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  })
const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? "s" : ""}`
/** Il y a moins de `jours` jours / dans moins de `jours` jours. */
const recent = (ms: number, jours: number) => ms > Date.now() - jours * JOUR
const proche = (ms: number, jours: number) => ms - Date.now() < jours * JOUR

export default async function TableauDeBord(props: PageProps<"/petites-annonces/mon-espace">) {
  const c = await compteEspace()
  if (!c) redirect("/connexion?suite=/mon-espace")
  const sp = await props.searchParams
  const message = Object.entries(MESSAGES)
    .map(([k, v]) => (typeof sp[k] === "string" ? v[sp[k] as string] : undefined))
    .find(Boolean)
  // Le tampon confirme ce qui vient d'aboutir (jamais sur un simple clic).
  const tampon =
    sp.paiement === "ok"
      ? "Payée"
      : sp.depot === "ok"
        ? "Reçue"
        : sp.verifie === "ok"
          ? "Confirmé"
          : sp.options === "ok"
            ? "Activée"
            : null

  const [annonces, discussions, favoris, alertes, activite] = await Promise.all([
    mesAnnonces(c.id),
    mesDiscussions(c.id),
    mesFavoris(c.id),
    mesAlertes(c.id),
    lireActivite(c.id, 12),
  ])
  const { parAnnonce, courbe } = await statsAnnonces(annonces.map((a) => a.id))
  const somme = (k: "vues30" | "vues7" | "favoris") =>
    annonces.reduce((t, a) => t + (parAnnonce.get(a.id)?.[k] ?? 0), 0)
  const enLigne = annonces.filter((a) => a.statut === "publiee")
  const enVerif = annonces.filter((a) => a.statut === "en_attente").length
  // Les personnes qui ont écrit au sujet de ses annonces (la messagerie, elle, est à part).
  const contacts30 = discussions.filter((d) => d.vendeur === c.id && recent(d.creeLe, 30)).length
  const nonLus = discussions.reduce((n, d) => n + d.nonLus, 0)
  const nouvellesAlertes = alertes.reduce((n, a) => n + a.nouvelles, 0)
  const vendues = annonces.filter((a) => a.vendueLe).length

  // À faire : uniquement ce qui attend vraiment une action.
  const aFaire: { icone: typeof Tag; texte: string; href: string; bouton: string }[] = []
  for (const a of annonces.filter((x) => x.statut === "attente_paiement"))
    aFaire.push({
      icone: CreditCard,
      texte: `« ${a.titre} » attend son paiement pour partir en vérification.`,
      href: "/mon-espace/annonces?statut=a-payer",
      bouton: "Régler",
    })
  for (const a of enLigne.filter((x) => proche(x.expireLe ?? Infinity, 5)))
    aFaire.push({
      icone: TimerReset,
      texte: `« ${a.titre} » arrive au bout de sa durée le ${dateCourte(a.expireLe ?? 0)}.`,
      href: `/mon-espace/annonces?statut=en-ligne#a-${a.id}`,
      bouton: "Prolonger",
    })
  for (const a of annonces.filter((x) => x.statut === "refusee" && recent(x.majLe, 30)))
    aFaire.push({
      icone: AlertCircle,
      texte: `« ${a.titre} » n'a pas été acceptée${a.motif ? ` : ${a.motif}` : "."}`,
      href: "/mon-espace/annonces?statut=terminees",
      bouton: "Voir",
    })
  if (nonLus)
    aFaire.push({
      icone: MessageCircle,
      texte: `${pluriel(nonLus, "message")} non ${nonLus > 1 ? "lus" : "lu"} dans la messagerie.`,
      href: "/messages",
      bouton: "Lire",
    })
  if (c.type === "pro" && !c.pro)
    aFaire.push({
      icone: AlertCircle,
      texte: "Les informations de votre entreprise manquent : elles s'affichent sur vos annonces.",
      href: "/mon-espace/compte",
      bouton: "Compléter",
    })

  const aAmeliorer = enLigne
    .map((a) => ({ a, q: qualite(a) }))
    .filter((x) => x.q.conseils.length)
    .slice(0, 3)

  return (
    <div className="space-y-5">
      {message && (
        <div
          role="status"
          className="bg-surface border-trait flex items-center gap-4 rounded-2xl border p-4 shadow-sm"
        >
          {tampon && <span className="tampon flex-none text-lg">{tampon}</span>}
          <p className="font-semibold">{message}</p>
        </div>
      )}

      <EnTete
        titre={`Bonjour ${c.nom}`}
        sousTitre={
          annonces.length
            ? `${pluriel(enLigne.length, "annonce")} en ligne${enVerif ? `, ${enVerif} en vérification` : ""}.`
            : "Déposez votre première annonce : c'est gratuit pour les particuliers."
        }
        action={
          <Link href="/deposer" className="btn btn-accent min-h-11">
            <Plus className="size-4" aria-hidden />
            Déposer une annonce
          </Link>
        }
      />

      {!c.emailVerifie && (
        <div className="flex gap-3 rounded-2xl bg-[#fdefc0] p-4 text-black">
          <MailWarning className="mt-0.5 size-5 flex-none" aria-hidden />
          <div>
            <p className="font-extrabold">Confirmez votre adresse e-mail</p>
            <p className="mt-1 text-sm">
              Un lien a été envoyé à <strong>{c.email}</strong>. Il faut l&apos;ouvrir avant de
              déposer une annonce ou d&apos;écrire à un annonceur. Pensez aux courriers
              indésirables.
            </p>
            <RenvoyerVerification />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Tuile
          libelle="En ligne"
          valeur={enLigne.length}
          detail={
            vendues
              ? `${pluriel(vendues, "vente")} depuis l'inscription`
              : enVerif
                ? `${enVerif} en vérification`
                : "annonces visibles"
          }
          icone={Tag}
          href="/mon-espace/annonces"
        />
        <Tuile
          libelle="Vues (30 jours)"
          valeur={somme("vues30")}
          detail={`dont ${somme("vues7").toLocaleString("fr-FR")} cette semaine`}
          icone={Eye}
        />
        <Tuile
          libelle="Contacts (30 jours)"
          valeur={contacts30}
          detail={
            nonLus
              ? `${nonLus} message${nonLus > 1 ? "s" : ""} à lire`
              : "personnes qui vous ont écrit"
          }
          icone={MessageCircle}
          href="/messages"
          accent={nonLus > 0}
        />
        <Tuile
          libelle="Mises en favori"
          valeur={somme("favoris")}
          detail="personnes qui suivent vos annonces"
          icone={Heart}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <div className="space-y-5">
          <Carte titre="À faire">
            {aFaire.length ? (
              <ul className="divide-trait -my-2 divide-y">
                {aFaire.map((x, i) => (
                  <li key={i} className="flex items-center gap-3 py-2.5">
                    <x.icone className="text-encre-2 size-[1.1rem] flex-none" aria-hidden />
                    <p className="min-w-0 flex-1 text-[0.9rem] leading-snug">{x.texte}</p>
                    <Link
                      href={x.href}
                      className="btn btn-trait min-h-9 flex-none px-3 text-[0.8rem]"
                    >
                      {x.bouton}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-encre-2 text-sm">Rien ne vous attend : tout est à jour.</p>
            )}
          </Carte>

          {enLigne.length > 0 && (
            <Carte
              titre="Vues de vos annonces"
              lien={{ href: "/mon-espace/annonces", texte: "Par annonce" }}
            >
              <p className="text-encre-2 -mt-1 mb-3 text-sm">
                {courbe.reduce((t, p) => t + p.n, 0).toLocaleString("fr-FR")} vues ces 14 derniers
                jours. Un visiteur compte une fois par demi-heure ; vos propres visites ne comptent
                pas.
              </p>
              <Courbe points={courbe} />
            </Carte>
          )}

          {aAmeliorer.length > 0 && (
            <Carte titre="Pour vendre plus vite">
              <ul className="space-y-4">
                {aAmeliorer.map(({ a, q }) => (
                  <li key={a.id} className="flex gap-3">
                    <Vignette a={a} className="bg-papier-2 size-14 flex-none rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[0.9rem] font-bold">{a.titre}</p>
                        <span className="text-encre-3 flex-none text-[0.75rem] font-bold tabular-nums">
                          {q.score} %
                        </span>
                      </div>
                      <div className="bg-papier-3 mt-1.5 h-1.5 overflow-hidden rounded-full">
                        <div
                          className="bg-nuit-3 h-full rounded-full"
                          style={{ width: `${q.score}%` }}
                        />
                      </div>
                      <p className="text-encre-2 mt-1.5 text-[0.82rem] leading-snug">
                        {q.conseils[0]}
                      </p>
                      <Link
                        href={`/deposer?modifier=${a.id}`}
                        className="lien mt-1 inline-block text-[0.8rem] font-bold"
                      >
                        Améliorer l&apos;annonce
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </Carte>
          )}
        </div>

        <div className="space-y-5">
          <Carte titre="Activité récente">
            <FilActivite liste={activite} />
          </Carte>
          <div className="grid grid-cols-2 gap-3">
            <Tuile
              libelle="Favoris"
              valeur={favoris.length}
              detail="annonces mises de côté"
              icone={Heart}
              href="/mon-espace/favoris"
            />
            <Tuile
              libelle="Alertes"
              valeur={alertes.length}
              detail={
                nouvellesAlertes
                  ? `${nouvellesAlertes} nouvelle${nouvellesAlertes > 1 ? "s" : ""} annonce${nouvellesAlertes > 1 ? "s" : ""}`
                  : "recherches suivies"
              }
              icone={nouvellesAlertes ? Sparkles : Bell}
              href="/mon-espace/alertes"
              accent={nouvellesAlertes > 0}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
