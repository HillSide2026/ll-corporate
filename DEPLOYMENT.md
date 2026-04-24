# Deployment

## System Ownership

Levine LLP currently runs three related web apps:

- `ll-corporate` (this repo) is the primary application associated with `https://levinellp.ca`.
- `NDA-Esq` is a sibling service mounted at `https://levinellp.ca/nda`.
- `LL-task-tracker` is a separate subdomain app at `https://firm.levinellp.ca`.

## Current State Versus Intended Role

- `ll-corporate` is the primary application associated with the main Levine LLP domain.
- The current implemented portal shell in this repo may still run under `/corporate`.
- Moving `ll-corporate` fully to root `/` is a future deployment and routing decision, not part of this change.
- `/nda` is reserved for `NDA-Esq` and must not be implemented, rewritten, or proxied by this repo.

Current implementation note: this repo may still use `/corporate` as its app base path; the deployment boundary is that `/nda` is excluded and routed to NDA-Esq.

## Routing Responsibilities

- This repo owns the primary application surface associated with `levinellp.ca`.
- `/nda` is excluded from this repo's routing responsibility and belongs to `NDA-Esq`.
- `firm.levinellp.ca` is outside this app's routing surface and deployment unit.

## Notes For This Repo

- UI links to the NDA product should use a root-relative URL such as `/nda`.
- This milestone documents the system boundary only; it does not change current routing behavior.
- Do not add reverse proxy logic here.
