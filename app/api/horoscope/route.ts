import { createHash } from "node:crypto"
import { revalidateTag } from "next/cache"
import { after } from "next/server"
import { autoriser } from "@/lib/formulaires/limiteur"
import { genererHoroscope, TAG_HOROSCOPE } from "@/lib/horoscope"

/**
 * Rédaction de l'horoscope du jour.
 * GET : la tâche planifiée de Vercel, chaque nuit (vercel.json).
 * POST : rattrapage, quand une page Horoscope est lue sans l'horoscope du jour.
 * Les deux sont sans risque de double dépense : rien n'est réécrit si
 * l'horoscope existe, un verrou bloque les rédactions simultanées et quatre
 * essais ratés suffisent pour la journée.
 */
export const dynamic = "force-dynamic"
export const maxDuration = 120

async function rediger() {
  const r = await genererHoroscope()
  if (r === "fait") revalidateTag(TAG_HOROSCOPE, { expire: 0 })
  return r
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`)
    return Response.json({ ok: false }, { status: 401 })
  return Response.json({ ok: true, statut: await rediger() })
}

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue"
  const cle = createHash("sha256").update(`horoscope:${ip}`).digest("hex").slice(0, 24)
  if (!autoriser(cle, 5, 10 * 60 * 1000)) return Response.json({ ok: false }, { status: 429 })
  after(async () => {
    try {
      await rediger()
    } catch (e) {
      console.error("[horoscope] rattrapage :", (e as Error).message)
    }
  })
  return Response.json({ ok: true }, { status: 202 })
}
