import Link from 'next/link'
import { styled } from '@pigment-css/react'

import ProjectPreviewImage from './ProjectPreviewImage'
import Tokens from '@/lib/tokens'
import type { ContentImage } from '@/typeDefinitions/app'

const bp = `${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes.breakpoints.medium.unit}`

interface ProjectPreviewProps {
  title: string
  excerpt: string
  slug: string
  createdDate: string
  technology: string[]
  featuredImage?: ContentImage
  /**
   * Show the 3:2 thumbnail column. Off by default so the homepage list keeps
   * its approved text-only composition; `/projects` opts in.
   */
  showThumbnail?: boolean
}

const StyledRow = styled('article')`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.75rem 0;
  border-top: 1px solid ${Tokens.colors.lineSubtle.var};

  &[data-with-thumbnail='true'] {
    gap: 1rem;

    @media (min-width: ${bp}) {
      flex-direction: row;
      align-items: flex-start;
      gap: 2rem;
    }
  }
`

const StyledThumb = styled('div')`
  width: 100%;

  @media (min-width: ${bp}) {
    flex: none;
    width: 15rem;
  }
`

const StyledCopy = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  min-width: 0;
`

const StyledMeta = styled('p')`
  font-family: ${Tokens.fonts.monospace.var};
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: ${Tokens.colors.accent.var};
  margin: 0;
`

const StyledHeading = styled('h2')`
  font-family: ${Tokens.fonts.heading.var};
  font-size: 1.5rem;
  line-height: 1.2;
  margin: 0;

  a {
    color: ${Tokens.colors.ink.var};
    text-decoration: none;
  }

  a:hover {
    color: ${Tokens.colors.accent.var};
  }
`

const StyledExcerpt = styled('p')`
  color: ${Tokens.colors.inkMuted.var};
  font-size: 1rem;
  line-height: 1.5;
  max-width: 38.75rem;
  margin: 0;
`

const StyledStack = styled('p')`
  font-family: ${Tokens.fonts.monospace.var};
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  color: ${Tokens.colors.brass.var};
  margin: 0;
`

const StyledCta = styled(Link)`
  align-self: flex-start;
  margin-top: 0.15rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: ${Tokens.colors.accent.var};
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: ${Tokens.colors.accentSoft.var};
  }
`

export default function ProjectPreview({
  title,
  slug,
  excerpt,
  createdDate,
  technology,
  featuredImage,
  showThumbnail = false,
}: ProjectPreviewProps) {
  const year = new Date(createdDate).getUTCFullYear()
  if (Number.isNaN(year)) {
    throw new Error(
      `ProjectPreview: invalid createdDate "${createdDate}" for project "${slug}"`
    )
  }

  const href = `/projects/${slug}`

  return (
    <StyledRow data-with-thumbnail={showThumbnail ? 'true' : undefined}>
      {showThumbnail && (
        <StyledThumb>
          <ProjectPreviewImage
            title={title}
            slug={slug}
            url={featuredImage?.src}
            altText={featuredImage?.alt}
          />
        </StyledThumb>
      )}
      <StyledCopy>
        <StyledMeta>{year}</StyledMeta>
        <StyledHeading>
          <Link href={href}>{title}</Link>
        </StyledHeading>
        <StyledExcerpt>{excerpt}</StyledExcerpt>
        {technology.length > 0 && (
          <StyledStack>{technology.join(' · ')}</StyledStack>
        )}
        <StyledCta href={href} aria-label={`View project: ${title}`}>
          View project &rarr;
        </StyledCta>
      </StyledCopy>
    </StyledRow>
  )
}
