const checks = []

function addCheck(name, ok, detail, fix) {
  checks.push({ name, ok, detail, fix })
}

function value(name) {
  const raw = process.env[name]
  return raw && raw.trim() ? raw.trim() : undefined
}

function isTrue(name) {
  return value(name) === "true"
}

function isUrl(raw) {
  if (!raw) return false
  try {
    new URL(raw)
    return true
  } catch {
    return false
  }
}

const authUrl = value("AUTH_URL")
const postLoginRedirect = value("LL_CORPORATE_POST_LOGIN_REDIRECT_URL")
const logoutRedirect = value("LL_CORPORATE_LOGOUT_REDIRECT_URL")
const taskTrackerUrl = value("LL_TASK_TRACKER_API_BASE_URL")
const portalDbUrl = value("PORTAL_DATABASE_URL") ?? value("POSTGRES_URL")
const usersDbUrl = value("POSTGRES_URL")

addCheck(
  "AUTH_SECRET",
  Boolean(value("AUTH_SECRET") && value("AUTH_SECRET").length >= 32),
  "Auth.js requires a stable 32+ character secret.",
  "Set AUTH_SECRET to a generated 32+ character production secret.",
)

addCheck(
  "AUTH_TRUST_HOST",
  isTrue("AUTH_TRUST_HOST"),
  "Auth.js must trust forwarded host/protocol behind the production proxy.",
  "Set AUTH_TRUST_HOST=true.",
)

addCheck(
  "AUTH_URL",
  isUrl(authUrl) && authUrl.endsWith("/corporate/api/auth"),
  "Auth URL must match the current Auth.js base path.",
  "Set AUTH_URL=https://clients.levine-law.ca/corporate/api/auth.",
)

addCheck(
  "Keycloak OIDC",
  isUrl(value("AUTH_KEYCLOAK_ISSUER")) && Boolean(value("AUTH_KEYCLOAK_ID")) && Boolean(value("AUTH_KEYCLOAK_SECRET")),
  "SSO requires issuer, client ID, and client secret.",
  "Set AUTH_KEYCLOAK_ISSUER, AUTH_KEYCLOAK_ID, and AUTH_KEYCLOAK_SECRET.",
)

addCheck(
  "Post-login redirect",
  !postLoginRedirect || isUrl(postLoginRedirect),
  "Optional absolute post-login redirect must be a valid URL when set.",
  "Unset LL_CORPORATE_POST_LOGIN_REDIRECT_URL or set a valid https://clients.levine-law.ca/corporate/app URL.",
)

addCheck(
  "Logout redirect",
  !logoutRedirect || isUrl(logoutRedirect),
  "Optional absolute logout redirect must be a valid URL when set.",
  "Unset LL_CORPORATE_LOGOUT_REDIRECT_URL or set a valid https://clients.levine-law.ca/sign-in URL.",
)

addCheck(
  "LL-task-tracker API",
  isUrl(taskTrackerUrl),
  "Live matters require the deployed task-tracker API.",
  "Set LL_TASK_TRACKER_API_BASE_URL to the production task-tracker API origin.",
)

addCheck(
  "Users database",
  Boolean(usersDbUrl),
  "Self-service sign-up and credentials auth require POSTGRES_URL.",
  "Provision Postgres, set POSTGRES_URL, then run pnpm db:migrate.",
)

addCheck(
  "Portal database",
  Boolean(portalDbUrl),
  "Portal requests, documents, matter updates, and audit logs require durable storage.",
  "Set PORTAL_DATABASE_URL or POSTGRES_URL, then run pnpm db:migrate.",
)

addCheck(
  "Vercel Blob",
  Boolean(value("BLOB_READ_WRITE_TOKEN")),
  "Document upload/download requires private Blob storage.",
  "Provision Vercel Blob and set BLOB_READ_WRITE_TOKEN.",
)

addCheck(
  "Mock fallback disabled",
  !isTrue("PORTAL_ENABLE_MOCK_FALLBACK") && !isTrue("LL_CORPORATE_ENABLE_PREVIEW_ACCESS"),
  "Production should not expose preview or mock portal data.",
  "Set PORTAL_ENABLE_MOCK_FALLBACK=false and leave LL_CORPORATE_ENABLE_PREVIEW_ACCESS unset/false.",
)

let failed = 0
for (const check of checks) {
  const marker = check.ok ? "OK" : "FAIL"
  console.log(`[${marker}] ${check.name}: ${check.detail}`)
  if (!check.ok) {
    failed += 1
    console.log(`       ${check.fix}`)
  }
}

if (failed > 0) {
  console.error(`\nProduction readiness failed: ${failed} blocker${failed === 1 ? "" : "s"} remaining.`)
  process.exit(1)
}

console.log("\nProduction readiness checks passed.")
