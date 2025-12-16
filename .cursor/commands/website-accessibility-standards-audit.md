# Website Accessibility Standards Audit Command

Perform a comprehensive accessibility audit of the Next.js application to ensure
WCAG 2.1 AA compliance. Identify:

1. Semantic HTML and landmark usage
2. ARIA labels and roles
3. Keyboard navigation and focus management
4. Color contrast ratios
5. Form accessibility
6. Image accessibility
7. Heading hierarchy
8. Screen reader compatibility
9. Dynamic content announcements
10. Mobile and touch accessibility

## Audit Process

### Step 1: Semantic HTML and Landmarks Audit

Review semantic HTML structure:

```bash
# Find semantic HTML elements
grep -r "<header\|<nav\|<main\|<footer\|<article\|<section\|<aside" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
grep -r "role=" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
```

**Check for:**

- Proper use of semantic HTML5 elements (`<header>`, `<nav>`, `<main>`,
  `<footer>`, `<article>`, `<section>`)
- Missing landmark regions
- Incorrect ARIA roles (e.g., using `role="menubar"` for navigation)
- Missing `lang` attribute on `<html>` element
- Proper document structure

**Action Items:**

- Use semantic HTML instead of `<div>` where appropriate
- Ensure all pages have `<main>` landmark
- Verify navigation uses `<nav>` element
- Add `lang` attribute if content is multilingual
- Remove incorrect ARIA roles when semantic HTML is sufficient

### Step 2: ARIA Labels and Roles Audit

Search for ARIA usage:

```bash
# Find ARIA attributes
grep -r "aria-" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
grep -r "ariaLabel\|aria-label" src/ --include="*.tsx" --include="*.ts" | grep -v "test"
```

**Check for:**

- Missing `aria-label` on icon-only buttons
- Missing `aria-labelledby` or `aria-describedby` where needed
- Incorrect `aria-*` attributes
- Missing `aria-expanded` on collapsible elements
- Missing `aria-controls` linking controls to controlled elements
- Missing `aria-hidden` on decorative elements
- Missing `aria-live` regions for dynamic content

**Action Items:**

- Add `aria-label` to all icon-only buttons and links
- Use `aria-labelledby` to reference visible labels
- Add `aria-describedby` to link form fields with help text/errors
- Set `aria-expanded` on toggle buttons (menus, accordions)
- Add `aria-controls` to link controls with their targets
- Set `aria-hidden="true"` on decorative icons/images
- Add `aria-live` regions for important dynamic updates

### Step 3: Keyboard Navigation and Focus Management

Review keyboard accessibility:

```bash
# Find focus-related code
grep -r "onKeyDown\|onKeyPress\|onKeyUp\|tabIndex\|focus\|blur" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
grep -r ":focus\|:focus-visible" src/ --include="*.css" | grep -v "test"
```

**Check for:**

