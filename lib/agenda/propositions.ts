import "server-only"
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import { revalidatePath, revalidateTag } from "next/cache"
import { site } from "@/config/site"
import { redis } from "@/lib/direction/redis"
import type { Langue } from "@/lib/i18n/langues"
import type { Evenement } from "@/types/event"
import { CLE_PUBLIES, TAG_AGENDA } from "./publies"

/**
 * Agenda participatif payant. Parcours d'un événement proposé :
 *
 *   a_verifier → (direction) accepte → (organisateur) payé → publie
 *              ↘ refuse
 *
 * Seules les entreprises et associations immatriculées sont acceptées :
 * le numéro officiel est contrôlé dans l'annuaire de l'État (France), puis
 * une personne valide dans le tableau de bord. Le paiement (50 €) n'est
 * demandé qu'après acceptation : un refus ne coûte rien, rien à rembourser.
 */
export const PRIX_EUROS = 50
export const PRIX_CENTIMES = PRIX_EUROS * 100

const CLE = (id: string) => `rt:agenda:prop:${id}`
const INDEX = "rt:agenda:props"
const DUREE = 400 * 24 * 3600

export type Statut = "a_verifier" | "accepte" | "refuse" | "publie" | "retire"

export interface Verification {
  /** verifie : trouvée et active · ferme : radiée · introuvable · manuel : LU/DE · indisponible : annuaire injoignable. */
  statut: "verifie" | "ferme" | "introuvable" | "manuel" | "indisponible" | "particulier"
  nomOfficiel?: string
  commune?: string
  /** L'annuaire la classe comme association (France). */
  association?: boolean
  /** Où vérifier soi-même. */
  lien?: string
  le: number
}

export interface Proposition {
  id: string
  /** Secret du lien de paiement envoyé à l'organisateur. */
  jeton: string
  cree: number
  maj: number
  statut: Statut
  langue: Langue
  organisation: {
    type: "entreprise" | "association" | "particulier"
    pays: "FR" | "LU" | "DE"
    identifiant: string
    nom: string
  }
  verification: Verification
  contact: { nom: string; email: string; telephone?: string }
  champs: {
    titre: string
    description: string
    date_debut: string
    heure_debut?: string
    date_fin?: string
    heure_fin?: string
    lieu: string
    adresse?: string
    ville: string
    pays: "FR" | "LU" | "DE"
    tarif?: string
    lien?: string
  }
  slug: string
  motifRefus?: string
  /** Lien de paiement envoyé par e-mail (date). */
  mailEnvoye?: number
  paiement?: { mode: "stripe" | "manuel"; reference?: string; montant: number; le: number }
}

/* ───────────────────────── Vérification ───────────────────────── */

const ANNUAIRE = "https://recherche-entreprises.api.gouv.fr/search"

type Brut = {
  siren: string
  nom_complet?: string
  etat_administratif?: string
  siege?: { siret?: string; libelle_commune?: string; etat_administratif?: string }
  complements?: { est_association?: boolean; identifiant_association?: string | null }
  matching_etablissements?: { siret?: string; etat_administratif?: string }[]
}

/** Contrôle du numéro officiel. Rien n'est déduit : on rapporte ce que dit l'annuaire. */
export async function verifierOrganisation(
  pays: "FR" | "LU" | "DE",
  identifiant: string,
): Promise<Verification> {
  const le = Date.now()
  if (pays === "LU")
    return {
      statut: "manuel",
      lien: "https://www.lbr.lu/mjrcs/jsp/webapp/static/mjrcs/fr/mjrcs/search.html",
      le,
    }
  if (pays === "DE") return { statut: "manuel", lien: "https://www.handelsregister.de/", le }

  const recherche = `https://annuaire-entreprises.data.gouv.fr/rechercher?terme=${encodeURIComponent(identifiant)}`
  try {
    const r = await fetch(`${ANNUAIRE}?${new URLSearchParams({ q: identifiant, per_page: "5" })}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) return { statut: "indisponible", lien: recherche, le }
    const { results = [] } = (await r.json()) as { results?: Brut[] }
    const rna = /^W\d{9}$/.test(identifiant)
    const siren = rna ? null : identifiant.slice(0, 9)
    const trouve = results.find((x) =>
      rna
        ? x.complements?.identifiant_association?.toUpperCase() === identifiant
        : x.siren === siren,
    )
    if (!trouve) return { statut: "introuvable", lien: recherche, le }

    let actif = trouve.etat_administratif === "A"
    // SIRET : l'établissement lui-même doit être ouvert.
    if (actif && identifiant.length === 14) {
      const etab =
        trouve.matching_etablissements?.find((e) => e.siret === identifiant) ??
        (trouve.siege?.siret === identifiant ? trouve.siege : undefined)
      if (etab?.etat_administratif && etab.etat_administratif !== "A") actif = false
    }
    return {
      statut: actif ? "verifie" : "ferme",
      nomOfficiel: trouve.nom_complet,
      commune: trouve.siege?.libelle_commune,
      association: trouve.complements?.est_association,
      lien: `https://annuaire-entreprises.data.gouv.fr/entreprise/${trouve.siren}`,
      le,
    }
  } catch {
    return { statut: "indisponible", lien: recherche, le }
  }
}

