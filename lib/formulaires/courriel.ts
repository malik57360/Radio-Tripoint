import { site } from "@/config/site"
import type { TypeFormulaire } from "@/lib/formulaires/schemas"

/**
 * Envoi des formulaires par e-mail via l'API Resend (https://resend.com),
 * sans dépendance : un simple POST JSON. La pièce jointe part en base64.
 *
 * Sans domaine vérifié chez Resend, l'expéditeur doit rester
 * onboarding@resend.dev et le destinataire être l'adresse du compte Resend.
 */
const LIBELLES: Record<string, string> = {
  nom: "Nom",
  entreprise: "Entreprise",
  email: "E-mail",
  telephone: "Téléphone",
  ville: "Ville",
  categorie: "Catégorie",
  besoin: "Besoin",
  titre: "Titre",
  sujet: "Sujet",
  message: "Message",
}

const NOMS_LANGUES: Record<string, string> = {
  fr: "français",
  de: "allemand",
  lb: "luxembourgeois",
  en: "anglais",
  es: "espagnol",
}

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export async function envoyerCourriel(opts: {
  cle: string
  type: TypeFormulaire
  objet: string
  langue: string
  champs: Record<string, unknown>
  fichier: File | null
}) {
  const { cle, type, objet, langue, champs, fichier } = opts
  const lignes = Object.entries(champs).filter(
    ([k, v]) => k !== "consentement" && v !== undefined && String(v).trim() !== "",
  )
  const titre = String(champs.titre ?? champs.sujet ?? champs.nom ?? champs.email ?? "")

  const texte = [
    ...lignes.map(([k, v]) => `${LIBELLES[k] ?? k} : ${String(v)}`),
    "",
    `Langue du visiteur : ${NOMS_LANGUES[langue] ?? langue}`,
    fichier ? `Pièce jointe : ${fichier.name}` : "",
  ]
    .filter((l, i, t) => l !== "" || i < t.length - 1)
    .join("\n")

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
<p style="margin:0 0 16px"><strong>${echapper(objet)}</strong></p>
<table cellpadding="6" style="border-collapse:collapse">
${lignes
  .map(
    ([k, v]) =>
      `<tr><td style="vertical-align:top;color:#666;white-space:nowrap">${echapper(LIBELLES[k] ?? k)}</td><td style="white-space:pre-wrap">${echapper(String(v))}</td></tr>`,
  )
  .join("\n")}
</table>
<p style="margin:16px 0 0;color:#666;font-size:13px">Langue du visiteur : ${echapper(NOMS_LANGUES[langue] ?? langue)}${fichier ? ` · Pièce jointe : ${echapper(fichier.name)}` : ""}<br>Envoyé depuis le site Radio Tripoint (formulaire « ${type} »).</p>
</div>`

  const corps: Record<string, unknown> = {
    from: process.env.FORM_EMAIL_FROM || "Radio Tripoint <onboarding@resend.dev>",
    to: [process.env.FORM_EMAIL_TO || site.contact.email],
    subject: `Radio Tripoint — ${objet}${titre ? ` : ${titre}` : ""}`.slice(0, 200),
    text: texte,
    html,
  }
  if (typeof champs.email === "string" && champs.email) corps.reply_to = champs.email
  if (fichier)
    corps.attachments = [
      {
        filename: fichier.name.replace(/[^\p{L}\p{N}.\- ]+/gu, "_").slice(0, 120),
        content: Buffer.from(await fichier.arrayBuffer()).toString("base64"),
      },
    ]

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    body: JSON.stringify(corps),
    signal: AbortSignal.timeout(15_000),
  })
  if (!r.ok) throw new Error(`resend ${r.status}`)
}
