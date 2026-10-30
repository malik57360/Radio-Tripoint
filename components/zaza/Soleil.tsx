/** Le soleil couché sur l'eau, aux couleurs des palmes du logo, coupé de bandes comme sur les affiches de la Riviera. */
export function SoleilRiviera({ className }: { className?: string }) {
  const bandes = [
    [118, 3],
    [128, 4],
    [139, 5],
    [151, 6],
    [164, 8],
    [178, 10],
  ]
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sol" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-turquoise)" />
          <stop offset="0.5" stopColor="var(--color-menthe)" />
          <stop offset="1" stopColor="var(--color-or-clair)" />
        </linearGradient>
        <mask id="horizon">
          <rect width="200" height="200" fill="#fff" />
          {bandes.map(([y, h]) => (
            <rect key={y} x="0" y={y} width="200" height={h} fill="#000" />
          ))}
        </mask>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#sol)" mask="url(#horizon)" />
    </svg>
  )
}
