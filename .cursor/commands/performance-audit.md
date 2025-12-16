# Performance Audit Command

Perform a comprehensive performance audit of the Next.js application to
identify:

1. Bundle size optimization opportunities
2. Image loading and optimization issues
3. Code splitting and lazy loading opportunities
4. Font loading optimization
5. Third-party script impact
6. Caching strategy effectiveness
7. API/data fetching optimization
8. React component performance issues
9. CSS performance issues
10. Core Web Vitals and Lighthouse metrics

## Audit Process

### Step 1: Bundle Size Analysis

Run bundle analyzer and review output:

```bash
# Generate bundle analysis
npm run analyze

# Or manually build with analysis
cross-env ANALYZE=true npm run build
```

**Check for:**

- Large dependencies that could be code-split
- Duplicate dependencies
- Unused code/exports
- Large third-party libraries that could be lazy-loaded
- Client components that could be server components

**Action Items:**

- Identify dependencies > 50KB
- Check for duplicate package versions
- Look for opportunities to use dynamic imports
- Consider replacing heavy libraries with lighter alternatives

### Step 2: Image Optimization Audit

Search for all image usage:

```bash
# Find all Image component usages
grep -r "from 'next/image'" src/ --include="*.tsx" --include="*.ts"
grep -r "from \"next/image\"" src/ --include="*.tsx" --include="*.ts"
grep -r "<img" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
```

**Check for:**

- Missing `priority` prop on above-the-fold images
- Missing `loading="lazy"` on below-the-fold images
- Missing `sizes` prop for responsive images
- Missing `alt` attributes
- Using `<img>` instead of Next.js `Image` component
- Images without proper width/height or fill
- Large images that should be optimized
- Missing `quality` prop on Contentful images

**Action Items:**

- Add `priority` to hero/above-the-fold images
- Add `sizes` prop for responsive images
- Replace `<img>` tags with Next.js `Image` component
- Ensure all images have proper dimensions
- Verify ContentfulImage component uses appropriate quality settings

### Step 3: Code Splitting and Lazy Loading

Identify components that should be lazy-loaded:

```bash
# Find all client components
grep -r "'use client'" src/ --include="*.tsx" --include="*.ts"
grep -r '"use client"' src/ --include="*.tsx" --include="*.ts"
```

**Check for:**

- Client components that could be server components
- Heavy components that aren't lazy-loaded
- Components below the fold that should use dynamic imports
- Modal/dialog components that should be lazy-loaded
- Third-party components that could be dynamically imported

**Action Items:**

- Convert client components to server components where possible
- Use `next/dynamic` with `loading` prop for below-the-fold components
- Lazy-load modals, dialogs, and heavy interactive components
- Consider lazy-loading third-party libraries (charts, editors, etc.)

### Step 4: Font Loading Optimization

Check font loading strategy:

```bash
# Find font imports
grep -r "next/font" src/ --include="*.tsx" --include="*.ts"
grep -r "@font-face" src/ --include="*.css"
```

**Check for:**

- Font display strategy (should use `display: 'swap'` or `'optional'`)
- Font subsetting (only loading needed character sets)
- Preloading critical fonts
- Font loading in layout vs individual pages
- Multiple font families loading unnecessarily

**Action Items:**

- Ensure fonts use `display: 'swap'` or `'optional'`
- Verify font subsets are minimal (e.g., `subsets: ['latin']`)
- Preload critical fonts in layout
- Consolidate font loading to root layout

### Step 5: Third-Party Script Audit

Identify and evaluate third-party scripts:

```bash
# Find third-party script imports
grep -r "@next/third-parties" src/ --include="*.tsx" --include="*.ts"
grep -r "GoogleAnalytics\|gtag\|analytics" src/ --include="*.tsx" --include="*.ts"
grep -r "SpeedInsights\|Sentry" src/ --include="*.tsx" --include="*.ts"
```

**Check for:**

- Scripts loaded synchronously that could be async/deferred
- Scripts loaded on all pages that are only needed on specific pages
- Heavy analytics scripts that could be lazy-loaded
- Missing `strategy` prop on third-party scripts
- Scripts that block rendering

