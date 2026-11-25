// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  crc32,
  documentPlaceholders,
  entryData,
  hasTrackedChanges,
  readZip,
  replaceEntry,
  writeZip,
} from "./docxTemplate"

const graph = vi.hoisted(() => ({
  configured: true,
  download: vi.fn(),
  upload: vi.fn(),
  setFields: vi.fn(),
}))

vi.mock("src/lib/api/sharepointGraph", () => {
  class SharePointApiError extends Error {
    constructor(
      public readonly status: number,
      public readonly endpoint: string
    ) {
      super(`HTTP ${status}`)
    }
  }
  return {
    SharePointApiError,
    isSharePointConfigured: () => graph.configured,
    getOnboardingDriveId: async () => "drive-1",
    downloadOnboardingFile: graph.download,
    uploadNewOnboardingFile: graph.upload,
    setOnboardingFileFields: graph.setFields,
    listOnboardingFolder: vi.fn(),
  }
})

import { findLeadService } from "src/lib/services/leadServices"
import type { OnboardingDetails } from "./onboardingStore"
import { normalizeMatterNumber, prepareRelease, releasedFileName, releaseEngagementLetter } from "./releaseLetter"

function docx(paragraphs: string[]): Buffer {
  const base = { method: 0, modTime: 0, modDate: 0x21, flags: 0 }
  const make = (name: string, text: string) => {
    const data = Buffer.from(text, "utf8")
    return replaceEntry(
      { ...base, name, crc: crc32(data), compressedSize: 0, uncompressedSize: 0, compressed: data },
      data
    )
  }
  const body = paragraphs.map((p) => `<w:p>${p}</w:p>`).join("")
  return writeZip([
    make("[Content_Types].xml", "<Types/>"),
    make("word/document.xml", `<w:document><w:body>${body}</w:body></w:document>`),
  ])
}
const run = (t: string) => `<w:r><w:t>${t}</w:t></w:r>`
const xmlOf = (file: Buffer) => entryData(readZip(file).find((e) => e.name === "word/document.xml")!).toString("utf8")

const finished = () =>
  docx([
    run("Firm Reference: {Matter ") + run("Number}"),
    run("You agree to pay a $1,990 fee."),
    run("[one call of up to 45 minutes]"),
  ])

const details: OnboardingDetails = {
  id: "OB-1",
  conflictRequestId: "CR-1",
  userId: "user-a",
  signingCapacity: "corporation",
  salutation: "Ms",
  clientFirstName: "Ada",
  clientSurname: "Ng",
  clientEmail: "ada@example.com",
  corporationName: "Acme Inc.",
  signerTitle: "CEO",
  signingAuthority: true,
  instructingOfficerName: "Ada Ng",
  instructingOfficerTitle: "CEO",
  instructingOfficerEmail: "ada@example.com",
  sharepointStatus: "uploaded",
  sharepointItemId: "item-draft",
  sharepointFileName: "Incorporation Engagement Letter - Acme Inc. - 2026-11-25 LLS.docx",
  sharepointError: null,
  matterNumber: null,
  releasedAt: null,
  releasedItemId: null,
  releasedFileName: null,
  releaseError: null,
  createdAt: "2026-11-25T00:00:00Z",
}

describe("normalizeMatterNumber", () => {
  it("accepts Clio display numbers", () => {
    expect(normalizeMatterNumber(" 24-256-00001 ")).toBe("24-256-00001")
    expect(normalizeMatterNumber("26-1615-00003")).toBe("26-1615-00003")
  })
  it("rejects anything else", () => {
    for (const bad of ["", "24-256-1", "2024-256-00001", "24-25-00001", "24-25678-00001", "abc"]) {
      expect(normalizeMatterNumber(bad)).toBeNull()
    }
  })
})

describe("releasedFileName", () => {
  it("adds Released before LLS", () => {
    expect(releasedFileName("Incorporation Engagement Letter - Acme Inc. - 2026-11-25 LLS.docx")).toBe(
      "Incorporation Engagement Letter - Acme Inc. - 2026-11-25 - Released LLS.docx"
    )
  })
  it("keeps LLS when the draft name lacks it", () => {
    expect(releasedFileName("Letter.docx")).toBe("Letter - Released LLS.docx")
  })
})

