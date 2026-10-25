import "server-only"
import { createTransport } from "nodemailer"
import { site } from "@/config/site"
import { smtpConfigure } from "@/lib/formulaires/courriel"
import { euros, type Ligne } from "./offres"
import { cheminAnnonce, type Annonce } from "./types"

/**
 * E-mails des Petites annonces : textes fixes (aucune IA), envoyés depuis
 * la boîte de la radio (SMTP Webador). Ce sont des messages de service —
 * vérification d'adresse, suivi de l'annonce, message d'un acheteur —
 * déclenchés par une action de la personne ou de la modération.
 *
 * Rien n'est copié dans les « Envoyés » de info@ : les messages relayés
 * entre particuliers n'ont pas à y rester.
 */
const SIGNATURE = "L'équipe Radio Tripoint"
const RUBRIQUE = "Les Petites Annonces du Tripoint"

export const mailsActifs = smtpConfigure

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/** Texte → HTML sobre : paragraphes, liens cliquables. */
function versHtml(texte: string) {
  const liens = (s: string) =>
    echapper(s).replace(
      /https:\/\/[^\s<]+/g,
      (u) => `<a href="${u}" style="color:#111;font-weight:bold">${u}</a>`,
    )
  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111;max-width:560px">
<p style="margin:0 0 18px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8a6d00;font-weight:bold">${RUBRIQUE}</p>
${texte
  .split(/\n{2,}/)
  .map((p) => `<p style="margin:0 0 14px">${liens(p).replace(/\n/g, "<br>")}</p>`)
  .join("\n")}
<p style="margin:22px 0 0;color:#777;font-size:12px">Radio Tripoint · ${echapper(site.url.replace("https://", ""))}</p>
</div>`
}

export async function envoyerMail(o: {
  a: string
  objet: string
  texte: string
  repondreA?: string
}) {
  if (!smtpConfigure()) throw new Error("boîte mail non branchée")
  const utilisateur = (process.env.SMTP_USER || site.contact.email).trim()
  const port = Number(process.env.SMTP_PORT) || 587
  const transport = createTransport({
    host: process.env.SMTP_HOST || "mail.webador.com",
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: utilisateur, pass: (process.env.SMTP_PASS ?? "").trim() },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  })
  const texte = `${o.texte.trim()}\n\n${SIGNATURE}`
  await transport.sendMail({
    from: { name: "Petites annonces · Radio Tripoint", address: utilisateur },
    to: o.a,
    replyTo: o.repondreA,
    subject: o.objet.slice(0, 200),
    text: texte,
    html: versHtml(texte),
  })
}

/** Envoi qui ne fait jamais échouer l'action en cours (le journal Vercel garde la trace). */
export async function envoyerSansEchec(o: Parameters<typeof envoyerMail>[0]) {
  try {
    await envoyerMail(o)
    return true
  } catch (e) {
    console.error("[annonces] mail :", (e as Error).message)
    return false
  }
}

const lien = (chemin: string) => `${site.url}${chemin}`
export const ESPACE = "/annonces/mon-espace"

/* ───────────────────────── Compte ───────────────────────── */

export const mailVerification = (nom: string, jeton: string) => ({
  objet: "Confirmez votre adresse e-mail",
  texte: `Bonjour ${nom},

Bienvenue sur ${RUBRIQUE} ! Pour activer votre compte, confirmez votre adresse e-mail en ouvrant ce lien (valable 48 heures) :
${lien(`/api/annonces/verifier?j=${jeton}`)}

Si vous n'avez pas créé de compte, ignorez simplement ce message.`,
})

export const mailReinitialisation = (nom: string, jeton: string) => ({
  objet: "Choisir un nouveau mot de passe",
  texte: `Bonjour ${nom},

Vous avez demandé à changer le mot de passe de votre compte ${RUBRIQUE}. Ouvrez ce lien pour en choisir un nouveau (valable 1 heure) :
${lien(`/annonces/nouveau-mot-de-passe?j=${jeton}`)}

Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : votre mot de passe ne change pas.`,
})

/* ───────────────────────── Annonce ───────────────────────── */

const detailLignes = (lignes: Ligne[]) =>
  lignes.map((l) => `- ${l.libelle} : ${euros(l.centimes)}`).join("\n")

export const mailDepotRecu = (
  nom: string,
  a: Annonce,
  paye?: { lignes: Ligne[]; total: number },
) => ({
  objet: `Annonce reçue : « ${a.titre} »`,
  texte: `Bonjour ${nom},

Nous avons bien reçu votre annonce « ${a.titre} ».${
    paye
      ? `

Paiement reçu (${euros(paye.total)}) :
${detailLignes(paye.lignes)}
Le reçu de Stripe vous est envoyé séparément.`
      : ""
  }

L'équipe de Radio Tripoint la vérifie avant de la mettre en ligne, en général dans la journée. Vous recevrez un e-mail dès qu'elle sera publiée.${
    paye ? "\n\nSi elle ne pouvait pas être publiée, vous seriez remboursé en totalité." : ""
  }

Suivre vos annonces : ${lien(ESPACE)}`,
})

