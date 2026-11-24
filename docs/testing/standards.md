# Testing Standards

## Current state

- Four API unit/behavior test files exist: `apps/api/src/modules/auth/auth.test.ts`, `apps/api/src/modules/auth/role.service.test.ts`, `apps/api/src/modules/access/access.test.ts`, and `apps/api/src/modules/access/hospital-administration.test.ts`.
- The API tests use in-memory repository fakes to cover authorization scopes, multiple memberships, cross-hospital denial, suspended/revoked memberships, client resource relationships, session expiry/revocation, invitations, final-owner protection, and platform-role boundaries.
- No frontend, component, integration, E2E, or database tests are configured.
- Root and Turbo `test` tasks are configured; CI runs `yarn test`.

## Test layers

| Layer       | Scope                                     | Required for                                   |
| ----------- | ----------------------------------------- | ---------------------------------------------- |
| Unit        | Pure functions, schemas, hashing, helpers | All non-trivial logic                          |
| Contract    | Zod schemas and boundary shapes           | Every new API contract                         |
| Integration | API + database + middleware               | Auth, RBAC, transactions, domain writes        |
| Component   | React component behavior                  | Reusable UI primitives and complex forms       |
| E2E         | Critical user journeys                    | Booking, login, role-gated access, submissions |
| Migration   | Schema application and rollback plan      | Every domain migration                         |

## Commands

```bash
yarn test          # all workspace test scripts via Turbo; API-only today
yarn lint          # ESLint across workspaces
yarn verify:eslint-coverage  # resolve effective ESLint config for every lintable source file
yarn lint:css      # stylelint across CSS
yarn check-types   # TypeScript
yarn build         # all builds
yarn format:check  # Prettier check (currently non-blocking in CI)
```

## Rules

- Tests must assert behavior, not implementation details.
- Domain invariants from `docs/business-logic/veterinary-domain.md` require tests.
- Authorization tests must verify denial as well as success.
- Every bug fix requires a regression test once bug-fix work is in scope.
- Tests must not depend on real third-party services.
- Never use production data in fixtures.
- Keep tests close to the module they validate.

## Quality gates

CI runs:

1. install with frozen lockfile
2. lint
3. ESLint TS/TSX coverage guard
4. CSS lint
5. type check
6. tests
7. build

The ESLint coverage guard enumerates all source files in workspaces with a `lint` script, skips files ignored by ESLint, resolves the effective config per file, and checks the Babel parser, TypeScript core-rule scope, JSX accessibility rules, workspace boundary rules, and Turbo env-var rule.

`format:check` is currently reported but non-blocking because the existing repository has pre-existing formatting drift. It becomes blocking after the one-time formatting migration.

`yarn lint:css` runs stylelint and `scripts/check-css-tokens.mjs`. The script uses
schemaVersion 3 of `scripts/css-token-baseline.json` as a reviewed ratchet for
pre-existing undefined custom properties, exact raw-color values, raw `px`/`rem`
spacing values in spacing properties, and noncanonical media/container breakpoint
widths by file. A new value, a higher count for an existing value, or a new
undefined token fails CI; reducing or removing baseline debt is always allowed.
Baseline updates require explicit `--reviewed-by` and `--reason` metadata and a
reviewed diff.

## Frontend testing strategy decision

No frontend test runner, DOM environment, component-testing library, or E2E driver is installed. This phase evaluated the options but did not add a dependency.

1. **Pure logic and static presentational output:** use the Node built-in test runner with installed React server rendering (`react-dom/server`) where a test only needs rendered markup and semantic structure. Run TypeScript tests through the repository's reviewed TypeScript execution path; `tsx` is already used by `apps/api`, but a web test script must not rely on an undeclared hoisted binary.
2. **Interactive components and forms:** a DOM environment plus React Testing Library is the appropriate next layer, but none is installed. Add it only when a real component needs event, focus, or state-behavior tests, with a reviewed dependency and CI decision.
3. **E2E:** Playwright is the preferred candidate because it can drive the Next.js apps and API together, including role-gated journeys. No browser driver is installed. Defer adoption until critical user journeys exist and CI can support browser installation/caching; do not add both Playwright and Cypress.
4. **Database integration:** keep this separate from frontend work; provision an isolated test database when API/domain integration tests are in scope.

This strategy is a decision record, not an implemented harness. Do not claim component or E2E coverage until the scripts and CI steps exist.

## Known gaps

- No frontend test runner is installed.
- No component or E2E harness exists.
- No database integration test database is provisioned.
- Coverage thresholds are not configured.
- `format:check` covers only `.ts`, `.tsx`, and `.md`; CSS, JSON, and YAML are not included.
- Windows authors may see CRLF working-tree warnings because `.editorconfig` declares LF; CI does not enforce line endings.
