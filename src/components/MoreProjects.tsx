import { Grid } from '@jasonrundell/dropship'
import ProjectPreview from './ProjectPreview'

interface MoreProjectsProps {
  items: {
    title: string
    featuredImage: {
      file: {
        url: string
      }
      altText: string
      description: string
    }
    excerpt: string
    slug: string
  }[]
}

export default function MoreProjects({ items }: MoreProjectsProps) {
  return (
    <section id="more-projects">
      <Grid
        gridTemplateColumns="1fr"
        mediumTemplateColumns="1fr 1fr"
        largeTemplateColumns="1fr 1fr 1fr"
        columnGap="2rem"
        rowGap="2rem"
      >
        {items.map((post) => (
          <ProjectPreview
            key={post.slug}
            title={post.title}
            image={post.featuredImage}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </Grid>
    </section>
  )
}
