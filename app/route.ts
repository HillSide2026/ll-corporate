import { readFile } from "node:fs/promises"
import path from "node:path"

export const runtime = "nodejs"

const astroHomePath = path.join(process.cwd(), "public", "astro-home", "index.html")

export async function GET() {
  const html = await readFile(astroHomePath, "utf8")

  return new Response(html, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": "text/html; charset=utf-8",
    },
  })
}
