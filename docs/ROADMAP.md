# Portal Development Roadmap

## Current state

Phase 1, Phase 2, and Phase 3 are complete. The portal has full workflow depth: matter updates from counsel, client document upload, request detail views, file attachments on service requests, matter filtering, client-initiated matter requests, a scope summary page, and a light lawyer-facing admin surface. Stage 3 has started replacing temporary portal stores with a dedicated durable portal database and private Vercel Blob document storage.

Authentication is wired through NextAuth v5 + Keycloak but the Keycloak instance has not been configured for production. Until it is, the portal may run in **preview mode** when explicitly enabled. Mock matter/document/request fallback is now gated by `PORTAL_ENABLE_MOCK_FALLBACK=true` or preview access; production should leave those flags disabled. The admin surface still uses a separate `PORTAL_ADMIN_TOKEN` env var + httpOnly cookie, independent of Keycloak, until Stage 4 role hardening.

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
- `src/lib/portal/requestStore.ts` — originally temporary; now portal DB-backed for submitted intake contracts
- `src/lib/services/actions.ts` — `submitServiceRequest` server action; builds `IntakeRequestContract`, stores it, redirects to requests page
- `app/corporate/app/documents/page.tsx` — document list: filename, matter link, date, download
- `app/corporate/app/requests/page.tsx` — submitted request list with status badges + service catalog grid

**Files modified**:

- `app/corporate/services/[slug]/request/page.tsx` — replaced disabled stub with real form: `requiredInputs` as labelled textareas, acknowledgement checkbox, live submit button using `service.ctaLabel`
- `src/components/portal/PortalShell.tsx` — Documents and Requests sidebar items are now `<Link>` elements; home sections replaced with descriptions + "View →" links

**Removal checklist** (once real document API and request backend are available):

1. Delete `src/lib/portal/mockDocuments.ts` and the mock branch in `documentSource.ts` once preview fallback is retired
2. Keep `requestStore.ts` as the portal DB adapter, or rename it once the Stage 3 storage layer is stabilized
3. Remove `isMock` handling from `documents/page.tsx`
4. Remove the `?submitted=1` query-param success banner if the requests page fetches live status

---

## Pass 2b — Workflow depth / Phase 2 (complete)

**Goal**: Make the portal the primary communication surface for ongoing fractional counsel.

**Completed 2026-05-03.**

**Files created**:

- `src/lib/portal/matterUpdateStore.ts` — originally temporary; now portal DB-backed for `MatterUpdate`
- `src/lib/portal/mockMatterUpdates.ts` — mock updates for preview mode
- `src/lib/portal/matterUpdateSource.ts` — live/mock abstraction (same pattern as `matterSource.ts`)
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
- Production email confirmation and notification delivery still require a configured notification provider

**Removal checklist** (once real backends are available):

1. Retire `mockMatterUpdates.ts` and the preview branch in `matterUpdateSource.ts` once production matter updates are live
2. Keep `uploadActions.ts` on the private Vercel Blob path and add retention/deletion tooling before broad production use
3. Add email provider; call it from `submitServiceRequest` and `uploadMatterDocument`

---

## Pass 2c — Intelligence and differentiation / Phase 3 (complete)

**Goal**: Make the portal a competitive differentiator — client-initiated matter requests, scope summary, and a lawyer-facing admin surface.

**Completed 2026-05-03.**

**Files created**:

- `src/lib/portal/matterRequestStore.ts` — originally temporary; now portal DB-backed for `MatterRequest` records
- `src/lib/portal/counselProfileSource.ts` — mock `CounselProfile` (model, startedAt, lawyerName, description, scopeItems); same live/mock abstraction pattern
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

1. Keep `matterRequestStore.ts` on the portal DB adapter or migrate it to the approved backend once access/request ownership is finalized
2. Keep admin uploads on the shared private Vercel Blob document store
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
- **Current route prefix**: Production topology is `https://clients.levine-law.ca` with no Next.js `basePath`. The current `/corporate` paths are application routes, so Keycloak callback URLs must use `https://clients.levine-law.ca/corporate/api/auth/callback/keycloak` until route simplification is approved.
- **Per-page route guards**: Auth is currently enforced inside each page component (`getPortalSession()` + redirect). If the app grows, consider middleware-level protection for the entire `/corporate/app` subtree.

---

## Stage 2 — Portal access request intake and review

**Goal**: Capture public "Request Portal Access" submissions durably, let Levine Law review them, and keep Keycloak account provisioning controlled.

**Implemented repo path**:

1. Public submissions use `src/lib/portal/accessRequestActions.ts`.
2. Preferred durable source of truth is the external access-request API configured with `PORTAL_ACCESS_REQUEST_API_BASE_URL` and `PORTAL_ACCESS_REQUEST_API_TOKEN`.
3. The portal calls:
   - `POST /portal-access-requests` to create a pending request.
   - `GET /portal-access-requests` for admin review.
   - `PATCH /portal-access-requests/{id}` for status, note, and Keycloak user linkage updates.
