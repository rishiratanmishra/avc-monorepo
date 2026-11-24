# `apps/web` scoped instructions

This file is a thin pointer. Global rules are in the repository root `AGENTS.md`; canonical details are in `docs/README.md`.

- This is a Next.js App Router presentation app. The Express API is authoritative for validation, authorization, persistence, and business rules.
- Do not add client-side authorization, self-assigned roles, or persisted-success simulations outside the documented prototype exceptions in `docs/backend/auth-rbac.md`.
- Follow `docs/frontend/standards.md` and `docs/design-system/standards.md` for pages, layouts, forms, tokens, states, and accessibility.
- Read the installed Next.js guide in `node_modules/next/dist/docs/` before writing Next.js-specific code.
- Load `avc-onboarding`, `avc-ui-design-system`, `avc-frontend`, `avc-auth-rbac`, or `avc-quality-gates` as appropriate.
- Validate with `yarn lint`, `yarn lint:css`, `yarn check-types`, root `yarn test` (API-only today; see `docs/testing/standards.md`), and `yarn build` before completion.
