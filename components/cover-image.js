import ContentfulImage from './contentful-image'
import Link from 'next/link'
import styled from '@emotion/styled'

export default function CoverImage({ title, url, slug }) {
  const StyledContainer = styled.div`
    position: relative;
    height: 200px;
    width: 300px;

    @media (min-width: 768px) {
      width: 300px;
    }
  `
  const image = (
    <StyledContainer>
      <ContentfulImage
        alt={`Cover Image for ${title}`}
        src={url}
        fill={true}
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 300px) 100vw, 200px"
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
