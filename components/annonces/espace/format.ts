import type { StatutCommande } from "@/lib/annonces/commandes"

/** Libellés et dates partagés par les pages de « Mon espace ». */
export const STATUTS_COMMANDE: Record<StatutCommande, { nom: string; teinte: string }> = {
  attente: { nom: "En attente", teinte: "bg-[#fdefc0] text-black" },
  payee: { nom: "Payée", teinte: "bg-[#dff3e4] text-[#14532d]" },
  remboursee: { nom: "Remboursée", teinte: "bg-[#d6e8e9] text-[#0a3640]" },
  annulee: { nom: "Annulée", teinte: "bg-papier-3 text-encre-2" },
}

export const dateHeure = (ms: number) =>
  new Date(ms).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  })
