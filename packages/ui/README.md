# `@repo/ui`

Starter-level React primitives shared by the Turborepo template. This package is **not** the AVC production design system yet.

Do not use the template starter components in product surfaces without a review that promotes them into the documented design system.

The Formik/Zod form system is promoted and stable for product use. Import it from `@repo/ui/form`:

```tsx
import {
  FormikForm,
  InputTextField,
  InputPasswordField,
  FormSubmitButton,
  zodValidationSchema,
} from "@repo/ui/form";
```

It owns field markup, Formik binding, touched/error display, ARIA wiring, and token-based field styling. It requires the AVC CSS custom properties from `apps/web/app/globals.css` (or a reviewed equivalent mapping in the consuming app).

Canonical rules:

- `docs/design-system/standards.md`
- `docs/architecture/standards.md`
- `packages/ui/AGENTS.md`

Use `yarn lint`, `yarn check-types`, and `yarn build` to validate changes.
