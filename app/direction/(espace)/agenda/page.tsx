import { ExternalLink } from "lucide-react"
import { connection } from "next/server"
import { ActionsAgenda } from "@/components/direction/ActionsAgenda"
import { AActiver, Carte, date, EnTetePage, Etat, Section } from "@/components/direction/ui"
import {
  lienPaiement,
  listerPropositions,
  PRIX_EUROS,
  stripeActif,
  type Proposition,
  type Statut,
} from "@/lib/agenda/propositions"
import { boiteConfiguree } from "@/lib/direction/mails"
import { redisActif } from "@/lib/direction/redis"
import { cn } from "@/lib/utils/cn"

export const metadata = { title: "Agenda payant — Direction Radio Tripoint" }

const GROUPES: { statut: Statut; titre: string; vide: string }[] = [
  { statut: "a_verifier", titre: "À vérifier", vide: "Aucune demande en attente." },
  { statut: "accepte", titre: "Acceptés, en attente de paiement", vide: "Aucun paiement attendu." },
  { statut: "publie", titre: "Payés et publiés", vide: "Aucun événement payé pour l'instant." },
  { statut: "refuse", titre: "Refusés", vide: "Aucun refus." },
  { statut: "retire", titre: "Retirés", vide: "Aucun retrait." },
]

const VERIF: Record<Proposition["verification"]["statut"], { ok: boolean; texte: string }> = {
  verifie: { ok: true, texte: "Trouvée et active dans l'annuaire de l'État" },
  ferme: { ok: false, texte: "Radiée ou fermée dans l'annuaire" },
  introuvable: { ok: false, texte: "Introuvable dans l'annuaire de l'État" },
  manuel: { ok: false, texte: "À vérifier à la main (registre LU / DE)" },
  indisponible: { ok: false, texte: "Annuaire injoignable : à vérifier à la main" },
  particulier: { ok: false, texte: "Particulier : aucun numéro, à vérifier à la main" },
}

const jour = (iso: string) =>
  date(`${iso}T12:00:00Z`, { weekday: "short", day: "numeric", month: "long", year: "numeric" })

