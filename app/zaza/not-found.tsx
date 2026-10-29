import Link from "next/link"
import { Feuille } from "@/components/zaza/Dessins"

export default function Introuvable() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <Feuille className="text-nuit mx-auto size-20" />
      <h1 className="font-display text-nuit mt-6 text-4xl">Page introuvable</h1>
      <Link
        href="/"
        className="text-nuit decoration-or mt-6 inline-block font-semibold underline decoration-2 underline-offset-4"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
