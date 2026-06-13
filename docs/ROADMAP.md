# Portal Development Roadmap

## Current state

The public site (`levinellp.ca`) and client portal (`/corporate/app`) are feature-complete for Phase 1. The intake funnel (Tier 1 — prospect → client) has a complete UI and self-service account creation; DB persistence and the auto-promote logic are the remaining gap before the funnel is end-to-end functional.

**Two-tier portal model:**
- **Tier 1 — Prospect** (`/intake`): self-registered, limited workspace — browse products/services, pay, complete questionnaire, accept service engagement → auto-promoted to Tier 2
- **Tier 2 — Client** (`/corporate/app`): matters, documents, requests, scope — the full fractional counsel workspace

---

## Intake funnel (Tier 1)

### Phase A — Self-service account creation ✓ complete

- `users` table migration (`scripts/db-migrate.mjs`): `id, email, name, password_hash, role (prospect|client), created_at`
- Registration server action (`src/lib/auth/registerAction.ts`): validate, bcrypt (salt 12), insert, auto sign-in
- `/sign-up` page: name, email, password, confirm password; per-field error display
- `auth.ts` credentials provider reads DB; env-var pair kept as admin fallback

**Remaining:**
- Intake routes still need authenticated-user gating once Phase C persistence is in place.

### Phase B — Intake workspace UI ✓ complete

**Routes:** `/intake/catalog`, `/intake/questionnaire/[slug]`, `/intake/engagement`

**Shell:** dual-mode via `intake_mode` cookie — funnel (step bar, linear) or hub (sidebar nav). Mode toggled by "Explore freely" / back to funnel.

**Catalog:** unified tabbed view (Products | Services)
- Products: Founders Pack (GHL → `http://legal.levine-law.ca/ip1`), Founders Agreement (GHL → `http://legal.levine-law.ca/ip2`), Corporate Health Check (inquiry CTA — not yet built)
- Services: 5-service `serviceCatalog` (incorporation, director-officer change, share issuance, minute book update, annual return) — CTA: "Get started"

**Questionnaire:** multi-step, one section per screen, driven by `service.requiredInputs`, progress bar

**Engagement:** generic service engagement agreement filled with service name/scope, click-to-accept

**Remaining:**
- Questionnaire answers saved in-memory only — no DB persistence
- Engagement acceptance doesn't persist or flip `role = client`
- No redirect to `/corporate/app` on engagement acceptance

### Phase C — Intake DB + auto-promote (next)

Close the loop between UI and real state.

1. **DB tables** (add to `scripts/db-migrate.mjs`):
   - `intake_sessions`: `id, user_id, service_slug, answers jsonb, status (in_progress|submitted), created_at, updated_at`
   - `engagement_acceptances`: `id, user_id, service_slug, service_title, scope_snapshot jsonb, accepted_at, terms_version`

2. **Questionnaire persistence** — save/load answers from `intake_sessions` on each step; support save-and-return

3. **Engagement acceptance** — write to `engagement_acceptances`, flip `users.role = 'client'`, redirect to `/corporate/app`

4. **Role enforcement audit** — role is now in JWT/session and `/corporate/app` routes require `client`; keep this contract covered as intake and admin features expand

5. **Intake gating** — `/intake` routes require authenticated user (prospect or client); `/corporate/app` requires `client` role

### Phase D — Stripe payment gate (after Phase C)

- Stripe Checkout (hosted redirect) for services before questionnaire
- Webhook `checkout.session.completed` → marks payment in `intake_payments` table
- `intake_payments`: `id, user_id, service_slug, stripe_session_id, status (pending|paid), created_at`
- Success URL → `/intake/questionnaire/[slug]`
- Questionnaire access gated on confirmed payment record

### Phase E — Admin visibility for prospects

- `/corporate/admin/prospects`: list registrations, questionnaire status, engagement acceptances (read-only)
- Promote/block controls for manual override

---

## Client portal (Tier 2)

### Pass 1 — Matter display ✓ complete

Live matter data from LL-task-tracker via `matterSource.ts`. Falls back to `mockMatters.ts` when `LL_TASK_TRACKER_API_BASE_URL` is unset. Matter detail: next action, status, event log.

### Pass 2 — Requests + documents ✓ complete

Service request intake (`/corporate/services/[slug]/request`), document list with download, request list with status badges, file attachments.

### Pass 2b — Workflow depth ✓ complete

Matter updates from counsel, client document upload, request detail view, matter filtering + search, client-initiated matter requests, scope summary page.

### Pass 2c — Admin surface ✓ complete

`/corporate/admin`: matter list + matter requests. `/corporate/admin/matters/[key]`: post updates, upload documents. Admin auth via `PORTAL_ADMIN_TOKEN` cookie (temporary — see Pass 3).

