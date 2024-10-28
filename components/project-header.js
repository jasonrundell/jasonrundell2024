import styled from '@emotion/styled'
import { Row, Spacer } from '@jasonrundell/dropship'
import Link from 'next/link'
import PostImage from '../components/post-image'
import { tokens } from '../data/tokens'

export default function ProjectHeader({
  title,
  featuredImage,
  link,
  technologies,
}) {
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

  const StyledList = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-flow: row wrap;
  `

  const StyledListItem = styled.li`
    margin: 0;
    padding: 0 0.5rem 0 0;
  `

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
      <Spacer />
      <h3>Tech stack</h3>
      <Row>
        <StyledList>
          {technologies.map((tech, index) => (
            <StyledListItem key={index}>{tech}</StyledListItem>
          ))}
        </StyledList>
      </Row>
      {featuredImage?.file && (
        <Row>
          <PostImage
            title={title}
            url={featuredImage.file.url}
            altText={featuredImage.altText}
          />
          {featuredImage.description && (
            <StyledDescription>{featuredImage.description}</StyledDescription>
          )}
        </Row>
      )}
    </header>
  )
}
