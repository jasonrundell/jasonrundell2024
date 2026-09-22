/** Open Graph card canvas - the size every major platform crops to. */
export const SHARE_CARD_SIZE = { width: 1200, height: 630 } as const

/**
 * Longest title the card will set before truncating. Four lines at the
 * smallest display size is the most the frame holds above the meta line.
 */
export const SHARE_CARD_TITLE_MAX = 110

/**
 * Picks a display size so short titles read as a headline and long ones still
 * fit inside the frame. Thresholds are character counts, tuned against
 * Newsreader SemiBold on the 1024px text column.
 */
export function shareCardTitleSize(title: string): number {
  const length = title.length
  if (length <= 28) return 92
  if (length <= 56) return 76
  if (length <= 84) return 64
  return 54
}

/** Cuts an over-long title at a word boundary and marks the cut. */
export function truncateShareCardTitle(
  title: string,
  max: number = SHARE_CARD_TITLE_MAX
): string {
  const trimmed = title.trim()
  if (trimmed.length <= max) return trimmed
  const cut = trimmed.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  const head = lastSpace > max / 2 ? cut.slice(0, lastSpace) : cut
  return `${head.replace(/[\s,.;:–-]+$/, '')}…`
}

/** `2026-01-02` -> `Jan 2, 2026`. UTC so the build machine's zone cannot shift the day. */
export function formatShareCardDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Share card received an invalid date: ${isoDate}`)
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/** Joins the non-empty meta fragments with the card's separator. */
export function joinShareCardMeta(parts: ReadonlyArray<string | undefined>): string {
  return parts.filter((part): part is string => Boolean(part?.trim())).join(' · ')
}
