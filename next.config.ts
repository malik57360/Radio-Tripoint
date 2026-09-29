import path from "node:path"
import type { NextConfig } from "next"

const dev = process.env.NODE_ENV !== "production"

/**
 * Anciennes URL du site Webador → nouvelles routes (301). Les rubriques
 * dont l'adresse ne change pas (/actualites, /agenda, /art-culture…) sont
 * conservées telles quelles et n'ont pas besoin de redirection.
 */
const redirections: [string, string][] = [
  ["/nos-emissions", "/emissions"],
  ["/podcast-replay", "/podcasts"],
  ["/a-propos-de-nous", "/a-propos"],
  ["/preventions-sensibilisation", "/prevention"],
  ["/accueil", "/"],
  ["/index.html", "/"],
]

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  // Le flux et les podcasts peuvent être servis par un hébergeur audio externe (Radioking…).
  "media-src 'self' https: blob:",
  `connect-src 'self'${dev ? " ws:" : ""}`,
  // Cartes intégrées : OpenStreetMap (territoire) et Google Maps (contact, au clic).
  "frame-src https://www.openstreetmap.org https://maps.google.com https://www.google.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ")

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  poweredByHeader: false,
  // Racine explicite : si ce dossier se retrouve un jour sous un autre
  // projet qui a son propre package-lock.json, Turbopack ne remonte pas.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return redirections.map(([source, destination]) => ({ source, destination, permanent: true }))
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ]
  },
}

export default nextConfig
