/**
 * Read-only Microsoft Graph adapter for client document libraries on the
 * SharePoint Clients site (/sites/Clients), LLP-055 ruling ML1 2026-11-18.
 *
 * Auth: the LL-Client Portal Entra app (client credentials). Its Sites.Selected
 * grant covers the whole Clients site, so Microsoft does not separate one
 * client's library from another's. This adapter and the callers in
 * src/lib/portal/ do:
 *
 * - every call is addressed /sites/{site}/drives/{drive}/items/{item}, so an
 *   item outside the named library (or a library outside the Clients site)
 *   returns 404 from Graph;
 * - the drive is never taken from the browser, only from the caller's mapping
 *   (src/lib/portal/clientLibraryStore.ts);
 * - returned items are checked again against the drive asked for;
 * - SharePoint URLs, including download URLs, never leave the server.
 *
 * Server-only. Never import from client components.
 */

import { z } from "zod"

import { env } from "env.mjs"

const GRAPH_BASE = "https://graph.microsoft.com/v1.0"
const GRAPH_SCOPE = "https://graph.microsoft.com/.default"

/** Drive and item ids are opaque Graph ids: letters, digits, '!', '_' and '-'. */
const GRAPH_ID_PATTERN = /^[A-Za-z0-9!_-]{1,200}$/

/** Limits on one library listing, so a large library cannot stall a page. */
const MAX_FOLDER_DEPTH = 5
const MAX_FILES = 1000

export class SharePointNotConfiguredError extends Error {
  constructor() {
    super("SharePoint client library access is not configured.")
    this.name = "SharePointNotConfiguredError"
  }
}

export class SharePointApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly endpoint: string
  ) {
    super(`Microsoft Graph ${endpoint} returned HTTP ${status}`)
    this.name = "SharePointApiError"
  }
}

export function isSharePointConfigured(): boolean {
  return Boolean(
    env.SHAREPOINT_TENANT_ID &&
    env.SHAREPOINT_CLIENT_ID &&
    env.SHAREPOINT_CLIENT_SECRET &&
    env.SHAREPOINT_CLIENTS_SITE_ID
  )
}

export function isValidGraphId(value: string): boolean {
  return GRAPH_ID_PATTERN.test(value)
}

// ── Token ──────────────────────────────────────────────────────────────────────

const TokenResponseSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.number(),
})

let cachedToken: { value: string; expiresAt: number } | null = null

/** Test hook: forget the cached app token. */
export function resetSharePointTokenCache(): void {
  cachedToken = null
}

async function getAppToken(): Promise<string> {
  if (!isSharePointConfigured()) throw new SharePointNotConfiguredError()
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value

  const endpoint = `https://login.microsoftonline.com/${encodeURIComponent(env.SHAREPOINT_TENANT_ID!)}/oauth2/v2.0/token`
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.SHAREPOINT_CLIENT_ID!,
      client_secret: env.SHAREPOINT_CLIENT_SECRET!,
      scope: GRAPH_SCOPE,
    }).toString(),
    cache: "no-store",
  })
  if (!response.ok) throw new SharePointApiError(response.status, "token")

  const parsed = TokenResponseSchema.parse(await response.json())
  cachedToken = { value: parsed.access_token, expiresAt: Date.now() + parsed.expires_in * 1000 }
  return parsed.access_token
}

// ── Item shapes ────────────────────────────────────────────────────────────────

const DriveItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number().optional(),
  lastModifiedDateTime: z.string().optional(),
  file: z.object({ mimeType: z.string().optional() }).optional(),
  folder: z.object({ childCount: z.number().optional() }).optional(),
  parentReference: z.object({ driveId: z.string().optional() }).optional(),
  "@microsoft.graph.downloadUrl": z.string().optional(),
})

const DriveItemPageSchema = z.object({
  value: z.array(DriveItemSchema),
  "@odata.nextLink": z.string().optional(),
})

type DriveItem = z.infer<typeof DriveItemSchema>

/** A file in a client library, as the portal may use it. No SharePoint URLs. */
export type ClientLibraryFile = {
  itemId: string
  driveId: string
  name: string
  /** Folder path inside the library, "" at the root. */
  folderPath: string
  sizeBytes?: number
  contentType?: string
  lastModifiedAt?: string
}

const ITEM_SELECT = "id,name,size,lastModifiedDateTime,file,folder,parentReference"

function itemsBase(driveId: string): string {
  return `${GRAPH_BASE}/sites/${encodeURIComponent(env.SHAREPOINT_CLIENTS_SITE_ID!)}/drives/${encodeURIComponent(driveId)}`
}

async function graphGet(url: string, endpoint: string): Promise<unknown | null> {
  if (!url.startsWith(`${GRAPH_BASE}/`)) throw new Error(`Refusing non-Graph URL for ${endpoint}`)
  const token = await getAppToken()
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  })
  if (response.status === 404) return null
  if (!response.ok) throw new SharePointApiError(response.status, endpoint)
  return response.json()
}

