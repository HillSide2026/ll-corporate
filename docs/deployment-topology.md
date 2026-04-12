# Deployment Topology Note

Target public URL:

- `https://levinellp.ca/corporate`

Assumed ownership:

- `levinellp.ca` root site remains separately owned.
- `ll-corporate` is deployed as its own Next.js app.
- Reverse proxy or ingress maps `/corporate` to the `ll-corporate` app.
- This repo must not be merged into the root website to serve the portal.

Next.js path behavior:

- `next.config.ts` sets `basePath: "/corporate"`.
- The public entry page is implemented at internal route `/` and is externally reachable at `/corporate`.
- The protected shell is implemented at internal route `/app` and is externally reachable at `/corporate/app`.
- Auth.js handlers are implemented at internal `/api/auth/*` and are externally reachable at `/corporate/api/auth/*`.
- Health routes should be checked through the mounted path, for example `/corporate/healthz`.

Reverse proxy requirement:

```text
https://levinellp.ca/corporate/* -> ll-corporate upstream /*
```

The proxy must preserve:

- `Host`
- `X-Forwarded-Host`
- `X-Forwarded-Proto`
- `X-Forwarded-For`
- request path under `/corporate`

Do not rewrite `/corporate` away before the request reaches Next.js unless the app is rebuilt without `basePath`.

Assets:

- Next.js framework assets are emitted and requested under `/corporate/_next/*`.
- No separate `assetPrefix` is required for the same-domain `/corporate` mount.
- Add `assetPrefix` only if static assets are moved to a different CDN origin.
