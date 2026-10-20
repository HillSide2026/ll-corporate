import { type NextConfig } from "next"

const config: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Keep rewrites scoped to this app's current implementation surface.
  // `/nda` is reserved for the sibling NDA-Esq service and must not be handled here.
  // The Astro homepage was withdrawn 2026-10-20; old links to it land on sign-in.
  redirects: async () => [{ source: "/astro-home/:path*", destination: "/sign-in", permanent: false }],
  rewrites: async () => [
    { source: "/healthz", destination: "/api/health" },
    { source: "/api/healthz", destination: "/api/health" },
    { source: "/health", destination: "/api/health" },
    { source: "/ping", destination: "/api/health" },
  ],
}

export default config