function assertIds(driveId: string, itemId?: string): void {
  if (!isValidGraphId(driveId)) throw new Error("Invalid SharePoint drive id.")
  if (itemId !== undefined && !isValidGraphId(itemId)) throw new Error("Invalid SharePoint item id.")
}

function belongsToDrive(item: DriveItem, driveId: string): boolean {
  // Graph omits parentReference.driveId on some responses; when present it must match.
  return item.parentReference?.driveId === undefined || item.parentReference.driveId === driveId
}

function toClientLibraryFile(item: DriveItem, driveId: string, folderPath: string): ClientLibraryFile {
  return {
    itemId: item.id,
    driveId,
    name: item.name,
    folderPath,
    sizeBytes: item.size,
    contentType: item.file?.mimeType,
    lastModifiedAt: item.lastModifiedDateTime,
  }
}

// ── Reads ──────────────────────────────────────────────────────────────────────

/**
 * Lists the files in one client library, walking folders up to MAX_FOLDER_DEPTH.
 * Returns [] when the library is not on the Clients site.
 */
export async function listClientLibraryFiles(driveId: string): Promise<ClientLibraryFile[]> {
  assertIds(driveId)

  const files: ClientLibraryFile[] = []
  const queue: Array<{ url: string; folderPath: string; depth: number }> = [
    {
      url: `${itemsBase(driveId)}/root/children?$select=${ITEM_SELECT}&$top=200`,
      folderPath: "",
      depth: 0,
    },
  ]

  while (queue.length > 0 && files.length < MAX_FILES) {
    const next = queue.shift()!
    let url: string | undefined = next.url

    while (url && files.length < MAX_FILES) {
      const body = await graphGet(url, "list library")
      if (body === null) return files
      const page = DriveItemPageSchema.parse(body)

      for (const item of page.value) {
        if (!belongsToDrive(item, driveId)) continue
        if (item.folder) {
          if (next.depth + 1 <= MAX_FOLDER_DEPTH && isValidGraphId(item.id)) {
            queue.push({
              url: `${itemsBase(driveId)}/items/${encodeURIComponent(item.id)}/children?$select=${ITEM_SELECT}&$top=200`,
              folderPath: next.folderPath ? `${next.folderPath}/${item.name}` : item.name,
              depth: next.depth + 1,
            })
          }
        } else if (item.file) {
          files.push(toClientLibraryFile(item, driveId, next.folderPath))
          if (files.length >= MAX_FILES) break
        }
      }

      url = page["@odata.nextLink"]
    }
  }

  return files
}

/**
 * Opens one file in one client library for streaming to the browser.
 * Returns null when the item is not a file in that library on the Clients site.
 */
export async function openClientLibraryFile(
  driveId: string,
  itemId: string
): Promise<{ file: ClientLibraryFile; stream: ReadableStream<Uint8Array> } | null> {
  assertIds(driveId, itemId)

  const body = await graphGet(
    `${itemsBase(driveId)}/items/${encodeURIComponent(itemId)}?$select=${ITEM_SELECT},@microsoft.graph.downloadUrl`,
    "get item"
  )
  if (body === null) return null

  const item = DriveItemSchema.parse(body)
  if (!item.file || item.id !== itemId || !belongsToDrive(item, driveId)) return null

  const downloadUrl = item["@microsoft.graph.downloadUrl"]
  if (!downloadUrl || !isSharePointDownloadUrl(downloadUrl)) return null

  // Pre-authenticated, short-lived URL: fetched here, never sent to the browser.
  const response = await fetch(downloadUrl, { cache: "no-store" })
  if (!response.ok || !response.body) throw new SharePointApiError(response.status, "download")

  return { file: toClientLibraryFile(item, driveId, ""), stream: response.body }
}

function isSharePointDownloadUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && url.hostname.endsWith(".sharepoint.com")
  } catch {
    return false
  }
}

// ── Onboarding library (Clients site) ──────────────────────────────────────────
//
// Writes for the portal's engagement letter step (LLP-055, ML1 2026-11-18: the data goes
// to SharePoint). Confined to one library on the Clients site, the "Onboarding" library,
// addressed by name through the configured site. Uploads never replace an existing file
// (conflictBehavior=fail). Needs the LL-Client Portal app's Sites.Selected grant on the
// Clients site with write access; without it Graph returns 401 or 403.

export const ONBOARDING_LIBRARY_NAME = "Onboarding"

const DriveListSchema = z.object({ value: z.array(z.object({ id: z.string(), name: z.string() })) })

const FolderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastModifiedDateTime: z.string().optional(),
  file: z.object({ mimeType: z.string().optional() }).optional(),
  listItem: z.object({ fields: z.record(z.unknown()).optional() }).optional(),
})

export type OnboardingFolderItem = {
  itemId: string
  name: string
  lastModifiedAt?: string
  isFile: boolean
  fields: Record<string, unknown>
}

function siteBase(): string {
  return `${GRAPH_BASE}/sites/${encodeURIComponent(env.SHAREPOINT_CLIENTS_SITE_ID!)}`
}

