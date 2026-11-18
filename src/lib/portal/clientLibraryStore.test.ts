// @vitest-environment node

/**
 * Who sees a client library (ML1 2026-11-18): the client tier and the teammate
 * tier, unless the firm restricts that client to the client tier only.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"

type Row = { client_key: string; client_name: string; drive_id: string; teammate_access: boolean }

let rows: Row[] = []
const sql = vi.fn(async () => ({ rows }))

vi.mock("./portalDb", () => ({
  isPortalDatabaseConfigured: () => true,
  requirePortalDatabase: () => ({ sql }),
}))

function library(teammateAccess: boolean): Row {
  return { client_key: "CLIENT-A", client_name: "Client A", drive_id: "b!clientA", teammate_access: teammateAccess }
}

describe("client library access by portal tier", () => {
  beforeEach(() => {
    sql.mockClear()
    rows = []
  })

  it("gives the client tier its library", async () => {
    rows = [library(false)]
    const { getClientLibraryForIdentity } = await import("./clientLibraryStore")
    expect(await getClientLibraryForIdentity({ subject: "u1", role: "client" })).toMatchObject({ driveId: "b!clientA" })
  })

  it("gives the teammate tier the library by default", async () => {
    rows = [library(true)]
    const { getClientLibraryForIdentity } = await import("./clientLibraryStore")
    expect(await getClientLibraryForIdentity({ subject: "u2", role: "teammate" })).toMatchObject({
      driveId: "b!clientA",
    })
  })

  it("withholds the library from teammates when the firm restricts the client", async () => {
    rows = [library(false)]
    const { getClientLibraryForIdentity } = await import("./clientLibraryStore")
    expect(await getClientLibraryForIdentity({ subject: "u2", role: "teammate" })).toBeNull()
  })

  it("never gives a prospect or an unknown tier a library, and does not query", async () => {
    rows = [library(true)]
    const { getClientLibraryForIdentity } = await import("./clientLibraryStore")
    expect(await getClientLibraryForIdentity({ subject: "u3", role: "prospect" })).toBeNull()
    expect(await getClientLibraryForIdentity({ subject: "u4" })).toBeNull()
    expect(sql).not.toHaveBeenCalled()
  })

  it("fails closed when a user has more than one active client", async () => {
    rows = [library(true), { ...library(true), client_key: "CLIENT-B", drive_id: "b!clientB" }]
    const { getClientLibraryForIdentity } = await import("./clientLibraryStore")
    expect(await getClientLibraryForIdentity({ subject: "u5", role: "client" })).toBeNull()
  })
})
