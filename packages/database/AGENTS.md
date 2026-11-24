# `@repo/database` scoped instructions

This file is a thin pointer. Global rules are in the repository root `AGENTS.md`; canonical details are in `docs/README.md`.

- Own the MySQL pool, Drizzle schema, relations, and migrations. Apps must not create their own pools.
- Do not add domain tables before the invariant exists in `docs/business-logic/veterinary-domain.md`.
- Generate migrations; do not hand-edit generated snapshots or journal files.
- Follow `docs/database/standards.md`, `docs/security/standards.md`, and `docs/testing/standards.md`.
- Load `avc-onboarding`, `avc-database`, `avc-veterinary-domain`, and `avc-quality-gates` as appropriate.
- Validate with `yarn lint`, `yarn check-types`, root `yarn test` (API-only today; see `docs/testing/standards.md`), and `yarn build` before completion.
