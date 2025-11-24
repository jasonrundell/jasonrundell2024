# Code Review Report
**Date:** Generated Review  
**Codebase:** jasonrundell2024  
**Reviewer:** AI Code Review (Based on AI_CODE_REVIEW_PROMPT.md)

---

## 1. Errors and Bugs

### Critical Issues

#### 1.1 XSS Vulnerability via `dangerouslySetInnerHTML`
**Location:** 
- `src/app/posts/[slug]/page.tsx:27`
- `src/app/projects/[slug]/page.tsx:32`

**Issue:** The code uses `dangerouslySetInnerHTML` to render code blocks from Contentful without sanitization. This creates an XSS vulnerability if malicious content is injected into the CMS.

```27:27:src/app/posts/[slug]/page.tsx
      <span dangerouslySetInnerHTML={{ __html: text as string }} />
```

**Fix:** Sanitize HTML content before rendering or use a safer rendering approach:
```typescript
import DOMPurify from 'isomorphic-dompurify'

[MARKS.CODE]: (text: React.ReactNode) => (
  <span dangerouslySetInnerHTML={{ 
    __html: DOMPurify.sanitize(text as string) 
  }} />
)
```

#### 1.2 Missing Error Handling in Contentful Fetch
**Location:** `src/lib/contentful.ts:78-87`

**Issue:** The `getEntry` function returns an empty object `{} as T` on error, which can cause runtime errors when components expect specific fields.

```78:87:src/lib/contentful.ts
export async function getEntry<T extends EntrySkeletonType>(
  entryId: string | number
): Promise<T> {
  try {
    const entry = await fetchEntry<T>(entryId)
    return entry.fields as unknown as T
  } catch (error) {
    console.error('Error fetching entry:', error)
    return {} as T
  }
}
```

**Fix:** Throw error or return null/undefined and handle in components:
```typescript
export async function getEntry<T extends EntrySkeletonType>(
  entryId: string | number
): Promise<T | null> {
  try {
    const entry = await fetchEntry<T>(entryId)
    return entry.fields as unknown as T
  } catch (error) {
    console.error('Error fetching entry:', error)
    throw error // Or return null and handle in components
  }
}
```

#### 1.3 Type Safety Issue in Actions
**Location:** `src/app/actions.ts:59`

**Issue:** Error object is passed directly to `encodedRedirect` which expects a string, but `error` may be an Error object.

```57:59:src/app/actions.ts
  if (error) {
    console.error('Sign up error:', error)
    return encodedRedirect('error', '/sign-up', error)
```

**Fix:** Extract error message:
```typescript
if (error) {
  console.error('Sign up error:', error)
  const errorMessage = error instanceof Error ? error.message : String(error)
  return encodedRedirect('error', '/sign-up', errorMessage)
}
```

#### 1.4 Missing Null Check in Metadata Generation
**Location:** `src/app/posts/[slug]/page.tsx:43`

**Issue:** Potential null reference when accessing nested properties without validation.

```39:45:src/app/posts/[slug]/page.tsx
  return {
    title: `Jason Rundell | Blog: ${post.title}`,
    description: SITE_DESCRIPTION,
    openGraph: {
      images: [`https://${post.featuredImage?.fields.file.fields.file.url}`],
    },
  }
```

**Fix:** Add optional chaining and fallback:
```typescript
openGraph: {
  images: post.featuredImage?.fields?.file?.fields?.file?.url 
    ? [`https://${post.featuredImage.fields.file.fields.file.url}`]
    : [],
},
```

#### 1.5 Incorrect Role Usage in Navigation
**Location:** `src/components/MainNav.tsx:181-182`

**Issue:** Using `role="menubar"` and `role="menuitem"` for navigation links is incorrect. These roles are for application menus, not site navigation.

```180:192:src/components/MainNav.tsx
        <StyledDesktopNav aria-label="Main Navigation" role="navigation">
          <StyledList aria-label="Main Menu" role="menubar">
            <StyledListItem role="menuitem">
              <StyledTitle steps={steps} speed={100} />
            </StyledListItem>
            <StyledListItem role="menuitem">
              <Link href="/#blog">Blog</Link>
            </StyledListItem>
            <StyledListItem role="menuitem">
              <Link href="/#projects">Projects</Link>
            </StyledListItem>
          </StyledList>
        </StyledDesktopNav>
