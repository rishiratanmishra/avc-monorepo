# AI Instruction Hierarchy

## Purpose

Define one deterministic hierarchy for AI behavior across OpenCode, generated tool files, skills, and repository documentation.

## Precedence

When guidance conflicts, resolve in this order:

1. **Tooling and CI** — TypeScript errors, ESLint/stylelint errors, failing tests, build failures.
2. **Security and data-integrity rules** — `docs/security/standards.md`, `docs/backend/auth-rbac.md`, `docs/database/standards.md`.
3. **Domain rules** — `docs/business-logic/veterinary-domain.md`.
4. **Other canonical engineering docs** under `docs/`.
5. **Root `AGENTS.md`** — highest authority for agent workflow, scope, and instruction loading; not a replacement for canonical technical rules.
6. **Scoped `AGENTS.md`** — narrows work to one app or package; never overrides root workflow rules or canonical engineering rules.
7. **Project skills** under `.opencode/skills/` — task workflows that reference canonical docs.
8. **README files** — descriptive context only; not normative unless they link to a canonical doc.

If root `AGENTS.md` and a canonical `docs/**` rule disagree about engineering or domain behavior, the canonical doc wins. If they disagree about how an agent discovers instructions or which scoped files to read, root `AGENTS.md` wins.

Before touching any app or package, read its scoped `AGENTS.md`, even when the agent started at the repository root. Scoped files are not auto-loaded in that case; the root router makes them mandatory reading.

Generated blocks such as `<!-- BEGIN:turborepo-agent-rules -->` and `<!-- BEGIN:nextjs-agent-rules -->` are tool-owned. Preserve them verbatim. Add project rules **below** them.

Managed-block maintenance:

- The root Turbo block is opt-in through `"agentGuidance": true` in `turbo.json`; preserve its markers and include any tool-generated block diff in review.
- The Next.js block currently present in `apps/admin/AGENTS.md` is re-added by `next dev`; do not hand-edit or delete it.
- Committed, matching managed blocks do not change during normal lint, type-check, test, or build runs. Run the full documented gates; verify with `git diff -- AGENTS.md apps/admin/AGENTS.md` if a generator diff is suspected, and keep reviewed generated changes rather than hand-editing them.
- Do not duplicate managed guidance into canonical docs or skills.

## File roles

| File                          | Role                                                              |
| ----------------------------- | ----------------------------------------------------------------- |
| `AGENTS.md`                   | Globally loaded, concise rules and router                         |
| `apps/*/AGENTS.md`            | Read when working in that app; pointer plus local constraints     |
| `packages/*/AGENTS.md`        | Read when working in that package; pointer plus local constraints |
| `docs/**`                     | Detailed canonical standards                                      |
| `.opencode/skills/*/SKILL.md` | On-demand, actionable workflows                                   |
| `apps/admin/CLAUDE.md`        | Compatibility pointer only; no duplicate rules                    |

## Skill usage

Skills are loaded on demand, not all at once. Use the matching skill when the task involves its domain:

| Skill                   | Use when                                                   |
| ----------------------- | ---------------------------------------------------------- |
| `avc-onboarding`        | Starting work, unsure of architecture or scope             |
| `avc-ui-design-system`  | Building or changing UI, CSS, tokens, a11y                 |
| `avc-frontend`          | Next.js pages, layouts, components, forms, SEO             |
| `avc-api-backend`       | Express routes, controllers, services, contracts           |
| `avc-database`          | Drizzle schema, migrations, data integrity                 |
| `avc-veterinary-domain` | Any pet/owner/appointment/medical/billing logic            |
| `avc-auth-rbac`         | Auth, sessions, roles, permissions, protected routes       |
| `avc-quality-gates`     | Tests, review, refactor, documentation updates, validation |

## Conflict rules

- Never invent a new rule in a skill. Link to the canonical document instead.
- Do not create Copilot, Cursor, or Windsurf instruction files unless those tools are actually adopted. If adopted, make them pointers to this hierarchy.
- Do not duplicate managed generator guidance into project docs.
- If a canonical doc is stale, update the canonical doc, not a local copy.
- If a rule cannot be enforced by tooling yet, document it as a review requirement in `CONTRIBUTING.md`.