/* ───────────────────────── Stockage ───────────────────────── */

const slugifier = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "")

export async function creerProposition(
  donnees: Omit<Proposition, "id" | "jeton" | "cree" | "maj" | "statut" | "slug">,
) {
  const id = randomBytes(6).toString("hex")
  const c = donnees.champs
  const p: Proposition = {
    ...donnees,
    id,
    jeton: randomBytes(18).toString("base64url"),
    cree: Date.now(),
    maj: Date.now(),
    statut: "a_verifier",
    slug: `${slugifier(`${c.titre} ${c.ville}`)}-${c.date_debut.slice(0, 4)}-${id.slice(0, 4)}`,
  }
  const ok = await redis([
    ["SET", CLE(id), JSON.stringify(p), "EX", DUREE],
    ["ZADD", INDEX, p.cree, id],
  ])
  if (!ok || ok[0] !== "OK") throw new Error("stockage indisponible")
  return p
}

export async function lireProposition(id: string): Promise<Proposition | null> {
  if (!/^[a-f0-9]{12}$/.test(id)) return null
  const r = await redis([["GET", CLE(id)]])
  const brut = r?.[0]
  if (typeof brut !== "string") return null
  try {
    return JSON.parse(brut) as Proposition
  } catch {
    return null
  }
}

async function enregistrer(p: Proposition) {
  p.maj = Date.now()
  const ok = await redis([["SET", CLE(p.id), JSON.stringify(p), "EX", DUREE]])
  if (!ok || ok[0] !== "OK") throw new Error("stockage indisponible")
}

export async function listerPropositions(max = 200): Promise<Proposition[] | null> {
  const ids = await redis([["ZRANGE", INDEX, 0, max - 1, "REV"]])
  if (!ids) return null
  const liste = (ids[0] as string[] | null) ?? []
  if (liste.length === 0) return []
  const r = await redis([["MGET", ...liste.map(CLE)]])
  return ((r?.[0] as (string | null)[] | null) ?? []).flatMap((v) => {
    if (typeof v !== "string") return []
    try {
      return [JSON.parse(v) as Proposition]
    } catch {
      return []
    }
  })
}

export async function changerStatut(
  id: string,
  statut: "accepte" | "refuse",
  extra: Partial<Pick<Proposition, "motifRefus" | "mailEnvoye">> = {},
) {
  const p = await lireProposition(id)
  if (!p) throw new Error("Proposition introuvable.")
  if (p.statut === "publie") throw new Error("Déjà publiée : retirez-la d'abord.")
  Object.assign(p, { statut }, extra)
  await enregistrer(p)
  return p
}

export async function noterMailEnvoye(id: string) {
  const p = await lireProposition(id)
  if (!p) return
  p.mailEnvoye = Date.now()
  await enregistrer(p)
}

/* ───────────────────────── Publication ───────────────────────── */

/** Décalage horaire de Paris (même fuseau au Luxembourg et en Sarre) pour une date donnée. */
function decalage(jour: string, heure: string) {
  const nom = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date(`${jour}T${heure}:00Z`))
    .find((x) => x.type === "timeZoneName")?.value
  const m = nom?.match(/GMT([+-]\d{2}:\d{2})/)
  return m ? m[1] : "+01:00"
}

const iso = (jour: string, heure: string) => `${jour}T${heure}:00${decalage(jour, heure)}`

export function versEvenement(p: Proposition): Evenement {
  const c = p.champs
  const journee = !c.heure_debut
  const debut = iso(c.date_debut, c.heure_debut || "00:00")
  const fin =
    c.date_fin || c.heure_fin ? iso(c.date_fin || c.date_debut, c.heure_fin || "23:59") : undefined
  const tarif = c.tarif?.trim()
  return {
    slug: p.slug,
    titre: c.titre,
    description: c.description,
    debut,
    ...(fin ? { fin } : {}),
    ...(journee ? { journee: true } : {}),
    lieu: c.lieu,
    ...(c.adresse ? { adresse: c.adresse } : {}),
    ville: c.ville,
    pays: c.pays,
    ...(tarif && /gratuit|libre|free|kostenlos|frei|gratis/i.test(tarif) ? { gratuit: true } : {}),
    ...(c.lien ? { lienExterne: c.lien } : {}),
    // Le nom d'un particulier ne s'affiche pas publiquement.
    ...(p.organisation.type !== "particulier" ? { organisateur: p.organisation.nom } : {}),
    ...(tarif ? { flyer: { tarif: tarif.toUpperCase().slice(0, 40) } } : {}),
  }
}

function rafraichir() {
  revalidateTag(TAG_AGENDA, { expire: 0 })
  revalidatePath("/[lang]/agenda", "layout")
  revalidatePath("/[lang]", "page")
}

