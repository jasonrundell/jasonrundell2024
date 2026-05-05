'use client'

import { Grid } from '@jasonrundell/dropship'
import ProjectPreview from './ProjectPreview'
import { ProjectCardItem } from '@/typeDefinitions/app'
import { RevealStaggerGroup, RevealStaggerItem } from '@/styles/motion'

interface MoreProjectsProps {
  items: ProjectCardItem[]
}

export default function MoreProjects({ items }: MoreProjectsProps) {
  return (
    <section id="more-projects">
      <RevealStaggerGroup>
        <Grid
          gridTemplateColumns="1fr"
          mediumTemplateColumns="1fr 1fr"
          largeTemplateColumns="1fr 1fr 1fr"
          columnGap="2rem"
          rowGap="2rem"
        >
          {items.map((project, index) => (
            <RevealStaggerItem key={project.slug} index={index}>
              <ProjectPreview
                title={project.title}
                image={project?.featuredImage}
                slug={project.slug}
                excerpt={project.excerpt}
              />
            </RevealStaggerItem>
          ))}
        </Grid>
      </RevealStaggerGroup>
    </section>
  )
}
