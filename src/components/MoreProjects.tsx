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
          {items.map((post, index) => (
            <RevealStaggerItem key={post.slug} index={index}>
              <ProjectPreview
                title={post.title}
                image={post?.featuredImage}
                slug={post.slug}
                excerpt={post.excerpt}
              />
            </RevealStaggerItem>
          ))}
        </Grid>
      </RevealStaggerGroup>
    </section>
  )
}
