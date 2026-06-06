# Deployment

## System Ownership

Levine LLP currently runs three related web apps:

- Public WordPress website: `https://www.levine-law.ca`.
- Client portal Next.js app, `ll-corporate` (this repo): `https://clients.levine-law.ca`.
- `LL-task-tracker` remains a separate operational backend/app outside this repo.

## Current State Versus Intended Role

- `ll-corporate` is a standalone client portal deployment, separate from WordPress.
- Production must not mount the portal at `https://www.levine-law.ca/corporate`.
- Existing `/corporate` paths in this repo are application routes, not a production deployment mount.
- Route simplification may happen later, but is not part of this documentation update.

Current implementation note: the app still uses routes such as `/corporate`, `/corporate/app`, and `/corporate/admin`. Those routes are served directly from `https://clients.levine-law.ca` without a Next.js `basePath`.

## Routing Responsibilities

- WordPress owns the public website at `https://www.levine-law.ca`.
- This repo owns the client portal at `https://clients.levine-law.ca`.
- Backend workflow and authorization remain outside this app's routing surface and deployment unit.

## Notes For This Repo

- UI links from the public website to the portal should use an absolute portal URL such as `https://clients.levine-law.ca/corporate` until route simplification is approved.
- Future route simplification may move `/corporate/sign-in` to `/sign-in`, `/corporate/app` to `/app`, and `/corporate/admin` to `/admin`.
- This milestone documents the production topology only; it does not change current routing behavior.
- Do not add WordPress reverse proxy logic here.
