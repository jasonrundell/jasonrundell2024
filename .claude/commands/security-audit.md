# Security Audit Command

Audit the Next.js app for OWASP risks across auth, authorization, input validation, XSS, API handling, headers, environment variables, dependencies, and Supabase RLS. Use targeted `rg` searches and read the owning modules before recommending changes.

## Searches

```bash
rg "auth|session|signIn|signUp|signOut|getUser|getSession|createClient" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "dangerouslySetInnerHTML|innerHTML|eval\\(|Function\\(" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "\\.from\\(|\\.select\\(|\\.insert\\(|\\.update\\(|\\.delete\\(" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "FormData|request\\.json\\(|zod|safeParse|parse\\(" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "headers|Content-Security-Policy|X-Frame-Options|Permissions-Policy|Strict-Transport-Security" next.config.* src --glob "*.{ts,tsx,mjs,js}"
rg "process\\.env|NEXT_PUBLIC" src next.config.* --glob "*.{ts,tsx,mjs,js}" --glob "!*.test.*" --glob "!*.spec.*"
rg "row level security|create policy|alter table" . --glob "*.sql"
rg "export async function (GET|POST|PUT|PATCH|DELETE)" src/app/api --glob "*.{ts,js}"
```

## Review Points

- Protected routes must verify identity through Supabase server utilities or middleware.
- User-controlled data must be validated server-side with Zod or equivalent schema checks.
- Required data should log and throw or return explicit error responses; do not silently fall back.
- Any `dangerouslySetInnerHTML` path must use `src/lib/sanitize.ts` or an equivalent sanitizer.
- Comment/profile mutations must rely on authenticated user identity and RLS, not client-provided ownership.
- Supabase tables must have RLS enabled and policy expectations reflected in `src/lib/db/schema.sql`.
- Security headers in `next.config.mjs` should remain strict and intentional.
- No secrets should be exposed through `NEXT_PUBLIC_*` unless they are designed for browser use.

## Output

Lead with findings ordered by severity. For each finding include:
- Affected file or module.
- Why it matters.
- Concrete fix.
- Validation command or test to add.
