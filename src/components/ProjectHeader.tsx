import { styled } from '@pigment-css/react'
import { Row } from '@jasonrundell/dropship'
import Link from 'next/link'
import PostImage from './PostImage'
import Tokens from '@/lib/tokens'
import { Project as ProjectDef } from '@/typeDefinitions/app'

interface ProjectHeaderProps {
  project: ProjectDef
}

const Heading = styled('h2')`
  font-size: ${Tokens.sizes.xlarge};
  font-weight: 700;
  color: ${Tokens.colors.secondary};
  line-height: ${Tokens.sizes.xlarge};
  margin-top: 0;
  margin-bottom: ${Tokens.sizes.xlarge};
`

const StyledDescription = styled('p')`
  font-size: ${Tokens.sizes.small};
  text-transform: italic;
  color: ${Tokens.colors.secondary};
  width: 100%;
`

const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  const { title, featuredImage, link } = project

  return (
    <header>
      <Heading>{title}</Heading>
      {link && (
        <>
          <h3>View</h3>
          <Row>
            <Link href={link} target="_blank">
              Visit GitHub project
            </Link>
          </Row>
        </>
      )}
      {featuredImage?.fields?.file && (
        <Row>
          <PostImage
            title={title}
            url={featuredImage.fields.file.fields.file.url}
            altText={featuredImage.fields.altText || ''}
          />
          {featuredImage.fields.description && (
            <StyledDescription>
              {featuredImage.fields.description}
            </StyledDescription>
          )}
        </Row>
      )}
    </header>
  )
}

export default ProjectHeader