```

**Fix:** Remove `role="menubar"` and `role="menuitem"`. Navigation links should use standard list semantics:
```typescript
<StyledDesktopNav aria-label="Main Navigation">
  <StyledList>
    <StyledListItem>
      <StyledTitle steps={steps} speed={100} />
    </StyledListItem>
    <StyledListItem>
      <Link href="/#blog">Blog</Link>
    </StyledListItem>
    <StyledListItem>
      <Link href="/#projects">Projects</Link>
    </StyledListItem>
  </StyledList>
</StyledDesktopNav>
```

### Moderate Issues

#### 1.6 Missing External Link Security Attributes
**Location:** `src/app/projects/[slug]/page.tsx:126`

**Issue:** External link missing `rel="noopener noreferrer"` for security.

```122:129:src/app/projects/[slug]/page.tsx
                {link && (
                  <>
                    <StyledHeading3 level={3}>View</StyledHeading3>
                    <Row>
                      <Link href={link} className="link" target="_blank">
                        Visit GitHub project
                      </Link>
                    </Row>
                  </>
                )}
```

**Fix:** Add security attributes:
```typescript
<Link href={link} className="link" target="_blank" rel="noopener noreferrer">
  Visit GitHub project
</Link>
```

#### 1.7 Potential Memory Leak in Middleware
**Location:** `src/middleware.ts:23-28`

**Issue:** The `setInterval` for cache cleanup is never cleared, which could cause issues in long-running processes.

```22:28:src/middleware.ts
// Set up periodic cleanup
if (typeof global !== 'undefined') {
  if (cacheCleanupTimer) {
    clearInterval(cacheCleanupTimer)
  }
  cacheCleanupTimer = setInterval(cleanupCache, 60000) // Clean every minute
}
```

**Fix:** This is acceptable in middleware context, but consider using a WeakMap or similar for better memory management.

---

## 2. Maintenance

### Code Organization

#### 2.1 Large Component Files
**Issue:** Some components are doing too much. Consider breaking down:
- `MainNavClient.tsx` (310 lines) - handles mobile menu, auth state, scroll effects
- `actions.ts` (341 lines) - multiple server actions in one file

**Recommendation:** Split into smaller, focused modules:
- `MainNavClient.tsx` → `MainNavClient.tsx`, `MobileMenu.tsx`, `AuthButtons.tsx`
- `actions.ts` → `auth-actions.ts`, `password-actions.ts`

#### 2.2 Inconsistent Error Handling Patterns
**Issue:** Error handling varies across the codebase:
- Some functions return empty arrays/objects on error
- Some throw errors
- Some log and continue

**Recommendation:** Establish consistent error handling strategy:
- Use Result/Either pattern or consistent error types
- Document error handling approach in codebase guidelines

#### 2.3 Magic Numbers and Hardcoded Values
**Location:** Multiple files

**Issue:** Hardcoded values scattered throughout:
- `src/middleware.ts:8` - `CLIENT_CACHE_DURATION = 30000`
- `src/middleware.ts:11` - `MAX_CACHE_AGE = 5 * 60 * 1000`
- `src/middleware.ts:177` - timeout `3000`

**Recommendation:** Move to constants file or environment variables:
```typescript
// src/lib/constants.ts
export const CACHE_DURATIONS = {
  CLIENT_CACHE: 30000,
  MAX_CACHE_AGE: 5 * 60 * 1000,
  SESSION_TIMEOUT: 3000,
} as const
```

#### 2.4 Duplicate Code in Actions
**Location:** `src/app/actions.ts`

**Issue:** Similar error handling and Supabase client creation patterns repeated.

**Recommendation:** Extract common patterns:
```typescript
async function withSupabaseClient<T>(
  callback: (client: SupabaseClient) => Promise<T>
): Promise<T> {
  const supabase = await createClient()
  return callback(supabase)
}
```

### Type Safety

#### 2.5 Loose Type Assertions
**Location:** Multiple files

**Issue:** Use of `as unknown as T` and `as string` without validation:
- `src/lib/contentful.ts:83,96,106`
- `src/app/actions.ts:86-87`

**Recommendation:** Use type guards or validation libraries like Zod:
```typescript
import { z } from 'zod'

const PostSchema = z.object({
  title: z.string(),
  content: z.any(),
  // ...
})

