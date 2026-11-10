# `@repo/eslint-config`

Shared ESLint flat configurations for the monorepo. The workspace exports three
entry points:

| Import                               | Use                                                  |
| ------------------------------------ | ---------------------------------------------------- |
| `@repo/eslint-config/base`           | Base JavaScript and TypeScript rules                 |
| `@repo/eslint-config/next-js`        | Base rules plus Next.js and React Hooks rules        |
| `@repo/eslint-config/react-internal` | Base rules plus React Hooks rules for React packages |

Import the configuration needed by a workspace's `eslint.config.js` and include
it in that workspace's flat config array. The Next.js apps use the `next-js`
configuration, while the shared UI package uses `react-internal`.

The root `yarn lint` command runs lint tasks through Turborepo. Run
`yarn workspace web lint`, `yarn workspace docs lint`, or
`yarn workspace @repo/ui lint` to lint one workspace.
