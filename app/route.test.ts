import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"

import { GET } from "./route"

describe("GET /", () => {
  it("sends visitors to sign-in instead of serving a public homepage", () => {
    const response = GET(new NextRequest("https://portal.levine-law.ca/"))

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe("https://portal.levine-law.ca/sign-in")
  })
})
