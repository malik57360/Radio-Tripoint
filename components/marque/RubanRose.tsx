import { cn } from "@/lib/utils/cn"

/** Ruban rose d'Octobre rose (lutte contre le cancer du sein). */
export function RubanRose({ className, titre }: { className?: string; titre?: string }) {
  return (
    <svg
      viewBox="0 0 24 32"
      className={cn("overflow-visible", className)}
      role={titre ? "img" : undefined}
      aria-label={titre}
      aria-hidden={titre ? undefined : true}
    >
      {titre && <title>{titre}</title>}
      <path
        fillRule="evenodd"
        d="M12 1.5c-3.6 0-6 2.8-6 6.3 0 2.6 1.4 5.4 3.3 8.3L3.4 28.4l4 1.8L12 21l4.6 9.2 4-1.8-5.9-12.3c1.9-2.9 3.3-5.7 3.3-8.3 0-3.5-2.4-6.3-6-6.3Zm0 3.3c1.7 0 2.8 1.4 2.8 3.2 0 1.4-.9 3.4-2.8 6-1.9-2.6-2.8-4.6-2.8-6 0-1.8 1.1-3.2 2.8-3.2Z"
        fill="var(--rose)"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinejoin="round"
        paintOrder="stroke"
      />
    </svg>
  )
}
