# Infra / DevOps Implementation Note

> System note: `ll-corporate` is the primary application associated with `https://levinellp.ca`.
> The current implemented portal shell in this repo may still run under `/corporate`.
> `/nda` is reserved for `NDA-Esq` and must not be handled by this repo.
> Moving `ll-corporate` fully to `/` is a future deployment decision and is not part of this change.
> See [DEPLOYMENT.md](../DEPLOYMENT.md) for the cross-app boundary overview.

## DNS

Public hostname:

```text
levinellp.ca
```

No separate portal subdomain is assumed.

## Reverse Proxy / Ingress

Route:

```text
/corporate/* -> ll-corporate service
```

The app is built with:

```ts
basePath: "/corporate"
```

Expected external routes:

```text
GET  /corporate
GET  /corporate/app
GET  /corporate/api/auth/signin/keycloak
GET  /corporate/api/auth/callback/keycloak
POST /corporate/api/auth/signout
GET  /corporate/healthz
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
https://levinellp.ca/corporate/api/auth/callback/keycloak
```

Valid post logout redirect URI:

```text
https://levinellp.ca/corporate
```

Web origin:

```text
https://levinellp.ca
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
AUTH_URL=https://levinellp.ca/corporate/api/auth
AUTH_KEYCLOAK_ISSUER=https://<keycloak-host>/realms/<realm>
AUTH_KEYCLOAK_ID=<client-id>
AUTH_KEYCLOAK_SECRET=<client-secret>
LL_CORPORATE_APP_BASE_URL=https://levinellp.ca/corporate
LL_CORPORATE_POST_LOGIN_REDIRECT_URL=https://levinellp.ca/corporate/app
LL_CORPORATE_LOGOUT_REDIRECT_URL=https://levinellp.ca/corporate
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

The app listens as a normal Next.js service. The public `/corporate` mount is owned by ingress/proxy configuration plus the app `basePath`.
