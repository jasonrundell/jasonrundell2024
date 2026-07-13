import Link from 'next/link'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

interface ProjectPreviewProps {
  title: string
  excerpt: string
  slug: string
  createdDate: string
  technology: string[]
}

const StyledRow = styled('article')`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.75rem 0;
  border-top: 1px solid ${Tokens.colors.lineSubtle.var};
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
}: ProjectPreviewProps) {
  const year = new Date(createdDate).getUTCFullYear()
  if (Number.isNaN(year)) {
    throw new Error(
      `ProjectPreview: invalid createdDate "${createdDate}" for project "${slug}"`
    )
  }

  const href = `/projects/${slug}`

  return (
    <StyledRow>
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
    </StyledRow>
  )
}
