import { Section, Heading } from '@jasonrundell/dropship'
import PostPreview from '../components/post-preview'

export default function MorePosts({ items }) {
  return (
    <Section id="more-posts">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32">
        {items.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </Section>
  )
}
