import ContentfulImage from './contentful-image'
import Link from 'next/link'

export default function CoverImage({ title, url, slug }) {
  const image = (
    <ContentfulImage
      width={400}
      height={400}
      alt={`Cover Image for ${title}`}
      src={url}
    />
  )

  return (
    <div style={{ position: 'relative', height: '400px', aspectRatio: '16/9' }}>
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
