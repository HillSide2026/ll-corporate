/**
 * Fills the per-client placeholders in a .docx engagement letter template.
 *
 * A .docx is a ZIP archive; only word/document.xml is rewritten, every other entry is
 * copied byte for byte. The ZIP handling is a minimal reader and writer on node:zlib
 * (stored and deflated entries, no ZIP64), enough for Word files. Server-only.
 *
 * Word splits visible text across many <w:t> runs, so a placeholder such as
 * {Client Surname} may span several runs. Replacement works on the concatenated text of
 * each paragraph and writes the result back into the runs it came from: the replacement
 * text goes into the run where the placeholder starts, so formatting elsewhere is kept.
 */

import { deflateRawSync, inflateRawSync } from "node:zlib"

// ── ZIP ────────────────────────────────────────────────────────────────────────

type ZipEntry = {
  name: string
  method: number
  crc: number
  compressedSize: number
  uncompressedSize: number
  compressed: Buffer
  modTime: number
  modDate: number
  flags: number
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

export function crc32(data: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) crc = CRC_TABLE[(crc ^ data[i]!) & 0xff]! ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

export function readZip(buffer: Buffer): ZipEntry[] {
  // End of central directory record: last 22+ bytes, signature 0x06054b50
  let eocd = -1
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65_557); i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocd = i
      break
    }
  }
  if (eocd < 0) throw new Error("Not a ZIP file.")
  const count = buffer.readUInt16LE(eocd + 10)
  let offset = buffer.readUInt32LE(eocd + 16)

  const entries: ZipEntry[] = []
  for (let i = 0; i < count; i++) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error("Corrupt ZIP central directory.")
    const flags = buffer.readUInt16LE(offset + 8)
    const method = buffer.readUInt16LE(offset + 10)
    const modTime = buffer.readUInt16LE(offset + 12)
    const modDate = buffer.readUInt16LE(offset + 14)
    const crc = buffer.readUInt32LE(offset + 16)
    const compressedSize = buffer.readUInt32LE(offset + 20)
    const uncompressedSize = buffer.readUInt32LE(offset + 24)
    const nameLength = buffer.readUInt16LE(offset + 28)
    const extraLength = buffer.readUInt16LE(offset + 30)
    const commentLength = buffer.readUInt16LE(offset + 32)
    const localOffset = buffer.readUInt32LE(offset + 42)
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString("utf8")

    if (buffer.readUInt32LE(localOffset) !== 0x04034b50) throw new Error("Corrupt ZIP local header.")
    const localName = buffer.readUInt16LE(localOffset + 26)
    const localExtra = buffer.readUInt16LE(localOffset + 28)
    const dataStart = localOffset + 30 + localName + localExtra
    entries.push({
      name,
      method,
      crc,
      compressedSize,
      uncompressedSize,
      compressed: buffer.subarray(dataStart, dataStart + compressedSize),
      modTime,
      modDate,
      flags: flags & ~0x0008, // sizes are written in the headers, so no data descriptor
    })
    offset += 46 + nameLength + extraLength + commentLength
  }
  return entries
}

export function entryData(entry: ZipEntry): Buffer {
  if (entry.method === 0) return Buffer.from(entry.compressed)
  if (entry.method === 8) return inflateRawSync(entry.compressed)
  throw new Error(`Unsupported ZIP compression method ${entry.method} for ${entry.name}.`)
}

export function replaceEntry(entry: ZipEntry, data: Buffer): ZipEntry {
  const compressed = deflateRawSync(data)
  return {
    ...entry,
    method: 8,
    crc: crc32(data),
    compressedSize: compressed.length,
    uncompressedSize: data.length,
    compressed,
  }
}

export function writeZip(entries: ZipEntry[]): Buffer {
  const locals: Buffer[] = []
  const centrals: Buffer[] = []
  let offset = 0
  for (const e of entries) {
    const name = Buffer.from(e.name, "utf8")
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(e.flags, 6)
    local.writeUInt16LE(e.method, 8)
    local.writeUInt16LE(e.modTime, 10)
    local.writeUInt16LE(e.modDate, 12)
    local.writeUInt32LE(e.crc, 14)
    local.writeUInt32LE(e.compressedSize, 18)
    local.writeUInt32LE(e.uncompressedSize, 22)
    local.writeUInt16LE(name.length, 26)
    local.writeUInt16LE(0, 28)
    locals.push(local, name, e.compressed)

    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(e.flags, 8)
    central.writeUInt16LE(e.method, 10)
    central.writeUInt16LE(e.modTime, 12)
    central.writeUInt16LE(e.modDate, 14)
    central.writeUInt32LE(e.crc, 16)
    central.writeUInt32LE(e.compressedSize, 20)
    central.writeUInt32LE(e.uncompressedSize, 24)
    central.writeUInt16LE(name.length, 28)
    central.writeUInt32LE(offset, 42)
    centrals.push(central, name)
    offset += 30 + name.length + e.compressedSize
  }
  const centralSize = centrals.reduce((n, b) => n + b.length, 0)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(entries.length, 8)
  end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(centralSize, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, ...centrals, end])
}

// ── Placeholders ───────────────────────────────────────────────────────────────