4. Admin review lives at `/corporate/admin/access-requests`.
5. Statuses are `pending`, `reviewing`, `approved`, `rejected`, and `provisioned`.
6. Optional notifications use `PORTAL_NOTIFICATION_WEBHOOK_URL` after durable persistence succeeds.

**Transitional capture path**:

- `PORTAL_ACCESS_REQUEST_WEBHOOK_URL` remains available as an approved capture endpoint only when the full access-request API is not configured.
- The webhook can be protected with `PORTAL_ACCESS_REQUEST_WEBHOOK_SECRET`, sent as a bearer token.
- Webhook capture does not provide admin listing or status review inside this repo.

**Provisioning rule**:

- Do not enable public Keycloak self-registration.
- Approval means Levine Law has reviewed the access request. Portal access is not complete until a Keycloak user is manually created or an approved provisioning service creates/invites the user.
- Store the resulting Keycloak user identifier on the access request and move it to `provisioned` when access is ready.

**Production requirements**:

- Set `PORTAL_ADMIN_TOKEN` until admin auth is replaced with Keycloak lawyer/admin roles.
- Configure the access-request API before treating homepage submissions as durably reviewable in the portal admin.
- Configure notification webhooks only after the durable API or approved capture endpoint is live.

---

## Stage 3 — Portal backend and durable storage (in progress)

**Goal**: Replace in-memory portal stores and metadata-only uploads with durable persistence.

**Implemented repo path**:

1. A separate portal database is allowed and is the durable store for portal service requests, matter requests, matter updates, document metadata, and audit events.
2. `docs/portal-stage3-schema.sql` defines the required Postgres schema.
3. `src/lib/portal/portalDb.ts` centralizes durable DB configuration and mock fallback gating.
4. `src/lib/portal/requestStore.ts`, `matterRequestStore.ts`, and `matterUpdateStore.ts` now use the portal database instead of in-memory Maps.
5. `src/lib/portal/documentStore.ts` stores document metadata in the portal database and writes file bytes to private Vercel Blob.
6. Document downloads are served through `/corporate/api/documents/[id]/download`, which checks portal/admin access before streaming private Blob content.
7. Upload validation is shared through `src/lib/portal/uploadValidation.ts`.
8. Audit events are written through `src/lib/portal/auditLog.ts` for request, update, upload, and download actions.

**Production configuration**:

- `PORTAL_DATABASE_URL` or `POSTGRES_URL` must point to the portal database.
- Apply `docs/portal-stage3-schema.sql` before enabling production writes.
- `BLOB_READ_WRITE_TOKEN` must be configured for private Vercel Blob storage.
- `PORTAL_ENABLE_MOCK_FALLBACK` must be false or unset in production.
- `LL_TASK_TRACKER_API_BASE_URL` and a real Keycloak access token are still required for live matter list/detail data.

**Retention policy**:

- Uploaded document records receive a seven-year `retention_until` date by default.
- Deletion is soft-delete first (`deleted_at`), with Blob deletion and retention workflows to be formalized before real client file lifecycle automation.

**Remaining Stage 3 work**:

1. Connect LL-task-tracker production matter endpoints and remove matter mock fallback from the launch path.
2. Decide whether access-request intake remains in the Stage 2 external API or is migrated into the portal database schema.
3. Add operational tooling for document deletion, retention review, and Blob cleanup.
4. Add production monitoring around failed uploads, downloads, request writes, and audit writes.

---

## Production wiring backlog

**Goal**: Move the portal from preview/mock mode to a production client workspace backed by Keycloak, LL-task-tracker, durable request storage, and real file/document storage.

**Current blockers**:

- Keycloak is not configured for production portal users, so real client sessions and server-side access tokens are not available.
- `LL_TASK_TRACKER_API_BASE_URL` is not wired to a production API, so matter data falls back to fixtures.
- Requests, matter requests, matter updates, document metadata, and uploaded file bytes have durable portal paths once the portal DB and Vercel Blob env vars are configured.
- Mock fallback remains available only for explicit preview/dev usage and must not be enabled for production launch.
- Admin access is gated by `PORTAL_ADMIN_TOKEN` instead of Keycloak lawyer/admin roles.

**Backlog**:

