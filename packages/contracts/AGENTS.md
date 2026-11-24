# `@repo/contracts` scoped instructions

This file is a thin pointer. Global rules are in the repository root `AGENTS.md`; canonical details are in `docs/README.md`.

- Own runtime validation schemas and inferred boundary types only.
- Do not define database tables, domain services, secrets, or client-only UI state here.
- Every new API request/response shape should be added here before being used by `apps/api` or a client app.
- Follow `docs/backend/api-standards.md`, `docs/architecture/standards.md`, and `docs/security/standards.md`.
- Validate with `yarn lint`, `yarn check-types`, root `yarn test` (API-only today; see `docs/testing/standards.md`), and `yarn build` before completion.
