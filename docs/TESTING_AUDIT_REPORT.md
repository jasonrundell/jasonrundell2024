# Testing and Code Coverage Audit Report

## Current Snapshot
Last verified locally with `npm run test:ci`.

- Test suites: 48 passed / 48 total.
- Tests: 546 passed / 546 total.
- Statements: 71.44%.
- Branches: 60.99%.
- Functions: 70.83%.
- Lines: 71.95%.

The project target is 70% unit coverage for statements, functions, and lines. `scripts/check-coverage.js` enforces that target in `npm run test:ci` and `npm run test:coverage`; branches are enforced at 60% and should be ratcheted upward as conditional behavior is covered.

## Strengths
- Jest is integrated through `next/jest` with jsdom, `@testing-library/react`, `@testing-library/jest-dom`, and user-event.
- Tests are co-located with source files, which makes module-level feedback easy to find.
- `src/__tests__/utils/test-utils.tsx` provides a shared render helper.
- Middleware, Supabase utilities, server actions, auth flows, comments APIs, the homepage, and several shared components have meaningful coverage.
- CI runs build and coverage workflows on pull requests.

## Current Gaps
- Remaining low-coverage areas are mostly route pages, auth leaf components, and branch-heavy conditional behavior.
- Some auth UI leaf components are thin wrappers and only partially covered.
- Branch coverage is the lowest metric, so tests should prioritize conditional rendering, error paths, and optional Contentful fields.
- There is no browser E2E suite for full critical flows. Existing integration tests cover auth flow behavior inside Jest, not a real browser.

## Testing Conventions
- Test behavior through public interfaces: rendered text, accessible roles/names, links, form behavior, API responses, and exported function results.
- Prefer `src/__tests__/utils/test-utils.tsx` for component rendering.
- Mock external services at module boundaries: Contentful through `src/lib/contentful.ts`, Supabase through `src/utils/supabase/**`, and Next navigation through existing Jest setup.
- Keep negative-path tests explicit. If code should log and return an error response, assert the response and avoid silent fallback expectations.
- Add tests beside the module being changed unless a shared fixture/helper belongs in `src/__tests__`.

## Validation Commands
The same npm commands work in Windows PowerShell, Windows Command Prompt, macOS Terminal, and Linux shells.

- Install dependencies: `npm install`
- Run lint: `npm run lint`
- Run unit/integration tests with coverage: `npm run test:ci`
- Run unit-only tests: `npm run test:unit`
- Watch tests while editing: `npm run test:watch`
- Run production build after route/config/integration changes: `npm run build`

## Priority Backlog
1. Add branch tests for optional images, optional author/profile data, empty arrays, and invalid Contentful data.
2. Increase branch coverage from 60% toward 70%.
3. Split and test `src/app/actions.ts` by capability when the next auth/profile change touches it.
4. Add a browser E2E suite for sign-in, registration, password reset, protected profile, and comments when the project needs confidence beyond Jest integration tests.
5. Raise `scripts/check-coverage.js` thresholds whenever the suite exceeds the current gate by at least 2-3 percentage points.

