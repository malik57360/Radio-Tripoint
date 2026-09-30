import { createHash } from "node:crypto"
import { autoriser } from "@/lib/formulaires/limiteur"
import { choisir, estLangue, type Langue, type Trad } from "@/lib/i18n/langues"
import {
  PIECE_JOINTE,
  creerSchemas,
  objetsMail,
  typesFormulaire,
  type TypeFormulaire,
} from "@/lib/formulaires/schemas"

/**
 * Réception des formulaires. Chaîne : anti-robot (champ piège + délai) →
 * limite de débit → validation/nettoyage Zod → pièce jointe → webhook.
 * Aucune donnée personnelle n'est écrite dans les journaux.
 */
const DELAI_MIN_MS = 2500
const DELAI_MAX_MS = 24 * 3600 * 1000

const json = (corps: object, status = 200) =>
  Response.json(corps, { status, headers: { "Cache-Control": "no-store" } })

export async function POST(request: Request, ctx: { params: Promise<{ type: string }> }) {
  const { type } = await ctx.params
  if (!typesFormulaire.includes(type as TypeFormulaire)) return json({ statut: "erreur" }, 404)
  const t = type as TypeFormulaire

  let donnees: FormData
  try {
    donnees = await request.formData()
  } catch {
    return json({ statut: "erreur", message: "Requête invalide." }, 400)
  }

  const l: Langue = estLangue(donnees.get("_langue")) ? (donnees.get("_langue") as Langue) : "fr"
  const dire = (x: Trad) => choisir(x, l)

  // 1. Anti-robot. Un robot reçoit un faux succès : il n'apprend rien.
  const piege = String(donnees.get("site_web") ?? "")
  const debut = Number(donnees.get("_t") ?? 0)
  const ecoule = Date.now() - debut
  if (piege !== "" || !debut || ecoule < DELAI_MIN_MS || ecoule > DELAI_MAX_MS) {
    return json({ statut: "succes" })
  }

  // 2. Débit : 5 envois / 10 min / IP / formulaire. L'IP est hachée.
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue"
  const cle = createHash("sha256").update(`${t}:${ip}`).digest("hex").slice(0, 24)
  if (!autoriser(cle, 5, 10 * 60 * 1000)) {
    return json(
      {
        statut: "erreur",
        message: dire({
          fr: "Trop d'envois en peu de temps. Réessayez dans quelques minutes.",
          de: "Zu viele Sendungen in kurzer Zeit. Versuchen Sie es in einigen Minuten erneut.",
          lb: "Ze vill Sendungen a kuerzer Zäit. Probéiert et an e puer Minutten nach eng Kéier.",
        }),
      },
      429,
    )
  }

  // 3. Validation et nettoyage.
  const brut: Record<string, string> = {}
  for (const [k, v] of donnees.entries())
    if (typeof v === "string" && !k.startsWith("_") && k !== "site_web") brut[k] = v
  const resultat = creerSchemas(l)[t].safeParse(brut)
  if (!resultat.success) {
    const champs: Record<string, string> = {}
    for (const e of resultat.error.issues) {
      const k = String(e.path[0] ?? "")
      if (k && !champs[k]) champs[k] = e.message
    }
    return json({ statut: "invalide", champs }, 422)
  }

  // 4. Pièce jointe (formulaire « information » uniquement).
  let fichier: File | null = null
  if (t === "information") {
    const f = donnees.get("piece_jointe")
    if (f instanceof File && f.size > 0) {
      if (f.size > PIECE_JOINTE.tailleMax)
        return json(
          {
            statut: "invalide",
            champs: {
              piece_jointe: dire({
                fr: "Fichier trop lourd (5 Mo maximum).",
                de: "Datei zu groß (höchstens 5 MB).",
                lb: "Fichier ze grouss (maximal 5 MB).",
              }),
            },
          },
          422,
        )
      if (!PIECE_JOINTE.types.includes(f.type))
        return json(
          {
            statut: "invalide",
            champs: {
              piece_jointe: `${dire({ fr: "Format non accepté", de: "Format nicht akzeptiert", lb: "Format net akzeptéiert" })} (${dire(PIECE_JOINTE.libelle)}).`,
            },
          },
          422,
        )
      fichier = f
    }
  }

  // 5. Transmission. Sans webhook configuré, on le dit : le client propose l'e-mail.
  const webhook = process.env.FORM_WEBHOOK_URL
  if (!webhook) return json({ statut: "non-configure" }, 503)

  const envoi = new FormData()
  envoi.set("formulaire", t)
  envoi.set("objet", objetsMail[t])
  envoi.set("recu_le", new Date().toISOString())
  envoi.set("langue", l)
  for (const [k, v] of Object.entries(resultat.data)) if (v !== undefined) envoi.set(k, String(v))
  if (fichier)
    envoi.set("piece_jointe", fichier, fichier.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120))

  try {
    const r = await fetch(webhook, {
      method: "POST",
      body: envoi,
      headers: process.env.FORM_WEBHOOK_TOKEN
        ? { "X-Webhook-Token": process.env.FORM_WEBHOOK_TOKEN }
        : undefined,
      signal: AbortSignal.timeout(10_000),
    })
    if (!r.ok) throw new Error(`webhook ${r.status}`)
  } catch (e) {
    // Journal minimal, sans aucune donnée du formulaire.
    console.error(`[formulaires] échec de transmission (${t}) :`, (e as Error).message)
    return json(
      {
        statut: "erreur",
        message: dire({
          fr: "L'envoi a échoué de notre côté. Réessayez, ou écrivez-nous directement.",
          de: "Das Senden ist bei uns fehlgeschlagen. Versuchen Sie es erneut oder schreiben Sie uns direkt.",
          lb: "D'Schécken ass bei eis feelgeschloen. Probéiert et nach eng Kéier oder schreift eis direkt.",
        }),
      },
      502,
    )
  }
  return json({ statut: "succes" })
}
