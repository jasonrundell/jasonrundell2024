# Performance Audit Command

Audit the Next.js app for bundle size, rendering cost, image loading, caching, and Core Web Vitals risks. Use `rg` searches and targeted reads before proposing changes.

## Commands

```bash
npm run build
npm run analyze
```

Expected current build noise is documented in `docs/PROJECT_INDEX.md`. Treat new failures separately from known Supabase Edge runtime and dynamic server usage warnings.

## Searches

```bash
rg "from ['\"]next/image['\"]|<img" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "'use client'|\"use client\"" src --glob "*.{ts,tsx}"
rg "next/font|@font-face" src --glob "*.{ts,tsx,css}"
rg "@next/third-parties|GoogleAnalytics|gtag|analytics|SpeedInsights|Sentry" src --glob "*.{ts,tsx}"
rg "await |Promise\\.all|fetch\\(|revalidate|cache\\(" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "useState|useEffect|useMemo|useCallback" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
```

## Review Points

- Large shared bundles, duplicated dependencies, and client components that could be server components.
- Images missing dimensions, `sizes`, useful `alt`, or priority for above-the-fold usage.
- Below-the-fold or heavy UI that should use `next/dynamic`.
- Data fetching that serializes independent work instead of using `Promise.all`.
- Cache/revalidation settings that do not match route behavior.
- Third-party scripts loaded globally when route-level loading would be enough.

## Output

Report:
- Measured command results.
- Highest-impact opportunities first.
- Files/modules affected.
- Suggested validation command for each recommendation.