export const mailPubliee = (nom: string, a: Annonce) => ({
  objet: `Votre annonce est en ligne : « ${a.titre} »`,
  texte: `Bonjour ${nom},

Bonne nouvelle : votre annonce « ${a.titre} » est en ligne${
    a.expireLe
      ? ` jusqu'au ${new Date(a.expireLe).toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" })}`
      : ""
  }.
${lien(cheminAnnonce(a))}

Les personnes intéressées vous écrivent par le formulaire de l'annonce : leurs messages arrivent dans cette boîte mail. Votre adresse n'est jamais affichée.

Prudence : ne payez et n'envoyez rien avant d'avoir vu la personne ou l'objet, et méfiez-vous des « transporteurs » et des paiements par coupon.

Gérer votre annonce : ${lien(ESPACE)}`,
})

export const mailRefusee = (nom: string, a: Annonce, motif: string, rembourse: number) => ({
  objet: `Votre annonce « ${a.titre} » n'a pas été publiée`,
  texte: `Bonjour ${nom},

Merci d'avoir déposé « ${a.titre} ». Nous ne pouvons pas la publier.${motif ? `\n\nMotif : ${motif}` : ""}${
    rembourse > 0
      ? `\n\nVous êtes remboursé de ${euros(rembourse)} sur le moyen de paiement utilisé (comptez quelques jours selon votre banque).`
      : ""
  }

Les règles de la rubrique : ${lien("/annonces/regles")}`,
})

export const mailRetireeModeration = (nom: string, a: Annonce, motif: string) => ({
  objet: `Votre annonce « ${a.titre} » a été retirée`,
  texte: `Bonjour ${nom},

Votre annonce « ${a.titre} » a été retirée par l'équipe de modération.${motif ? `\n\nMotif : ${motif}` : ""}

Si vous pensez qu'il s'agit d'une erreur, répondez simplement à ce message en expliquant pourquoi : une personne de l'équipe relira votre demande.

Les règles de la rubrique : ${lien("/annonces/regles")}`,
})

export const mailExpireBientot = (nom: string, a: Annonce, prix: number) => ({
  objet: `Votre annonce « ${a.titre} » expire bientôt`,
  texte: `Bonjour ${nom},

Votre annonce « ${a.titre} » sera retirée du site le ${new Date(a.expireLe ?? Date.now()).toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" })}.

Toujours d'actualité ? Prolongez-la de 30 jours (${euros(prix)}) depuis votre espace :
${lien(ESPACE)}

Objet vendu ou poste pourvu ? Retirez-la, les visiteurs vous en remercieront.`,
})

export const mailExpiree = (nom: string, a: Annonce, prix: number) => ({
  objet: `Votre annonce « ${a.titre} » a expiré`,
  texte: `Bonjour ${nom},

Votre annonce « ${a.titre} » n'est plus visible sur le site : sa durée de publication est terminée.

Vous pouvez la remettre en ligne pour 30 jours (${euros(prix)}) depuis votre espace :
${lien(ESPACE)}`,
})

export const mailOptionsPayees = (
  nom: string,
  a: Annonce,
  lignes: Ligne[],
  totalCentimes: number,
) => ({
  objet: `Option activée : « ${a.titre} »`,
  texte: `Bonjour ${nom},

Merci ! Paiement reçu (${euros(totalCentimes)}) pour votre annonce « ${a.titre} » :
${detailLignes(lignes)}

C'est actif dès maintenant. Le reçu de Stripe vous est envoyé séparément.

${lien(ESPACE)}`,
})

/* ───────────────────────── Contact et alertes ───────────────────────── */

export const mailContact = (o: {
  nomAnnonceur: string
  a: Annonce
  nomExpediteur: string
  message: string
}) => ({
  objet: `Message pour votre annonce « ${o.a.titre} »`,
  texte: `Bonjour ${o.nomAnnonceur},

${o.nomExpediteur} vous écrit au sujet de votre annonce « ${o.a.titre} » :

----------
${o.message}
----------

Pour lui répondre, répondez simplement à cet e-mail : votre réponse lui arrive directement, et lui donne votre adresse.

Prudence : ne communiquez jamais vos codes bancaires, ne payez rien à l'avance et méfiez-vous des « transporteurs », des coupons et des liens de paiement reçus par message. Un message suspect ? Transférez-le à ${site.contact.email}.

L'annonce : ${lien(cheminAnnonce(o.a))}`,
})

/** Alerte pour la radio : une annonce attend la modération. */
export const alerteModeration = (a: Annonce, motif: "depot" | "modification" | "signalement") => ({
  objet: `[Annonces] ${motif === "signalement" ? "Annonce signalée" : motif === "modification" ? "Annonce modifiée à revoir" : "Nouvelle annonce à vérifier"} : ${a.titre}`,
  texte: `${
    motif === "signalement"
      ? `L'annonce « ${a.titre} » a été signalée${a.statut === "signalee" ? " plusieurs fois : elle est masquée en attendant votre décision" : ""}.`
      : `L'annonce « ${a.titre} » (${a.ville}) attend votre vérification.`
  }

Tableau de bord : ${lien("/direction/annonces")}`,
})
