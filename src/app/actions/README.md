# Server actions

Each file in this folder contains a **single** Next.js server action
(`'use server'`) grouped by feature. All server actions are re-exported from
`src/app/actions.ts` for backward-compatible import paths.

## Files

| File                     | Action                                                       | Rate limit               |
| ------------------------ | ------------------------------------------------------------ | ------------------------ |
| `sign-up.ts`             | `signUpAction`                                               | 3/10 min per IP          |
| `sign-in.ts`             | `signInAction`                                               | 5/min per IP             |
| `forgot-password.ts`     | `forgotPasswordAction`                                       | 3/10 min per IP          |
| `reset-password.ts`      | `resetPasswordAction`                                        | 3/10 min per IP          |
| `change-password.ts`     | `changePasswordAction`                                       | 3/10 min per IP          |
| `update-display-name.ts` | `updateDisplayNameAction`                                    | (same as changePassword) |
| `update-profile-slug.ts` | `updateProfileSlugAction`                                    | 5/min per IP             |
| `sign-out.ts`            | `signOutAction`                                              | -                        |
| `_shared.ts`             | Rate-limit configs, schemas, `getClientIp()` - internal only |
| `index.ts`               | Re-exports all actions                                       |

## Importing

```ts
// Preferred: import from the barrel (stable import path)
import { signInAction } from '@/app/actions'

// Also works: import directly from the feature file
import { signInAction } from '@/app/actions/sign-in'
```

## Adding a new action

1. Create `src/app/actions/<feature>.ts` with `'use server'` at the top.
2. Export exactly one named action function.
3. Add the export to `src/app/actions/index.ts`.
4. Add a colocated `<feature>.test.ts` covering at least: validation errors,
   rate-limit, success path.
5. Run `npm run test:ci` before opening a PR.
