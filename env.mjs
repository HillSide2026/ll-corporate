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
  },
})
