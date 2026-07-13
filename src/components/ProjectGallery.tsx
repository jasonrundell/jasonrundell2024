'use client'

import { useState, useEffect, useCallback } from 'react'
import { Grid } from '@jasonrundell/dropship'
import { ContentImage } from '@/typeDefinitions/app'
import ContentImageComponent from './ContentImage'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { RevealStaggerGroup, RevealStaggerItem } from '@/styles/motion'
import { useGalleryKeyboard } from './useGalleryKeyboard'
import GalleryModal from './GalleryModal'

const imageCoverNoPointerStyle: React.CSSProperties = {
  objectFit: 'cover',
  pointerEvents: 'none',
}

const StyledGalleryItem = styled('div')`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  background-color: ${Tokens.colors.surfaceDeepest.var};
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover,
  &:focus-visible {
    transform: scale(1.02);
  }

  img {
    object-fit: cover;
    object-position: center;
  }
`

interface ProjectGalleryProps {
  images: ContentImage[]
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  const validImages = (images || []).filter((image) => image?.src)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = useCallback(() => setSelectedIndex(null), [])
  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation()
      setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : i))
    },
    []
  )
  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation()
      setSelectedIndex((i) =>
        i !== null && i < validImages.length - 1 ? i + 1 : i
      )
    },
    [validImages.length]
  )

  useGalleryKeyboard({
    selectedIndex,
    totalImages: validImages.length,
    onClose: handleClose,
    onPrev: () => handlePrev(),
    onNext: () => handleNext(),
  })

  if (!images || validImages.length === 0) return null

  const selectedImage =
    selectedIndex !== null ? validImages[selectedIndex] : null

  return (
    <>
      <RevealStaggerGroup>
        <Grid
          gridTemplateColumns="1fr"
          mediumTemplateColumns="1fr 1fr"
          largeTemplateColumns="1fr 1fr 1fr"
          columnGap="1.5rem"
          rowGap="1.5rem"
        >
          {validImages.map((image, index) => (
            <RevealStaggerItem key={image.src || index} index={index}>
              <StyledGalleryItem
                onClick={() => setSelectedIndex(index)}
                role="button"
                tabIndex={0}
                aria-label={`View ${image.alt || `Gallery image ${index + 1}`} in full screen`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedIndex(index)
                  }
                }}
              >
                <ContentImageComponent
                  src={image.src}
                  alt={
                    image.description ||
                    image.alt ||
                    `Gallery image ${index + 1}`
                  }
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={imageCoverNoPointerStyle}
                />
              </StyledGalleryItem>
            </RevealStaggerItem>
          ))}
        </Grid>
      </RevealStaggerGroup>

      {mounted && selectedIndex !== null && selectedImage?.src && (
        <GalleryModal
          selectedIndex={selectedIndex}
          totalImages={validImages.length}
          image={selectedImage}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  )
}
