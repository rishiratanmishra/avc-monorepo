# AVC Pet Hospital website app

This is the `web` workspace, a Next.js app intended to become the public website
for AVC Multispeciality Pet Care Hospital in Gurugram. The current page is still
the default Turborepo starter; the hospital website has not yet been implemented
here.

Use [avcpethospital.com](https://avcpethospital.com) as the live content
reference. Confirm service details and other time-sensitive information with
the hospital before publishing.

Google Maps lists two Gurugram locations: [AVC Multispeciality Pet
Hospital](https://www.google.com/maps/search/?api=1&query=AVC+Multispeciality+Pet+Hospital+Gurugram)
in Sector 90 and [AVC Pet Boarding](https://www.google.com/maps/search/?api=1&query=AVC+Pet+Boarding+Sector+87+Gurugram)
in Sector 87. Confirm each location's services and contact details with the
hospital before publishing them.

## Development

Run commands from the monorepo root:

```bash
yarn workspace web dev
```

Open [http://localhost:3000](http://localhost:3000). The root `yarn dev`
command also starts this app alongside the `docs` and `api` workspaces.

## Useful commands

```bash
yarn workspace web build
yarn workspace web start
yarn workspace web lint
yarn workspace web check-types
```

## Source files

- `app/page.tsx` contains the home page.
- `app/page.module.css` contains home page styles.
- `app/globals.css` contains global styles.
- `app/layout.tsx` contains the root layout and page metadata.

The app uses the shared `@repo/ui` and `@repo/eslint-config` workspaces.
