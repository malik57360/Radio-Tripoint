import Link from "next/link"
import { Carte, Section, date } from "@/components/direction/ui"
import type { Commande } from "@/lib/annonces/commandes"
import type { Compte } from "@/lib/annonces/comptes"
import { euros } from "@/lib/annonces/offres"
import { LIBELLES_STATUT, type Annonce } from "@/lib/annonces/types"

/**
 * Recherche du tableau de bord : un mot, un e-mail, un numéro d'annonce ou
 * de paiement, et tout ce qui correspond — annonces, comptes, paiements —
 * avec un lien vers la fiche où l'on peut agir.
 */
const normaliser = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()

const MAX = 50

export function RechercheAnnonces({
  q,
  annonces,
  comptes,
  commandes,
}: {
  q: string
  annonces: Annonce[]
  comptes: Compte[]
  commandes: Commande[]
}) {
  const n = normaliser(q)
  const trouve = (...champs: (string | undefined | null)[]) =>
    champs.some((c) => c && normaliser(c).includes(n))
  const parId = new Map(comptes.map((c) => [c.id, c]))
  const lesAnnonces = annonces
    .filter((a) =>
      trouve(
        a.id,
        a.titre,
        a.ville,
        a.codePostal,
        a.description.slice(0, 800),
        parId.get(a.compte)?.email,
      ),
    )
    .sort((a, b) => b.majLe - a.majLe)
  const lesComptes = comptes.filter((c) =>
    trouve(c.id, c.email, c.nom, c.pro?.raisonSociale, c.pro?.identifiant, c.pro?.telephone),
  )
  const lesPaiements = commandes.filter((c) => trouve(c.id, c.email, c.annonce))
  const total = lesAnnonces.length + lesComptes.length + lesPaiements.length
  const jour = (ms: number) => date(ms, { day: "numeric", month: "short", year: "numeric" })

  return (
    <Section
      id="recherche"
      titre={`Recherche « ${q} »`}
      sousTitre={total ? `${total} résultat${total > 1 ? "s" : ""}` : "Aucun résultat"}
    >
      <div className="mb-4">
        <Link href="/direction/annonces" className="text-accent text-sm font-bold">
          ← Revenir aux onglets
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Carte titre={`Annonces (${lesAnnonces.length})`}>
          <ul className="divide-trait divide-y text-sm">
            {lesAnnonces.slice(0, MAX).map((a) => (
              <li key={a.id} className="py-2.5 first:pt-0">
                <Link
                  href={`/direction/annonces/annonce/${a.id}`}
                  className="font-bold hover:underline"
                >
                  {a.titre}
                </Link>
                <span className="text-encre-3 block text-xs">
                  {LIBELLES_STATUT[a.statut]} · {a.ville} · {jour(a.creeLe)} ·{" "}
                  {parId.get(a.compte)?.email ?? "compte supprimé"}
                </span>
              </li>
            ))}
            {!lesAnnonces.length && <li className="text-encre-3">Aucune annonce.</li>}
          </ul>
        </Carte>
        <Carte titre={`Comptes (${lesComptes.length})`}>
          <ul className="divide-trait divide-y text-sm">
            {lesComptes.slice(0, MAX).map((c) => (
              <li key={c.id} className="py-2.5 first:pt-0">
                <Link
                  href={`/direction/annonces/compte/${c.id}`}
                  className="font-bold hover:underline"
                >
                  {c.type === "pro" && c.pro ? c.pro.raisonSociale : c.nom}
                </Link>
                <span className="text-encre-3 block text-xs break-all">
                  {c.email} · {c.type} · inscrit le {jour(c.creeLe)}
                  {c.bloque ? " · suspendu" : ""}
                </span>
              </li>
            ))}
            {!lesComptes.length && <li className="text-encre-3">Aucun compte.</li>}
          </ul>
        </Carte>
        <Carte titre={`Paiements (${lesPaiements.length})`}>
          <ul className="divide-trait divide-y text-sm">
            {lesPaiements.slice(0, MAX).map((c) => (
              <li key={c.id} className="py-2.5 first:pt-0">
                <strong>{euros(c.total)}</strong> · {c.lignes.map((l) => l.libelle).join(", ")}
                <span className="text-encre-3 block text-xs break-all">
                  {jour(c.creeLe)} · {c.email} · {c.statut}
                  {c.annonce && (
                    <>
                      {" · "}
                      <Link
                        href={`/direction/annonces/annonce/${c.annonce}`}
                        className="text-accent font-semibold"
                      >
                        l&apos;annonce
                      </Link>
                    </>
                  )}
                </span>
              </li>
            ))}
            {!lesPaiements.length && <li className="text-encre-3">Aucun paiement.</li>}
          </ul>
        </Carte>
      </div>
    </Section>
  )
}
