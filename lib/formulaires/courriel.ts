import { createTransport } from "nodemailer"
import { site } from "@/config/site"
import type { TypeFormulaire } from "@/lib/formulaires/schemas"

/**
 * Envoi des formulaires par e-mail, de deux façons :
 *
 * 1. Par la boîte mail de la radio (SMTP), en priorité : les e-mails du
 *    domaine sont chez Webador (mail.webador.com, port 587, STARTTLS). Il
 *    suffit de SMTP_PASS (mot de passe de la boîte) ; SMTP_USER vaut par
 *    défaut l'adresse de contact. Le message part de la boîte et arrive dans
 *    la même boîte, « Répondre » écrit au visiteur.
 * 2. Par l'API Resend (https://resend.com), si RESEND_API_KEY est posée.
 */
export const smtpConfigure = () => {
  const mdp = process.env.SMTP_PASS ?? ""
  // La variable est créée avec un texte provisoire, remplacé à la main.
  return mdp.length > 0 && !mdp.startsWith("A_REMPLACER")
}
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
  /** Clé Resend ; inutile si la boîte mail (SMTP) est configurée. */
  cle?: string
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

  const sujet = `Radio Tripoint — ${objet}${titre ? ` : ${titre}` : ""}`.slice(0, 200)
  const destinataire = process.env.FORM_EMAIL_TO || site.contact.email
  const repondreA = typeof champs.email === "string" && champs.email ? champs.email : undefined
  const nomFichier = fichier?.name.replace(/[^\p{L}\p{N}.\- ]+/gu, "_").slice(0, 120)

  if (smtpConfigure()) {
    const utilisateur = process.env.SMTP_USER || site.contact.email
    const port = Number(process.env.SMTP_PORT) || 587
    const transport = createTransport({
      host: process.env.SMTP_HOST || "mail.webador.com",
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: utilisateur.trim(), pass: (process.env.SMTP_PASS ?? "").trim() },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    })
    await transport.sendMail({
      from: { name: "Site Radio Tripoint", address: utilisateur },
      to: destinataire,
      replyTo: repondreA,
      subject: sujet,
      text: texte,
      html,
      attachments:
        fichier && nomFichier
          ? [{ filename: nomFichier, content: Buffer.from(await fichier.arrayBuffer()) }]
          : undefined,
    })
    return
  }
  if (!cle) throw new Error("aucun moyen d'envoi configuré")

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
