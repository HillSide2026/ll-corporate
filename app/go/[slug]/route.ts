import { type NextRequest, NextResponse } from "next/server"

import { getPortalSession } from "src/lib/auth/session"
import { normalizeRef, REF_COOKIE, REF_COOKIE_MAX_AGE } from "src/lib/intake/attribution"
import { findLeadService } from "src/lib/services/leadServices"

/**
 * Service entry link (ML1 2026-10-22): /go/<service>?ref=<source>&name=&email=
 * A landing page (GHL, the newsletter, a partner) sends a lead straight to one service.
 * Signed-in leads go to that service's conflict check; everyone else to sign-up, with
 * the service carried through and their name and email filled in.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = findLeadService(slug)
  if (!service) return NextResponse.redirect(new URL("/intake", request.url), 307)

  const session = await getPortalSession().catch(() => null)
  let target: URL
  if (session?.identity.email) {
    target = new URL(`/intake/start/${service.slug}`, request.url)
  } else {
    target = new URL("/sign-up", request.url)
    target.searchParams.set("service", service.slug)
    for (const key of ["name", "email"] as const) {
      const value = request.nextUrl.searchParams.get(key)?.trim().slice(0, 200)
      if (value) target.searchParams.set(key, value)
    }
  }

  const response = NextResponse.redirect(target, 307)
  // The first source seen wins, as in middleware.ts
  const ref = normalizeRef(request.nextUrl.searchParams.get("ref"))
  if (ref && !request.cookies.get(REF_COOKIE)) {
    response.cookies.set(REF_COOKIE, ref, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: REF_COOKIE_MAX_AGE,
    })
  }
  return response
}
