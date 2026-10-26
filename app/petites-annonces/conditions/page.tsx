import { CadreCompte } from "@/components/annonces/CadreCompte"
import Link from "@/components/ui/Lien"
import { ACompleter, ProseLegale } from "@/components/ui/ProseLegale"
import { site } from "@/config/site"
import { metaAnnonces } from "@/lib/annonces/seo"

export const generateMetadata = () =>
  metaAnnonces({
    titre: "Conditions d'utilisation et de vente",
    description:
      "Conditions d'utilisation et conditions de vente des Petites annonces de Radio Tripoint.",
    chemin: "/conditions",
  })

/**
 * Conditions des Petites annonces. Version provisoire, affichée comme
 * telle : à faire relire par un juriste avant d'être considérée comme
 * définitive. Ce qui n'est pas connu (médiateur, TVA) reste « à compléter ».
 */
export default async function PageConditions() {
  const l = site.legal
  return (
    <CadreCompte titre="Conditions" chemin="/conditions" large>
      <p className="mb-8 max-w-3xl rounded-lg bg-[#fdefc0] p-4 text-sm font-semibold text-black">
        Version provisoire du 26 octobre 2026, en cours de relecture juridique. Elle s&apos;applique
        dès maintenant ; toute nouvelle version sera publiée sur cette page.
      </p>
      <ProseLegale>
        <h2 id="editeur">1. Qui sommes-nous</h2>
        <p>
          Les Petites annonces du Tripoint sont un service de {site.nomOfficiel}, édité par{" "}
          {l.raisonSociale}
          {l.formeJuridique && `, ${l.formeJuridique}`}
          {l.siegeSocial && `, siège social : ${l.siegeSocial}`}
          {l.siret && `, SIRET ${l.siret}`}. Contact :{" "}
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>,{" "}
          {site.contact.telephone}. Voir aussi les{" "}
          <Link href="/mentions-legales">mentions légales</Link>.
        </p>

        <h2 id="service">2. Le service</h2>
        <p>
          Le service permet de publier des petites annonces et d&apos;être contacté par les
          personnes intéressées. Radio Tripoint met en relation : elle n&apos;est partie à aucune
          vente, location, prestation ou embauche conclue entre utilisateurs, n&apos;encaisse aucune
          somme pour leur compte et ne garantit ni les biens, ni les services, ni la solvabilité ou
          l&apos;identité des utilisateurs au-delà des vérifications décrites ici.
        </p>

        <h2 id="compte">3. Votre compte</h2>
        <ul>
          <li>
            Le compte est personnel. Les informations données doivent être exactes et tenues à jour.
          </li>
          <li>
            Vous gardez votre mot de passe secret ; toute action faite avec votre compte est réputée
            faite par vous.
          </li>
          <li>
            Un professionnel (personne qui agit pour son activité commerciale, artisanale, libérale
            ou agricole) doit ouvrir un compte professionnel et indiquer le nom, l&apos;adresse, le
            téléphone et le numéro d&apos;immatriculation de son entreprise. Ces informations sont
            affichées sur ses annonces.
          </li>
          <li>
            Radio Tripoint peut suspendre ou fermer un compte en cas de manquement à ces conditions
            ou aux <Link href="/regles">règles de la rubrique</Link>, notamment en cas de fraude ou
            de tentative d&apos;arnaque. Vous pouvez supprimer votre compte à tout moment depuis Mon
            espace.
          </li>
        </ul>

        <h2 id="annonces">4. Les annonces</h2>
        <ul>
          <li>
            Vous êtes seul responsable du contenu de vos annonces et de leur conformité à la loi.
          </li>
          <li>
            Chaque annonce est vérifiée avant publication. Radio Tripoint peut refuser, masquer ou
            retirer une annonce contraire aux règles ou à la loi, ou signalée et jugée problématique
            ; le motif est communiqué à l&apos;annonceur, qui peut contester en répondant à
            l&apos;e-mail reçu.
          </li>
          <li>
            En publiant, vous autorisez Radio Tripoint à afficher votre annonce et ses photos sur
            son site pendant sa durée de publication. Vous garantissez détenir les droits sur les
            photos.
          </li>
          <li>
            Le classement des annonces et les mises en avant sont décrits dans les règles de la
            rubrique.
          </li>
        </ul>

        <h2 id="vente">5. Services payants (conditions de vente)</h2>
        <ul>
          <li>
            Les prix sont indiqués en euros sur le formulaire au moment de la commande. TVA :{" "}
            <ACompleter valeur={null} />.
          </li>
          <li>
            Le paiement se fait par carte via Stripe ; Radio Tripoint n&apos;a jamais accès à vos
            données bancaires. Un reçu est envoyé par e-mail après le paiement.
          </li>
          <li>
            Une formule payante prend effet à la publication de l&apos;annonce, après vérification ;
            une option achetée pour une annonce déjà en ligne prend effet dès le paiement confirmé.
          </li>
          <li>
            <strong>Remboursement.</strong> Une annonce payée puis refusée à la vérification, ou
            retirée par son auteur avant sa publication, est remboursée en totalité. Une annonce
            retirée après publication pour manquement aux règles n&apos;est pas remboursée.
          </li>
          <li>
            <strong>Rétractation (consommateurs).</strong> Vous disposez de 14 jours après
            l&apos;achat pour vous rétracter, sans motif, en écrivant à {site.contact.email}. Si
            vous avez demandé que le service commence avant la fin de ce délai, vous payez la part
            déjà fournie ; pour un service entièrement exécuté (remontée), le droit de rétractation
            ne s&apos;applique plus une fois l&apos;exécution commencée avec votre accord.
          </li>
          <li>
            Réclamations : {site.contact.email}. Médiateur de la consommation :{" "}
            <ACompleter valeur={null} />. À défaut d&apos;accord amiable, le consommateur peut aussi
            saisir les juridictions compétentes.
          </li>
        </ul>

        <h2 id="donnees">6. Vos données</h2>
        <p>
          Pour ce service, nous traitons : votre e-mail, votre prénom ou pseudo, votre mot de passe
          (seulement sous forme chiffrée irréversible), les informations de votre entreprise si vous
          êtes professionnel, vos annonces et photos, l&apos;historique de vos commandes, ainsi
          qu&apos;une empreinte de votre adresse IP pour limiter les abus. Les messages envoyés aux
          annonceurs leur sont transmis par e-mail ; une copie s&apos;affiche dans « Mon espace » de
          l&apos;expéditeur et du destinataire pendant 90 jours, puis elle est effacée
          (l&apos;adresse e-mail d&apos;un annonceur n&apos;est jamais montrée). Vos favoris et vos
          alertes de recherche restent dans votre compte jusqu&apos;à ce que vous les supprimiez.
          Les vues d&apos;une annonce sont comptées sans cookie : une empreinte du visiteur
          n&apos;est gardée qu&apos;une demi-heure, pour ne pas compter deux fois la même personne.
          Le paiement est traité par Stripe. Vos annonces terminées et leurs photos sont effacées
          progressivement ; les données de commande sont conservées le temps imposé par les
          obligations comptables. Depuis « Mon espace », vous pouvez télécharger toutes vos données
          et supprimer votre compte ; pour vos autres droits (rectification, opposition…), écrivez à{" "}
          {site.contact.email}. Voir aussi la{" "}
          <Link href="/politique-confidentialite">politique de confidentialité</Link>.
        </p>

        <h2 id="droit">7. Droit applicable</h2>
        <p>
          Ces conditions sont soumises au droit français, sans priver le consommateur de la
          protection des règles impératives de son pays de résidence.
        </p>
      </ProseLegale>
    </CadreCompte>
  )
}
