import Image, { ImageLoaderProps } from 'next/image'
interface ContentfulImageProps {
  src: string
  width?: number
  quality?: number
  alt?: string
  fill?: boolean
  className?: string
  sizes?: string
  style?: React.CSSProperties
}

const contentfulLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

const ContentfulImage = (props: ContentfulImageProps) => {
  return <Image loader={contentfulLoader} {...props} alt={props.alt ?? ''} />
}

export default ContentfulImage