export async function getEntryBySlug<T>(...) {
  const entry = await fetchEntryBySlug<T>(...)
  const validated = PostSchema.parse(entry.fields)
  return validated as T
}
```

#### 2.6 Missing Type Definitions
**Issue:** Some components use `any` or lack proper types:
- `src/components/auth/form-message.tsx:4` - `Message` type could be more specific
- Custom markdown options lack proper typing

**Recommendation:** Add comprehensive type definitions for all data structures.

---

## 3. Optimization

### Performance Issues

#### 3.1 Unnecessary Re-renders in MainNavClient
**Location:** `src/components/MainNavClient.tsx:148-175`

**Issue:** Auth state listener may cause unnecessary re-renders. The component re-renders on every auth state change, even if user hasn't changed.

**Fix:** Use memoization or more granular state updates:
```typescript
const [user, setUser] = useState<User | null>(null)

useEffect(() => {
  const supabase = createClient()
  
  const getInitialSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }
  
  getInitialSession()
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      // Only update if user actually changed
      const newUser = session?.user || null
      setUser(prev => {
        if (prev?.id === newUser?.id) return prev
        return newUser
      })
    }
  )
  
  return () => subscription.unsubscribe()
}, [])
```

#### 3.2 Missing Image Optimization
**Location:** `src/app/projects/[slug]/page.tsx:68-74`

**Issue:** Using Next.js Image but with deprecated `layout="responsive"` prop.

```66:75:src/app/projects/[slug]/page.tsx
      return (
        <StyledEmbeddedAsset>
          <Image
            src={imageUrl}
            alt={description || ''}
            layout="responsive"
            width={500}
            height={300}
          />
        </StyledEmbeddedAsset>
      )
```

**Fix:** Use modern Next.js Image API:
```typescript
<Image
  src={imageUrl}
  alt={description || ''}
  width={500}
  height={300}
  style={{ width: '100%', height: 'auto' }}
/>
```

#### 3.3 Inefficient Contentful Queries
**Location:** `src/app/page.tsx:30-34`

**Issue:** Multiple sequential Contentful API calls could be parallelized.

```29:34:src/app/page.tsx
export default async function page() {
  const skills = await getSkills()
  const projects = await getProjects()
  const references = await getReferences()
  const positions = await getPositions()
  const posts = await getPosts()
```

**Fix:** Use `Promise.all`:
```typescript
const [skills, projects, references, positions, posts] = await Promise.all([
  getSkills(),
  getProjects(),
  getReferences(),
  getPositions(),
  getPosts(),
])
```

#### 3.4 Missing React.memo for Static Components
**Issue:** Components like `Footer`, `ContactList` that don't change could be memoized.

**Recommendation:** Wrap static components:
```typescript
export default React.memo(function Footer() {
  // ...
})
```

#### 3.5 Large Animation Array in MainNav
**Location:** `src/components/MainNav.tsx:84-173`

**Issue:** Large static array `steps` (90 elements) recreated on every render.

**Fix:** Move outside component:
```typescript
const NAVIGATION_STEPS = [
  'Jason Rundell',
  // ... rest of steps
] as const

export default function MainNav() {
  return (
    // ...
    <StyledTitle steps={NAVIGATION_STEPS} speed={100} />
  )
}
```

### Memory Optimization

#### 3.6 Middleware Client Caching
**Location:** `src/middleware.ts:6-8`

**Issue:** Global variable for Supabase client could cause issues in serverless environments.

**Recommendation:** Consider using request-scoped caching or remove caching if not needed:
```typescript
// Remove global cache, create fresh client per request
// Or use WeakMap with request ID
```

#### 3.7 Unused Imports and Code
**Issue:** Commented-out code and unused imports:
- `src/app/posts/[slug]/page.tsx:9,81-91,95`
- `src/app/projects/[slug]/page.tsx:10,162-172`
- `src/components/Footer.tsx:6,20-26`

**Recommendation:** Remove commented code or convert to TODOs with context.

---

## 4. Security

### Critical Security Issues

#### 4.1 XSS via dangerouslySetInnerHTML (See 1.1)
Already covered in Errors section.

#### 4.2 Environment Variable Exposure Risk
**Location:** `src/middleware.ts:138-139`, `src/utils/supabase/client.ts:5-6`

**Issue:** Using `NEXT_PUBLIC_` prefixed variables in middleware means they're exposed to client. While `NEXT_PUBLIC_SUPABASE_ANON_KEY` is meant to be public, ensure no sensitive keys are exposed.

**Recommendation:** 
- Audit all `NEXT_PUBLIC_` variables
- Ensure no secrets are in public env vars
- Use server-only env vars for sensitive operations

#### 4.3 Missing Input Validation
**Location:** `src/app/actions.ts`

**Issue:** Form data is extracted without validation:
- Email format not validated
- Password strength only checked client-side in some cases
- No rate limiting on auth endpoints

**Recommendation:** Add server-side validation:
```typescript
import { z } from 'zod'

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
})

