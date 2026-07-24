# CSS Style Audit Command

Audit styling for duplicated class strings, inline styles, token drift, and shared-style opportunities. Use `rg` for searches and exclude tests unless the test code is the audit target.

## Searches

```bash
rg "className=" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "style=" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "styled\\(|@pigment-css" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "#[0-9a-fA-F]{6}|rgb\\(|rgba\\(" src --glob "*.{ts,tsx,css}" --glob "!*.test.*" --glob "!*.spec.*"
rg "Tokens\\." src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
```

## Review Points

- Extract class strings or style combinations repeated three or more times.
- For cross-component reuse, move shared styles to `src/styles/common.tsx` or an equivalent shared style module.
- For component-local reuse, define a local constant near the top of the file.
- Prefer `@pigment-css/react` and `@/lib/tokens` over inline static styles or hardcoded values.
- Allow inline styles only for dynamic runtime values such as transforms or dimensions.

## Output

Report:
- Repeated class/style strings and recommended extraction point.
- Inline styles and whether each is static or dynamic.
- Hardcoded colors, spacing, typography, or radius values that should use tokens.
- Shared styled components that belong in `src/styles/common.tsx`.
- Single-use global/shared styles that should move closer to their component.
