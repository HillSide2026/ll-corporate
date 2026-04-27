/**
 * TEMPORARY — preview / development fallback only.
 *
 * This data is shown when LL_TASK_TRACKER_API_BASE_URL is not set or when
 * no Keycloak access token is available (e.g. preview mode).
 *
 * To remove once LL-task-tracker is deployed:
 *   1. Delete this file and src/lib/portal/matterSource.ts.
 *   2. In MatterList.tsx, call listCases() directly (restore accessToken: string).
 *   3. In matters/[key]/page.tsx, call getCase() directly (restore null-token guard).
 *   4. Remove the isMock banner from both components.
 */

import type { CaseInstance } from "src/lib/contracts"

export const MOCK_MATTERS: readonly CaseInstance[] = [
  {
    businessKey: "MATTER-2026-001",
    matterType: "Incorporation",
    matterState: "Active",
    adminState: "Active",
    responsibleLawyerName: "M. Levine",
    nextActionOwnerType: "Client",
    nextActionSummary: "Review and execute shareholder agreement for signature.",
    nextActionDueAt: "2026-05-15T00:00:00Z",
    openedAt: "2026-03-05T00:00:00Z",
    adminEvents: [
      {
        eventType: "CASE_ACTIVATED",
        occurredAt: "2026-03-10T10:00:00Z",
        actorName: "M. Levine",
        fromState: "Opened",
        toState: "Active",
      },
      {
        eventType: "CASE_OPENED",
        occurredAt: "2026-03-05T14:30:00Z",
        actorName: "M. Levine",
        fromState: "Ready to Open",
        toState: "Opened",
      },
      {
        eventType: "CASE_CREATED",
        occurredAt: "2026-03-01T09:00:00Z",
        actorName: "M. Levine",
      },
    ],
  },
  {
    businessKey: "MATTER-2026-002",
    matterType: "Share Issuance",
    matterState: "Pending",
    adminState: "Awaiting Engagement",
    responsibleLawyerName: "M. Levine",
    nextActionOwnerType: "Admin",
    nextActionSummary: "Confirm share structure and review client-provided cap table.",
    nextActionDueAt: "2026-05-02T00:00:00Z",
    adminEvents: [
      {
        eventType: "CASE_CREATED",
        occurredAt: "2026-04-20T11:00:00Z",
        actorName: "M. Levine",
      },
    ],
  },
  {
    businessKey: "MATTER-2025-089",
    matterType: "Director / Officer Change",
    matterState: "Active",
    adminState: "Maintenance Client Wait",
    responsibleLawyerName: "M. Levine",
    nextActionOwnerType: "Client",
    nextActionSummary: "Provide signed director resolution.",
    waitingReasonText: "Waiting for client to return executed director change resolutions.",
    nextActionDueAt: "2026-04-30T00:00:00Z",
    openedAt: "2025-11-15T00:00:00Z",
    adminEvents: [
      {
        eventType: "WAIT_STARTED",
        occurredAt: "2026-04-10T09:30:00Z",
        actorName: "M. Levine",
        fromState: "Active",
        toState: "Maintenance Client Wait",
        note: "Resolutions sent to client for execution.",
      },
      {
        eventType: "CASE_ACTIVATED",
        occurredAt: "2025-11-20T10:00:00Z",
        actorName: "M. Levine",
        fromState: "Opened",
        toState: "Active",
      },
      {
        eventType: "CASE_CREATED",
        occurredAt: "2025-11-15T09:00:00Z",
        actorName: "M. Levine",
      },
    ],
  },
]
