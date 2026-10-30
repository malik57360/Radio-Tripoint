"use client"

import { useEffect, useRef } from "react"
import { quandPret } from "@/lib/utils/pret"

/**
 * Spectre audio sous le cadran : des barres qui ondulent doucement au repos
 * et s'emballent quand le direct joue (data-antenne sur <html>). Le flux
 * radio n'autorise pas l'analyse du son (CORS) : le mouvement est généré,
 * pas mesuré. Arrêté hors écran et si l'utilisateur réduit les animations.
 * Léger : 30 images/s, couleur relue une fois par seconde (pas à chaque
 * image : getComputedStyle force un recalcul des styles), et départ une
 * fois la page prête (lib/utils/pret.ts).
 */
export function Spectre({ className }: { className?: string }) {
  const toile = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = toile.current
    if (!c) return
    const ctx = c.getContext("2d")
    if (!ctx) return
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)")
    const N = 72
    const niveaux = new Float32Array(N)
    let energie = 0.18
    let visible = true
    let pret = false
    let id = 0
    let t0 = performance.now()
    let couleur = getComputedStyle(c).color
    let relu = 0

    const taille = () => {
      const r = c.getBoundingClientRect()
      const d = Math.min(window.devicePixelRatio || 1, 2)
      c.width = Math.round(r.width * d)
      c.height = Math.round(r.height * d)
    }
    taille()
    const ro = new ResizeObserver(taille)
    ro.observe(c)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (pret && visible && !id) id = requestAnimationFrame(image)
    })
    io.observe(c)

    function image(t: number) {
      id = 0
      if (!c || !ctx) return
      if (t - t0 < 31) {
        if (visible && !calme.matches) id = requestAnimationFrame(image)
        return
      }
      const dt = Math.min((t - t0) / 1000, 0.05)
      t0 = t
      if (t - relu > 1000) {
        couleur = getComputedStyle(c).color
        relu = t
      }
      const enDirect = document.documentElement.dataset.antenne === "on"
      energie += ((enDirect ? 0.95 : 0.2) - energie) * Math.min(1, dt * 2.5)
      const temps = t / 1000
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.fillStyle = couleur
      const pas = c.width / N
      const largeur = Math.max(2, pas * 0.42)
      for (let i = 0; i < N; i++) {
        const x = i / N
        // Plusieurs sinusoïdes + un « battement » : organique, jamais périodique à l'œil.
        const onde =
          0.5 +
          0.28 * Math.sin(temps * 1.7 + x * 9) +
          0.18 * Math.sin(temps * 3.1 - x * 23) +
          0.12 * Math.sin(temps * 5.3 + x * 41) +
          (enDirect ? 0.22 * Math.max(0, Math.sin(temps * 8.4)) ** 6 : 0)
        const cible = Math.max(
          0.04,
          Math.min(1, onde * energie * (0.55 + 0.45 * Math.sin(x * Math.PI))),
        )
        niveaux[i] += (cible - niveaux[i]) * Math.min(1, dt * 12)
        const h = Math.max(2, niveaux[i] * c.height)
        ctx.globalAlpha = 0.35 + 0.65 * niveaux[i]
        ctx.fillRect(i * pas + (pas - largeur) / 2, (c.height - h) / 2, largeur, h)
      }
      if (visible && !calme.matches) id = requestAnimationFrame(image)
    }
    const annuler = quandPret(() => {
      pret = true
      if (visible && !id) id = requestAnimationFrame(image)
    })
    return () => {
      annuler()
      cancelAnimationFrame(id)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return <canvas ref={toile} className={className} aria-hidden />
}
