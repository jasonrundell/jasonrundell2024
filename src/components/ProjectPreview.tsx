import { Spacer, Row } from '@jasonrundell/dropship'
import { styled } from '@pigment-css/react'

import ProjectPreviewImage from './ProjectPreviewImage'
import Tokens from '@/lib/tokens'
import { StyledLink } from '@/styles/common'

interface ProjectPreviewProps {
  title: string
  image?: {
    file: {
      url: string
    }
  }
  excerpt: string
  slug: string
}

const StyledImage = styled('div')`
  position: relative;
  display: block;
  margin: 0 auto;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background-color: ${Tokens.colors.surfaceDeepest.var};
  margin-bottom: ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};
`

const StyledHeading = styled('h3')`
  font-size: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  line-height: 1.3;
`

export default function ProjectPreview({
  title,
  image,
  slug,
  excerpt,
}: ProjectPreviewProps) {
  return (
    <div>
      <Row>
        <StyledImage>
          <ProjectPreviewImage
            title={title}
            slug={slug}
            url={image?.file?.url}
          />
        </StyledImage>
      </Row>
      <Spacer />
      <Row>
        <StyledHeading>
          <StyledLink href={`/projects/${slug}`}>{title}</StyledLink>
        </StyledHeading>
      </Row>
      <Spacer />
      <Row>
        <p>{excerpt}</p>
      </Row>
      <Spacer />
    </div>
  )
}
