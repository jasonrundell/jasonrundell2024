import Image from 'next/image'

export interface ContentfulImageProps {
  src: string
  width: number
  quality?: number
  alt?: string
}

const contentfulLoader = ({ src, width, quality }: ContentfulImageProps) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

const ContentfulImage = (props: ContentfulImageProps) => {
  return <Image loader={contentfulLoader} {...props} alt={props.alt ?? ''} />
}

export default ContentfulImage
