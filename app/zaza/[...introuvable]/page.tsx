import { notFound } from "next/navigation"

/** Toute adresse inconnue du site de Zaza passe par sa propre page 404. */
export default function Introuvable() {
  notFound()
}