1. **Confirm production auth shape**: define the Keycloak realm, client roles/groups, client users, lawyer/admin users, and callback/logout URLs for the current `/corporate/api/auth` application route on `clients.levine-law.ca`.
2. **Configure Keycloak**: create the realm and OIDC client, then register `https://clients.levine-law.ca/corporate/api/auth/callback/keycloak` as the production callback URL.
3. **Set production auth env vars**: configure `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, `AUTH_URL`, `AUTH_KEYCLOAK_ISSUER`, `AUTH_KEYCLOAK_ID`, `AUTH_KEYCLOAK_SECRET`, and set `LL_CORPORATE_ENABLE_PREVIEW_ACCESS=false`.
4. **Verify real login**: sign into `https://clients.levine-law.ca/sign-in`, reach `/corporate/app`, and confirm `getAccessToken()` returns a Keycloak access token for server-side API calls.
5. **Expose LL-task-tracker API**: deploy or confirm production endpoints for `GET /case`, `GET /case/{businessKey}`, and `GET /task?businessKey=...`, with Keycloak bearer-token validation.
6. **Wire `LL_TASK_TRACKER_API_BASE_URL`**: set the production API base URL and confirm matter list/detail pages switch from `isMock: true` to live data.
7. **Validate API contracts**: compare live LL-task-tracker responses against `src/lib/contracts/schemas.ts`; update backend DTOs or frontend contract schemas until Zod validation passes.
8. **Provision portal DB**: create the portal database, apply `docs/portal-stage3-schema.sql`, and configure `PORTAL_DATABASE_URL` or `POSTGRES_URL`.
9. **Provision private Blob storage**: configure `BLOB_READ_WRITE_TOKEN` for private Vercel Blob uploads.
10. **Verify durable writes**: submit a service request, submit a matter request, upload a client document, post an admin matter update, and confirm rows/files/audit events persist.
11. **Remove launch-path mock fallback**: set `PORTAL_ENABLE_MOCK_FALLBACK=false` and `LL_CORPORATE_ENABLE_PREVIEW_ACCESS=false` in production once real data paths are verified.
12. **Replace admin auth**: remove the `PORTAL_ADMIN_TOKEN` login path and gate admin pages/actions with Keycloak lawyer/admin roles.
13. **Add notifications**: add an email provider and send client confirmations plus firm notifications for requests and uploads.
14. **Remove preview/mock paths**: delete mock data and temporary wrappers once production paths are stable, keeping only an intentional local/demo mode if needed.

**Shortest critical path**:

1. Configure Keycloak.
2. Wire `LL_TASK_TRACKER_API_BASE_URL`.
3. Validate live matter list/detail.
4. Provision portal DB and apply the Stage 3 schema.
5. Configure private Vercel Blob document storage.
6. Replace admin token auth with Keycloak roles.

---

## Architecture notes

| Layer                     | Technology                             | Notes                                                                  |
| ------------------------- | -------------------------------------- | ---------------------------------------------------------------------- |
| Framework                 | Next.js 15, App Router                 | All portal pages are server components                                 |
| Auth                      | NextAuth v5 + Keycloak OIDC            | Beta — see risk note above                                             |
| API adapter               | `src/lib/api/taskTracker.ts`           | Zod-validated; `listCases`, `getCase`, `listTasks`, `transitionCase`   |
| Access request adapter    | `src/lib/portal/accessRequestApi.ts`   | Zod-validated external API for public access requests and admin review |
| Contracts                 | `src/lib/contracts/`                   | `CaseInstance` v1.1.0; intake contract in `intake.ts`                  |
| Mock fallback — matters   | `src/lib/portal/matterSource.ts`       | TEMPORARY; remove when task tracker is live                            |
| Mock fallback — documents | `src/lib/portal/documentSource.ts`     | Dev/preview fallback only; production uses portal DB document metadata |
| Portal DB                 | `src/lib/portal/portalDb.ts`           | Postgres connection for Stage 3 durable portal data                    |
| Request store             | `src/lib/portal/requestStore.ts`       | Portal DB-backed service request persistence                           |
| Matter request store      | `src/lib/portal/matterRequestStore.ts` | Portal DB-backed client matter request persistence                     |
| Matter update store       | `src/lib/portal/matterUpdateStore.ts`  | Portal DB-backed counsel/admin update persistence                      |
| Document store            | `src/lib/portal/documentStore.ts`      | Portal DB metadata + private Vercel Blob file bytes                    |
| Blob storage              | `src/lib/portal/blobStorage.ts`        | Private Vercel Blob upload/download adapter                            |
| Audit log                 | `src/lib/portal/auditLog.ts`           | Portal DB-backed audit events                                          |
| Service action            | `src/lib/services/actions.ts`          | `submitServiceRequest` server action                                   |
| Upload action             | `src/lib/portal/uploadActions.ts`      | `uploadMatterDocument` server action                                   |
| Environment               | `env.mjs` via `@t3-oss/env-nextjs`     | `LL_TASK_TRACKER_API_BASE_URL` is the live-API gate                    |
| Deployment                | Vercel                                 | Client portal only; NDAESQ is a separate app/deployment/domain         |
