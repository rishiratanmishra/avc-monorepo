# AVC Engineering Documentation

This directory is the **canonical source of truth** for project engineering rules. `AGENTS.md` at the repository root is the short global instruction entry point and points here.

## Rule map

| Document                                   | Authority                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `AGENTS.md` (root)                         | Globally loaded agent workflow/scope authority; highest authority for instruction discovery |
| `docs/ai/instruction-hierarchy.md`         | Precedence, conflict resolution, skill usage                                                |
| `docs/architecture/standards.md`           | App/package boundaries, folder rules, naming, imports                                       |
| `docs/design-system/standards.md`          | Tokens, components, UI states, accessibility, responsive rules                              |
| `docs/frontend/standards.md`               | Next.js App Router, layouts, forms, SEO, client/server rules                                |
| `docs/backend/api-standards.md`            | Express API, contracts, errors, transactions, logging                                       |
| `docs/backend/auth-rbac.md`                | Authentication, authorization, role matrix                                                  |
| `docs/database/standards.md`               | Drizzle schema, migrations, integrity, retention                                            |
| `docs/business-logic/veterinary-domain.md` | Domain invariants and workflow rules                                                        |
| `docs/security/standards.md`               | Secrets, PII, uploads, vulnerability prevention                                             |
| `docs/testing/standards.md`                | Test layers, commands, quality gates                                                        |
| `CONTRIBUTING.md`                          | Git, PR, change-management, validation workflow                                             |

## Usage

- AI assistants should read the root `AGENTS.md` first.
- Before touching an app or package, AI assistants must read that directory's scoped `AGENTS.md`, even when the session started at the repository root.
- AI assistants should load the relevant skill from `.opencode/skills/` for the task at hand.
- Skills point to these documents; they do not duplicate them.
- If a skill and a canonical document disagree, the canonical document wins.
- If documentation and tooling disagree, tooling wins and the documentation must be updated.

## Documentation ownership

- Application behavior and domain rules: `docs/business-logic/`
- UI appearance and interaction: `docs/design-system/`
- Code organization: `docs/architecture/`
- Quality gates: `docs/testing/`, `CONTRIBUTING.md`

Do not create parallel rule files under `apps/` or `packages/` that restate these rules. App/package-level `AGENTS.md` files are thin scoped pointers only.