- Missing skip links
- Missing visible focus indicators
- Keyboard traps (can't escape with Tab)
- Missing keyboard event handlers for custom controls
- Incorrect `tabIndex` usage (avoid positive values)
- Focus order matches visual order
- Focus management in modals/dialogs

**Action Items:**

- Verify skip link exists and works (already implemented ✓)
- Ensure all interactive elements have visible focus styles
- Test Tab navigation through entire page
- Add keyboard handlers (Enter, Space, Escape) to custom controls
- Ensure modals trap focus and return focus on close
- Verify focus order is logical
- Remove or fix positive `tabIndex` values

### Step 4: Color Contrast Audit

Check color contrast ratios:

```bash
# Find color definitions
grep -r "color:\|background:\|background-color:" src/ --include="*.css" --include="*.tsx" | grep -v "test"
grep -r "var(--" src/ --include="*.css" | head -20
```

**Check for:**

- Text color contrast ratios (WCAG AA: 4.5:1 for normal text, 3:1 for large
  text)
- UI component contrast (3:1 for non-text content)
- Focus indicator contrast
- Link color contrast
- Button text contrast
- Error message visibility

**Action Items:**

- Test all text/background combinations with contrast checker
- Ensure normal text meets 4.5:1 ratio
- Ensure large text (18pt+ or 14pt+ bold) meets 3:1 ratio
- Verify focus indicators are visible on all backgrounds
- Test link colors meet contrast requirements
- Ensure error messages are clearly visible

**Tools:**

- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- axe DevTools browser extension
- Lighthouse accessibility audit

### Step 5: Form Accessibility Audit

Review form accessibility:

```bash
# Find form elements
grep -r "<form\|<input\|<textarea\|<select\|<label\|FormData" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
```

**Check for:**

- Missing `<label>` elements or `aria-label` on inputs
- Labels not properly associated with inputs (`htmlFor`/`id`)
- Missing `required` attribute indication
- Missing error message association (`aria-describedby`)
- Missing `aria-invalid` on invalid fields
- Missing fieldset/legend for grouped fields
- Missing autocomplete attributes where appropriate
- Missing input type attributes

**Action Items:**

- Ensure every input has an associated label
- Use `htmlFor` on labels and matching `id` on inputs
- Visually indicate required fields and use `aria-required`
- Link error messages with `aria-describedby`
- Set `aria-invalid="true"` on invalid fields
- Use `<fieldset>` and `<legend>` for grouped inputs
- Add appropriate `autocomplete` attributes
- Use correct `type` attributes (email, tel, url, etc.)

### Step 6: Image Accessibility Audit

Review image accessibility:

```bash
# Find image usage
grep -r "<img\|<Image\|alt=" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
```

**Check for:**

- Missing `alt` attributes
- Empty `alt=""` on decorative images (should have `role="presentation"`)
- Generic alt text (e.g., "image", "photo")
- Missing alt text on informative images
- Images used as links without descriptive text
- Missing `alt` on Next.js `Image` components

**Action Items:**

- Add descriptive `alt` text to all informative images
- Use `alt=""` and `role="presentation"` for decorative images
- Ensure alt text describes the image content, not just "image"
- For images in links, ensure link text or alt text describes destination
- Verify all Next.js `Image` components have `alt` prop

### Step 7: Heading Hierarchy Audit

Review heading structure:

```bash
# Find headings
grep -r "<h1\|<h2\|<h3\|<h4\|<h5\|<h6" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
```

**Check for:**

- Missing `<h1>` on each page
- Skipped heading levels (e.g., h1 → h3)
- Multiple `<h1>` elements on same page
- Headings used for styling instead of semantic meaning
- Proper heading hierarchy (h1 → h2 → h3, etc.)

**Action Items:**

- Ensure each page has exactly one `<h1>`
- Verify heading levels are sequential (no skipping)
- Use CSS for styling, not heading levels
- Ensure headings reflect document structure
- Test with screen reader to verify hierarchy

### Step 8: Screen Reader Compatibility Audit

Test with screen readers:

```bash
# Find screen reader specific code
grep -r "sr-only\|aria-live\|aria-atomic\|screen.reader" src/ --include="*.tsx" --include="*.ts" --include="*.css" | grep -v "test"
```

**Check for:**

- Missing screen reader only text (`.sr-only` class)
- Missing `aria-live` regions for dynamic content
- Missing `aria-atomic` for live regions
- Missing announcements for state changes
- Missing descriptions for complex UI
- Missing skip links

**Action Items:**

- Use `.sr-only` class for screen reader only content
- Add `aria-live="polite"` or `aria-live="assertive"` for important updates
- Use `aria-atomic="true"` when entire region should be announced
- Announce loading states, errors, and success messages
- Provide screen reader descriptions for complex components
- Verify skip link is accessible

### Step 9: Dynamic Content and AJAX Updates

Review dynamic content accessibility:

```bash
# Find dynamic content updates
grep -r "useState\|useEffect\|setState\|innerHTML\|dangerouslySetInnerHTML" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec" | head -30
```

**Check for:**

- Missing announcements for content changes
- Missing loading state announcements
- Missing error message announcements
- Missing success message announcements
- Focus management after dynamic updates
- Missing `aria-busy` on loading elements

**Action Items:**

- Add `aria-live` regions for important updates
- Announce loading states to screen readers
- Announce errors with `role="alert"` or `aria-live="assertive"`
- Announce success messages appropriately
- Manage focus after dynamic content loads
- Use `aria-busy="true"` during async operations

### Step 10: Mobile and Touch Accessibility

Review mobile accessibility:

```bash
# Find touch-related code
grep -r "onClick\|onTouch\|touch-action\|@media" src/ --include="*.tsx" --include="*.ts" --include="*.css" | grep -v "test" | head -20
```

**Check for:**

- Touch target sizes (minimum 44x44px)
- Spacing between touch targets
- Mobile keyboard types (email, tel, url)
- Viewport meta tag
- Responsive design for small screens
- Gesture alternatives for complex interactions

**Action Items:**

- Ensure touch targets are at least 44x44px
- Add spacing between interactive elements
- Use appropriate `inputMode` for mobile keyboards
- Verify viewport meta tag is set
- Test on actual mobile devices
- Provide alternatives to complex gestures

### Step 11: Link Accessibility Audit

Review link accessibility:

```bash
# Find links
grep -r "<a\|<Link\|href=" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec" | head -30
```

**Check for:**

- Descriptive link text (not "click here", "read more")
- Links that open in new windows (should warn users)
- Missing `rel="noopener noreferrer"` on external links
- Missing indication of external links
- Missing skip links
- Empty or missing link text

**Action Items:**

- Use descriptive link text that makes sense out of context
- Add `aria-label` if link text is not descriptive
- Warn users when links open in new windows
- Add `rel="noopener noreferrer"` to external links
- Indicate external links visually and to screen readers
- Ensure all links have accessible text

### Step 12: Button and Interactive Element Audit

Review button accessibility:

```bash
# Find buttons and interactive elements
grep -r "<button\|onClick\|type=\"button\"" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec" | head -30
```

**Check for:**

- Using `<button>` instead of `<div>` or `<span>` for buttons
- Missing `type` attribute on buttons (should be "button", "submit", or "reset")
- Missing `aria-label` on icon-only buttons
- Missing `disabled` state indication
- Missing loading state indication
- Missing keyboard handlers on custom controls

**Action Items:**

- Use semantic `<button>` elements
- Set appropriate `type` attribute
- Add `aria-label` to icon-only buttons
- Ensure disabled state is communicated
- Announce loading states
- Add keyboard handlers (Enter, Space) to custom controls

## Output Format

Generate a report with:

1. **Critical Accessibility Issues (WCAG AA Failures)**

   - Missing alt text on images
   - Missing form labels
   - Color contrast failures
   - Missing keyboard navigation
   - Missing skip links

2. **High Priority Issues**

   - Incorrect ARIA usage
   - Missing ARIA labels
   - Heading hierarchy issues
   - Form error association
   - Focus management problems

3. **Medium Priority Issues**

   - Missing semantic HTML
   - Missing dynamic content announcements
   - Touch target sizes
   - Link text improvements

4. **Low Priority Issues (Enhancements)**
   - ARIA enhancements
   - Additional screen reader support
   - Enhanced keyboard shortcuts

## Example Output

````markdown
## Accessibility Audit Results

### Critical Issues (WCAG AA Failures)

#### Missing Alt Text

- **Location:** `src/app/projects/[slug]/page.tsx:70`
- **Issue:** Image has empty alt text without `role="presentation"`
- **WCAG:** 1.1.1 (Level A)
- **Fix:** Add descriptive alt text or mark as decorative:

```typescript
<Image
  src={imageUrl}
  alt={description || 'Project image'}
  width={500}
  height={300}
/>
```
````

#### Missing Form Labels

- **Location:** `src/components/auth/password-input.tsx:24`
- **Issue:** Input has placeholder but no associated label
- **WCAG:** 3.3.2 (Level A)
- **Fix:** Add proper label:

```typescript
<label htmlFor={name} className="sr-only">
  {placeholder}
</label>
<Input id={name} ... />
```

### High Priority Issues

#### Heading Hierarchy

- **Location:** `src/app/page.tsx:52`
- **Status:** ✓ Good - Has `<h1>` and proper hierarchy
- **Note:** Verify no skipped levels

#### ARIA Labels

- **Location:** Multiple components
- **Status:** ✓ Good - Most icon buttons have `aria-label`
- **Note:** Continue adding to any missing icon-only buttons

#### Focus Styles

- **Location:** `src/styles/globals.css:156-163`
- **Status:** ✓ Good - Focus styles defined for all interactive elements
- **Note:** Verify visibility on all background colors

### Medium Priority Issues

#### Dynamic Content Announcements

- **Location:** `src/components/MainNavClient.tsx`
- **Issue:** Loading state not announced to screen readers
- **Fix:** Add aria-live region:

```typescript
{
  isLoading && (
    <div aria-live="polite" className="sr-only">
      Loading navigation
    </div>
  )
}
```

#### Form Error Association

- **Location:** `src/components/auth/form-message.tsx`
- **Issue:** Error messages not linked to form fields
- **Fix:** Use `aria-describedby`:

```typescript
;<Input
  id="email"
  aria-describedby={error ? 'email-error' : undefined}
  aria-invalid={!!error}
/>
{
  error && (
    <div id="email-error" role="alert">
      {error}
    </div>
  )
}
```

### Positive Practices Found

✅ Skip link implemented (`src/app/layout.tsx:43`) ✅ Semantic HTML used
(`<header>`, `<nav>`, `<main>`, `<footer>`) ✅ ARIA labels on icon-only buttons
✅ Focus-visible styles defined ✅ Screen reader only class (`.sr-only`)
available ✅ react-axe integrated for development testing ✅ Proper link
attributes (`rel="noopener noreferrer"`) ✅ Language attribute on `<html>`
element

````

## Implementation Priority

1. **Critical Priority (WCAG AA Failures - Fix Immediately):**
   - Missing alt text on images
   - Missing form labels
   - Color contrast failures (< 4.5:1)
   - Missing keyboard navigation
   - Missing skip links

2. **High Priority (Fix Soon):**
   - Incorrect ARIA usage
   - Missing ARIA labels on icon buttons
   - Heading hierarchy issues
   - Form error association
   - Focus management in modals

3. **Medium Priority (Fix When Possible):**
   - Missing semantic HTML
   - Dynamic content announcements
   - Touch target sizes
   - Link text improvements
   - Additional ARIA attributes

4. **Low Priority (Enhancements):**
   - ARIA live region enhancements
   - Additional keyboard shortcuts
   - Enhanced screen reader support
   - Documentation improvements

## Tools and Commands

### Automated Testing
```bash
# Run react-axe in development (already integrated)
# Check browser console for accessibility violations

# Run Lighthouse accessibility audit
# Chrome DevTools > Lighthouse > Accessibility

# Use axe DevTools browser extension
# https://www.deque.com/axe/devtools/
````

### Manual Testing

```bash
# Test with keyboard only (Tab, Shift+Tab, Enter, Space, Escape)
# Test with screen reader (NVDA, JAWS, VoiceOver)
# Test with browser zoom (200%)
# Test with high contrast mode
# Test on mobile devices
```

### Color Contrast Testing

```bash
# Use WebAIM Contrast Checker
# https://webaim.org/resources/contrastchecker/

# Use axe DevTools color contrast feature
# Use browser DevTools color picker with contrast ratio
```

### Screen Reader Testing

- **Windows:** NVDA (free) or JAWS (paid)
- **macOS:** VoiceOver (built-in)
- **iOS:** VoiceOver (built-in)
- **Android:** TalkBack (built-in)

### Browser Extensions

- axe DevTools
- WAVE (Web Accessibility Evaluation Tool)
- Lighthouse (built into Chrome DevTools)
- Accessibility Insights

## WCAG 2.1 AA Checklist

### Perceivable

- [ ] All images have appropriate alt text
- [ ] Audio/video has captions/transcripts
- [ ] Color is not the only means of conveying information
- [ ] Text contrast meets 4.5:1 (normal) or 3:1 (large)
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] Content can be presented in different ways without losing meaning

### Operable

- [ ] All functionality is available via keyboard
- [ ] No keyboard traps
- [ ] Sufficient time limits (or can be adjusted/disabled)
- [ ] No content that flashes more than 3 times per second
- [ ] Skip links are provided
- [ ] Page titles are descriptive
- [ ] Focus order is logical
- [ ] Link purpose is clear from link text or context
- [ ] Multiple ways to find pages (navigation, search, sitemap)

### Understandable

- [ ] Language of page is identified (`lang` attribute)
- [ ] Language changes are identified
- [ ] Navigation is consistent
- [ ] Components with same functionality are identified consistently
- [ ] Error identification is provided
- [ ] Labels or instructions are provided for inputs
- [ ] Error suggestions are provided
- [ ] Legal/financial data can be reviewed before submission
- [ ] Help is available for input errors

### Robust

- [ ] Valid HTML
- [ ] Name, role, value of UI components is programmatically determinable
- [ ] Status messages can be presented by assistive technologies

## Testing Checklist

- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Test with browser zoom at 200%
- [ ] Test in high contrast mode
- [ ] Test on mobile devices
- [ ] Test with color blindness simulators
- [ ] Run automated tools (axe, Lighthouse, WAVE)
- [ ] Test all forms for accessibility
- [ ] Test all modals/dialogs for focus management
- [ ] Test all dynamic content updates
- [ ] Verify skip links work
- [ ] Test heading hierarchy with screen reader
- [ ] Verify all images have appropriate alt text
- [ ] Test color contrast for all text/background combinations
