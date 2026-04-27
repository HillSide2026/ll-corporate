# Portal Development Roadmap

## Current state

The client portal (`/corporate/app`) is structurally complete and accessible. Authentication is wired through NextAuth v5 + Keycloak but the Keycloak instance has not been configured for production. Until it is, the portal runs in **preview mode** — a mock session is injected via `src/lib/auth/preview.ts` and matter data is served from hardcoded fixtures in `src/lib/portal/mockMatters.ts`.

The portal renders real UI for all three core sections (Matters, Documents, Requests) but only Matters has any data plumbing behind it.

---

## Pass 1 — Live matter display (complete)

**Goal**: Replace hardcoded placeholder content with real data from LL-task-tracker once it is deployed.

**Files changed**:
- `src/lib/portal/mockMatters.ts` — three `CaseInstance` fixtures for preview/dev
- `src/lib/portal/matterSource.ts` — single abstraction that gates live vs mock; both `getMatterList` and `getMatterByKey` return `{ data, isMock }`
- `src/components/portal/MatterList.tsx` — async server component; renders matter list; shows "Preview data" notice when `isMock`
- `src/components/portal/PortalShell.tsx` — passes `accessToken` into `MatterList` inside a `Suspense` boundary
- `app/corporate/app/matters/[key]/page.tsx` — detail page; next action card, status card, event log

**What triggers live data**: Set `LL_TASK_TRACKER_API_BASE_URL` in Vercel environment variables. Once set and a real Keycloak access token is available, `matterSource.ts` automatically routes to the live API.

**Removal checklist** (once LL-task-tracker is live and Keycloak is configured):
1. Delete `src/lib/portal/mockMatters.ts`
2. Delete `src/lib/portal/matterSource.ts`
3. In `MatterList.tsx`, call `listCases()` directly; narrow `accessToken` back to `string`
4. In `matters/[key]/page.tsx`, call `getCase()` directly; remove `isMock` banner
5. In `PortalShell.tsx`, remove preview-mode `accessToken` default and `isMock` path
6. Remove "TEMPORARY" comments throughout

---

## Pass 2 — Service request intake (next)

**Goal**: Allow clients to submit a service request from the portal and see its status.

**Scope**:
- Build or connect a request form in `app/corporate/app/requests/` (shell exists at `app/corporate/services/[slug]/request/page.tsx`)
- Wire the form submission to LL-task-tracker or a separate intake endpoint
- Surface submitted requests in the "Requests" section of `PortalShell`
- Add request status tracking (mirrors the matter state/event log pattern from Pass 1)

**Dependencies**:
- LL-task-tracker must expose a task/request creation endpoint
- Keycloak token must be available to authenticate the submission
- Service contract for request payloads (analogous to `CaseInstance`) must be defined

**Pre-existing work**: `app/corporate/services/[slug]/request/page.tsx` is a static shell with a non-functional form. The contract types for service requests may need to be extended in `src/lib/contracts.ts`.

---

## Pass 3 — Production auth + Keycloak configuration (parallel with Pass 2)

**Goal**: Replace preview/mock auth with a live Keycloak realm configured for client access.

**Scope**:
- Create or configure a Keycloak realm for client portal users
- Set `AUTH_KEYCLOAK_ID`, `AUTH_KEYCLOAK_SECRET`, `AUTH_KEYCLOAK_ISSUER`, `AUTH_SECRET` in Vercel production environment
- Verify `getAccessToken()` returns a non-null bearer token in production sessions
- Remove the preview-mode session injection once real sessions are stable
- Confirm `LL_TASK_TRACKER_API_BASE_URL` points to the deployed LL-task-tracker instance

**Risk areas**:
- **NextAuth v5 beta** (`5.0.0-beta.30`): API surface is not stable. Avoid upgrading minor versions without checking changelogs; the `auth()` call shape and JWT callback signature have changed across betas.
- **basePath discrepancy**: `docs/deployment-topology.md` and `docs/infra-devops.md` describe `basePath: "/corporate"` but `next.config.ts` does not set it. Vercel routing currently handles the `/corporate` prefix via rewrites. Reconcile this before production Keycloak callback URIs are registered — the redirect URI must match exactly.
- **Per-page route guards**: Auth is currently enforced inside each page component (`getPortalSession()` + redirect). If the app grows, consider middleware-level protection for the entire `/corporate/app` subtree.

---

## Pass 4 — Document access (future)

**Goal**: Surface client documents securely through the portal.

**Scope**: TBD. Depends on a document storage and access-control system being connected to LL-task-tracker or a separate service.

---

## Architecture notes

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15, App Router | All portal pages are server components |
| Auth | NextAuth v5 + Keycloak OIDC | Beta — see risk note above |
| API adapter | `src/lib/api/taskTracker.ts` | Zod-validated; `listCases`, `getCase`, `listTasks`, `transitionCase` |
| Contracts | `src/lib/contracts.ts` | `CaseInstance` v1.1.0; all fields optional |
| Mock fallback | `src/lib/portal/matterSource.ts` | Remove in Pass 1 cleanup |
| Environment | `env.mjs` via `@t3-oss/env-nextjs` | `LL_TASK_TRACKER_API_BASE_URL` is the live-API gate |
| Deployment | Vercel | NDA Tool proxied from `/ndaesq` via rewrites in `vercel.json` |