describe("documentPlaceholders and hasTrackedChanges", () => {
  it("finds placeholders split across runs, once each, and ignores square brackets", () => {
    const file = docx([run("{Key ") + run("assumptions} and {$1,990}"), run("{$1,990} [optional {45}]")])
    expect(documentPlaceholders(file)).toEqual(["{Key assumptions}", "{$1,990}", "{45}"])
  })
  it("ignores deleted text and sees tracked changes", () => {
    const file = docx([`<w:del w:id="1" w:author="LLS"><w:r><w:delText>{gone}</w:delText></w:r></w:del>`])
    expect(documentPlaceholders(file)).toEqual([])
    expect(hasTrackedChanges(file)).toBe(true)
    expect(hasTrackedChanges(finished())).toBe(false)
  })
})

describe("prepareRelease", () => {
  it("fills the matter number and passes a finished letter", () => {
    const check = prepareRelease(finished(), "24-256-00001")
    expect(check.ok).toBe(true)
    if (check.ok) expect(xmlOf(check.letter)).toContain("24-256-00001")
  })
  it("refuses while placeholders are left, listing them", () => {
    const check = prepareRelease(
      docx([run("{Matter Number}"), run("pay a {$1,990} fee for {key assumptions}")]),
      "24-256-00001"
    )
    expect(check).toEqual({
      ok: false,
      reason: "Complete these in the Draft in SharePoint, then retry: {$1,990}, {key assumptions}",
    })
  })
  it("refuses while tracked changes are left", () => {
    const check = prepareRelease(
      docx([`<w:ins w:id="1" w:author="LLS"><w:r><w:t>new</w:t></w:r></w:ins>`]),
      "24-256-00001"
    )
    expect(check.ok).toBe(false)
  })
})

describe("releaseEngagementLetter", () => {
  const service = findLeadService("incorporation")!

  beforeEach(() => {
    graph.configured = true
    graph.download.mockReset()
    graph.upload.mockReset()
    graph.setFields.mockReset()
  })

  it("uploads a new Current copy and leaves the Draft alone", async () => {
    graph.download.mockResolvedValue(finished())
    graph.upload.mockResolvedValue("item-released")
    const result = await releaseEngagementLetter(service, details, "24-256-00001")
    expect(result).toEqual({
      status: "released",
      itemId: "item-released",
      fileName: "Incorporation Engagement Letter - Acme Inc. - 2026-11-25 - Released LLS.docx",
    })
    expect(graph.download).toHaveBeenCalledWith("drive-1", "item-draft")
    const [, folder, name, content] = graph.upload.mock.calls[0]!
    expect(folder).toBe("Incorporation")
    expect(name).toContain("Released LLS")
    expect(xmlOf(content as Buffer)).toContain("24-256-00001")
    expect(graph.setFields).toHaveBeenCalledWith(
      "drive-1",
      "item-released",
      expect.objectContaining({ ResourceStatus: "Current", ClientName: "Acme Inc.", InstructingOfficer: "Ada Ng" })
    )
  })

  it("refuses with the placeholders left, and uploads nothing", async () => {
    graph.download.mockResolvedValue(docx([run("{Matter Number} {final deliverable}")]))
    const result = await releaseEngagementLetter(service, details, "24-256-00001")
    expect(result).toEqual({
      status: "refused",
      reason: "Complete these in the Draft in SharePoint, then retry: {final deliverable}",
    })
    expect(graph.upload).not.toHaveBeenCalled()
  })

  it("refuses a second release and a missing draft", async () => {
    expect(
      (await releaseEngagementLetter(service, { ...details, releasedAt: "2026-11-25T01:00:00Z" }, "24-256-00001"))
        .status
    ).toBe("refused")
    expect(
      (await releaseEngagementLetter(service, { ...details, sharepointStatus: "no_template" }, "24-256-00001")).status
    ).toBe("refused")
    expect(graph.download).not.toHaveBeenCalled()
  })

  it("reports a name clash instead of overwriting", async () => {
    const { SharePointApiError } = await import("src/lib/api/sharepointGraph")
    graph.download.mockResolvedValue(finished())
    graph.upload.mockRejectedValue(new SharePointApiError(409, "upload onboarding file"))
    const result = await releaseEngagementLetter(service, details, "24-256-00001")
    expect(result).toEqual({ status: "error", reason: "A released letter with this name is already in the folder." })
  })
})
