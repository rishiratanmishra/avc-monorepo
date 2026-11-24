# `apps/docs` scoped instructions

This file is a thin pointer. Global rules are in the repository root `AGENTS.md`; canonical details are in `docs/README.md`.

- `apps/docs` is an independent Next.js starter app, not the canonical engineering documentation source.
- Do not put project standards in this app. Canonical rules live in the root `docs/` directory.
- Keep changes here minimal unless the user explicitly asks to develop this app.
- Read the installed Next.js guide in `node_modules/next/dist/docs/` before writing Next.js-specific code.
- Validate affected workspaces with `yarn lint`, `yarn check-types`, root `yarn test` (API-only today; see `docs/testing/standards.md`), and `yarn build`.
