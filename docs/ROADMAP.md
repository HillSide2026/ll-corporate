# Portal Development Roadmap

## Current state

Phase 1, Phase 2, and Phase 3 are complete. The portal has full workflow depth: matter updates from counsel, client document upload, request detail views, file attachments on service requests, matter filtering, client-initiated matter requests, a scope summary page, and a light lawyer-facing admin surface. All TEMPORARY data stores remain in place until real backends are wired (Pass 4).

Authentication is wired through NextAuth v5 + Keycloak but the Keycloak instance has not been configured for production. Until it is, the portal runs in **preview mode** — a mock session is injected and data is served from hardcoded fixtures. The admin surface uses a separate `PORTAL_ADMIN_TOKEN` env var + httpOnly cookie, independent of Keycloak.

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

## Pass 2b — Workflow depth / Phase 2 (complete)

**Goal**: Make the portal the primary communication surface for ongoing fractional counsel.

**Completed 2026-05-03.**

**Files created**:
- `src/lib/portal/matterUpdateStore.ts` — TEMPORARY in-memory store for `MatterUpdate`
- `src/lib/portal/mockMatterUpdates.ts` — mock updates for preview mode
- `src/lib/portal/matterUpdateSource.ts` — live/mock abstraction (same pattern as `matterSource.ts`)
- `src/lib/portal/uploadedDocumentStore.ts` — TEMPORARY in-memory store for client-uploaded document metadata
- `src/lib/portal/uploadActions.ts` — `uploadMatterDocument` server action; validates file, stores metadata, redirects
- `app/corporate/app/requests/[id]/page.tsx` — request detail: service, inputs, scope, pricing, attachment, acknowledgement

**Files modified**:
- `app/corporate/app/matters/[key]/page.tsx` — added "Updates from counsel" feed + document upload form
- `app/corporate/app/documents/page.tsx` — merges lawyer-uploaded and client-uploaded documents; "Uploaded by you" badge
- `app/corporate/app/requests/page.tsx` — each request row is now a link to its detail page; shows attachment filename
- `app/corporate/services/[slug]/request/page.tsx` — optional file attachment field added before acknowledgement
- `src/lib/portal/requestStore.ts` — added `attachment` field to `StoredRequest`; added `getRequestById`
- `src/lib/services/actions.ts` — captures file metadata from `attachment` field; redirects to detail page
- `src/components/portal/PortalShell.tsx` — state filter tabs (All / Active / Pending / Closed) + text search form above matter list
- `src/components/portal/MatterList.tsx` — accepts `filterState` + `filterSearch`; applies client-side filtering
- `app/corporate/app/page.tsx` — accepts `searchParams`; extracts `state` + `search` and passes to PortalShell

**Deferred** (requires infrastructure not yet configured):
- Email confirmation to client on request submission — needs email provider (Resend, SendGrid, etc.)
- Email notification to firm on new request — same
- Real S3/R2 file storage — file bytes are discarded in TEMPORARY upload store; only metadata persists

**Removal checklist** (once real backends are available):
1. Replace `matterUpdateStore.ts` + `mockMatterUpdates.ts` + `matterUpdateSource.ts` with real API calls once the lawyer admin surface posts updates
2. Replace `uploadedDocumentStore.ts` with S3/R2 upload in `uploadActions.ts`; store real `fileUrl`
3. Add email provider; call it from `submitServiceRequest` and `uploadMatterDocument`

---

## Pass 2c — Intelligence and differentiation / Phase 3 (complete)

**Goal**: Make the portal a competitive differentiator — client-initiated matter requests, scope summary, and a lawyer-facing admin surface.

**Completed 2026-05-03.**

**Files created**:
- `src/lib/portal/matterRequestStore.ts` — TEMPORARY in-memory store for `MatterRequest` (category, description, status, clientIdentity)
- `src/lib/portal/counselProfileSource.ts` — mock `CounselProfile` (model, startedAt, lawyerName, description, scopeItems); same live/mock abstraction pattern
- `src/lib/portal/adminDocumentStore.ts` — TEMPORARY in-memory store for documents uploaded via the admin surface
- `src/lib/portal/adminActions.ts` — server actions `postMatterUpdate` and `adminUploadDocument`; both gate on `getAdminSession()`
- `src/lib/auth/adminAuth.ts` — admin session using `ll_admin_token` httpOnly cookie vs `PORTAL_ADMIN_TOKEN` env var; preview mode when token not set
- `app/corporate/admin/login/page.tsx` + `app/corporate/admin/login/actions.ts` — password form; validates token, sets cookie, redirects
- `app/corporate/admin/page.tsx` — admin home: all matters + all matter requests
- `app/corporate/admin/matters/[key]/page.tsx` — admin matter detail: post update form + upload document form
- `app/corporate/app/requests/new/page.tsx` — client-initiated matter request form (category, description, optional attachment, acknowledgement)
- `app/corporate/app/requests/new/actions.ts` — `submitMatterRequest` server action; validates and stores, redirects to requests page
- `app/corporate/app/scope/page.tsx` — scope summary: counsel model, start date, lawyer name, scope items, active/pending matters, CTA

**Files modified**:
- `app/corporate/app/requests/page.tsx` — rewritten to show matter requests + service requests in separate sections; "Open a matter" nav button
- `app/corporate/app/documents/page.tsx` — merges admin-uploaded docs alongside lawyer and client docs; no "Uploaded by you" badge on admin docs
- `src/components/portal/PortalShell.tsx` — Scope sidebar link added
- `env.mjs` — `PORTAL_ADMIN_TOKEN: optionalString` added to server schema

**Deferred**:
- Automated status nudges (email provider not yet configured)
- Matter request → Keycloak role–based access (admin auth is PORTAL_ADMIN_TOKEN placeholder)

**Removal checklist** (once Keycloak roles + real backends are available):
1. Replace `matterRequestStore.ts` + `counselProfileSource.ts` with real API calls
2. Replace `adminDocumentStore.ts` with real S3/R2 storage
3. Replace `adminAuth.ts` PORTAL_ADMIN_TOKEN check with Keycloak lawyer role check
4. Remove admin login page once SSO covers lawyer access

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
| Matter update store | `src/lib/portal/matterUpdateStore.ts` | TEMPORARY in-memory; replace when lawyer admin is live |
| Upload store | `src/lib/portal/uploadedDocumentStore.ts` | TEMPORARY metadata-only; replace with S3/R2 |
| Service action | `src/lib/services/actions.ts` | `submitServiceRequest` server action |
| Upload action | `src/lib/portal/uploadActions.ts` | `uploadMatterDocument` server action |
| Environment | `env.mjs` via `@t3-oss/env-nextjs` | `LL_TASK_TRACKER_API_BASE_URL` is the live-API gate |
| Deployment | Vercel | NDA Tool proxied from `/ndaesq` via rewrites in `vercel.json` |
