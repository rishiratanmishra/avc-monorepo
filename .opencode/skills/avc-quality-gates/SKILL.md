---
name: AVC Quality Gates
description: Use for tests, code review, refactoring, documentation updates, validation, or before declaring any task complete.
---

# AVC Quality Gates

## Workflow

1. Read the root `AGENTS.md` and every scoped `AGENTS.md` for the apps or packages you will touch.
2. Read `docs/testing/standards.md` and `CONTRIBUTING.md`.
3. Review the diff for scope: no unrelated files, UI redesigns, bug fixes, or dependency additions without justification.
4. Check that canonical docs were updated when architecture, behavior, domain rules, or validation gates changed.
5. Add unit/contract tests with the available runner. Integration, component, and E2E coverage require harness provisioning tracked in `docs/testing/standards.md`; do not claim those layers are implemented.
6. For domain work, verify invariants and authorization denial are tested, not just happy paths.
7. Run the relevant checks:
   - `yarn lint`
   - `yarn verify:eslint-coverage`
   - `yarn lint:css`
   - `yarn check-types`
   - `yarn test`
   - `yarn build`
   - `yarn format:check` (informational today)

   Run the full Turbo gates; committed managed blocks do not justify skipping validation.

8. Record skipped or failing checks. Do not claim complete when a relevant gate failed.
9. For refactors, preserve behavior first; separate structural cleanup from functional changes.

## Review checklist

- Reuse before create; extend before duplicate.
- No secrets, credentials, or patient data added to source or client state.
- Accessibility and responsive behavior checked for UI changes.
- Managed generator blocks preserved.
- No parallel instruction files created.
- Negative probes are removed after verifying enforcement changes.

## Handoffs

- Open `avc-veterinary-domain` for invariant or workflow gaps.
- Open `avc-auth-rbac` for auth, role, or prototype-exception questions.
- Open `avc-api-backend`, `avc-database`, `avc-frontend`, or `avc-ui-design-system` when the review finds a gap in that layer.
