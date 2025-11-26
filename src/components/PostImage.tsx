import ContentfulImage from './ContentfulImage'
import Link from 'next/link'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

interface PostImageProps {
  title: string
  url: string
  slug?: string
  altText: string
}

// Hero-style full-width featured image
const StyledContainer = styled('div')`
  position: relative;
  display: block;
  width: 100%;
  height: 250px;
  margin: 0;
  overflow: hidden;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  background-color: ${Tokens.colors.backgroundDarker.value};

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    height: 450px;
  }

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes
      .breakpoints.large.unit}) {
    height: 550px;
  }

  img {
    object-fit: cover;
    object-position: center;
  }
`

export default function PostImage({
  title,
  url,
  slug,
  altText,
}: PostImageProps) {
  const image = (
    <StyledContainer>
      <ContentfulImage alt={altText} src={url} fill={true} />
    </StyledContainer>
  )

  return (
    <>
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </>
  )
}