/** Paiement reçu → l'événement entre dans l'agenda. Idempotent (webhook + retour client). */
export async function publier(id: string, paiement: NonNullable<Proposition["paiement"]>) {
  const p = await lireProposition(id)
  if (!p) throw new Error("Proposition introuvable.")
  if (p.statut === "publie") return p
  // Payée mais refusée ou retirée entre-temps : rien n'est publié, la
  // direction le voit (paiement noté) et rembourse depuis Stripe.
  if (p.statut !== "accepte") {
    p.paiement = paiement
    await enregistrer(p)
    return null
  }
  p.statut = "publie"
  p.paiement = paiement
  const ok = await redis([
    ["HSET", CLE_PUBLIES, p.slug, JSON.stringify(versEvenement(p))],
    ["SET", CLE(p.id), JSON.stringify({ ...p, maj: Date.now() }), "EX", DUREE],
  ])
  if (!ok || ok.some((x) => x === null)) throw new Error("stockage indisponible")
  rafraichir()
  return p
}

/** Retire un événement publié de l'agenda (erreur, annulation par l'organisateur). */
export async function retirer(id: string) {
  const p = await lireProposition(id)
  if (!p) throw new Error("Proposition introuvable.")
  p.statut = "retire"
  await redis([["HDEL", CLE_PUBLIES, p.slug]])
  await enregistrer(p)
  rafraichir()
  return p
}

/* ───────────────────────── Paiement (Stripe) ───────────────────────── */

const cleStripe = () => (process.env.STRIPE_SECRET_KEY ?? "").trim()
export const stripeActif = () => /^(sk|rk)_(live|test)_/.test(cleStripe())

/** Lien permanent envoyé à l'organisateur : il crée une session Stripe neuve à chaque clic. */
export const lienPaiement = (p: Proposition) =>
  `${site.url}/api/agenda/payer?${new URLSearchParams({ id: p.id, c: p.jeton, l: p.langue })}`

async function stripe<T>(chemin: string, corps?: URLSearchParams): Promise<T> {
  const r = await fetch(`https://api.stripe.com/v1/${chemin}`, {
    method: corps ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${cleStripe()}`,
      ...(corps ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: corps,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  })
  const d = (await r.json().catch(() => ({}))) as T & { error?: { message?: string } }
  if (!r.ok) throw new Error(`stripe ${r.status}${d.error?.message ? ` : ${d.error.message}` : ""}`)
  return d
}

const LOCALES_STRIPE: Record<Langue, string> = { fr: "fr", de: "de", lb: "fr", en: "en", es: "es" }

/**
 * Signature d'un webhook Stripe (en-tête Stripe-Signature : t=…,v1=…) :
 * HMAC-SHA256 de « t.corps » avec le secret du point de terminaison, et
 * horodatage de moins de 5 minutes contre le rejeu.
 */
export function signatureStripeValide(corps: string, entete: string | null) {
  const secret = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim()
  if (!secret || !entete) return false
  const parties = entete.split(",").map((x) => x.trim().split("="))
  const t = parties.find(([k]) => k === "t")?.[1]
  const signatures = parties.filter(([k]) => k === "v1").map(([, v]) => v)
  if (!t || !signatures.length || Math.abs(Date.now() / 1000 - Number(t)) > 300) return false
  const attendu = Buffer.from(createHmac("sha256", secret).update(`${t}.${corps}`).digest("hex"))
  return signatures.some((v) => {
    const b = Buffer.from(v ?? "")
    return b.length === attendu.length && timingSafeEqual(b, attendu)
  })
}

export async function creerSessionPaiement(p: Proposition, l: Langue) {
  const retour = `${site.url}/api/agenda/retour`
  const corps = new URLSearchParams({
    mode: "payment",
    locale: LOCALES_STRIPE[l],
    customer_email: p.contact.email,
    client_reference_id: p.id,
    "metadata[proposition]": p.id,
    "payment_intent_data[metadata][proposition]": p.id,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(PRIX_CENTIMES),
    "line_items[0][price_data][product_data][name]": "Publication dans l'agenda Radio Tripoint",
    "line_items[0][price_data][product_data][description]":
      `${p.champs.titre} — ${p.champs.ville}, ${p.champs.date_debut}`.slice(0, 300),
    "invoice_creation[enabled]": "true",
    success_url: `${retour}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site.url}${l === "fr" ? "" : `/${l}`}/agenda/paiement?etat=annule`,
  })
  const s = await stripe<{ id: string; url: string }>("checkout/sessions", corps)
  return s.url
}

export async function lireSessionPaiement(id: string) {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return null
  const s = await stripe<{
    id: string
    payment_status: string
    amount_total: number | null
    currency: string | null
    metadata?: Record<string, string>
  }>(`checkout/sessions/${id}`)
  return {
    id: s.id,
    // Payé, et le bon montant : une session forgée à 1 € ne publie rien.
    paye: s.payment_status === "paid" && s.amount_total === PRIX_CENTIMES && s.currency === "eur",
    montant: s.amount_total ?? 0,
    devise: s.currency,
    proposition: s.metadata?.proposition ?? null,
  }
}
