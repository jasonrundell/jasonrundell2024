# Testing and Code Coverage Audit Report

## Current Snapshot

Coverage is enforced by `scripts/check-coverage.js` via `npm run test:ci`.
Re-run that command for the live totals; do not treat this snapshot as a
substitute for CI.

Target: **70%** statements, functions, and lines; **60%** branches (ratchet up
when the suite exceeds the gate by 2–3 points).

## Strengths

- Jest via `next/jest` with jsdom, `@testing-library/react`,
  `@testing-library/jest-dom`, and user-event.
- Tests are co-located with source files for fast module-level feedback.
- `src/__tests__/utils/test-utils.tsx` provides a shared render helper.
- Middleware, Supabase utilities, server actions, auth flows, comments APIs,
  the homepage, and several shared components have meaningful coverage.
- CI runs build and coverage workflows on pull requests.

## Current Gaps

- Remaining low-coverage areas are mostly route pages, auth leaf components,
  and branch-heavy conditional behavior.
- Some auth UI leaf components are thin wrappers and only partially covered.
- Branch coverage is the softest metric — prefer tests for optional images,
  empty collections, and invalid MDX frontmatter.
- There is no browser E2E suite for full critical flows. Existing integration
  tests cover auth behavior inside Jest, not a real browser.

## Testing Conventions

- Test behavior through public interfaces: rendered text, accessible
  roles/names, links, form behavior, API responses, and exported function
  results.
- Prefer `src/__tests__/utils/test-utils.tsx` for component rendering.
- Mock external services at module boundaries: content through
  `src/lib/content.ts`, Supabase through `src/utils/supabase/**`, and Next
  navigation through the existing Jest setup.
- Keep negative-path tests explicit. If code should log and return an error
  response, assert the response and avoid silent fallback expectations.
- Add tests beside the module being changed unless a shared fixture/helper
  belongs in `src/__tests__`.
- Use domain terms from `docs/glossary.md` (e.g. "sign in", not "login").

## Validation Commands

The same npm commands work in Windows PowerShell, Windows Command Prompt, macOS
Terminal, and Linux shells.

- Install dependencies: `npm install`
- Run lint: `npm run lint`
- Run unit/integration tests with coverage: `npm run test:ci`
- Run unit-only tests: `npm run test:unit`
- Watch tests while editing: `npm run test:watch`
- Run production build after route/config/integration changes: `npm run build`

## Priority Backlog

1. Add branch tests for optional images, optional author/profile data, empty
   arrays, and invalid MDX frontmatter.
2. Increase branch coverage toward 70%.
3. Keep action tests aligned with `src/app/actions/**` (barrel re-exports from
   `src/app/actions.ts`).
4. Add a browser E2E suite for sign-in, registration, password reset, protected
   profile, and comments when confidence beyond Jest integration is needed.
5. Raise `scripts/check-coverage.js` thresholds whenever the suite exceeds the
   current gate by at least 2–3 percentage points.
