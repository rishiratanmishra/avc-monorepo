---
name: AVC Frontend
description: Use for Next.js pages, layouts, routes, forms, client/server boundaries, data integration, SEO, and frontend architecture.
---

# AVC Frontend

## Workflow

1. Read `docs/frontend/standards.md`, `docs/architecture/standards.md`, `docs/design-system/standards.md`, and every scoped `AGENTS.md` for touched apps/packages.
2. Read the installed Next.js guide in `node_modules/next/dist/docs/` when using App Router APIs.
3. Inspect existing route groups, layouts, components, and data-fetch patterns. No typed API client module exists yet; define and document one through review before adding a new integration.
4. Keep `app/` route files thin. Use Server Components by default and isolate client interactivity.
5. Put shared request/response shapes in `@repo/contracts`; never invent parallel boundary types.
6. For forms, add pending, success, failure, field error, and accessible status states. Never show success without persistence outside the documented prototype exception set.
7. For protected pages, use server-enforced authorization; client checks are UX only. Open `avc-auth-rbac` when roles are involved.
8. Add or update metadata and route-level loading/error/not-found states for new product routes.
9. Validate through `avc-quality-gates`. Root `yarn test` is API-only today; record that limitation for frontend work.

## Definition of done

- No business logic implemented in the browser.
- No new localStorage-based identity, role, or medical data outside the documented prototype exceptions in `docs/backend/auth-rbac.md`.
- Existing layout and component patterns reused or intentionally extended.
- Canonical docs updated when routing or layout conventions change.

## Handoffs

- Open `avc-ui-design-system` for reusable primitives, tokens, CSS, and accessibility states.
- Open `avc-auth-rbac` for sessions, roles, protected pages, or prototype exceptions.
- Load `avc-quality-gates` before completion.
