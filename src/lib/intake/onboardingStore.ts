import { requirePortalDatabase } from "src/lib/portal/portalDb"
import type { OnboardingDetailsInput, Salutation, SigningCapacity } from "./onboardingDetails"

/** Whether the draft engagement letter reached the Clients site Onboarding library. */
export type SharePointStatus = "pending" | "uploaded" | "no_template" | "not_configured" | "not_permitted" | "error"

export type OnboardingDetails = OnboardingDetailsInput & {
  id: string
  conflictRequestId: string
  userId: string
  sharepointStatus: SharePointStatus
  sharepointItemId: string | null
  sharepointFileName: string | null
  sharepointError: string | null
  /** Step 3: set when MJL releases the finished letter to the client. */
  matterNumber: string | null
  releasedAt: string | null
  releasedItemId: string | null
  releasedFileName: string | null
  /** Why the last release attempt was refused or failed (for example, placeholders left). */
  releaseError: string | null
  createdAt: string
}

type OnboardingRow = {
  id: string
  conflict_request_id: string
  user_id: string
  signing_capacity: SigningCapacity
  salutation: Salutation
  client_first_name: string
  client_surname: string
  client_email: string
  corporation_name: string | null
  signer_title: string | null
  signing_authority: boolean
  instructing_officer_name: string
  instructing_officer_title: string | null
  instructing_officer_email: string | null
  sharepoint_status: SharePointStatus
  sharepoint_item_id: string | null
  sharepoint_file_name: string | null
  sharepoint_error: string | null
  matter_number?: string | null
  released_at?: Date | string | null
  released_item_id?: string | null
  released_file_name?: string | null
  release_error?: string | null
  created_at: Date | string
}

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null
  return value instanceof Date ? value.toISOString() : value
}

function mapRow(row: OnboardingRow): OnboardingDetails {
  return {
    id: row.id,
    conflictRequestId: row.conflict_request_id,
    userId: row.user_id,
    signingCapacity: row.signing_capacity,
    salutation: row.salutation,
    clientFirstName: row.client_first_name,
    clientSurname: row.client_surname,
    clientEmail: row.client_email,
    corporationName: row.corporation_name,
    signerTitle: row.signer_title,
    signingAuthority: row.signing_authority,
    instructingOfficerName: row.instructing_officer_name,
    instructingOfficerTitle: row.instructing_officer_title,
    instructingOfficerEmail: row.instructing_officer_email,
    sharepointStatus: row.sharepoint_status,
    sharepointItemId: row.sharepoint_item_id,
    sharepointFileName: row.sharepoint_file_name,
    sharepointError: row.sharepoint_error,
    matterNumber: row.matter_number ?? null,
    releasedAt: toIso(row.released_at),
    releasedItemId: row.released_item_id ?? null,
    releasedFileName: row.released_file_name ?? null,
    releaseError: row.release_error ?? null,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  }
}

export async function getOnboardingDetails(conflictRequestId: string): Promise<OnboardingDetails | null> {
  const db = requirePortalDatabase()
  const result = await db.sql<OnboardingRow>`
    select * from intake_onboarding_details where conflict_request_id = ${conflictRequestId}
  `
  return result.rows[0] ? mapRow(result.rows[0]) : null
}

/** Records the details once per conflict request; returns null if already recorded. */
export async function createOnboardingDetails(input: {
  conflictRequestId: string
  userId: string
  details: OnboardingDetailsInput
}): Promise<OnboardingDetails | null> {
  const db = requirePortalDatabase()
  const d = input.details
  const id = `OB-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const result = await db.sql<OnboardingRow>`
    insert into intake_onboarding_details (
      id, conflict_request_id, user_id, signing_capacity, salutation,
      client_first_name, client_surname, client_email, corporation_name, signer_title,
      signing_authority, instructing_officer_name, instructing_officer_title, instructing_officer_email
    )
    values (
      ${id}, ${input.conflictRequestId}, ${input.userId}, ${d.signingCapacity}, ${d.salutation},
      ${d.clientFirstName}, ${d.clientSurname}, ${d.clientEmail}, ${d.corporationName}, ${d.signerTitle},
      ${d.signingAuthority}, ${d.instructingOfficerName}, ${d.instructingOfficerTitle}, ${d.instructingOfficerEmail}
    )
    on conflict (conflict_request_id) do nothing
    returning *
  `
  return result.rows[0] ? mapRow(result.rows[0]) : null
}

export async function recordSharePointResult(
  id: string,
  result: { status: SharePointStatus; itemId?: string | null; fileName?: string | null; error?: string | null }
): Promise<void> {
  const db = requirePortalDatabase()
  await db.sql`
    update intake_onboarding_details
    set sharepoint_status = ${result.status}, sharepoint_item_id = ${result.itemId ?? null},
        sharepoint_file_name = ${result.fileName ?? null}, sharepoint_error = ${result.error?.slice(0, 500) ?? null},
        updated_at = now()
    where id = ${id}
  `
}

/** Every onboarding submission, newest first (admin pages). */
export async function listOnboardingDetails(): Promise<OnboardingDetails[]> {
  const db = requirePortalDatabase()
  const result = await db.sql<OnboardingRow>`
    select * from intake_onboarding_details order by created_at desc limit 500
  `
  return result.rows.map(mapRow)
}

export async function getOnboardingDetailsById(id: string): Promise<OnboardingDetails | null> {
  const db = requirePortalDatabase()
  const result = await db.sql<OnboardingRow>`select * from intake_onboarding_details where id = ${id}`
  return result.rows[0] ? mapRow(result.rows[0]) : null
}

/** Records a release. Only the first release counts; returns null if already released. */
export async function recordRelease(
  id: string,
  release: { matterNumber: string; itemId: string; fileName: string }
): Promise<OnboardingDetails | null> {
  const db = requirePortalDatabase()
  const result = await db.sql<OnboardingRow>`
    update intake_onboarding_details
    set matter_number = ${release.matterNumber}, released_at = now(), released_item_id = ${release.itemId},
        released_file_name = ${release.fileName}, release_error = null, updated_at = now()
    where id = ${id} and released_at is null
    returning *
  `
  return result.rows[0] ? mapRow(result.rows[0]) : null
}

/** Records why a release was refused or failed, for the admin page. */
export async function recordReleaseError(id: string, error: string): Promise<void> {
  const db = requirePortalDatabase()
  await db.sql`
    update intake_onboarding_details
    set release_error = ${error.slice(0, 1000)}, updated_at = now()
    where id = ${id} and released_at is null
  `
}
