# Deployment Topology Note

> System note: the public Levine Law website and the client portal are separate production deployments.
> The public WordPress website is served from `https://www.levine-law.ca`.
> The `ll-corporate` Next.js client portal is served from `https://clients.levine-law.ca`.
> Production must not mount the portal at `/corporate` on the WordPress domain.
> See [DEPLOYMENT.md](../DEPLOYMENT.md) for the cross-app boundary overview.

Target public URL:

- `https://clients.levine-law.ca`

Assumed ownership:

- `https://www.levine-law.ca` is the public WordPress website.
- `https://clients.levine-law.ca` is the standalone `ll-corporate` Next.js app.
- The portal is a separate app deployment from WordPress.
- This repo must not be merged into WordPress and must not depend on a WordPress `/corporate` mount.

Next.js path behavior:

- Production does not use `basePath`; `next.config.ts` currently avoids `basePath` and should stay that way unless a dev-only reason is documented.
- Existing protected `/corporate` paths are application routes in this Next.js app, not deployment topology.
- The current public portal entry route is `https://clients.levine-law.ca/sign-in`.
- The current protected shell route is `https://clients.levine-law.ca/corporate/app`.
- Auth.js handlers are currently exposed at `https://clients.levine-law.ca/corporate/api/auth/*`.
- Health routes are checked on the client portal origin, for example `https://clients.levine-law.ca/healthz`.

Future route simplification may move:

- `/corporate/app` -> `/app`
- `/corporate/admin` -> `/admin`

Do not implement those route changes until the routing migration is explicitly approved.

Production DNS / ingress requirement:

```text
clients.levine-law.ca -> ll-corporate Next.js upstream
www.levine-law.ca -> WordPress upstream
```

The proxy must preserve:

- `Host`
- `X-Forwarded-Host`
- `X-Forwarded-Proto`
- `X-Forwarded-For`

Do not proxy `www.levine-law.ca/corporate/*` to this app in production. If WordPress needs a portal link, it should link to `https://clients.levine-law.ca/sign-in`.

Assets:

- Next.js framework assets are emitted and requested from the portal origin under `/_next/*`.
- No separate `assetPrefix` is required for the same-origin `clients.levine-law.ca` deployment.
- Add `assetPrefix` only if static assets are moved to a different CDN origin.
