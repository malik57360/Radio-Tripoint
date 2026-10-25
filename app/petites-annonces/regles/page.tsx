import { CadreCompte } from "@/components/annonces/CadreCompte"
import { EncadreArnaques } from "@/components/annonces/Vitrine"
import Link from "@/components/ui/Lien"
import { ProseLegale } from "@/components/ui/ProseLegale"
import { site } from "@/config/site"
import { CATEGORIES_DEPART, INTERDITS } from "@/lib/annonces/categories"
import { categoriesOuvertes, configPublique } from "@/lib/annonces/config"
import { euros } from "@/lib/annonces/offres"
import { metaAnnonces } from "@/lib/annonces/seo"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Règles et aide",
    description:
      "Comment fonctionnent les Petites annonces de Radio Tripoint : dépôt, vérification, classement, tarifs, sécurité et signalement.",
    chemin: "/regles",
  })

export default async function PageRegles() {
  const cfg = await configPublique()
  const fermees = cfg.categories.filter((x) => !x.actif)
  const offres = cfg.offres.filter((o) => o.actif)
  const emploi = CATEGORIES_DEPART.find((x) => x.slug === "emploi")
  return (
    <CadreCompte titre="Règles et aide" chemin="/regles" large>
      <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
        <ProseLegale>
          <h2 id="fonctionnement">Comment ça marche</h2>
          <ul>
            <li>Vous créez un compte (gratuit) et confirmez votre adresse e-mail.</li>
            <li>
              Vous déposez votre annonce : catégorie, texte, photos, commune. Votre adresse e-mail
              et votre téléphone ne sont jamais affichés.
            </li>
            <li>
              L&apos;équipe de Radio Tripoint relit chaque annonce avant de la publier, en général
              dans la journée. Une annonce payante n&apos;est vérifiée qu&apos;une fois le paiement
              confirmé.
            </li>
            <li>
              Une fois publiée, l&apos;annonce reste en ligne la durée de sa formule (30 jours au
              départ). Vous pouvez la modifier — elle est alors revérifiée — ou la retirer à tout
              moment depuis <Link href="/mon-espace">Mon espace</Link>.
            </li>
            <li>
              Les personnes intéressées vous écrivent par le formulaire de l&apos;annonce : leur
              message arrive dans votre boîte mail, et vous leur répondez directement.
            </li>
          </ul>

          <h2 id="categories">Catégories</h2>
          <p>
            Ouvertes :{" "}
            {categoriesOuvertes(cfg)
              .map((x) => x.nom)
              .join(", ")}
            .
            {fermees.length > 0 &&
              ` Pas encore ouvertes : ${fermees.map((x) => x.nom).join(", ")} (règles légales particulières, ouverture prévue plus tard).`}
          </p>
          {emploi?.precautions && (
            <>
              <p>
                <strong>Emploi.</strong> Chaque offre d&apos;emploi doit respecter ces règles, sous
                peine de refus :
              </p>
              <ul>
                {emploi.precautions.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </>
          )}

          <h2 id="interdits">Ce qui est interdit</h2>
          <ul>
            {INTERDITS.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p>
            Sont aussi refusés : les annonces sans objet réel, les textes copiés d&apos;une autre
            annonce, les coordonnées ou liens dans le texte, et tout ce que la loi française,
            luxembourgeoise ou allemande interdit de vendre ou de proposer.
          </p>

          <h2 id="classement">Comment les annonces sont classées</h2>
          <p>
            Par défaut, de la plus récente à la plus ancienne : la date qui compte est celle de la
            publication, ou de la dernière <strong>remontée</strong> achetée par l&apos;annonceur.
            Le tri par prix, si vous le choisissez, remplace cet ordre.
          </p>
          <p>
            Les <strong>mises en avant</strong> sont payées par les annonceurs. Elles sont toujours
            signalées par le badge « Mise en avant » et regroupées dans des emplacements à part :
            bandeau « À la une » d&apos;une catégorie ou de l&apos;accueil, et jusqu&apos;à trois
            places en tête des résultats. Une mise en avant ne garantit aucune vente.
          </p>

          <h2 id="tarifs">Tarifs en vigueur</h2>
          <p>
            Prix en euros, payés en ligne par carte (Stripe). Rien n&apos;est prélevé sans votre
            confirmation.
          </p>
          <ul>
            {offres.map((o) => (
              <li key={o.code}>
                <strong>{o.nom}</strong> (
                {o.pour === "pro"
                  ? "professionnels"
                  : o.code === "photos" || o.code === "accueil"
                    ? "tous"
                    : "particuliers"}
                ) : {euros(o.prixCentimes)}
                {o.jours > 0 && o.prixCentimes > 0 ? ` pour ${o.jours} jours` : ""} —{" "}
                {o.description}
              </li>
            ))}
          </ul>
          <p>
            Un particulier peut avoir {cfg.limites.activesParticulier} annonces actives à la fois.
            Les professionnels paient leur annonce dès la première et apparaissent comme
            professionnels, avec le nom et le numéro d&apos;immatriculation de leur entreprise.
          </p>

          <h2 id="securite">Sécurité</h2>
          <p>
            Radio Tripoint met en relation les annonceurs et les visiteurs. La radio n&apos;est ni
            vendeur ni acheteur : elle ne vérifie pas les objets, n&apos;encaisse rien pour le
            compte des annonceurs et ne garantit pas les transactions. Elle vérifie les annonces
            avant publication et retire celles qui enfreignent les règles.
          </p>

          <h2 id="signaler">Signaler une annonce</h2>
          <p>
            Sur chaque annonce, le lien « Signaler cette annonce » permet, à tout visiteur, de nous
            dire ce qui ne va pas, avec le motif et une explication. Chaque signalement est examiné
            par l&apos;équipe. Après plusieurs signalements de personnes différentes, l&apos;annonce
            est masquée le temps de la vérification.
          </p>
          <p>
            Quand une annonce est refusée ou retirée, son auteur en reçoit le motif par e-mail et
            peut contester la décision en répondant à ce message. Pour toute question :{" "}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
          </p>
        </ProseLegale>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <EncadreArnaques />
          <p className="text-sm">
            <Link href="/conditions" className="underline">
              Conditions d&apos;utilisation et de vente
            </Link>
          </p>
        </aside>
      </div>
    </CadreCompte>
  )
}
