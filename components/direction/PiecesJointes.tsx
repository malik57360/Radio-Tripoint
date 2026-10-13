"use client"

import { Paperclip, X } from "lucide-react"
import { useRef } from "react"
import {
  PJ_MAX_NOMBRE,
  PJ_MAX_OCTETS,
  problemePieces,
  tailleLisible,
} from "@/lib/direction/pieces-jointes"

/** Fichiers choisis → FormData pour les actions (champ « pieces »), ou rien. */
export function versFormData(fichiers: File[]) {
  if (!fichiers.length) return undefined
  const fd = new FormData()
  for (const f of fichiers) fd.append("pieces", f, f.name)
  return fd
}

/**
 * Pièces jointes d'un mail : bouton « Joindre », liste des fichiers avec leur
 * poids, retrait d'un fichier. Les bornes (nombre, poids total, programmes
 * refusés) sont contrôlées ici et de nouveau sur le serveur.
 */
export function PiecesJointes({
  fichiers,
  onChange,
  desactive,
}: {
  fichiers: File[]
  onChange: (f: File[]) => void
  desactive?: boolean
}) {
  const entree = useRef<HTMLInputElement>(null)
  const probleme = problemePieces(fichiers)
  const total = fichiers.reduce((s, f) => s + f.size, 0)

  const ajouter = (liste: FileList | null) => {
    if (!liste?.length) return
    const deja = new Set(fichiers.map((f) => `${f.name}·${f.size}`))
    onChange([...fichiers, ...Array.from(liste).filter((f) => !deja.has(`${f.name}·${f.size}`))])
    // Le même fichier peut être rechoisi après un retrait.
    if (entree.current) entree.current.value = ""
  }

  return (
    <div>
      <input
        ref={entree}
        type="file"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => ajouter(e.target.files)}
      />
      <button
        type="button"
        onClick={() => entree.current?.click()}
        disabled={desactive}
        className="border-trait hover:border-encre inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold disabled:opacity-40"
      >
        <Paperclip className="size-4" aria-hidden /> Joindre des fichiers
      </button>
      {fichiers.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {fichiers.map((f, i) => (
            <li
              key={`${f.name}·${f.size}`}
              className="bg-carte-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            >
              <Paperclip className="text-encre-3 size-3.5 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1 truncate font-semibold">{f.name}</span>
              <span className="text-encre-3 shrink-0 tabular-nums">{tailleLisible(f.size)}</span>
              <button
                type="button"
                onClick={() => onChange(fichiers.filter((_, j) => j !== i))}
                disabled={desactive}
                aria-label={`Retirer ${f.name}`}
                className="hover:text-alerte shrink-0 rounded-full p-1 disabled:opacity-40"
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className={`mt-1.5 text-xs ${probleme ? "text-alerte font-semibold" : "text-encre-3"}`}>
        {probleme ??
          (fichiers.length
            ? `${fichiers.length} fichier${fichiers.length > 1 ? "s" : ""} · ${tailleLisible(total)} sur ${tailleLisible(PJ_MAX_OCTETS)}`
            : `PDF, images, documents : ${PJ_MAX_NOMBRE} fichiers et ${tailleLisible(PJ_MAX_OCTETS)} au total au plus.`)}
      </p>
    </div>
  )
}