function xmlEscape(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function xmlUnescape(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
}

const TEXT_NODE = /(<w:t(?:\s[^>]*)?>)([^<]*)(<\/w:t>)/g

/**
 * Applies non-overlapping [start, end, replacement] edits, given on the paragraph's plain
 * text, to its <w:t> runs. Each replacement goes into the run holding the edit's first
 * character; the rest of the edited span is removed from whichever runs held it.
 */
function editParagraph(paragraph: string, edits: Array<[number, number, string]>): string {
  if (edits.length === 0) return paragraph
  const texts = Array.from(paragraph.matchAll(TEXT_NODE)).map((m) => xmlUnescape(m[2]!))
  const owner: number[] = []
  const starts: number[] = []
  texts.forEach((t, i) => {
    starts.push(owner.length)
    for (let k = 0; k < t.length; k++) owner.push(i)
  })

  const out = texts.map(() => "")
  const sorted = [...edits].sort((x, y) => x[0] - y[0])
  let e = 0
  for (let p = 0; p < owner.length; ) {
    const edit = sorted[e]
    if (edit && edit[0] === p) {
      const node = owner[p]!
      out[node] = (out[node] ?? "") + edit[2]
      p = edit[1]
      e++
    } else {
      const node = owner[p]!
      out[node] = (out[node] ?? "") + texts[node]![p - starts[node]!]
      p++
    }
  }

  let i = 0
  return paragraph.replace(TEXT_NODE, (_all, open: string, _text: string, close: string) => {
    const text = out[i++]!
    const opener =
      text !== text.trim() && !open.includes("xml:space") ? open.replace("<w:t", '<w:t xml:space="preserve"') : open
    return `${opener}${xmlEscape(text)}${close}`
  })
}

export type PlaceholderValues = Record<string, string>

/**
 * Replaces {Name} placeholders with values, and resolves optional [ ... ] segments named
 * in `optional`: kept (brackets removed) when `keep` is true, deleted otherwise.
 * Placeholders without a value are left as they are.
 */
export function fillDocumentXml(
  xml: string,
  values: PlaceholderValues,
  optional: Array<{ text: string; keep: boolean }> = []
): string {
  return xml.replace(/<w:p[ >][\s\S]*?<\/w:p>/g, (paragraph) => {
    const plain = Array.from(paragraph.matchAll(TEXT_NODE))
      .map((m) => xmlUnescape(m[2]!))
      .join("")
    if (!plain.includes("{") && !plain.includes("[")) return paragraph

    const edits: Array<[number, number, string]> = []
    const taken: Array<[number, number]> = []
    const overlaps = (s: number, e: number) => taken.some(([a, b]) => s < b && e > a)

    for (const segment of optional) {
      let at = plain.indexOf(segment.text)
      while (at >= 0) {
        const end = at + segment.text.length
        if (!overlaps(at, end)) {
          const inner = segment.text.replace(/^\[/, "").replace(/\]$/, "")
          edits.push([at, end, segment.keep ? fillPlain(inner, values) : ""])
          taken.push([at, end])
        }
        at = plain.indexOf(segment.text, end)
      }
    }
    for (const m of Array.from(plain.matchAll(/\{([^{}]{1,80})\}/g))) {
      const value = values[m[1]!]
      const start = m.index!
      const end = start + m[0].length
      if (value !== undefined && !overlaps(start, end)) edits.push([start, end, value])
    }
    return editParagraph(paragraph, edits)
  })
}

function fillPlain(text: string, values: PlaceholderValues): string {
  return text.replace(/\{([^{}]{1,80})\}/g, (all, name: string) => values[name] ?? all)
}

/** Fills a .docx template and returns the new file. */
export function fillDocx(
  template: Buffer,
  values: PlaceholderValues,
  optional: Array<{ text: string; keep: boolean }> = []
): Buffer {
  const entries = readZip(template)
  const index = entries.findIndex((e) => e.name === "word/document.xml")
  if (index < 0) throw new Error("Not a Word document: word/document.xml is missing.")
  const xml = entryData(entries[index]!).toString("utf8")
  entries[index] = replaceEntry(entries[index]!, Buffer.from(fillDocumentXml(xml, values, optional), "utf8"))
  return writeZip(entries)
}

/** The text of each paragraph in word/document.xml (inserted text included, deleted text not). */
function paragraphTexts(xml: string): string[] {
  return Array.from(xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)).map((m) =>
    Array.from(m[0].matchAll(TEXT_NODE))
      .map((t) => xmlUnescape(t[2]!))
      .join("")
  )
}

function documentXmlOf(docx: Buffer): string {
  const entry = readZip(docx).find((e) => e.name === "word/document.xml")
  if (!entry) throw new Error("Not a Word document: word/document.xml is missing.")
  return entryData(entry).toString("utf8")
}

/**
 * Every {curly bracket} placeholder still in the document, in order, without repeats.
 * Optional [square bracket] text is not a placeholder; a {placeholder} inside it still is.
 */
export function documentPlaceholders(docx: Buffer): string[] {
  const found: string[] = []
  for (const text of paragraphTexts(documentXmlOf(docx))) {
    for (const m of Array.from(text.matchAll(/\{[^{}]{1,200}\}/g))) {
      if (!found.includes(m[0])) found.push(m[0])
    }
  }
  return found
}

/** Whether the document still carries tracked changes (insertions, deletions or moves). */
export function hasTrackedChanges(docx: Buffer): boolean {
  return /<w:(ins|del|moveFrom|moveTo)\s/.test(documentXmlOf(docx))
}
