import { type NextRequest, NextResponse } from "next/server"

import { normalizeRef, REF_COOKIE, REF_COOKIE_MAX_AGE } from "src/lib/intake/attribution"

/** Remembers ?ref=<code> so a lead's source survives sign-up. The first source seen wins. */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
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

export const config = {
  matcher: ["/((?!_next/|api/|corporate/api/|favicon|logos/|team/).*)"],
}
