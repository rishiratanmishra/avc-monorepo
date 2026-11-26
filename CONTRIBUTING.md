# Contributing

## Scope discipline

- Keep changes focused on the stated task.
- Do not fix unrelated bugs while working on a feature.
- Do not redesign unrelated UI.
- Do not introduce a new dependency without explaining why existing tooling is insufficient.
- Do not move files solely to make the tree look cleaner.

## Before changing code

1. Read root `AGENTS.md`.
2. Read the scoped `AGENTS.md` for every app or package you will touch.
3. Load the matching skill from `.opencode/skills/`.
4. Read the canonical docs linked by that skill.
5. Inspect existing implementations that already solve part of the problem.
6. State the intended change boundaries before editing.

## New feature workflow

1. Inspect the existing architecture and relevant reference implementations before editing.
2. Identify the layers and responsibilities involved; use `docs/architecture/standards.md` as the canonical responsibility standard.
3. Reuse existing components, hooks, services, utilities, schemas, contracts, and backend patterns where they fit.
4. Implement using established conventions; introduce a new pattern only with a clear technical reason and a documentation update.
5. Add tests at the appropriate layer, then run and report the relevant quality gates.

## Change rules

- Reuse before creating.
- Extend before duplicating.
- Preserve generated/managed instruction blocks.
- Update canonical docs when behavior or architecture changes.
- Do not add parallel AI instruction files.
- Do not modify `.env` files or commit secrets.
- Keep product behavior changes separate from engineering-foundation changes.

## Branch and commit conventions

- Use short, conventional commit subjects where practical: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.
- One logical change per commit.
- Reference the relevant issue or task in the PR description when available.

## Pull request checklist

- [ ] Scope is limited and described.
- [ ] Existing patterns were inspected and reused where possible.
- [ ] Canonical docs updated if rules or architecture changed.
- [ ] No new dependency added without justification.
- [ ] Security/PII implications reviewed.
- [ ] Accessibility and responsive behavior checked for UI changes.
- [ ] Tests added for new logic or invariants.
- [ ] Validation commands run and results recorded.

## Validation commands

```bash
yarn lint
yarn verify:eslint-coverage
yarn lint:css
yarn check-types
yarn test
yarn build
yarn format:check
```

CI gates lint, ESLint TS/TSX coverage, CSS lint, type checking, tests, and build. `format:check` is currently informational because of pre-existing formatting drift.

Run the full documented Turbo gates even when a managed block is present. Managed blocks are committed and should not require hand edits; if a run changes one, review and keep the generated diff instead of skipping validation.

## Formatting migration

`format:check` covers only `.ts`, `.tsx`, and `.md`. It currently fails on the
existing repository plus prototype work under `apps/web`; a mass `--write` would
mix unrelated formatting into product changes and obscure review.

The safe migration sequence is:

1. Keep `format:check` informational in CI until the count reaches zero.
2. Format files you materially change so each change does not add new drift.
3. Migrate one workspace or documentation area at a time in a formatting-only
   commit; do not combine that commit with product or governance changes.
4. Keep managed `AGENTS.md` blocks protected by `.prettierignore`.
5. Re-run `check-types`, `test`, and `build` after each migration batch.
6. Make `format:check` blocking only after a clean full run.
