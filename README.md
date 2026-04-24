# Levine LLP Corporate Portal

`ll-corporate` is the bounded client-facing frontend for Levine LLP corporate client access.

This repository is a Next.js application shell. It is not the system of record and must not become a second workflow system.

## System Architecture (Levine LLP)

Levine LLP currently runs a multi-repo web system:

- `ll-corporate` (this repo) is the primary application associated with `https://levinellp.ca`.
- `NDA-Esq` owns the NDA Generator mounted at `https://levinellp.ca/nda`.
- `LL-task-tracker` is a separate operational app deployed at `https://firm.levinellp.ca`.

Current state versus intended domain role:

- `ll-corporate` is the primary application associated with `https://levinellp.ca`, even though the current implemented portal shell in this repo may still run under `/corporate`.
- `/nda` is reserved for `NDA-Esq` and must not be handled by this repo.
- Moving `ll-corporate` fully to root `/` is a future deployment and routing decision, and is not part of this change.

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
