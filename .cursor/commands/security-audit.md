# Security Audit Command

Perform a comprehensive security audit of the Next.js application to identify:

1. Authentication and authorization vulnerabilities
2. XSS (Cross-Site Scripting) vulnerabilities
3. Injection attack vectors (SQL, NoSQL, Command)
4. Insecure data handling and storage
5. Missing or weak input validation
6. Security header misconfigurations
7. Environment variable exposure risks
8. CORS and CSRF vulnerabilities
9. API security issues
10. Dependency vulnerabilities

## Audit Process

### Step 1: Authentication and Authorization Audit

Review authentication implementation:

```bash
# Find authentication-related code
grep -r "auth\|session\|login\|signIn\|signUp" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
grep -r "getSession\|getUser\|createClient" src/ --include="*.tsx" --include="*.ts" | grep -v "test"
```

**Check for:**

- Missing authentication checks on protected routes
- Session management vulnerabilities
- Weak password policies
- Missing rate limiting on auth endpoints
- Insecure session storage
- Missing logout functionality
- Session fixation vulnerabilities
- Missing 2FA/MFA where appropriate

**Action Items:**

- Verify all protected routes check authentication in middleware
- Ensure sessions expire appropriately
- Verify password requirements are enforced server-side
- Add rate limiting to sign-in/sign-up endpoints
- Ensure secure cookie settings (httpOnly, secure, sameSite)
- Verify logout invalidates sessions properly

### Step 2: XSS (Cross-Site Scripting) Audit

Search for XSS vulnerabilities:

```bash
# Find dangerous HTML rendering
grep -r "dangerouslySetInnerHTML" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
grep -r "innerHTML\|eval\|Function(" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
```

**Check for:**

- Unsanitized `dangerouslySetInnerHTML` usage
- Direct `innerHTML` manipulation
- `eval()` or `Function()` constructor usage
- Unsanitized user input in HTML attributes
- Unsafe URL construction
- Missing Content Security Policy (CSP)

**Action Items:**

- Ensure all `dangerouslySetInnerHTML` uses sanitized content (DOMPurify)
- Replace `innerHTML` with safer alternatives
- Remove `eval()` and `Function()` usage
- Sanitize all user-generated content
- Verify CSP headers are properly configured
- Use React's built-in escaping for user input

### Step 3: Injection Attack Audit

Check for injection vulnerabilities:

```bash
# Find database queries and API calls
grep -r "query\|execute\|fetch\|axios\|request" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
grep -r "\.from\|\.select\|\.insert\|\.update\|\.delete" src/ --include="*.tsx" --include="*.ts" | grep -v "test"
```

**Check for:**

- SQL injection (raw SQL queries with user input)
- NoSQL injection (unsanitized object queries)
- Command injection (shell commands with user input)
- Template injection
- Path traversal vulnerabilities
- Missing parameterized queries

**Action Items:**

- Use parameterized queries/prepared statements
- Validate and sanitize all user input
- Use ORM query builders instead of raw queries
- Verify Supabase RLS policies are enabled
- Escape special characters in file paths
- Use whitelist validation for file operations

### Step 4: Input Validation Audit

Review input validation:

```bash
# Find form handling and input processing
grep -r "FormData\|formData\|get\(\)" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
grep -r "zod\|yup\|joi\|validator" src/ --include="*.tsx" --include="*.ts" | grep -v "test"
```

**Check for:**

- Missing server-side validation
- Client-side only validation
- Weak validation rules
- Missing type checking
- Missing length limits
- Missing sanitization after validation

**Action Items:**

- Ensure all inputs are validated server-side
- Use Zod or similar for schema validation
- Set appropriate length limits
- Validate data types and formats
- Sanitize input after validation
- Reject invalid input early

### Step 5: Security Headers Audit

Review security headers configuration:

```bash
# Check next.config.mjs for headers
grep -r "headers\|X-Frame-Options\|CSP\|Content-Security-Policy" next.config.* --include="*.mjs" --include="*.js" --include="*.ts"
```

**Check for:**

- Missing security headers
- Weak CSP policies
- Missing X-Frame-Options
- Missing X-Content-Type-Options
- Missing Referrer-Policy
- Missing Permissions-Policy
- Insecure CSP directives (unsafe-eval, unsafe-inline)

**Action Items:**

- Verify all security headers are set in `next.config.mjs`
- Strengthen CSP (remove unsafe-eval, unsafe-inline where possible)
- Set X-Frame-Options to DENY or SAMEORIGIN
- Set X-Content-Type-Options to nosniff
- Configure Referrer-Policy appropriately
- Set Permissions-Policy to restrict unnecessary features

### Step 6: Environment Variables Audit

Check for exposed secrets:

