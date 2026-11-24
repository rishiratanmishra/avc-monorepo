# `@repo/eslint-config`

Shared ESLint flat configurations for the monorepo. The workspace exports three
entry points:

| Import                               | Use                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------- |
| `@repo/eslint-config/base`           | Base JavaScript and TypeScript rules                                   |
| `@repo/eslint-config/next-js`        | Base rules plus Next.js and React Hooks rules                          |
| `@repo/eslint-config/react-internal` | Base rules plus React Hooks and accessibility rules for React packages |

All configs explicitly match `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, and `.tsx`;
ESLint flat-config defaults omit TypeScript and JSX. JavaScript is parsed with
`@babel/eslint-parser`; TypeScript uses the same parser with
`@babel/preset-typescript` and JSX syntax support. Core `no-undef` and
`no-unused-vars` are disabled for TypeScript because Babel does not build
TypeScript-aware scopes; `tsc` remains the authority for identifier resolution.

The Next.js and React configs include `eslint-plugin-jsx-a11y` for `.jsx`/`.tsx`.
The installed `6.10.2` release declares ESLint peer support only through 9 while
the workspace uses ESLint 10; runtime enforcement was verified with negative
probes. Workspaces add their own `no-restricted-imports` rules to enforce
app/package boundaries; see each `eslint.config.js`.

Import the configuration needed by a workspace's `eslint.config.js` and include
it in that workspace's flat config array. The Next.js apps use the `next-js`
configuration, while the shared UI package uses `react-internal`.

The root `yarn lint` command runs lint tasks through Turborepo. Run
`yarn workspace web lint`, `yarn workspace docs lint`, or
`yarn workspace @repo/ui lint` to lint one workspace. `yarn verify:eslint-coverage`
asserts that representative TS/TSX files in each workspace still resolve the
expected parser and rules, and CI runs that guard after `yarn lint`.
