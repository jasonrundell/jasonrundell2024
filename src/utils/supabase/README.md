# Supabase utilities

## Which client to use

| Situation                                                          | Use                                                               |
| ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Server component or server action (reads/writes with user cookies) | `createClient()` from `server.ts`                                 |
| Client component (browser, session-aware)                          | `createClient()` from `client.ts`                                 |
| Middleware (cookie-read-only, cached)                              | `getOrCreateSupabaseClient()` from `middleware/supabase-cache.ts` |
| Public read (no session, no cookies)                               | `createPublicClient()` from `public-client.ts`                    |
| Server action that needs availability/paused handling              | `createSafeClient()` from `safe-client.ts`                        |

## Environment variables

Use the **throwing accessors** from `env.ts` wherever the Supabase URL or anon
key is required. They throw immediately if a required variable is missing - no
silent fallback.

```ts
import { getSupabaseUrl, getSupabaseAnonKey } from '@/utils/supabase/env'
```

Use `hasSupabaseEnv()` (also from `env.ts`) only for UI-level graceful
degradation (e.g. `SupabaseStatusBanner`).

## Cookie policy

- **Server** client: full `get/set/remove` cookie access via Next.js
  `cookies()`.
- **Middleware** client: read-only (`set` and `remove` are no-ops) for
  performance.
- **Public** client: no cookies; `persistSession: false`.

## Health check / status

`checkSupabaseStatus()` from `status.ts` performs a lightweight `SELECT` to
verify the project is reachable and not paused. The `SupabaseStatus` type is
exported from `status.ts` only - do not redefine it locally.

## Files

| File                | Role                                                                             |
| ------------------- | -------------------------------------------------------------------------------- |
| `env.ts`            | `getSupabaseUrl()`, `getSupabaseAnonKey()` (throw), `hasSupabaseEnv()` (boolean) |
| `server.ts`         | `createClient()` for Server Components and server actions                        |
| `client.ts`         | `createClient()` for Client Components                                           |
| `middleware.ts`     | `updateSession()` - cookie refresh (used by middleware/supabase-cache.ts)        |
| `public-client.ts`  | `createPublicClient()` - cookie-free singleton                                   |
| `safe-client.ts`    | `SafeSupabaseClient` - wraps execute with availability checks                    |
| `status.ts`         | `checkSupabaseStatus()`, `SupabaseStatus` type                                   |
| `check-env-vars.ts` | `hasEnvVars` - re-exports `hasSupabaseEnv()` for legacy consumers                |
