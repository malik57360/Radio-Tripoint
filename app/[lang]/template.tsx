/** Transition de page : la nouvelle page monte en douceur à chaque navigation. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-entree">{children}</div>
}
