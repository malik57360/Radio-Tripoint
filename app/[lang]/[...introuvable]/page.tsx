import { notFound } from "next/navigation"

/** Toute adresse inconnue passe par la page 404 du site, dans la bonne langue. */
export default function Introuvable() {
  notFound()
}
