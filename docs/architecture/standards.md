# Architecture and Folder Standards

## Monorepo map

```text
apps/
  web/       Public Next.js website and patient/owner portal surfaces
  admin/     Staff administration dashboard (Next.js + Ant Design)
  docs/      Independent Next.js starter app; not the canonical docs source
  api/       Express 5 API; authoritative for business rules and data writes
packages/
  ui/        Shared React primitives; currently starter-level, treat as unstable
  eslint-config/    Shared ESLint flat configs
  typescript-config/ Shared tsconfig bases
  contracts/        Zod schemas and inferred boundary types
  database/         Drizzle client, schema, relations, migrations
```

## Application boundaries

- `apps/api` is the **authority** for validation, authorization, persistence, and business rules.
- `apps/web` and `apps/admin` are presentation clients. They must not implement authoritative domain logic.
- `packages/contracts` owns request/response shapes shared across app and API boundaries.
- `packages/database` owns all database access. Apps must not create their own pools or import Drizzle directly.
- `packages/ui` may own reusable primitives only after a component is promoted from an app; do not move starter components into production use without review.

## Layer rules

### API

```text
routes -> middleware -> controller -> service -> database
```

- Routes declare HTTP shape and middleware only.
- Controllers translate HTTP to service calls; no business logic.
- Services own transactions and domain rules.
- Database access lives in `@repo/database`.

### Frontend

```text
app/routes -> layouts -> page compositions -> section components -> ui primitives
```

- Pages compose sections; they do not implement business logic.
- Interactive behavior lives in client components only when required.
- Server state must come from the API through shared contracts. No typed API client module exists yet; define and document one before adding a new frontend integration.

## Folder conventions

- Use lowercase kebab-case for directories: `components/pages/contact-form/`.
- Use lowercase kebab-case for React component files: `contact-form.tsx`, or `index.ts` when exported from a folder barrel. Exported component names remain PascalCase.
- Use kebab-case for non-component files: `api-conventions.md`; React context files use `.tsx`, for example `auth-context.tsx`.
- Co-locate CSS Modules with their component.
- `apps/web/components/sections/` is a compatibility re-export of `components/pages/`. Do not add new sections there; use `components/pages/`.
- Keep route folders in `app/` thin: routing, metadata, data loading, and composition only.
- Do not create a new top-level `apps/` or `packages/` entry without updating this document and `docs/README.md`.

## Naming

- Components, types, and schemas: PascalCase.
- Functions and variables: camelCase.
- Constants: UPPER_SNAKE_CASE when module-level and immutable.
- Database tables and columns: snake_case.
- API paths: lowercase kebab-case, plural resource names where appropriate.
- Event/action names in audit logs: `domain.action.outcome` style, lowercase.

## Imports

- Prefer package imports between workspaces: `@repo/contracts/...`, `@repo/database/...`.
- Inside `apps/web`, use the `@/*` alias for app-local imports.
- Avoid deep relative paths that cross feature boundaries.
- Barrel files are allowed for public component APIs, but do not hide large modules behind barrels.

## Lint enforcement reality

- Shared flat configs explicitly match `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, and `.tsx`; ESLint defaults do not match TypeScript or JSX.
- JavaScript uses `@babel/eslint-parser`. TypeScript uses the same parser with `@babel/preset-typescript` and JSX syntax support because it is compatible with the installed ESLint version and the repository's TypeScript version.
- Babel does not build TypeScript-aware scopes. Core `no-undef` and `no-unused-vars` are therefore disabled for `.ts`/`.tsx`; TypeScript compilation remains the authority for type/value resolution. ESLint still enforces syntax, imports, framework rules, and `jsx-a11y` rules on those files.
- `eslint-plugin-jsx-a11y@6.10.2` declares peer support only through ESLint 9, while the workspace uses ESLint 10. It is retained because it is the latest published version and runtime enforcement was verified with negative probes. Re-check compatibility before upgrading ESLint.
- Shared React/Next.js configs apply `jsx-a11y` recommended rules to `.jsx`/`.tsx`; workspace configs apply their `no-restricted-imports` boundary rules to all source file types.
- `scripts/verify-eslint-coverage.mjs` and the CI `Verify ESLint TS/TSX coverage` step resolve the effective flat config for every lintable source file in every workspace with a `lint` script. They assert the Babel parser, TypeScript core-rule scope, JSX accessibility rules, workspace boundary rules, and the Turbo env-var rule for each applicable file; fixed representative files are no longer used.
- Any change to shared lint matching, parser choice, or rule scoping must also be verified with temporary negative probes for a cross-workspace import, an accessibility violation, and a normal source-file lint violation. Delete probes after verification.

## When to create or reuse

1. Search the repository for an existing component, schema, service, or route pattern.
2. Reuse or extend it if it already fits.
3. Create a new abstraction only when at least two real call sites need it or the boundary is explicitly required by this document.
4. Promote app-local primitives to `@repo/ui` only after they are stable and used by more than one app.
5. Never add a dependency to solve a problem that existing tooling already solves.

## Anti-patterns

- Client-only authorization.
- Business logic in page components or route handlers.
- New database pools outside `@repo/database`.
- Ad hoc request/response types that bypass `@repo/contracts`.
- Duplicate components with slightly different names.
- Moving existing source files solely for cosmetic restructuring.
