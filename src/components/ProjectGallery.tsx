'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Grid } from '@jasonrundell/dropship'
import { GalleryImage } from '@/typeDefinitions/app'
import ContentfulImage from './ContentfulImage'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import {
  StyledModal,
  StyledModalContent,
  StyledCloseButton,
} from '@/styles/common'

// Image style constants
const imageCoverNoPointerStyle: React.CSSProperties = {
  objectFit: 'cover',
  pointerEvents: 'none',
}

const imageContainStyle: React.CSSProperties = {
  objectFit: 'contain',
}

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

const StyledModalImage = styled('div')`
  position: relative;
  width: 100%;
  height: 80vh;
  max-width: 100%;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  }
`

const StyledNavButtonLeft = styled('button')`
  position: absolute;
  left: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  top: 50%;
  transform: translateY(-50%);
  background: ${Tokens.colors.white.value}36;
  border: none;
  color: ${Tokens.colors.primary.value};
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease-in-out;
  z-index: ${Tokens.zIndex.modalContent.value};

  &:hover {
    background: ${Tokens.colors.primaryVariant.value}E6;
  }

  &:focus-visible {
    outline: 2px solid ${Tokens.colors.primary.value}99;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: ${Tokens.opacity.low.value};
    cursor: not-allowed;
  }
`

const StyledNavButtonRight = styled('button')`
  position: absolute;
  right: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  top: 50%;
  transform: translateY(-50%);
  background: ${Tokens.colors.white.value}36;
  border: none;
  color: ${Tokens.colors.primary.value};
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease-in-out;
  z-index: ${Tokens.zIndex.modalContent.value};

  &:hover {
    background: ${Tokens.colors.primaryVariant.value}E6;
  }

  &:focus-visible {
    outline: 2px solid ${Tokens.colors.primary.value}99;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: ${Tokens.opacity.low.value};
    cursor: not-allowed;
  }
`

const StyledImageInfo = styled('div')`
  position: absolute;
  bottom: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  left: 50%;
  transform: translateX(-50%);
  background: ${Tokens.colors.surface.value}b3;
  color: ${Tokens.colors.primary.value};
  padding: ${Tokens.sizes.padding.xsmall.value}${Tokens.sizes.padding.xsmall.unit} ${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit};
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  text-align: center;
  max-width: 80%;
`

const StyledImageTitle = styled('div')`
  font-weight: 600;
  margin-bottom: ${Tokens.sizes.xsmall.value}${Tokens.sizes.xsmall.unit};
`

const StyledImageDescription = styled('div')`
  font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  opacity: ${Tokens.opacity.higher.value};
`

const StyledImageCounter = styled('div')`
  font-size: 0.75rem;
  opacity: ${Tokens.opacity.medium.value};
  margin-top: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
`

interface ProjectGalleryProps {
  images: GalleryImage[]
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Filter out images without URLs
  const validImages = (images || []).filter((image) => image?.fields?.file?.url)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null)
      } else if (e.key === 'ArrowLeft' && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1)
      } else if (
        e.key === 'ArrowRight' &&
        selectedIndex < validImages.length - 1
      ) {
        setSelectedIndex(selectedIndex + 1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedIndex, validImages.length])

  const handleImageClick = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (selectedIndex !== null && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1)
      }
    },
    [selectedIndex]
  )

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (selectedIndex !== null && selectedIndex < validImages.length - 1) {
        setSelectedIndex(selectedIndex + 1)
      }
    },
    [selectedIndex, validImages.length]
  )

  if (!images || validImages.length === 0) {
    return null
  }

  const selectedImage =
    selectedIndex !== null ? validImages[selectedIndex] : null
  const imageUrl = selectedImage?.fields?.file?.url
  const modalImageUrl = imageUrl
    ? imageUrl.startsWith('//')
      ? `https:${imageUrl}`
      : imageUrl
    : null

  return (
    <>
      <Grid
        gridTemplateColumns="1fr"
        mediumTemplateColumns="1fr 1fr"
        largeTemplateColumns="1fr 1fr 1fr"
        columnGap="1.5rem"
        rowGap="1.5rem"
      >
        {validImages.map((image, index) => {
          const imageUrl = image.fields.file.url
          const url = imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl

          return (
            <StyledGalleryItem
              key={image.sys.id || index}
              onClick={() => handleImageClick(index)}
              role="button"
              tabIndex={0}
              aria-label={`View ${
                image.fields.title || `Gallery image ${index + 1}`
              } in full screen`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleImageClick(index)
                }
              }}
            >
              <ContentfulImage
                src={url}
                alt={
                  image.fields.description ||
                  image.fields.title ||
                  `Gallery image ${index + 1}`
                }
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={imageCoverNoPointerStyle}
              />
            </StyledGalleryItem>
          )
        })}
      </Grid>

      {mounted &&
        selectedIndex !== null &&
        modalImageUrl &&
        createPortal(
          <StyledModal
            onClick={handleClose}
            aria-label="Image gallery modal"
            role="dialog"
            aria-modal="true"
          >
            <StyledModalContent onClick={(e) => e.stopPropagation()}>
              <StyledCloseButton
                onClick={handleClose}
                aria-label="Close image gallery"
              >
                <X size={24} />
              </StyledCloseButton>

              {selectedIndex > 0 && (
                <StyledNavButtonLeft
                  onClick={handlePrev}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </StyledNavButtonLeft>
              )}

              {selectedIndex < validImages.length - 1 && (
                <StyledNavButtonRight
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </StyledNavButtonRight>
              )}

              {selectedImage && (
                <>
                  <StyledModalImage>
                    <ContentfulImage
                      src={modalImageUrl || ''}
                      alt={
                        selectedImage.fields.description ||
                        selectedImage.fields.title ||
                        `Gallery image ${selectedIndex + 1}`
                      }
                      fill={true}
                      quality={90}
                      sizes="90vw"
                      style={imageContainStyle}
                    />
                  </StyledModalImage>

                  {(selectedImage.fields.title ||
                    selectedImage.fields.description) && (
                    <StyledImageInfo>
                      {selectedImage.fields.title && (
                        <StyledImageTitle>
                          {selectedImage.fields.title}
                        </StyledImageTitle>
                      )}
                      {selectedImage.fields.description && (
                        <StyledImageDescription>
                          {selectedImage.fields.description}
                        </StyledImageDescription>
                      )}
                      <StyledImageCounter>
                        {selectedIndex + 1} of {validImages.length}
                      </StyledImageCounter>
                    </StyledImageInfo>
                  )}
                </>
              )}
            </StyledModalContent>
          </StyledModal>,
          document.body
        )}
    </>
  )
}
