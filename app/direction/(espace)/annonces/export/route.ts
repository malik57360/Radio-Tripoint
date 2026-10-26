import { listerAnnonces } from "@/lib/annonces/annonces"
import { listerCommandes } from "@/lib/annonces/commandes"
import { listerComptes } from "@/lib/annonces/comptes"
import { lireConfig, nomCategorie } from "@/lib/annonces/config"
import { LIBELLES_STATUT } from "@/lib/annonces/types"
import { estConnecte } from "@/lib/direction/acces"

/**
 * Exports du tableau de bord (CSV, séparateur « ; » et BOM UTF-8 : s'ouvre
 * tel quel dans Excel ou LibreOffice). Jamais de mot de passe, même haché.
 */
export const dynamic = "force-dynamic"

const cellule = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v)
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const dateIso = (ms?: number | null) =>
  ms ? new Date(ms).toLocaleString("sv-SE", { timeZone: "Europe/Paris" }) : ""
const euros = (c: number | null | undefined) =>
  c === null || c === undefined ? "" : (c / 100).toFixed(2).replace(".", ",")

export async function GET(req: Request) {
  if (!(await estConnecte()))
    return new Response("Connectez-vous au tableau de bord.", { status: 401 })
  const quoi = new URL(req.url).searchParams.get("quoi")
  let lignes: unknown[][]
  if (quoi === "annonces") {
    const [annonces, comptes, cfg] = await Promise.all([
      listerAnnonces(5000),
      listerComptes(5000),
      lireConfig(),
    ])
    const email = new Map(comptes.map((c) => [c.id, c.email]))
    lignes = [
      [
        "numero",
        "titre",
        "statut",
        "categorie",
        "prix_eur",
        "ville",
        "code_postal",
        "pays",
        "annonceur",
        "e-mail",
        "deposee",
        "publiee",
        "fin",
        "vendue",
        "signalements",
      ],
      ...annonces.map((a) => [
        a.id,
        a.titre,
        LIBELLES_STATUT[a.statut],
        nomCategorie(cfg, a.categorie),
        euros(a.prix),
        a.ville,
        a.codePostal,
        a.pays,
        a.annonceur,
        email.get(a.compte) ?? "",
        dateIso(a.creeLe),
        dateIso(a.publieeLe),
        dateIso(a.expireLe),
        dateIso(a.vendueLe),
        a.signalements ?? 0,
      ]),
    ]
  } else if (quoi === "comptes") {
    const comptes = await listerComptes(5000)
    lignes = [
      [
        "numero",
        "nom",
        "e-mail",
        "type",
        "entreprise",
        "identifiant_entreprise",
        "inscrit",
        "e-mail_confirme",
        "suspendu",
        "derniere_connexion",
      ],
      ...comptes.map((c) => [
        c.id,
        c.nom,
        c.email,
        c.type,
        c.pro?.raisonSociale ?? "",
        c.pro?.identifiant ?? "",
        dateIso(c.creeLe),
        c.emailVerifie ? "oui" : "non",
        c.bloque ? `oui (${c.bloque.motif})` : "non",
        dateIso(c.derniereConnexion),
      ]),
    ]
  } else if (quoi === "paiements") {
    const commandes = await listerCommandes(5000)
    lignes = [
      ["numero", "date", "payee_le", "statut", "total_eur", "contenu", "e-mail", "annonce"],
      ...commandes.map((c) => [
        c.id,
        dateIso(c.creeLe),
        dateIso(c.payeeLe),
        c.statut,
        euros(c.total),
        c.lignes.map((l) => l.libelle).join(" + "),
        c.email,
        c.annonce ?? "",
      ]),
    ]
  } else return new Response("Export inconnu.", { status: 400 })

  const csv = "﻿" + lignes.map((l) => l.map(cellule).join(";")).join("\r\n")
  const jour = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" })
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="annonces-${quoi}-${jour}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