export const signUpAction = async (formData: FormData) => {
  const rawData = {
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
  }
  
  const result = signUpSchema.safeParse(rawData)
  if (!result.success) {
    return encodedRedirect('error', '/sign-up', result.error.message)
  }
  // ... rest of logic
}
```

#### 4.4 CORS Configuration Too Permissive
**Location:** `src/middleware.ts:48-50,66-68`

**Issue:** CORS allows any origin with fallback to `*`, which is insecure.

```48:50:src/middleware.ts
    response.headers.set(
      'Access-Control-Allow-Origin',
      request.headers.get('origin') || '*'
    )
```

**Recommendation:** Whitelist specific origins:
```typescript
const ALLOWED_ORIGINS = [
  'https://jasonrundell.com',
  'https://www.jasonrundell.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean)

const origin = request.headers.get('origin')
const allowedOrigin = ALLOWED_ORIGINS.includes(origin || '') 
  ? origin 
  : null

if (allowedOrigin) {
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
}
```

#### 4.5 Missing CSRF Protection
**Issue:** Server actions don't have explicit CSRF protection (though Next.js provides some).

**Recommendation:** Ensure Next.js CSRF protection is enabled and consider additional measures for sensitive operations.

#### 4.6 Password Reset Token Handling
**Location:** `src/app/actions.ts:179`

**Issue:** Token passed via form data could be logged or exposed.

**Recommendation:** Use secure, httpOnly cookies for token exchange when possible, or ensure tokens are single-use and time-limited.

### Moderate Security Issues

#### 4.7 Error Messages May Leak Information
**Location:** `src/app/actions.ts:114-122`

**Issue:** Specific error messages could help attackers enumerate users.

```114:122:src/app/actions.ts
  if (error) {
    // Handle specific authentication errors
    let errorCode = 'auth_error'
    if (error.includes('Invalid login credentials')) {
      errorCode = 'invalid_credentials'
    } else if (error.includes('Email not confirmed')) {
      errorCode = 'email_not_confirmed'
    }

    return redirect(`/sign-in?error=${errorCode}`)
```

**Recommendation:** Use generic error messages for security:
```typescript
// Always return generic message
return redirect('/sign-in?error=auth_error')
// Log specific error server-side only
```

#### 4.8 Missing Security Headers
**Issue:** No explicit security headers configured (CSP, X-Frame-Options, etc.).

**Recommendation:** Add security headers in `next.config.mjs`:
```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; ...",
          },
        ],
      },
    ]
  },
}
```

---

## 5. Documentation

### Missing Documentation

#### 5.1 Component Documentation
**Issue:** Most components lack JSDoc comments explaining:
- Purpose and usage
- Props interface
- Examples

**Recommendation:** Add JSDoc to all exported components:
```typescript
/**
 * Main navigation component with responsive mobile menu and authentication state.
 * 
 * @example
 * ```tsx
 * <MainNav />
 * ```
 */
export default function MainNav() {
  // ...
}
```

#### 5.2 Complex Logic Documentation
**Issue:** Complex functions lack explanations:
- `src/middleware.ts:30-219` - Complex auth and caching logic
- `src/app/actions.ts` - Server action flows
- `src/lib/contentful.ts` - Contentful integration patterns

**Recommendation:** Add inline comments explaining:
- Why certain approaches were taken
- Edge cases handled
- Performance considerations

#### 5.3 Type Definition Documentation
**Issue:** Type definitions in `src/typeDefinitions/` lack descriptions.

**Recommendation:** Add TSDoc comments:
```typescript
/**
 * Represents a blog post from Contentful CMS.
 * 
 * @property {string} title - The post title
 * @property {Document} content - Rich text content from Contentful
 * @property {Asset} featuredImage - Main image for the post
 */
