# Production Routing + Auth Note

> System note: the public WordPress website and the client portal are separate production deployments.
> WordPress serves `https://www.levine-law.ca`.
> `ll-corporate` serves the client portal at `https://clients.levine-law.ca`.
> Production must not mount the portal at `/corporate` on the WordPress domain.
> See [DEPLOYMENT.md](../DEPLOYMENT.md) for the cross-app boundary overview.

Production hostname:

- `clients.levine-law.ca`

Current portal application routes:

- Public portal entry: `https://clients.levine-law.ca/corporate`
- Protected shell: `https://clients.levine-law.ca/corporate/app`
- Auth handlers: `https://clients.levine-law.ca/corporate/api/auth/*`

These `/corporate` paths are current application routes. They are not a production deployment mount and do not imply a Next.js `basePath`.

Future route simplification may move:

- `/corporate/sign-in` -> `/sign-in`
- `/corporate/app` -> `/app`
- `/corporate/admin` -> `/admin`

Do not implement those route changes until approved.

Auth.js configuration:

```text
AUTH_URL=https://clients.levine-law.ca/corporate/api/auth
AUTH_TRUST_HOST=true
```

`AUTH_TRUST_HOST=true` is required behind a reverse proxy so Auth.js can trust forwarded host/protocol headers.

Production does not use Next.js `basePath`. `next.config.ts` currently avoids `basePath` and should stay that way unless a dev-only reason is documented. Auth.js is still configured for the current application route `/corporate/api/auth/*`.

Keycloak redirect URIs:

```text
https://clients.levine-law.ca/corporate/api/auth/callback/keycloak
```

Keycloak post-logout redirect URI:

```text
https://clients.levine-law.ca/corporate
```

Keycloak web origin:

```text
https://clients.levine-law.ca
```

Cookie and session assumptions:

- Auth.js session cookies are scoped to `clients.levine-law.ca`.
- The portal is a dedicated subdomain app, separate from WordPress.
- The reverse proxy must keep HTTPS externally; production cookies should be secure.
- Frontend session state proves identity only.
- `ll-task-tracker` remains responsible for authorization, permissions, allowed actions, and workflow decisions.

API routing:

- `https://clients.levine-law.ca/corporate/api/auth/*` belongs to `ll-corporate`.
- Future `ll-task-tracker` API access must go through `src/lib/api/`.
- Do not expose backend domain routes directly from browser components.
- Do not mount backend domain APIs under ambiguous public `/api/*` paths without an explicit proxy rule and security review.
