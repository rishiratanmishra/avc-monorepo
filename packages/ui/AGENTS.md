# `@repo/ui` scoped instructions

This file is a thin pointer. Global rules are in the repository root `AGENTS.md`; canonical details are in `docs/README.md`.

- This package currently contains starter primitives and is not the production design system.
- Do not promote a starter component into application use without review and documentation in `docs/design-system/standards.md`.
- Prefer extending stable app-local primitives before adding new shared primitives.
- Follow `docs/design-system/standards.md` and `docs/architecture/standards.md`.
- Validate with `yarn lint`, `yarn check-types`, root `yarn test` (API-only today; see `docs/testing/standards.md`), and `yarn build` before completion.
