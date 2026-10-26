import { Eye, Heart, MessageCircle, Plus, Tag } from "lucide-react"
import { redirect } from "next/navigation"
import { EnTete, TempsRestant, Vide } from "@/components/annonces/espace/Blocs"
import { ActionsMonAnnonce } from "@/components/annonces/Interactions"
import { Vignette, dateLongue, prixAffiche } from "@/components/annonces/Vitrine"
import Link from "@/components/ui/Lien"
import { lireConfig, nomCategorie } from "@/lib/annonces/config"
import { statsAnnonces } from "@/lib/annonces/espace"
import { compteEspace, mesAnnonces } from "@/lib/annonces/espace-donnees"
import { lienAnnonces } from "@/lib/annonces/liens"
import { offreOuverte, optionUtile } from "@/lib/annonces/offres"
import { metaAnnonces } from "@/lib/annonces/seo"
import {
  LIBELLES_STATUT,
  actif,
  cheminAnnonce,
  type Annonce,
  type Statut,
} from "@/lib/annonces/types"
import { cn } from "@/lib/utils/cn"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Mes annonces",
    description: "Gérer vos annonces.",
    chemin: "/mon-espace/annonces",
    noindex: true,
  })

/** Onglets : chaque annonce est dans un seul, et « Toutes » les montre toutes. */
const ONGLETS: { cle: string; nom: string; statuts: Statut[] | null }[] = [
  { cle: "toutes", nom: "Toutes", statuts: null },
  { cle: "en-ligne", nom: "En ligne", statuts: ["publiee"] },
  { cle: "verification", nom: "En vérification", statuts: ["en_attente", "signalee"] },
  { cle: "a-payer", nom: "À régler", statuts: ["attente_paiement"] },
  { cle: "expirees", nom: "Expirées", statuts: ["expiree"] },
  { cle: "terminees", nom: "Vendues et retirées", statuts: ["retiree", "refusee"] },
]

const COULEURS: Record<Statut, string> = {
  publiee: "bg-[#dff3e4] text-[#14532d]",
  en_attente: "bg-[#fdefc0] text-black",
  attente_paiement: "bg-[#fdefc0] text-black",
  signalee: "bg-papier-3 text-encre",
  refusee: "bg-papier-3 text-encre-2",
  expiree: "bg-papier-3 text-encre-2",
  retiree: "bg-papier-3 text-encre-2",
}

