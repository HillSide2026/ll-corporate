// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest"

const SITE = "levinellp.sharepoint.com,site-guid,web-guid"
const DRIVE_A = "b!driveA"
const DRIVE_B = "b!driveB"

function stubSharePointEnv() {
  vi.stubEnv("SHAREPOINT_TENANT_ID", "tenant")
  vi.stubEnv("SHAREPOINT_CLIENT_ID", "client")
  vi.stubEnv("SHAREPOINT_CLIENT_SECRET", "secret")
  vi.stubEnv("SHAREPOINT_CLIENTS_SITE_ID", SITE)
}

function tokenResponse() {
  return Response.json({ access_token: "app-token", expires_in: 3600 })
}

describe("SharePoint client library adapter", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("is not configured without all four settings", async () => {
    vi.stubEnv("SHAREPOINT_TENANT_ID", "tenant")
    const { isSharePointConfigured } = await import("./sharepointGraph")
    expect(isSharePointConfigured()).toBe(false)
  })

  it("addresses every call through the Clients site and the named library", async () => {
    stubSharePointEnv()
    const fetchMock = vi.fn(async (url: string) => {
      if (url.startsWith("https://login.microsoftonline.com/")) return tokenResponse()
      return Response.json({
        value: [
          {
            id: "ITEM1",
            name: "Signed SPA.pdf",
            file: { mimeType: "application/pdf" },
            parentReference: { driveId: DRIVE_A },
          },
        ],
      })
    })
    vi.stubGlobal("fetch", fetchMock)

    const { listClientLibraryFiles } = await import("./sharepointGraph")
    const files = await listClientLibraryFiles(DRIVE_A)

    expect(files.map((f) => f.name)).toEqual(["Signed SPA.pdf"])
    const graphUrl = String(fetchMock.mock.calls[1]![0])
    expect(graphUrl).toContain(`/sites/${encodeURIComponent(SITE)}/drives/${encodeURIComponent(DRIVE_A)}/root/children`)
  })

  it("drops items that report a different library", async () => {
    stubSharePointEnv()
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.startsWith("https://login.microsoftonline.com/")) return tokenResponse()
        return Response.json({
          value: [
            { id: "MINE", name: "mine.pdf", file: {}, parentReference: { driveId: DRIVE_A } },
            { id: "THEIRS", name: "theirs.pdf", file: {}, parentReference: { driveId: DRIVE_B } },
          ],
        })
      })
    )

    const { listClientLibraryFiles } = await import("./sharepointGraph")
    const files = await listClientLibraryFiles(DRIVE_A)

    expect(files.map((f) => f.itemId)).toEqual(["MINE"])
  })

  it("returns null when the item is not in the named library", async () => {
    stubSharePointEnv()
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.startsWith("https://login.microsoftonline.com/")) return tokenResponse()
        return new Response(null, { status: 404 })
      })
    )

    const { openClientLibraryFile } = await import("./sharepointGraph")
    expect(await openClientLibraryFile(DRIVE_A, "ITEM_FROM_B")).toBeNull()
  })

  it("refuses an item whose reported library differs, without downloading it", async () => {
    stubSharePointEnv()
    const fetchMock = vi.fn(async (url: string) => {
      if (url.startsWith("https://login.microsoftonline.com/")) return tokenResponse()
      return Response.json({
        id: "ITEM1",
        name: "theirs.pdf",
        file: {},
        parentReference: { driveId: DRIVE_B },
        "@microsoft.graph.downloadUrl": "https://levinellp.sharepoint.com/download/x",
      })
    })
    vi.stubGlobal("fetch", fetchMock)

    const { openClientLibraryFile } = await import("./sharepointGraph")
    expect(await openClientLibraryFile(DRIVE_A, "ITEM1")).toBeNull()
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes("/download/"))).toBe(false)
  })

  it("rejects ids that could change the request path, before any network call", async () => {
    stubSharePointEnv()
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const { openClientLibraryFile, listClientLibraryFiles } = await import("./sharepointGraph")
    await expect(openClientLibraryFile(DRIVE_A, "../../drives/b!driveB/items/X")).rejects.toThrow()
    await expect(listClientLibraryFiles("b!driveA/../b!driveB")).rejects.toThrow()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
