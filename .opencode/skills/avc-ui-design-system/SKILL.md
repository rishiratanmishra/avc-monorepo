---
name: AVC UI Design System
description: Use for UI, CSS, design tokens, responsive layout, visual consistency, accessibility, or component-state work.
---

# AVC UI Design System

## Workflow

1. Read `docs/design-system/standards.md` and every scoped `AGENTS.md` for the apps or packages you will touch.
2. Inspect `apps/web/app/globals.css`, existing CSS Modules, and components under `apps/web/components/` before writing styles.
3. Check `packages/ui/` and app-local UI primitives before creating a component. Extend an existing variant first.
4. Use existing tokens for color, type, spacing, radius, shadow, and layout. If a token is missing, add it to the canonical token source first.
5. Implement all required states: default, hover, focus-visible, active/disabled, loading, error, empty, and success.
6. Use semantic HTML first and the documented ARIA patterns for tabs, accordions, status messages, and errors.
7. Keep responsive changes within the documented canonical widths (`639`, `640`, `768`, `991`, `992`, `1024`). Do not copy legacy one-off widths. Check mobile, tablet, and desktop.
8. Do not redesign unrelated sections or fix unrelated visual bugs.
9. Hand off validation to `avc-quality-gates`; include `yarn lint:css` because the CSS token guard ratchets raw colors, raw spacing, undefined tokens, and noncanonical breakpoint widths.

## Definition of done

- No new raw color values, raw `px`/`rem` spacing values in spacing properties, undefined custom properties, or noncanonical breakpoint widths introduced.
- No duplicate primitive created without justification.
- Keyboard and screen-reader behavior verified for interactive changes.
- Canonical docs updated if a new token, breakpoint, or component pattern becomes standard.

## Handoffs

- Open `avc-frontend` for route, layout, form, or data-integration work.
- Open `avc-auth-rbac` for protected UI or role-driven navigation.
- Load `avc-quality-gates` before completion.
