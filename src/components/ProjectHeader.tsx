'use client'

import styled from '@emotion/styled'
import { Row } from '@jasonrundell/dropship'
import Link from 'next/link'
import PostImage from './PostImage'
import { tokens } from '@/data/tokens'
import { Project as ProjectDef } from '@/typeDefinitions/app'

interface ProjectHeaderProps {
  project: ProjectDef
}

const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  const Heading = styled.h2`
    font-size: ${tokens['--size-xlarge']};
    font-weight: 700;
    color: ${tokens['--secondary-color']};
    line-height: ${tokens['--size-xlarge']};
    margin-top: 0;
    margin-bottom: ${tokens['--size-xlarge']};
  `

  const StyledDescription = styled.p`
    font-size: ${tokens['--size-small']};
    text-transform: italic;
    color: ${tokens['--secondary-color']};
    width: 100%;
  `

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
