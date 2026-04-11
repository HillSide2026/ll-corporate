import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

const optionalString = z.preprocess((value) => (value === "" ? undefined : value), z.string().optional())
const optionalUrl = z.preprocess((value) => (value === "" ? undefined : value), z.string().url().optional())

export const env = createEnv({
  server: {
    LL_TASK_TRACKER_API_BASE_URL: optionalUrl,
    KEYCLOAK_ISSUER: optionalUrl,
    KEYCLOAK_CLIENT_ID: optionalString,
    KEYCLOAK_CLIENT_SECRET: optionalString,
  },
  client: {},
  runtimeEnv: {
    LL_TASK_TRACKER_API_BASE_URL: process.env.LL_TASK_TRACKER_API_BASE_URL,
    KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
  },
})
