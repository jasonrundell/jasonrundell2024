# CSS Style Audit Command

Perform a comprehensive audit of CSS styles across the codebase to identify:

1. Repeated class name strings that should be extracted
2. Inline styles that should be converted to styled components or classes
3. Opportunities to hoist shared styles to common files
4. Inconsistent use of design tokens
5. Duplicate styled components that could be consolidated

## Audit Process

### Step 1: Identify Repeated Class Strings

Search for all `className` attributes and identify class strings that appear 3
or more times:

```bash
# Find all className usages
grep -r "className=" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
```

**Action Items:**

- If a class string appears 3+ times across multiple components → Extract to
  `src/styles/common.tsx` or create a shared styled component
- If a class string appears 3+ times within a single component → Extract to a
  `const` at the top of that component file
- Document all repeated class strings found

### Step 2: Check for Inline Styles

Search for inline `style` attributes:

```bash
# Find all inline style usages
grep -r "style=" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
```

**Action Items:**

- Convert inline styles to styled components using `@pigment-css/react`
- Use design tokens from `@/lib/tokens` instead of hardcoded values
- Only allow inline styles for dynamic values (e.g.,
  `style={{ transform: `translateX(${x}px)` }}`)

### Step 3: Audit Styled Components

Review all styled components for:

- Duplicate styles that could be consolidated
- Missing token usage (hardcoded values instead of tokens)
- Components that should be moved to `src/styles/common.tsx` if used across
  multiple files

**Check:**

- All styled components in component files
- Styled components in `src/styles/common.tsx`
- Verify all color, spacing, and typography values use tokens

### Step 4: Verify Token Usage

Ensure all styled components use design tokens from `@/lib/tokens`:

```bash
# Find hardcoded color values (hex, rgb, rgba)
grep -r "#[0-9a-fA-F]\{6\}" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
grep -r "rgb(" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
grep -r "rgba(" src/ --include="*.tsx" --include="*.ts" | grep -v "test" | grep -v "spec"
```

**Action Items:**

- Replace hardcoded colors with `Tokens.colors.*`
- Replace hardcoded spacing with `Tokens.sizes.*`
- Replace hardcoded font sizes with `Tokens.sizes.fonts.*`

### Step 5: Check Global CSS Classes

Review `src/styles/globals.css` for:

- Classes that are only used once (should be moved to component-level styles)
- Classes that could be replaced with styled components
- Utility classes that follow BEM naming convention

**Action Items:**

- Move single-use classes to component files
- Consider converting utility classes to styled components if they're used
  frequently
- Ensure global classes follow BEM or utility class naming conventions

### Step 6: Identify Cross-Component Reuse Opportunities

For each styled component, check if it's:

- Used in multiple files → Should be in `src/styles/common.tsx`
- Used only once → Can stay in component file
- Similar to another styled component → Consider consolidation

**Files to check:**

- `src/styles/common.tsx` - Should contain all shared styled components
- Individual component files - Should only contain component-specific styles

## Output Format

Generate a report with:

1. **Repeated Class Strings** (3+ occurrences)

   - List each repeated class string
   - Show file locations
   - Recommend extraction location

2. **Inline Styles Found**

   - List all inline styles
   - Recommend conversion to styled components
   - Identify dynamic vs static styles

3. **Token Usage Issues**

   - List hardcoded values that should use tokens
   - Show current value and recommended token

4. **Styled Component Consolidation Opportunities**

   - List duplicate or similar styled components
   - Recommend consolidation strategy

5. **Global CSS Audit**

   - List classes that should be moved to components
   - List classes that should become styled components

6. **Cross-Component Reuse Recommendations**
   - List styled components that should be moved to `src/styles/common.tsx`
   - List styled components that are only used once and could stay local

## Example Output

```markdown
## CSS Style Audit Results

### Repeated Class Strings (3+ occurrences)

- `className="link"` - Found 7 times
  - Files: src/components/ContactList.tsx (4x), src/app/page.tsx (2x),
    src/app/projects/[slug]/page.tsx (2x)
  - Recommendation: Already exists in globals.css, but consider using StyledLink
    from common.tsx instead

### Inline Styles Found

- src/components/LastSong.tsx:198 -
  `style={{ display: 'inline', marginRight: '0.5rem' }}`
  - Recommendation: Extract to styled component or use tokens for margin

### Token Usage Issues

- src/components/LastSong.tsx:53 - `border-radius: 0.3125rem;`
  - Recommendation: Use
    `Tokens.borderRadius.small.value${Tokens.borderRadius.small.unit}`

### Styled Component Consolidation

- StyledSection appears in both src/styles/common.tsx and
  src/components/LastSong.tsx
  - Recommendation: Use the one from common.tsx or consolidate if different

### Cross-Component Reuse

- StyledSection in LastSong.tsx is only used once
  - Recommendation: Keep local or move to common.tsx if pattern emerges
```

## Implementation Priority

1. **High Priority:**

   - Extract repeated class strings (3+ occurrences)
   - Replace hardcoded values with tokens
   - Convert static inline styles to styled components

2. **Medium Priority:**

   - Consolidate duplicate styled components
   - Move shared styled components to common.tsx
   - Review global CSS classes

3. **Low Priority:**
   - Refactor single-use styled components
   - Optimize styled component organization
