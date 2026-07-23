/**
 * Codegen: render the brand assets that only exist as pixels.
 *
 *   public/images/og-default.png       1200x630 Open Graph / Twitter card,
 *                                      used by every page that does not
 *                                      supply its own image.
 *   public/favicon/maskable-512.png    512x512 Android maskable icon - the
 *                                      monogram inset into the safe zone so
 *                                      launchers can crop it to any shape.
 *
 * The card goes through the same satori + resvg pipeline Next.js ships for
 * `next/og`, driven here from plain Node so the result is a static file with
 * no runtime cost. Type is set in the site's own faces (Newsreader for the
 * display line, Geist for everything else) and every colour is read from
 * src/lib/common.tokens.json, so the assets cannot drift from the design
 * tokens.
 *
 * Run via `npm run social:build`. The artifacts are committed.
 */

const fs = require('fs')
const path = require('path')
const React = require('react')
const sharp = require('sharp')
const {
  ImageResponse,
} = require('next/dist/compiled/@vercel/og/index.node.js')

const ROOT = path.join(__dirname, '..')
const TOKENS = require(path.join(ROOT, 'src/lib/common.tokens.json'))
const OG_OUT = path.join(ROOT, 'public/images/og-default.png')
const MASKABLE_SRC = path.join(ROOT, 'public/favicon/favicon-512x512.png')
const MASKABLE_OUT = path.join(ROOT, 'public/favicon/maskable-512.png')

const WIDTH = 1200
const HEIGHT = 630

/**
 * Android crops maskable icons to an arbitrary shape and only guarantees the
 * centre 80% survives. The source monogram fills its whole canvas, so scale it
 * down into that safe circle and pad the rest with the brand paper colour.
 */
const MASKABLE_SIZE = 512
const MASKABLE_SAFE_RATIO = 0.6

/** Pull a hex value out of the DTCG token file, failing loudly if it moved. */
function color(name) {
  const token = TOKENS.colors[name]
  if (!token || !token.value) {
    throw new Error(`Missing colour token: ${name}`)
  }
  return token.value
}

const PAPER = color('surfacePrimary')
const INK = color('ink')
const INK_MUTED = color('inkMuted')
const ACCENT = color('accent')
const BRASS = color('brass')
const LINE_SUBTLE = color('lineSubtle')

const FONTS = [
  {
    name: 'Newsreader',
    weight: 600,
    style: 'normal',
    data: fs.readFileSync(path.join(ROOT, 'design/fonts/Newsreader-SemiBold.ttf')),
  },
  {
    name: 'Geist',
    weight: 400,
    style: 'normal',
    data: fs.readFileSync(
      path.join(ROOT, 'node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf')
    ),
  },
  {
    name: 'Geist',
    weight: 500,
    style: 'normal',
    data: fs.readFileSync(
      path.join(ROOT, 'node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf')
    ),
  },
]

const h = React.createElement

/** satori needs an explicit display on every element that has children. */
const box = (key, style, children) =>
  h('div', { key, style: { display: 'flex', ...style } }, children)

/** The hairline frame rect, shared by the frame itself and the watermark clip. */
const FRAME = {
  top: 40,
  left: 56,
  width: WIDTH - 112,
  height: HEIGHT - 80,
}

const card = box(
  'card',
  {
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: PAPER,
    fontFamily: 'Geist',
    position: 'relative',
  },
  [
    // Accent spine down the left edge - the same device the site uses to mark
    // a section band.
    h('div', {
      key: 'spine',
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 16,
        height: HEIGHT,
        backgroundColor: ACCENT,
      },
    }),

    // Oversized monogram watermark, echoing the favicon. Clipped to the
    // hairline frame so it reads as a printed watermark rather than a bleed.
    box(
      'watermark',
      {
        position: 'absolute',
        top: FRAME.top,
        left: FRAME.left,
        width: FRAME.width,
        height: FRAME.height,
        overflow: 'hidden',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      },
      h(
        'div',
        {
          key: 'monogram',
          style: {
            display: 'flex',
            marginRight: 16,
            marginBottom: -84,
            fontFamily: 'Newsreader',
            fontSize: 400,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: INK,
            opacity: 0.06,
          },
        },
        'JR'
      )
    ),

    // Hairline frame.
    h('div', {
      key: 'frame',
      style: {
        position: 'absolute',
        top: FRAME.top,
        left: FRAME.left,
        width: FRAME.width,
        height: FRAME.height,
        border: `2px solid ${LINE_SUBTLE}`,
      },
    }),

    box(
      'copy',
      {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 88px',
        width: WIDTH,
        height: HEIGHT,
      },
      [
        h(
          'div',
          {
            key: 'eyebrow',
            style: {
              display: 'flex',
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: BRASS,
            },
          },
          'jasonrundell.com'
        ),

        h(
          'div',
          {
            key: 'name',
            style: {
              display: 'flex',
              marginTop: 28,
              fontFamily: 'Newsreader',
              fontSize: 108,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: INK,
            },
          },
          'Jason Rundell'
        ),

        h(
          'div',
          {
            key: 'role',
            style: {
              display: 'flex',
              marginTop: 24,
              fontFamily: 'Newsreader',
              fontSize: 46,
              lineHeight: 1.15,
              color: ACCENT,
            },
          },
          'Engineering leader & player-coach'
        ),

        h('div', {
          key: 'rule',
          style: {
            marginTop: 44,
            width: 128,
            height: 3,
            backgroundColor: BRASS,
          },
        }),

        h(
          'div',
          {
            key: 'foot',
            style: {
              display: 'flex',
              marginTop: 26,
              fontSize: 21,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: INK_MUTED,
            },
          },
          '25+ years in full-stack web development'
        ),
      ]
    ),
  ]
)

async function buildOgCard() {
  const response = new ImageResponse(card, {
    width: WIDTH,
    height: HEIGHT,
    fonts: FONTS,
  })

  const png = Buffer.from(await response.arrayBuffer())

  fs.mkdirSync(path.dirname(OG_OUT), { recursive: true })
  fs.writeFileSync(OG_OUT, png)

  report(OG_OUT, `${WIDTH}x${HEIGHT}`, png.length)
}

async function buildMaskableIcon() {
  const inner = Math.round(MASKABLE_SIZE * MASKABLE_SAFE_RATIO)
  const pad = Math.round((MASKABLE_SIZE - inner) / 2)

  const mark = await sharp(MASKABLE_SRC)
    .resize(inner, inner, { fit: 'contain', background: PAPER })
    .toBuffer()

  const png = await sharp({
    create: {
      width: MASKABLE_SIZE,
      height: MASKABLE_SIZE,
      channels: 4,
      background: PAPER,
    },
  })
    .composite([{ input: mark, top: pad, left: pad }])
    .png({ compressionLevel: 9 })
    .toBuffer()

  fs.mkdirSync(path.dirname(MASKABLE_OUT), { recursive: true })
  fs.writeFileSync(MASKABLE_OUT, png)

  report(MASKABLE_OUT, `${MASKABLE_SIZE}x${MASKABLE_SIZE}`, png.length)
}

function report(file, dimensions, bytes) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  console.log(
    `social:build - wrote ${rel} (${dimensions}, ${(bytes / 1024).toFixed(
      1
    )} kB)`
  )
}

async function main() {
  await buildOgCard()
  await buildMaskableIcon()
}

main().catch((err) => {
  console.error('social:build failed:', err)
  process.exit(1)
})
