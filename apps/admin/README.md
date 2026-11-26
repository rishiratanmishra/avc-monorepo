# AVC Admin

The staff/admin dashboard workspace, built with Next.js App Router and Ant
Design. It runs independently from the public website so dashboard components
and styles stay separate.

## Run locally

From the monorepo root:

```bash
yarn workspace admin dev
```

Open [http://localhost:3002/manage](http://localhost:3002/manage), or start all
workspaces with `yarn dev`.

The app is authorized by the Express API session and uses real API data. Sign in
on the public website first, then select an authorized workspace. Available
product areas are platform hospital administration and practice staff
membership administration; clinical, appointment, billing, and communication
areas are intentionally not implemented until their contracts and invariants
exist.

## Checks

```bash
yarn turbo run build --filter=admin...
yarn turbo run lint --filter=admin
yarn turbo run check-types --filter=admin...
```
