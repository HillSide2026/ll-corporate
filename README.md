# Levine LLP Corporate Portal

`ll-corporate` is the bounded client-facing frontend for Levine LLP corporate client access.

This repository is a Next.js application shell. It is not the system of record and must not become a second workflow system.

## System Architecture (Levine LLP)

Levine LLP currently runs a multi-repo web system:

- The public WordPress website is served from `https://www.levine-law.ca`.
- `ll-corporate` (this repo) is the standalone client portal app served from `https://clients.levine-law.ca`.
- `LL-task-tracker` is a separate operational backend/app outside this repo.

Current state versus intended domain role:

- `ll-corporate` is deployed separately from WordPress.
- Production must not mount the portal at `https://www.levine-law.ca/corporate`.
- Existing `/corporate` paths are application routes in this Next.js app, not production deployment topology.
- Future route simplification may move `/corporate/sign-in` to `/sign-in`, `/corporate/app` to `/app`, and `/corporate/admin` to `/admin`; do not implement those route changes until approved.

## System Boundary

`ll-task-tracker` is canonical for:

- lifecycle state
- workflow transitions
- permissions and authorization decisions
- command eligibility
- operational control
- scheduled state evaluation
- dashboard aggregates

`ll-corporate` may own:

- routing
- layout
- presentation
- client-safe interaction flow
- identity/session presentation
- adapters over backend-provided contracts

If the backend does not provide a client-safe contract, this frontend must show nothing or a neutral placeholder. It must not invent status values, derive dashboard metrics, simulate lifecycle behavior, or decide whether an action is allowed.

## Required Boundaries

- `src/lib/contracts/` contains the only domain shapes consumed by the frontend.
- `src/lib/api/` contains all backend interaction adapters.
- `src/lib/auth/` contains Keycloak/OIDC identity integration and session presentation helpers.
- `src/features/` contains portal feature modules after backend contracts exist.
- `src/components/portal/` contains portal shell and layout components only.

Components and pages must not call backend endpoints directly. They must consume contract-shaped data through `src/lib/api/`.

## Development

```sh
corepack enable
pnpm install
pnpm dev
```

Local entry URL:

```text
http://localhost:3000/corporate
```

Useful checks:

```sh
pnpm run lint
pnpm run prettier
pnpm run test
pnpm run build
pnpm run e2e:headless
```

## Public Homepage

The public `/` route is served by the Next.js route handler in `app/route.ts`, which returns the Astro-generated homepage HTML from `public/astro-home/index.html`. The Astro source app lives in `new website`.

After changing the Astro homepage, run:

```sh
pnpm run astro:sync
```

This builds `new website`, copies `new website/dist/index.html` to `public/astro-home/index.html`, and refreshes generated assets in `public/_astro`. The regular production build also runs this sync first:

```sh
pnpm run build
```

Request-access links should point to `/sign-up`. The legacy `/corporate/onboarding` route remains as a redirect to `/sign-up` for old links.

## Implementation Phasing

1. Shell: auth boundary, layout, routing, and contract-shaped placeholders.
2. Contracts: integrate client-safe backend DTOs from `ll-task-tracker`.
3. Actions: add user commands only after backend command contracts exist.
4. Closure/archive: add only after backend lifecycle support exists.

No business logic should be imported from `toronto-corporate`.

## Deployment Notes

- [System Deployment Overview](DEPLOYMENT.md)
- [Deployment Topology Note](docs/deployment-topology.md)
- [Production Routing + Auth Note](docs/production-routing-auth.md)
- [Infra / DevOps Implementation Note](docs/infra-devops.md)
