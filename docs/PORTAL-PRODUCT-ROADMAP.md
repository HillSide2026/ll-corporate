# Client Portal — Product Roadmap

> Strategic product, UX, and engineering roadmap for the Levine LLP client portal.
> Last updated: 2026-05-03

---

## Current State (as of 2026-05-03)

Phase 1 MVP is complete. The portal is usable for a real fractional counsel client.

### Live and functional

- Sign-in (credentials + Keycloak SSO)
- Session management and auth guards
- Portal shell layout with sidebar navigation — all three sections are real links
- Matter list — live API with mock fallback
- Matter detail — state badge, next action card, full event timeline
- **Service request form** — `requiredInputs` rendered as labelled fields, acknowledgement checkbox, server action submission, confirmation redirect
- **Documents route** — `/corporate/app/documents`, table view with matter link and download
- **Requests route** — `/corporate/app/requests`, submitted request list with status badges, service catalog entry points
- Service catalog data model (5 services, fully structured)
- Intake contract types wired end-to-end
- Preview mode for development without a live backend

### TEMPORARY — must replace before production scale

- `src/lib/portal/mockDocuments.ts` + `documentSource.ts` — mock document records; replace with real document API
- `src/lib/portal/requestStore.ts` — in-memory Map for submitted requests; resets on server restart; replace with real database or task tracker intake endpoint
- `src/lib/portal/mockMatters.ts` + `matterSource.ts` — mock matter data; replace when `LL_TASK_TRACKER_API_BASE_URL` is live

### Not started (Phase 2+)

- Document upload (client-side)
- Matter updates / counsel notes visible to client
- Automated status email notifications
- Messaging or client-initiated updates
- Client-initiated matter requests (beyond fixed-fee services)
- Lawyer-facing admin surface inside the portal

---

## Strategic Purpose

| Layer | Purpose |
|---|---|
| Public site | Positioning, authority, routing prospects to services or the portal |
| Client portal | Execution layer — delivering legal services digitally |

The portal supports:

- Ongoing fractional counsel relationships
- Front-of-matter document sharing
- Service requests (especially limited-scope fixed-fee work)
- Client communication (async, structured)

The portal is **not** a case management system, a billing platform, or a communication hub. Those functions live in the task tracker and firm tooling. The portal is the client-facing interface to those systems.

---

## Phase 1 — MVP Completion ✓ Complete

**Completed:** 2026-05-03

**What was built:**

### 1. Service Request Form

- `requiredInputs` from the service catalog rendered as labelled `<textarea>` fields
- Acknowledgement checkbox (`required`) — browser-enforced, no JS needed
- `submitServiceRequest` server action in `src/lib/services/actions.ts` — builds `IntakeRequestContract` via `createIntakeRequestContract()`, stores in `requestStore`, redirects to `/corporate/app/requests?submitted=1`
- Submit button uses `service.ctaLabel` and is live (not disabled)
- Scope, pricing, and assumptions displayed above the form for client context

**Not included (intentional):**
- File attachments on requests
- Real-time status updates
- Client-editable requests post-submission
- Payment integration

---

### 2. Documents Section

- `/corporate/app/documents` — table view: filename, matter link, date added, added by, download
- `src/lib/portal/documentSource.ts` — TEMPORARY mock fallback, same pattern as `matterSource.ts`
- `src/lib/portal/mockDocuments.ts` — 3 sample documents across 2 mock matters
- No client upload — lawyer uploads, client downloads
- Shows "Preview data" notice when mock

**Removal checklist:**
1. Delete `mockDocuments.ts` and `documentSource.ts`
2. Call real document API directly from `documents/page.tsx`
3. Remove `isMock` notice

---

### 3. Requests Section

- `/corporate/app/requests` — submitted request list with status badges (Received / In Review / Complete) + service catalog grid
- `src/lib/portal/requestStore.ts` — TEMPORARY in-memory `Map`; persists within a server process, resets on restart
- Success banner shown on `?submitted=1` redirect after form submission
- Empty state links to service catalog

**Removal checklist:**
1. Replace `addRequest` / `getRequests` in `requestStore.ts` with real DB or task tracker API calls
2. Wire `submitServiceRequest` to POST to real intake endpoint
3. Remove `?submitted=1` banner if requests page fetches live status

---

### Phase 1 — Navigation Final State

```
Sidebar
├── Matters          ← live today
├── Documents        ← new, minimal
├── Requests         ← new, list + submit entry point
└── Tools
    └── NDA Tool ↗   ← link only, already exists
```

No dashboard. The sidebar is the navigation. Clients land on Matters. This is correct.

---

## Phase 2 — Workflow Depth

**Goal:** Make the portal the primary communication and coordination surface for ongoing fractional counsel.

**Estimate:** 4–8 weeks after Phase 1 is stable.

---

### Matter Updates / Client Notes

The matter event log today shows admin-generated events only. Add lawyer-posted updates visible to the client.