export default async function MesAnnonces(
  props: PageProps<"/petites-annonces/mon-espace/annonces">,
) {
  const c = await compteEspace()
  if (!c) redirect("/connexion?suite=/mon-espace/annonces")
  const sp = await props.searchParams
  const onglet = ONGLETS.find((o) => o.cle === sp.statut) ?? ONGLETS[0]
  const [toutes, cfg] = await Promise.all([mesAnnonces(c.id), lireConfig()])
  const { parAnnonce } = await statsAnnonces(toutes.map((a) => a.id))
  const dans = (o: (typeof ONGLETS)[number]) =>
    o.statuts ? toutes.filter((a) => o.statuts?.includes(a.statut)) : toutes
  const liste = dans(onglet)

  const optionsPour = (a: Annonce) => {
    const formule = cfg.offres.find((o) => o.code === a.formule)
    return cfg.offres
      .filter(
        (o) =>
          o.genre === "option" &&
          offreOuverte(o, a.annonceur) &&
          optionUtile(formule, o) &&
          (a.statut === "expiree" ? o.effet === "prolongation" : a.statut === "publiee") &&
          // Mise en avant déjà en cours : pas de doublon.
          !(o.effet === "categorie" && actif(a.categorieJusqu)) &&
          !(o.effet === "renforcee" && actif(a.renforceeJusqu)) &&
          !(o.effet === "accueil" && actif(a.accueilJusqu)),
      )
      .map(({ code, nom, description, prixCentimes, effet }) => ({
        code,
        nom,
        description,
        prixCentimes,
        effet,
      }))
  }

  return (
    <div className="space-y-5">
      {sp.vendue === "1" && (
        <div
          role="status"
          className="bg-surface border-trait flex items-center gap-4 rounded-2xl border p-4"
        >
          <span className="tampon flex-none text-lg">Vendue</span>
          <p className="font-semibold">Bravo pour cette vente ! L&apos;annonce a quitté le site.</p>
        </div>
      )}
      <EnTete
        titre="Mes annonces"
        sousTitre={`${toutes.length} annonce${toutes.length > 1 ? "s" : ""} déposée${toutes.length > 1 ? "s" : ""} au total.`}
        action={
          <Link href="/deposer" className="btn btn-accent min-h-11">
            <Plus className="size-4" aria-hidden />
            Déposer
          </Link>
        }
      />

      <nav aria-label="Filtrer mes annonces" className="-mx-1 overflow-x-auto px-1">
        <ul className="flex gap-1.5">
          {ONGLETS.map((o) => {
            const n = dans(o).length
            const on = o.cle === onglet.cle
            if (!n && !on && o.cle !== "toutes") return null
            return (
              <li key={o.cle} className="flex-none">
                <Link
                  href={
                    o.cle === "toutes"
                      ? "/mon-espace/annonces"
                      : `/mon-espace/annonces?statut=${o.cle}`
                  }
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-[0.85rem] font-bold",
                    on
                      ? "bg-encre border-encre text-papier"
                      : "border-trait bg-surface text-encre-2 hover:border-trait-fort",
                  )}
                >
                  {o.nom}
                  <span className={cn("tabular-nums", on ? "opacity-70" : "text-encre-3")}>
                    {n}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {liste.length === 0 ? (
        <Vide
          icone={Tag}
          titre={toutes.length ? "Aucune annonce ici" : "Pas encore d'annonce"}
          action={
            <Link href="/deposer" className="btn btn-plein min-h-11">
              Déposer une annonce
            </Link>
          }
        >
          {toutes.length
            ? "Choisissez un autre onglet pour retrouver vos annonces."
            : "Déposer une annonce prend quelques minutes, et c'est gratuit pour les particuliers."}
        </Vide>
      ) : (
        <ul className="space-y-3.5">
          {liste.map((a) => {
            const prix = prixAffiche({ prix: a.prix, mention: a.mention, details: a.details })
            const s = parAnnonce.get(a.id)
            const enLigne = a.statut === "publiee"
            return (
              <li
                key={a.id}
                id={`a-${a.id}`}
                className="bg-surface border-trait scroll-mt-28 rounded-2xl border p-3.5 sm:p-4"
              >
                <div className="flex gap-3.5">
                  <Vignette a={a} className="bg-papier-2 size-20 flex-none rounded-xl sm:size-24" />
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[0.72rem] font-extrabold",
                          COULEURS[a.statut],
                        )}
                      >
                        {a.vendueLe ? "Vendue" : LIBELLES_STATUT[a.statut]}
                      </span>
                      <span className="text-encre-3 text-xs">{nomCategorie(cfg, a.categorie)}</span>
                    </p>
                    <p className="mt-1 truncate text-[1.02rem] font-extrabold">
                      {enLigne ? (
                        <Link href={cheminAnnonce(a)} className="hover:underline">
                          {a.titre}
                        </Link>
                      ) : (
                        a.titre
                      )}
                    </p>
                    <p className="text-encre-2 text-sm">
                      {prix && <strong>{prix} · </strong>}
                      {a.ville}
                    </p>
                    {s && (a.publieeLe || s.messages) ? (
                      <p className="text-encre-2 mt-1.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[0.8rem]">
                        <span
                          className="inline-flex items-center gap-1"
                          title="Vues depuis la publication"
                        >
                          <Eye className="size-3.5" aria-hidden />
                          <strong className="tabular-nums">
                            {s.vues.toLocaleString("fr-FR")}
                          </strong>{" "}
                          vue{s.vues > 1 ? "s" : ""}
                          {s.vues7 > 0 && <span className="text-[#14532d]">+{s.vues7} en 7 j</span>}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle className="size-3.5" aria-hidden />
                          <strong className="tabular-nums">{s.messages}</strong> message
                          {s.messages > 1 ? "s" : ""}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Heart className="size-3.5" aria-hidden />
                          <strong className="tabular-nums">{s.favoris}</strong> favori
                          {s.favoris > 1 ? "s" : ""}
                        </span>
                      </p>
                    ) : null}
                    {enLigne && (
                      <TempsRestant debut={a.remonteeLe ?? a.publieeLe} fin={a.expireLe} />
                    )}
                    <p className="text-encre-3 mt-1 text-xs">
                      {a.statut === "expiree" &&
                        a.expireLe &&
                        `Expirée le ${dateLongue(a.expireLe)}`}
                      {a.statut === "en_attente" &&
                        "Vérification en cours, en général dans la journée"}
                      {a.statut === "attente_paiement" && "Elle sera vérifiée dès le paiement reçu"}
                      {a.statut === "signalee" &&
                        "Masquée après plusieurs signalements : l'équipe vérifie"}
                      {a.vendueLe && `Vendue le ${dateLongue(a.vendueLe)}`}
                    </p>
                    {a.motif &&
                      !a.vendueLe &&
                      (a.statut === "refusee" || a.statut === "retiree") && (
                        <p className="text-encre-2 mt-1 text-sm">Motif : {a.motif}</p>
                      )}
                  </div>
                </div>
                <ActionsMonAnnonce
                  id={a.id}
                  statut={a.statut}
                  titre={a.titre}
                  modifiable={["attente_paiement", "en_attente", "publiee"].includes(a.statut)}
                  options={optionsPour(a)}
                  particulier={a.annonceur === "particulier"}
                  lien={enLigne ? lienAnnonces(cheminAnnonce(a)) : undefined}
                />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
