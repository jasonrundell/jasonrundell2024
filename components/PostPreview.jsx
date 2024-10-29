import Link from 'next/link'
import { Spacer, Row } from '@jasonrundell/dropship'
import styled from '@emotion/styled'

import DateComponent from '../components/Date'
import PostPreviewImage from './PostPreviewImage'
import { tokens } from '../data/tokens'

export default function PostPreview({ title, image, date, excerpt, slug }) {
  const StyledImage = styled.div`
    position: relative;
    display: flex;
    margin: 0 auto;
    object-fit: cover;
    background-color: ${tokens['--background-color-3']};
    align-items: center;
    margin-bottom: ${tokens['--size-normal']};
  `

  const StyledHeading = styled.h3`
    font-size: ${tokens['--size-large']};
    line-height: 1.3;
  `

  return (
    <div>
      {image && image.file && (
        <Row>
          <StyledImage>
            <PostPreviewImage title={title} slug={slug} url={image.file.url} />
          </StyledImage>
        </Row>
      )}
      <Row>
        <StyledHeading>
          <Link href={`/posts/${slug}`}>{title}</Link>
        </StyledHeading>
      </Row>
      <Row>
        <DateComponent dateString={date} />
      </Row>
      <Row>
        <p>{excerpt}</p>
      </Row>
      <Spacer />
    </div>
  )
}
