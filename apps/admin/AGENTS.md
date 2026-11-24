<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# `apps/admin` scoped instructions

This file is a thin pointer. Global rules are in the repository root `AGENTS.md`; canonical details are in `docs/README.md`.

- This is the staff administration app. Do not create a second admin surface in `apps/web`.
- Ant Design theme tokens live in this app; keep them here until a shared theme pipeline exists.
- Sample data must remain visibly labeled as sample data. The API is authoritative for real workflows.
- Follow `docs/frontend/standards.md`, `docs/design-system/standards.md`, and `docs/backend/auth-rbac.md`.
- Read the installed Next.js guide in `node_modules/next/dist/docs/` before writing Next.js-specific code.
- Validate with `yarn lint`, `yarn lint:css`, `yarn check-types`, root `yarn test` (API-only today; see `docs/testing/standards.md`), and `yarn build` before completion.
