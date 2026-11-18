// @vitest-environment node

/**
 * Cross-client test (LLP-055, ML1 2026-11-18). One LL-Client Portal grant covers
 * every client library on the Clients site, so the portal itself must keep each
 * user to their own client's library. These tests fail if a user can list or
 * download a file from another client's library.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"

const DRIVE_A = "b!clientA"
const DRIVE_B = "b!clientB"

const LIBRARY_FILES: Record<string, Array<{ itemId: string; name: string }>> = {
  [DRIVE_A]: [{ itemId: "A_ITEM", name: "Client A SPA.pdf" }],
  [DRIVE_B]: [{ itemId: "B_ITEM", name: "Client B shareholder agreement.pdf" }],
}

const MEMBERSHIPS: Record<string, { clientKey: string; clientName: string; driveId: string } | null> = {
  "user-a": { clientKey: "CLIENT-A", clientName: "Client A", driveId: DRIVE_A },
  "user-b": { clientKey: "CLIENT-B", clientName: "Client B", driveId: DRIVE_B },
  "user-none": null,
}

const listClientLibraryFiles = vi.fn(async (driveId: string) =>
  (LIBRARY_FILES[driveId] ?? []).map((f) => ({ ...f, driveId, folderPath: "" }))
)
const openClientLibraryFile = vi.fn(async (driveId: string, itemId: string) => {
  const file = (LIBRARY_FILES[driveId] ?? []).find((f) => f.itemId === itemId)
  if (!file) return null
  return {
    file: { ...file, driveId, folderPath: "" },
    stream: new Response(`contents of ${file.name}`).body!,
  }
})

let currentSubject = "user-a"

vi.mock("src/lib/api/sharepointGraph", () => ({
  isSharePointConfigured: () => true,
  isValidGraphId: (value: string) => /^[A-Za-z0-9!_-]{1,200}$/.test(value),
  listClientLibraryFiles,
  openClientLibraryFile,
}))

vi.mock("./clientLibraryStore", () => ({
  getClientLibraryForIdentity: vi.fn(async ({ subject }: { subject: string }) => MEMBERSHIPS[subject] ?? null),
}))

vi.mock("src/lib/portal/clientLibraryStore", () => ({
  getClientLibraryForIdentity: vi.fn(async ({ subject }: { subject: string }) => MEMBERSHIPS[subject] ?? null),
}))

vi.mock("./portalDb", () => ({
  isPortalDatabaseConfigured: () => true,
  isPortalMockFallbackEnabled: () => false,
  requirePortalDatabase: () => ({ sql: async () => ({ rows: [] }) }),
}))

vi.mock("src/lib/portal/auditLog", () => ({ recordAuditEvent: vi.fn(async () => undefined) }))
vi.mock("./auditLog", () => ({ recordAuditEvent: vi.fn(async () => undefined) }))
vi.mock("src/lib/portal/features", () => ({ isMattersAndDocumentsEnabled: () => true }))
vi.mock("src/lib/auth/adminAuth", () => ({ getAdminSession: async () => ({ isAdmin: false, isPreview: false }) }))
vi.mock("src/lib/auth/session", () => ({
  getPortalSession: async () => ({ identity: { subject: currentSubject, role: "client" } }),
  getAccessToken: async () => null,
  isWorkspacePortalSession: () => true,
}))

describe("client library isolation", () => {
  beforeEach(() => {
    listClientLibraryFiles.mockClear()
    openClientLibraryFile.mockClear()
    currentSubject = "user-a"
  })

  it("lists only the signed-in user's own client library", async () => {
    const { getDocumentList } = await import("./documentSource")

    const { documents } = await getDocumentList({ subject: "user-a" })

    expect(documents.map((d) => d.filename)).toEqual(["Client A SPA.pdf"])
    expect(listClientLibraryFiles.mock.calls.map(([driveId]) => driveId)).toEqual([DRIVE_A])
  })

  it("shows no library documents to a user with no client membership", async () => {
    const { getDocumentList } = await import("./documentSource")

    const { documents } = await getDocumentList({ subject: "user-none" })

    expect(documents).toEqual([])
    expect(listClientLibraryFiles).not.toHaveBeenCalled()
  })

  it("will not download another client's file, even given its item id", async () => {
    const { GET } = await import("app/corporate/api/documents/[id]/download/route")

    const response = await GET(new Request("https://portal.test") as never, {
      params: Promise.resolve({ id: "cl-B_ITEM" }),
    })

    expect(response.status).toBe(404)
    expect(openClientLibraryFile.mock.calls.map(([driveId]) => driveId)).toEqual([DRIVE_A])
    expect(openClientLibraryFile.mock.calls.some(([driveId]) => driveId === DRIVE_B)).toBe(false)
  })

  it("downloads the user's own client file", async () => {
    const { GET } = await import("app/corporate/api/documents/[id]/download/route")

    const response = await GET(new Request("https://portal.test") as never, {
      params: Promise.resolve({ id: "cl-A_ITEM" }),
    })

    expect(response.status).toBe(200)
    expect(await response.text()).toBe("contents of Client A SPA.pdf")
    expect(response.headers.get("Cache-Control")).toBe("private, no-store")
  })

  it("gives a user with no client membership nothing, whatever id they send", async () => {
    currentSubject = "user-none"
    const { GET } = await import("app/corporate/api/documents/[id]/download/route")

    const response = await GET(new Request("https://portal.test") as never, {
      params: Promise.resolve({ id: "cl-A_ITEM" }),
    })

    expect(response.status).toBe(404)
    expect(openClientLibraryFile).not.toHaveBeenCalled()
  })
})
