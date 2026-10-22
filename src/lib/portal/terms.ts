/**
 * Portal Terms of Use (ML1 2026-10-22: every portal page links to them, sign-up
 * requires agreement, and the confirmation email must state that the user agreed).
 *
 * TERMS_VERSION is recorded against each user who agrees. When ML1 changes the
 * terms, change TERMS_VERSION and TERMS_TEXT together.
 */
export const TERMS_URL = "/terms"

/** null until ML1 supplies the approved text. Go-live blocker (LLP-055 BUILD_STATUS). */
export const TERMS_VERSION: string | null = null

export const TERMS_TEXT: Array<{ heading: string; body: string[] }> = []
