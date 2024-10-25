import Link from 'next/link'
import { Spacer, Paragraph, Row } from '@jasonrundell/dropship'
import styled from '@emotion/styled'

import DateComponent from '../components/date'
import PreviewImage from './preview-image'
import { tokens } from '../data/tokens'

export default function PostPreview({ title, image, date, excerpt, slug }) {
  const StyledImage = styled.div`
    position: relative;
    display: flex;
    margin: 0 auto;
    height: 208px;
    width: auto;
    object-fit: cover;
    background-color: ${tokens['--background-color-3']};
    align-items: center;
  `

  const StyledHeading = styled.h4`
    font-size: ${tokens['--size-large']};
    line-height: 1.3;
  `

  return (
    <div>
      {image && image.file && (
        <Row className="mb-5">
          <StyledImage>
            <PreviewImage title={title} slug={slug} url={image.file.url} />
          </StyledImage>
        </Row>
      )}
      <Spacer />
      <Row>
        <StyledHeading>
          <Link href={`/posts/${slug}`}>{title}</Link>
        </StyledHeading>
      </Row>
      <Spacer />
      <Row>
        <DateComponent dateString={date} />
      </Row>
      <Row>
        <Paragraph>{excerpt}</Paragraph>
      </Row>
      <Spacer />
    </div>
  )
}