```bash
# Find environment variable usage
grep -r "process\.env\|NEXT_PUBLIC" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
grep -r "\.env" . --include="*.md" --include="*.txt" | grep -v "node_modules"
```

**Check for:**

- Secrets in `NEXT_PUBLIC_` variables (exposed to client)
- Hardcoded secrets in code
- Secrets in version control
- Missing `.env.example` file
- Secrets in error messages or logs
- Insecure secret storage

**Action Items:**

- Never use `NEXT_PUBLIC_` for secrets
- Use server-only environment variables for sensitive data
- Ensure `.env` files are in `.gitignore`
- Create `.env.example` with placeholder values
- Rotate exposed secrets immediately
- Use secure secret management (Vercel env vars, etc.)

### Step 7: CORS and CSRF Audit

Review CORS and CSRF protection:

```bash
# Find CORS configuration
grep -r "Access-Control\|CORS\|cors" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
grep -r "middleware\|matcher" src/ --include="*.ts" | grep -v "test"
```

**Check for:**

- Overly permissive CORS (wildcard origins)
- Missing origin validation
- Missing CSRF tokens
- Insecure CORS credentials
- Missing SameSite cookie attribute

**Action Items:**

- Whitelist specific origins instead of using `*`
- Validate origin headers server-side
- Ensure CSRF protection is enabled (Next.js provides this for server actions)
- Set `Access-Control-Allow-Credentials` only when necessary
- Use `SameSite=Strict` or `Lax` for cookies

### Step 8: API Route Security Audit

Review API route security:

```bash
# Find API routes
find src/app/api -name "route.ts" -o -name "route.js" 2>/dev/null
grep -r "export.*GET\|export.*POST\|export.*PUT\|export.*DELETE" src/app/api --include="*.ts" --include="*.js"
```

**Check for:**

- Missing authentication on sensitive endpoints
- Missing rate limiting
- Missing input validation
- Missing error handling
- Information leakage in error messages
- Missing HTTPS enforcement
- Missing request size limits

**Action Items:**

