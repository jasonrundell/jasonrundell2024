# Website Accessibility Standards Audit Command

Audit the Next.js app against WCAG 2.1 AA expectations for semantics, names, keyboard access, focus, contrast, forms, images, headings, and dynamic content.

## Searches

```bash
rg "<header|<nav|<main|<footer|<article|<section|<aside|role=" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "aria-|ariaLabel|aria-label" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "onKeyDown|onKeyPress|onKeyUp|tabIndex|focus|blur" src --glob "*.{ts,tsx,css}" --glob "!*.test.*" --glob "!*.spec.*"
rg "color:|background:|background-color:|var\\(--" src --glob "*.{ts,tsx,css}" --glob "!*.test.*" --glob "!*.spec.*"
rg "<form|<input|<textarea|<select|<label|FormData" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "<img|<Image|alt=" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "<h1|<h2|<h3|<h4|<h5|<h6" src --glob "*.{ts,tsx}" --glob "!*.test.*" --glob "!*.spec.*"
rg "sr-only|aria-live|aria-atomic|dangerouslySetInnerHTML" src --glob "*.{ts,tsx,css}" --glob "!*.test.*" --glob "!*.spec.*"
```

## Review Points

- Pages should have clear landmarks and a logical heading hierarchy.
- Navigation should use semantic nav/list/link patterns, not application menu roles unless the UI behaves like a menu.
- Icon-only controls need accessible names.
- Form labels, errors, and help text should be associated with inputs.
- Custom controls must support keyboard operation and visible focus.
- Images need meaningful `alt` text unless decorative.
- Dynamic status/error content should use appropriate live-region behavior.
- Color and focus contrast must meet WCAG AA.

## Output

Report:
- Findings ordered by user impact.
- File/module references.
- The affected WCAG concept.
- Suggested fix and focused test where practical.
