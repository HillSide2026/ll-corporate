/**
 * Lead source attribution (ML1 2026-10-22). Any portal link can carry ?ref=<code>
 * (a partner's referral link, the acquisition opportunity newsletter). The code is
 * remembered in a cookie through sign-up and stored on the lead's requests, so the
 * scorecard can compare sources.
 */
export const REF_COOKIE = "ll_ref"
export const REF_COOKIE_MAX_AGE = 60 * 60 * 24 * 90

/** Lower-case letters, digits and hyphens, at most 40 characters; anything else is dropped. */
export function normalizeRef(value: string | null | undefined): string | null {
  const ref = String(value ?? "")
    .trim()
    .toLowerCase()
  return /^[a-z0-9][a-z0-9-]{0,39}$/.test(ref) ? ref : null
}
