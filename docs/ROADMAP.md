# Portal Development Roadmap

## Current state

The client portal (`/corporate/app`) is fully functional for the Phase 1 MVP scope. Authentication is wired through NextAuth v5 + Keycloak but the Keycloak instance has not been configured for production. Until it is, the portal runs in **preview mode** — a mock session is injected and data is served from hardcoded fixtures.

All three core sections (Matters, Documents, Requests) are now live with real UI and data plumbing. Service request submission is wired end-to-end via server action and in-memory store (TEMPORARY — see removal checklist below).

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

## Pass 2 — Service request intake, documents, and requests (complete)

**Goal**: Allow clients to submit service requests, view documents, and track request status.

**Completed 2026-05-03.**

**Files created**:
- `src/lib/portal/mockDocuments.ts` — TEMPORARY document fixtures (same pattern as `mockMatters.ts`)
- `src/lib/portal/documentSource.ts` — TEMPORARY document fetch abstraction with mock fallback
- `src/lib/portal/requestStore.ts` — TEMPORARY in-memory store for submitted intake contracts
- `src/lib/services/actions.ts` — `submitServiceRequest` server action; builds `IntakeRequestContract`, stores it, redirects to requests page
- `app/corporate/app/documents/page.tsx` — document list: filename, matter link, date, download
- `app/corporate/app/requests/page.tsx` — submitted request list with status badges + service catalog grid

**Files modified**:
- `app/corporate/services/[slug]/request/page.tsx` — replaced disabled stub with real form: `requiredInputs` as labelled textareas, acknowledgement checkbox, live submit button using `service.ctaLabel`
- `src/components/portal/PortalShell.tsx` — Documents and Requests sidebar items are now `<Link>` elements; home sections replaced with descriptions + "View →" links

**Removal checklist** (once real document API and request backend are available):
1. Delete `src/lib/portal/mockDocuments.ts` and `documentSource.ts`; replace with real API call in `documents/page.tsx`
2. Delete `src/lib/portal/requestStore.ts`; replace `addRequest` / `getRequests` calls in `actions.ts` and `requests/page.tsx` with real DB/API calls
3. Remove `isMock` handling from `documents/page.tsx`
4. Remove the `?submitted=1` query-param success banner if the requests page fetches live status

---

## Pass 3 — Production auth + Keycloak configuration (next)

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

## Pass 4 — Replace temporary data stores with real backends (next)

**Goal**: Replace the three TEMPORARY data layers added in Pass 2 with real API-backed implementations.

**Scope**:
1. **Documents**: Connect `documentSource.ts` to a real document storage endpoint (S3/R2 + metadata API or task tracker extension). Replace mock with live fetch; remove `isMock` flag.
2. **Request store**: Replace `requestStore.ts` in-memory Map with a real database (Postgres, PlanetScale, Airtable, or task tracker intake endpoint). Wire `submitServiceRequest` to POST to the real endpoint instead of `addRequest()`. Wire `requests/page.tsx` to query live records.
3. **Request → Matter linkage**: Once the task tracker creates a `CaseInstance` per intake, filter `listCases()` by matter type in the requests page instead of querying a separate store.

---

## Architecture notes

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15, App Router | All portal pages are server components |
| Auth | NextAuth v5 + Keycloak OIDC | Beta — see risk note above |
| API adapter | `src/lib/api/taskTracker.ts` | Zod-validated; `listCases`, `getCase`, `listTasks`, `transitionCase` |
| Contracts | `src/lib/contracts/` | `CaseInstance` v1.1.0; intake contract in `intake.ts` |
| Mock fallback — matters | `src/lib/portal/matterSource.ts` | TEMPORARY; remove when task tracker is live |
| Mock fallback — documents | `src/lib/portal/documentSource.ts` | TEMPORARY; remove when document API is live |
| Request store | `src/lib/portal/requestStore.ts` | TEMPORARY in-memory; replace with real DB |
| Service action | `src/lib/services/actions.ts` | `submitServiceRequest` server action |
| Environment | `env.mjs` via `@t3-oss/env-nextjs` | `LL_TASK_TRACKER_API_BASE_URL` is the live-API gate |
| Deployment | Vercel | NDA Tool proxied from `/ndaesq` via rewrites in `vercel.json` |
