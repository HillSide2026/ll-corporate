import { findLeadService } from "src/lib/services/leadServices"

/** Where to land after signing in: the service a lead arrived for by an entry link, if any. */
export function afterSignInPath(serviceSlug: FormDataEntryValue | null | undefined): string {
  const service = findLeadService(typeof serviceSlug === "string" ? serviceSlug : undefined)
  return service ? `/auth/after-sign-in?service=${service.slug}` : "/auth/after-sign-in"
}