**Action Items:**

- Use `strategy="afterInteractive"` or `"lazyOnload"` for non-critical scripts
- Load analytics scripts only where needed
- Consider using Partytown for third-party scripts
- Defer non-critical scripts

### Step 6: Data Fetching Optimization

Review data fetching patterns:

```bash
# Find data fetching functions
grep -r "await\|Promise.all\|fetch\|getServerSideProps\|getStaticProps" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
```

**Check for:**

- Sequential API calls that could be parallelized
- Missing caching headers/strategies
- Data fetching in client components that should be in server components
- Missing `revalidate` for static data
- Unnecessary data fetching on every request
- Missing error boundaries for data fetching

**Action Items:**

- Use `Promise.all` for parallel data fetching
- Add appropriate `revalidate` values for static data
- Move data fetching to server components
- Implement proper caching strategies
- Add error handling for failed requests

### Step 7: React Component Performance

Identify performance issues in React components:

```bash
# Find components that might need optimization
grep -r "useState\|useEffect\|useMemo\|useCallback" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
```

**Check for:**

- Missing `React.memo` on expensive components
- Missing `useMemo` for expensive computations
- Missing `useCallback` for event handlers passed as props
- Unnecessary re-renders
- Large component trees that could be split
- Missing key props in lists
- Inline function definitions in render

**Action Items:**

- Add `React.memo` to components that receive stable props
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed to child components
- Ensure all list items have unique, stable keys
- Avoid inline object/function creation in render

### Step 8: CSS Performance Audit

Review CSS loading and performance:

```bash
# Find CSS imports
grep -r "import.*\.css" src/ --include="*.tsx" --include="*.ts"
grep -r "styled\|@pigment-css" src/ --include="*.tsx" --include="*.ts"
```

**Check for:**

- Large CSS files that could be split
- Unused CSS
- Critical CSS not inlined
- CSS-in-JS runtime overhead
- Missing CSS minification
- Blocking CSS resources

**Action Items:**

- Extract critical CSS for above-the-fold content
- Remove unused CSS
- Ensure CSS is minified in production
- Consider CSS extraction for large styled component files

### Step 9: Caching Strategy Review

Review caching implementation:

```bash
# Find caching-related code
grep -r "cache\|revalidate\|headers" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
grep -r "middleware" src/ --include="*.ts" | grep -v "test"
```

**Check for:**

- Missing `revalidate` on static pages
- Missing cache headers in API routes
- Inefficient cache invalidation
- Missing ISR (Incremental Static Regeneration) where appropriate
- Browser caching headers in middleware

**Action Items:**

- Add appropriate `revalidate` values
- Implement proper cache headers
- Use ISR for content that updates periodically
- Review middleware caching strategy

### Step 10: Core Web Vitals and Lighthouse

Run Lighthouse audit:

```bash
# Build production version
npm run build

# Start production server
npm start

# Run Lighthouse (requires Chrome and lighthouse CLI)
# npx lighthouse http://localhost:3000 --view
```

**Metrics to check:**

- **LCP (Largest Contentful Paint)** - Should be < 2.5s
- **FID (First Input Delay)** - Should be < 100ms
- **CLS (Cumulative Layout Shift)** - Should be < 0.1
- **FCP (First Contentful Paint)** - Should be < 1.8s
- **TTI (Time to Interactive)** - Should be < 3.8s
- **TBT (Total Blocking Time)** - Should be < 200ms

**Action Items:**

- Optimize LCP: prioritize hero images, preload critical resources
- Reduce FID: minimize JavaScript execution time, code-split
- Minimize CLS: set image dimensions, avoid dynamic content insertion
- Improve FCP: inline critical CSS, reduce render-blocking resources
- Optimize TTI: reduce JavaScript, use code splitting
- Reduce TBT: break up long tasks, defer non-critical JavaScript

## Output Format

Generate a report with:

1. **Bundle Size Analysis**

   - Largest dependencies (> 50KB)
   - Duplicate dependencies found
   - Opportunities for code splitting
   - Recommendations for optimization

