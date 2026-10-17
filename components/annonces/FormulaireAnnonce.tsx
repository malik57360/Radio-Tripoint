"use client"

import { Check, ImagePlus } from "lucide-react"
import { useState } from "react"
import { ICONES, TEINTES } from "@/components/annonces/Annonces"
import { CATEGORIES, type Categorie } from "@/lib/annonces/exemples"
import { cn } from "@/lib/utils/cn"

/** MAQUETTE — formulaire « Déposer une annonce » (l'envoi n'est pas branché). */

const ORDRE: Categorie[] = ["emploi", "vehicules", "affaires", "services"]

const CHAMPS: Record<Categorie, { prix: string; aide: string; details: string[] }> = {
  emploi: {
    prix: "Salaire (facultatif)",
    aide: "Ex. « Selon profil » ou une fourchette",
    details: ["Type de contrat", "Temps de travail", "Lieu de travail"],
  },
  vehicules: { prix: "Prix", aide: "En euros", details: ["Année", "Kilométrage", "Carburant"] },
  affaires: {
    prix: "Prix",
    aide: "En euros, ou « À donner »",
    details: ["État", "Retrait / livraison"],
  },
  services: {
    prix: "Tarif (facultatif)",
    aide: "Ex. « 15 € / heure » ou « Gratuit »",
    details: ["Quand", "Pour qui"],
  },
}

export function FormulaireAnnonce({ proParDefaut = false }: { proParDefaut?: boolean }) {
  const [categorie, setCategorie] = useState<Categorie>("affaires")
  const [pro, setPro] = useState(proParDefaut)
  const c = CHAMPS[categorie]
  return (
    <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend className="surtitre text-encre-3 mb-4">1. Rubrique</legend>
        <div className="grid grid-cols-2 gap-3">
          {ORDRE.map((k) => {
            const Icone = ICONES[k]
            const actif = k === categorie
            return (
              <button
                key={k}
                type="button"
                aria-pressed={actif}
                onClick={() => setCategorie(k)}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors",
                  actif ? "border-encre" : "border-trait hover:border-trait-fort",
                )}
              >
                <span
                  className={cn("grid size-10 flex-none place-items-center rounded-md", TEINTES[k])}
                >
                  <Icone className="size-5" aria-hidden />
                </span>
                <span className="text-[0.95rem] leading-tight font-bold">{CATEGORIES[k].nom}</span>
                {actif && <Check className="absolute top-2 right-2 size-4" aria-hidden />}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="surtitre text-encre-3 mb-4">2. Vous êtes</legend>
        <div className="grid grid-cols-2 gap-3">
          {[
            { v: false, t: "Particulier", d: "Gratuit" },
            { v: true, t: "Professionnel", d: "Tarif à définir" },
          ].map((o) => (
            <button
              key={o.t}
              type="button"
              aria-pressed={pro === o.v}
              onClick={() => setPro(o.v)}
              className={cn(
                "rounded-lg border-2 p-3 text-left",
                pro === o.v ? "border-encre" : "border-trait hover:border-trait-fort",
              )}
            >
              <span className="block font-bold">{o.t}</span>
              <span className="text-encre-3 text-sm">{o.d}</span>
            </button>
          ))}
        </div>
        {pro && (
          <p className="text-encre-2 mt-3 text-sm">
            Entreprise, commerce, agence : le paiement se fera en ligne après validation de
            l’annonce, comme pour l’agenda.
          </p>
        )}
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="surtitre text-encre-3 mb-4">3. Votre annonce</legend>
        <div>
          <label htmlFor="titre" className="block text-sm font-semibold">
            Titre
          </label>
          <input
            id="titre"
            className="champ mt-1 w-full"
            placeholder="Ce que vous proposez, en quelques mots"
          />
        </div>
        <div>
          <label htmlFor="desc" className="block text-sm font-semibold">
            Description
          </label>
          <textarea
            id="desc"
            rows={5}
            className="champ mt-1 w-full"
            placeholder="Décrivez, avec les infos utiles"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="prix" className="block text-sm font-semibold">
              {c.prix}
            </label>
            <input id="prix" className="champ mt-1 w-full" placeholder={c.aide} />
          </div>
          <div>
            <label htmlFor="ville" className="block text-sm font-semibold">
              Commune
            </label>
            <input
              id="ville"
              className="champ mt-1 w-full"
              placeholder="Ex. Sierck-les-Bains, Remich, Perl…"
            />
          </div>
          {c.details.map((d) => (
            <div key={d}>
              <label className="block text-sm font-semibold">{d}</label>
              <input className="champ mt-1 w-full" />
            </div>
          ))}
        </div>
        <div className="border-trait-fort text-encre-3 grid place-items-center rounded-lg border-2 border-dashed px-4 py-8 text-center">
          <ImagePlus className="size-7" aria-hidden />
          <p className="mt-2 text-sm font-semibold">Ajoutez jusqu’à 5 photos</p>
          <p className="text-xs">JPG ou PNG, 8 Mo au plus</p>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="surtitre text-encre-3 mb-4">
          4. Vos coordonnées (jamais affichées)
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold">
              E-mail
            </label>
            <input id="email" className="champ mt-1 w-full" placeholder="vous@exemple.fr" />
          </div>
          <div>
            <label htmlFor="tel" className="block text-sm font-semibold">
              Téléphone (facultatif)
            </label>
            <input id="tel" className="champ mt-1 w-full" />
          </div>
        </div>
        <label className="flex gap-3 text-sm">
          <input type="checkbox" className="mt-0.5 size-4 flex-none" />
          <span>
            Je certifie que mon annonce est exacte et respecte les règles de la rubrique (pas
            d’objet interdit, pas de discrimination dans les offres d’emploi).
          </span>
        </label>
      </fieldset>

      <div>
        <button
          type="submit"
          disabled
          className="btn btn-plein w-full justify-center opacity-70 sm:w-auto"
        >
          Envoyer pour validation (maquette)
        </button>
        <p className="text-encre-3 mt-3 text-sm">
          L’équipe de Radio Tripoint vérifie chaque annonce avant de la publier. Elle reste en ligne
          30 jours, et vous pouvez la retirer à tout moment.
        </p>
      </div>
    </form>
  )
}
