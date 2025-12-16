import { Grid } from '@jasonrundell/dropship'
import { GalleryImage } from '@/typeDefinitions/app'
import ContentfulImage from './ContentfulImage'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const StyledGalleryItem = styled('div')`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  background-color: ${Tokens.colors.backgroundDarker.value};
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }

  img {
    object-fit: cover;
    object-position: center;
  }
`

interface ProjectGalleryProps {
  images: GalleryImage[]
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  if (!images || images.length === 0) {
    return null
  }

  return (
    <Grid
      gridTemplateColumns="1fr"
      mediumTemplateColumns="1fr 1fr"
      largeTemplateColumns="1fr 1fr 1fr"
      columnGap="1.5rem"
      rowGap="1.5rem"
    >
      {images.map((image, index) => {
        const imageUrl = image?.fields?.file?.url
        if (!imageUrl) {
          return null
        }

        const url = imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl

        return (
          <StyledGalleryItem key={image.sys.id || index}>
            <ContentfulImage
              src={url}
              alt={
                image.fields.description ||
                image.fields.title ||
                `Gallery image ${index + 1}`
              }
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          </StyledGalleryItem>
        )
      })}
    </Grid>
  )
}