function encodePath(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

async function graphSend(
  url: string,
  endpoint: string,
  init: { method: string; body?: BodyInit; contentType?: string; accept?: string }
): Promise<Response> {
  if (!url.startsWith(`${GRAPH_BASE}/`)) throw new Error(`Refusing non-Graph URL for ${endpoint}`)
  const token = await getAppToken()
  const response = await fetch(url, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: init.accept ?? "application/json",
      ...(init.contentType ? { "Content-Type": init.contentType } : {}),
    },
    body: init.body,
    cache: "no-store",
  })
  if (!response.ok) throw new SharePointApiError(response.status, endpoint)
  return response
}

let cachedOnboardingDrive: string | null = null

/** Test hook: forget the cached Onboarding library drive id. */
export function resetOnboardingDriveCache(): void {
  cachedOnboardingDrive = null
}

/** The Onboarding library's drive id on the Clients site, or null if it is not there. */
export async function getOnboardingDriveId(): Promise<string | null> {
  if (cachedOnboardingDrive) return cachedOnboardingDrive
  const response = await graphSend(`${siteBase()}/drives?$select=id,name`, "list drives", { method: "GET" })
  const drives = DriveListSchema.parse(await response.json())
  const drive = drives.value.find((d) => d.name === ONBOARDING_LIBRARY_NAME)
  if (!drive || !isValidGraphId(drive.id)) return null
  cachedOnboardingDrive = drive.id
  return drive.id
}

/** Files and folders directly inside one Onboarding library folder, with their column values. */
export async function listOnboardingFolder(driveId: string, folderPath: string): Promise<OnboardingFolderItem[]> {
  assertIds(driveId)
  const items: OnboardingFolderItem[] = []
  let url: string | undefined =
    `${siteBase()}/drives/${encodeURIComponent(driveId)}/root:/${encodePath(folderPath)}:/children` +
    `?$select=id,name,lastModifiedDateTime,file&$expand=listItem($expand=fields)&$top=200`
  while (url) {
    let response: Response
    try {
      response = await graphSend(url, "list onboarding folder", { method: "GET" })
    } catch (err) {
      if (err instanceof SharePointApiError && err.status === 404) return items
      throw err
    }
    const body = (await response.json()) as { value?: unknown[]; "@odata.nextLink"?: string }
    for (const raw of body.value ?? []) {
      const item = FolderItemSchema.parse(raw)
      items.push({
        itemId: item.id,
        name: item.name,
        lastModifiedAt: item.lastModifiedDateTime,
        isFile: Boolean(item.file),
        fields: item.listItem?.fields ?? {},
      })
    }
    url = body["@odata.nextLink"]
  }
  return items
}

/** Downloads one file from the Onboarding library. */
export async function downloadOnboardingFile(driveId: string, itemId: string): Promise<Buffer> {
  assertIds(driveId, itemId)
  const response = await graphSend(
    `${siteBase()}/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}/content`,
    "download onboarding file",
    { method: "GET", accept: "*/*" }
  )
  return Buffer.from(await response.arrayBuffer())
}

/** Uploads a new file; fails with HTTP 409 if a file of that name is already in the folder. */
export async function uploadNewOnboardingFile(
  driveId: string,
  folderPath: string,
  fileName: string,
  content: Buffer
): Promise<string> {
  assertIds(driveId)
  const response = await graphSend(
    `${siteBase()}/drives/${encodeURIComponent(driveId)}/root:/${encodePath(`${folderPath}/${fileName}`)}:/content` +
      `?@microsoft.graph.conflictBehavior=fail`,
    "upload onboarding file",
    {
      method: "PUT",
      body: new Uint8Array(content),
      contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
  )
  const body = z.object({ id: z.string() }).parse(await response.json())
  return body.id
}

/** Sets library column values on a file the portal uploaded. */
export async function setOnboardingFileFields(
  driveId: string,
  itemId: string,
  fields: Record<string, string>
): Promise<void> {
  assertIds(driveId, itemId)
  await graphSend(
    `${siteBase()}/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}/listItem/fields`,
    "set onboarding fields",
    { method: "PATCH", body: JSON.stringify(fields), contentType: "application/json" }
  )
}

const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  webUrl: z.string().optional(),
  listItem: z.object({ fields: z.record(z.unknown()).optional() }).optional(),
})

export type OnboardingItem = { itemId: string; name: string; webUrl: string | null; fields: Record<string, unknown> }

/** One Onboarding library file: name, SharePoint link (admin pages only) and column values. */
export async function getOnboardingItem(driveId: string, itemId: string): Promise<OnboardingItem> {
  assertIds(driveId, itemId)
  const response = await graphSend(
    `${siteBase()}/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}` +
      `?$select=id,name,webUrl&$expand=listItem($expand=fields)`,
    "get onboarding item",
    { method: "GET" }
  )
  const item = ItemSchema.parse(await response.json())
  return { itemId: item.id, name: item.name, webUrl: item.webUrl ?? null, fields: item.listItem?.fields ?? {} }
}
