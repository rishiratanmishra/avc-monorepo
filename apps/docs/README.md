# Docs app

This is the `docs` Next.js workspace in the AVC Pet Hospital monorepo. It runs
independently from the public website app in `apps/web`. The current page is
still the default Turborepo starter, so it does not yet contain hospital
documentation.

## Development

Run commands from the monorepo root:

```bash
yarn workspace docs dev
```

Open [http://localhost:3001](http://localhost:3001). The root `yarn dev`
command also starts this app alongside the `web` and `api` workspaces.

## Useful commands

```bash
yarn workspace docs build
yarn workspace docs start
yarn workspace docs lint
yarn workspace docs check-types
```

## Source files

- `app/page.tsx` contains the home page.
- `app/page.module.css` contains home page styles.
- `app/globals.css` contains global styles.
- `app/layout.tsx` contains the root layout and page metadata.

The app uses the shared `@repo/ui` and `@repo/eslint-config` workspaces.
