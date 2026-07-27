import Link from 'next/link'
import { styled } from '@pigment-css/react'

import ContentImage from './ContentImage'
import ProjectPlaceholder from './ProjectPlaceholder'
import Tokens from '@/lib/tokens'

const imageCoverStyle: React.CSSProperties = {
  objectFit: 'cover',
}

interface ProjectPreviewImageProps {
  title: string
  /** Local /content/... path. When omitted, the line-art placeholder is used. */
  url?: string
  slug?: string
  altText?: string
  /** Rendered width in CSS px at the desktop breakpoint; drives `sizes`. */
  width?: number
}

/**
 * 3:2 thumbnail for a project row. Featured images are authored at 3:2 (see
 * `.claude/rules/image-optimization.mdc`) so this crops nothing in practice.
 */
const StyledContainer = styled('div')`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  background-color: ${Tokens.colors.surfacePrimary.var};
  transition: border-color 160ms ease;
`

const StyledLink = styled(Link)`
  display: block;

  &:hover [data-thumb-frame],
  &:focus-visible [data-thumb-frame] {
    border-color: ${Tokens.colors.accent.var};
  }
`

export default function ProjectPreviewImage({
  title,
  url,
  slug,
  altText,
  width = 240,
}: ProjectPreviewImageProps) {
  const image = (
    <StyledContainer data-thumb-frame>
      {url ? (
        <ContentImage
          alt={altText ?? ''}
          src={url}
          fill={true}
          style={imageCoverStyle}
          sizes={`(max-width: 768px) 100vw, ${width}px`}
        />
      ) : (
        <ProjectPlaceholder />
      )}
    </StyledContainer>
  )

  return slug ? (
    <StyledLink href={`/projects/${slug}`} aria-label={title} tabIndex={-1}>
      {image}
    </StyledLink>
  ) : (
    image
  )
}
