import { type NextConfig } from "next"

const config: NextConfig = {
  basePath: "/corporate",
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Keep rewrites scoped to this app's current implementation surface.
  // `/nda` is reserved for the sibling NDA-Esq service and must not be handled here.
  rewrites: async () => [
    { source: "/healthz", destination: "/api/health" },
    { source: "/api/healthz", destination: "/api/health" },
    { source: "/health", destination: "/api/health" },
    { source: "/ping", destination: "/api/health" },
  ],
}

export default config
