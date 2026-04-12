# Auth Boundary

Authentication belongs in this folder.

The portal will use Keycloak/OIDC for identity. The frontend may present session state and use identity tokens when calling backend adapters.

Authorization remains backend-owned. Frontend role or claim checks are visibility hints only and must not decide whether a workflow action is permitted.

Implemented responsibilities:

- Auth.js route handler configuration
- Keycloak sign-in initiation
- local session read/adaptation for portal identity display
- sign-out back to the public `/corporate` entry

The protected portal shell reads only `PortalSession.identity`.

Not allowed here:

- workflow authorization rules
- matter/request/document permission matrices
- action eligibility decisions
- lifecycle state decisions
