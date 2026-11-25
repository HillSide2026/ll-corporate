// @vitest-environment node
import { describe, expect, it } from "vitest"

import { crc32, entryData, fillDocumentXml, fillDocx, readZip, replaceEntry, writeZip } from "./docxTemplate"

function paragraph(...runs: string[]): string {
  return `<w:p><w:pPr/>${runs.map((t) => `<w:r><w:rPr><w:b/></w:rPr><w:t>${t}</w:t></w:r>`).join("")}</w:p>`
}

function textOf(xml: string): string[] {
  return Array.from(xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)).map((p) =>
    Array.from(p[0].matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g))
      .map((m) => m[1])
      .join("")
  )
}

function docx(documentXml: string): Buffer {
  const base = { method: 0, modTime: 0, modDate: 0x21, flags: 0 }
  const make = (name: string, text: string) => {
    const data = Buffer.from(text, "utf8")
    return replaceEntry(
      { ...base, name, crc: crc32(data), compressedSize: 0, uncompressedSize: 0, compressed: data },
      data
    )
  }
  return writeZip([
    make("[Content_Types].xml", "<Types/>"),
    make("word/document.xml", `<w:document><w:body>${documentXml}</w:body></w:document>`),
  ])
}

describe("crc32", () => {
  it("matches the standard check value", () => {
    expect(crc32(Buffer.from("123456789"))).toBe(0xcbf43926)
  })
})

describe("fillDocumentXml", () => {
  it("replaces a placeholder inside one run", () => {
    expect(
      textOf(
        fillDocumentXml(paragraph("Dear {Salutation} {Client Surname}"), { Salutation: "Ms", "Client Surname": "Ng" })
      )
    ).toEqual(["Dear Ms Ng"])
  })

  it("replaces a placeholder split across runs and keeps the runs", () => {
    const out = fillDocumentXml(paragraph("Name: {Client ", "First Name", "} end"), { "Client First Name": "Ada" })
    expect(textOf(out)).toEqual(["Name: Ada end"])
    expect(out.match(/<w:r>/g)).toHaveLength(3)
  })

  it("leaves placeholders without a value", () => {
    expect(textOf(fillDocumentXml(paragraph("Ref {Matter Number}"), {}))).toEqual(["Ref {Matter Number}"])
  })

  it("escapes replacement text", () => {
    expect(fillDocumentXml(paragraph("{Corporation Name}"), { "Corporation Name": "A & B <Ltd>" })).toContain(
      "A &amp; B &lt;Ltd&gt;"
    )
  })

  it("keeps or drops an optional segment", () => {
    const xml = paragraph("{Client First Name}", "[, {Title}, {Corporation Name}]")
    const values = { "Client First Name": "Ada", Title: "CEO", "Corporation Name": "Acme Inc." }
    const optional = "[, {Title}, {Corporation Name}]"
    expect(textOf(fillDocumentXml(xml, values, [{ text: optional, keep: true }]))).toEqual(["Ada, CEO, Acme Inc."])
    expect(textOf(fillDocumentXml(xml, { "Client First Name": "Ada" }, [{ text: optional, keep: false }]))).toEqual([
      "Ada",
    ])
  })

  it("marks spaces at the edge of a run as preserved", () => {
    expect(fillDocumentXml(paragraph("{A}"), { A: " x " })).toContain('<w:t xml:space="preserve"> x </w:t>')
  })
})

describe("fillDocx", () => {
  it("rewrites word/document.xml and keeps the other entries", () => {
    const out = fillDocx(docx(paragraph("Dear {Salutation}")), { Salutation: "Dr" })
    const entries = readZip(out)
    expect(entries.map((e) => e.name)).toEqual(["[Content_Types].xml", "word/document.xml"])
    expect(entryData(entries[0]!).toString()).toBe("<Types/>")
    const xml = entryData(entries[1]!).toString()
    expect(textOf(xml)).toEqual(["Dear Dr"])
    expect(entries[1]!.crc).toBe(crc32(Buffer.from(xml)))
  })

  it("rejects a file that is not a Word document", () => {
    expect(() => fillDocx(Buffer.from("not a zip"), {})).toThrow()
  })
})
