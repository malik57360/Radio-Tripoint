import { site } from "@/config/site"
import { evenementParSlug } from "@/lib/contenu/evenements"
import { estLangue, lienLangue } from "@/lib/i18n/langues"

const ics = (d: string) =>
  new Date(d)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "")
const echapper = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/([,;])/g, "\\$1")

/** Fichier .ics pour ajouter l'événement à un agenda (Google, Apple, Outlook). */
export async function GET(_: Request, ctx: RouteContext<"/[lang]/agenda/[slug]/ics">) {
  const { slug, lang } = await ctx.params
  const l = estLangue(lang) ? lang : "fr"
  const e = await evenementParSlug(slug, l)
  if (!e) return new Response("Introuvable", { status: 404 })
  const fin = e.fin ?? new Date(new Date(e.debut).getTime() + 2 * 3600_000).toISOString()
  // Sans heure publiée : événement « journée entière » (fin exclusive, lendemain).
  const lendemain = (d: string) =>
    new Date(Date.parse(d.slice(0, 10)) + 86_400_000).toISOString().slice(0, 10).replace(/-/g, "")
  const dates = e.journee
    ? [
        `DTSTART;VALUE=DATE:${e.debut.slice(0, 10).replace(/-/g, "")}`,
        `DTEND;VALUE=DATE:${lendemain(e.fin ?? e.debut)}`,
      ]
    : [`DTSTART:${ics(e.debut)}`, `DTEND:${ics(fin)}`]
  const corps = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Radio Tripoint//Agenda//FR",
    "BEGIN:VEVENT",
    `UID:${e.slug}@${new URL(site.url).host}`,
    `DTSTAMP:${ics(new Date().toISOString())}`,
    ...dates,
    `SUMMARY:${echapper(e.titre)}`,
    `DESCRIPTION:${echapper(e.description)}`,
    `LOCATION:${echapper([e.lieu, e.adresse, e.ville].filter(Boolean).join(", "))}`,
    `URL:${site.url}${lienLangue(`/agenda/${e.slug}`, l)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
  return new Response(corps, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${e.slug}.ics"`,
    },
  })
}
