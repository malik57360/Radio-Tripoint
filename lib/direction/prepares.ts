import "server-only"
import lots from "@/data/prospection-preparee.json"
import { redis } from "./redis"

/**
 * Mails de prospection préparés à l'avance : les adresses cherchées sur les
 * sources publiques (site de l'entreprise, Moselle Attractivité, annuaire…),
 * chaque message écrit pour son entreprise. Un lot par jour dans
 * data/prospection-preparee.json ; Giorgio relit et envoie depuis info@.
 *
 * Le dépôt est public : on n'y met que les adresses propres aux entreprises.
 * Une adresse au nom d'une personne reste vide et se saisit dans la page.
 * Ce qui a été envoyé ou écarté est noté dans Redis.
 */

export interface MailPrepare {
  id: string
  nom: string
  activite: string
  commune: string
  /** Vide : adresse au nom d'une personne, à saisir. */
  email: string
  /** Adresse lue sur le site de l'entreprise ou sa fiche officielle (sinon : à vérifier). */
  verifie: boolean
  source: string
  objet: string
  texte: string
}

export interface EtatPrepare {
  etat: "envoye" | "ecarte"
  a?: string
  quand: number
}

const CLE = "rt:prospection:prepares" // id → EtatPrepare

const TOUS = Object.values(lots as Record<string, MailPrepare[]>).flat()

export const mailPrepare = (id: string) => TOUS.find((m) => m.id === id) ?? null

/** Les mails préparés, avec ce qui a déjà été envoyé ou écarté. */
export async function lirePrepares(): Promise<(MailPrepare & { suite: EtatPrepare | null })[]> {
  const r = await redis([["HGETALL", CLE]])
  const brut = (r?.[0] as string[] | null) ?? []
  const suites: Record<string, EtatPrepare> = {}
  for (let i = 0; i < brut.length; i += 2) {
    try {
      suites[brut[i]] = JSON.parse(brut[i + 1]) as EtatPrepare
    } catch {
      /* ligne illisible : ignorée */
    }
  }
  return TOUS.map((m) => ({ ...m, suite: suites[m.id] ?? null }))
}

export async function suitePrepare(id: string): Promise<EtatPrepare | null> {
  const r = await redis([["HGET", CLE, id]])
  return typeof r?.[0] === "string" ? (JSON.parse(r[0]) as EtatPrepare) : null
}

export async function noterPrepare(id: string, suite: EtatPrepare) {
  await redis([["HSET", CLE, id, JSON.stringify(suite)]])
}
