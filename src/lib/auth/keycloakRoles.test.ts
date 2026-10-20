import { describe, expect, it } from "vitest"

import { portalRoleFromKeycloakRoles, readKeycloakRoles } from "./keycloakRoles"

function fakeAccessToken(claims: object): string {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url")
  return `${encode({ alg: "none" })}.${encode(claims)}.signature`
}

describe("readKeycloakRoles", () => {
  it("merges realm roles with this client's roles", () => {
    const token = fakeAccessToken({
      realm_access: { roles: ["portal_admin", "offline_access"] },
      resource_access: { "ll-corporate": { roles: ["portal_client"] }, other: { roles: ["ignored"] } },
    })

    expect(readKeycloakRoles(token, "ll-corporate")).toEqual(["portal_admin", "offline_access", "portal_client"])
  })

  it("returns no roles for a malformed token", () => {
    expect(readKeycloakRoles("not-a-jwt")).toEqual([])
    expect(readKeycloakRoles("a.%%%.c")).toEqual([])
  })
})

describe("portalRoleFromKeycloakRoles", () => {
  it("maps portal roles to tiers, client outranking teammate", () => {
    expect(portalRoleFromKeycloakRoles(["portal_client", "portal_teammate"])).toBe("client")
    expect(portalRoleFromKeycloakRoles(["portal_teammate"])).toBe("teammate")
    expect(portalRoleFromKeycloakRoles(["portal_admin"])).toBeUndefined()
  })
})
