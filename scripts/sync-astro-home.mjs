import { existsSync, mkdirSync, copyFileSync, cpSync, rmSync } from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const astroAppDir = path.join(repoRoot, "new website")
const astroDistDir = path.join(astroAppDir, "dist")
const astroIndexPath = path.join(astroDistDir, "index.html")
const astroAssetsDir = path.join(astroDistDir, "_astro")
const publicAstroHomeDir = path.join(repoRoot, "public", "astro-home")
const publicAstroIndexPath = path.join(publicAstroHomeDir, "index.html")
const publicAstroAssetsDir = path.join(repoRoot, "public", "_astro")

function ensurePathExists(targetPath, description) {
  if (!existsSync(targetPath)) {
    throw new Error(`${description} does not exist: ${targetPath}`)
  }
}

ensurePathExists(astroAppDir, "Astro app directory")

console.log("Building Astro homepage...")
execFileSync("npm", ["run", "build"], {
  cwd: astroAppDir,
  stdio: "inherit",
})

ensurePathExists(astroIndexPath, "Astro build homepage")
ensurePathExists(astroAssetsDir, "Astro build assets directory")

mkdirSync(publicAstroHomeDir, { recursive: true })
copyFileSync(astroIndexPath, publicAstroIndexPath)

rmSync(publicAstroAssetsDir, { force: true, recursive: true })
mkdirSync(publicAstroAssetsDir, { recursive: true })
cpSync(astroAssetsDir, publicAstroAssetsDir, { recursive: true })

console.log("Synced Astro homepage to public/astro-home/index.html")
console.log("Synced Astro assets to public/_astro")
