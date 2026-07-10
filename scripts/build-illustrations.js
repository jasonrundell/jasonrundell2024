/**
 * Codegen: read the approved Pencil vector scripts in design/illustrations/*.js
 * and emit src/components/illustrations/paths.generated.ts — a typed data module
 * with { viewBox, paths: [{ fill, d }] } per illustration.
 *
 * The .js sources return an array of Pencil path nodes (each carrying a baked
 * `viewBox`, `geometry` d-string, and resolved `fill` hex). We execute each file
 * in a sandbox with a stub `pencil` object and capture that array — no manual
 * copying of the (very large) path strings.
 *
 * Run via `npm run illustrations:build`. The artifact is committed.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const SRC_DIR = path.join(ROOT, 'design/illustrations')
const OUT = path.join(ROOT, 'src/components/illustrations/paths.generated.ts')

const FILES = {
  hero: 'hero.js',
  loop: 'loop.js',
  branch: 'branch.js',
}

function loadIllustration(file) {
  const src = fs.readFileSync(path.join(SRC_DIR, file), 'utf8')
  // The Pencil script bodies end with a top-level `return P.map(...)`, which is
  // valid inside a Function body. Provide a stub `pencil`/`document`.
  // eslint-disable-next-line no-new-func
  const fn = new Function('pencil', 'document', src)
  const nodes = fn({ width: 1000, height: 800 }, {})
  if (!Array.isArray(nodes) || nodes.length === 0) {
    throw new Error(`Illustration ${file} produced no path nodes`)
  }
  const viewBox = nodes[0].viewBox
  if (!Array.isArray(viewBox) || viewBox.length !== 4) {
    throw new Error(`Illustration ${file} has an invalid viewBox`)
  }
  const paths = nodes.map((n) => {
    if (!n.geometry || !n.fill) {
      throw new Error(`Illustration ${file} has a path node missing geometry/fill`)
    }
    return { fill: n.fill, d: n.geometry }
  })
  return { viewBox, paths }
}

const out = {}
for (const [key, file] of Object.entries(FILES)) {
  out[key] = loadIllustration(file)
}

const body = JSON.stringify(out, null, 2)
const lines = [
  '/**',
  ' * AUTO-GENERATED -- DO NOT EDIT.',
  ' * Source: design/illustrations/{hero,loop,branch}.js',
  ' * Run `npm run illustrations:build` to regenerate.',
  ' */',
  '',
  'export interface IllustrationPath {',
  '  fill: string',
  '  d: string',
  '}',
  '',
  'export interface IllustrationData {',
  '  /** SVG viewBox as [minX, minY, width, height]. */',
  '  viewBox: [number, number, number, number]',
  '  paths: IllustrationPath[]',
  '}',
  '',
  "export type IllustrationName = 'hero' | 'loop' | 'branch'",
  '',
  `const illustrations: Record<IllustrationName, IllustrationData> = ${body}`,
  '',
  'export default illustrations',
  '',
]

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, lines.join('\n'))

// eslint-disable-next-line no-console
console.log(`illustrations generated\n  - ${path.relative(ROOT, OUT)}`)
