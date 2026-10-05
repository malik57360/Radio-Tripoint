import { createHash } from "node:crypto"
import { creerProposition, PRIX_EUROS, verifierOrganisation } from "@/lib/agenda/propositions"
import { compter, redisActif } from "@/lib/direction/redis"
import { envoyerCourriel, smtpConfigure } from "@/lib/formulaires/courriel"
import { autoriser } from "@/lib/formulaires/limiteur"
import { choisir, estLangue, type Langue, type Trad } from "@/lib/i18n/langues"
import {
  PIECE_JOINTE,
  creerSchemas,
  nettoyerIdentifiant,
  objetsMail,
  typesFormulaire,
  type TypeFormulaire,
} from "@/lib/formulaires/schemas"

/**
 * Réception des formulaires. Chaîne : anti-robot (champ piège + délai) →
 * limite de débit → validation/nettoyage Zod → pièce jointe → e-mail
 * (Resend) ou webhook.
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
          en: "Too many submissions in a short time. Try again in a few minutes.",
          es: "Demasiados envíos en poco tiempo. Vuelva a intentarlo dentro de unos minutos.",
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
                fr: "Fichier trop lourd (4 Mo maximum).",
                de: "Datei zu groß (höchstens 4 MB).",
                lb: "Fichier ze grouss (maximal 4 MB).",
                en: "File too large (4 MB maximum).",
                es: "Archivo demasiado pesado (4 MB como máximo).",
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
              piece_jointe: `${dire({ fr: "Format non accepté", de: "Format nicht akzeptiert", lb: "Format net akzeptéiert", en: "Format not accepted", es: "Formato no admitido" })} (${dire(PIECE_JOINTE.libelle)}).`,
            },
          },
          422,
        )
      fichier = f
    }
  }

  // 5 bis. Agenda payant : la demande est enregistrée pour le tableau de
  // bord, avec le résultat du contrôle du numéro officiel. L'e-mail qui
  // suit n'est qu'une alerte pour la radio.
  let champsMail: Record<string, unknown> = resultat.data
  if (t === "agenda") {
    if (!redisActif()) return json({ statut: "non-configure" }, 503)
    const d = creerSchemas("fr").agenda.parse(brut)
    d.identifiant = d.pays_org === "FR" ? nettoyerIdentifiant(d.identifiant) : d.identifiant
    const verification = await verifierOrganisation(d.pays_org, d.identifiant)
    try {
      const p = await creerProposition({
        langue: l,
        organisation: {
          type: d.type_org,
          pays: d.pays_org,
          identifiant: d.identifiant,
          nom: d.organisation,
        },
        verification,
        contact: { nom: d.nom, email: d.email, telephone: d.telephone || undefined },
        champs: {
          titre: d.titre,
          description: d.description,
          date_debut: d.date_debut,
          heure_debut: d.heure_debut || undefined,
          date_fin: d.date_fin || undefined,
          heure_fin: d.heure_fin || undefined,
          lieu: d.lieu,
          adresse: d.adresse || undefined,
          ville: d.ville,
          pays: d.pays,
          tarif: d.tarif || undefined,
          lien: d.lien || undefined,
        },
      })
      const libelleVerif = {
        verifie: `trouvée et active dans l'annuaire de l'État (${verification.nomOfficiel ?? "?"})`,
        ferme: `RADIÉE ou fermée dans l'annuaire (${verification.nomOfficiel ?? "?"})`,
        introuvable: "INTROUVABLE dans l'annuaire de l'État",
        manuel: "à vérifier à la main (Luxembourg / Allemagne)",
        indisponible: "annuaire injoignable, à vérifier à la main",
      }[verification.statut]
      champsMail = {
        titre: d.titre,
        entreprise: `${d.organisation} — ${d.type_org}, ${d.pays_org}, n° ${d.identifiant}`,
        verification: libelleVerif,
        nom: d.nom,
        email: d.email,
        telephone: d.telephone,
        quand: [d.date_debut, d.heure_debut, d.date_fin && `→ ${d.date_fin}`, d.heure_fin]
          .filter(Boolean)
          .join(" "),
        ville: `${d.lieu}, ${d.ville} (${d.pays})`,
        message: d.description,
        a_faire: `Accepter ou refuser dans le tableau de bord : /direction/agenda (dossier ${p.id}). Le lien de paiement (${PRIX_EUROS} €) part seulement après acceptation.`,
      }
    } catch (e) {
      console.error("[formulaires] agenda : enregistrement impossible :", (e as Error).message)
      await compter("form_perdu")
      return json(
        {
          statut: "erreur",
          message: dire({
            fr: "L'enregistrement a échoué de notre côté. Réessayez dans un instant.",
            de: "Das Speichern ist bei uns fehlgeschlagen. Versuchen Sie es gleich noch einmal.",
            lb: "D'Späicheren ass bei eis feelgeschloen. Probéiert et gläich nach eng Kéier.",
            en: "Saving failed on our side. Try again in a moment.",
            es: "El registro ha fallado por nuestra parte. Vuelva a intentarlo en un momento.",
          }),
        },
        502,
      )
    }
    await compter("form:agenda")
    // La demande est enregistrée : l'alerte e-mail est un plus, pas une condition.
    if (smtpConfigure() || process.env.RESEND_API_KEY)
      await envoyerCourriel({
        cle: process.env.RESEND_API_KEY,
        type: t,
        objet: objetsMail[t],
        langue: l,
        champs: champsMail,
        fichier: null,
      }).catch((e) => console.error("[formulaires] agenda : alerte e-mail :", (e as Error).message))
    await compter("form_ok")
    return json({ statut: "succes" })
  }

  // 5. Transmission : e-mail (boîte mail de la radio, sinon Resend), sinon
  // webhook. Sans aucun des trois, on le dit : le client propose l'e-mail.
  const cleResend = process.env.RESEND_API_KEY
  const parMail = smtpConfigure() || Boolean(cleResend)
  const webhook = process.env.FORM_WEBHOOK_URL
  await compter(`form:${t}`)
  if (!parMail && !webhook) {
    await compter("form_perdu")
    return json({ statut: "non-configure" }, 503)
  }

  try {
    if (parMail) {
      await envoyerCourriel({
        cle: cleResend,
        type: t,
        objet: objetsMail[t],
        langue: l,
        champs: resultat.data,
        fichier,
      })
    } else if (webhook) {
      const envoi = new FormData()
      envoi.set("formulaire", t)
      envoi.set("objet", objetsMail[t])
      envoi.set("recu_le", new Date().toISOString())
      envoi.set("langue", l)
      for (const [k, v] of Object.entries(resultat.data))
        if (v !== undefined) envoi.set(k, String(v))
      if (fichier)
        envoi.set("piece_jointe", fichier, fichier.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120))
      const r = await fetch(webhook, {
        method: "POST",
        body: envoi,
        headers: process.env.FORM_WEBHOOK_TOKEN
          ? { "X-Webhook-Token": process.env.FORM_WEBHOOK_TOKEN }
          : undefined,
        signal: AbortSignal.timeout(10_000),
      })
      if (!r.ok) throw new Error(`webhook ${r.status}`)
    }
  } catch (e) {
    // Journal minimal, sans aucune donnée du formulaire.
    console.error(`[formulaires] échec de transmission (${t}) :`, (e as Error).message)
    await compter("form_perdu")
    return json(
      {
        statut: "erreur",
        message: dire({
          fr: "L'envoi a échoué de notre côté. Réessayez, ou écrivez-nous directement.",
          de: "Das Senden ist bei uns fehlgeschlagen. Versuchen Sie es erneut oder schreiben Sie uns direkt.",
          lb: "D'Schécken ass bei eis feelgeschloen. Probéiert et nach eng Kéier oder schreift eis direkt.",
          en: "Sending failed on our side. Try again, or write to us directly.",
          es: "El envío ha fallado por nuestra parte. Vuelva a intentarlo o escríbanos directamente.",
        }),
      },
      502,
    )
  }
  await compter("form_ok")
  return json({ statut: "succes" })
}
