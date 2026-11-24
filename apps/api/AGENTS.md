# `apps/api` scoped instructions

This file is a thin pointer. Global rules are in the repository root `AGENTS.md`; canonical details are in `docs/README.md`.

- This Express API is the authoritative boundary for validation, authorization, persistence, and business rules.
- Preserve `routes -> middleware -> controller -> service -> database` separation.
- Define boundary shapes in `@repo/contracts` and schema/migrations in `@repo/database`.
- Never trust client-supplied identity, roles, ownership, or prices.
- Do not add veterinary domain routes before the invariant exists in `docs/business-logic/veterinary-domain.md`.
- Follow `docs/backend/api-standards.md`, `docs/backend/auth-rbac.md`, `docs/security/standards.md`, and `docs/testing/standards.md`.
- Load `avc-onboarding`, `avc-api-backend`, `avc-auth-rbac`, `avc-database`, `avc-veterinary-domain`, or `avc-quality-gates` as appropriate.
- Validate with `yarn lint`, `yarn check-types`, `yarn test`, and `yarn build` before completion.
