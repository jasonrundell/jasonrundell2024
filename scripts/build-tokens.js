/**
 * Codegen: read src/lib/common.tokens.json (the canonical token source) and
 * emit two artifacts:
 *
 *   - src/styles/tokens.generated.css  -> :root with one CSS variable per token
 *   - src/lib/tokens.generated.ts      -> typed Tokens object where every leaf
 *                                         carries .value/.unit (and .family
 *                                         for fonts) plus .var = "var(--name)"
 *
 * Components import the typed object via `@/lib/tokens` (a thin re-export).
 * Pigment styled components interpolate `${Tokens.colors.X.var}` so palette
 * changes in the JSON propagate at runtime through CSS variables -- no need
 * to recompile Pigment templates to swap a hex.
 *
 * Run via `npm run tokens:build`. Both artifacts are committed; CI verifies
 * they are in sync with the JSON via `git diff --exit-code`.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const SOURCE = path.join(ROOT, 'src/lib/common.tokens.json')
const CSS_OUT = path.join(ROOT, 'src/styles/tokens.generated.css')
const TS_OUT = path.join(ROOT, 'src/lib/tokens.generated.ts')

// Collapse top-level token category names into the conventional CSS variable
// prefix. Anything not listed falls back to its kebab-case form.
const PREFIX_MAP = {
  colors: 'color',
  sizes: 'size',
  fontSizes: 'font-size',
  borderRadius: 'border-radius',
  opacity: 'opacity',
  shadows: 'shadow',
  zIndex: 'z-index',
  fonts: 'font-family',
}

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function isLeaf(node) {
  if (!node || typeof node !== 'object') return false
  return 'value' in node || 'family' in node
}

function leafCssValue(node) {
  if ('family' in node) return String(node.family)
  if ('unit' in node && node.unit && node.unit !== 'hex') {
    return `${node.value}${node.unit}`
  }
  return String(node.value)
}

function cssNameFor(pathParts) {
  const [top, ...rest] = pathParts
  const prefix = PREFIX_MAP[top] || camelToKebab(top)
  const tail = rest.map(camelToKebab)
  return [prefix, ...tail].join('-')
}

function isMetaKey(key) {
  return key.startsWith('###')
}

const source = JSON.parse(fs.readFileSync(SOURCE, 'utf8'))

// ---------- Build CSS ----------
const cssGroups = new Map()

function walkCss(node, pathParts) {
  if (isLeaf(node)) {
    const top = pathParts[0]
    const name = cssNameFor(pathParts)
    const value = leafCssValue(node)
    if (!cssGroups.has(top)) cssGroups.set(top, [])
    cssGroups.get(top).push(`  --${name}: ${value};`)
    return
  }
  for (const key of Object.keys(node)) {
    if (isMetaKey(key)) continue
    walkCss(node[key], [...pathParts, key])
  }
}

walkCss(source, [])

const cssLines = [
  '/**',
  ' * AUTO-GENERATED -- DO NOT EDIT.',
  ' * Source: src/lib/common.tokens.json',
  ' * Run `npm run tokens:build` to regenerate.',
  ' */',
  '',
  ':root {',
]
for (const [group, lines] of cssGroups) {
  cssLines.push(`  /* ${group} */`)
  cssLines.push(...lines)
  cssLines.push('')
}
if (cssLines[cssLines.length - 1] === '') cssLines.pop()
cssLines.push('}')
cssLines.push('')

fs.writeFileSync(CSS_OUT, cssLines.join('\n'))

// ---------- Build TS ----------
function buildTsTree(node, pathParts) {
  if (isLeaf(node)) {
    const cssVar = `var(--${cssNameFor(pathParts)})`
    return { ...node, var: cssVar }
  }
  const out = {}
  for (const key of Object.keys(node)) {
    if (isMetaKey(key)) continue
    out[key] = buildTsTree(node[key], [...pathParts, key])
  }
  return out
}

const tokensObj = buildTsTree(source, [])
const tsBody = JSON.stringify(tokensObj, null, 2)

const tsLines = [
  '/**',
  ' * AUTO-GENERATED -- DO NOT EDIT.',
  ' * Source: src/lib/common.tokens.json',
  ' * Run `npm run tokens:build` to regenerate.',
  ' */',
  '',
  '/* eslint-disable */',
  `const Tokens = ${tsBody} as const`,
  '',
  'export default Tokens',
  '',
]

fs.writeFileSync(TS_OUT, tsLines.join('\n'))

// eslint-disable-next-line no-console
console.log(
  `tokens generated\n  - ${path.relative(ROOT, CSS_OUT)}\n  - ${path.relative(
    ROOT,
    TS_OUT
  )}`
)
