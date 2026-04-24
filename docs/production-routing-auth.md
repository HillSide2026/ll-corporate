# Production Routing + Auth Note

> System note: `ll-corporate` is the primary application associated with `https://levinellp.ca`.
> The current implemented portal shell in this repo may still run under `/corporate`.
> `/nda` is reserved for `NDA-Esq` and must not be handled by this repo.
> Moving `ll-corporate` fully to `/` is a future deployment decision and is not part of this change.
> See [DEPLOYMENT.md](../DEPLOYMENT.md) for the cross-app boundary overview.

Production hostname:

- `levinellp.ca`

Mounted portal:

- Public login entry: `https://levinellp.ca/corporate`
- Protected shell: `https://levinellp.ca/corporate/app`
- Auth handlers: `https://levinellp.ca/corporate/api/auth/*`

Auth.js configuration:

```text
AUTH_URL=https://levinellp.ca/corporate/api/auth
AUTH_TRUST_HOST=true
```

`AUTH_TRUST_HOST=true` is required behind a reverse proxy so Auth.js can trust forwarded host/protocol headers.

Next.js owns the `/corporate` path prefix through `basePath`. The Auth.js route handler restores that external path before handing auth requests to Auth.js so Keycloak callback URLs are generated with `/corporate/api/auth/*`.

Keycloak redirect URIs:

```text
https://levinellp.ca/corporate/api/auth/callback/keycloak
```

Keycloak post-logout redirect URI:

```text
https://levinellp.ca/corporate
```

Keycloak web origin:

```text
https://levinellp.ca
```

Cookie and session assumptions:

- Auth.js session cookies are scoped to `levinellp.ca`.
- The portal is same-domain and path-mounted, not a separate subdomain.
- The reverse proxy must keep HTTPS externally; production cookies should be secure.
- Frontend session state proves identity only.
- `ll-task-tracker` remains responsible for authorization, permissions, allowed actions, and workflow decisions.

API routing:

- `/corporate/api/auth/*` belongs to `ll-corporate`.
- Future `ll-task-tracker` API access must go through `src/lib/api/`.
- Do not expose backend domain routes directly from browser components.
- Do not mount backend domain APIs under ambiguous public `/api/*` paths without an explicit proxy rule and security review.