2. **Image Optimization Issues**

   - Missing priority flags
   - Missing sizes attributes
   - Using `<img>` instead of `Image`
   - Unoptimized images
   - Missing alt attributes

3. **Code Splitting Opportunities**

   - Client components that could be server components
   - Components that should be lazy-loaded
   - Heavy dependencies that should be dynamically imported

4. **Font Loading Issues**

   - Font display strategy
   - Font subsetting opportunities
   - Preloading recommendations

5. **Third-Party Script Impact**

   - Scripts blocking rendering
   - Scripts that should be deferred
   - Analytics optimization opportunities

6. **Data Fetching Optimization**

   - Sequential calls that should be parallel
   - Missing caching strategies
   - Server vs client component data fetching

7. **React Performance Issues**

   - Missing memoization
   - Unnecessary re-renders
   - Expensive computations not memoized

8. **CSS Performance**

   - Large CSS files
   - Unused CSS
   - Critical CSS opportunities

9. **Caching Strategy**

   - Missing revalidate values
   - Cache header recommendations
   - ISR opportunities

10. **Core Web Vitals Scores**
    - Current scores vs targets
    - Specific recommendations for each metric

## Example Output

```markdown
## Performance Audit Results

### Bundle Size Analysis

- **Large Dependencies:**
  - `@sentry/nextjs`: 245KB (consider lazy-loading error tracking)
  - `contentful`: 180KB (only used server-side, verify tree-shaking)
- **Code Splitting Opportunities:**
  - `LastSong` component (253 lines) - Consider lazy-loading as it's below the
    fold
  - `ProjectGallery` component - Should be lazy-loaded on project pages

### Image Optimization Issues

- `src/app/page.tsx:54` - Hero image has `priority` ✓ (good)
- `src/components/PostImage.tsx` - Missing `sizes` prop for responsive images
- `src/app/projects/[slug]/page.tsx` - Using deprecated `layout="responsive"`
  prop

### Code Splitting Opportunities

- `src/components/LastSong.tsx` - Client component, consider lazy-loading
- `src/components/ProjectGallery.tsx` - Should use `next/dynamic` with loading
  state

### Font Loading

- `src/app/layout.tsx:28` - Using `Outfit` font with `subsets: ['latin']` ✓
  (good)
- Consider adding `display: 'swap'` to font configuration

### Third-Party Scripts

- `src/app/layout.tsx:47` - GoogleAnalytics loaded on all pages ✓
- `src/app/layout.tsx:46` - SpeedInsights loaded correctly ✓

### Data Fetching

- `src/app/page.tsx:40` - Using `Promise.all` for parallel fetching ✓ (good)
- Consider adding `revalidate` to static pages for ISR

### React Performance

- `src/components/ContactList.tsx` - Static component, consider `React.memo`
- `src/components/LastSong.tsx:198` - Inline style object created on each render

### Core Web Vitals (Lighthouse)

- **LCP**: 2.1s (Target: < 2.5s) ✓
- **FID**: 85ms (Target: < 100ms) ✓
- **CLS**: 0.05 (Target: < 0.1) ✓
- **FCP**: 1.5s (Target: < 1.8s) ✓
- **TBT**: 180ms (Target: < 200ms) ✓
```

## Implementation Priority

1. **High Priority:**

   - Fix image optimization issues (missing priority, sizes)
   - Add lazy loading for below-the-fold components
   - Optimize bundle size (code-split large dependencies)
   - Fix Core Web Vitals issues

2. **Medium Priority:**

   - Add React.memo to expensive components
   - Implement proper caching strategies
   - Optimize third-party script loading
   - Add missing revalidate values

3. **Low Priority:**
   - Font loading optimizations
   - CSS performance improvements
   - Minor React performance optimizations

## Tools and Commands

### Bundle Analysis

```bash
npm run analyze
```

### Lighthouse CLI

```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

### Next.js Build Analysis

```bash
npm run build
# Review .next/analyze/ directory for bundle reports
```

### Performance Monitoring

- Vercel Speed Insights (already integrated)
- Chrome DevTools Performance tab
- WebPageTest for real-world performance
- Lighthouse CI for continuous monitoring