- Add authentication checks to protected API routes
- Implement rate limiting on public endpoints
- Validate all input parameters
- Use generic error messages (don't leak details)
- Enforce HTTPS in production
- Set appropriate request size limits

### Step 9: Dependency Vulnerability Audit

Check for vulnerable dependencies:

```bash
# Run security audit
npm audit
npm audit --production

# Check for outdated packages
npm outdated
```

**Check for:**

- Known vulnerabilities in dependencies
- Outdated packages with security patches
- Packages with no recent updates
- Packages with known security issues

**Action Items:**

- Run `npm audit` regularly
- Update vulnerable packages to patched versions
- Replace packages with known security issues
- Use `npm audit fix` for automatic fixes (review first)
- Consider using Dependabot or similar for automated updates

### Step 10: Supabase RLS (Row Level Security) Audit

Verify RLS policies:

```bash
# Find RLS policy definitions
grep -r "row level security\|RLS\|enable row level security" . --include="*.sql" --include="*.ts" --include="*.tsx"
find . -name "*.sql" -type f
```

**Check for:**

- Missing RLS on sensitive tables
- Weak RLS policies
- Missing policies for INSERT/UPDATE/DELETE
- Policies that allow too much access
- Missing user context in policies

**Action Items:**

- Ensure RLS is enabled on all tables (per user rules)
- Review all RLS policies for correctness
- Test policies with different user contexts
- Ensure policies use `auth.jwt()` for user identification
- Verify policies prevent unauthorized access

### Step 11: Cookie Security Audit

Review cookie security:

```bash
# Find cookie usage
grep -r "cookie\|setCookie\|getCookie\|Cookies" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
```

**Check for:**

- Missing httpOnly flag
- Missing secure flag (HTTPS only)
- Missing SameSite attribute
- Insecure cookie names
- Long-lived sessions
- Missing domain/path restrictions

**Action Items:**

- Set `httpOnly: true` for sensitive cookies
- Set `secure: true` in production (HTTPS only)
- Use `SameSite=Strict` or `Lax`
- Set appropriate expiration times
- Restrict cookie domain and path when possible

### Step 12: Error Handling and Information Disclosure

Review error handling:

```bash
# Find error handling
grep -r "catch\|error\|Error\|throw" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec" | head -30
```

**Check for:**

- Detailed error messages exposed to users
- Stack traces in production
- Database errors exposed to clients
- File paths in error messages
- API keys or secrets in error logs
- Missing error boundaries

**Action Items:**

- Use generic error messages for users
- Log detailed errors server-side only
- Sanitize error messages before sending to client
- Implement error boundaries in React
- Avoid exposing internal details in errors

## Output Format

Generate a report with:

1. **Critical Security Issues**

   - XSS vulnerabilities
   - Injection vulnerabilities
   - Authentication bypasses
   - Missing RLS policies
   - Exposed secrets

2. **High Priority Issues**

   - Weak input validation
   - Missing security headers
   - Insecure CORS configuration
   - Missing rate limiting
   - Cookie security issues

3. **Medium Priority Issues**

   - Weak password policies
   - Missing error handling
   - Outdated dependencies
   - Information disclosure
   - Missing CSRF protection

4. **Low Priority Issues**
   - Code quality improvements
   - Best practice recommendations
   - Monitoring and logging improvements

## Example Output

```markdown
## Security Audit Results

### Critical Security Issues

#### XSS Vulnerability

- **Location:** `src/app/posts/[slug]/page.tsx:32`
- **Issue:** Using `dangerouslySetInnerHTML` without sanitization
- **Risk:** High - Malicious content from CMS could execute scripts
- **Fix:** Use `sanitizeHTML()` from `@/lib/sanitize.ts` before rendering

#### Missing RLS on Tables

- **Location:** Database schema
- **Issue:** Some tables may not have RLS enabled
- **Risk:** High - Unauthorized data access
- **Fix:** Verify all tables have `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`

### High Priority Issues

#### Weak CORS Configuration

- **Location:** `src/middleware.ts:78-79`
- **Issue:** Currently uses whitelist, but verify it's restrictive enough
- **Risk:** Medium - Unauthorized cross-origin requests
- **Fix:** Ensure `ALLOWED_ORIGINS` only includes trusted domains

#### Missing Rate Limiting

- **Location:** `src/app/actions.ts` (sign-in, sign-up)
- **Issue:** No rate limiting on authentication endpoints
- **Risk:** Medium - Brute force attacks possible
- **Fix:** Implement rate limiting middleware

### Medium Priority Issues

#### Security Headers

- **Location:** `next.config.mjs:52-66`
- **Status:** ✓ Good - CSP, X-Frame-Options, and other headers configured
- **Note:** CSP includes `'unsafe-eval'` and `'unsafe-inline'` - consider
  tightening

#### Input Validation

- **Location:** `src/app/actions.ts:11-28`
- **Status:** ✓ Good - Using Zod for validation
- **Note:** Ensure all server actions validate input

### Low Priority Issues

#### Dependency Vulnerabilities

- Run `npm audit` to check for known vulnerabilities
- Update packages regularly

#### Error Messages

- **Location:** `src/app/actions.ts:165-167`
- **Status:** ✓ Good - Using generic error messages
- **Note:** Continue to avoid leaking specific error details
```

## Implementation Priority

1. **Critical Priority (Fix Immediately):**

   - XSS vulnerabilities
   - Injection vulnerabilities
   - Missing authentication on protected routes
   - Exposed secrets
   - Missing RLS policies

2. **High Priority (Fix Soon):**

   - Weak input validation
   - Missing security headers
   - Insecure CORS
   - Missing rate limiting
   - Cookie security issues

3. **Medium Priority (Fix When Possible):**

   - Weak password policies
   - Outdated dependencies
   - Information disclosure
   - Missing error handling

4. **Low Priority (Best Practices):**
   - Code quality improvements
   - Monitoring enhancements
   - Documentation updates

## Tools and Commands

### Dependency Scanning

```bash
npm audit
npm audit --production
npm outdated
```

### Security Headers Testing

```bash
# Use browser DevTools Network tab
# Or use online tools like:
# - securityheaders.com
# - observatory.mozilla.org
```

### XSS Testing

```bash
# Manual testing with payloads like:
# <script>alert('XSS')</script>
# <img src=x onerror="alert('XSS')">
# javascript:alert('XSS')
```

### Authentication Testing

- Test protected routes without authentication
- Test session expiration
- Test logout functionality
- Test password reset flow

### RLS Policy Testing

```sql
-- Test as different users
SET ROLE authenticated;
SELECT * FROM users; -- Should only see own data

SET ROLE anon;
SELECT * FROM users; -- Should be blocked by RLS
```

## Security Checklist

- [ ] All user input is validated and sanitized
- [ ] All `dangerouslySetInnerHTML` uses sanitized content
- [ ] All protected routes require authentication
- [ ] RLS is enabled on all Supabase tables
- [ ] Security headers are configured
- [ ] CORS is properly restricted
- [ ] Rate limiting is implemented on auth endpoints
- [ ] Secrets are not exposed in client code
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies are up to date
- [ ] Cookies are secure (httpOnly, secure, SameSite)
- [ ] API routes are properly secured
- [ ] Password policies are enforced server-side
- [ ] Session management is secure
