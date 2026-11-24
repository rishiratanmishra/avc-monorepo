<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": true` in the root `turbo.json` or `turbo.jsonc` to opt in; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

# AVC Pet Hospital — Global Project Rules

This repository is a production-oriented Veterinary Hospital Management System, not a marketing site demo. The API is authoritative for validation, authorization, persistence, and business rules. Client apps are presentation layers.

## Source of truth

- This file is the globally loaded entry point and the highest authority for global agent workflow and scope. Detailed engineering and domain rules are canonical in `docs/`.
- Detailed canonical rules live in `docs/`. Start at `docs/README.md`.
- Before touching any app or package, read that directory's scoped `AGENTS.md`, even if the session started at the repository root.
- Scoped app/package `AGENTS.md` files are thin pointers. They narrow scope but do not override root workflow rules or canonical engineering rules.
- Skills live in `.opencode/skills/` and provide on-demand workflows. They reference canonical docs and do not duplicate them.
- Generated/managed blocks are tool-owned. Preserve them verbatim and add project rules below them.

If guidance conflicts: tooling/CI > security/data integrity > domain rules > canonical `docs/**` > root `AGENTS.md` for agent workflow/scope > scoped `AGENTS.md` > project skills > READMEs. When root `AGENTS.md` and `docs/**` disagree about an engineering or domain rule, `docs/**` wins; when they disagree about how agents discover or apply instructions, root `AGENTS.md` wins.

## Global engineering rules

1. Inspect existing code before generating or editing. Reuse before creating; extend before duplicating.
2. Keep changes scoped to the requested task. Do not modify unrelated files, redesign unrelated UI, or fix unrelated bugs.
3. Do not add dependencies unless existing tooling cannot solve the problem. Justify every new dependency.
4. Preserve working functionality and existing architecture. Do not rewrite code merely to make it look different.
5. Prefer typed contracts in `@repo/contracts` for anything crossing app/API boundaries.
6. Never trust browser state for identity, roles, permissions, prices, or business validation.
7. Never put credentials, session tokens, or medical data in `localStorage` or client-only context.
8. Use design tokens for visual values. Do not invent raw colors, spacing scales, or local token aliases.
9. Do not create duplicate UI primitives. Check `apps/web/components/`, `apps/admin/`, and `packages/ui/` first.
10. Do not implement veterinary domain behavior that contradicts `docs/business-logic/veterinary-domain.md`.
11. Do not add domain tables, routes, or contracts before the relevant invariant is documented.
12. Do not show success for actions that were not persisted through the API.
13. Accessibility, responsive behavior, loading, empty, error, and success states are part of done.
14. Update canonical documentation when architecture, rules, or user-visible behavior changes.
15. Automated checks win over prose. Prefer ESLint, stylelint, TypeScript, tests, and CI enforcement.

## Skills

Load the matching skill for the task:

- `avc-onboarding` — architecture and scope orientation
- `avc-ui-design-system` — UI, CSS, tokens, a11y, responsive design
- `avc-frontend` — Next.js pages, layouts, components, forms, SEO
- `avc-api-backend` — Express routes, controllers, services, contracts
- `avc-database` — Drizzle schema, migrations, integrity
- `avc-veterinary-domain` — domain invariants and workflows
- `avc-auth-rbac` — auth, sessions, roles, protected operations
- `avc-quality-gates` — testing, review, refactoring, docs, validation

## Validation

Run relevant checks before completion:

```bash
yarn lint
yarn verify:eslint-coverage
yarn lint:css
yarn check-types
yarn test
yarn build
yarn format:check
```

CI gates lint, ESLint TS/TSX coverage, CSS lint, type checking, tests, and build. `format:check` is currently informational due to pre-existing formatting drift. Record any skipped or failing check in the handover.

Managed blocks are committed. Running the documented Turbo gates is expected; do not skip validation to avoid a generated block rewrite. If a command changes a managed block, keep the generated diff and include it in review.
