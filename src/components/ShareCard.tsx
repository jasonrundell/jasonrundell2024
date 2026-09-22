import { readFile } from 'fs/promises'
import path from 'path'
import { ImageResponse } from 'next/og'

import Tokens from '@/lib/tokens'
import {
  SHARE_CARD_SIZE,
  shareCardTitleSize,
  truncateShareCardTitle,
} from '@/components/ShareCard.helpers'

const { width: WIDTH, height: HEIGHT } = SHARE_CARD_SIZE

const PAPER = Tokens.colors.surfacePrimary.value
const INK = Tokens.colors.ink.value
const INK_MUTED = Tokens.colors.inkMuted.value
const ACCENT = Tokens.colors.accent.value
const BRASS = Tokens.colors.brass.value
const LINE_SUBTLE = Tokens.colors.lineSubtle.value

/** Hairline frame rect, shared by the frame and the watermark clip. */
const FRAME = { top: 40, left: 56, width: WIDTH - 112, height: HEIGHT - 80 }

/**
 * Same faces as scripts/build-social-assets.js so a page card and the default
 * card read as one set. satori needs TTF/OTF, not the woff2 next/font serves.
 */
async function loadFonts() {
  const root = process.cwd()
  const geist = (file: string) =>
    readFile(path.join(root, 'node_modules/geist/dist/fonts/geist-sans', file))

  const [newsreader, geistRegular, geistMedium] = await Promise.all([
    readFile(path.join(root, 'design/fonts/Newsreader-SemiBold.ttf')),
    geist('Geist-Regular.ttf'),
    geist('Geist-Medium.ttf'),
  ])

  return [
    { name: 'Newsreader', data: newsreader, weight: 600 as const, style: 'normal' as const },
    { name: 'Geist', data: geistRegular, weight: 400 as const, style: 'normal' as const },
    { name: 'Geist', data: geistMedium, weight: 500 as const, style: 'normal' as const },
  ]
}

export interface ShareCardProps {
  /** Section label after the domain, e.g. `Blog` or `Projects`. */
  section: string
  title: string
  /** Footer line under the brass rule, e.g. date and author. */
  meta: string
}

/**
 * Renders the per-page Open Graph / Twitter card: the default card's frame,
 * spine and monogram watermark, with the entry title as the headline.
 */
export async function renderShareCard({ section, title, meta }: ShareCardProps) {
  const headline = truncateShareCardTitle(title)
  const fontSize = shareCardTitleSize(headline)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: WIDTH,
          height: HEIGHT,
          backgroundColor: PAPER,
          fontFamily: 'Geist',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 16,
            height: HEIGHT,
            backgroundColor: ACCENT,
          }}
        />

        <div
          style={{
            display: 'flex',
            position: 'absolute',
            ...FRAME,
            overflow: 'hidden',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',
              marginRight: 16,
              marginBottom: -84,
              fontFamily: 'Newsreader',
              fontSize: 400,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: INK,
              opacity: 0.06,
            }}
          >
            JR
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            ...FRAME,
            border: `2px solid ${LINE_SUBTLE}`,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 88px',
            width: WIDTH,
            height: HEIGHT,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: BRASS,
            }}
          >
            {`jasonrundell.com / ${section}`}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontFamily: 'Newsreader',
              fontSize,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: INK,
            }}
          >
            {headline}
          </div>

          <div
            style={{
              marginTop: 40,
              width: 128,
              height: 3,
              backgroundColor: BRASS,
            }}
          />

          <div
            style={{
              display: 'flex',
              marginTop: 26,
              fontSize: 21,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: INK_MUTED,
            }}
          >
            {meta}
          </div>
        </div>
      </div>
    ),
    { ...SHARE_CARD_SIZE, fonts: await loadFonts() }
  )
}
