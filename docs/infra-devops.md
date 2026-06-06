# Infra / DevOps Implementation Note

> System note: WordPress and the client portal are separate production deployments.
> The public website is `https://www.levine-law.ca`.
> The `ll-corporate` client portal is `https://clients.levine-law.ca`.
> Production must not use a WordPress `/corporate` mount for the portal.
> See [DEPLOYMENT.md](../DEPLOYMENT.md) for the cross-app boundary overview.

## DNS

Public website hostname:

```text
www.levine-law.ca
```

Client portal hostname:

```text
clients.levine-law.ca
```

## Reverse Proxy / Ingress

Routes:

```text
www.levine-law.ca -> WordPress service
clients.levine-law.ca -> ll-corporate service
```

The app is built without a production `basePath`. `next.config.ts` currently avoids `basePath`; leave it that way unless a dev-only reason is documented.

Existing `/corporate` paths are application routes in the Next.js app, not deployment topology.

Expected current external portal routes:

```text
GET  https://clients.levine-law.ca/corporate
GET  https://clients.levine-law.ca/corporate/app
GET  https://clients.levine-law.ca/corporate/api/auth/signin/keycloak
GET  https://clients.levine-law.ca/corporate/api/auth/callback/keycloak
POST https://clients.levine-law.ca/corporate/api/auth/signout
GET  https://clients.levine-law.ca/healthz
```

Future route simplification may move:

```text
/corporate/sign-in -> /sign-in
/corporate/app -> /app
/corporate/admin -> /admin
```

Forward these headers:

```text
Host
X-Forwarded-Host
X-Forwarded-Proto
X-Forwarded-For
```

## Keycloak Client Settings

Client type:

```text
Confidential web client
```

Valid redirect URI:

```text
https://clients.levine-law.ca/corporate/api/auth/callback/keycloak
```

Valid post logout redirect URI:

```text
https://clients.levine-law.ca/corporate
```

Web origin:

```text
https://clients.levine-law.ca
```

Required values for the app:

```text
AUTH_KEYCLOAK_ISSUER=https://<keycloak-host>/realms/<realm>
AUTH_KEYCLOAK_ID=<client-id>
AUTH_KEYCLOAK_SECRET=<client-secret>
```

## Environment Variables

```text
AUTH_SECRET=<32+ character secret>
AUTH_TRUST_HOST=true
AUTH_URL=https://clients.levine-law.ca/corporate/api/auth
AUTH_KEYCLOAK_ISSUER=https://<keycloak-host>/realms/<realm>
AUTH_KEYCLOAK_ID=<client-id>
AUTH_KEYCLOAK_SECRET=<client-secret>
LL_CORPORATE_APP_BASE_URL=https://clients.levine-law.ca/corporate
LL_CORPORATE_POST_LOGIN_REDIRECT_URL=https://clients.levine-law.ca/corporate/app
LL_CORPORATE_LOGOUT_REDIRECT_URL=https://clients.levine-law.ca/corporate
LL_TASK_TRACKER_API_BASE_URL=<future backend URL>
```

## Build / Start

Install:

```sh
corepack enable
pnpm install --frozen-lockfile
```

Build:

```sh
pnpm run build
```

Start:

```sh
pnpm run start
```

The app listens as a normal Next.js service on the `clients.levine-law.ca` origin. Production does not use a Next.js `basePath` or a WordPress `/corporate` reverse proxy mount.