**Build:**
- `MatterUpdate` type: `{ matterKey, body, addedAt, authorName }`
- Lawyer posts updates via admin tools or minimal lawyer-facing form (see Phase 3)
- Client sees updates in the matter detail view, below the event log
- Simple chronological list — no threading, no reactions

This is the single highest-leverage Phase 2 feature. It turns the matter detail from a status board into a communication thread.

---

### Document Upload (Client-side)

**Build:**
- File upload on the matter detail page: "Upload a document for this matter"
- Accept PDF, DOCX, images — 10 MB limit
- Store in S3/R2 with `matterKey` prefix
- Notify lawyer by email or webhook on upload
- No review or approval flow in portal — lawyer handles it

---

### Service Request Polish

By Phase 2, the intake flow should feel complete end-to-end.

**Build:**
- Email confirmation to client on submission
- Email notification to firm on new request
- Request detail view (not just a list row)
- Ability to attach a document to a service request at submission time

---

### Matter Filtering

If a client has more than 5–6 matters, the flat list breaks down.

**Build:**
- Filter by matterState (Active / Pending / Closed)
- Simple text search against businessKey and matterType
- No pagination until >20 matters per client

The API already supports state filtering via `listCases()` params.

---

## Phase 3 — Intelligence and Differentiation

**Goal:** Make this portal a genuine competitive differentiator — a law firm portal that works like a product.

**Estimate:** 2–3 months after Phase 2. Do not start until Phase 2 is solid.

---

### Client-Initiated Matter Requests

Beyond fixed-fee services, allow clients to open a new fractional counsel matter directly from the portal.

**Build:**
- "Open a new matter" form: describe the need, select a category (Corporate / Contract / Financial Services), optionally attach a context document
- Creates an intake record flagged as "Counsel Matter Request" — not a fixed-fee service
- Lawyer reviews and either accepts into fractional counsel scope or quotes separately

This is the most important Phase 3 feature for ongoing counsel relationships.

---

### Recurring Scope Summary

For fractional counsel clients, the portal should reflect the ongoing relationship — not just individual matters.

**Build:**
- Client-level "Scope" page: current counsel model, active matters in scope, recent activity summary
- Static / lawyer-maintained initially
- Sets up future automation without over-engineering now

This is a positioning feature as much as a functional one — it makes the fractional counsel relationship visible and structured.

---

### Automated Status Nudges

**Build:**
- Matter in "waiting on client" state for more than N days → email reminder
- Document uploaded by lawyer → client email notification
- Request status changed → client email notification
- Use existing email provider + simple cron or webhook triggers
- Email only in Phase 3 — no in-app notifications

---

### Light Admin View (Lawyer-Facing)

**Build:**
- List of all active clients with their matters (read from task tracker)
- Post a MatterUpdate from the portal (text only)
- Upload a document to a matter
- Deliberately minimal — heavy workflow management stays in the task tracker

---

## UX Structure

### Navigation Model

Do not build a dashboard. The sidebar is the navigation. Every section is a flat list.

```
/corporate/app                      → redirects to /matters (or renders matters inline)
/corporate/app/matters              → list of all matters
/corporate/app/matters/[key]        → matter detail + event log + updates
/corporate/app/documents            → document list (across all matters)
/corporate/app/requests             → submitted service requests
/corporate/app/requests/new         → service catalog + request form
/corporate/app/requests/[id]        → request detail
```

### Portal Shell Layout

```
┌─────────────────────────────────────────────┐
│ Levine LLP logo          [User] [Sign out]  │  ← header, fixed
├──────────────┬──────────────────────────────┤
│              │                              │
│  Matters     │   [Section content]          │
│  Documents   │                              │
│  Requests    │                              │
│  ──────────  │                              │
│  NDA Tool ↗  │                              │
│              │                              │
└──────────────┴──────────────────────────────┘
```

On mobile: sidebar collapses to a bottom tab bar (Matters / Docs / Requests). Do not use a hamburger menu.

---

### Key Screens

**Matter List**
- Row: businessKey, matterType, matterState badge, nextActionSummary, responsibleLawyerName
- Group by state: Active first, then Pending, then Closed (collapsible)
- No search until >10 matters per client

**Matter Detail**
- H1: matter type (e.g., "Share Issuance")
- Subheading: businessKey + state badge
- Two columns on desktop: left = next action card + status card; right = event log
- Below (Phase 2): Documents for this matter, Updates from counsel

**Request Form**
- One service per page
- Show: scope, assumptions, pricing, turnaround (already in catalog)
- Form fields from `requiredInputs`
- Acknowledgement checkbox — submit unlocks on check
- Confirmation page after submit, not a redirect to a dashboard

**Document List**
- Table: filename | matter | date | download
- Filter by matter (dropdown)
- No folders, no tags, no previews

---

## Data Model

Core objects and relationships. Annotated with current implementation status.

