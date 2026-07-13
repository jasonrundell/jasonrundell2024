# Auth UI components

## Overview

Leaf UI components and shared form primitives for the authentication pages
(sign-in, sign-up, forgot-password, reset-password).

## Layout hierarchy

```
AuthLayout (auth-layout.tsx)           ← full-page chrome (logo, card shell)
  └── AuthFormWrapper / FieldGroup     ← from auth-form-shell.tsx (shared)
        └── Input, Label, SubmitButton ← ui/ primitives
```

## Shared form shell (`auth-form-shell.tsx`)

`AuthFormWrapper`, `AuthFieldGroup`, `AuthFullWidthButton`, and `AuthFooterText`
are used by all four auth pages. Any new auth page should import from here -
never re-define these locally.

## Supabase redirects

All form actions call server actions in `src/app/actions/`. After a successful
or failed auth operation, the actions call
`encodedRedirect(type, path, message)` or Next.js `redirect()`. The sign-in page
reads `?error=` / `?message=` query params via `searchParams`.

## File naming

This folder uses **kebab-case** (e.g. `auth-form-shell.tsx`,
`form-message.tsx`). The root `src/components/` uses PascalCase. Both
conventions are documented in `CONVENTIONS.md`.

## Key files

| File                    | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `auth-layout.tsx`       | Full-page auth card wrapper                                    |
| `auth-form-shell.tsx`   | Shared form styled primitives (3+ uses → hoisted here)         |
| `form-message.tsx`      | Success/error message banner                                   |
| `submit-button.tsx`     | Loading-aware form submit button                               |
| `password-strength.tsx` | Visual password strength indicator                             |
| `password-input.tsx`    | Password input with show/hide toggle                           |
| `header-auth.tsx`       | Auth buttons for the page header                               |
| `ui/`                   | Radix-based primitives (Button, Input, Label, Checkbox, Badge) |
| `typography/`           | Inline code typography primitive                               |
