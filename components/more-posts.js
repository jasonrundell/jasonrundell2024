import { Section } from '@jasonrundell/dropship'
import PostPreview from '../components/post-preview'

export default function MorePosts({ items }) {
  return (
    <Section id="more-posts">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-x-16">
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
