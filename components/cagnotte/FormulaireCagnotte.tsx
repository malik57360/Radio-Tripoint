"use client"

import { ArrowRight, Lock } from "lucide-react"
import { useEffect, useState } from "react"
import { useT } from "@/components/i18n/Langue"
import { codesLangues } from "@/lib/i18n/langues"

/**
 * Choix du montant : des montants proposés, ou un montant libre qui
 * l'emporte dès qu'il est rempli. Formulaire HTML classique (il marche
 * même sans JavaScript) : l'API ouvre la page de paiement Stripe.
 */
export function FormulaireCagnotte({
  montants,
  min,
  max,
}: {
  montants: readonly number[]
  min: number
  max: number
}) {
  const t = useT()
  const [choix, setChoix] = useState(String(montants[1] ?? montants[0]))
  const [libre, setLibre] = useState("")
  const [envoi, setEnvoi] = useState(false)

  // Retour arrière depuis Stripe (cache du navigateur) : le bouton revit.
  useEffect(() => {
    const revivre = (e: PageTransitionEvent) => e.persisted && setEnvoi(false)
    window.addEventListener("pageshow", revivre)
    return () => window.removeEventListener("pageshow", revivre)
  }, [])

  const valeur = Number((libre.trim() || choix).replace(",", "."))
  const valide = Number.isFinite(valeur) && valeur >= min && valeur <= max
  const euros = (n: number) =>
    new Intl.NumberFormat(t.langue === "lb" ? "de-LU" : codesLangues[t.langue].html, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
      maximumFractionDigits: 2,
    })
      .format(n)
      .replace(/\u202f/g, "\u00a0")

  return (
    <form method="post" action="/api/cagnotte" onSubmit={() => setEnvoi(true)}>
      <input type="hidden" name="l" value={t.langue} />
      <fieldset>
        <legend className="etiquette">
          {t({
            fr: "Votre participation",
            de: "Ihr Beitrag",
            lb: "Äre Bäitrag",
            en: "Your contribution",
            es: "Su aportación",
          })}
        </legend>
        <div className="grid grid-cols-4 gap-2">
          {montants.map((m) => (
            <label key={m} className="relative">
              <input
                type="radio"
                name="montant"
                value={m}
                checked={!libre.trim() && choix === String(m)}
                onChange={() => {
                  setChoix(String(m))
                  setLibre("")
                }}
                className="peer sr-only"
              />
              <span className="border-trait text-encre peer-checked:border-encre peer-checked:bg-encre peer-checked:text-papier peer-focus-visible:ring-focus hover:border-encre-3 flex min-h-12 cursor-pointer items-center justify-center rounded-full border-[1.5px] text-[1.05rem] font-bold tabular-nums transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2">
                {euros(m)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label htmlFor="cagnotte-libre" className="etiquette mt-5">
        {t({
          fr: "Ou le montant de votre choix",
          de: "Oder ein Betrag Ihrer Wahl",
          lb: "Oder e Betrag vun Ärer Wiel",
          en: "Or an amount of your choice",
          es: "O el importe que usted elija",
        })}
      </label>
      <div className="relative">
        <input
          id="cagnotte-libre"
          name="libre"
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step="0.01"
          value={libre}
          onChange={(e) => setLibre(e.target.value)}
          placeholder={t({
            fr: "Ex. 35",
            de: "z. B. 35",
            lb: "z. B. 35",
            en: "e.g. 35",
            es: "Ej. 35",
          })}
          aria-invalid={libre.trim() !== "" && !valide}
          aria-describedby="cagnotte-bornes"
          className="champ pr-10 tabular-nums"
        />
        <span
          aria-hidden
          className="text-encre-3 pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-bold"
        >
          €
        </span>
      </div>
      <p id="cagnotte-bornes" className="text-encre-3 mt-1.5 text-sm">
        {t({
          fr: `De ${euros(min)} à ${euros(max)}.`,
          de: `Von ${euros(min)} bis ${euros(max)}.`,
          lb: `Vun ${euros(min)} bis ${euros(max)}.`,
          en: `From ${euros(min)} to ${euros(max)}.`,
          es: `De ${euros(min)} a ${euros(max)}.`,
        })}
      </p>

      <button
        type="submit"
        disabled={!valide || envoi}
        className="btn btn-plein mt-6 min-h-14 w-full text-base disabled:cursor-not-allowed disabled:opacity-50"
      >
        {envoi
          ? t({
              fr: "Ouverture du paiement…",
              de: "Zahlung wird geöffnet …",
              lb: "Bezuelung gëtt opgemaach …",
              en: "Opening payment…",
              es: "Abriendo el pago…",
            })
          : `${t({
              fr: "Participer",
              de: "Beitragen",
              lb: "Bäidroen",
              en: "Contribute",
              es: "Participar",
            })}${valide ? ` · ${euros(valeur)}` : ""}`}
        {!envoi && <ArrowRight className="size-4" aria-hidden />}
      </button>

      <p className="text-encre-2 mt-4 flex items-start gap-2 text-sm">
        <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          {t({
            fr: "Paiement sécurisé par Stripe. Radio Tripoint ne voit jamais votre numéro de carte.",
            de: "Sichere Zahlung über Stripe. Radio Tripoint sieht Ihre Kartennummer nie.",
            lb: "Sécher Bezuelung iwwer Stripe. Radio Tripoint gesäit Är Kaartennummer ni.",
            en: "Secure payment by Stripe. Radio Tripoint never sees your card number.",
            es: "Pago seguro con Stripe. Radio Tripoint nunca ve el número de su tarjeta.",
          })}
        </span>
      </p>
    </form>
  )
}
