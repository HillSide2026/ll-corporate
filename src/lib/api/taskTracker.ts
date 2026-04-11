import { env } from "env.mjs"

export function getTaskTrackerBaseUrl() {
  return env.LL_TASK_TRACKER_API_BASE_URL ? new URL(env.LL_TASK_TRACKER_API_BASE_URL) : null
}
