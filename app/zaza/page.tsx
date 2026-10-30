import Image from "next/image"
import { SoleilRiviera } from "@/components/zaza/Soleil"
import logo from "@/components/zaza/logo-zaza.webp"
import { StatutOuverture, TableHoraires } from "@/components/zaza/Vivants"
import { BOUTIQUE } from "@/lib/zaza/boutique"

/**
 * Accueil public tant que la boutique en ligne n'est pas prête : « Bientôt
 * disponible », et tout ce qu'il faut pour venir en boutique (adresse,
 * horaires, ouvert ou fermé en ce moment, téléphone, Instagram). Aucun
 * produit ici : la maquette complète se relit sur /apercu.
 */
export default function BientotDisponible() {
  const bouton =
    "inline-flex h-13 items-center justify-center rounded-full px-6 font-semibold transition"
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="store h-2.5 [--raie:22px]" />

      <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-6 px-5 pt-8 pb-14 md:grid-cols-[1.1fr_1fr] md:pt-16">
        <div className="relative mx-auto w-full max-w-[15rem] md:order-2 md:max-w-none">
          <SoleilRiviera className="soleil w-full" />
          <Image
            src={logo}
            alt="Logo Zaza Riviera Herbs : une feuille de chanvre coiffée de palmes"
            className="medaillon absolute top-[7%] left-[16%] w-[68%] rounded-full"
            sizes="(min-width: 768px) 360px, 160px"
            priority
          />
        </div>

        <div className="text-center md:order-1 md:text-left">
          <h1 className="text-nuit leading-[0.82]">
            <span className="font-display block text-[6rem] font-semibold tracking-tight italic md:text-[9rem]">
              Zaza
            </span>
            <span className="mt-3 block text-sm font-bold tracking-[0.55em] uppercase md:text-base">
              Riviera Herbs
            </span>
          </h1>

          <p className="bg-nuit text-or-clair mt-8 inline-block rounded-full px-5 py-2 text-sm font-bold tracking-[0.25em] uppercase">
            Bientôt disponible
          </p>
          <p className="font-display text-nuit mt-5 text-3xl leading-tight md:text-4xl">
            Notre boutique en ligne <em>arrive bientôt.</em>
          </p>
          <p className="text-encre-2 mx-auto mt-4 max-w-md text-lg leading-relaxed md:mx-0">
            En attendant, on vous accueille au {BOUTIQUE.rue}, {BOUTIQUE.repere}, à{" "}
            <span className="whitespace-nowrap">{BOUTIQUE.ville}.</span>
          </p>

          <div className="mt-6">
            <StatutOuverture />
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href={BOUTIQUE.itineraire}
              target="_blank"
              rel="noopener noreferrer"
              className={`${bouton} bg-nuit text-papier hover:bg-nuit-2`}
            >
              Itinéraire
            </a>
            <a
              href={`tel:${BOUTIQUE.telephone.replace(/\s/g, "")}`}
              className={`${bouton} border-nuit/30 text-nuit hover:bg-creme-2 border`}
            >
              Appeler
            </a>
            <a
              href={BOUTIQUE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`${bouton} border-nuit/30 text-nuit hover:bg-creme-2 border`}
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="bg-nuit text-papier">
        <div className="store store-or h-2.5 [--raie:22px]" />
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2">
          <div>
            <p className="text-or-clair text-[0.68rem] font-bold tracking-[0.25em] uppercase">
              Horaires de la boutique
            </p>
            <div className="mt-3">
              <TableHoraires />
            </div>
          </div>
          <div className="text-papier/80 text-sm leading-relaxed">
            <p className="text-or-clair mb-2 text-[0.68rem] font-bold tracking-[0.25em] uppercase">
              Nous trouver
            </p>
            <p>{BOUTIQUE.rue}</p>
            <p>
              {BOUTIQUE.codePostal} {BOUTIQUE.ville}
            </p>
            <p className="text-papier/60">{BOUTIQUE.repere}</p>
            <p className="mt-3">{BOUTIQUE.telephone}</p>
            <p className="text-papier/55 mt-8 text-xs">
              {BOUTIQUE.accroche}. Vente interdite aux mineurs.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
