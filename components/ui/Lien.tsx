"use client"

import Link from "next/link"
import { useLangue } from "@/components/i18n/Langue"
import { lienLangue } from "@/lib/i18n/langues"

/** `next/link` qui garde la langue : "/agenda" devient "/de/agenda" sur le site allemand. */
export default function Lien({ href, ...props }: React.ComponentProps<typeof Link>) {
  const langue = useLangue()
  const cible = typeof href === "string" ? lienLangue(href, langue) : href
  return <Link href={cible} {...props} />
}
