import ContentfulImage from './ContentfulImage'
import Link from 'next/link'
import styled from '@emotion/styled'

interface PostImageProps {
  title: string
  url: string
  slug?: string
  altText: string
}

export default function PostImage({
  title,
  url,
  slug,
  altText,
}: PostImageProps) {
  const StyledContainer = styled.div`
    position: relative;
    // 4:3 ratio
    width: 300px;
    height: 225px;

    @media (min-width: 48rem) {
      // 4:3 ratio
      width: 500px;
      height: 375px;
    }
  `

  const image = (
    <StyledContainer>
      <ContentfulImage
        alt={altText}
        src={url}
        fill={true}
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 500px) 100vw, 375px"
      />
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
