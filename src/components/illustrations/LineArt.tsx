import React from 'react'
import illustrations, { type IllustrationName } from './paths.generated'

export interface LineArtProps extends React.SVGProps<SVGSVGElement> {
  /** Which approved line-art illustration to render. */
  name: IllustrationName
  /**
   * Accessible label. Omit (or pass empty) to mark the SVG decorative
   * (aria-hidden), which is the default for hero/section ornaments.
   */
  title?: string
}

/**
 * Scalable line-art illustration. Renders the vectorised, approved artwork
 * (hero / operating loop / branch) as inline SVG so it stays crisp at any size
 * and adapts to its container. Decorative by default; pass `title` to expose it
 * to assistive tech.
 */
export default function LineArt({
  name,
  title,
  style,
  ...rest
}: LineArtProps) {
  const data = illustrations[name]
  if (!data) {
    throw new Error(`LineArt: unknown illustration "${name}"`)
  }

  const [minX, minY, width, height] = data.viewBox
  const decorative = !title

  return (
    <svg
      viewBox={`${minX} ${minY} ${width} ${height}`}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', width: '100%', height: 'auto', ...style }}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {data.paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill} />
      ))}
    </svg>
  )
}

export function HeroIllustration(props: Omit<LineArtProps, 'name'>) {
  return <LineArt name="hero" {...props} />
}

export function LoopIllustration(props: Omit<LineArtProps, 'name'>) {
  return <LineArt name="loop" {...props} />
}

export function BranchIllustration(props: Omit<LineArtProps, 'name'>) {
  return <LineArt name="branch" {...props} />
}