```
Client
  id (Keycloak subject)
  displayName
  email
  counselModel (Essential / Growth / Strategic)     ← Phase 3
  ├── many Matters
  ├── many Documents
  └── many Requests

Matter (= CaseInstance from LL task tracker)
  businessKey                                        ← live
  matterType                                         ← live
  matterState (Pending / Active / Closed / Archived) ← live
  adminState (13 values)                             ← live
  nextActionSummary                                  ← live
  nextActionOwnerType                                ← live
  responsibleLawyerName                              ← live
  adminEvents[]                                      ← live
  ├── many Documents
  ├── many MatterUpdates                             ← Phase 2
  └── one IntakeRequest (if opened via portal)       ← Phase 1

Document
  id
  matterKey → Matter
  filename
  fileUrl
  addedAt
  addedBy (lawyer or client)                        ← Phase 2 adds client upload

Request (= IntakeRequest)
  id
  serviceSlug → Service                             ← catalog exists
  clientIdentity                                    ← intake.ts defined
  status (Received / In Review / Complete)
  submittedAt
  pricingSnapshot
  inputPayload
  engagementAcknowledgedAt                          ← intake.ts defined

Service
  slug                                              ← live
  title, description                                ← live
  priceType, price, turnaround                      ← live
  scope[], assumptions[]                            ← live
  requiredInputs[]                                  ← live, not yet rendered as form

MatterUpdate                                        ← Phase 2
  id
  matterKey → Matter
  body
  addedAt
  authorName
```

**Key constraints:**
- A Request that is accepted becomes or links to a Matter
- A Document always belongs to a Matter — no free-floating documents
- A Client has exactly one CounselModel (constant for now; stored in Phase 3)

---

## Design Principles

**1. Information, not interface.**
Every screen answers a question the client actually has: What is happening with my matters? What do I need to do? What has been shared with me? If a screen doesn't answer a real question, it shouldn't exist.

**2. State is the primary UI.**
The matter state system is the richest data in the portal. Surface it clearly. The `adminState` → `matterState` projection is correct — use it. Color-coded badges are appropriate and expected.

**3. The lawyer posts, the client reads.**
In Phase 1 and 2, the portal is primarily a read surface for clients. Documents come from the lawyer. Updates come from the lawyer. Clients submit requests and upload supporting documents — that is their primary write path. Do not invert this prematurely.

**4. No empty states that feel like failures.**
A client with no documents should see: "No documents have been shared yet." A client with no active matters should see: "You have no active matters. Open a request to get started." Every empty state is a prompt.

**5. Dense but not cluttered.**
Law firm clients are not afraid of information. A table with 8 columns is appropriate. A dashboard with 6 widgets is not. The difference is structure versus decoration.

**6. Never make the client wonder what happens next.**
Every matter should have a visible next action. If `nextActionOwnerType` is Client, that should be prominent — not buried in a timeline. If it is Lawyer, the client should see: "In progress — your lawyer is working on this."

---

## What to Avoid

**Dashboard as home screen.**
Dashboards are for analytics. This is a workspace. The matter list is the home screen. Resist summary cards, progress rings, and "active matters: 3" stat blocks. They add no value for a client with 2–5 matters.

**In-app messaging.**
Email handles async communication. If a client needs to send a note, they send an email. In-app messaging requires monitoring, maintenance, and a response workflow. The portal is not Slack. Do not build this.

**Client-editable matters.**
Clients should not be able to edit matter details, change states, or update their own records. The task tracker owns matter state. The portal is a view layer, not a control layer. Client mutations introduce data integrity risk.

**Notification overload.**
Keep notifications surgical: document uploaded, request status changed, matter update posted. Do not notify on every event log entry. One meaningful email per meaningful event.

**Building the admin portal before the client portal is stable.**
Resist building lawyer-facing admin tools until Phase 3. Use the task tracker directly for firm-side operations. Add the minimal admin surface (post update, upload document) only when the client-facing product is complete and working.

**Feature parity with legal practice management software.**
Clio, MyCase, and Practice Panther exist. This portal does not compete on feature count. It competes on experience — a clean, branded, opinionated workspace that feels like Levine LLP, not a generic legal SaaS. Every feature decision should ask: does this make the client relationship better, or does it just make the portal bigger?

**Premature onboarding flows.**
Do not build a multi-step client onboarding wizard in Phase 1 or 2. A lawyer creates the account manually. The client receives credentials. They sign in. That is the onboarding.

---

## Immediate Next Actions

In priority order:

1. **Wire the service request form** — render `requiredInputs` as form fields, call `createIntakeRequestContract()`, POST to an endpoint or email the payload. All scaffolding is done.
2. **Remove the disabled submit button** from `app/corporate/services/[slug]/request/page.tsx`.
3. **Build the Documents route** — even against a static mock list. The nav section exists; it just needs a page behind it.
4. **Build the Requests list route** — show submitted requests. If the task tracker creates cases from intake, filter `listCases()`. If not, store intake contracts somewhere queryable.
