## Summary

<!-- What does this PR do? One or two sentences. -->

## Change classification

<!-- Select one. -->

- [ ] `internal-only` — no impact on shared contracts or backend integration
- [ ] `backward-compatible` — consumes new fields from LL-task-tracker (no breaking change)
- [ ] `breaking` — requires a coordinated change in LL-task-tracker

## Contract checklist

<!-- Complete if any file under src/lib/contracts/, src/lib/api/, or src/lib/auth/ changed. -->

**Did you change any of the following?**

- [ ] `src/lib/contracts/index.ts` (TypeScript types)
- [ ] `src/lib/contracts/schemas.ts` (Zod validators)
- [ ] `src/lib/contracts/version.ts` (supported contract version)
- [ ] `src/lib/api/taskTracker.ts` or any API adapter
- [ ] `src/lib/auth/` (Keycloak/session config)

**If yes:**

- [ ] Change is consistent with `contracts/openapi/case-engine-api.yaml` in LL-task-tracker
- [ ] `SUPPORTED_CONTRACT_VERSION` in `src/lib/contracts/version.ts` is correct
- [ ] No frontend-invented status values, derived lifecycle metrics, or assumed permissions
- [ ] Corresponding LL-task-tracker PR (if any): ____

## Testing

- [ ] `pnpm run lint` passes
- [ ] `pnpm run test` passes
- [ ] `pnpm run build` passes
- [ ] UI tested manually against staging LL-task-tracker (if API shape changed)

## Linked issues

<!-- Closes #___  /  Related: LL-task-tracker#___ -->
