import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

const optionalString = z.preprocess((value) => (value === "" ? undefined : value), z.string().optional())
const optionalUrl = z.preprocess((value) => (value === "" ? undefined : value), z.string().url().optional())
const optionalBoolean = z.preprocess((value) => {
  if (value === "" || value === undefined) {
    return undefined
  }

  return value === "true"
}, z.boolean().optional())

export const env = createEnv({
  server: {
    LL_TASK_TRACKER_API_BASE_URL: optionalUrl,
    AUTH_SECRET: optionalString,
    AUTH_TRUST_HOST: optionalBoolean,
    AUTH_URL: optionalUrl,
    AUTH_KEYCLOAK_ISSUER: optionalUrl,
    AUTH_KEYCLOAK_ID: optionalString,
    AUTH_KEYCLOAK_SECRET: optionalString,
    LL_CORPORATE_APP_BASE_URL: optionalUrl,
    LL_CORPORATE_POST_LOGIN_REDIRECT_URL: optionalUrl,
    LL_CORPORATE_LOGOUT_REDIRECT_URL: optionalUrl,
    LL_CORPORATE_ENABLE_PREVIEW_ACCESS: optionalBoolean,
    PORTAL_CLIENT_EMAIL: optionalString,
    PORTAL_CLIENT_PASSWORD: optionalString,
    PORTAL_ADMIN_TOKEN: optionalString,
    PORTAL_DATABASE_URL: optionalString,
    POSTGRES_URL: optionalString,
    POSTGRES_URL_NON_POOLING: optionalString,
    BLOB_READ_WRITE_TOKEN: optionalString,
    PORTAL_ENABLE_MOCK_FALLBACK: optionalBoolean,
    PORTAL_ACCESS_REQUEST_API_BASE_URL: optionalUrl,
    PORTAL_ACCESS_REQUEST_API_TOKEN: optionalString,
    PORTAL_ACCESS_REQUEST_WEBHOOK_URL: optionalUrl,
    PORTAL_ACCESS_REQUEST_WEBHOOK_SECRET: optionalString,
    PORTAL_NOTIFICATION_WEBHOOK_URL: optionalUrl,
    PORTAL_NOTIFICATION_WEBHOOK_TOKEN: optionalString,
  },
  client: {},
  runtimeEnv: {
    LL_TASK_TRACKER_API_BASE_URL: process.env.LL_TASK_TRACKER_API_BASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    AUTH_URL: process.env.AUTH_URL,
    AUTH_KEYCLOAK_ISSUER: process.env.AUTH_KEYCLOAK_ISSUER,
    AUTH_KEYCLOAK_ID: process.env.AUTH_KEYCLOAK_ID,
    AUTH_KEYCLOAK_SECRET: process.env.AUTH_KEYCLOAK_SECRET,
    LL_CORPORATE_APP_BASE_URL: process.env.LL_CORPORATE_APP_BASE_URL,
    LL_CORPORATE_POST_LOGIN_REDIRECT_URL: process.env.LL_CORPORATE_POST_LOGIN_REDIRECT_URL,
    LL_CORPORATE_LOGOUT_REDIRECT_URL: process.env.LL_CORPORATE_LOGOUT_REDIRECT_URL,
    LL_CORPORATE_ENABLE_PREVIEW_ACCESS: process.env.LL_CORPORATE_ENABLE_PREVIEW_ACCESS,
    PORTAL_CLIENT_EMAIL: process.env.PORTAL_CLIENT_EMAIL,
    PORTAL_CLIENT_PASSWORD: process.env.PORTAL_CLIENT_PASSWORD,
    PORTAL_ADMIN_TOKEN: process.env.PORTAL_ADMIN_TOKEN,
    PORTAL_DATABASE_URL: process.env.PORTAL_DATABASE_URL,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    PORTAL_ENABLE_MOCK_FALLBACK: process.env.PORTAL_ENABLE_MOCK_FALLBACK,
    PORTAL_ACCESS_REQUEST_API_BASE_URL: process.env.PORTAL_ACCESS_REQUEST_API_BASE_URL,
    PORTAL_ACCESS_REQUEST_API_TOKEN: process.env.PORTAL_ACCESS_REQUEST_API_TOKEN,
    PORTAL_ACCESS_REQUEST_WEBHOOK_URL: process.env.PORTAL_ACCESS_REQUEST_WEBHOOK_URL,
    PORTAL_ACCESS_REQUEST_WEBHOOK_SECRET: process.env.PORTAL_ACCESS_REQUEST_WEBHOOK_SECRET,
    PORTAL_NOTIFICATION_WEBHOOK_URL: process.env.PORTAL_NOTIFICATION_WEBHOOK_URL,
    PORTAL_NOTIFICATION_WEBHOOK_TOKEN: process.env.PORTAL_NOTIFICATION_WEBHOOK_TOKEN,
  },
})