function Dossier({ p }: { p: Proposition }) {
  const c = p.champs
  const v = VERIF[p.verification.statut]
  // Nom officiel différent du nom saisi : à regarder de près.
  const nomDifferent =
    p.verification.nomOfficiel &&
    !p.verification.nomOfficiel.toLowerCase().includes(p.organisation.nom.toLowerCase().slice(0, 6))
  const typeDouteux = p.organisation.type === "association" && p.verification.association === false
  return (
    <Carte>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="min-w-0">
          <p className="text-encre-3 text-xs">
            Reçu le{" "}
            {date(p.cree, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} ·
            dossier {p.id}
          </p>
          <h3 className="mt-1 text-lg leading-snug font-extrabold">{c.titre}</h3>
          <p className="text-encre-2 mt-1 text-sm font-semibold">
            {jour(c.date_debut)}
            {c.heure_debut && ` · ${c.heure_debut}`}
            {c.date_fin && ` → ${jour(c.date_fin)}`}
            {c.heure_fin && ` · ${c.heure_fin}`}
          </p>
          <p className="text-encre-2 text-sm">
            {c.lieu}
            {c.adresse && `, ${c.adresse}`} — {c.ville} ({c.pays}){c.tarif && ` · ${c.tarif}`}
          </p>
          <p className="text-encre-2 mt-3 text-sm leading-relaxed whitespace-pre-line">
            {c.description}
          </p>
          {c.lien && (
            <a
              href={c.lien}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-accent mt-2 inline-flex items-center gap-1 text-sm font-semibold break-all"
            >
              {c.lien}
              <ExternalLink className="size-3.5 flex-none" aria-hidden />
            </a>
          )}
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <p className="surtitre">Structure</p>
            <p className="mt-1 font-bold">{p.organisation.nom}</p>
            <p className="text-encre-2">
              {p.organisation.type === "particulier"
                ? "Particulier"
                : `${p.organisation.type === "association" ? "Association" : "Entreprise"} · ${p.organisation.pays} · n° ${p.organisation.identifiant}`}
            </p>
            <div className="mt-1.5">
              <Etat ok={v.ok}>{v.texte}</Etat>
            </div>
            {p.verification.nomOfficiel && (
              <p
                className={cn("mt-1", nomDifferent ? "text-alerte font-semibold" : "text-encre-2")}
              >
                Nom officiel : {p.verification.nomOfficiel}
                {p.verification.commune && ` (${p.verification.commune})`}
                {nomDifferent && " — différent du nom saisi"}
              </p>
            )}
            {typeDouteux && (
              <p className="text-alerte mt-1 font-semibold">
                Déclarée « association », mais l&apos;annuaire ne la classe pas comme telle.
              </p>
            )}
            {p.verification.lien && (
              <a
                href={p.verification.lien}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent mt-1 inline-flex items-center gap-1 font-semibold"
              >
                Voir dans le registre officiel
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            )}
          </div>
          <div>
            <p className="surtitre">Contact</p>
            <p className="mt-1">
              {p.contact.nom} ·{" "}
              <a href={`mailto:${p.contact.email}`} className="text-accent font-semibold">
                {p.contact.email}
              </a>
              {p.contact.telephone && ` · ${p.contact.telephone}`}
            </p>
            <p className="text-encre-3 text-xs">Formulaire rempli en {p.langue.toUpperCase()}</p>
          </div>
          {(p.mailEnvoye || p.paiement || p.motifRefus) && (
            <div className="text-encre-2 space-y-0.5 text-xs">
              {p.mailEnvoye && (
                <p>
                  Lien de paiement envoyé le{" "}
                  {date(p.mailEnvoye, {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
              {p.paiement && (
                <p className="text-bon font-semibold">
                  {(p.paiement.montant / 100).toLocaleString("fr-FR")} € reçus le{" "}
                  {date(p.paiement.le, { day: "numeric", month: "short", year: "numeric" })} (
                  {p.paiement.mode === "stripe"
                    ? `Stripe ${p.paiement.reference ?? ""}`
                    : "hors Stripe"}
                  )
                </p>
              )}
              {p.motifRefus && <p>Motif du refus : {p.motifRefus}</p>}
            </div>
          )}
          {p.statut === "publie" && (
            <a
              href={`/agenda/${p.slug}`}
              target="_blank"
              className="text-accent inline-flex items-center gap-1 font-semibold"
            >
              Voir dans l&apos;agenda
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
          <ActionsAgenda id={p.id} statut={p.statut} lien={lienPaiement(p)} />
        </div>
      </div>
    </Carte>
  )
}

export default async function PageAgendaPayant() {
  await connection()
  if (!redisActif())
    return (
      <>
        <EnTetePage titre="Agenda payant" source="Événements proposés par les organisateurs" />
        <AActiver titre="Redis n'est pas branché">
          Les demandes sont rangées dans Redis (Upstash). Sans lui, le formulaire public répond «
          non configuré ».
        </AActiver>
      </>
    )

  const liste = await listerPropositions()
  const parStatut = (s: Statut) => (liste ?? []).filter((p) => p.statut === s)
  const encaisse = (liste ?? []).reduce((n, p) => n + (p.paiement?.montant ?? 0), 0) / 100

  return (
    <>
      <EnTetePage
        titre="Agenda payant"
        source={`Événements proposés sur /agenda/proposer · ${PRIX_EUROS} € par événement, demandés seulement après acceptation`}
      >
        <a
          href="/agenda/proposer"
          target="_blank"
          className="border-trait inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
        >
          Voir le formulaire public
          <ExternalLink className="size-4" aria-hidden />
        </a>
      </EnTetePage>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Carte titre="Paiement en ligne">
          {stripeActif() ? (
            <Etat ok>Stripe branché</Etat>
          ) : (
            <>
              <Etat ok={false}>Stripe pas encore branché</Etat>
              <p className="text-encre-2 mt-1.5 text-xs leading-relaxed">
                En attendant : acceptez, encaissez autrement, puis « Marquer payé ».
              </p>
            </>
          )}
        </Carte>
        <Carte titre="E-mails aux organisateurs">
          <Etat ok={boiteConfiguree()}>
            {boiteConfiguree() ? "Envoyés depuis info@" : "Boîte mail non branchée"}
          </Etat>
        </Carte>
        <Carte titre="Encaissé">
          <p className="text-2xl font-extrabold">{encaisse.toLocaleString("fr-FR")} €</p>
          <p className="text-encre-3 mt-1 text-xs">
            {parStatut("publie").length} événement(s) publié(s)
          </p>
        </Carte>
      </div>

      {liste === null ? (
        <AActiver titre="Lecture impossible">
          Redis ne répond pas. Réessayez dans un instant.
        </AActiver>
      ) : (
        <div className="space-y-10">
          {GROUPES.map((g) => {
            const dossiers = parStatut(g.statut)
            if (!dossiers.length && (g.statut === "refuse" || g.statut === "retire")) return null
            return (
              <Section key={g.statut} id={g.statut} titre={`${g.titre} (${dossiers.length})`}>
                {dossiers.length ? (
                  <div className="space-y-4">
                    {dossiers.map((p) => (
                      <Dossier key={p.id} p={p} />
                    ))}
                  </div>
                ) : (
                  <p className="text-encre-3 text-sm">{g.vide}</p>
                )}
              </Section>
            )
          })}
        </div>
      )}
    </>
  )
}
