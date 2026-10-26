import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { ActionsFicheCompte } from "@/components/direction/FicheActions"
import { ActionsCompte } from "@/components/direction/ModerationAnnonces"
import { Carte, EnTetePage, Etat, Tuile, date } from "@/components/direction/ui"
import { annoncesDuCompte } from "@/lib/annonces/annonces"
import { listerCommandes } from "@/lib/annonces/commandes"
import { idCompteValide, lireCompte, nombreSessions } from "@/lib/annonces/comptes"
import { mesDiscussions } from "@/lib/annonces/discussions"
import { idsFavoris, lireActivite, lireAlertes } from "@/lib/annonces/espace"
import { euros } from "@/lib/annonces/offres"
import { LIBELLES_STATUT } from "@/lib/annonces/types"

export const metadata = { title: "Fiche compte — Direction Radio Tripoint" }

const quand = (ms?: number) =>
  ms
    ? date(ms, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"

/**
 * Tout sur un compte : ses annonces, ses paiements, son activité. Les
 * discussions sont comptées, jamais lues : elles restent privées.
 */
export default async function FicheCompte(props: PageProps<"/direction/annonces/compte/[id]">) {
  await connection()
  const { id } = await props.params
  const c = idCompteValide(id) ? await lireCompte(id) : null
  if (!c) notFound()
  const [annonces, commandes, sessions, discussions, favoris, alertes, activite] =
    await Promise.all([
      annoncesDuCompte(c.id),
      listerCommandes(2000).then((l) => l.filter((x) => x.compte === c.id)),
      nombreSessions(c.id),
      mesDiscussions(c.id, 500),
      idsFavoris(c.id),
      lireAlertes(c.id),
      lireActivite(c.id, 20),
    ])
  const depense = commandes.filter((x) => x.statut === "payee").reduce((t, x) => t + x.total, 0)
  const nom = c.type === "pro" && c.pro ? c.pro.raisonSociale : c.nom

  return (
    <>
      <Link
        href="/direction/annonces?vue=comptes"
        className="text-encre-2 mb-3 inline-flex items-center gap-1.5 text-sm font-bold"
      >
        <ArrowLeft className="size-4" aria-hidden /> Comptes
      </Link>
      <EnTetePage
        titre={nom}
        source={`${c.email} · ${c.type === "pro" ? "Professionnel" : "Particulier"}`}
      />

      <div className="mb-4 flex flex-wrap gap-3 text-sm">
        <Etat ok={Boolean(c.emailVerifie)}>
          {c.emailVerifie ? "E-mail confirmé" : "E-mail non confirmé"}
        </Etat>
        <Etat ok={!c.bloque}>
          {c.bloque
            ? `Suspendu le ${date(c.bloque.le, { day: "numeric", month: "short" })} : ${c.bloque.motif}`
            : "Actif"}
        </Etat>
        {c.pro && (
          <Etat ok={Boolean(c.pro.valideParModeration || c.pro.verification?.statut === "verifie")}>
            {c.pro.valideParModeration || c.pro.verification?.statut === "verifie"
              ? "Entreprise vérifiée"
              : "Entreprise à vérifier"}
          </Etat>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile
          libelle="Annonces"
          valeur={annonces.length}
          detail={`${annonces.filter((a) => a.statut === "publiee").length} en ligne`}
        />
        <Tuile
          libelle="Dépensé"
          valeur={euros(depense)}
          detail={`${commandes.length} paiement(s)`}
        />
        <Tuile
          libelle="Discussions"
          valeur={discussions.length}
          detail="contenu privé, jamais affiché ici"
        />
        <Tuile
          libelle="Appareils connectés"
          valeur={sessions}
          detail={`dernière connexion : ${quand(c.derniereConnexion)}`}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="space-y-5">
          <Carte titre={`Annonces (${annonces.length})`}>
            {annonces.length ? (
              <ul className="divide-trait divide-y text-sm">
                {annonces
                  .sort((a, b) => b.creeLe - a.creeLe)
                  .map((a) => (
                    <li key={a.id} className="py-2.5 first:pt-0">
                      <Link
                        href={`/direction/annonces/annonce/${a.id}`}
                        className="font-bold hover:underline"
                      >
                        {a.titre}
                      </Link>
                      <span className="text-encre-3 block text-xs">
                        {LIBELLES_STATUT[a.statut]} · déposée le {quand(a.creeLe)}
                        {a.vendueLe ? " · vendue" : ""}
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-encre-3 text-sm">Aucune annonce.</p>
            )}
          </Carte>
          <Carte titre="Paiements">
            {commandes.length ? (
              <ul className="divide-trait divide-y text-sm">
                {commandes.map((x) => (
                  <li key={x.id} className="py-2 first:pt-0">
                    <strong>{euros(x.total)}</strong> · {x.lignes.map((l) => l.libelle).join(", ")}
                    <span className="text-encre-3 block text-xs">
                      {quand(x.creeLe)} · {x.statut}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-encre-3 text-sm">Aucun paiement.</p>
            )}
          </Carte>
          <Carte titre="Activité récente">
            {activite.length ? (
              <ul className="divide-trait divide-y text-sm">
                {activite.map((x, i) => (
                  <li key={i} className="py-2 first:pt-0">
                    <span className="text-encre-3 mr-2 text-xs">{quand(x.le)}</span>
                    <strong>{x.type}</strong>
                    {x.annonce && <span className="text-encre-2"> · {x.annonce.titre}</span>}
                    {x.detail && <span className="text-encre-3"> · {x.detail}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-encre-3 text-sm">Rien pour l&apos;instant.</p>
            )}
          </Carte>
        </div>
        <div className="space-y-5">
          <Carte titre="Coordonnées">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-encre-3">E-mail</dt>
              <dd className="break-all">{c.email}</dd>
              <dt className="text-encre-3">Nom affiché</dt>
              <dd>{nom}</dd>
              <dt className="text-encre-3">Inscrit</dt>
              <dd>{quand(c.creeLe)}</dd>
              <dt className="text-encre-3">Favoris</dt>
              <dd>{favoris.length}</dd>
              <dt className="text-encre-3">Alertes</dt>
              <dd>{alertes.length}</dd>
              {c.pro && (
                <>
                  <dt className="text-encre-3">Entreprise</dt>
                  <dd>
                    {c.pro.pays} · n° {c.pro.identifiant}
                    <br />
                    {c.pro.adresse}, {c.pro.codePostal} {c.pro.ville}
                    <br />
                    {c.pro.telephone}
                  </dd>
                </>
              )}
            </dl>
          </Carte>
          <Carte titre="Modération du compte">
            <ActionsCompte
              id={c.id}
              bloque={Boolean(c.bloque)}
              pro={Boolean(c.pro)}
              proValide={Boolean(
                c.pro?.valideParModeration || c.pro?.verification?.statut === "verifie",
              )}
            />
          </Carte>
          <ActionsFicheCompte
            id={c.id}
            emailVerifie={Boolean(c.emailVerifie)}
            bloque={Boolean(c.bloque)}
          />
        </div>
      </div>
    </>
  )
}
