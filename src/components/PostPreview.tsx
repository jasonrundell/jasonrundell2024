import React from 'react'
import Link from 'next/link'
import { styled } from '@pigment-css/react'

import PostPreviewImage from './PostPreviewImage'
import Tokens from '@/lib/tokens'
import MetaDate from '@/components/chrome/MetaDate'

interface PostPreviewProps {
  title: string
  image?: {
    file: {
      url: string
    }
  }
  date: string
  excerpt: string
  slug: string
}

const StyledCard = styled('article')`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${Tokens.colors.surfaceSecondary.var};
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover,
  &:focus-within {
    border-color: ${Tokens.colors.accent.var};
    box-shadow: inset 3px 0 0 0 ${Tokens.colors.accent.var};
  }
`

const StyledImage = styled('div')`
  position: relative;
  display: flex;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: ${Tokens.colors.surfacePrimary.var};
  border-bottom: 1px solid ${Tokens.colors.lineSubtle.var};
`

const StyledContent = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
`

const StyledHeading = styled('h2')`
  font-family: ${Tokens.fonts.heading.var};
  font-size: 1.375rem;
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
  line-height: 1.6;
  margin: 0.25rem 0 0;
`

function PostPreview({ title, image, date, excerpt, slug }: PostPreviewProps) {
  return (
    <StyledCard>
      {image?.file?.url && (
        <StyledImage>
          <PostPreviewImage
            title={title}
            slug={slug}
            url={image.file.url}
            altText=""
          />
        </StyledImage>
      )}
      <StyledContent>
        {date ? <MetaDate dateString={date} /> : null}
        <StyledHeading>
          <Link href={`/posts/${slug}`}>{title}</Link>
        </StyledHeading>
        <StyledExcerpt>{excerpt}</StyledExcerpt>
      </StyledContent>
    </StyledCard>
  )
}

export default React.memo(PostPreview)
