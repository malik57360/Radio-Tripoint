"use client"

import { useActionState } from "react"
import { seConnecter } from "@/app/direction/actions"

export function FormulaireConnexion() {
  const [erreur, action, enCours] = useActionState(seConnecter, null)
  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block">
        <span className="surtitre">Mot de passe</span>
        <input
          type="password"
          name="mot_de_passe"
          required
          autoComplete="current-password"
          autoFocus
          className="border-trait bg-carte-2 text-encre focus:border-accent mt-2 block h-12 w-full rounded-lg border px-4 text-base outline-none"
        />
      </label>
      {erreur && (
        <p role="alert" className="text-alerte text-sm font-semibold">
          {erreur}
        </p>
      )}
      <button
        type="submit"
        disabled={enCours}
        className="bg-accent h-12 w-full rounded-lg text-sm font-bold tracking-wide text-black uppercase disabled:opacity-60"
      >
        {enCours ? "Vérification…" : "Entrer"}
      </button>
    </form>
  )
}
