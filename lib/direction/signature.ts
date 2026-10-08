import "server-only"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { site } from "@/config/site"
import { socialLinks } from "@/config/socialLinks"

/**
 * La signature de la boîte info@, reprise de celle du webmail Webador :
 * le logo à gauche, « Rédaction Radio Tripoint, La radio transfrontalière »,
 * l'e-mail et le site, puis Instagram et Facebook. Les images voyagent
 * dans le message (cid), comme le fait le webmail : elles s'affichent sans
 * que le destinataire ait à cliquer « Afficher les images ».
 *
 * Seules les adresses vérifiées sont reprises : les icônes LinkedIn et X du
 * webmail pointaient vers une adresse d'exemple (this-is-a-sample-url.com).
 */

const DOMAINE = new URL(site.url).hostname.replace(/^www\./, "")

const IMAGES = [
  { fichier: "logo-radio-tripoint.png", cid: `logo.signature@${DOMAINE}` },
  { fichier: "instagram.png", cid: `instagram.signature@${DOMAINE}` },
  { fichier: "facebook.png", cid: `facebook.signature@${DOMAINE}` },
] as const

const RESEAUX = [
  { nom: "Instagram", url: socialLinks.instagram, cid: IMAGES[1].cid },
  { nom: "Facebook", url: socialLinks.facebook, cid: IMAGES[2].cid },
].filter((r) => r.url)

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const POLICE = "font: 13px/1.2em sans-serif"
const LIEN = "color: #0066ff"

const SIGNATURE_HTML = `<div id="signature">-- <br>
<table style="color: #000000; width: auto; border: 0; border-collapse: collapse; ${POLICE};">
<tbody>
<tr>
<td style="${POLICE}; padding: 0 20px 0 0; vertical-align: top;">
<div style="margin: 8px 0; width: 150px;"><img src="cid:${IMAGES[0].cid}" width="150" height="150" style="display: block; width: 150px; height: 150px;" alt="Radio Tripoint (La radio transfrontalière)"></div>
</td>
<td style="${POLICE}; padding: 0; vertical-align: top;">
<div><span style="font-weight: bold;">Rédaction Radio Tripoint,</span> La radio transfrontalière</div>
<div style="margin: 8px 0; max-width: 250px;"><a style="${LIEN};" href="mailto:${site.contact.email}">${site.contact.email}</a> | <a style="${LIEN};" href="${site.url}">${site.url}</a></div>
<div style="margin: 8px 0;">${RESEAUX.map(
  (r) =>
    `<a style="display: inline-block; padding-right: 5px;" href="${echapper(r.url)}"><img src="cid:${r.cid}" width="16" height="16" alt="${r.nom}"></a>`,
).join("")}</div>
</td>
</tr>
</tbody>
</table>
</div>`

const SIGNATURE_TEXTE = [
  "-- ",
  "Rédaction Radio Tripoint, La radio transfrontalière",
  `${site.contact.email} | ${site.url}`,
  ...RESEAUX.map((r) => `${r.nom} : ${r.url}`),
].join("\n")

type Piece = {
  filename: string
  content: Buffer
  cid: string
  contentType: string
  contentDisposition: "inline"
}

/** Les images de la signature, lues une fois (relues si la lecture a échoué). */
let images: Promise<Piece[]> | null = null
function pieces() {
  images ??= Promise.all(
    IMAGES.map(async (i) => ({
      filename: i.fichier,
      content: await readFile(join(process.cwd(), "assets/mail", i.fichier)),
      cid: i.cid,
      contentType: "image/png",
      contentDisposition: "inline" as const,
    })),
  ).catch((e: unknown) => {
    images = null
    throw e
  })
  return images
}

/** Texte relu par une personne → HTML : paragraphes, retours à la ligne, liens cliquables. */
function versHtml(texte: string) {
  return texte
    .split(/\n\s*\n/)
    .map(
      (paragraphe) =>
        `<p style="margin: 0 0 1em;">${echapper(paragraphe.trim())
          .replace(
            /https?:\/\/[^\s<]+[^\s<.,;:!?)»]/g,
            (url) => `<a style="${LIEN};" href="${url}">${url}</a>`,
          )
          .replace(/\n/g, "<br>")}</p>`,
    )
    .join("\n")
}

/**
 * Le corps d'un message envoyé depuis info@ : la version texte et la version
 * HTML portent toutes deux la signature, avec ses images jointes.
 */
export async function corpsSigne(texte: string) {
  const propre = texte.replace(/\r/g, "").trim()
  return {
    text: `${propre}\n\n${SIGNATURE_TEXTE}\n`,
    html: `<!DOCTYPE html>
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head>
<body style="font-size: 10pt; font-family: Verdana, Geneva, sans-serif; color: #000000;">
${versHtml(propre)}
${SIGNATURE_HTML}
</body></html>`,
    attachments: await pieces(),
  }
}
