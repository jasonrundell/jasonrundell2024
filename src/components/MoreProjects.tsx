'use client'

import { styled } from '@pigment-css/react'

import ProjectPreview from './ProjectPreview'
import { ProjectCardItem } from '@/typeDefinitions/app'
import { RevealStaggerGroup, RevealStaggerItem } from '@/styles/motion'

interface MoreProjectsProps {
  items: ProjectCardItem[]
}

const StyledList = styled('div')`
  display: flex;
  flex-direction: column;
`

export default function MoreProjects({ items }: MoreProjectsProps) {
  return (
    <section id="more-projects">
      <RevealStaggerGroup>
        <StyledList>
          {items.map((project, index) => (
            <RevealStaggerItem key={project.slug} index={index}>
              <ProjectPreview
                title={project.title}
                slug={project.slug}
                excerpt={project.excerpt}
                createdDate={project.createdDate}
                technology={project.technology}
              />
            </RevealStaggerItem>
          ))}
        </StyledList>
      </RevealStaggerGroup>
    </section>
  )
}