export interface Post {
  title: string
  content: Document
  featuredImage?: Asset
}
```

#### 5.4 Environment Variables Documentation
**Issue:** No `.env.example` or documentation of required environment variables.

**Recommendation:** Create `.env.example`:
```bash
# Contentful
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Sentry (optional)
SENTRY_DSN=your_sentry_dsn
```

#### 5.5 API Documentation
**Issue:** API routes lack documentation:
- `src/app/api/supabase-status/route.ts`
- `src/app/api/auth/callback/github/route.ts`

**Recommendation:** Add OpenAPI/Swagger documentation or at minimum JSDoc comments.

---

## 6. Accessibility (WCAG AA Compliance Audit)

### Critical Accessibility Issues

#### 6.1 Missing Skip Links
**Issue:** No "skip to main content" link for keyboard navigation.

**Recommendation:** Add skip link in `src/app/layout.tsx`:
```typescript
<body className={outfit.className}>
  <a href="#main-content" className="skip-link">
    Skip to main content
  </a>
  <SpeedInsights />
  {/* ... */}
  <main id="main-content">{children}</main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

#### 6.2 Incorrect ARIA Roles (See 1.5)
Already covered - remove `menubar`/`menuitem` roles.

#### 6.3 Missing Focus Indicators
**Location:** Multiple components

**Issue:** Some interactive elements may lack visible focus indicators. While buttons have `:focus-visible` styles, links may not.

**Recommendation:** Ensure all interactive elements have visible focus:
```css
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

#### 6.4 Missing Alt Text Validation
**Location:** `src/app/projects/[slug]/page.tsx:70`

**Issue:** Alt text falls back to empty string, which is not accessible.

```68:74:src/app/projects/[slug]/page.tsx
          <Image
            src={imageUrl}
            alt={description || ''}
            layout="responsive"
            width={500}
            height={300}
          />
```

**Fix:** Provide meaningful alt text or mark as decorative:
```typescript
<Image
  src={imageUrl}
  alt={description || 'Project image'}
  width={500}
  height={300}
/>
// Or if decorative:
<Image
  src={imageUrl}
  alt=""
  role="presentation"
  width={500}
  height={300}
/>
```

#### 6.5 Missing Form Labels
**Location:** `src/components/auth/password-input.tsx`

**Issue:** Input has placeholder but no associated label for screen readers.

```24:32:src/components/auth/password-input.tsx
      <Input
        type="password"
        name={name}
        placeholder={placeholder}
        minLength={minLength}
        required={required}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
```

**Fix:** Add proper label:
```typescript
<div className="flex flex-col gap-2">
  <label htmlFor={name} className="sr-only">
    {placeholder}
  </label>
  <Input
    id={name}
    type="password"
    name={name}
    placeholder={placeholder}
    // ...
  />
</div>
```

### Moderate Accessibility Issues

#### 6.6 Color Contrast Issues
**Location:** `src/styles/globals.css`

**Issue:** Need to verify all color combinations meet WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI components).

**Current colors:**
- Text: `#9aaec6` on `#232f3e`
- Primary: `#e9be62`
- Secondary: `#eee`

**Recommendation:** Test all combinations with tools like:
- WebAIM Contrast Checker
- axe DevTools
- Lighthouse

#### 6.7 Missing Heading Hierarchy
**Location:** `src/app/page.tsx`

**Issue:** Page uses multiple `<h2>` elements but no `<h1>`. The main heading should be `<h1>`.

```72:73:src/app/page.tsx
          <StyledSection id="skills">
            <h2>Skills</h2>
```

**Fix:** Add `<h1>` for main page title:
```typescript
<StyledSection id="home">
  <h1>Jason Rundell</h1>
  <StyledIntroParagraph>
    {/* ... */}
  </StyledIntroParagraph>
</StyledSection>
```

#### 6.8 Missing Landmark Regions
**Issue:** Some sections lack proper landmark roles or semantic HTML.

**Recommendation:** Use semantic HTML5 elements:
- `<header>` for site header (already used)
- `<main>` for main content (already used)
- `<nav>` for navigation (already used)
- `<footer>` for footer (already used)
- `<article>` for blog posts (already used)
- Consider `<aside>` for sidebars if added

