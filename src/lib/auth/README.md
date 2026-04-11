# Auth Boundary

Authentication belongs in this folder.

The portal will use Keycloak/OIDC for identity. The frontend may present session state and use identity tokens when calling backend adapters.

Authorization remains backend-owned. Frontend role or claim checks are visibility hints only and must not decide whether a workflow action is permitted.

Not allowed here:

- workflow authorization rules
- matter/request/document permission matrices
- action eligibility decisions
- lifecycle state decisions
