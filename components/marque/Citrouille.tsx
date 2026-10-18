import { cn } from "@/lib/utils/cn"

/** Citrouille-lanterne d'Halloween : elle s'épingle sur le logo, comme le ruban d'Octobre rose. */
export function Citrouille({ className, titre }: { className?: string; titre?: string }) {
  return (
    <svg
      viewBox="0 0 40 38"
      className={cn("overflow-visible", className)}
      role={titre ? "img" : undefined}
      aria-label={titre}
      aria-hidden={titre ? undefined : true}
    >
      {titre && <title>{titre}</title>}
      {/* Tige */}
      <path
        d="M20.5 8.5c-.2-2.6.6-5 2.6-6.8"
        stroke="#3d5a1e"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Corps : trois côtes, cerné de blanc comme le ruban, pour se détacher du logo. */}
      <g stroke="#fff" strokeWidth="1.6" paintOrder="stroke" strokeLinejoin="round">
        <ellipse cx="11.5" cy="22" rx="10" ry="13" fill="var(--citrouille-sombre)" />
        <ellipse cx="28.5" cy="22" rx="10" ry="13" fill="var(--citrouille-sombre)" />
        <ellipse cx="20" cy="22" rx="10.5" ry="14" fill="var(--citrouille)" />
      </g>
      {/* Visage : la bougie à l'intérieur. */}
      <g className="citrouille-bougie" fill="var(--bougie)">
        <path d="M10.5 18.5 14 14l3.2 4.5Z" />
        <path d="M22.8 18.5 26 14l3.5 4.5Z" />
        <path d="M18.6 22.6 20 20.4l1.4 2.2Z" />
        <path d="M9.5 25.5c3 4.8 18 4.8 21 0l-2.4.6-1.4 2-2-1.6-2.1 2.1-2.1-2.1-2 1.6-1.4-2Z" />
      </g>
    </svg>
  )
}