#### 6.9 Mobile Menu Accessibility
**Location:** `src/components/MainNavClient.tsx:226-235`

**Issue:** Mobile menu button has good ARIA attributes, but menu itself could be improved.

**Current:**
```226:235:src/components/MainNavClient.tsx
      <StyledMobileMenuButton
        className={isMobileMenuOpen ? 'open' : ''}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
      >
```

**Recommendation:** Add `aria-controls` and ensure menu has proper ID:
```typescript
<StyledMobileMenuButton
  className={isMobileMenuOpen ? 'open' : ''}
  onClick={toggleMobileMenu}
  aria-label="Toggle mobile menu"
  aria-expanded={isMobileMenuOpen}
  aria-controls="mobile-menu"
>
  {/* ... */}
</StyledMobileMenuButton>

<StyledMobileMenu 
  id="mobile-menu"
  className={isMobileMenuOpen ? 'open' : ''}
  aria-hidden={!isMobileMenuOpen}
>
```

#### 6.10 Missing Loading States Announcements
**Location:** `src/components/MainNavClient.tsx:215-221`

**Issue:** Loading state doesn't announce to screen readers.

**Fix:** Add aria-live region:
```typescript
if (isLoading) {
  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Loading navigation
      </div>
      <StyledAuthButtonGroup>
        <div style={{ width: '120px', height: '32px' }} />
      </StyledAuthButtonGroup>
    </>
  )
}
```

#### 6.11 Form Error Messages Not Associated
**Location:** `src/components/auth/form-message.tsx`

**Issue:** Error messages may not be properly associated with form fields.

**Recommendation:** Use `aria-describedby` to link errors to inputs:
```typescript
<Input
  id="email"
  aria-describedby={error ? "email-error" : undefined}
  aria-invalid={!!error}
/>

{error && (
  <div id="email-error" role="alert" aria-live="polite">
    {error}
  </div>
)}
```

#### 6.12 Missing Language Attribute on Dynamic Content
**Issue:** If content is in languages other than English, need `lang` attributes.

**Recommendation:** Add `lang` attribute to content sections if multilingual.

### Positive Accessibility Practices Found

✅ Good use of semantic HTML (`<nav>`, `<article>`, `<header>`, `<footer>`)  
✅ ARIA labels on icon-only buttons  
✅ Keyboard navigation support in mobile menu  
✅ Focus-visible styles on buttons  
✅ Proper link attributes (`rel="noopener noreferrer"` on external links in some places)

---

## Summary and Priority Recommendations

### Immediate Actions (Critical)
1. **Fix XSS vulnerability** - Sanitize `dangerouslySetInnerHTML` content
2. **Fix incorrect ARIA roles** - Remove `menubar`/`menuitem` from navigation
3. **Add input validation** - Server-side validation for all forms
4. **Fix error handling** - Consistent error handling patterns

### High Priority
5. **Add skip links** - Improve keyboard navigation
6. **Fix heading hierarchy** - Add `<h1>` to main page
7. **Improve CORS configuration** - Whitelist specific origins
8. **Add security headers** - CSP, X-Frame-Options, etc.
9. **Parallelize Contentful queries** - Performance improvement

### Medium Priority
10. **Split large components** - Improve maintainability
11. **Add comprehensive documentation** - JSDoc, type docs, env vars
12. **Optimize re-renders** - Memoization and state management
13. **Remove commented code** - Clean up codebase
14. **Add form label associations** - Improve form accessibility

### Low Priority
15. **Extract magic numbers** - Move to constants
16. **Add loading announcements** - Screen reader improvements
17. **Verify color contrast** - WCAG AA compliance check
18. **Add .env.example** - Developer onboarding

---

## Testing Recommendations

1. **Automated Accessibility Testing**
   - Run `react-axe` in development (already configured)
   - Add Lighthouse CI to check accessibility scores
   - Use `@axe-core/react` in tests

2. **Security Testing**
   - Add OWASP ZAP or similar security scanning
   - Test for XSS vulnerabilities
   - Verify CSRF protection

3. **Performance Testing**
   - Add Web Vitals monitoring (SpeedInsights already configured)
   - Test with slow 3G connection
   - Verify image optimization

4. **Manual Testing**
   - Keyboard-only navigation
   - Screen reader testing (NVDA, JAWS, VoiceOver)
   - Color contrast verification

---

**End of Code Review Report**