### Stage 2 — Access request intake ✓ complete

Public "Request Portal Access" submissions via `accessRequestActions.ts`. Admin review at `/corporate/admin/access-requests`. External API configurable via `PORTAL_ACCESS_REQUEST_API_BASE_URL`; webhook fallback via `PORTAL_ACCESS_REQUEST_WEBHOOK_URL`.

### Stage 3 — Durable storage ✓ complete (code), pending (production)

Portal DB-backed stores for requests, matter requests, matter updates, document metadata. Private Vercel Blob for file bytes. Audit log. Schema at `docs/portal-stage3-schema.sql`.

**To activate in production:**
- Apply `docs/portal-stage3-schema.sql` to the portal database
- Set `PORTAL_DATABASE_URL` (or `POSTGRES_URL`)
- Set `BLOB_READ_WRITE_TOKEN`
- Set `PORTAL_ENABLE_MOCK_FALLBACK=false`

---

## Production wiring backlog

Everything below is configuration/infrastructure — the code is ready.

### Shortest critical path

1. **Configure Keycloak** — create realm, OIDC client, register callback `https://clients.levine-law.ca/corporate/api/auth/callback/keycloak`
2. **Set auth env vars** — `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, `AUTH_URL`, `AUTH_KEYCLOAK_ISSUER`, `AUTH_KEYCLOAK_ID`, `AUTH_KEYCLOAK_SECRET`
3. **Wire LL-task-tracker** — set `LL_TASK_TRACKER_API_BASE_URL` to production endpoint; confirm live matter data
4. **Apply portal DB schema** — run `docs/portal-stage3-schema.sql`, set `PORTAL_DATABASE_URL`
5. **Configure Vercel Blob** — set `BLOB_READ_WRITE_TOKEN`; verify uploads/downloads
6. **Replace admin token auth** — gate `/corporate/admin` on Keycloak lawyer/admin role; remove `PORTAL_ADMIN_TOKEN` login page
7. **Run production readiness check** — set production environment variables, then run `pnpm run prod:check`

### Full backlog

| # | Item | Blocked by |
|---|------|-----------|
| 1 | Configure Keycloak realm + OIDC client | — |
| 2 | Set production auth env vars | 1 |
| 3 | Verify real login at `/sign-in` → `/corporate/app` | 2 |
| 4 | Deploy LL-task-tracker API with Keycloak bearer validation | 1 |
| 5 | Set `LL_TASK_TRACKER_API_BASE_URL` + validate matter data against `schemas.ts` | 4 |
| 6 | Apply `portal-stage3-schema.sql`; set `PORTAL_DATABASE_URL` | — |
| 7 | Set `BLOB_READ_WRITE_TOKEN`; verify file upload/download | 6 |
| 8 | Set `PORTAL_ENABLE_MOCK_FALLBACK=false` in production | 5, 7 |
| 9 | Replace `PORTAL_ADMIN_TOKEN` with Keycloak lawyer role | 2 |
| 10 | Add email provider (Resend/SendGrid); wire request + upload notifications | — |
| 11 | Run `pnpm db:migrate` for `users` table and portal Stage 3 schema in production | 6 |
| 12 | Intake Phase C — DB persistence + auto-promote | — |
| 13 | Stripe integration for service payment gate | 12 |
| 14 | Admin prospect visibility | 12 |

---

## Architecture

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15, App Router | Server components throughout |
| Auth | NextAuth v5 beta (`5.0.0-beta.30`) | Credentials (DB) + Keycloak OIDC; beta — don't upgrade without checking changelog |
| User DB | `@vercel/postgres` (`src/lib/db/users.ts`) | `users` table; bcrypt passwords; `prospect`/`client` roles |
| Portal DB | `src/lib/portal/portalDb.ts` | Separate Postgres connection for portal data |
| API adapter | `src/lib/api/taskTracker.ts` | Zod-validated; `listCases`, `getCase`, `listTasks`, `transitionCase` |
| Access requests | `src/lib/portal/accessRequestApi.ts` | External API or webhook fallback |
| Document storage | `src/lib/portal/documentStore.ts` + `blobStorage.ts` | DB metadata + private Vercel Blob |
| Audit log | `src/lib/portal/auditLog.ts` | Portal DB-backed |
| Mock fallback | `matterSource.ts`, `documentSource.ts` | Dev/preview only; gate with `PORTAL_ENABLE_MOCK_FALLBACK` |
| Environment | `env.mjs` via `@t3-oss/env-nextjs` | Type-safe env vars |
| Deployment | Vercel | `buildCommand: "next build"` in `vercel.json` bypasses `astro:sync` |
