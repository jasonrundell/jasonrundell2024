'use client'

import Image from 'next/image'

interface ContentImageProps {
  src: string
  width?: number
  quality?: number
  alt?: string
  fill?: boolean
  className?: string
  sizes?: string
  style?: React.CSSProperties
}

const ContentImage = (props: ContentImageProps) => {
  return <Image {...props} alt={props.alt ?? ''} />
}

export default ContentImage
