# Engagement letter details and the SharePoint Onboarding library

Branch `feat/onboarding-sharepoint`, 2026-11-24. Not merged, not deployed. LLP-055 rulings
of ML1 2026-11-18: one engagement agreement per service; the portal's form asks for
everything that service's template needs; the data goes to SharePoint; details are
collected after the conflict check clears.

## What changed

1. **Letter of intent offers draw on COMM-022** (ML1 2026-11-18). `leadServices.ts` gains
   `offerKey` (unique, stable) and `serviceName` (registry name). `code` is now the registry
   code and is shared by the two letter of intent offers, so the portal identifies offers by
   `offerKey`. The keys keep the values already stored in `intake_conflict_requests`
   (`service_code`, `final_service_code`): CORP-001, CORP-002, CORP-003, CORP-009,
   MA-LOI-PREP, MA-LOI-REVIEW. No stored row changes. Notifications to the CRM now carry the
   registry code. Founders' Agreement is recorded as the Founders' Agreement level of
   CORP-002 Shareholder Agreements (ML1 2026-11-24).
2. **Engagement letter details form.** On `/intake/start/<slug>`, once the conflict check is
   cleared, the lead gives: who signs (personally or for a corporation), salutation, first
   name, surname, email for delivery, and for a corporation its legal name, the signer's
   title and confirmation of authority to bind it; optionally a separate instructing officer
   (name, title, email), otherwise the signer. Fields from the draft list
   `Onboarding Form 2026-10-09.docx`; firm-side fields on that list (matter number, fee,
   scope, service, responsible lawyer) are not asked. No matter details. Recorded once per
   conflict request in the new table `intake_onboarding_details`.
3. **Draft letter in SharePoint.** On submit, the portal finds the offer's template in the
   Clients site Onboarding library folder mapped in `ONBOARDING_FOLDERS`
   (`src/lib/intake/onboardingLibrary.ts`): Onboarding Document = Engagement Letter,
   Agreement Template = Portal, Resource Status = Current, and Offer blank or equal to the
   offer. It fills the per-client placeholders ({Day} {Month} {Year} in Toronto time,
   {Client First Name}, {Client Surname}, {Salutation}, {Service Name}, {Title},
   {Corporation Name}, {CORPORATION NAME}, and the optional addressee segment
   `[, {Title}, {Corporation Name}]`), leaves {Matter Number} and every offer-level
   placeholder as they are, and uploads a new file (never replaces one) to the same folder:
   `<Offer> Engagement Letter - <Client> - <date> LLS.docx`, tagged Service Code, Service
   Name, Offer, Portal Slug, Onboarding Document = Engagement Letter, Resource Status =
   Draft, Agreement Template = Portal, Client Name, Instructing Officer, Signing Party.
   Nothing is signed, sent or paid.
4. **Outcome recorded and alerted.** `intake_onboarding_details.sharepoint_status` is one of
   `uploaded`, `no_template` (no Current template; no letter made), `not_configured`,
   `not_permitted` (Graph 401 or 403: the app has no write grant) or `error`, with the
   reason. Each submission sends `intake_onboarding_details_submitted` to
   `PORTAL_NOTIFICATION_WEBHOOK_URL` with that status (names, service and outcome only). A
   SharePoint failure never blocks the lead.

## Step 3: MJL finishes and releases the letter (ML1 2026-11-25)

- **Admin page** `/corporate/admin/onboarding` (admin lock; linked from the admin home as
  "Engagement letters"): every submission with offer, client, signer and capacity,
  instructing officer, the SharePoint outcome and a link to the filed Draft (SharePoint
  links appear on admin pages only). The conflicts queue now shows each request's letter
  status too.
- **Release:** on a submission with a filed Draft, MJL enters the Clio matter number
  (`NN-NNNN-NNNNN`, for example 24-256-00001) and clicks "Approve and release to client"
  (`src/lib/intake/releaseActions.ts`, `releaseLetter.ts`). The Draft is downloaded,
  `{Matter Number}` filled, and the result uploaded as a NEW file in the same folder
  (conflictBehavior=fail), named like the Draft with "- Released LLS", tagged as the Draft
  plus Resource Status = Current. The Draft is not changed. The release is only ever MJL's
  click; nothing releases on its own. Disabled in local admin preview.
- **Refusals:** a release is refused, with the reason shown on the admin page, if the letter
  still has any `{curly bracket}` placeholder after the matter number is filled (they are
  listed; fix the Draft in SharePoint and retry) or still has tracked changes. Optional
  `[square bracket]` text does not block. A name clash (409) is reported, not overwritten.
- **Client:** once released, `/intake/start/<slug>` shows "Engagement letter issued" with a
  download link to `/intake/engagement-letter/<slug>`, which serves the released file
  server-side, found only through the signed-in user's own cleared request.
- **Alert:** `intake_engagement_letter_released` on the webhook (names, service, outcome).
- **Records:** `matter_number`, `released_at`, `released_item_id`, `released_file_name`,
  `release_error` on `intake_onboarding_details` (step 3 block at the end of the schema
  file, `add column if not exists`).
- Signing and payment are still not built (ML1's decision, portal or email, is open).

## Before it works

1. **Database:** run the new `intake_onboarding_details` block and the step 3 `alter table`
   block at the end of `docs/portal-stage3-schema.sql` on the portal database (`pnpm db:migrate` runs the whole
   file; every statement is `if not exists`). Not run anywhere yet. Until it is, the form
   shows "We could not save your details right now" and the rest of the page works.
2. **Entra grant:** the LL-Client Portal app needs write access on the Clients site
   (Sites.Selected, role `write`). The existing grant is used for reads; whether it already
   includes write was not checked. Without write every submission is recorded as
   `not_permitted`.
3. **Environment (Vercel):** `SHAREPOINT_TENANT_ID`, `SHAREPOINT_CLIENT_ID`,
   `SHAREPOINT_CLIENT_SECRET`, `SHAREPOINT_CLIENTS_SITE_ID` (already used by the client
   library reads) and, for alerts, `PORTAL_NOTIFICATION_WEBHOOK_URL` (and
   `PORTAL_NOTIFICATION_WEBHOOK_TOKEN` if the receiver needs one). Not set by this branch.
4. **Templates:** each offer's folder needs a template tagged Engagement Letter / Portal /
   Current. A Draft template is never used. If the folders move (for example under
   "CORP-002 Shareholder Agreements"), update `ONBOARDING_FOLDERS`.

## Not done

- Signing and payment are unchanged (ML1's decision is open).
