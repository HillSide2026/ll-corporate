import { type NextRequest, NextResponse } from "next/server"

/**
 * The portal opens on sign-in. The public marketing homepage is withdrawn
 * (ML1 2026-10-20): public pages belong on levine-law.ca under POL-051, not on
 * the portal. Temporary redirect, so the decision can be revisited.
 */
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/sign-in", request.url), 307)
}
