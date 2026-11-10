# AVC Admin

The staff/admin dashboard workspace, built with Next.js App Router and Ant
Design. It runs independently from the public website so dashboard components
and styles stay separate.

## Run locally

From the monorepo root:

```bash
yarn workspace admin dev
```

Open [http://localhost:3002](http://localhost:3002), or start all workspaces
with `yarn dev`.

The current dashboard is a UI preview with sample appointment data. It is not
connected to the API yet; do not use it to manage real patient or appointment
records.

## Checks

```bash
yarn turbo run build --filter=admin...
yarn turbo run lint --filter=admin
yarn turbo run check-types --filter=admin...
```
